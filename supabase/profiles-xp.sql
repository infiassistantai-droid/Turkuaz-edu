-- Apply after supabase/schema.sql in the Supabase SQL Editor.
-- This migration keeps `user_id` for compatibility with the existing app while
-- making `id` the matching auth.users id as requested.

create table if not exists public.profiles (
  id uuid primary key,
  user_id uuid not null unique,
  full_name text,
  avatar_url text,
  total_xp integer not null default 0,
  rating_tier text not null default 'Bronze',
  current_streak integer not null default 0,
  level integer not null default 1,
  rank_title text not null default 'cirak',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_id_auth_user_fkey foreign key (id) references auth.users(id) on delete cascade,
  constraint profiles_user_id_auth_user_fkey foreign key (user_id) references auth.users(id) on delete cascade
);

alter table public.profiles add column if not exists id uuid;
alter table public.profiles add column if not exists user_id uuid;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists total_xp integer not null default 0;
alter table public.profiles add column if not exists rating_tier text not null default 'Bronze';
alter table public.profiles add column if not exists current_streak integer not null default 0;
alter table public.profiles add column if not exists level integer not null default 1;
alter table public.profiles add column if not exists rank_title text not null default 'cirak';
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

-- Migrate the older schema's surrogate profile UUID to the auth.users UUID.
update public.profiles
set user_id = id
where user_id is null
  and exists (select 1 from auth.users as auth_user where auth_user.id = profiles.id);

update public.profiles
set id = user_id
where user_id is not null
  and id is distinct from user_id;

alter table public.profiles alter column id drop default;
alter table public.profiles alter column id set not null;
alter table public.profiles alter column user_id set not null;
create unique index if not exists profiles_user_id_uidx on public.profiles(user_id);

-- Add the auth-user foreign keys when upgrading an existing profiles table.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_id_auth_user_fkey'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_id_auth_user_fkey foreign key (id) references auth.users(id) on delete cascade;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_user_id_auth_user_fkey'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_user_id_auth_user_fkey foreign key (user_id) references auth.users(id) on delete cascade;
  end if;
end;
$$;

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

-- Backfill existing auth users and preserve whichever XP total is higher.
insert into public.profiles (id, user_id, full_name, avatar_url, total_xp, rating_tier)
select
  auth_user.id,
  auth_user.id,
  coalesce(
    nullif(auth_user.raw_user_meta_data ->> 'full_name', ''),
    nullif(auth_user.raw_user_meta_data ->> 'name', ''),
    nullif(split_part(coalesce(auth_user.email, ''), '@', 1), ''),
    'Learner'
  ),
  coalesce(nullif(auth_user.raw_user_meta_data ->> 'avatar_url', ''), nullif(auth_user.raw_user_meta_data ->> 'picture', '')),
  greatest(coalesce(profile.total_xp, 0), coalesce(progress.xp, 0)),
  case
    when greatest(coalesce(profile.total_xp, 0), coalesce(progress.xp, 0)) >= 2500 then 'Gold'
    when greatest(coalesce(profile.total_xp, 0), coalesce(progress.xp, 0)) >= 1000 then 'Silver'
    else 'Bronze'
  end
from auth.users as auth_user
left join public.profiles as profile on profile.user_id = auth_user.id
left join public.user_progress as progress on progress.user_id = auth_user.id
on conflict (id) do update set
  user_id = excluded.user_id,
  full_name = coalesce(nullif(public.profiles.full_name, ''), excluded.full_name),
  avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
  total_xp = greatest(public.profiles.total_xp, excluded.total_xp),
  updated_at = now();

-- Keep a profile row for every future Google/email signup.
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
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Learner'
    ),
    coalesce(nullif(new.raw_user_meta_data ->> 'avatar_url', ''), nullif(new.raw_user_meta_data ->> 'picture', '')),
    0,
    'Bronze'
  )
  on conflict (id) do update set
    full_name = coalesce(nullif(public.profiles.full_name, ''), excluded.full_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user_profile();

-- XP is updated atomically; a before-update trigger recalculates rating_tier.
create or replace function public.add_profile_xp(p_user_id uuid, p_amount integer)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_total integer;
begin
  if auth.uid() is null or auth.uid() is distinct from p_user_id then
    raise exception 'Not authorized to update this profile' using errcode = '42501';
  end if;
  if p_amount is null or p_amount < 1 or p_amount > 10000 then
    raise exception 'XP amount must be between 1 and 10000' using errcode = '22023';
  end if;

  insert into public.profiles (id, user_id, full_name, total_xp)
  values (p_user_id, p_user_id, 'Learner', p_amount)
  on conflict (id) do update set
    total_xp = public.profiles.total_xp + excluded.total_xp,
    updated_at = now()
  returning total_xp into new_total;

  return new_total;
end;
$$;

-- Reconcile XP from the legacy/local progress store without ever decreasing it.
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
  on conflict (id) do update set
    total_xp = greatest(public.profiles.total_xp, excluded.total_xp),
    updated_at = now()
  returning total_xp into synced_total;

  return synced_total;
end;
$$;

revoke all on function public.add_profile_xp(uuid, integer) from public, anon;
revoke all on function public.sync_profile_xp_floor(uuid, integer) from public, anon;
grant execute on function public.add_profile_xp(uuid, integer) to authenticated;
grant execute on function public.sync_profile_xp_floor(uuid, integer) to authenticated;

-- Profiles are private to their owner. Upserts are permitted only for a row
-- whose id and compatibility user_id both match the signed-in auth user.
alter table public.profiles enable row level security;
revoke all on table public.profiles from anon, public;
grant select, insert, update, delete on table public.profiles to authenticated;
drop policy if exists "Learners can manage own profiles" on public.profiles;
drop policy if exists "Learners can read own profiles" on public.profiles;
create policy "Learners can manage own profiles"
on public.profiles for all to authenticated
using (auth.uid() = id and auth.uid() = user_id)
with check (auth.uid() = id and auth.uid() = user_id);


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
    select total_xp into new_total from public.profiles where id = p_user_id;
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
  on conflict (id) do update set
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
-- Close the old arbitrary-amount RPC to authenticated browser clients.
revoke all on function public.add_profile_xp(uuid, integer) from public, anon, authenticated;
