import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, RefreshCw, Trophy } from 'lucide-react'
import { ModelAsset, PanelHeading, SectionBanner } from './BosforArtwork'
import { useI18n } from '../lib/i18n.jsx'
import { fetchLeagueTiers, fetchTopClans, fetchTopPlayers, isSupabaseConfigured } from '../lib/supabase'
import './Leaderboard.css'

const LEAGUES = [
  ['bronze', 0], ['silver', 1000], ['gold', 5000],
  ['platinum', 10000], ['diamond', 20000], ['legend', 50000],
].map(([id, minimum]) => ({ id, minimum, badge: '/images/league-medals/' + id + '.png' }))
const DEFAULT_AVATAR = '/images/avatars/avatar-1.png'
const TABS = ['leagues', 'players', 'clans']

function activeTier(leagues, xp) {
  return [...leagues].reverse().find(({ minimum }) => xp >= minimum)
}

function getXp(value) {
  return Math.max(0, Number(value) || 0)
}

function LeagueMedal({ tier, className }) {
  const fallback = LEAGUES.find(({ id }) => id === tier.id)?.badge
  return <img src={tier.badge} alt="" className={className} onError={(event) => {
    const image = event.currentTarget
    if (fallback && image.getAttribute('src') !== fallback) image.src = fallback
  }} />
}

function Avatar({ src }) {
  return <img src={src || DEFAULT_AVATAR} alt="" className="league-avatar" onError={(event) => {
    if (event.currentTarget.getAttribute('src') !== DEFAULT_AVATAR) event.currentTarget.src = DEFAULT_AVATAR
  }} />
}

function EmptyState({ description }) {
  return (
    <div className="bosfor-inset grid justify-items-center gap-2 rounded-xl border p-6 text-center">
      <ModelAsset name="medal" className="size-12" />
      <p className="league-muted max-w-md text-sm">{description}</p>
    </div>
  )
}

