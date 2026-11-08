import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Crown, FlaskConical, Globe2, MapPin, Medal, RefreshCw, Shield, Sparkles, Trophy, UsersRound } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'
import { fetchWeeklyLeaderboard, isSupabaseConfigured } from '../lib/supabase'
import leaderboardDemoData from '../data/leaderboardDemoData.json'

const LEAGUES = [
  { id: 'bronze', minimum: 0, badge: '/images/league-medals/bronze.png', tone: 'from-orange-500/20 to-amber-950/25', border: 'border-orange-400/30', glow: 'shadow-orange-500/10' },
  { id: 'silver', minimum: 1000, badge: '/images/league-medals/silver.png', tone: 'from-slate-300/15 to-slate-900/25', border: 'border-slate-300/25', glow: 'shadow-slate-200/10' },
  { id: 'gold', minimum: 5000, badge: '/images/league-medals/gold.png', tone: 'from-yellow-400/20 to-amber-950/25', border: 'border-yellow-400/30', glow: 'shadow-yellow-400/10' },
  { id: 'platinum', minimum: 10000, badge: '/images/league-medals/platinum.png', tone: 'from-cyan-300/15 to-slate-900/25', border: 'border-cyan-300/25', glow: 'shadow-cyan-300/10' },
  { id: 'diamond', minimum: 20000, badge: '/images/league-medals/diamond.png', tone: 'from-sky-400/20 to-blue-950/30', border: 'border-sky-300/30', glow: 'shadow-sky-400/10' },
  { id: 'legend', minimum: 50000, badge: '/images/league-medals/legend.png', tone: 'from-rose-500/20 to-violet-950/30', border: 'border-rose-300/30', glow: 'shadow-rose-400/10' },
]

const TABS = [
  { id: 'leagues', key: 'leaderboard.tabs.leagues', icon: Trophy },
  { id: 'players', key: 'leaderboard.tabs.players', icon: Medal },
  { id: 'clans', key: 'leaderboard.tabs.clans', icon: Shield },
]

function getActiveLeague(xp) {
  return [...LEAGUES].reverse().find((league) => xp >= league.minimum) || LEAGUES[0]
}

function formatNumber(value) {
  return Math.max(0, Number(value) || 0).toLocaleString()
}

function initials(value) {
  return String(value || '?').trim().split(/\s+/u).slice(0, 2).map((part) => part[0]?.toLocaleUpperCase()).join('') || '?'
}

