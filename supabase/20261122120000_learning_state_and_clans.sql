begin;

create table if not exists public.user_learning_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  scope text not null check (scope in (
    'plan', 'reading', 'reading_quizzes', 'listening', 'listening_tasks', 'writing', 'speaking', 'assessments',
    'vocabulary_words', 'vocabulary_details', 'vocabulary_learned', 'vocabulary_glossary'
  )),
  payload jsonb not null check (jsonb_typeof(payload) in ('object', 'array') and octet_length(payload::text) <= 2097152),
  primary key (user_id, scope)
);

alter table public.user_learning_state enable row level security;
revoke all on public.user_learning_state from public, anon, authenticated;
grant select, insert, update, delete on public.user_learning_state to authenticated;

drop policy if exists learning_state_read on public.user_learning_state;
create policy learning_state_read on public.user_learning_state for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists learning_state_insert on public.user_learning_state;
create policy learning_state_insert on public.user_learning_state for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists learning_state_update on public.user_learning_state;
create policy learning_state_update on public.user_learning_state for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists learning_state_delete on public.user_learning_state;
create policy learning_state_delete on public.user_learning_state for delete to authenticated using ((select auth.uid()) = user_id);

create table if not exists public.league_clans (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 1 and 80),
  active boolean not null default true
);

create table if not exists public.league_clan_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  clan_id uuid not null references public.league_clans(id) on delete cascade
);

create index if not exists league_clan_members_clan_id on public.league_clan_members (clan_id);
alter table public.league_clans enable row level security;
alter table public.league_clan_members enable row level security;
revoke all on public.league_clans, public.league_clan_members from public, anon, authenticated;

create or replace function public.get_top_clans(p_limit integer default 50)
returns table (id uuid, name text, members bigint, total_xp bigint)
language sql stable security definer
set search_path = ''
as $$
  select c.id, c.name, count(m.user_id), coalesce(sum(p.total_xp), 0)::bigint
  from public.league_clans c
  join public.league_clan_members m on m.clan_id = c.id
  join public.profiles p on p.user_id = m.user_id
  where c.active and (select auth.uid()) is not null
  group by c.id, c.name
  order by coalesce(sum(p.total_xp), 0) desc, c.name, c.id
  limit greatest(1, least(coalesce(p_limit, 50), 50));
$$;

revoke all on function public.get_top_clans(integer) from public, anon, authenticated;
grant execute on function public.get_top_clans(integer) to authenticated;

create or replace function public.reset_learner_progress(expected_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  learner_id uuid := auth.uid();
begin
  if learner_id is null or learner_id is distinct from expected_user_id then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  delete from public.user_learning_state where user_id = learner_id;
  delete from public.user_vocabulary where user_id = learner_id;
  delete from public.user_achievements where user_id = learner_id;
  delete from public.user_streaks where user_id = learner_id;
  delete from public.user_progress where user_id = learner_id;
  delete from public.profiles where user_id = learner_id;
end;
$$;

revoke all on function public.reset_learner_progress(uuid) from public, anon, authenticated;
grant execute on function public.reset_learner_progress(uuid) to authenticated;
notify pgrst, 'reload schema';

commit;
