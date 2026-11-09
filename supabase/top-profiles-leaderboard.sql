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
