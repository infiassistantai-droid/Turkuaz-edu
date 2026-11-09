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