function RegionToggle({ value, onChange, t }) {
  return <div className="inline-flex min-h-11 rounded-2xl border border-white/10 bg-slate-950/65 p-1" role="group" aria-label={t('leaderboard.filter.label')}>
    {[
      { id: 'global', label: t('leaderboard.filter.global'), Icon: Globe2 },
      { id: 'uzbekistan', label: t('leaderboard.filter.uzbekistan'), Icon: MapPin },
    ].map(({ id, label, Icon }) => <button key={id} type="button" aria-pressed={value === id} onClick={() => onChange(id)} className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold transition sm:px-4 ${value === id ? 'bg-cyan-300 text-slate-950 shadow-[0_4px_16px_rgba(103,232,249,.2)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
      <Icon className="size-3.5" aria-hidden="true"/><span>{label}</span>
    </button>)}
  </div>
}

function DemoToggle({ enabled, onChange, t }) {
  return <button type="button" aria-pressed={enabled} onClick={onChange} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-3 text-xs font-extrabold transition sm:px-4 ${enabled ? 'border-amber-200/30 bg-amber-200/10 text-amber-100' : 'border-white/10 bg-slate-950/65 text-slate-300 hover:bg-white/[.06] hover:text-white'}`}>
    <FlaskConical className="size-4" aria-hidden="true"/><span>{t(enabled ? 'leaderboard.demo.hide' : 'leaderboard.demo.show')}</span>
  </button>
}

function EmptyState({ icon: Icon = Trophy, title, description }) {
  return <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/35 px-5 py-12 text-center sm:px-10">
    <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[.04] text-cyan-200"><Icon className="size-6" aria-hidden="true"/></span>
    <h3 className="mt-4 text-base font-extrabold text-white">{title}</h3>
    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">{description}</p>
  </div>
}

export default function Leaderboard({ userId, profile, stats, initialTab = 'leagues' }) {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [playerRegion, setPlayerRegion] = useState('global')
  const [clanRegion, setClanRegion] = useState('global')
  const [demoMode, setDemoMode] = useState(false)
  const [rows, setRows] = useState([])
  const [busy, setBusy] = useState(isSupabaseConfigured)
  const [error, setError] = useState(false)
  const requestVersion = useRef(0)

  useEffect(() => {
    setActiveTab(initialTab === 'clans' ? 'clans' : 'leagues')
  }, [initialTab])

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) return
    const requestId = ++requestVersion.current
    setBusy(true)
    setError(false)
    try {
      const nextRows = await fetchWeeklyLeaderboard()
      if (requestVersion.current === requestId) setRows(nextRows)
    } catch {
      if (requestVersion.current === requestId) setError(true)
    } finally {
      if (requestVersion.current === requestId) setBusy(false)
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined
    void refresh()
    return () => { requestVersion.current += 1 }
  }, [refresh])

  const currentUserIndex = userId ? rows.findIndex((row) => row.user_id === userId) : -1
  const activeLeague = useMemo(() => getActiveLeague(stats?.xp), [stats?.xp])
  const nextLeague = LEAGUES[LEAGUES.findIndex((league) => league.id === activeLeague.id) + 1] || null
  const profileName = [profile?.name, profile?.surname].filter(Boolean).join(' ').trim() || profile?.fullName || profile?.full_name || ''
  const avatarUrl = profile?.avatarUrl || profile?.avatar_url || ''
  const weeklyXp = Math.max(0, Number(stats?.weeklyXp) || 0)
  const totalXp = Math.max(0, Number(stats?.xp) || 0)
  const filteredRows = playerRegion === 'global' ? rows : []
  const previewPlayers = playerRegion === 'global' ? leaderboardDemoData.players : leaderboardDemoData.players.filter((row) => row.country === 'Uzbekistan')
  const previewClans = clanRegion === 'global' ? leaderboardDemoData.clans : leaderboardDemoData.clans.filter((row) => row.country === 'Uzbekistan')
  const playersToShow = demoMode ? previewPlayers : filteredRows

  return <section className="mx-auto w-full max-w-6xl space-y-5 text-white">
    <header className="relative overflow-hidden rounded-[2rem] border border-cyan-200/10 bg-[radial-gradient(ellipse_at_95%_0%,rgba(34,211,238,.16),transparent_35%),radial-gradient(ellipse_at_0%_100%,rgba(245,158,11,.10),transparent_35%),linear-gradient(135deg,#172538,#0c1420_65%,#111827)] p-5 shadow-[0_25px_80px_rgba(0,0,0,.28)] sm:p-8">
      <div className="pointer-events-none absolute -right-12 -top-20 size-64 rounded-full border border-white/[.04]" />
      <div className="pointer-events-none absolute -right-1 -top-9 size-44 rounded-full border border-white/[.05]" />
      <div className="relative flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-amber-300/25 bg-amber-300/10 text-amber-200 shadow-[0_0_30px_rgba(251,191,36,.12)] sm:size-14"><Trophy className="size-6 sm:size-7" aria-hidden="true"/></span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[.24em] text-cyan-200/75">{t('leaderboard.leagues.eyebrow')}</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{t('leaderboard.title')}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{t('leaderboard.subtitle')}</p>
        </div>
        {activeTab === 'players' && isSupabaseConfigured && <button type="button" onClick={refresh} disabled={busy} aria-label={t('leaderboard.refresh')} className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[.04] text-cyan-100 transition hover:bg-white/10 disabled:opacity-50"><RefreshCw className={`size-4 ${busy ? 'animate-spin' : ''}`}/></button>}
      </div>
      <div className="relative mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200/10 bg-black/20 px-4 py-3.5 text-sm text-amber-50/90">
        <Sparkles className="size-4 shrink-0 text-amber-300" aria-hidden="true"/><p className="font-semibold">{t('leaderboard.leagues.banner')}</p>
      </div>
    </header>

    <nav aria-label={t('leaderboard.tabs.label')} className="sticky top-0 z-20 -mx-1 rounded-2xl border border-white/10 bg-[#0b1220]/95 p-1.5 shadow-xl backdrop-blur-xl sm:mx-0 sm:p-2">
      <div className="grid grid-cols-3 gap-1.5">
        {TABS.map(({ id, key, icon: Icon }) => <button key={id} type="button" aria-current={activeTab === id ? 'page' : undefined} onClick={() => setActiveTab(id)} className={`flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl px-2 text-xs font-extrabold transition sm:min-h-14 sm:gap-2.5 sm:px-4 sm:text-sm ${activeTab === id ? 'bg-gradient-to-r from-cyan-300 to-teal-200 text-slate-950 shadow-[0_6px_25px_rgba(45,212,191,.18)]' : 'text-slate-400 hover:bg-white/[.06] hover:text-white'}`}>
          <Icon className="size-4 shrink-0 sm:size-[18px]" aria-hidden="true"/><span className="truncate">{t(key)}</span>
        </button>)}
      </div>
    </nav>

    {demoMode && activeTab !== 'leagues' && <aside role="status" className="flex flex-wrap items-start gap-3 rounded-2xl border border-amber-200/20 bg-amber-300/[.08] p-4 text-amber-50">
      <span className="shrink-0 rounded-full border border-amber-100/20 bg-amber-200/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-amber-100">{t('leaderboard.demo.badge')}</span>
      <p className="min-w-0 flex-1 text-xs leading-5 text-amber-50/80">{t('leaderboard.demo.notice')}</p>
    </aside>}

    {activeTab === 'leagues' && <section aria-labelledby="league-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 px-1">
        <div><p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-200/65">{t('leaderboard.leagues.eyebrow')}</p><h2 id="league-heading" className="mt-1 text-xl font-black sm:text-2xl">{t('leaderboard.leagues.heading')}</h2></div>
        <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-xs font-bold text-slate-300"><Crown className="size-4 text-amber-300"/>{t('leaderboard.leagues.yourXp', { count: formatNumber(totalXp) })}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
        {LEAGUES.map((league) => {
          const active = league.id === activeLeague.id
          return <article key={league.id} aria-current={active ? 'step' : undefined} className={`group relative isolate flex min-h-52 flex-col items-center overflow-hidden rounded-3xl border bg-gradient-to-br p-3 text-center transition duration-200 sm:min-h-64 sm:p-4 ${league.border} ${league.tone} ${active ? `ring-2 ring-cyan-200/60 shadow-2xl ${league.glow} sm:-translate-y-1` : 'hover:-translate-y-1 hover:border-white/25 hover:shadow-xl'}`}>
            <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            {active && <span className="absolute right-2.5 top-2.5 rounded-full border border-cyan-100/20 bg-cyan-200/10 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-cyan-100 sm:text-[9px]">{t('leaderboard.leagues.current')}</span>}
            <img src={league.badge} alt={t(`leaderboard.league.${league.id}`)} className="mt-4 size-[5.5rem] object-contain drop-shadow-[0_12px_15px_rgba(0,0,0,.28)] transition duration-300 group-hover:scale-105 sm:mt-5 sm:size-28" loading="lazy" />
            <h3 className="mt-1 text-sm font-black tracking-wide text-white sm:text-base">{t(`leaderboard.league.${league.id}`)}</h3>
            <p className="mt-1 text-[10px] font-semibold text-slate-300 sm:text-xs">{t('leaderboard.leagues.requirement', { count: formatNumber(league.minimum) })}</p>
            {active && <div className="mt-auto flex items-center gap-1 pt-3 text-[9px] font-bold text-cyan-100/80 sm:text-[10px]"><Sparkles className="size-3"/>{nextLeague ? t('leaderboard.leagues.next', { name: t(`leaderboard.league.${nextLeague.id}`) }) : t('leaderboard.leagues.max')}</div>}
          </article>
        })}
      </div>
    </section>}

    {activeTab === 'players' && <section aria-labelledby="players-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 px-1">
        <div><p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-200/65">{t('leaderboard.leagues.eyebrow')}</p><h2 id="players-heading" className="mt-1 text-xl font-black sm:text-2xl">{t('leaderboard.players.heading')}</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400 sm:text-sm">{t('leaderboard.players.description')}</p></div>
        <div className="flex flex-wrap items-center gap-2"><RegionToggle value={playerRegion} onChange={setPlayerRegion} t={t}/><DemoToggle enabled={demoMode} onChange={() => setDemoMode((value) => !value)} t={t}/></div>
      </div>
      {profileName && !demoMode && <div className="flex items-center gap-3 rounded-2xl border border-cyan-200/15 bg-gradient-to-r from-cyan-300/[.09] to-transparent px-4 py-3.5">
        {avatarUrl ? <img src={avatarUrl} alt="" className="size-11 rounded-xl border border-white/10 object-cover"/> : <span className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[.06] text-sm font-black text-cyan-100">{initials(profileName)}</span>}
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold">{profileName}<span className="ml-2 text-xs font-semibold text-cyan-100">{t('leaderboard.players.you')}</span></p><p className="mt-0.5 text-xs text-slate-400">{t('leaderboard.players.currentXp')}</p></div>
        <span className="shrink-0 text-lg font-black tabular-nums text-cyan-100">{formatNumber(weeklyXp)} <span className="text-xs">XP</span></span>
      </div>}
      {!demoMode && error ? <div role="alert" className="rounded-2xl border border-rose-300/15 bg-rose-500/[.08] p-5 text-sm text-rose-200">{t('leaderboard.error')}</div> : !demoMode && busy && rows.length === 0 ? <div role="status" aria-busy="true" className="flex min-h-40 items-center justify-center gap-3 rounded-3xl border border-white/10 bg-slate-950/40 text-sm font-semibold text-slate-300"><RefreshCw className="size-4 animate-spin text-cyan-200"/>{t('leaderboard.players.fetching')}</div> : !demoMode && playerRegion === 'uzbekistan' ? <EmptyState icon={MapPin} title={t('leaderboard.filter.uzbekistan')} description={t('leaderboard.players.uzEmpty')}/> : !demoMode && !isSupabaseConfigured ? <EmptyState icon={Globe2} title={t('leaderboard.tabs.players')} description={t('leaderboard.players.localOnly')}/> : !demoMode && filteredRows.length === 0 ? <EmptyState icon={Trophy} title={t('leaderboard.players.heading')} description={t('leaderboard.players.globalEmpty')}/> : <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/45 shadow-xl">
        <div className="hidden grid-cols-[58px_minmax(0,1fr)_150px] items-center gap-4 border-b border-white/[.07] px-5 py-3 text-[10px] font-black uppercase tracking-[.15em] text-slate-500 sm:grid"><span>#</span><span>{t('leaderboard.players.heading')}</span><span className="text-right">{t('leaderboard.players.weeklyXp')}</span></div>
        {playersToShow.map((row, index) => {
          const isCurrentUser = row.user_id === userId
          const name = row.display_name || t('examSimulator.learnerFallback')
          const rowAvatar = isCurrentUser ? avatarUrl : row.avatar_url || ''
          const rowLeague = row.total_xp != null ? getActiveLeague(row.total_xp) : null
          const podium = index < 3
          const podiumTone = index === 0 ? 'border-amber-300/20 bg-gradient-to-r from-amber-300/[.10] to-transparent' : index === 1 ? 'border-slate-200/15 bg-gradient-to-r from-slate-200/[.07] to-transparent' : 'border-orange-300/15 bg-gradient-to-r from-orange-300/[.07] to-transparent'
          return <div key={row.user_id || `${name}-${index}`} className={`grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/[.06] px-3 py-3.5 transition last:border-0 sm:grid-cols-[58px_minmax(0,1fr)_150px] sm:gap-4 sm:px-5 ${podium ? podiumTone : 'hover:bg-white/[.025]'} ${isCurrentUser ? 'ring-1 ring-inset ring-cyan-200/30' : ''}`}>
            <span className={`grid size-10 place-items-center rounded-xl border text-xs font-black tabular-nums sm:size-11 ${index === 0 ? 'border-amber-300/25 bg-amber-300/10 text-amber-200' : index === 1 ? 'border-slate-200/20 bg-slate-200/[.08] text-slate-100' : index === 2 ? 'border-orange-300/20 bg-orange-300/[.08] text-orange-200' : 'border-white/[.07] bg-white/[.035] text-slate-400'}`}>{index < 3 ? <span className="flex flex-col items-center leading-none"><Medal className="size-4" aria-hidden="true"/><span className="mt-0.5 text-[9px]">{index + 1}</span></span> : index + 1}</span>
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              {rowAvatar ? <img src={rowAvatar} alt="" className="size-9 shrink-0 rounded-xl border border-white/10 object-cover sm:size-10"/> : <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/[.08] bg-white/[.045] text-[11px] font-black text-slate-300 sm:size-10">{initials(name)}</span>}
              <div className="min-w-0">
                <p className="flex min-w-0 items-center gap-1.5 truncate text-sm font-extrabold text-white sm:text-base"><span className="truncate">{name}</span>{isCurrentUser && <span className="shrink-0 rounded-full bg-cyan-300/10 px-2 py-0.5 text-[9px] font-black text-cyan-100">{t('leaderboard.players.you')}</span>}</p>
                <p className="mt-0.5 truncate text-[10px] text-slate-500 sm:text-xs">{demoMode ? t('leaderboard.players.demoMeta', { lessons: formatNumber(row.lessons_completed), clan: row.clan_name }) : t('leaderboard.players.weeklyXp')}</p>
                {demoMode && rowLeague && <span className="mt-1 inline-flex rounded-full border border-cyan-200/10 bg-cyan-200/[.06] px-2 py-0.5 text-[9px] font-bold text-cyan-100/80">{t(`leaderboard.league.${rowLeague.id}`)}</span>}
              </div>
            </div>
            <div className="text-right"><p className={`text-sm font-black tabular-nums sm:text-base ${podium ? 'text-amber-100' : 'text-cyan-100'}`}>{formatNumber(row.weekly_xp)} <span className="text-[10px]">XP</span></p></div>
          </div>
        })}
        {!demoMode && currentUserIndex >= 0 && <p className="border-t border-white/[.07] px-4 py-2 text-[10px] text-slate-500">{t('leaderboard.players.rank', { count: currentUserIndex + 1 })}</p>}
      </div>}
    </section>}

    {activeTab === 'clans' && <section aria-labelledby="clans-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 px-1">
        <div><p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-200/65">{t('leaderboard.leagues.eyebrow')}</p><h2 id="clans-heading" className="mt-1 text-xl font-black sm:text-2xl">{t('leaderboard.clans.heading')}</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400 sm:text-sm">{t('leaderboard.clans.description')}</p></div>
        <div className="flex flex-wrap items-center gap-2"><RegionToggle value={clanRegion} onChange={setClanRegion} t={t}/><DemoToggle enabled={demoMode} onChange={() => setDemoMode((value) => !value)} t={t}/></div>
      </div>
      <div className="relative overflow-hidden rounded-3xl border border-violet-200/10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(129,140,248,.12),transparent_58%),linear-gradient(135deg,#17172a,#0b1220_65%,#101827)] p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/[.07] bg-black/20 p-3.5"><span className="grid size-11 place-items-center rounded-xl border border-violet-200/15 bg-violet-300/[.08] text-violet-100"><UsersRound className="size-5"/></span><div className="min-w-0 flex-1"><p className="text-sm font-extrabold text-white">{t('leaderboard.clans.heading')}</p><p className="mt-0.5 text-xs text-slate-500">{t('leaderboard.clans.xp')}</p></div></div>
        {demoMode ? <div className="space-y-2">
          {previewClans.map((clan, index) => <article key={clan.id} className={`grid grid-cols-[24px_40px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-2xl border px-3 py-3.5 sm:grid-cols-[32px_48px_minmax(0,1fr)_170px] sm:gap-4 sm:px-4 ${index < 3 ? 'border-violet-200/15 bg-violet-300/[.045]' : 'border-white/[.07] bg-black/15'}`}>
            <span className="text-center text-xs font-black tabular-nums text-slate-400">{index + 1}</span><span className={`grid size-10 place-items-center rounded-xl border ${index === 0 ? 'border-amber-200/25 bg-amber-200/10 text-amber-100' : 'border-violet-200/10 bg-violet-300/[.08] text-violet-100'}`}><Shield className="size-5" aria-hidden="true"/></span>
            <div className="min-w-0"><p className="truncate text-sm font-extrabold text-white sm:text-base">{clan.name}</p><div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400 sm:text-xs"><UsersRound className="size-3.5 shrink-0"/><span>{t('leaderboard.clans.members', { count: formatNumber(clan.members), total: formatNumber(clan.capacity) })}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full bg-gradient-to-r from-violet-300 to-cyan-200" style={{ width: `${Math.min(100, (clan.members / clan.capacity) * 100)}%` }}/></div></div>
            <div className="text-right"><p className="text-[9px] font-black uppercase tracking-wider text-slate-500">{t('leaderboard.clans.xp')}</p><p className="mt-1 text-sm font-black tabular-nums text-violet-100 sm:text-base">{formatNumber(clan.total_xp)} XP</p></div>
          </article>)}
        </div> : <EmptyState icon={Shield} title={clanRegion === 'global' ? t('leaderboard.clans.heading') : t('leaderboard.filter.uzbekistan')} description={clanRegion === 'global' ? t('leaderboard.clans.globalEmpty') : t('leaderboard.clans.uzEmpty')}/>}
      </div>
    </section>}
  </section>
}
