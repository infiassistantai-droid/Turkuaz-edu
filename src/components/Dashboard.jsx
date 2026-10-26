import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpenText,
  CalendarCheck,
  Check,
  Headphones,
  Mic,
  PenLine,
  RotateCcw,
  Sparkles,
  Timer,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { cn } from '../lib/utils'

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

const SKILLS = [
  {
    id: 'okuma',
    tr: 'Okuma',
    uz: 'O’qib tushunish',
    icon: BookOpenText,
    score: 22,
    delta: '+3',
    next: '5-matn: Kapadokya tarixi',
    action: 'Matnni davom ettirish',
  },
  {
    id: 'dinleme',
    tr: 'Dinleme',
    uz: 'Tinglab tushunish',
    icon: Headphones,
    score: 20,
    delta: '+2',
    next: 'Audio 3: Radyo röportajı',
    action: 'Audioni tinglash',
  },
  {
    id: 'yazma',
    tr: 'Yazma',
    uz: 'Yozma ish',
    icon: PenLine,
    score: 16,
    delta: '+1',
    next: 'Insho: “Teknoloji ve eğitim”',
    action: 'Insho yozish',
  },
  {
    id: 'konusma',
    tr: 'Konuşma',
    uz: 'Gapirish',
    icon: Mic,
    score: 18,
    delta: '+4',
    next: '2-qism: Rasmni tasvirlash',
    action: 'Ovoz yozish',
  },
]

const INITIAL_TASKS = [
  { id: 't1', title: '20 ta yangi so’z (Ekler)', meta: 'Lug’at · 10 daq', xp: 40, done: true },
  { id: 't2', title: 'Dinleme: 2 ta audio', meta: 'Tinglash · 15 daq', xp: 60, done: true },
  { id: 't3', title: 'Yazma: 150 so’zli insho', meta: 'Yozish · 25 daq', xp: 90, done: false },
  { id: 't4', title: 'Konuşma: 3 ta savol', meta: 'Gapirish · 12 daq', xp: 70, done: false },
]

const WEEK = [
  { day: 'Du', min: 42 },
  { day: 'Se', min: 65 },
  { day: 'Ch', min: 38 },
  { day: 'Pa', min: 80 },
  { day: 'Ju', min: 55 },
  { day: 'Sh', min: 90 },
  { day: 'Ya', min: 24, today: true },
]

const EXAM_DAYS = 18

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function masteryTone(score) {
  if (score >= 24)
    return {
      label: 'A’lo',
      stroke: 'stroke-emerald-500',
      bar: 'from-emerald-500 to-emerald-400',
      text: 'text-emerald-600 dark:text-emerald-400',
      chip: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20',
    }
  if (score >= 18)
    return {
      label: 'Yaxshi',
      stroke: 'stroke-teal-500',
      bar: 'from-teal-600 to-cyan-500',
      text: 'text-teal-600 dark:text-teal-400',
      chip: 'bg-teal-50 text-teal-700 ring-1 ring-teal-600/15 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-400/20',
    }
  return {
    label: 'Zaif',
    stroke: 'stroke-rose-500',
    bar: 'from-rose-500 to-red-500',
    text: 'text-rose-600 dark:text-rose-400',
    chip: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/15 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20',
  }
}

