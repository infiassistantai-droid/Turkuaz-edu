import { useEffect, useState } from 'react'
import {
  CalendarDays,
  Flame,
  Clock,
  CheckCircle2,
  Circle,
  Trophy,
  Sparkles,
  BookOpenText,
  Headphones,
  PenLine,
  Mic,
  FileCheck2,
  Users2,
  Lightbulb,
  Check,
} from 'lucide-react'
import { appInfo } from '../data/mockExamData'
import { cn } from '../lib/utils'
import { loadJSON, saveJSON } from '../lib/storage'
import { useI18n } from '../lib/i18n.jsx'
import DailyQuests from './DailyQuests'

const COLOR_CLASSES = {
  turk: { text: 'text-teal-700 dark:text-teal-300', bg: 'bg-teal-50 dark:bg-teal-500/10', ring: 'ring-teal-600/15 dark:ring-teal-400/20', bar: 'bg-teal-500' },
  cyan: { text: 'text-teal-700 dark:text-teal-300', bg: 'bg-teal-50 dark:bg-cyan-500/10', ring: 'ring-cyan-600/15 dark:ring-cyan-400/20', bar: 'bg-cyan-500' },
  rose: { text: 'text-teal-700 dark:text-teal-300', bg: 'bg-teal-50 dark:bg-teal-500/10', ring: 'ring-teal-600/15 dark:ring-teal-400/20', bar: 'bg-teal-500' },
  amber: { text: 'text-cyan-700 dark:text-cyan-300', bg: 'bg-cyan-50 dark:bg-cyan-500/10', ring: 'ring-cyan-600/15 dark:ring-cyan-400/20', bar: 'bg-cyan-500' },
}

const ICONS = {
  BookOpen: BookOpenText,
  Headphones,
  PenLine,
  Mic,
  Exam: FileCheck2,
  Lugat: Users2,
}

// Today's schedule — each task ties to a module
const TASKS = [
  { id: 'lugat', time: '07:30', minutes: 15, xp: 10, icon: 'Lugat', labelKey: 'plan.task.vocab', module: 'lugat', tone: 'turk' },
  { id: 'okuma', time: '08:00', minutes: 20, xp: 30, icon: 'BookOpen', labelKey: 'plan.task.reading', module: 'okuma', tone: 'cyan' },
  { id: 'dinleme', time: '12:30', minutes: 25, xp: 50, icon: 'Headphones', labelKey: 'plan.task.listening', module: 'dinleme', tone: 'rose' },
  { id: 'yazma', time: '15:00', minutes: 30, xp: 40, icon: 'PenLine', labelKey: 'plan.task.writing', module: 'writing-practice', tone: 'amber' },
  { id: 'konusma', time: '18:30', minutes: 20, xp: 60, icon: 'Mic', labelKey: 'plan.task.speaking', module: 'konusma', tone: 'turk' },
  { id: 'exam', time: '20:00', minutes: 15, xp: 50, icon: 'Exam', labelKey: 'plan.task.mock', module: 'mock', tone: 'cyan' },
]

function fmtToday(language) {
  const date = new Date()
  const monthNames = {
    uz: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
    tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  }
  const month = (monthNames[language] || monthNames.uz)[date.getMonth()]
  return language === 'en' ? `${month} ${date.getDate()}` : `${date.getDate()} ${month}`
}

