import { useMemo } from 'react'
import { ArrowRight, Sparkles, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'
import { getRankForLevel } from '../lib/ranks'
import { Dialog } from './ui/dialog'

const PARTICLES = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 37) % 84)}%`,
  top: `${12 + ((index * 53) % 74)}%`,
  delay: `${(index % 8) * 90}ms`,
  duration: `${900 + ((index * 113) % 700)}ms`,
  size: `${4 + (index % 4) * 2}px`,
  x: `${((index * 29) % 101) - 50}px`,
  y: `${-34 - (index % 5) * 12}px`,
  tone: index % 3 === 0 ? 'rank-particle-gold' : 'rank-particle-teal',
}))

export default function RankUpModal({ event, isPremium = false, dark = false, onDismiss }) {
  const { language, t } = useI18n()
  const rank = useMemo(() => event ? getRankForLevel(event.level) : null, [event])
  if (!event || !rank) return null
  const rankTitle = t(rank.titleKey)

  return (
    <Dialog
      open={Boolean(event)}
      onOpenChange={(open) => { if (!open) onDismiss?.() }}
      isPremium={isPremium}
      dark={dark}
      labelledBy="rank-up-title"
      className={cn(
        'max-w-lg overflow-hidden',
        isPremium
          ? 'border-white/10 bg-black/75 text-white shadow-[0_0_80px_rgba(34,211,238,.22)]'
          : dark
            ? 'border-slate-700 bg-slate-900 text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,.5)]'
            : 'border-white bg-white text-slate-900 shadow-[0_24px_80px_rgba(13,148,136,.18)]',
      )}
    >
      <div className="relative isolate overflow-hidden px-6 pb-7 pt-8 text-center sm:px-10 sm:pb-9 sm:pt-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_20%,rgba(34,211,238,.2),transparent_50%),radial-gradient(ellipse_at_50%_100%,rgba(250,204,21,.12),transparent_45%)]" aria-hidden="true" />
        <div className="rank-particle-field pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {PARTICLES.map((particle) => (
            <span
              key={particle.id}
              className={cn('rank-particle absolute rounded-full', particle.tone)}
              style={{ left: particle.left, top: particle.top, animationDelay: particle.delay, animationDuration: particle.duration, width: particle.size, height: particle.size, '--rank-x': particle.x, '--rank-y': particle.y }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className={cn('absolute right-3 top-3 grid size-9 place-items-center rounded-xl transition-colors', isPremium ? 'text-white/55 hover:bg-white/10 hover:text-white' : dark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700')}
          aria-label={t('rankUp.close')}
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <span className={cn('mx-auto inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[.2em]', isPremium ? 'border-cyan-200/20 bg-cyan-300/10 text-cyan-100' : dark ? 'border-teal-300/20 bg-teal-300/10 text-teal-200' : 'border-teal-200 bg-teal-50 text-teal-800')}>
          <Sparkles className="size-3.5" aria-hidden="true" />{t('rankUp.eyebrow')}
        </span>
        <h2 id="rank-up-title" className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{t('rankUp.title')}</h2>
        <p className={cn('mx-auto mt-2 max-w-sm text-sm leading-relaxed', isPremium ? 'text-white/70' : dark ? 'text-slate-300' : 'text-slate-600')}>
          {t('rankUp.message', { rank: rankTitle })}
        </p>

        <div className={cn('relative mx-auto mt-6 flex max-w-sm items-center gap-4 rounded-2xl border p-3 text-left sm:gap-5 sm:p-4', isPremium ? 'border-white/10 bg-black/35 shadow-[0_0_35px_rgba(34,211,238,.12)]' : dark ? 'border-slate-700 bg-slate-800/80 shadow-black/20' : 'border-slate-200 bg-white/80 shadow-lg shadow-teal-900/5')}>
          <div className={cn('grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl border p-1 sm:size-28', isPremium ? 'border-cyan-200/20 bg-black/40 shadow-[0_0_28px_rgba(34,211,238,.2)]' : 'border-slate-200 bg-slate-950 shadow-md')}>
            <img src={rank.image} alt="" className="size-full object-contain drop-shadow-[0_4px_9px_rgba(0,0,0,.45)]" />
          </div>
          <div className="min-w-0">
            <p className={cn('text-[10px] font-extrabold uppercase tracking-[.16em]', isPremium ? 'text-cyan-200' : dark ? 'text-teal-300' : 'text-teal-700')}>{t('rankUp.newRank')}</p>
            <p className="mt-1 text-xl font-black leading-tight sm:text-2xl">{rankTitle}</p>
            <p className={cn('mt-2 text-xs font-bold', isPremium ? 'text-white/65' : dark ? 'text-slate-400' : 'text-slate-500')}>
              {t('rank.level', { level: event.level })} <span className="px-1 opacity-50">•</span> {Number(event.xp || 0).toLocaleString(language)} XP
            </p>
          </div>
          <Sparkles className={cn('absolute -right-2 -top-2 size-7 animate-pulse', isPremium ? 'text-yellow-200' : 'text-amber-400')} aria-hidden="true" />
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className={cn('mx-auto mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition hover:-translate-y-0.5', isPremium ? 'bg-gradient-to-r from-cyan-300 to-teal-300 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,.25)]' : 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-700/20')}
        >
          {t('rankUp.continue')}<ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </Dialog>
  )
}