function getCertificate(total) {
  if (total >= 80)
    return {
      level: 'C1',
      title: 'C1 Daraja',
      note: 'OTMga 100% maksimal ball!',
      nextAt: null,
      card: 'from-emerald-500 to-teal-600 text-white shadow-emerald-600/25',
      ring: 'ring-white/25',
    }
  if (total >= 65)
    return {
      level: 'B2',
      title: 'B2 Daraja',
      note: 'Yuqori natija — C1 ga oz qoldi',
      nextAt: 80,
      card: 'from-teal-600 to-cyan-500 text-white shadow-teal-600/25',
      ring: 'ring-white/25',
    }
  if (total >= 50)
    return {
      level: 'B1',
      title: 'B1 Daraja',
      note: 'Sertifikat beriladi — B2 sari davom eting',
      nextAt: 65,
      card: 'from-cyan-500 to-sky-500 text-white shadow-cyan-600/25',
      ring: 'ring-white/25',
    }
  return {
    level: '—',
    title: 'Sertifikat uchun yetarli emas',
    note: 'Kamida 50 ball talab qilinadi',
    nextAt: 50,
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

function useCountdown(days) {
  const [remaining, setRemaining] = useState(null)
  useEffect(() => {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const target = startOfToday.getTime() + (days + 1) * 86400000
    const tick = () => setRemaining(Math.max(0, target - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [days])

  if (remaining === null) return { d: days, h: 0, m: 0, s: 0 }
  return {
    d: Math.floor(remaining / 86400000),
    h: Math.floor((remaining / 3600000) % 24),
    m: Math.floor((remaining / 60000) % 60),
    s: Math.floor((remaining / 1000) % 60),
  }
}

/* -------------------------------------------------------------------------- */
/*                               Shared primitives                            */
/* -------------------------------------------------------------------------- */

function Card({ className, children, ...props }) {
  return (
    <section
      className={cn(
        'rounded-3xl border border-slate-200/80 bg-white/80 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]',
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

function HeroCard({ onStart, name, weakest }) {
  const { d, h, m, s } = useCountdown(EXAM_DAYS)
  const units = [
    { v: d, l: 'kun' },
    { v: h, l: 'soat' },
    { v: m, l: 'daq' },
    { v: s, l: 'son' },
  ]

  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-500 p-6 text-white shadow-xl shadow-teal-900/15 sm:p-8 lg:col-span-2">
      <div className="pointer-events-none absolute -right-16 -top-24 -z-10 size-72 rounded-full bg-cyan-300/40 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 -z-10 size-72 rounded-full bg-rose-500/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-10 top-1/2 -z-10 size-48 rounded-full bg-emerald-400/25 blur-3xl" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          maskImage: 'linear-gradient(to bottom left, black, transparent 70%)',
          WebkitMaskImage: 'linear-gradient(to bottom left, black, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/25 backdrop-blur-md">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Milliy Sertifikat · CEFR B1 / B2 / C1
          </span>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Merhaba, {name || 'Azizbek'}! Bugün C1 sari yana bir qadam.
          </h1>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-white/80">
            {weakest} bo’yicha natijangiz eng past — bugungi rejada unga 25 daqiqa ajratdik. Har kuni 60 daqiqa sizni maqsadga olib boradi.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-teal-800 shadow-lg shadow-teal-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
          >
            {'Bugungi mashg’ulotni boshlash'}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
        </div>

        <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-md">
          <p className="flex items-center gap-1.5 text-xs font-medium text-white/80">
            <Timer className="size-3.5" aria-hidden="true" />
            Imtihongacha: <span className="font-semibold text-white">{d} kun</span>
            <span className="relative ml-1 flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
            </span>
          </p>
          <div className="mt-3 flex gap-2" role="timer" aria-label={`Imtihongacha ${d} kun ${h} soat ${m} daqiqa`}>
            {units.map((u) => (
              <div key={u.l} className="w-14 rounded-xl bg-slate-950/20 py-2 text-center ring-1 ring-white/10">
                <div className="text-xl font-semibold tabular-nums tracking-tight">{String(u.v).padStart(2, '0')}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/60">{u.l}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-white/60">13-noyabr · Toshkent test markazi</p>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Target / summary                             */
/* -------------------------------------------------------------------------- */

function ReadinessCard({ total }) {
  const mounted = useMounted()
  const pct = Math.round((total / 120) * 100)
  const cert = getCertificate(total)
  const toC1 = Math.max(0, 80 - total)

  return (
    <Card className="flex flex-col p-6">
      <CardHeader
        icon={Trophy}
        title="Tayyorgarlik holati"
        subtitle="4 bo’lim bo’yicha natija"
        right={
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20">
            <TrendingUp className="size-3" aria-hidden="true" /> +10
          </span>
        }
      />
      <div className="mt-6 flex items-end gap-2">
        <span className="text-5xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">{total}</span>
        <span className="mb-1.5 text-sm text-slate-500 dark:text-slate-400">/ 120 ball</span>
        <span className="mb-1.5 ml-auto rounded-lg bg-slate-900 px-2 py-1 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
          {cert.level}
        </span>
      </div>

      <div className="relative mt-5">
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 transition-[width] duration-1000 ease-out"
            style={{ width: mounted ? `${pct}%` : '0%' }}
          />
        </div>
        {[50, 65, 80].map((mark) => (
          <span
            key={mark}
            className="absolute top-0 h-2.5 w-px bg-white/90 dark:bg-slate-950"
            style={{ left: `${(mark / 120) * 100}%` }}
            aria-hidden="true"
          />
        ))}
        <div className="relative mt-2 h-4 text-[10px] font-medium text-slate-400 dark:text-slate-500">
          {[
            [50, 'B1'],
            [65, 'B2'],
            [80, 'C1'],
          ].map(([mark, l]) => (
            <span key={l} className="absolute -translate-x-1/2" style={{ left: `${(mark / 120) * 100}%` }}>
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
            {toC1 > 0 ? (
              <>
                C1 uchun yana <span className="font-semibold">{toC1} ball</span> kerak. Yazma va Konuşmaga e’tibor bering.
              </>
            ) : (
              <>C1 darajasiga yetdingiz — natijani mustahkamlang!</>
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
  const mounted = useMounted()
  const Icon = skill.icon
  const tone = masteryTone(skill.score)
  const pct = Math.round((skill.score / 30) * 100)

  return (
    <Card className="group flex flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300/80 hover:shadow-lg dark:hover:border-slate-700">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-teal-600/10 to-cyan-500/10 text-teal-700 ring-1 ring-teal-600/15 dark:text-teal-300 dark:ring-teal-400/20">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">{skill.tr}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{skill.uz}</p>
          </div>
        </div>
        <span className={cn('rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1', tone.chip)}>{tone.label}</span>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">{skill.score}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">/ 30 ball</span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="size-3" aria-hidden="true" />
            {skill.delta} bu hafta
          </p>
        </div>
        <div className="relative">
          <ProgressRing value={skill.score} max={30} toneStroke={tone.stroke} mounted={mounted} />
          <span className={cn('absolute inset-0 grid place-items-center text-xs font-semibold tabular-nums', tone.text)}>{pct}%</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
        <span className="text-slate-400 dark:text-slate-500">Keyingi: </span>
        {skill.next}
      </div>

      <button
        type="button"
        onClick={() => onOpen(skill.id)}
        className="mt-3 inline-flex items-center gap-1 self-start text-sm font-medium text-teal-700 transition-colors hover:text-teal-900 active:scale-95 dark:text-teal-300 dark:hover:text-teal-100"
      >
        {skill.action}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </button>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*                          Certificate calculator                          */
/* -------------------------------------------------------------------------- */

function ScoreSlider({ id, label, sub, icon: Icon, value, onChange }) {
  const pct = (value / 30) * 100
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          <Icon className="size-4 text-slate-400" aria-hidden="true" />
          {label}
          <span className="text-xs font-normal text-slate-400 dark:text-slate-500">{sub}</span>
        </label>
        <span className="min-w-[3.25rem] rounded-lg bg-slate-100 px-2 py-0.5 text-center text-xs font-semibold tabular-nums text-slate-900 dark:bg-slate-800 dark:text-white">
          {value} / 30
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
          max={30}
          step={1}
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
  { key: 'dinleme', label: 'Dinleme', sub: 'Tinglash', icon: Headphones },
  { key: 'okuma', label: 'Okuma', sub: 'O’qish', icon: BookOpenText },
  { key: 'yazma', label: 'Yazma', sub: 'Yozish', icon: PenLine },
  { key: 'konusma', label: 'Konuşma', sub: 'Gapirish', icon: Mic },
]

function CertificateCalculator({ initial }) {
  const [scores, setScores] = useState(initial)
  const total = scores.dinleme + scores.okuma + scores.yazma + scores.konusma
  const pct = Math.round((total / 120) * 100)
  const cert = getCertificate(total)

  return (
    <Card className="p-6 lg:col-span-2">
      <CardHeader
        icon={Sparkles}
        title="Milliy Sertifikat Ball Kalkulyatori"
        subtitle="4 bo’lim × 30 ball = 120 ball"
        right={
          <button
            type="button"
            onClick={() => setScores(initial)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Qayta
          </button>
        }
      />

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_260px]">
        <div className="space-y-6">
          {CALC_FIELDS.map((f) => (
            <ScoreSlider
              key={f.key}
              id={`calc-${f.key}`}
              label={f.label}
              sub={f.sub}
              icon={f.icon}
              value={scores[f.key]}
              onChange={(v) => setScores((prev) => ({ ...prev, [f.key]: v }))}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Umumiy ball</p>
            <div className="mt-1 flex items-baseline gap-1.5" aria-live="polite">
              <span className="text-4xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">{total}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">/ 120</span>
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
                {cert.level}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/70">Sertifikat</p>
                <p className="text-sm font-semibold leading-tight">{cert.title}</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/90">{cert.note}</p>
            {cert.nextAt && (
              <p className="mt-2 text-[11px] font-medium text-white/75">
                Keyingi darajagacha: {cert.nextAt - total} ball
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-medium text-slate-500 dark:text-slate-400">
            {[
              ['<50', '—'],
              ['50+', 'B1'],
              ['65+', 'B2'],
              ['80+', 'C1'],
            ].map(([range, lvl]) => (
              <div
                key={lvl}
                className={cn(
                  'rounded-lg border px-1 py-1.5',
                  cert.level === lvl
                    ? 'border-teal-500/40 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300'
                    : 'border-slate-200/80 dark:border-slate-800',
                )}
              >
                <div className="font-semibold">{lvl}</div>
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

function DailyPlanCard() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const doneCount = tasks.filter((t) => t.done).length
  const maxMin = Math.max(...WEEK.map((w) => w.min))

  return (
    <Card className="flex flex-col p-6">
      <CardHeader
        icon={CalendarCheck}
        title="Kunlik reja"
        subtitle={`${doneCount} / ${tasks.length} bajarildi`}
        right={
          <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-600/15 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20">
            +{tasks.reduce((a, t) => a + t.xp, 0)} XP
          </span>
        }
      />

      <ul className="mt-5 space-y-1.5">
        {tasks.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              role="checkbox"
              aria-checked={t.done}
              onClick={() => setTasks((prev) => prev.map((p) => (p.id === t.id ? { ...p, done: !p.done } : p)))}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-slate-50 active:scale-[0.99] dark:hover:bg-slate-800/50"
            >
              <span
                className={cn(
                  'grid size-5 shrink-0 place-items-center rounded-md border transition-all',
                  t.done
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-slate-300 dark:border-slate-600',
                )}
              >
                {t.done && <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    'block truncate text-sm font-medium',
                    t.done ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-800 dark:text-slate-100',
                  )}
                >
                  {t.title}
                </span>
                <span className="block text-xs text-slate-400 dark:text-slate-500">{t.meta}</span>
              </span>
              <span className="text-xs font-medium tabular-nums text-slate-400 dark:text-slate-500">+{t.xp}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-slate-200/80 pt-5 dark:border-slate-800/80">
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-700 dark:text-slate-200">Haftalik faollik</span>
          <span className="tabular-nums text-slate-500 dark:text-slate-400">
            {WEEK.reduce((a, w) => a + w.min, 0)} daqiqa
          </span>
        </div>
        <div className="flex items-end gap-2">
          {WEEK.map((w) => (
            <div key={w.day} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-16 w-full items-end">
                <div
                  className={cn(
                    'w-full rounded-md transition-all',
                    w.today
                      ? 'bg-gradient-to-t from-rose-500 to-rose-400'
                      : 'bg-gradient-to-t from-teal-600/80 to-cyan-400/80',
                  )}
                  style={{ height: `${(w.min / maxMin) * 100}%` }}
                  title={`${w.min} daqiqa`}
                />
              </div>
              <span className={cn('text-[10px] font-medium', w.today ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500')}>
                {w.day}
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

export default function Dashboard({ scores, navigate, name }) {
  const total = SKILLS.reduce((a, s) => a + (scores?.[s.id] ?? s.score), 0)
  const initialScores = useMemo(
    () => Object.fromEntries(SKILLS.map((s) => [s.id, scores?.[s.id] ?? s.score])),
    [scores],
  )
  // Weakest skill right now — the hero highlights it
  const weakest = useMemo(
    () => SKILLS.reduce((a, s) => (scores?.[s.id] ?? s.score) < (scores?.[a.id] ?? a.score) ? s : a),
    [scores],
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <HeroCard onStart={() => navigate('plan')} name={name} weakest={weakest.tr} />
        <ReadinessCard total={total} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {SKILLS.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={{ ...skill, score: scores?.[skill.id] ?? skill.score }}
            onOpen={navigate}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <CertificateCalculator initial={initialScores} />
        <DailyPlanCard />
      </div>

      <footer className="pb-2 pt-2 text-center text-xs text-slate-400 dark:text-slate-500">
        Turkcha CEFR Pro · Milliy Sertifikat (B1 · B2 · C1) tayyorlov platformasi
      </footer>
    </div>
  )
}
