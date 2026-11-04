import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'
import { getRankProgress } from '../lib/ranks'

export default function RankBadge({ xp = 0, isPremium = false, size = 'header', showTooltip = false, className }) {
  const { language, t } = useI18n()
  const progress = getRankProgress(xp)
  const rankTitle = t(progress.rank.titleKey)
  const nextRankTitle = progress.nextRank ? t(progress.nextRank.titleKey) : null
  const tooltipText = progress.nextRank
    ? t('rank.tooltip.next', { rank: nextRankTitle, xp: progress.xpToNextRank.toLocaleString(language) })
    : t('rank.tooltip.max')
  const isLarge = size === 'large'

  return (
    <span className={cn('group/rank relative inline-flex shrink-0 align-middle', className)}>
      <span
        role="img"
        aria-label={`${rankTitle} · ${t('rank.level', { level: progress.level })}`}
        title={tooltipText}
        tabIndex={showTooltip ? 0 : undefined}
        className={cn(
          'relative grid place-items-center overflow-hidden rounded-xl border transition-transform duration-200 group-hover/rank:scale-[1.04]',
          size === 'profile' ? 'size-16 sm:size-20 rounded-2xl' : isLarge ? 'size-24 sm:size-28 rounded-2xl' : 'size-9 sm:size-10',
          isPremium
            ? 'border-white/10 bg-black/30 shadow-[0_0_22px_rgba(34,211,238,.18)]'
            : 'border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,.14)]',
        )}
      >
        <img
          src={progress.rank.image}
          alt=""
          draggable="false"
          className="size-full object-contain p-0.5 drop-shadow-[0_4px_8px_rgba(0,0,0,.38)]"
        />
        {!isLarge && <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" aria-hidden="true" />}
      </span>

      {showTooltip && (
        <span
          role="tooltip"
          className={cn(
            'pointer-events-none invisible absolute left-1/2 top-full z-[120] mt-2 w-64 -translate-x-1/2 translate-y-1 rounded-xl border p-3 opacity-0 shadow-2xl transition-all duration-150 group-hover/rank:visible group-hover/rank:translate-y-0 group-hover/rank:opacity-100 group-focus-within/rank:visible group-focus-within/rank:translate-y-0 group-focus-within/rank:opacity-100',
            isPremium ? 'border-white/10 bg-slate-950/95 text-white backdrop-blur-xl' : 'border-slate-200 bg-white text-slate-800',
          )}
        >
          <span className="block text-xs font-extrabold">{tooltipText}</span>
          {progress.nextRank && (
            <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-slate-200/60 dark:bg-white/10" aria-hidden="true">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 shadow-[0_0_12px_rgba(34,211,238,.55)]"
                style={{ width: `${progress.progress}%` }}
              />
            </span>
          )}
          <span className={cn('mt-2 block text-[10px] font-semibold', isPremium ? 'text-white/55' : 'text-slate-500')}>
            {t('rank.level', { level: progress.level })}
          </span>
        </span>
      )}
    </span>
  )
}