function daysUntilExam() {
  const exam = new Date(appInfo.examDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
}

export default function KunlikReja({ stats, navigate, addXp, isPremium = false }) {
  const { t, language } = useI18n()
  const today = new Date().toLocaleDateString('en-CA')
  const storageKey = `turkish-marathon-daily-plan-${today}`
  const savedPlan = loadJSON(storageKey, {})
  const [done, setDone] = useState(() => savedPlan.done || {})
  const [rewarded, setRewarded] = useState(() => savedPlan.rewarded || [])

  useEffect(() => {
    saveJSON(storageKey, { done, rewarded })
  }, [storageKey, done, rewarded])

  function toggleTask(task) {
    const willComplete = !done[task.id]
    setDone((previous) => ({ ...previous, [task.id]: willComplete }))
    if (willComplete && !rewarded.includes(task.id)) {
      addXp?.(task.xp)
      setRewarded((previous) => [...previous, task.id])
    }
  }
  const completedCount = TASKS.filter((t) => done[t.id]).length
  const earnedXp = TASKS.filter((t) => done[t.id]).reduce((sum, t) => sum + t.xp, 0)
  const allDone = completedCount === TASKS.length

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 to-teal-600 p-6 text-white shadow-xl shadow-cyan-900/20 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-bold tracking-widest text-white/70">
              {t('plan.today', { date: fmtToday(language) })}
            </div>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{t('plan.title')}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 ring-1 ring-white/20 backdrop-blur-sm">
            <Flame className="h-5 w-5 text-cyan-200" />
            <div className="leading-tight">
              <div className="font-display text-lg font-extrabold">{stats.streak}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/70">{t('plan.streak')}</div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/85">
          {t('plan.countdown', { days: daysUntilExam(), count: TASKS.length, xp: TASKS.reduce((sum, task) => sum + task.xp, 0) })}
        </p>
      </div>

      <DailyQuests isPremium={isPremium} />

      {/* Progress strip */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
            <CheckCircle2 className={cn('h-5 w-5', allDone ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400')} />
            {t('plan.done', { done: completedCount, total: TASKS.length })}
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-teal-700 dark:text-teal-300">
            <Trophy className="h-5 w-5" />
            {t('plan.xpEarned', { earned: earnedXp, total: TASKS.reduce((sum, task) => sum + task.xp, 0) })}
          </div>
          {allDone && (
            <span className="flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-1.5 text-sm font-extrabold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
              <Sparkles className="h-4 w-4" />
              {t('plan.perfect')}
            </span>
          )}
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 pbar"
            style={{ width: `${(completedCount / TASKS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative space-y-4 pl-2">
        {/* vertical line */}
        <div className="absolute bottom-4 left-[19px] top-4 w-0.5 bg-gradient-to-b from-teal-200 via-slate-200 to-transparent dark:from-teal-800 dark:via-slate-700" />
        {TASKS.map((task) => {
          const tone = COLOR_CLASSES[task.tone]
          const Icon = ICONS[task.icon]
          const isDone = !!done[task.id]
          return (
            <div
              key={task.id}
              className={cn(
                'relative flex items-center gap-4 rounded-2xl border p-4 transition-all',
                isDone
                  ? 'border-teal-200 bg-teal-50/60 dark:border-teal-800/50 dark:bg-teal-500/10'
                  : 'border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80',
              )}
            >
              {/* time node */}
              <div className="relative z-10 flex w-16 shrink-0 flex-col items-center">
                <span
                  className={cn(
                    'grid h-10 w-10 place-items-center rounded-full ring-4 ring-white dark:ring-slate-800',
                    tone.bg,
                    tone.text,
                  )}
                >
                  {isDone ? <Check className="h-5 w-5" /> : <Clock className="h-4 w-4" />}
                </span>
                <span className="mt-1 font-display text-xs font-extrabold text-slate-500 dark:text-slate-400">
                  {task.time}
                </span>
              </div>

              {/* content */}
              <button
                type="button"
                onClick={() => navigate(task.module)}
                className="min-w-0 flex-1 text-left transition-colors hover:text-teal-700 active:scale-[0.99]"
              >
                <div className="flex items-center gap-2">
                  <Icon className={cn('h-4 w-4 shrink-0', tone.text)} />
                  <span className={cn('text-sm font-bold', isDone ? 'text-teal-700 dark:text-teal-300' : 'text-slate-800 dark:text-white')}>
                    {t(task.labelKey)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  <span>{t('plan.minutes', { count: task.minutes })}</span>
                  <span className={cn('font-bold', tone.text)}>+{task.xp} XP</span>
                </div>
              </button>

              {/* checkbox */}
              <button
                type="button"
                onClick={() => toggleTask(task)}
                className={cn(
                  'grid h-8 w-8 shrink-0 place-items-center rounded-xl border-2 transition-all active:scale-90',
                  isDone
                    ? 'border-teal-500 bg-teal-500 text-white'
                    : 'border-slate-300 text-transparent hover:border-teal-400 dark:border-slate-600',
                )}
                aria-label={isDone ? t('plan.undo') : t('plan.markDone')}
              >
                {isDone ? <Check className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </button>
            </div>
          )
        })}
      </div>

      {/* Tip card */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-3xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-600 dark:text-teal-300" />
          <div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">{t('plan.tip.reading.title')}</div>
            <div className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {t('plan.tip.reading.body')}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-3xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-400" />
          <div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">{t('plan.tip.streak.title')}</div>
            <div className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {t('plan.tip.streak.body', { days: stats.streak })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
