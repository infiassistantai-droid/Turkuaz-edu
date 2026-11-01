-- Apply in the Supabase SQL editor. Never expose the service_role key in the browser.
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Learner',
  target_level text check (target_level in ('B1', 'B2', 'C1')),
  xp integer not null default 0 check (xp >= 0),
  streak integer not null default 0 check (streak >= 0),
  completed_lessons jsonb not null default '[]'::jsonb,
  weekly_xp integer not null default 0 check (weekly_xp >= 0),
  week_start date,
  daily_xp jsonb not null default '{}'::jsonb,
  analytics_tracking_since date,
  daily_quests jsonb not null default '{}'::jsonb,
  quest_words_credited jsonb not null default '[]'::jsonb,
  last_activity_date date,
  updated_at timestamptz not null default now()
);
-- Safe migration for projects that applied an earlier version of this schema.
alter table public.user_progress add column if not exists daily_xp jsonb not null default '{}'::jsonb;
alter table public.user_progress add column if not exists analytics_tracking_since date;
alter table public.user_progress add column if not exists daily_quests jsonb not null default '{}'::jsonb;
alter table public.user_progress add column if not exists quest_words_credited jsonb not null default '[]'::jsonb;
alter table public.user_progress enable row level security;
drop policy if exists "Learners can read leaderboard" on public.user_progress;
drop policy if exists "Learners can read own progress" on public.user_progress;
create policy "Learners can read own progress" on public.user_progress for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Learners can insert own progress" on public.user_progress;
create policy "Learners can insert own progress" on public.user_progress for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Learners can update own progress" on public.user_progress;
create policy "Learners can update own progress" on public.user_progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Learners can delete own progress" on public.user_progress;
create policy "Learners can delete own progress" on public.user_progress for delete to authenticated using (auth.uid() = user_id);
create index if not exists user_progress_weekly_leaderboard_idx on public.user_progress (week_start, weekly_xp desc);

-- Expose only public leaderboard fields; private progress remains readable by its owner only.
create or replace function public.get_weekly_leaderboard(requested_week_start date)
returns table (user_id uuid, display_name text, weekly_xp integer)
language sql
stable
security definer
set search_path = ''
as $$
  select p.user_id, p.display_name, p.weekly_xp
  from public.user_progress as p
  where auth.uid() is not null
    and p.week_start = requested_week_start
    and p.weekly_xp > 0
  order by p.weekly_xp desc, p.updated_at asc
  limit 10;
$$;
revoke all on function public.get_weekly_leaderboard(date) from public;
grant execute on function public.get_weekly_leaderboard(date) to authenticated;
