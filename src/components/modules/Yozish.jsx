import { useMemo, useState } from 'react'
import { yozishTasks } from '../../data/yozishTasks'
import { cn } from '../../lib/utils'
import { useI18n } from '../../lib/i18n.jsx'

export function normalizeWritingAnswer(value) {
  return String(value || '').trim().replace(/\s+/gu, ' ').toLocaleLowerCase('tr-TR')
}

export default function Yozish({ onEarnXp, onReturnToDashboard, isPremium = false, dark = false }) {
  const { t } = useI18n()
  const isDark = Boolean(isPremium || dark)
  const [queue, setQueue] = useState(yozishTasks)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [earnedXp, setEarnedXp] = useState(0)
  const currentTask = queue[0] || null
  const progress = useMemo(() => yozishTasks.length - queue.length + 1, [queue.length])

  const checkAnswer = (event) => {
    event.preventDefault()
    if (!currentTask || !answer.trim()) return

    const isCorrect = normalizeWritingAnswer(answer) === normalizeWritingAnswer(currentTask.correctTr)
    setAnswer('')
    if (!isCorrect) {
      setFeedback('incorrect')
      return
    }

    setFeedback('correct')
    setQueue((previous) => previous.slice(1))
    setEarnedXp((previous) => previous + 10)
    onEarnXp?.(10)
  }

  const panel = cn(
    'rounded-2xl border p-5 sm:p-6',
    isPremium
      ? 'border-white/15 bg-black/30 text-white'
      : dark
        ? 'border-slate-700 bg-slate-900 text-slate-100'
        : 'border-slate-200 bg-white text-slate-900',
  )
  const muted = isDark ? 'text-white/65' : 'text-slate-600'
  const inputTone = isDark
    ? 'border-slate-600 bg-slate-950 text-white placeholder:text-slate-400 focus:border-teal-400 focus:ring-teal-400/15'
    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-teal-600/15'

  if (!currentTask) {
    return (
      <section className="mx-auto max-w-2xl" aria-labelledby="writing-drill-title">
        <div className={`${panel} text-center`}>
          <h1 id="writing-drill-title" className="text-xl font-bold">{t('writingDrill.complete', { xp: earnedXp })}</h1>
          <button
            type="button"
            onClick={onReturnToDashboard}
            className="mt-5 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            {t('writingDrill.return')}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-2xl space-y-4" aria-labelledby="writing-drill-title">
      <header className={panel}>
        <h1 id="writing-drill-title" className="text-xl font-bold">{t('writingDrill.title')}</h1>
        <p className={cn('mt-1 text-sm', muted)}>{t('writingDrill.subtitle')}</p>
      </header>

      <div className={panel}>
        <p className={cn('mb-3 text-xs font-semibold', muted)}>
          {t('writingDrill.progress', { current: progress, total: yozishTasks.length })}
        </p>
        <p lang="uz" className="text-lg font-semibold leading-relaxed">{currentTask.questionUz}</p>

        <form onSubmit={checkAnswer} className="mt-5 space-y-3">
          <label htmlFor="yozish-answer" className={cn('block text-sm font-medium', isDark ? 'text-slate-200' : 'text-slate-700')}>
            {t('writingDrill.inputLabel')}
          </label>
          <input
            id="yozish-answer"
            type="text"
            lang="tr"
            autoComplete="off"
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value)
              setFeedback(null)
            }}
            placeholder={t('writingDrill.placeholder')}
            className={cn('w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2', inputTone)}
          />
          <button
            type="submit"
            disabled={!answer.trim()}
            className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            {t('writingDrill.check')}
          </button>
        </form>

        {feedback && (
          <p role="status" aria-live="polite" className={cn('mt-4 text-sm font-medium', feedback === 'correct' ? isDark ? 'text-emerald-300' : 'text-emerald-700' : isDark ? 'text-rose-300' : 'text-rose-700')}>
            {t(feedback === 'correct' ? 'writingDrill.correct' : 'writingDrill.incorrect')}
          </p>
        )}
      </div>
    </section>
  )
}
