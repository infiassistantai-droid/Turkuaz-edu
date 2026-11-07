import { useEffect, useState } from 'react'
import { ArrowRight, BookOpenText, Check, Headphones, Sparkles } from 'lucide-react'
import { cn } from '../lib/utils'
import { loadJSON, saveJSON } from '../lib/storage'
import { useI18n } from '../lib/i18n.jsx'

const TASKS = [
  { id: 'vocabulary', icon: '📖', categoryKey: 'personalPlan.vocabulary', descriptionKey: 'personalPlan.vocabulary.task', xp: 20, tone: 'teal' },
  { id: 'reading', icon: '📝', categoryKey: 'personalPlan.reading', descriptionKey: 'personalPlan.reading.task', xp: 30, tone: 'cyan' },
  { id: 'listening', icon: '🎧', categoryKey: 'personalPlan.listening', descriptionKey: 'personalPlan.listening.task', xp: 30, tone: 'emerald' },
]

const TONES = {
  teal: 'bg-teal-500/10 text-teal-300 ring-teal-400/15',
  cyan: 'bg-cyan-500/10 text-cyan-300 ring-cyan-400/15',
  emerald: 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/15',
}

export default function PersonalPlanCard({ navigate }) {
  const { t } = useI18n()
  const today = new Date().toLocaleDateString('en-CA')
  const storageKey = `turkuaz-edu-personal-plan-${today}`
  const [completed, setCompleted] = useState(() => loadJSON(storageKey, {}))
  const completedCount = TASKS.filter((task) => completed[task.id]).length
  const progress = (completedCount / TASKS.length) * 100

  useEffect(() => {
    saveJSON(storageKey, completed)
  }, [storageKey, completed])

  return (
    <section className="glass premium-glass overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_14px_40px_-20px_rgba(15,23,42,.28)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85 dark:shadow-[0_20px_55px_-24px_rgba(0,0,0,.75)] sm:p-6" aria-labelledby="personal-plan-title">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-300 ring-1 ring-emerald-400/20">
          <Sparkles className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="personal-plan-title" className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-xl">{t('personalPlan.title')}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t('personalPlan.subtitle')}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-bold">
          <span className="text-slate-600 dark:text-slate-300">{t('personalPlan.progress', { done: completedCount, total: TASKS.length })}</span>
          <span className="tabular-nums text-emerald-600 dark:text-emerald-300">{Math.round(progress)}%</span>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          role="progressbar"
          aria-label={t('personalPlan.progressLabel')}
          aria-valuemin={0}
          aria-valuemax={TASKS.length}
          aria-valuenow={completedCount}
        >
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <ul className="mt-4 space-y-2.5">
        {TASKS.map((task) => {
          const done = Boolean(completed[task.id])
          const Icon = task.id === 'reading' ? BookOpenText : task.id === 'listening' ? Headphones : null
          return (
            <li key={task.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={done}
                onClick={() => setCompleted((previous) => ({ ...previous, [task.id]: !previous[task.id] }))}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 active:scale-[.99] sm:p-3.5',
                  done
                    ? 'border-emerald-500/25 bg-emerald-500/[.07]'
                    : 'border-slate-200/80 bg-white/50 hover:border-emerald-500/30 hover:bg-emerald-500/[.04] dark:border-slate-800 dark:bg-slate-950/30 dark:hover:bg-emerald-500/[.05]',
                )}
              >
                <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl text-xl ring-1', TONES[task.tone])} aria-hidden="true">
                  {task.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-[.12em] text-slate-500 dark:text-slate-400">{t(task.categoryKey)}</span>
                    {Icon && <Icon className="size-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />}
                  </span>
                  <span className={cn('mt-0.5 block text-sm font-semibold leading-snug', done ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-800 dark:text-slate-100')}>
                    {t(task.descriptionKey)}
                  </span>
                </span>
                <span className="shrink-0 rounded-lg bg-emerald-500/10 px-2 py-1 text-xs font-extrabold tabular-nums text-emerald-700 dark:text-emerald-300">+{task.xp} XP</span>
                <span className={cn('grid size-6 shrink-0 place-items-center rounded-full border transition-colors', done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent dark:border-slate-600')} aria-hidden="true">
                  {done && <Check className="size-4" strokeWidth={3} />}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        onClick={() => navigate?.('lugat')}
        className="group mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-950/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/30 active:translate-y-0 active:scale-[.99]"
      >
        {t('personalPlan.start')}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </button>
      <p className="sr-only">{completedCount === TASKS.length ? t('personalPlan.allDone') : ''}</p>
    </section>
  )
}
