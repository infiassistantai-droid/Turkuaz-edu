import { useMemo } from 'react'
import { ArrowRight, Sparkles, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'
import { getTrophy } from '../lib/trophies'
import { Dialog } from './ui/dialog'

const CONFETTI = Array.from({ length: 36 }, (_, index) => ({
  id: index,
  left: `${5 + ((index * 41) % 90)}%`,
  top: `${4 + ((index * 29) % 62)}%`,
  delay: `${(index % 9) * 85}ms`,
  duration: `${1100 + ((index * 97) % 900)}ms`,
  size: `${5 + (index % 4) * 2}px`,
  x: `${((index * 37) % 160) - 80}px`,
  y: `${-70 - (index % 7) * 15}px`,
  rotation: `${(index * 47) % 300}deg`,
  tone: index % 4,
}))

export default function TrophyCelebrationModal({ event, isPremium = false, dark = false, onDismiss }) {
  const { language, t } = useI18n()
  const trophy = useMemo(() => event ? getTrophy(event.trophyId) : null, [event])
  if (!event || !trophy) return null
  const locale = { uz: 'uz-UZ', en: 'en-US', tr: 'tr-TR' }[language] || 'en-US'
  const date = event.unlockedAt
    ? new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(event.unlockedAt))
    : null

  return (
    <Dialog
      open={Boolean(event)}
      onOpenChange={(open) => { if (!open) onDismiss?.() }}
      isPremium={isPremium}
      dark={dark}
      labelledBy="trophy-celebration-title"
      className={cn(
        'max-w-xl overflow-hidden',
        isPremium
          ? 'border-white/10 bg-black/75 text-white shadow-[0_0_90px_rgba(250,204,21,.2)]'
          : dark
            ? 'border-slate-700 bg-slate-900 text-slate-100 shadow-[0_24px_90px_rgba(0,0,0,.5)]'
            : 'border-white bg-white text-slate-900 shadow-[0_24px_90px_rgba(120,78,10,.2)]',
      )}
    >
      <div className="relative isolate overflow-hidden px-5 pb-6 pt-8 text-center sm:px-9 sm:pb-8 sm:pt-9">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_24%,rgba(250,204,21,.2),transparent_46%),radial-gradient(ellipse_at_18%_80%,rgba(34,211,238,.12),transparent_42%)]" aria-hidden="true" />
        <div className="streak-confetti-field pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {CONFETTI.map((piece) => (
            <span
              key={piece.id}
              className={cn('streak-confetti absolute rounded-sm', `streak-confetti-tone-${piece.tone}`)}
              style={{ left: piece.left, top: piece.top, animationDelay: piece.delay, animationDuration: piece.duration, width: piece.size, height: `${Number.parseInt(piece.size, 10) * 1.7}px`, '--streak-x': piece.x, '--streak-y': piece.y, '--streak-rotation': piece.rotation }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className={cn('absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-xl transition-colors', isPremium ? 'text-white/55 hover:bg-white/10 hover:text-white' : dark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700')}
          aria-label={t('trophy.celebrate.close')}
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <span className={cn('mx-auto inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[.2em]', isPremium ? 'border-amber-200/25 bg-amber-300/10 text-amber-100 shadow-[0_0_22px_rgba(250,204,21,.12)]' : dark ? 'border-amber-200/20 bg-amber-300/10 text-amber-200' : 'border-amber-200 bg-amber-50 text-amber-800')}>
          <Sparkles className="size-3.5" aria-hidden="true" />{t('trophy.celebrate.eyebrow')}
        </span>
        <h2 id="trophy-celebration-title" className="mt-4 text-2xl font-black tracking-tight sm:text-4xl">
          {t('trophy.celebrate.title')}
        </h2>
        <p className={cn('mx-auto mt-2 max-w-md text-sm leading-relaxed sm:text-base', isPremium ? 'text-white/75' : dark ? 'text-slate-300' : 'text-slate-600')}>
          {t('trophy.celebrate.message', { trophy: t(trophy.titleKey) })}
        </p>

        <div className={cn('relative mx-auto mt-5 grid max-w-md grid-cols-[128px_1fr] items-center gap-3 rounded-2xl border p-3 text-left sm:mt-6 sm:grid-cols-[164px_1fr] sm:gap-5 sm:p-4', isPremium ? 'border-white/10 bg-black/35 shadow-[0_0_38px_rgba(250,204,21,.13)]' : dark ? 'border-slate-700 bg-slate-800/80 shadow-black/20' : 'border-amber-100 bg-amber-50/35 shadow-lg shadow-amber-900/5')}>
          <div className={cn('grid aspect-square place-items-center rounded-2xl border p-1', isPremium ? 'border-amber-200/20 bg-black/40 shadow-[0_0_30px_rgba(250,204,21,.16)]' : dark ? 'border-slate-700 bg-slate-900 shadow-black/30' : 'border-amber-100 bg-white shadow-md')}>
            <img src={trophy.image} alt={t(trophy.titleKey)} className="size-full object-contain drop-shadow-[0_5px_12px_rgba(120,78,10,.32)]" />
          </div>
          <div className="min-w-0">
            <p className={cn('text-[10px] font-black uppercase tracking-[.16em]', isPremium ? 'text-amber-200' : dark ? 'text-amber-300' : 'text-amber-700')}>
              {t('trophy.status.unlocked')}
            </p>
            <p className="mt-1 text-lg font-black leading-tight sm:text-2xl">{t(trophy.titleKey)}</p>
            <p className={cn('mt-2 text-xs leading-relaxed', isPremium ? 'text-white/60' : dark ? 'text-slate-300' : 'text-slate-500')}>{t(trophy.descriptionKey)}</p>
            <p className={cn('mt-2 text-[11px] font-extrabold', isPremium ? 'text-amber-100' : dark ? 'text-amber-200' : 'text-amber-800')}>
              {t('trophy.tooltip.reward', { xp: Number(event.rewardXp || trophy.rewardXp || 0).toLocaleString(language) })}
            </p>
            {date && <p className={cn('mt-1 text-[10px] font-semibold', isPremium ? 'text-white/45' : dark ? 'text-slate-400' : 'text-slate-400')}>{t('trophy.tooltip.date', { date })}</p>}
          </div>
          <img
            src="/images/mascot/success.png"
            alt={t('mascot.aria')}
            className={cn('mascot-cheer pointer-events-none absolute -right-1 -top-16 size-20 object-contain drop-shadow-[0_6px_14px_rgba(15,23,42,.32)] sm:-right-5 sm:-top-20 sm:size-28', isPremium && 'drop-shadow-[0_0_20px_rgba(34,211,238,.42)]')}
          />
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className={cn('mx-auto mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition hover:-translate-y-0.5', isPremium ? 'bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 text-slate-950 shadow-[0_0_28px_rgba(250,204,21,.3)]' : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 shadow-lg shadow-amber-700/20')}
        >
          {t('trophy.celebrate.continue')}<ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </Dialog>
  )
}
