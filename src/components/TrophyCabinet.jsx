import { useMemo, useState } from 'react'
import { Check, Lock, Sparkles, Trophy } from 'lucide-react'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'
import { getTrophyProgress, TROPHY_SHELVES, TROPHIES } from '../lib/trophies'

function progressLabel(trophy, progress, language, t) {
  let current = progress.current
  let target = progress.target
  if (trophy.metric === 'listeningPercent') {
    current = Math.round(current)
    target = Math.round(target)
  } else {
    current = Math.floor(current).toLocaleString(language)
    target = Math.floor(target).toLocaleString(language)
  }
  return t(trophy.progressKey, { current, target })
}

function unlockDate(record, language) {
  if (!record?.unlockedAt) return null
  const date = new Date(record.unlockedAt)
  if (!Number.isFinite(date.getTime())) return null
  const locale = { uz: 'uz-UZ', en: 'en-US', tr: 'tr-TR' }[language] || 'en-US'
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
}

export default function TrophyCabinet({ metrics, unlockRecords = [], isPremium = false }) {
  const { language, t } = useI18n()
  const [selectedId, setSelectedId] = useState(null)
  const recordById = useMemo(() => new Map(
    (Array.isArray(unlockRecords) ? unlockRecords : []).filter((record) => record?.id).map((record) => [record.id, record]),
  ), [unlockRecords])
  const selectedTrophy = TROPHIES.find(({ id }) => id === selectedId) || null
  const selectedRecord = selectedTrophy ? recordById.get(selectedTrophy.id) : null
  const selectedProgress = selectedTrophy ? getTrophyProgress(selectedTrophy, metrics) : null

  return (
    <section
      className={cn(
        'rounded-3xl border p-3 shadow-sm sm:p-5',
        isPremium
          ? 'border-white/10 bg-black/40 text-white shadow-black/20 backdrop-blur-xl'
          : 'border-slate-200 bg-white text-slate-900 shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900/90 dark:text-white',
      )}
      aria-label={t('trophy.cabinet.title')}
    >
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3">
          <span className={cn(
            'grid size-10 place-items-center rounded-xl border',
            isPremium ? 'border-amber-200/20 bg-amber-300/10 text-amber-100 shadow-[0_0_20px_rgba(250,204,21,.16)]' : 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200',
          )}>
            <Trophy className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-black sm:text-base">{t('trophy.cabinet.title')}</h3>
            <p className={cn('mt-0.5 text-[11px] font-medium', isPremium ? 'text-white/55' : 'text-slate-500 dark:text-slate-400')}>
              {t('trophy.cabinet.subtitle')}
            </p>
          </div>
        </div>
        <span className={cn('rounded-full border px-2.5 py-1 text-[10px] font-extrabold', isPremium ? 'border-white/10 bg-white/5 text-amber-100' : 'border-amber-100 bg-amber-50 text-amber-800 dark:border-amber-200/15 dark:bg-amber-300/10 dark:text-amber-200')}>
          {t('trophy.cabinet.count', { count: TROPHIES.filter((trophy) => recordById.has(trophy.id) || getTrophyProgress(trophy, metrics).unlocked).length })}
        </span>
      </header>

      <div className="space-y-4">
        {TROPHY_SHELVES.map((shelf, shelfIndex) => (
          <section key={shelf.id} aria-label={t(shelf.titleKey)}>
            <h4 className={cn('mb-2 px-1 text-[10px] font-black uppercase tracking-[.16em]', isPremium ? 'text-amber-100/70' : 'text-amber-800/75 dark:text-amber-200/75')}>
              {t(shelf.titleKey)}
            </h4>
            <div className={cn(
              'relative grid grid-cols-2 gap-2 rounded-2xl border p-2 pb-4 sm:grid-cols-4 sm:gap-3 sm:p-3 sm:pb-5',
              isPremium
                ? 'border-white/10 bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]'
                : 'border-slate-100 bg-slate-50/80 shadow-inner dark:border-slate-700 dark:bg-slate-950/35',
            )}>
              {shelf.trophyIds.map((trophyId) => {
                const trophy = TROPHIES.find((item) => item.id === trophyId)
                if (!trophy) return null
                const record = recordById.get(trophy.id)
                const progress = getTrophyProgress(trophy, metrics)
                const unlocked = Boolean(record) || progress.unlocked
                const date = unlockDate(record, language)
                const rewardXp = Number(record?.rewardXp) || 0
                const selected = selectedId === trophy.id
                const rewardCopy = record?.historical
                  ? t('trophy.tooltip.historical')
                  : t('trophy.tooltip.reward', { xp: rewardXp.toLocaleString(language) })
                const dateCopy = date
                  ? t('trophy.tooltip.date', { date })
                  : t('trophy.tooltip.dateUnknown')

                return (
                  <div key={trophy.id} className="group/trophy relative min-w-0">
                    <button
                      type="button"
                      onClick={() => setSelectedId(trophy.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape' && selected) setSelectedId(null)
                      }}
                      aria-pressed={selected}
                      aria-label={`${t(trophy.titleKey)} · ${t(unlocked ? 'trophy.status.unlocked' : 'trophy.status.locked')} · ${progressLabel(trophy, progress, language, t)}`}
                      className={cn(
                        'relative z-0 flex h-full min-h-[190px] w-full flex-col items-center rounded-xl border px-2 pb-3 pt-2 text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 sm:min-h-[220px] sm:px-3 sm:pt-3',
                        isPremium
                          ? 'border-white/10 bg-black/35 hover:border-amber-200/30 hover:bg-white/[.045] focus-visible:ring-amber-200/50'
                          : 'border-slate-200/80 bg-white hover:border-amber-200 hover:bg-amber-50/35 focus-visible:ring-teal-500/40 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-amber-200/30',
                        selected && (isPremium ? 'border-amber-200/35 bg-amber-300/[.06] shadow-[0_0_26px_rgba(250,204,21,.12)]' : 'border-amber-200 shadow-md shadow-amber-900/5 dark:bg-amber-300/[.06]'),
                        unlocked && 'hover:z-10 hover:-translate-y-1 hover:scale-[1.02]',
                      )}
                    >
                      <span className="relative grid h-[118px] w-full place-items-center sm:h-[140px]">
                        <img
                          src={trophy.image}
                          alt=""
                          loading="lazy"
                          draggable="false"
                          className={cn(
                            'size-full object-contain transition-all duration-300',
                            unlocked
                              ? isPremium
                                ? 'drop-shadow-[0_0_14px_rgba(250,204,21,.28)] group-hover/trophy:drop-shadow-[0_0_22px_rgba(45,212,191,.4)]'
                                : 'drop-shadow-[0_4px_10px_rgba(120,78,10,.16)] group-hover/trophy:drop-shadow-[0_6px_18px_rgba(217,119,6,.32)]'
                              : 'grayscale opacity-35',
                          )}
                        />
                        {unlocked ? (
                          <span className={cn('absolute right-0 top-0 grid size-5 place-items-center rounded-full border shadow-sm', isPremium ? 'border-emerald-200/35 bg-emerald-300 text-emerald-950' : 'border-white bg-emerald-500 text-white')}>
                            <Check className="size-3" aria-hidden="true" />
                          </span>
                        ) : (
                          <span className="absolute right-0 top-0 grid size-5 place-items-center rounded-full border border-white/20 bg-slate-950/75 text-white shadow-sm">
                            <Lock className="size-3" aria-hidden="true" />
                          </span>
                        )}
                        {unlocked && <Sparkles className={cn('absolute left-1 top-1 size-4 animate-pulse', isPremium ? 'text-yellow-100' : 'text-amber-500')} aria-hidden="true" />}
                      </span>
                      <span className={cn('mt-1 line-clamp-2 min-h-8 text-[11px] font-black leading-tight sm:text-xs', isPremium ? 'text-white' : 'text-slate-800 dark:text-white')}>
                        {t(trophy.titleKey)}
                      </span>
                      <span className={cn('mt-1 text-[9px] font-bold leading-relaxed sm:text-[10px]', unlocked ? isPremium ? 'text-emerald-200' : 'text-emerald-700 dark:text-emerald-300' : isPremium ? 'text-white/50' : 'text-slate-500 dark:text-slate-400')}>
                        {progressLabel(trophy, progress, language, t)}
                      </span>
                      <span className={cn('mt-2 h-1.5 w-full overflow-hidden rounded-full', isPremium ? 'bg-white/10' : 'bg-slate-100 dark:bg-slate-800')}>
                        <span className={cn('block h-full rounded-full transition-[width] duration-500', unlocked ? isPremium ? 'bg-gradient-to-r from-amber-300 to-teal-300 shadow-[0_0_10px_rgba(45,212,191,.5)]' : 'bg-gradient-to-r from-amber-500 to-yellow-300' : isPremium ? 'bg-gradient-to-r from-amber-300/70 to-teal-300/70' : 'bg-gradient-to-r from-amber-400 to-teal-500')} style={{ width: `${progress.percent}%` }} />
                      </span>
                    </button>

                    {unlocked && (
                      <span role="tooltip" className={cn(
                        'pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-max max-w-[min(80vw,240px)] -translate-x-1/2 rounded-xl border px-3 py-2 text-left text-[10px] font-semibold leading-relaxed shadow-xl group-hover/trophy:block group-focus-within/trophy:block',
                        isPremium ? 'border-white/10 bg-[#12090a]/95 text-white shadow-black/40' : 'border-slate-200 bg-white text-slate-700 shadow-slate-900/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white',
                      )}>
                        <span className="block">{dateCopy}</span>
                        <span className={cn('mt-0.5 block', isPremium ? 'text-amber-100' : 'text-amber-700 dark:text-amber-200')}>{rewardCopy}</span>
                      </span>
                    )}
                  </div>
                )
              })}
              <span className={cn('pointer-events-none absolute bottom-1 left-3 right-3 h-px', isPremium ? 'bg-gradient-to-r from-transparent via-amber-200/35 to-transparent shadow-[0_0_10px_rgba(250,204,21,.55)]' : 'bg-gradient-to-r from-transparent via-amber-300/60 to-transparent')} aria-hidden="true" />
              <span className={cn('pointer-events-none absolute bottom-0 left-6 right-6 h-1 rounded-full', isPremium ? 'bg-gradient-to-r from-amber-300/10 via-teal-200/50 to-amber-300/10 shadow-[0_0_14px_rgba(45,212,191,.28)]' : 'bg-gradient-to-r from-amber-200/20 via-amber-300/60 to-amber-200/20')} aria-hidden="true" />
            </div>
            {shelfIndex < TROPHY_SHELVES.length - 1 && <div className={cn('mx-5 h-1 rounded-full', isPremium ? 'bg-gradient-to-r from-amber-300/5 via-amber-200/20 to-teal-200/10' : 'bg-gradient-to-r from-transparent via-amber-200/50 to-transparent')} aria-hidden="true" />}
          </section>
        ))}
      </div>

      {selectedTrophy && selectedProgress && (
        <div className={cn('mt-4 rounded-2xl border p-3 sm:p-4', isPremium ? 'border-white/10 bg-black/30' : 'border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-950/40')}>
          <div className="flex items-start gap-3">
            <img src={selectedTrophy.image} alt="" className={cn('size-16 shrink-0 object-contain', selectedRecord || selectedProgress.unlocked ? 'drop-shadow-[0_0_12px_rgba(250,204,21,.3)]' : 'grayscale opacity-35')} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className={cn('text-xs font-black sm:text-sm', isPremium ? 'text-white' : 'text-slate-900 dark:text-white')}>{t(selectedTrophy.titleKey)}</h4>
                <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-black uppercase', selectedRecord || selectedProgress.unlocked ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : isPremium ? 'bg-white/10 text-white/55' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300')}>
                  {t(selectedRecord || selectedProgress.unlocked ? 'trophy.status.unlocked' : 'trophy.status.locked')}
                </span>
              </div>
              <p className={cn('mt-1 text-[10px] leading-relaxed sm:text-xs', isPremium ? 'text-white/60' : 'text-slate-500 dark:text-slate-400')}>{t(selectedTrophy.descriptionKey)}</p>
              <div className={cn('mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold', isPremium ? 'text-amber-100/80' : 'text-amber-800 dark:text-amber-200')}>
                {selectedRecord && <span>{selectedRecord.unlockedAt ? t('trophy.tooltip.date', { date: unlockDate(selectedRecord, language) }) : t('trophy.tooltip.dateUnknown')}</span>}
                {selectedRecord && <span>{selectedRecord.historical ? t('trophy.tooltip.historical') : t('trophy.tooltip.reward', { xp: (Number(selectedRecord.rewardXp) || 0).toLocaleString(language) })}</span>}
                {!selectedRecord && <span>{progressLabel(selectedTrophy, selectedProgress, language, t)}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