export default function Leaderboard({ userId, profile, stats, initialTab = 'leagues', navigate }) {
  const { language, t } = useI18n()
  const format = new Intl.NumberFormat(language)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [rows, setRows] = useState([])
  const [clanRows, setClanRows] = useState([])
  const [leagues, setLeagues] = useState(LEAGUES)
  const [busy, setBusy] = useState(isSupabaseConfigured)
  const [error, setError] = useState(false)
  const requestVersion = useRef(0)
  const nameFor = (tier) => t('leaderboard.league.' + tier.id)
  const xp = getXp(stats?.xp)
  const current = activeTier(leagues, xp)
  const next = leagues.find(({ minimum }) => minimum > xp)
  const floor = current?.minimum ?? 0
  const percent = next ? Math.floor(100 * (xp - floor) / (next.minimum - floor)) : 100
  const currentRank = userId ? rows.findIndex((row) => row.user_id === userId) + 1 : 0
  const profileName = [profile?.name, profile?.surname].filter(Boolean).join(' ').trim() || profile?.fullName || profile?.full_name || t('leaderboard.players.you')
  const avatar = profile?.avatarUrl || profile?.avatar_url

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || activeTab === 'leagues') return
    const request = ++requestVersion.current
    setBusy(true)
    setError(false)
    try {
      const results = await (activeTab === 'clans' ? fetchTopClans() : fetchTopPlayers())
      if (request === requestVersion.current) (activeTab === 'clans' ? setClanRows : setRows)(results)
    } catch {
      if (request === requestVersion.current) setError(true)
    } finally {
      if (request === requestVersion.current) setBusy(false)
    }
  }, [activeTab])

  useEffect(() => {
    if (!isSupabaseConfigured || activeTab === 'leagues') return undefined
    void refresh()
    return () => { requestVersion.current += 1 }
  }, [refresh])

  useEffect(() => {
    let alive = true
    fetchLeagueTiers().then((settings) => {
      const configured = settings.filter((item) => item.active).flatMap((item) => {
        const known = LEAGUES.find(({ id }) => id === item.tier_key)
        return known ? [{ ...known, minimum: item.minimum_xp, badge: item.badge_path || known.badge, order: item.sort_order }] : []
      }).sort((a, b) => a.minimum - b.minimum || a.order - b.order)
      if (alive && configured.length) setLeagues(configured)
    }).catch(() => {})
    return () => { alive = false }
  }, [])

  return (
    <section className="bosfor-leagues mx-auto max-w-6xl space-y-4" aria-labelledby="league-title">
      <SectionBanner name="medal" titleId="league-title" title={t('leaderboard.tabs.leagues')} description={t('leaderboard.subtitle')} />

      <div className="bosfor-tabs league-tabs" role="group" aria-label={t('leaderboard.tabs.label')}>
        {TABS.map((tab) => <button type="button" key={tab} onClick={() => setActiveTab(tab)} aria-pressed={tab === activeTab} className="bosfor-tab" data-league-tab={tab}>{t('leaderboard.tabs.' + tab)}</button>)}
      </div>

      {activeTab === 'leagues' ? (
        <>
          <section className="bosfor-panel rounded-2xl border p-4 sm:p-6" aria-labelledby="league-progress">
            <div className="league-summary">
              <div className="league-stage" data-tier={current?.id}>
                {current ? <LeagueMedal tier={current} className="league-stage-medal" /> : <ModelAsset name="medal" className="league-stage-medal" />}
              </div>
              <div className="min-w-0">
                <p className="league-muted text-xs font-bold">{t('leaderboard.leagues.current')}</p>
                <h2 id="league-progress" className="text-2xl font-extrabold sm:text-3xl">{current ? nameFor(current) : t('leaderboard.leagues.unranked')}</h2>
                <p className="mt-1 text-sm font-bold tabular-nums">{t('leaderboard.leagues.yourXp', { count: format.format(xp) })}</p>
                <div className="mt-4 flex flex-wrap justify-between gap-2 text-xs font-semibold">
                  <span>{next ? t('leaderboard.leagues.next', { name: nameFor(next) }) : t('leaderboard.leagues.max')}</span>
                  {next && <span className="league-muted">{t('leaderboard.leagues.remaining', { count: format.format(next.minimum - xp) })}</span>}
                </div>
                <div className="bosfor-track mt-2 h-2.5 overflow-hidden rounded-full" role="progressbar" aria-label={t('leaderboard.leagues.progress')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
                  <div className="bosfor-progress-fill h-full rounded-full" style={{ width: percent + '%' }} />
                </div>
                {navigate && next && <button type="button" className="bosfor-action league-action mt-4" onClick={() => navigate('plan')}>{t('leaderboard.leagues.practice')}<ArrowRight className="size-4" aria-hidden="true" /></button>}
              </div>
            </div>
          </section>
          <section className="bosfor-panel rounded-2xl border p-4 sm:p-6" aria-labelledby="league-tiers">
            <PanelHeading name="certificate" titleId="league-tiers" title={t('leaderboard.leagues.heading')} />
            <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
              {leagues.map((tier) => (
                <li key={tier.id} data-tier={tier.id} aria-current={tier === current ? 'step' : undefined} className="bosfor-inset league-tier min-w-0 rounded-xl border p-2.5 text-center">
                  <LeagueMedal tier={tier} className="league-tier-medal" />
                  <h3 className="text-sm font-extrabold">{nameFor(tier)}</h3>
                  <p className="league-muted mt-0.5 text-xs tabular-nums">{t('leaderboard.leagues.requirement', { count: format.format(tier.minimum) })}</p>
                  {tier === current && <span className="league-tier-status mt-1 inline-flex items-center gap-1 text-xs font-bold"><Check className="size-3" aria-hidden="true" />{t('leaderboard.leagues.current')}</span>}
                </li>
              ))}
            </ol>
          </section>
        </>
      ) : (
        <section className="bosfor-panel rounded-2xl border p-4 sm:p-6" aria-labelledby="league-rankings">
          <PanelHeading name={activeTab === 'players' ? 'medal' : 'certificate'} titleId="league-rankings" title={t('leaderboard.' + activeTab + '.heading')} description={t('leaderboard.' + activeTab + '.description')}>
            {isSupabaseConfigured && (
              <button type="button" className="bosfor-control league-action" disabled={busy} onClick={refresh}><RefreshCw className={'size-4 ' + (busy ? 'animate-spin' : '')} aria-hidden="true" />{t('leaderboard.refresh')}</button>
            )}
          </PanelHeading>

          {activeTab === 'players' && (
            <div className="bosfor-inset mt-4 flex flex-wrap items-center gap-2.5 rounded-xl border p-3">
              <Avatar src={avatar} />
              <div className="min-w-0 flex-1"><p className="break-words text-sm font-extrabold">{profileName}</p>{currentRank > 0 && <p className="league-muted text-xs">{t('leaderboard.players.rank', { count: currentRank })}</p>}</div>
              <strong className="text-sm tabular-nums">{format.format(xp)} XP</strong>
            </div>
          )}

          <div className="mt-4">
            {error ? (
              <p className="bosfor-inset rounded-xl border p-4 text-sm" role="alert">{t('leaderboard.error')}</p>
            ) : busy && isSupabaseConfigured ? (
              <p className="league-muted py-6 text-center text-sm" role="status">{t('leaderboard.players.fetching')}</p>
            ) : activeTab === 'clans' ? (
              clanRows.length ? <ol className="space-y-2">
                {clanRows.map((clan, index) => (
                  <li key={clan.id} className="bosfor-inset league-row rounded-xl border p-2.5 sm:p-3">
                    <span className="league-place">{index + 1}</span>
                    <span className="min-w-0"><span className="block break-words text-sm font-extrabold">{clan.name}</span><span className="league-muted text-xs">{t('leaderboard.clans.memberCount', { count: clan.members })}</span></span>
                    <strong className="text-xs tabular-nums sm:text-sm">{format.format(clan.total_xp)} XP</strong>
                  </li>
                ))}
              </ol> : <EmptyState description={t('leaderboard.clans.globalEmpty')} />
            ) : !rows.length ? (
              <EmptyState description={t(isSupabaseConfigured ? 'leaderboard.players.globalEmpty' : 'leaderboard.players.offline')} />
            ) : (
              <>
                <ol className="space-y-2">
                  {rows.map((row, index) => {
                    const own = row.user_id === userId
                    const rowXp = getXp(row.total_xp)
                    const tier = activeTier(leagues, rowXp)
                    return (
                      <li key={row.user_id} data-rank={index + 1} data-own={own} className="bosfor-inset league-row rounded-xl border p-2.5 sm:p-3">
                        <span className="league-place">{index === 0 && <Trophy className="size-3.5" aria-hidden="true" />}{index + 1}</span>
                        <div className="flex min-w-0 items-center gap-2">
                          <Avatar src={own ? avatar : row.avatar_url} />
                          <div className="min-w-0">
                            <p className="break-words text-sm font-extrabold">{row.display_name} {own && <span className="league-muted text-xs">· {t('leaderboard.players.you')}</span>}</p>
                            {tier && <span className="league-muted inline-flex items-center gap-1 text-xs"><LeagueMedal tier={tier} className="size-4 object-contain" />{nameFor(tier)}</span>}
                          </div>
                        </div>
                        <strong className="text-xs tabular-nums sm:text-sm">{format.format(rowXp)} XP</strong>
                      </li>
                    )
                  })}
                </ol>
              </>
            )}
          </div>
        </section>
      )}
    </section>
  )
}

