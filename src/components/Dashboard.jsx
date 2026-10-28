import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpenText,
  CalendarCheck,
  Check,
  Headphones,
  Flame,
  Mic,
  PenLine,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { loadJSON, saveJSON } from '../lib/storage'
import { getCefrLevel } from '../lib/multilevelScoring'
import { useI18n } from '../lib/i18n.jsx'

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

const SKILLS = [
  {
    id: 'okuma',
    labelKey: 'skill.reading',
    subKey: 'skill.reading.sub',
    nextKey: 'skill.reading.next',
    actionKey: 'skill.reading.action',
    icon: BookOpenText,
    score: 0,
  },
  {
    id: 'dinleme',
    labelKey: 'skill.listening',
    subKey: 'skill.listening.sub',
    nextKey: 'skill.listening.next',
    actionKey: 'skill.listening.action',
    icon: Headphones,
    score: 0,
  },
  {
    id: 'yazma',
    labelKey: 'skill.writing',
    subKey: 'skill.writing.sub',
    nextKey: 'skill.writing.next',
    actionKey: 'skill.writing.action',
    icon: PenLine,
    score: 0,
  },
  {
    id: 'konusma',
    labelKey: 'skill.speaking',
    subKey: 'skill.speaking.sub',
    nextKey: 'skill.speaking.next',
    actionKey: 'skill.speaking.action',
    icon: Mic,
    score: 0,
  },
]

const INITIAL_TASKS = [
  { id: 't1', titleKey: 'daily.task1', metaKey: 'daily.task1.meta', xp: 40, done: false },
  { id: 't2', titleKey: 'daily.task2', metaKey: 'daily.task2.meta', xp: 60, done: false },
  { id: 't3', titleKey: 'daily.task3', metaKey: 'daily.task3.meta', xp: 90, done: false },
  { id: 't4', titleKey: 'daily.task4', metaKey: 'daily.task4.meta', xp: 70, done: false },
]

const WEEKDAY_KEYS = ['weekday.sun', 'weekday.mon', 'weekday.tue', 'weekday.wed', 'weekday.thu', 'weekday.fri', 'weekday.sat']
const WEEK = (() => {
  const today = new Date()
  const mondayOffset = (today.getDay() + 6) % 7
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - mondayOffset + index)
    return {
      dayKey: WEEKDAY_KEYS[date.getDay()],
      min: 0, // No fabricated study time: populate only when real duration tracking exists.
      today: date.toDateString() === today.toDateString(),
    }
  })
})()


/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function masteryTone(score, t) {
  if (score <= 0)
    return {
      label: t('level.beginner'),
      stroke: 'stroke-slate-300 dark:stroke-slate-600',
      bar: 'from-slate-400 to-slate-300',
      text: 'text-slate-500 dark:text-slate-400',
      chip: 'bg-slate-100 text-slate-600 ring-1 ring-slate-300/40 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10',
    }
  if (score >= 65)
    return {
      label: t('level.C1'),
      stroke: 'stroke-emerald-500',
      bar: 'from-emerald-500 to-emerald-400',
      text: 'text-emerald-600 dark:text-emerald-400',
      chip: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20',
    }
  if (score >= 51)
    return {
      label: t('level.B2'),
      stroke: 'stroke-teal-500',
      bar: 'from-teal-600 to-cyan-500',
      text: 'text-teal-600 dark:text-teal-400',
      chip: 'bg-teal-50 text-teal-700 ring-1 ring-teal-600/15 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-400/20',
    }
  if (score >= 38)
    return {
      label: t('level.B1'),
      stroke: 'stroke-amber-500',
      bar: 'from-amber-500 to-yellow-400',
      text: 'text-amber-600 dark:text-amber-400',
      chip: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/15 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20',
    }
  return {
    label: t('level.belowB1'),
    stroke: 'stroke-rose-500',
    bar: 'from-rose-500 to-red-500',
    text: 'text-rose-600 dark:text-rose-400',
    chip: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/15 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20',
  }
}

