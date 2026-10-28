import { useState } from 'react'
import {
  Calculator,
  Target,
  CheckCircle2,
  AlertTriangle,
  Rocket,
  Trophy,
  BookOpenText,
  Headphones,
  PenLine,
  Mic,
  Sparkles,
  Check,
} from 'lucide-react'
import { cn } from '../lib/utils'

// ----------------------------------------------------------------------
// Shared skill metadata (used by both the calculator and the Dashboard)
// ----------------------------------------------------------------------
export const SKILL_META = [
  { key: 'okuma', label: 'Oʻqib tushunish', short: 'Okuma', icon: BookOpenText, color: 'turk' },
  { key: 'dinleme', label: 'Tinglab tushunish', short: 'Dinleme', icon: Headphones, color: 'cyan' },
  { key: 'yazma', label: 'Yozma ish', short: 'Yazma', icon: PenLine, color: 'rose' },
  { key: 'konusma', label: 'Gapirish', short: 'Konushma', icon: Mic, color: 'amber' },
]

export const COLOR_CLASSES = {
  turk: {
    text: 'text-turk-600 dark:text-turk-300',
    bar: 'bg-turk-500',
    bg: 'bg-turk-50 dark:bg-turk-950/50',
    ring: 'ring-turk-200 dark:ring-turk-800/50',
    badge: 'bg-turk-100 text-turk-700 dark:bg-turk-950/60 dark:text-turk-200',
    accent: 'accent-turk-600',
    glow: 'from-turk-500 to-turk-600',
  },
  cyan: {
    text: 'text-cyan-600 dark:text-cyan-300',
    bar: 'bg-cyan-500',
    bg: 'bg-cyan-50 dark:bg-cyan-950/50',
    ring: 'ring-cyan-200 dark:ring-cyan-900/40',
    badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-200',
    accent: 'accent-cyan-600',
    glow: 'from-cyan-500 to-cyan-600',
  },
  rose: {
    text: 'text-rose-600 dark:text-rose-300',
    bar: 'bg-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    ring: 'ring-rose-200 dark:ring-rose-900/40',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-200',
    accent: 'accent-rose-600',
    glow: 'from-rose-500 to-rose-600',
  },
  amber: {
    text: 'text-amber-600 dark:text-amber-300',
    bar: 'bg-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    ring: 'ring-amber-200 dark:ring-amber-900/40',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-200',
    accent: 'accent-amber-600',
    glow: 'from-amber-500 to-amber-600',
  },
  slate: {
    text: 'text-slate-600 dark:text-slate-300',
    bar: 'bg-slate-500',
    bg: 'bg-slate-100 dark:bg-slate-800/70',
    ring: 'ring-slate-200 dark:ring-slate-700',
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    accent: 'accent-slate-600',
    glow: 'from-slate-500 to-slate-600',
  },
}

// ----------------------------------------------------------------------
// Multilevel certificate thresholds — section scores and the four-section
// average use the same 0–75 rubric as the mock exam.
// ----------------------------------------------------------------------
export function scoreOut75(pct) {
  return Math.max(0, Math.min(75, Math.round((Number(pct || 0) / 100) * 75)))
}

// Backwards-compatible export for any older callers; values are now 0–75.
export const scoreOut30 = scoreOut75

export function levelFromSectionScore(score) {
  if (score >= 65) return { label: 'C1', tone: 'turk' }
  if (score >= 51) return { label: 'B2', tone: 'cyan' }
  if (score >= 38) return { label: 'B1', tone: 'amber' }
  return { label: 'Below B1', tone: 'slate' }
}

export function scoreBand(average) {
  if (average < 38) {
    return { label: 'Below B1', short: 'Below B1', tone: 'rose', message: 'B1 darajasiga yetish uchun o‘rtacha 38 ball kerak.' }
  }
  if (average < 51) {
    return { label: 'B1', short: 'B1', tone: 'amber', message: 'O‘rtacha 38 ball bilan B1 darajasi.' }
  }
  if (average < 65) {
    return { label: 'B2', short: 'B2', tone: 'turk', message: 'O‘rtacha 51 ball bilan B2 darajasi.' }
  }
  return { label: 'C1', short: 'C1', tone: 'turk', message: 'O‘rtacha 65 ball bilan C1 darajasi.' }
}

export function targetThreshold(cert) {
  if (cert === 'C1') return 65
  if (cert === 'B2') return 51
  return 38
}

