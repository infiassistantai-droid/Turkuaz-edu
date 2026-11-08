-- Run this script in the Supabase SQL Editor.
-- Notifications are written by trusted server-side code (service role); clients
-- can only read and mark their own rows as read.

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  message text not null default '',
  type text not null default 'system',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_created_at_idx
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists "Users can SELECT their own notifications" on public.notifications;
create policy "Users can SELECT their own notifications"
  on public.notifications
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can UPDATE their own notifications" on public.notifications;
create policy "Users can UPDATE their own notifications"
  on public.notifications
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

revoke all on table public.notifications from anon, public;
grant select on table public.notifications to authenticated;
grant update (is_read) on table public.notifications to authenticated;
grant all on table public.notifications to service_role;

-- Enable Postgres Changes so the app can receive inserts and read-status updates.
do $enable_notifications_realtime$
begin
  if exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  ) and not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
end;
$enable_notifications_realtime$;