function getCertificate(total, t) {
  if (total >= 65)
    return {
      level: 'C1',
      title: t('certificate.C1.title'),
      note: t('certificate.C1.note'),
      nextAt: null,
      card: 'from-emerald-500 to-teal-600 text-white shadow-emerald-600/25',
      ring: 'ring-white/25',
    }
  if (total >= 51)
    return {
      level: 'B2',
      title: t('certificate.B2.title'),
      note: t('certificate.B2.note'),
      nextAt: 65,
      card: 'from-teal-600 to-cyan-500 text-white shadow-teal-600/25',
      ring: 'ring-white/25',
    }
  if (total >= 38)
    return {
      level: 'B1',
      title: t('certificate.B1.title'),
      note: t('certificate.B1.note'),
      nextAt: 51,
      card: 'from-cyan-500 to-sky-500 text-white shadow-cyan-600/25',
      ring: 'ring-white/25',
    }
  return {
    level: 'Below B1',
    title: t('certificate.below.title'),
    note: t('certificate.below.note'),
    nextAt: 38,
    card: 'from-rose-500 to-red-600 text-white shadow-rose-600/25',
    ring: 'ring-white/25',
  }
}

function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(id)
  }, [])
  return mounted
}


/* -------------------------------------------------------------------------- */
/*                               Shared primitives                            */
/* -------------------------------------------------------------------------- */