// ----------------------------------------------------------------------
// Reusable interactive calculator (used on the Dashboard bento row and
// on the standalone certificate page)
// ----------------------------------------------------------------------
export function CertificateCalculator({ initialScores, targetCert, compact = false }) {
  const [scores, setScores] = useState(
    initialScores || { okuma: 0, dinleme: 0, yazma: 0, konusma: 0 },
  )

  const total = Math.round(SKILL_META.reduce((sum, s) => sum + scores[s.key], 0) / SKILL_META.length)
  const band = scoreBand(total)
  const tone = COLOR_CLASSES[band.tone]
  const threshold = targetThreshold(targetCert)
  const targetMet = total >= threshold
  const targetGap = Math.max(0, threshold - total)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Sliders */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/70">
        <div className="mb-4 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-turk-600 dark:text-turk-400" />
          <h3 className="font-display text-base font-extrabold text-slate-800 dark:text-white">
            Koʻnikma ballari — har bir boʻlim 0–75 ball
          </h3>
        </div>
        <div className="space-y-4">
          {SKILL_META.map((skill) => {
            const meta = COLOR_CLASSES[skill.color]
            const Icon = skill.icon
            const value = scores[skill.key]
            return (
              <div key={skill.key}>
                <div className="mb-2 flex items-center gap-2">
                  <span className={cn('grid h-8 w-8 place-items-center rounded-xl', meta.bg, meta.text)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {skill.label}
                  </span>
                  <span className="ml-auto font-display text-sm font-extrabold tabular-nums text-slate-800 dark:text-white">
                    {value}/75
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={75}
                  step={1}
                  value={value}
                  onChange={(e) => setScores((s) => ({ ...s, [skill.key]: Number(e.target.value) }))}
                  className={cn('w-full', meta.accent)}
                />
                <div className="mt-1 flex justify-between text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                  <span>0</span>
                  <span>38</span>
                  <span>75</span>
                </div>
              </div>
            )
          })}
        </div>
        {!compact && (
          <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900/60 dark:text-slate-400 dark:ring-slate-700">
            Milliy Sertifikatdagi har bir koʻnikma (okuma, dinleme, yazma, konushma) mustaqil
            ballarlanadi. Daraja toʻrtta boʻlimning 0–75 ball oraligʻidagi oʻrtacha natijasiga qarab aniqlanadi.
          </p>
        )}
      </div>

      {/* Result panel */}
      <div className="flex flex-col gap-4">
        <div className={cn('overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-xl', tone.glow)}>
          <div className="text-xs font-bold uppercase tracking-widest text-white/70">
            Toʻrt boʻlim oʻrtachasi / 75
          </div>
          <div className="font-display text-5xl font-extrabold tabular-nums">{total}</div>
          <div className={cn('mt-3 w-full rounded-xl bg-white/20 p-3 text-center', 'backdrop-blur-sm')}>
            <div className="font-display text-xl font-extrabold tracking-wide">{band.label}</div>
            <div className="mt-1 text-[11px] font-semibold text-white/80">{band.message}</div>
          </div>
        </div>

        {/* Target alignment */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/70">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-turk-600 dark:text-turk-400" />
            <h4 className="font-display text-sm font-extrabold text-slate-800 dark:text-white">
              Maqsad: {targetCert}
            </h4>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {targetCert === 'C1' && 'C1 uchun toʻrt boʻlim oʻrtachasi kamida 65 ball bo‘lishi kerak.'}
            {targetCert === 'B2' && 'B2 uchun toʻrt boʻlim oʻrtachasi kamida 51 ball bo‘lishi kerak.'}
            {targetCert === 'B1' && 'B1 uchun toʻrt boʻlim oʻrtachasi kamida 38 ball bo‘lishi kerak.'}
          </p>
          {targetMet ? (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-turk-50 p-3 text-sm font-bold text-turk-700 dark:bg-turk-950/50 dark:text-turk-200">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              Maqsadga erishish mumkin! 🎉
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-200">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              Yana {targetGap} ball kerak
            </div>
          )}
        </div>

        {/* Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/70">
          <h4 className="mb-3 text-sm font-extrabold text-slate-800 dark:text-white">
            Boʻlimlar hisobi
          </h4>
          <div className="space-y-2">
            {SKILL_META.map((skill) => {
              const meta = COLOR_CLASSES[skill.color]
              const value = scores[skill.key]
              const lv = levelFromSectionScore(value)
              return (
                <div key={skill.key} className="flex items-center gap-2">
                  <span className="w-28 shrink-0 text-xs font-bold text-slate-600 dark:text-slate-300">
                    {skill.short}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={cn('h-full rounded-full pbar', meta.bar)}
                      style={{ width: `${(value / 75) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 shrink-0 text-right font-display text-sm font-extrabold tabular-nums text-slate-700 dark:text-slate-200">
                    {value}
                  </span>
                  <span
                    className={cn(
                      'w-10 shrink-0 rounded-md px-1.5 py-0.5 text-center text-[10px] font-bold',
                      COLOR_CLASSES[lv.tone].badge,
                    )}
                  >
                    {lv.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------------
// Standalone certificate page (BAZA VA SINOV section)
// ----------------------------------------------------------------------
export default function SertifikatKalkulyatori({ stats, progress, targetCert }) {
  // Practice progress is not an exam score; do not present it as a certificate result.
  const initialScores = { okuma: 0, dinleme: 0, yazma: 0, konusma: 0 }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-turk-600 to-cyan-600 p-6 text-white shadow-xl shadow-turk-900/20 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/70">
              Milliy Sertifikat · B1 / B2 / C1
            </div>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
              Sertifikat Kalkulyatori
            </h1>
          </div>
          <span className="ml-auto rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold ring-1 ring-white/20 backdrop-blur-sm">
            Har bir boʻlim: 0–75 ball
          </span>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85">
          Har bir koʻnikmani 0–75 oraligʻida baholang. Kalkulyator toʻrtta boʻlimning oʻrtachasini
          hisoblab, darajani (B1 / B2 / C1) va maqsadingizga qancha yaqin ekanligingizni
          koʻrsatadi.
        </p>
      </div>

      {/* Calculator */}
      <CertificateCalculator initialScores={initialScores} targetCert={targetCert} />

      {/* Readiness checklist */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/70">
        <div className="mb-4 flex items-center gap-2">
          <Rocket className="h-5 w-5 text-turk-600 dark:text-turk-400" />
          <h2 className="font-display text-lg font-extrabold text-slate-800 dark:text-white">
            Imtihonga tayyorlik roʻyxati
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: 'Har kun trening qilasiz', ok: stats.streak >= 20 },
            { title: '100+ soʻzni bilasiz', ok: stats.wordsLearned >= 100 },
            { title: 'Mock imtihoni topshirdingiz', ok: !!stats.examDone },
            { title: 'Barcha 4 koʻnikma ishladingiz', ok: (stats.skillsCompleted || []).length >= 4 },
            { title: '9+ ta mashq yakunlandi', ok: stats.levelsCompleted >= 9 },
            { title: 'Seriyani saqlab qoldingiz', ok: stats.streak >= 7 },
          ].map((item) => (
            <div
              key={item.title}
              className={cn(
                'flex items-center gap-3 rounded-xl p-3',
                item.ok
                  ? 'bg-turk-50 ring-1 ring-turk-200 dark:bg-turk-950/40 dark:ring-turk-800/50'
                  : 'bg-slate-50 ring-1 ring-slate-200 dark:bg-slate-900/60 dark:ring-slate-700',
              )}
            >
              <span
                className={cn(
                  'grid h-7 w-7 shrink-0 place-items-center rounded-lg',
                  item.ok
                    ? 'bg-turk-600 text-white'
                    : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
                )}
              >
                {item.ok ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              </span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Band legend */}
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { label: '< 38 · Below B1', tone: 'rose', desc: 'B1 darajasi uchun oʻrtacha natijani oshiring.' },
          { label: '38–50 · B1', tone: 'amber', desc: 'B1 darajasi.' },
          { label: '51–64 · B2', tone: 'turk', desc: 'B2 darajasi.' },
          { label: '65–75 · C1', tone: 'cyan', desc: 'C1 darajasi.' },
        ].map((row) => {
          const meta = COLOR_CLASSES[row.tone]
          return (
            <div
              key={row.label}
              className={cn('flex items-start gap-3 rounded-2xl border p-4', meta.ring, meta.bg)}
            >
              <Sparkles className={cn('mt-0.5 h-5 w-5 shrink-0', meta.text)} />
              <div>
                <div className={cn('font-display text-sm font-extrabold', meta.text)}>{row.label}</div>
                <div className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {row.desc}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
