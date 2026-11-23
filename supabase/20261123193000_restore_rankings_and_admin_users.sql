-- Restore profile provisioning and the existing leaderboard and admin RPCs.
-- Apply to the project after profiles and user_progress are present.
begin;

alter table public.profiles enable row level security;
revoke all on table public.profiles from public, anon;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, user_id, full_name, avatar_url, total_xp, rating_tier)
  values (
    new.id,
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''), nullif(btrim(new.raw_user_meta_data ->> 'name'), ''), 'Learner'),
    coalesce(nullif(new.raw_user_meta_data ->> 'avatar_url', ''), nullif(new.raw_user_meta_data ->> 'picture', '')),
    0,
    'Bronze'
  )
  on conflict do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user_profile() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user_profile();

create or replace function public.set_profile_rating_tier()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.rating_tier := case
    when new.total_xp >= 2500 then 'Gold'
    when new.total_xp >= 1000 then 'Silver'
    else 'Bronze'
  end;
  return new;
end;
$$;

drop trigger if exists profiles_set_rating_tier on public.profiles;
create trigger profiles_set_rating_tier
before insert or update of total_xp on public.profiles
for each row execute function public.set_profile_rating_tier();

-- Existing profiles, including balances and XP, are preserved. Import legacy XP
-- only when creating the missing profile.
insert into public.profiles (id, user_id, full_name, avatar_url, total_xp, rating_tier)
select
  account.id,
  account.id,
  coalesce(
    nullif(btrim(account.raw_user_meta_data ->> 'full_name'), ''),
    nullif(btrim(account.raw_user_meta_data ->> 'name'), ''),
    'Learner'
  ),
  coalesce(nullif(account.raw_user_meta_data ->> 'avatar_url', ''), nullif(account.raw_user_meta_data ->> 'picture', '')),
  greatest(coalesce(progress.xp, 0), 0),
  case when progress.xp >= 2500 then 'Gold' when progress.xp >= 1000 then 'Silver' else 'Bronze' end
from auth.users as account
left join public.user_progress as progress on progress.user_id = account.id
where not exists (select 1 from public.profiles as profile where profile.user_id = account.id)
on conflict do nothing;