function Card({ className, children, ...props }) {
  return (
    <section
      className={cn(
        'glass premium-glass rounded-[22px] border border-slate-200/80 bg-white/80 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}

function CardHeader({ icon: Icon, title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Hero card                                 */
/* -------------------------------------------------------------------------- */

function HeroCard({ onStart, name, weakest, targetLevel, totalScore }) {
  const { t } = useI18n()
  const target = targetLevel || '—'
  const threshold = target === 'B1' ? 38 : target === 'B2' ? 51 : target === 'C1' ? 65 : 0
  const pct = threshold ? Math.min(100, Math.round((totalScore / threshold) * 100)) : 0

  return (
    <section className="premium-hero relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-500 p-6 text-white shadow-xl shadow-teal-900/15 sm:p-8 lg:col-span-2">
      <div className="pointer-events-none absolute -right-16 -top-24 -z-10 size-72 rounded-full bg-cyan-300/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 -z-10 size-72 rounded-full bg-rose-500/20 blur-3xl" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          maskImage: 'linear-gradient(to bottom left, black, transparent 70%)',
          WebkitMaskImage: 'linear-gradient(to bottom left, black, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/25 backdrop-blur-md">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {t('dashboard.hero.badge', { target })}
          </span>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('dashboard.greeting', { name: name || t('dashboard.learner'), target })}
          </h1>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/65">{t('dashboard.journey')}</p>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-white/80">
            {weakest ? t('dashboard.weakest', { skill: weakest }) : t('dashboard.noScores')}
          </p>
          <button
            type="button"
            onClick={onStart}
            className="gold-button premium-primary group mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-teal-800 shadow-lg shadow-teal-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-50 hover:shadow-xl active:scale-95"
          >
            {t('dashboard.start')}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
        </div>

        <div className="w-full max-w-[220px] rounded-2xl border border-white/20 bg-white/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/65">{t('dashboard.progress')}</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <span className="text-3xl font-semibold tracking-tight text-yellow-300">{target}</span>
            <span className="text-right text-sm font-medium tabular-nums text-white/85">{Number(totalScore).toFixed(2)} <span className="text-white/55">{t('skill.scoreUnit')}</span></span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/20 ring-1 ring-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-100 transition-[width] duration-700" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-white/65">{t('dashboard.currentScore')}</p>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Target / summary                             */
/* -------------------------------------------------------------------------- */

function ReadinessCard({ total, targetLevel }) {
  const { t } = useI18n()
  const mounted = useMounted()
  const pct = Math.round((total / 75) * 100)
  const cert = getCertificate(total, t)
  const target = targetLevel || '—'
  const threshold = target === 'B1' ? 38 : target === 'B2' ? 51 : target === 'C1' ? 65 : 0
  const remaining = threshold ? Math.max(0, threshold - total) : null

  return (
    <Card className="flex flex-col p-6">
      <CardHeader
        icon={Trophy}
        title={t('dashboard.readiness')}
        subtitle={t('dashboard.fourSkillsAverage')}
        right={
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20">
            <TrendingUp className="size-3" aria-hidden="true" /> {t('dashboard.target', { target })}
          </span>
        }
      />
      <div className="mt-6 flex items-end gap-2">
        <span className="text-5xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">{Number(total).toFixed(2)}</span>
        <span className="mb-1.5 text-sm text-slate-500 dark:text-slate-400">{t('dashboard.scoreAverage')}</span>
        <span className="mb-1.5 ml-auto rounded-lg bg-slate-900 px-2 py-1 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
          {t(cert.level === 'Below B1' ? 'level.belowB1' : `level.${cert.level}`)}
        </span>
      </div>

      <div className="relative mt-5">
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 transition-[width] duration-1000 ease-out"
            style={{ width: mounted ? `${pct}%` : '0%' }}
          />
        </div>
        {[38, 51, 65].map((mark) => (
          <span
            key={mark}
            className="absolute top-0 h-2.5 w-px bg-white/90 dark:bg-slate-950"
            style={{ left: `${(mark / 75) * 100}%` }}
            aria-hidden="true"
          />
        ))}
        <div className="relative mt-2 h-4 text-[10px] font-medium text-slate-400 dark:text-slate-500">
          {[
            [38, 'B1'],
            [51, 'B2'],
            [65, 'C1'],
          ].map(([mark, l]) => (
            <span key={l} className="absolute -translate-x-1/2" style={{ left: `${(mark / 75) * 100}%` }}>
              {l}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200/70 bg-rose-50/70 p-3 dark:border-rose-500/20 dark:bg-rose-500/10">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-rose-500 text-white">
            <Target className="size-4" aria-hidden="true" />
          </span>
          <p className="text-xs leading-relaxed text-rose-900 dark:text-rose-200">
            {remaining === null ? (
              <>{t('dashboard.chooseTarget')}</>
            ) : remaining > 0 ? (
              <>{t('dashboard.pointsNeeded', { target, count: remaining })}</>
            ) : (
              <>{t('dashboard.targetReached', { target })}</>
            )}
          </p>
        </div>
      </div>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 Skill cards                                */
/* -------------------------------------------------------------------------- */

function ProgressRing({ value, max, toneStroke, mounted }) {
  const r = 26
  const c = 2 * Math.PI * r
  const offset = c - (mounted ? value / max : 0) * c
  return (
    <svg viewBox="0 0 64 64" className="size-16 -rotate-90" aria-hidden="true">
      <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-slate-100 dark:stroke-slate-800" />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className={cn(toneStroke, 'transition-[stroke-dashoffset] duration-1000 ease-out')}
      />
    </svg>
  )
}

function SkillCard({ skill, onOpen }) {
  const { t } = useI18n()
  const mounted = useMounted()
  const Icon = skill.icon
  const tone = masteryTone(skill.score, t)
  const pct = Math.round((skill.score / 75) * 100)

  return (
    <Card className="group flex flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300/80 hover:shadow-lg dark:hover:border-slate-700">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-teal-600/10 to-cyan-500/10 text-teal-700 ring-1 ring-teal-600/15 dark:text-teal-300 dark:ring-teal-400/20">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">{t(skill.labelKey)}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t(skill.subKey)}</p>
          </div>
        </div>
        <span className={cn('rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1', tone.chip)}>{tone.label}</span>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">{skill.score.toFixed(2).replace(/\.00$/, '')}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">{t('skill.scoreUnit')}</span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="size-3" aria-hidden="true" />
            {skill.score > 0 ? t('dashboard.skillEvaluated', { level: skill.level || getCefrLevel(skill.score) }) : t('dashboard.notEvaluated')}
          </p>
        </div>
        <div className="relative">
          <ProgressRing value={skill.score} max={75} toneStroke={tone.stroke} mounted={mounted} />
          <span className={cn('absolute inset-0 grid place-items-center text-xs font-semibold tabular-nums', tone.text)}>{pct}%</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
        <span className="text-slate-400 dark:text-slate-500">{t('dashboard.next')} </span>
        {t(skill.nextKey)}
      </div>

      <button
        type="button"
        onClick={() => onOpen(skill.id)}
        className="mt-3 inline-flex items-center gap-1 self-start text-sm font-medium text-teal-700 transition-colors hover:text-teal-900 active:scale-95 dark:text-teal-300 dark:hover:text-teal-100"
      >
        {t(skill.actionKey)}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </button>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*                          Certificate calculator                          */
/* -------------------------------------------------------------------------- */

function ScoreSlider({ id, label, sub, icon: Icon, value, onChange }) {
  const pct = (value / 75) * 100
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          <Icon className="size-4 text-slate-400" aria-hidden="true" />
          {label}
          <span className="text-xs font-normal text-slate-400 dark:text-slate-500">{sub}</span>
        </label>
        <span className="min-w-[3.25rem] rounded-lg bg-slate-100 px-2 py-0.5 text-center text-xs font-semibold tabular-nums text-slate-900 dark:bg-slate-800 dark:text-white">
          {value} / 75
        </span>
      </div>
      <div className="relative flex h-5 items-center">
        <div className="absolute inset-x-0 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-teal-600 to-cyan-500" style={{ width: `${pct}%` }} />
        </div>
        <input
          id={id}
          type="range"
          min={0}
          max={75}
          step={0.1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="peer absolute inset-0 z-10 w-full cursor-pointer opacity-0"
        />
        <div
          className="pointer-events-none absolute size-5 -translate-x-1/2 rounded-full border-2 border-white bg-teal-600 shadow-md shadow-teal-900/25 transition-transform peer-hover:scale-110 peer-active:scale-125 peer-focus-visible:ring-4 peer-focus-visible:ring-teal-500/30 dark:border-slate-900"
          style={{ left: `calc(${pct}% + ${(0.5 - pct / 100) * 20}px)` }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

const CALC_FIELDS = [
  { key: 'dinleme', labelKey: 'skill.listening', subKey: 'skill.listening.sub', icon: Headphones },
  { key: 'okuma', labelKey: 'skill.reading', subKey: 'skill.reading.sub', icon: BookOpenText },
  { key: 'yazma', labelKey: 'skill.writing', subKey: 'skill.writing.sub', icon: PenLine },
  { key: 'konusma', labelKey: 'skill.speaking', subKey: 'skill.speaking.sub', icon: Mic },
]

function CertificateCalculator({ initial }) {
  const { t } = useI18n()
  const [scores, setScores] = useState(initial)
  useEffect(() => setScores(initial), [initial])
  const total = (scores.dinleme + scores.okuma + scores.yazma + scores.konusma) / 4
  const pct = Math.round((total / 75) * 100)
  const cert = getCertificate(total, t)

  return (
    <Card className="p-6 lg:col-span-2">
      <CardHeader
        icon={Sparkles}
        title={t('certificate.calculator')}
        subtitle={t('certificate.subtitle')}
        right={
          <button
            type="button"
            onClick={() => setScores(initial)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            {t('certificate.reset')}
          </button>
        }
      />

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_260px]">
        <div className="space-y-6">
          {CALC_FIELDS.map((f) => (
            <ScoreSlider
              key={f.key}
              id={`calc-${f.key}`}
              label={t(f.labelKey)}
              sub={t(f.subKey)}
              icon={f.icon}
              value={scores[f.key]}
              onChange={(v) => setScores((prev) => ({ ...prev, [f.key]: v }))}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('certificate.total')}</p>
            <div className="mt-1 flex items-baseline gap-1.5" aria-live="polite">
              <span className="text-4xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">{total.toFixed(2)}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{t('certificate.average')}</span>
              <span className="ml-auto text-lg font-semibold tabular-nums text-slate-700 dark:text-slate-200">{pct}%</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 transition-[width] duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div
            className={cn(
              'relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-br p-4 shadow-lg ring-1 transition-all duration-500',
              cert.card,
              cert.ring,
            )}
            aria-live="polite"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <span className="grid size-10 place-items-center rounded-xl bg-white/20 text-base font-bold tracking-tight ring-1 ring-white/30">
                {t(cert.level === 'Below B1' ? 'level.belowB1' : `level.${cert.level}`)}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/70">{t('certificate.label')}</p>
                <p className="text-sm font-semibold leading-tight">{cert.title}</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/90">{cert.note}</p>
            {cert.nextAt && (
              <p className="mt-2 text-[11px] font-medium text-white/75">
                {t('certificate.next', { count: (cert.nextAt - total).toFixed(2).replace(/\.00$/, '') })}
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-medium text-slate-500 dark:text-slate-400">
            {[
              ['<38', 'level.belowB1'],
              ['38+', 'level.B1'],
              ['51+', 'level.B2'],
              ['65+', 'level.C1'],
            ].map(([range, lvl]) => (
              <div
                key={lvl}
                className={cn(
                  'rounded-lg border px-1 py-1.5',
                  cert.level === ({ 'level.belowB1': 'Below B1', 'level.B1': 'B1', 'level.B2': 'B2', 'level.C1': 'C1' }[lvl])
                    ? 'border-teal-500/40 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300'
                    : 'border-slate-200/80 dark:border-slate-800',
                )}
              >
                <div className="font-semibold">{t(lvl)}</div>
                <div className="tabular-nums">{range}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Daily plan card                               */
/* -------------------------------------------------------------------------- */

function DailyPlanCard({ addXp }) {
  const { t } = useI18n()
  const today = new Date().toLocaleDateString('en-CA')
  const storageKey = `turkish-marathon-dashboard-plan-${today}`
  const savedPlan = loadJSON(storageKey, {})
  const [tasks, setTasks] = useState(() => INITIAL_TASKS.map((task) => ({ ...task, done: !!savedPlan.done?.[task.id] })))
  const [rewarded, setRewarded] = useState(() => savedPlan.rewarded || [])

  useEffect(() => {
    saveJSON(storageKey, {
      done: Object.fromEntries(tasks.map((task) => [task.id, task.done])),
      rewarded,
    })
  }, [storageKey, tasks, rewarded])

  function toggleTask(taskId) {
    const task = tasks.find((item) => item.id === taskId)
    if (!task) return
    setTasks((previous) => previous.map((item) => item.id === taskId ? { ...item, done: !item.done } : item))
    if (!task.done && !rewarded.includes(taskId)) {
      addXp?.(task.xp)
      setRewarded((previous) => [...previous, taskId])
    }
  }
  const doneCount = tasks.filter((t) => t.done).length
  const maxMin = Math.max(1, ...WEEK.map((w) => w.min))

  return (
    <Card className="flex flex-col p-6">
      <CardHeader
        icon={CalendarCheck}
        title={t('daily.title')}
        subtitle={t('daily.done', { done: doneCount, total: tasks.length })}
        right={
          <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-600/15 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20">
            +{tasks.reduce((a, t) => a + t.xp, 0)} XP
          </span>
        }
      />

      <ul className="mt-5 space-y-1.5">
        {tasks.map((task) => (
          <li key={task.id}>
            <button
              type="button"
              role="checkbox"
              aria-checked={task.done}
              onClick={() => toggleTask(task.id)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-slate-50 active:scale-[0.99] dark:hover:bg-slate-800/50"
            >
              <span
                className={cn(
                  'grid size-5 shrink-0 place-items-center rounded-md border transition-all',
                  task.done
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-slate-300 dark:border-slate-600',
                )}
              >
                {task.done && <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    'block truncate text-sm font-medium',
                    task.done ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-800 dark:text-slate-100',
                  )}
                >
                  {t(task.titleKey)}
                </span>
                <span className="block text-xs text-slate-400 dark:text-slate-500">{t(task.metaKey)}</span>
              </span>
              <span className="text-xs font-medium tabular-nums text-slate-400 dark:text-slate-500">+{task.xp}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-slate-200/80 pt-5 dark:border-slate-800/80">
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-700 dark:text-slate-200">{t('daily.weekly')}</span>
          <span className="tabular-nums text-slate-500 dark:text-slate-400">
{t('daily.minutes', { count: WEEK.reduce((a, w) => a + w.min, 0) })}
          </span>
        </div>
        <div className="flex items-end gap-2">
          {WEEK.map((w) => (
            <div key={t(w.dayKey)} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-16 w-full items-end">
                <div
                  className={cn(
                    'w-full rounded-md transition-all',
                    w.today
                      ? 'bg-gradient-to-t from-rose-500 to-rose-400'
                      : 'bg-gradient-to-t from-teal-600/80 to-cyan-400/80',
                  )}
                  style={{ height: `${w.min === 0 ? 3 : (w.min / maxMin) * 100}%`, opacity: w.min === 0 ? 0.35 : 1 }}
                  title={w.min === 0 ? t('daily.noActivity') : t('daily.minutes', { count: w.min })}
                />
              </div>
              <span className={cn('text-[10px] font-medium', w.today ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500')}>
                {t(w.dayKey)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Dashboard                                  */
/* -------------------------------------------------------------------------- */

export default function Dashboard({ scores, sectionResults = {}, overallScore, navigate, name, targetLevel, stats, addXp }) {
  const { t } = useI18n()
  const total = overallScore ?? SKILLS.reduce((a, s) => a + (scores?.[s.id] ?? s.score), 0) / 4
  const initialScores = useMemo(
    () => Object.fromEntries(SKILLS.map((s) => [s.id, scores?.[s.id] ?? s.score])),
    [scores],
  )
  // Weakest skill right now — the hero highlights it
  const weakestSkill = useMemo(
    () => SKILLS.reduce((a, s) => (scores?.[s.id] ?? s.score) < (scores?.[a.id] ?? a.score) ? s : a),
    [scores],
  )
  const weakest = total > 0 ? t(weakestSkill.labelKey) : null

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { label: t('dashboard.stat.xp'), value: (stats?.xp ?? 0).toLocaleString('en-US'), icon: Zap, hint: t('dashboard.stat.xp.hint') },
          { label: t('dashboard.stat.streak'), value: `${stats?.streak ?? 0} ${t('profile.days')}`, icon: Flame, hint: t('dashboard.stat.streak.hint') },
          { label: t('dashboard.stat.target'), value: targetLevel || '—', icon: Target, hint: t('dashboard.stat.target.hint'), testId: 'card-target-level' },
          { label: t('dashboard.stat.levels'), value: stats?.levelsCompleted ?? 0, icon: Trophy, hint: t('dashboard.stat.levels.hint') },
        ].map(({ label, value, icon: Icon, hint, testId }) => (
          <Card key={label} data-testid={testId} className="premium-stat flex items-center gap-3 p-4 sm:p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-amber-300/20 bg-amber-300/10 text-amber-300 shadow-inner shadow-white/10">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
              <p className="truncate text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">{value}</p>
              <p className="hidden truncate text-[11px] text-slate-400 sm:block">{hint}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <HeroCard onStart={() => navigate('plan')} name={name} weakest={weakest} targetLevel={targetLevel} totalScore={total} />
        <ReadinessCard total={total} targetLevel={targetLevel} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {SKILLS.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={{ ...skill, score: scores?.[skill.id] ?? skill.score, level: sectionResults[skill.id]?.level }}
            onOpen={navigate}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <CertificateCalculator initial={initialScores} />
        <DailyPlanCard addXp={addXp} />
      </div>

      <footer className="pb-2 pt-2 text-center text-xs text-slate-400 dark:text-slate-500">
        {t('dashboard.footer')}
      </footer>
    </div>
  )
}
