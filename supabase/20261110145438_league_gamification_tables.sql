-- Add the missing learner progress/gamification tables and managed league tiers.
-- Existing public.profiles and public.notifications tables were inspected first;
-- profile RLS remains owner-only throughout this migration.

alter table public.profiles add column if not exists user_id uuid;
alter table public.profiles add column if not exists full_name text not null default 'Learner';
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists current_streak integer not null default 0;
alter table public.profiles add column if not exists total_xp integer not null default 0;
alter table public.profiles add column if not exists gold integer not null default 0;
alter table public.profiles add column if not exists gems integer not null default 0;
alter table public.profiles add column if not exists level integer not null default 1;
alter table public.profiles add column if not exists rank_title text not null default 'cirak';
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();
update public.profiles set user_id = id where user_id is null;
create unique index if not exists profiles_user_id_uidx on public.profiles(user_id);

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Learner',
  target_level text check (target_level in ('B1', 'B2', 'C1')),
  xp integer not null default 0 check (xp >= 0),
  streak integer not null default 0 check (streak >= 0),
  completed_lessons jsonb not null default '[]'::jsonb,
  module_scores jsonb not null default '{}'::jsonb,
  weekly_xp integer not null default 0 check (weekly_xp >= 0),
  week_start date,
  daily_xp jsonb not null default '{}'::jsonb,
  analytics_tracking_since date,
  daily_quests jsonb not null default '{}'::jsonb,
  quest_words_credited jsonb not null default '[]'::jsonb,
  last_activity_date date,
  updated_at timestamptz not null default now()
);
alter table public.user_progress enable row level security;
revoke all on public.user_progress from anon, public;
grant select, insert, update, delete on public.user_progress to authenticated;
drop policy if exists "Learners can read own progress" on public.user_progress;
create policy "Learners can read own progress" on public.user_progress for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Learners can insert own progress" on public.user_progress;
create policy "Learners can insert own progress" on public.user_progress for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Learners can update own progress" on public.user_progress;
create policy "Learners can update own progress" on public.user_progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Learners can delete own progress" on public.user_progress;
create policy "Learners can delete own progress" on public.user_progress for delete to authenticated using (auth.uid() = user_id);
create index if not exists user_progress_weekly_leaderboard_idx on public.user_progress (week_start, weekly_xp desc);

create or replace function public.get_weekly_leaderboard(requested_week_start date)
returns table (user_id uuid, display_name text, weekly_xp integer)
language sql stable security definer set search_path = ''
as $$
  select p.user_id, p.display_name, p.weekly_xp
  from public.user_progress as p
  where auth.uid() is not null and p.week_start = requested_week_start and p.weekly_xp > 0
  order by p.weekly_xp desc, p.updated_at asc limit 10;
$$;
revoke all on function public.get_weekly_leaderboard(date) from public, anon;
grant execute on function public.get_weekly_leaderboard(date) to authenticated;

create table if not exists public.user_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  streak_count integer not null default 0 check (streak_count >= 0),
  last_active_date date,
  unlocked_milestones jsonb not null default '[]'::jsonb,
  winter_study_days jsonb not null default '{"seasonId":null,"days":[]}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.user_achievements (
  user_id uuid not null references auth.users(id) on delete cascade,
  trophy_id text not null,
  unlocked_at timestamptz,
  progress_data jsonb not null default '{}'::jsonb,
  primary key (user_id, trophy_id)
);
create table if not exists public.user_vocabulary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  word text not null,
  translation text not null default '',
  lesson_id text,
  created_at timestamptz not null default now(),
  unique (user_id, word)
);

do $$
declare table_name text;
begin
  foreach table_name in array array['user_streaks', 'user_achievements', 'user_vocabulary'] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on table public.%I from anon, public', table_name);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', table_name);
    execute format('drop policy if exists "Learners can manage own %1$s" on public.%1$I', table_name);
    execute format('create policy "Learners can manage own %1$s" on public.%1$I for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', table_name);
  end loop;
end;
$$;

create table if not exists public.league_tiers (
  tier_key text primary key check (tier_key ~ '^[a-z0-9_-]+$'),
  minimum_xp integer not null default 0 check (minimum_xp >= 0),
  sort_order integer not null default 0,
  badge_path text not null default '',
  active boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
insert into public.league_tiers (tier_key, minimum_xp, sort_order, badge_path) values
  ('bronze', 0, 1, '/images/league-medals/bronze.png'),
  ('silver', 1000, 2, '/images/league-medals/silver.png'),
  ('gold', 5000, 3, '/images/league-medals/gold.png'),
  ('platinum', 10000, 4, '/images/league-medals/platinum.png'),
  ('diamond', 20000, 5, '/images/league-medals/diamond.png'),
  ('legend', 50000, 6, '/images/league-medals/legend.png')
on conflict (tier_key) do nothing;
alter table public.league_tiers enable row level security;
revoke all on public.league_tiers from anon, public;
grant select, insert, update, delete on public.league_tiers to authenticated;
drop policy if exists "Authenticated users can read league tiers" on public.league_tiers;
create policy "Authenticated users can read league tiers" on public.league_tiers for select to authenticated using (true);
drop policy if exists "Admins can manage league tiers" on public.league_tiers;
create policy "Admins can manage league tiers" on public.league_tiers for all to authenticated
using (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
with check (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');
