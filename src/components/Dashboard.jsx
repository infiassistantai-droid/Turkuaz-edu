import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  BookOpenText,
  Check,
  Headphones,
  Mic,
  PenLine,
  RotateCcw,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'
import DailyQuestsWidget, { getDailyQuestRows } from './DailyQuestsWidget'
import { ModelAsset, PanelHeading } from './BosforArtwork'

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

const SKILLS = [
  {
    id: 'okuma',
    labelKey: 'skill.reading',



    icon: BookOpenText,
    score: 0,
  },
  {
    id: 'dinleme',
    labelKey: 'skill.listening',



    icon: Headphones,
    score: 0,
  },
  {
    id: 'yazma',
    labelKey: 'skill.writing',



    icon: PenLine,
    score: 0,
  },
  {
    id: 'konusma',
    labelKey: 'skill.speaking',



    icon: Mic,
    score: 0,
  },
]

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function getCertificate(total, t) {
  if (total >= 65)
    return {
      level: 'C1',
      title: t('certificate.C1.title'),
      note: t('certificate.C1.note'),
      nextAt: null,


    }
  if (total >= 51)
    return {
      level: 'B2',
      title: t('certificate.B2.title'),
      note: t('certificate.B2.note'),
      nextAt: 65,


    }
  if (total >= 38)
    return {
      level: 'B1',
      title: t('certificate.B1.title'),
      note: t('certificate.B1.note'),
      nextAt: 51,


    }
  return {
    level: 'Below B1',
    title: t('certificate.below.title'),
    note: t('certificate.below.note'),
    nextAt: 38,


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
        'studio-card bosfor-panel min-w-0 rounded-2xl border',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Hero card                                 */
/* -------------------------------------------------------------------------- */

function HeroCard({ onStart, targetLevel }) {
  const { t } = useI18n()

  return (
    <section className="bosfor-hero">
      <div className="bosfor-hero-copy">
        <h1 data-testid="text-page-heading">{t('bosfor.hero.title')}</h1>
        <p className="bosfor-levels">
          <span>CEFR</span>
          {['B1', 'B2', 'C1'].map((level) => <strong key={level} data-current={targetLevel === level}>{level}</strong>)}
        </p>
        <button
          type="button"
          onClick={onStart}
          className="dashboard-start-cta bosfor-start group"
        >
          {t('bosfor.hero.start')}
          <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

function TodayCard({ progress, onShowTasks }) {
  const { t } = useI18n()
  const quests = getDailyQuestRows(progress)
  const completed = quests.filter(({ complete }) => complete).length

  return (
    <section className="bosfor-today" aria-labelledby="bosfor-today-heading">
      <div className="flex items-center gap-3">
        <ModelAsset name="quests" className="size-12" />
        <div>
          <h2 id="bosfor-today-heading">{t('bosfor.today.title')}</h2>
          <p className="bosfor-today-count">{t('quests.completedCount', { count: completed, total: quests.length })}</p>
        </div>
      </div>
      <div className="bosfor-progress" aria-hidden="true">
        <span style={{ width: `${completed / quests.length * 100}%` }} />
      </div>
      <button type="button" className="bosfor-today-link" onClick={onShowTasks}>
        {t('bosfor.today.openTasks')} <ArrowRight size={17} aria-hidden="true" />
      </button>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Target / summary                             */
/* -------------------------------------------------------------------------- */

function ReadinessCard({ total, targetLevel, hasResults }) {
  const { t } = useI18n()
  const mounted = useMounted()
  const pct = Math.round((total / 75) * 100)
  const cert = getCertificate(total, t)
  const target = targetLevel || '—'
  const threshold = target === 'B1' ? 38 : target === 'B2' ? 51 : target === 'C1' ? 65 : 0
  const remaining = threshold ? Math.max(0, threshold - total) : null

  return (
    <Card className="flex min-w-0 flex-col p-5 sm:p-6">
      <PanelHeading
        name="readiness"
        title={t('dashboard.readiness')}
        description={t('dashboard.fourSkillsAverage')}
      >
          <span className="inline-flex items-center gap-1 bosfor-badge px-2 py-1 text-[11px] font-semibold">
            <TrendingUp className="size-3" aria-hidden="true" /> {t('dashboard.target', { target })}
          </span>
      </PanelHeading>
      <div className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-5xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">{hasResults ? Number(total).toFixed(2) : '—'}</span>
        <span className="mb-1.5 text-sm text-slate-500 dark:text-slate-400">{t('dashboard.scoreAverage')}</span>
        <span className={cn(
          'mb-1.5 ml-auto rounded-lg px-2 py-1 text-xs font-semibold',
          hasResults
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
            : 'bg-slate-100 text-slate-700 ring-1 ring-slate-300/70 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700',
        )}>
          {hasResults ? t(cert.level === 'Below B1' ? 'level.belowB1' : `level.${cert.level}`) : t('dashboard.notEvaluated')}
        </span>
      </div>

      <div className="relative mt-5">
        <div className="bosfor-track h-2.5 overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bosfor-progress-fill transition-[width] duration-1000 ease-out"
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
        <div className="flex items-center gap-3 bosfor-inset rounded-xl border p-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bosfor-badge">
            <Target className="size-4" aria-hidden="true" />
          </span>
          <p className="text-xs leading-relaxed text-[var(--studio-muted)]">
            {!hasResults ? (
              <>{t('dashboard.noScores')}</>
            ) : remaining === null ? (
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
          <div className="h-full rounded-full bosfor-progress-fill" style={{ width: `${pct}%` }} />
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
      <PanelHeading
        name="calculator"
        title={t('certificate.calculator')}
        description={t('certificate.subtitle')}
      >
          <button
            type="button"
            onClick={() => setScores(initial)}
            className="inline-flex items-center gap-1.5 bosfor-control rounded-lg px-2.5 py-1.5 text-xs font-medium"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            {t('certificate.reset')}
          </button>
      </PanelHeading>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(12rem,260px)]">
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
          <div className="bosfor-inset rounded-2xl border p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('certificate.total')}</p>
            <div className="mt-1 flex items-baseline gap-1.5" aria-live="polite">
              <span className="text-4xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">{total.toFixed(2)}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{t('certificate.average')}</span>
              <span className="ml-auto text-lg font-semibold tabular-nums text-slate-700 dark:text-slate-200">{pct}%</span>
            </div>
            <div className="bosfor-track mt-3 h-1.5 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bosfor-progress-fill transition-[width] duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div
            className="bosfor-inset relative flex items-start gap-4 rounded-xl border p-4"
            aria-live="polite"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />
            <span className="relative grid w-16 shrink-0 place-items-center gap-1 text-center text-xs font-bold">
              <ModelAsset name="certificate" className="size-16" />
              <span>{t(cert.level === 'Below B1' ? 'level.belowB1' : `level.${cert.level}`)}</span>
            </span>
            <div className="relative min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--studio-muted)]">{t('certificate.label')}</p>
              <p className="break-words text-sm font-semibold leading-tight">{cert.title}</p>
              <p className="mt-2 break-words text-xs leading-relaxed text-[var(--studio-muted)]">{cert.note}</p>
              {cert.nextAt && (
                <p className="mt-2 break-words text-[11px] font-medium leading-relaxed text-[var(--studio-muted)]">
                  {t('certificate.next', { count: (cert.nextAt - total).toFixed(2).replace(/\.00$/, '') })}
                </p>
              )}
            </div>
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
/*                                  Dashboard                                  */
/* -------------------------------------------------------------------------- */

export default function Dashboard({ scores, sectionResults = {}, overallScore, navigate, targetLevel, stats, dailyQuests, onClaimDailyReward, isPremium = false }) {
  const { t } = useI18n()
  const tasksRef = useRef(null)
  const total = overallScore ?? SKILLS.reduce((a, s) => a + (scores?.[s.id] ?? s.score), 0) / 4
  const hasResults = SKILLS.some((skill) => Boolean(sectionResults[skill.id]))
  const initialScores = useMemo(
    () => Object.fromEntries(SKILLS.map((s) => [s.id, scores?.[s.id] ?? s.score])),
    [scores],
  )
  function showTasks() {
    const panel = tasksRef.current
    if (!panel) return
    panel.focus({ preventScroll: true })
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    panel.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'instant' : 'smooth' })
  }

  return (
    <div className="studio-dashboard space-y-5 sm:space-y-6">
      <div className="bosfor-overview">
        <HeroCard onStart={() => navigate('plan')} targetLevel={targetLevel} />
        <section className="bosfor-skills-section" aria-labelledby="dashboard-skills-heading">
          <h2 id="dashboard-skills-heading">{t('dashboard.skills.title')}</h2>
          <nav className="bosfor-skills" aria-labelledby="dashboard-skills-heading">
            {SKILLS.map(({ id, labelKey }) => (
              <button className="bosfor-skill" data-skill={id} key={id} type="button" onClick={() => navigate(id)}>
                <span className="bosfor-skill-stage"><ModelAsset name={id} /></span>
                <span className="bosfor-skill-label">{t(labelKey)} <ArrowRight size={17} aria-hidden="true" /></span>
              </button>
            ))}
          </nav>
        </section>
        <button className="bosfor-exam" type="button" onClick={() => navigate('exams')}>
          <ModelAsset name="exams" className="size-14" />
          <span>{t('nav.mock')}{targetLevel && <small>{targetLevel}</small>}</span>
          <ArrowRight size={18} className="ml-auto shrink-0" aria-hidden="true" />
        </button>
        <TodayCard progress={dailyQuests} onShowTasks={showTasks} />
      </div>

      <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div ref={tasksRef} tabIndex={-1} role="region" className="bosfor-tasks-anchor min-w-0" aria-labelledby="tasks-panel-heading">
          <DailyQuestsWidget progress={dailyQuests} stats={stats} navigate={navigate} onClaimReward={onClaimDailyReward} isPremium={isPremium} />
        </div>
        <div className="grid min-w-0 gap-4">
          <ReadinessCard total={total} targetLevel={targetLevel} hasResults={hasResults} />
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
            {[
              { label: t('dashboard.stat.quizzes'), value: stats?.completedQuizzes ?? 0, icon: Check, hint: t('dashboard.stat.quizzes.hint') },
              { label: t('dashboard.stat.levels'), value: stats?.levelsCompleted ?? 0, icon: Trophy, hint: t('dashboard.stat.levels.hint') },
            ].map(({ label, value, icon: Icon, hint }) => (
              <Card key={label} className="premium-stat flex items-center gap-3 p-4 sm:p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border bosfor-badge">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</p>
                  <p className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">{value}</p>
                  <p className="hidden text-[11px] text-slate-500 dark:text-slate-400 sm:block">{hint}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <CertificateCalculator initial={initialScores} />

      <footer className="pb-2 pt-2 text-center text-xs text-[var(--studio-muted)]">
        {t('dashboard.footer')}
      </footer>
    </div>
  )
}
