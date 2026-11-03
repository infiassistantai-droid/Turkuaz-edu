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

-- -------------------------------------------------------------------------
-- Persistent learner identity and gamification records.
-- Safe to run repeatedly alongside the legacy user_progress table above.
-- -------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null default 'Learner',
  avatar_url text,
  current_streak integer not null default 0 check (current_streak >= 0),
  total_xp integer not null default 0 check (total_xp >= 0),
  level integer not null default 1 check (level >= 1),
  rank_title text not null default 'cirak',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles add column if not exists id uuid default gen_random_uuid();
alter table public.profiles add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.profiles add column if not exists full_name text not null default 'Learner';
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists current_streak integer not null default 0;
alter table public.profiles add column if not exists total_xp integer not null default 0;
alter table public.profiles add column if not exists level integer not null default 1;
alter table public.profiles add column if not exists rank_title text not null default 'cirak';
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();
create unique index if not exists profiles_user_id_uidx on public.profiles(user_id);

create table if not exists public.user_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  streak_count integer not null default 0 check (streak_count >= 0),
  last_active_date date,
  unlocked_milestones jsonb not null default '[]'::jsonb,
  winter_study_days jsonb not null default '{"seasonId":null,"days":[]}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.user_streaks add column if not exists streak_count integer not null default 0;
alter table public.user_streaks add column if not exists last_active_date date;
alter table public.user_streaks add column if not exists unlocked_milestones jsonb not null default '[]'::jsonb;
alter table public.user_streaks add column if not exists winter_study_days jsonb not null default '{"seasonId":null,"days":[]}'::jsonb;
alter table public.user_streaks add column if not exists updated_at timestamptz not null default now();
create unique index if not exists user_streaks_user_id_uidx on public.user_streaks(user_id);

create table if not exists public.user_achievements (
  user_id uuid not null references auth.users(id) on delete cascade,
  trophy_id text not null,
  unlocked_at timestamptz,
  progress_data jsonb not null default '{}'::jsonb,
  primary key (user_id, trophy_id)
);
alter table public.user_achievements add column if not exists unlocked_at timestamptz;
alter table public.user_achievements add column if not exists progress_data jsonb not null default '{}'::jsonb;
create unique index if not exists user_achievements_user_trophy_uidx on public.user_achievements(user_id, trophy_id);

create table if not exists public.user_vocabulary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  word text not null,
  translation text not null default '',
  lesson_id text,
  created_at timestamptz not null default now(),
  unique (user_id, word)
);
alter table public.user_vocabulary add column if not exists translation text not null default '';
alter table public.user_vocabulary add column if not exists lesson_id text;
alter table public.user_vocabulary add column if not exists created_at timestamptz not null default now();
create unique index if not exists user_vocabulary_user_word_uidx on public.user_vocabulary(user_id, word);

-- RLS prevents a signed-in learner from reading or editing another learner's rows.
-- The anon/publishable key is safe to use in the browser only with these policies enabled.
do $$
declare
  table_name text;
begin
  foreach table_name in array array['profiles', 'user_streaks', 'user_achievements', 'user_vocabulary'] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on table public.%I from anon, public', table_name);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', table_name);
    execute format('drop policy if exists "Learners can manage own %1$s" on public.%1$I', table_name);
    execute format('create policy "Learners can manage own %1$s" on public.%1$I for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', table_name);
  end loop;
end;
$$;
