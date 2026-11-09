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
    order by profile.total_xp desc, profile.id asc;
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
