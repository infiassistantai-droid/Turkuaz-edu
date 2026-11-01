import { useEffect, useMemo, useState } from 'react'
import { Crown, Medal, RefreshCw, Trophy } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'
import { fetchWeeklyLeaderboard, isSupabaseConfigured } from '../lib/supabaseClient'
import MedalBadge from './MedalBadge'

// Shown only without Supabase credentials and always labeled as demo data.
// Zeynep is a fictional sample account, not the learner's stored profile or XP.
const SAMPLE_ROWS = [
  { user_id: 'demo-elif', display_name: 'Elif Demir', weekly_xp: 4180 },
  { user_id: 'demo-mert', display_name: 'Mert Yılmaz', weekly_xp: 3890 },
  { user_id: 'demo-ayse', display_name: 'Ayşe Kaya', weekly_xp: 3540 },
  { user_id: 'demo-zeynep', display_name: 'Zeynep Arslan', weekly_xp: 3260, isSampleCurrent: true },
  { user_id: 'demo-can', display_name: 'Can Eren', weekly_xp: 3010 },
  { user_id: 'demo-defne', display_name: 'Defne Şahin', weekly_xp: 2740 },
  { user_id: 'demo-kerem', display_name: 'Kerem Aydın', weekly_xp: 2490 },
  { user_id: 'demo-selin', display_name: 'Selin Aksoy', weekly_xp: 2210 },
  { user_id: 'demo-ege', display_name: 'Ege Arslan', weekly_xp: 1940 },
  { user_id: 'demo-ada', display_name: 'Ada Çelik', weekly_xp: 1720 },
  { user_id: 'demo-bora', display_name: 'Bora Yıldız', weekly_xp: 1450 },
  { user_id: 'demo-duru', display_name: 'Duru Koç', weekly_xp: 1210 },
]

const LEAGUES = [
  { id: 'bronze', minimum: 0, icon: Medal, accent: 'amber' },
  { id: 'silver', minimum: 1000, icon: Medal, accent: 'slate' },
  { id: 'gold', minimum: 2500, icon: Crown, accent: 'yellow' },
]

function currentLeague(xp) {
  if (xp >= 2500) return 'gold'
  if (xp >= 1000) return 'silver'
  return 'bronze'
}

function rankClasses(index, premium) {
  const premiumTones = [
    'border-yellow-400/45 bg-yellow-400/[.06]',
    'border-slate-300/35 bg-slate-200/[.04]',
    'border-amber-700/35 bg-amber-700/[.05]',
  ]
  const defaultTones = [
    'border-amber-300 bg-amber-50/75',
    'border-slate-300 bg-slate-50',
    'border-orange-300 bg-orange-50/65',
  ]
  return index < 3 ? (premium ? premiumTones[index] : defaultTones[index]) : ''
}

