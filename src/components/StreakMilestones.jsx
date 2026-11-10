import { useMemo, useState } from 'react'
import { Check, Flame, Lock, Sparkles } from 'lucide-react'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'
import { getNextStreakMilestone, STREAK_MILESTONES } from '../lib/streakMilestones'
import { useWinterUpdate } from '../features/winter/WinterUpdateContext'
import { getWinterStudyDayCount, WINTER_CHAMPION_DAYS } from '../features/winter/winterSeason'

export default function StreakMilestones({ currentStreak = 0, unlockedMilestones = [], isPremium = false, compact = false, showHeader = true, winterStudy = null, winterChampionUnlocked = false }) {
  const { language, t } = useI18n()
  const { featureEnabled: winterFeatureEnabled } = useWinterUpdate()
  const winterDays = getWinterStudyDayCount(winterStudy)
  const [selectedDays, setSelectedDays] = useState(null)
  const numericStreak = Number(currentStreak)
  const safeStreak = Number.isFinite(numericStreak) ? Math.max(0, Math.floor(numericStreak)) : 0
  const unlockedSet = useMemo(() => new Set([
    ...(Array.isArray(unlockedMilestones) ? unlockedMilestones : []).map(Number),
    ...STREAK_MILESTONES.filter(({ days }) => safeStreak >= days).map(({ days }) => days),
  ]), [unlockedMilestones, safeStreak])
  const nextMilestone = getNextStreakMilestone(safeStreak)
  const selectedMilestone = STREAK_MILESTONES.find(({ days }) => days === selectedDays)
    || nextMilestone
    || STREAK_MILESTONES[STREAK_MILESTONES.length - 1]
  const selectedUnlocked = unlockedSet.has(selectedMilestone.days)
  const previousMilestone = [...STREAK_MILESTONES].reverse().find(({ days }) => days < selectedMilestone.days)
  const rangeStart = previousMilestone?.days || 0
  const progress = selectedUnlocked
    ? 100
    : Math.max(0, Math.min(100, ((safeStreak - rangeStart) / (selectedMilestone.days - rangeStart)) * 100))

  return (
    <section
      className={cn(
        'overflow-hidden rounded-2xl border',
        isPremium
          ? 'border-white/10 bg-black/30 text-white shadow-[0_12px_40px_rgba(0,0,0,.22)] backdrop-blur-xl'
          : 'border-slate-200 bg-white text-slate-900 shadow-[0_10px_32px_rgba(15,23,42,.07)] dark:border-slate-700 dark:bg-slate-900/90 dark:text-white',
      )}
      aria-label={t('streak.showcase.title')}
    >
      {showHeader && (
        <header className={cn('flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5', isPremium ? 'border-white/10' : 'border-slate-100 dark:border-slate-700')}>
          <div className="flex min-w-0 items-center gap-3">
            <span className={cn(
              'grid size-10 shrink-0 place-items-center rounded-xl border',
              isPremium ? 'border-amber-200/25 bg-amber-300/10 text-amber-200 shadow-[0_0_20px_rgba(250,204,21,.14)]' : 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200',
            )}>
              <Flame className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-black">{t('streak.showcase.title')}</h3>
              <p className={cn('mt-0.5 text-[11px] font-medium', isPremium ? 'text-white/55' : 'text-slate-500 dark:text-slate-400')}>
                {t('streak.showcase.subtitle')}
              </p>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 rounded-xl border px-3 py-1.5" aria-label={t('streak.current', { count: safeStreak })}>
            <span className={cn('text-xl font-black tabular-nums', isPremium ? 'text-amber-200' : 'text-amber-600 dark:text-amber-300')}>
              {safeStreak.toLocaleString(language)}
            </span>
            <span className={cn('text-[10px] font-extrabold uppercase tracking-wide', isPremium ? 'text-white/55' : 'text-slate-500 dark:text-slate-400')}>
              {t('streak.days')}
            </span>
          </div>
        </header>
      )}

      <div className={cn('grid grid-cols-4 gap-2.5 p-3 sm:grid-cols-6 sm:gap-3 sm:p-4', compact && 'xl:grid-cols-12')}>
        {STREAK_MILESTONES.map((milestone) => {
          const unlocked = unlockedSet.has(milestone.days)
          const visuallyUnlocked = unlocked
          const selected = selectedMilestone.days === milestone.days
          return (
            <button
              key={milestone.id}
              type="button"
              onClick={() => setSelectedDays(milestone.days)}
              aria-pressed={selected}
              aria-label={t('streak.badge.aria', {
                days: milestone.days.toLocaleString(language),
                status: t(unlocked ? 'streak.status.unlocked' : 'streak.status.locked'),
              })}
              title={`${t('streak.milestone.title', { days: milestone.days.toLocaleString(language) })} · ${t(unlocked ? 'streak.status.unlocked' : 'streak.status.locked')}`}
              className={cn(
                'group relative flex min-w-0 flex-col items-center rounded-xl border p-1.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
                isPremium
                  ? 'border-white/10 bg-white/[.035] hover:border-amber-200/30 hover:bg-white/[.07] focus-visible:ring-amber-200/50'
                  : 'border-slate-100 bg-slate-50/70 hover:border-amber-200 hover:bg-amber-50/40 focus-visible:ring-teal-500/40 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-amber-200/30 dark:hover:bg-slate-800',
                selected && (isPremium ? 'border-amber-200/45 bg-amber-300/[.08] shadow-[0_0_24px_rgba(250,204,21,.12)]' : 'border-amber-300 bg-amber-50/70 shadow-md shadow-amber-900/5 dark:bg-amber-300/10'),
                visuallyUnlocked && 'hover:-translate-y-0.5',
              )}
            >
              <span className="relative grid aspect-square w-full place-items-center">
                <img
                  src={milestone.image}
                  alt=""
                  loading="lazy"
                  draggable="false"
                  className={cn(
                    'size-full object-contain transition-all duration-300',
                    visuallyUnlocked
                      ? isPremium
                        ? 'drop-shadow-[0_0_15px_rgba(250,204,21,.35)] group-hover:drop-shadow-[0_0_22px_rgba(250,204,21,.58)]'
                        : 'drop-shadow-[0_4px_9px_rgba(120,78,10,.22)] group-hover:drop-shadow-[0_5px_16px_rgba(217,119,6,.4)]'
                      : 'grayscale opacity-40',
                  )}
                />
                {visuallyUnlocked ? (
                  <span className={cn(
                    'absolute right-0 top-0 grid size-5 place-items-center rounded-full border shadow-md',
                    isPremium ? 'border-emerald-200/40 bg-emerald-300 text-emerald-950 shadow-emerald-500/25' : 'border-white bg-emerald-500 text-white shadow-emerald-900/20',
                  )} aria-hidden="true">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                ) : (
                  <span className="absolute right-0 top-0 grid size-5 place-items-center rounded-full border border-white/20 bg-slate-950/80 text-white shadow-md" aria-hidden="true">
                    <Lock className="size-3" aria-hidden="true" />
                  </span>
                )}
                {selected && visuallyUnlocked && (
                  <Sparkles className={cn('absolute left-0 top-0 size-4 animate-pulse', isPremium ? 'text-yellow-100' : 'text-amber-500')} aria-hidden="true" />
                )}
              </span>
              <span className={cn('mt-1 max-w-full truncate text-[10px] font-black tabular-nums sm:text-xs', visuallyUnlocked ? isPremium ? 'text-amber-100' : 'text-amber-800 dark:text-amber-200' : isPremium ? 'text-white/45' : 'text-slate-500 dark:text-slate-400')}>
                {milestone.days.toLocaleString(language)} {t('streak.days')}
              </span>
            </button>
          )
        })}
      </div>

      <div className={cn('mx-3 mb-3 flex flex-col gap-2 rounded-xl border p-3 sm:mx-4 sm:mb-4 sm:flex-row sm:items-center sm:justify-between', isPremium ? 'border-white/10 bg-black/25' : 'border-slate-100 bg-white/80 dark:border-slate-700 dark:bg-slate-950/40')}>
        <div className="min-w-0">
          <p className={cn('text-xs font-extrabold', isPremium ? 'text-white' : 'text-slate-800 dark:text-white')}>
            {t('streak.milestone.title', { days: selectedMilestone.days.toLocaleString(language) })}
            <span className={cn('ml-2 inline-flex rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide', selectedUnlocked ? isPremium ? 'bg-emerald-300/15 text-emerald-200' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200' : isPremium ? 'bg-white/10 text-white/55' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400')}>
              {t(selectedUnlocked ? 'streak.status.unlocked' : 'streak.status.locked')}
            </span>
          </p>
          <p className={cn('mt-1 text-[11px] leading-relaxed', isPremium ? 'text-white/55' : 'text-slate-500 dark:text-slate-400')}>
            {t(selectedMilestone.descriptionKey, { days: selectedMilestone.days.toLocaleString(language) })}
          </p>
        </div>
        <div className="min-w-0 sm:w-48 sm:shrink-0">
          <div className="mb-1 flex items-center justify-between gap-2 text-[10px] font-bold">
            <span className={isPremium ? 'text-white/50' : 'text-slate-500 dark:text-slate-400'}>
              {selectedUnlocked ? t('streak.progress.completed') : t('streak.nextTarget', { days: selectedMilestone.days.toLocaleString(language) })}
            </span>
            <span className={isPremium ? 'text-amber-100' : 'text-amber-700 dark:text-amber-200'}>{Math.round(progress)}%</span>
          </div>
          <div
            className={cn('h-1.5 overflow-hidden rounded-full', isPremium ? 'bg-white/10' : 'bg-slate-100 dark:bg-slate-800')}
            role="progressbar"
            aria-label={t('streak.nextTarget', { days: selectedMilestone.days.toLocaleString(language) })}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div className={cn('h-full rounded-full transition-[width] duration-500', isPremium ? 'bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-300 shadow-[0_0_12px_rgba(250,204,21,.65)]' : 'bg-gradient-to-r from-amber-500 to-yellow-300')} style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {winterFeatureEnabled && (
        <div className={cn('mx-3 mb-3 flex flex-col gap-3 rounded-2xl border p-3 sm:mx-4 sm:mb-4 sm:flex-row sm:items-center', isPremium ? 'winter-frost border-sky-100/20 bg-emerald-950/35' : 'border-sky-200 bg-gradient-to-r from-sky-50/90 to-emerald-50/80 dark:border-sky-400/15 dark:from-slate-900 dark:to-emerald-950/30')}>
          <div className="relative grid size-14 shrink-0 place-items-center rounded-xl border border-sky-200/50 bg-sky-100/45 p-1 dark:border-sky-300/20 dark:bg-sky-300/10">
            <img src="/images/trophies/winter-champion.svg" alt="" className="size-full object-contain" />
            {winterChampionUnlocked && <Sparkles className="absolute -right-1 -top-1 size-4 animate-pulse text-sky-500" aria-hidden="true" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className={cn('text-xs font-black', isPremium ? 'text-sky-100' : 'text-emerald-950 dark:text-sky-100')}>{t('winter.badge.title')}</h4>
              <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide', winterChampionUnlocked ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-200' : 'bg-sky-500/10 text-sky-700 dark:text-sky-200')}>
                {t(winterChampionUnlocked ? 'streak.status.unlocked' : 'streak.status.locked')}
              </span>
            </div>
            <p className={cn('mt-1 text-[10px] leading-relaxed', isPremium ? 'text-white/60' : 'text-slate-600 dark:text-slate-300')}>{t('winter.badge.description')}</p>
            <div className="mt-2 flex items-center gap-2">
              <div className={cn('h-1.5 flex-1 overflow-hidden rounded-full', isPremium ? 'bg-white/10' : 'bg-white/80 dark:bg-slate-800')} role="progressbar" aria-label={t('winter.badge.aria', { current: winterDays, target: WINTER_CHAMPION_DAYS })} aria-valuemin={0} aria-valuemax={WINTER_CHAMPION_DAYS} aria-valuenow={Math.min(winterDays, WINTER_CHAMPION_DAYS)}>
                <div className="h-full rounded-full bg-gradient-to-r from-sky-400 via-slate-200 to-emerald-500 transition-[width] duration-500" style={{ width: `${Math.min(100, winterDays / WINTER_CHAMPION_DAYS * 100)}%` }} />
              </div>
              <span className={cn('shrink-0 text-[10px] font-extrabold tabular-nums', isPremium ? 'text-sky-100' : 'text-emerald-800 dark:text-sky-100')}>{t('winter.badge.progress', { current: winterDays, target: WINTER_CHAMPION_DAYS })}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
