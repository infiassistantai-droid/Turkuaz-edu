import { useState } from 'react'
import { BookOpenText, CheckCircle2, Headphones, Sparkles, Zap } from 'lucide-react'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'

const TASKS = [
  { id: 'words', titleKey: 'dailyQuests.words', current: 1, target: 3, reward: 15, icon: BookOpenText },
  { id: 'listening', titleKey: 'dailyQuests.listening', current: 1, target: 1, reward: 30, icon: Headphones },
  { id: 'xp', titleKey: 'dailyQuests.xp', current: 20, target: 50, reward: 10, icon: Zap },
]

export default function DailyQuests({ isPremium = false }) {
  const { t } = useI18n()
  const [claimedIds, setClaimedIds] = useState(() => new Set())

  const claimReward = (id) => {
    setClaimedIds((previous) => new Set(previous).add(id))
  }

  return (
    <section className={cn(
      'rounded-3xl border p-5 shadow-sm sm:p-6',
      isPremium ? 'border-white/10 bg-black/40 text-white shadow-black/20 backdrop-blur-2xl' : 'border-slate-200/80 bg-white text-slate-900 shadow-slate-900/5',
    )}>
      <div className="mb-5">
        <h2 className="text-lg font-extrabold tracking-tight">{t('dailyQuests.title')}</h2>
      </div>

      <div className="space-y-3">
        {TASKS.map((task) => {
          const Icon = task.icon
          const complete = task.current >= task.target
          const claimed = claimedIds.has(task.id)
          const percent = Math.min(100, Math.round((task.current / task.target) * 100))

          return (
            <article
              key={task.id}
              className={cn(
                'rounded-2xl border p-4 transition-colors',
                isPremium ? 'border-white/10 bg-black/30 text-white shadow-black/20 backdrop-blur-xl' : 'border-slate-100 bg-white text-slate-900',
              )}
            >
              <div className="flex items-start gap-3">
                <span className={cn(
                  'grid size-10 shrink-0 place-items-center rounded-xl',
                  isPremium ? 'bg-white/10 text-yellow-100' : 'bg-teal-50 text-teal-700',
                )}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                    <h3 className="min-w-0 flex-1 text-sm font-bold leading-snug">{t(task.titleKey)}</h3>
                    <span className={cn('shrink-0 text-xs font-bold tabular-nums', isPremium ? 'text-white/65' : 'text-slate-500')}>
                      {task.current}/{task.target}
                    </span>
                  </div>
                  <div className={cn('mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold', isPremium ? 'bg-yellow-200/10 text-yellow-100' : 'bg-amber-50 text-amber-700')}>
                    +{task.reward} XP
                  </div>

                  {complete ? (
                    <div className="mt-3">
                      {claimed ? (
                        <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-300" aria-live="polite">
                          <CheckCircle2 className="size-4" aria-hidden="true" />
                          {t('dailyQuests.done')}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => claimReward(task.id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-3.5 py-2.5 text-xs font-extrabold text-white shadow-[0_0_22px_rgba(34,197,94,.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(34,197,94,.48)] active:translate-y-0"
                        >
                          <Sparkles className="size-3.5" aria-hidden="true" />
                          {t('dailyQuests.claim')}
                          <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">+{task.reward} XP</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3">
                      <div
                        className={cn('h-2 overflow-hidden rounded-full', isPremium ? 'bg-white/10' : 'bg-slate-100')}
                        role="progressbar"
                        aria-label={t(task.titleKey)}
                        aria-valuemin={0}
                        aria-valuemax={task.target}
                        aria-valuenow={task.current}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-500 ease-out"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className={cn('mt-1.5 text-[10px] font-semibold', isPremium ? 'text-white/45' : 'text-slate-400')}>
                        {percent}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