export default function Leaderboard({ userId, profile, stats, isPremium = false, equippedMedal }) {
  const { t } = useI18n()
  const [rows, setRows] = useState(() => isSupabaseConfigured ? [] : SAMPLE_ROWS)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const sampleMode = !isSupabaseConfigured
  const refresh = async () => {
    if (!isSupabaseConfigured) return
    setBusy(true)
    setError(false)
    try { setRows(await fetchWeeklyLeaderboard()) } catch { setError(true) } finally { setBusy(false) }
  }
  useEffect(() => { if (isSupabaseConfigured) void refresh() }, [])

  const currentUserIndex = userId ? rows.findIndex((row) => row.user_id === userId) : -1
  const actualUserRow = profile && currentUserIndex < 0
    ? { user_id: userId || 'local-current-user', display_name: profile.name || t('leaderboard.you'), weekly_xp: stats?.weeklyXp || 0, isActualCurrent: true }
    : null
  const displayRows = actualUserRow ? [...rows, actualUserRow] : rows
  const activeLeagueId = useMemo(() => currentLeague(stats?.weeklyXp || 0), [stats?.weeklyXp])
  const shell = isPremium
    ? 'border-yellow-500/25 bg-black/35 text-white shadow-2xl backdrop-blur-xl'
    : 'border-slate-200 bg-white text-slate-900 shadow-sm'
  const panel = isPremium
    ? 'border-yellow-500/20 bg-black/35 text-white backdrop-blur-xl'
    : 'border-slate-200 bg-white text-slate-900 shadow-sm'

  return <section className="mx-auto max-w-4xl space-y-5">
    <header className={`rounded-3xl border p-5 sm:p-6 ${shell}`}>
      <div className="flex items-center gap-3">
        <span className={`grid size-12 place-items-center rounded-2xl ${isPremium ? 'bg-yellow-400/10 text-yellow-300' : 'bg-teal-50 text-teal-700'}`}><Trophy className="size-6"/></span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold">{t('leaderboard.title')}</h1>
          <p className={`mt-1 text-sm ${isPremium ? 'text-white/60' : 'text-slate-500'}`}>{t('leaderboard.subtitle')}</p>
        </div>
        <button type="button" onClick={refresh} disabled={busy || sampleMode} className={`grid size-10 shrink-0 place-items-center rounded-xl border disabled:opacity-40 ${isPremium ? 'border-white/15 text-yellow-100 hover:bg-white/10' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`} aria-label={t('leaderboard.refresh')}><RefreshCw className={`size-4 ${busy ? 'animate-spin' : ''}`}/></button>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {LEAGUES.map((league) => {
          const Icon = league.icon
          const active = activeLeagueId === league.id
          const tones = isPremium
            ? { bronze: 'text-orange-300 border-orange-400/20', silver: 'text-slate-200 border-slate-300/20', gold: 'text-yellow-200 border-yellow-300/30' }[league.id]
            : { bronze: 'text-orange-700 border-orange-200', silver: 'text-slate-600 border-slate-200', gold: 'text-amber-800 border-amber-200' }[league.id]
          return <div key={league.id} aria-current={active ? 'step' : undefined} className={`relative flex items-center gap-3 rounded-2xl border p-3 transition ${tones} ${isPremium ? 'bg-white/[.035]' : 'bg-white'} ${active ? isPremium ? 'border-yellow-300/70 bg-yellow-300/10 shadow-[0_0_25px_rgba(250,204,21,.18)] ring-1 ring-yellow-300/35' : 'border-amber-400 bg-amber-50 shadow-[0_0_20px_rgba(245,158,11,.16)] ring-1 ring-amber-300/60' : ''}`}>
            <Icon className="size-5 shrink-0"/>
            <div className="min-w-0"><p className="text-sm font-extrabold">{t(`leaderboard.league.${league.id}`)}</p><p className={`text-[11px] ${isPremium ? 'text-white/45' : 'text-slate-500'}`}>{league.id === 'bronze' ? t('leaderboard.league.start') : `${league.minimum.toLocaleString()}+ XP`}</p></div>
            {active && <span className={`ml-auto rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wider ${isPremium ? 'bg-yellow-300 text-slate-950' : 'bg-amber-500 text-white'}`}>{t('leaderboard.active')}</span>}
          </div>
        })}
      </div>
    </header>

    {sampleMode && <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm leading-relaxed ${isPremium ? 'border-yellow-500/25 bg-yellow-400/10 text-yellow-100' : 'border-amber-200 bg-amber-50 text-amber-900'}`}><Trophy className="mt-0.5 size-4 shrink-0"/><p><strong>{t('leaderboard.sampleTitle')}</strong> {t('leaderboard.sampleNotice')}</p></div>}
    {error && <div role="alert" className={`rounded-2xl border p-5 text-sm ${isPremium ? 'border-rose-400/25 bg-rose-500/10 text-rose-200' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>{t('leaderboard.error')}</div>}

    {!error && <div className={`overflow-hidden rounded-3xl border ${panel}`}>
      <div className={`flex items-center justify-between gap-3 border-b px-5 py-4 ${isPremium ? 'border-white/10' : 'border-slate-100'}`}>
        <div><h2 className="font-extrabold">{t('leaderboard.weeklyTitle')}</h2><p className={`mt-0.5 text-xs ${isPremium ? 'text-white/50' : 'text-slate-500'}`}>{t('leaderboard.subtitle')}</p></div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${isPremium ? 'bg-yellow-300/10 text-yellow-200' : 'bg-teal-50 text-teal-800'}`}>{displayRows.length}</span>
      </div>
      {displayRows.length ? displayRows.map((row, index) => {
        const isCurrent = row.user_id === userId || row.isSampleCurrent || row.isActualCurrent
        const RankIcon = index === 0 ? Trophy : Medal
        const currentHighlight = isPremium ? 'border-yellow-400/50 bg-yellow-500/20 ring-1 ring-inset ring-yellow-300/25' : 'border-teal-400 bg-teal-50 ring-1 ring-inset ring-teal-300/50'
        return <div key={row.user_id} className={`flex items-center gap-3 border-b px-4 py-3.5 transition sm:gap-4 sm:px-5 ${isPremium ? 'border-white/[.07]' : 'border-slate-100'} ${rankClasses(index, isPremium)} ${isCurrent ? currentHighlight : ''}`}>
          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${index === 0 ? isPremium ? 'bg-yellow-300/15 text-yellow-300' : 'bg-amber-100 text-amber-700' : index === 1 ? isPremium ? 'bg-slate-200/10 text-slate-200' : 'bg-slate-100 text-slate-600' : index === 2 ? isPremium ? 'bg-orange-700/15 text-orange-300' : 'bg-orange-100 text-orange-700' : isPremium ? 'bg-white/5 text-white/55' : 'bg-slate-50 text-slate-500'}`}>
            {index < 3 ? <RankIcon className="size-5"/> : <span className="text-sm font-extrabold tabular-nums">{index + 1}</span>}
          </span>
          <div className="min-w-0 flex-1">
            <p className={`flex min-w-0 items-center gap-1.5 font-bold ${isCurrent ? isPremium ? 'text-yellow-50' : 'text-teal-950' : isPremium ? 'text-white' : 'text-slate-900'}`}>
              <span className="min-w-0 truncate">{row.display_name}</span>
              {row.isSampleCurrent && <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${isPremium ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-500'}`}>{t('leaderboard.demoPlayer')}</span>}
              {isCurrent && !row.isSampleCurrent && <span className={`shrink-0 text-xs font-semibold ${isPremium ? 'text-yellow-200' : 'text-teal-700'}`}>{t('leaderboard.you')}</span>}
              {isCurrent && !row.isSampleCurrent && equippedMedal && <MedalBadge medalId={equippedMedal} isPremium={isPremium} className="size-4" />}
            </p>
            <p className={`text-xs ${isPremium ? 'text-white/45' : 'text-slate-500'}`}>{t('leaderboard.weekly')}</p>
          </div>
          <span className={`font-extrabold tabular-nums ${isPremium ? 'text-yellow-200' : 'text-teal-800'}`}>{Number(row.weekly_xp || 0).toLocaleString()} XP</span>
          {index < 3 && <Medal className={`hidden size-4 sm:block ${index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-400' : 'text-orange-500'}`}/>}
        </div>
      }) : <p className={`p-8 text-center text-sm ${isPremium ? 'text-white/55' : 'text-slate-500'}`}>{t('leaderboard.empty')}</p>}
    </div>}
  </section>
}