-- Expose only fields needed by the signed-in Top Players view.
-- The profiles table itself remains private under its per-user RLS policy.
-- Run after schema.sql or profiles-xp.sql.
create or replace function public.get_top_profiles(p_limit integer default 50)
returns table (
  user_id uuid,
  display_name text,
  avatar_url text,
  total_xp integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    profile.user_id,
    profile.full_name as display_name,
    profile.avatar_url,
    profile.total_xp
  from public.profiles as profile
  where auth.uid() is not null
  order by profile.total_xp desc, profile.user_id asc
  limit greatest(1, least(coalesce(p_limit, 50), 50));
$$;

revoke all on function public.get_top_profiles(integer) from public, anon;
grant execute on function public.get_top_profiles(integer) to authenticated;

-- Add editable balance fields and admin-only profile list/update RPCs.
-- Assign app_metadata.role = 'admin' only to the configured owner account.
-- Profiles remain private under their existing per-user RLS policy.
alter table public.profiles
  add column if not exists gold integer not null default 0,
  add column if not exists gems integer not null default 0;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_gold_nonnegative' and conrelid = 'public.profiles'::regclass) then
    alter table public.profiles add constraint profiles_gold_nonnegative check (gold >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_gems_nonnegative' and conrelid = 'public.profiles'::regclass) then
    alter table public.profiles add constraint profiles_gems_nonnegative check (gems >= 0);
  end if;
end;
$$;

create or replace function public.get_admin_users()
returns table (
  id uuid,
  name text,
  email text,
  avatar_url text,
  league text,
  total_xp integer,
  gold integer,
  gems integer
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  return query
    select
      profile.id,
      coalesce(nullif(profile.full_name, ''), 'Learner'),
      account.email::text,
      profile.avatar_url,
      coalesce(nullif(profile.rating_tier, ''), profile.rank_title, 'Bronze'),
      profile.total_xp,
      profile.gold,
      profile.gems
    from public.profiles as profile
    left join auth.users as account on account.id = profile.user_id
    order by account.created_at desc nulls last, profile.id asc;
end;
$$;

create or replace function public.update_admin_user_balance(
  p_profile_id uuid,
  p_total_xp integer,
  p_gold integer,
  p_gems integer
)
returns table (
  id uuid,
  total_xp integer,
  gold integer,
  gems integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_profile public.profiles%rowtype;
begin
  if auth.uid() is null or coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  if p_profile_id is null or p_total_xp is null or p_gold is null or p_gems is null
    or p_total_xp < 0 or p_gold < 0 or p_gems < 0 then
    raise exception 'Balances must be non-negative integers' using errcode = '22023';
  end if;

  update public.profiles as profile
  set total_xp = p_total_xp,
      gold = p_gold,
      gems = p_gems,
      updated_at = now()
  where profile.id = p_profile_id
  returning profile.* into updated_profile;

  if not found then
    raise exception 'Profile not found' using errcode = 'P0002';
  end if;

  return query select updated_profile.id, updated_profile.total_xp, updated_profile.gold, updated_profile.gems;
end;
$$;

revoke all on function public.get_admin_users() from public, anon;
revoke all on function public.update_admin_user_balance(uuid, integer, integer, integer) from public, anon;
grant execute on function public.get_admin_users() to authenticated;
grant execute on function public.update_admin_user_balance(uuid, integer, integer, integer) to authenticated;

-- Secure aggregate metrics for the Admin dashboard.
-- Assign app_metadata.role = 'admin' to the configured owner account using the
-- Supabase Dashboard/Auth Admin API before enabling the dashboard stats RPC.
-- The profiles table remains private under its existing per-user RLS policy.
create or replace function public.get_admin_dashboard_stats()
returns table (
  total_users bigint,
  average_xp integer
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  return query
    select
      count(*)::bigint,
      coalesce(round(avg(profile.total_xp))::integer, 0)
    from public.profiles as profile;
end;
$$;

revoke all on function public.get_admin_dashboard_stats() from public, anon;
grant execute on function public.get_admin_dashboard_stats() to authenticated;

create or replace function public.sync_profile_xp_floor(p_user_id uuid, p_total_xp integer)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  synced_total integer;
begin
  if auth.uid() is null or auth.uid() is distinct from p_user_id then
    raise exception 'Not authorized to update this profile' using errcode = '42501';
  end if;
  if p_total_xp is null or p_total_xp < 0 then
    raise exception 'XP total must be zero or greater' using errcode = '22023';
  end if;

  insert into public.profiles (id, user_id, full_name, total_xp)
  values (p_user_id, p_user_id, 'Learner', p_total_xp)
  on conflict (user_id) do update set
    total_xp = greatest(public.profiles.total_xp, excluded.total_xp),
    updated_at = now()
  returning total_xp into synced_total;

  return synced_total;
end;
$$;

revoke all on function public.sync_profile_xp_floor(uuid, integer) from public, anon;

grant execute on function public.sync_profile_xp_floor(uuid, integer) to authenticated;

-- Centralized, per-user XP awards with a two-per-task daily limit.
-- Run this migration in the Supabase SQL Editor after the profile XP schema.

create table if not exists public.xp_awards (
  id bigint generated by default as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  task_type text not null,
  award_date date not null default current_date,
  amount integer not null check (amount > 0),
  created_at timestamptz not null default now()
);

create index if not exists xp_awards_user_task_date_idx
  on public.xp_awards (user_id, task_type, award_date);

alter table public.xp_awards enable row level security;
revoke all on table public.xp_awards from public, anon, authenticated;

create or replace function public.award_profile_xp(
  p_user_id uuid,
  p_amount integer,
  p_task_type text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_total integer;
  awards_today integer;
  normalized_task text;
begin
  if auth.uid() is null or auth.uid() is distinct from p_user_id then
    raise exception 'Not authorized to update this profile' using errcode = '42501';
  end if;
  if p_amount is null or p_amount < 1 or p_amount > 10000 then
    raise exception 'XP amount must be between 1 and 10000' using errcode = '22023';
  end if;
  normalized_task := btrim(coalesce(p_task_type, ''));
  if normalized_task = '' or length(normalized_task) > 160 then
    raise exception 'A task type of 1 to 160 characters is required' using errcode = '22023';
  end if;

  -- Serialize identical task awards to avoid two concurrent requests bypassing the cap.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_user_id::text || ':' || normalized_task || ':' || current_date::text, 0)
  );

  select count(*)::integer into awards_today
  from public.xp_awards
  where user_id = p_user_id
    and task_type = normalized_task
    and award_date = current_date;

  if awards_today >= 2 then
    select total_xp into new_total from public.profiles where user_id = p_user_id;
    return pg_catalog.jsonb_build_object(
      'awarded', 0,
      'total_xp', coalesce(new_total, 0),
      'limit_reached', true
    );
  end if;

  insert into public.xp_awards (user_id, task_type, award_date, amount)
  values (p_user_id, normalized_task, current_date, p_amount);

  insert into public.profiles (id, user_id, full_name, total_xp)
  values (p_user_id, p_user_id, 'Learner', p_amount)
  on conflict (user_id) do update set
    total_xp = public.profiles.total_xp + excluded.total_xp,
    updated_at = now()
  returning total_xp into new_total;

  return pg_catalog.jsonb_build_object(
    'awarded', p_amount,
    'total_xp', new_total,
    'limit_reached', false
  );
end;
$$;

revoke all on function public.award_profile_xp(uuid, integer, text) from public, anon;
grant execute on function public.award_profile_xp(uuid, integer, text) to authenticated;

notify pgrst, 'reload schema';
commit;
