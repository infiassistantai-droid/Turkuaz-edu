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

const COLOR_CLASSES = {
  turk: { text: 'text-teal-700 dark:text-teal-300', bg: 'bg-teal-50 dark:bg-teal-500/10', ring: 'ring-teal-600/15 dark:ring-teal-400/20', bar: 'bg-teal-500' },
  cyan: { text: 'text-teal-700 dark:text-teal-300', bg: 'bg-teal-50 dark:bg-cyan-500/10', ring: 'ring-cyan-600/15 dark:ring-cyan-400/20', bar: 'bg-cyan-500' },
  rose: { text: 'text-rose-600 dark:text-rose-300', bg: 'bg-rose-50 dark:bg-rose-500/10', ring: 'ring-rose-600/15 dark:ring-rose-400/20', bar: 'bg-rose-500' },
  amber: { text: 'text-amber-600 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-500/10', ring: 'ring-amber-600/15 dark:ring-amber-400/20', bar: 'bg-amber-500' },
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
  { id: 'lugat', time: '07:30', duration: '15 daqiqa', xp: 10, icon: 'Lugat', label: 'Lugʻat xotiralash — 12 ta yangi soʻz', module: 'lugat', tone: 'turk' },
  { id: 'okuma', time: '08:00', duration: '20 daqiqa', xp: 30, icon: 'BookOpen', label: 'Bir maqola oʻqib chiqing (B2)', module: 'okuma', tone: 'cyan' },
  { id: 'dinleme', time: '12:30', duration: '25 daqiqa', xp: 50, icon: 'Headphones', label: 'Tinglash treningi — «Kitap Kafe»HE', module: 'dinleme', tone: 'rose' },
  { id: 'yazma', time: '15:00', duration: '30 daqiqa', xp: 40, icon: 'PenLine', label: '1 rasmiy mektup yozing (60–80 soʻz)', module: 'yazma', tone: 'amber' },
  { id: 'konusma', time: '18:30', duration: '20 daqiqa', xp: 60, icon: 'Mic', label: '2 daqiqa gapirish — mavzu kartalari', module: 'konusma', tone: 'turk' },
  { id: 'exam', time: '20:00', duration: '15 daqiqa', xp: 50, icon: 'Exam', label: 'Kunlik mock mashq — 10 savol', module: 'mock', tone: 'rose' },
]

function fmtToday() {
  const d = new Date()
  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr',
  ]
  return `${d.getDate()} ${months[d.getMonth()]}`
}

function daysUntilExam() {
  const exam = new Date(appInfo.examDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
}

export default function KunlikReja({ stats, progress, navigate, addXp }) {
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
            <div className="text-xs font-bold uppercase tracking-widest text-white/70">
              Bugun · {fmtToday()}
            </div>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Kunlik reja</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 ring-1 ring-white/20 backdrop-blur-sm">
            <Flame className="h-5 w-5 text-amber-300" />
            <div className="leading-tight">
              <div className="font-display text-lg font-extrabold">{stats.streak}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/70">seriya</div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/85">
          Imtihongacha {daysUntilExam()} kun qoldi — bu kun uchun 6 ta mashq tayyorlandi.
          Har birini tugatib {TASKS.reduce((s, t) => s + t.xp, 0)} XP toʻplashingiz mumkin.
        </p>
      </div>

      {/* Progress strip */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
            <CheckCircle2 className={cn('h-5 w-5', allDone ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400')} />
            Tugallandi: {completedCount}/{TASKS.length}
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400">
            <Trophy className="h-5 w-5" />
            Yigʻilgan XP: {earnedXp} / {TASKS.reduce((s, t) => s + t.xp, 0)}
          </div>
          {allDone && (
            <span className="flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-1.5 text-sm font-extrabold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
              <Sparkles className="h-4 w-4" />
              Kun mukammal oʻtdi! 🎉
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
                    {task.label}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  <span>{task.duration}</span>
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
                aria-label={isDone ? 'Olib tashlash' : 'Tugallandi deb belgilash'}
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
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">Sarguzashtli oʻqish</div>
            <div className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Har bir mashqdan keyin 10 daqiqa nafas olib, yangi soʻzlarni bir necha marta
              yozing — xotira mustahkamlanadi.
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-3xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-400" />
          <div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">Davolanmang!</div>
            <div className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Har kun bir xil vaqtda trening qilish seriyangizni saqlab qolishning eng yaxshi
              usuli. {stats.streak} kun — ajoyib natija!
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
