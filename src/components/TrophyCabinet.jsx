import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Lock, Trophy } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'
import { CORE_TROPHIES, SEASONAL_TROPHIES, TROPHY_REWARD_XP, TROPHY_SHELVES, getTrophy, getTrophyProgress } from '../lib/trophies'
import './TrophyCabinet.css'

const COLLECTIONS = [
  { id: 'core', label: 'trophy.collection.core' },
  { id: 'seasons', label: 'trophy.collection.seasons' },
  { id: 'streaks', label: 'streak.showcase.title' },
]

function unlockDate(record, language) {
  if (!record?.unlockedAt) return null
  const date = new Date(record.unlockedAt)
  if (!Number.isFinite(date.getTime())) return null
  return new Intl.DateTimeFormat(language, { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
}

export default function TrophyCabinet({ metrics, unlockRecords = [], children }) {
  const { language, t } = useI18n()
  const [collection, setCollection] = useState('core')
  const [selectedId, setSelectedId] = useState(null)
  const detailsRef = useRef(null)
  const recordById = useMemo(() => new Map(unlockRecords.map((record) => [record.id, record])), [unlockRecords])
  const visibleTrophies = collection === 'core' ? CORE_TROPHIES : SEASONAL_TROPHIES
  const unlockedCount = visibleTrophies.filter((trophy) => recordById.has(trophy.id) || getTrophyProgress(trophy, metrics).unlocked).length
  const shelves = collection === 'core'
    ? TROPHY_SHELVES
    : [{ id: 'seasons', trophyIds: SEASONAL_TROPHIES.map(({ id }) => id) }]

  useEffect(() => {
    if (selectedId) detailsRef.current?.scrollIntoView({ block: 'nearest' })
  }, [selectedId])

  function selectCollection(next) {
    setCollection(next)
    setSelectedId(null)
  }

  function progressLabel(trophy, { current, target }) {
    const format = (value) => Math.floor(value).toLocaleString(language)
    return t(trophy.progressKey, { current: format(current), target: format(target) })
  }

  function renderDetails(trophy) {
    const record = recordById.get(trophy.id)
    const progress = getTrophyProgress(trophy, metrics)
    const date = unlockDate(record, language)
    const reward = record?.rewardXp ?? TROPHY_REWARD_XP[trophy.id] ?? 0
    const rewardLabel = record?.historical
      ? t('trophy.tooltip.historical')
      : t('trophy.tooltip.reward', { xp: reward.toLocaleString(language) })

    return (
      <div id={'trophy-details-' + trophy.id} ref={detailsRef} className="trophy-details" aria-live="polite">
        <img src={trophy.image} alt="" width="256" height="256" />
        <div className="min-w-0">
          <h5>{t(trophy.titleKey)}</h5>
          <p>{t(trophy.descriptionKey)}</p>
          <div className="trophy-details-meta">
            <span>{record ? t('trophy.status.unlocked') : progressLabel(trophy, progress)}</span>
            <span>{rewardLabel}</span>
            {date && <span>{t('trophy.tooltip.date', { date })}</span>}
          </div>
        </div>
      </div>
    )
  }

  function renderTrophy(trophy) {
    const progress = getTrophyProgress(trophy, metrics)
    const unlocked = recordById.has(trophy.id) || progress.unlocked
    const expanded = selectedId === trophy.id
    return (
      <button
        key={trophy.id}
        type="button"
        className="trophy-card"
        data-season={trophy.season}
        data-unlocked={unlocked}
        aria-expanded={expanded}
        aria-controls={expanded ? 'trophy-details-' + trophy.id : undefined}
        onClick={() => setSelectedId(expanded ? null : trophy.id)}
      >
        <span className="trophy-card-art">
          <img src={trophy.image} alt="" width="256" height="256" loading="lazy" />
          <span className="trophy-card-status">{unlocked ? <Check size={14} aria-hidden="true" /> : <Lock size={13} aria-hidden="true" />}</span>
        </span>
        <strong>{t(trophy.titleKey)}</strong>
        <span className="trophy-card-progress">{unlocked ? t('trophy.status.unlocked') : progressLabel(trophy, progress)}</span>
        <progress max={100} value={unlocked ? 100 : progress.percent} aria-hidden="true" />
      </button>
    )
  }

  return (
    <section className="trophy-cabinet" data-trophy-cabinet="earned-progress" aria-label={t('trophy.cabinet.title')}>
      <header className="trophy-cabinet-head">
        <span className="trophy-cabinet-icon"><Trophy size={19} aria-hidden="true" /></span>
        <h3>{t('trophy.cabinet.title')}</h3>
        {collection !== 'streaks' && <span aria-live="polite">{t('trophy.collection.count', { count: unlockedCount, total: visibleTrophies.length })}</span>}
      </header>

      <div className="trophy-collections" role="group" aria-label={t('trophy.cabinet.title')}>
        {COLLECTIONS.map(({ id, label }) => (
          <button type="button" key={id} aria-pressed={collection === id} onClick={() => selectCollection(id)}>
            {t(label)}
          </button>
        ))}
      </div>

      {collection === 'streaks' ? children : shelves.map(({ id, titleKey, trophyIds }) => {
        const selected = trophyIds.includes(selectedId) ? getTrophy(selectedId) : null
        return (
          <section key={id} className="trophy-shelf" aria-label={t(titleKey || 'trophy.collection.seasons')}>
            {titleKey && <h4>{t(titleKey)}</h4>}
            <div className="trophy-grid" data-count={trophyIds.length}>{trophyIds.map((trophyId) => renderTrophy(getTrophy(trophyId)))}</div>
            {selected && renderDetails(selected)}
          </section>
        )
      })}
    </section>
  )
}

