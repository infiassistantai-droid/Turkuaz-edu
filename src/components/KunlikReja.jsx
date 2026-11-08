import { useMemo } from 'react'
import { ArrowRight, BookOpenText, CalendarDays, Circle, ClipboardCheck, Flame, Headphones, Mic, Pencil, RotateCcw } from 'lucide-react'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'

const ASSESSABLE_SKILLS = [
  { id: 'okuma', titleKey: 'plan.skill.okuma', icon: BookOpenText },
  { id: 'dinleme', titleKey: 'plan.skill.dinleme', icon: Headphones },
  { id: 'yazma', titleKey: 'plan.skill.yazma', icon: Pencil },
  { id: 'konusma', titleKey: 'plan.skill.konusma', icon: Mic },
]

function formatToday(language) {
  return new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : language === 'en' ? 'en-US' : 'uz-UZ', {
    day: 'numeric',
    month: 'long',
  }).format(new Date())
}

function getLatestAssessedSkills(sectionResults = {}) {
  return ASSESSABLE_SKILLS
    .map((skill) => {
      const rawScore = sectionResults?.[skill.id]?.scaledScore
      if (rawScore === null || rawScore === undefined || rawScore === '') return null
      const score = Number(rawScore)
      return Number.isFinite(score) && score >= 0
        ? { ...skill, score: Math.min(75, score) }
        : null
    })
    .filter(Boolean)
    .sort((left, right) => left.score - right.score)
}

function buildDailyPlan(sectionResults, targetLevel) {
  const level = String(targetLevel || 'B1').toUpperCase()
  const assessedSkills = getLatestAssessedSkills(sectionResults)
  const focusSkill = assessedSkills[0]
  if (focusSkill) {
    const runnerUp = assessedSkills[1]
    const tasks = [
      {
        id: `focus-${focusSkill.id}`,
        titleKey: focusSkill.titleKey,
        detailKey: 'plan.task.focusDetail',
        detailValues: { score: Math.round(focusSkill.score), level },
        icon: focusSkill.icon,
        minutes: 20,
        target: focusSkill.id,
      },
      {
        id: 'vocabulary-support',
        titleKey: 'plan.task.vocabularySupport.title',
        detailKey: 'plan.task.vocabularySupport.detail',
        detailValues: { level },
        icon: RotateCcw,
        minutes: 15,
        target: 'lugat',
      },
      runnerUp
        ? {
            id: `review-${runnerUp.id}`,
            titleKey: runnerUp.titleKey,
            detailKey: 'plan.task.reviewDetail',
            detailValues: { score: Math.round(runnerUp.score), level },
            icon: runnerUp.icon,
            minutes: 12,
            target: runnerUp.id,
          }
        : {
            id: 'check-another-skill',
            titleKey: 'plan.task.checkSkills.title',
            detailKey: 'plan.task.checkSkills.detail',
            detailValues: { level },
            icon: ClipboardCheck,
            minutes: 12,
            target: 'exams',
          },
    ]
    return {
      level,
      focusSkill,
      assessedSkills,
      reasonKey: 'plan.reason.assessed',
      reasonValues: { skill: focusSkill.titleKey, score: Math.round(focusSkill.score), level },
      basisKey: 'plan.basis.results',
      tasks,
    }
  }

  return {
    level,
    focusSkill: null,
    assessedSkills,
    reasonKey: 'plan.reason.noAssessment',
    reasonValues: { level },
    basisKey: 'plan.basis.goal',
    tasks: [
      { id: 'starter-vocabulary', titleKey: 'plan.task.vocabulary', detailKey: 'plan.task.vocabularyStarter', detailValues: { level }, icon: RotateCcw, minutes: 15, target: 'lugat' },
      { id: 'starter-listening', titleKey: 'plan.task.listening', detailKey: 'plan.task.listeningStarter', detailValues: { level }, icon: Headphones, minutes: 20, target: 'dinleme' },
      { id: 'starter-speaking', titleKey: 'plan.task.speaking', detailKey: 'plan.task.speakingStarter', detailValues: { level }, icon: Mic, minutes: 12, target: 'konusma' },
    ],
  }
}

function CircularProgress({ value, label }) {
  const radius = 23
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - value / 100)
  return (
    <div className="relative grid size-[68px] shrink-0 place-items-center" role="img" aria-label={label}>
      <svg viewBox="0 0 56 56" className="size-[68px] -rotate-90" aria-hidden="true">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-800" />
        <circle cx="28" cy="28" r={radius} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="text-violet-400 transition-[stroke-dashoffset] duration-500" />
      </svg>
      <span className="absolute text-sm font-extrabold tabular-nums text-white">{value}%</span>
    </div>
  )
}

export default function KunlikReja({ stats = {}, sectionResults = {}, targetLevel = 'B1', navigate, isPremium = false }) {
  const { t, language } = useI18n()
  const streak = Math.max(0, Number(stats?.streak) || 0)
  const plan = useMemo(() => buildDailyPlan(sectionResults, targetLevel), [sectionResults, targetLevel])
  const totalMinutes = plan.tasks.reduce((sum, task) => sum + task.minutes, 0)
  const progressPercent = 0 // Plan rows are suggestions, not user-markable completion state.

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 pb-10 sm:space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-200">
            <CalendarDays className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-extrabold uppercase tracking-[.18em] text-violet-300">{t('plan.today', { date: formatToday(language) })}</p>
            <h1 className="mt-1 truncate text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">{t('plan.title')}</h1>
          </div>
        </div>
        <div className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <Flame className="size-4 text-orange-400" aria-hidden="true" />
          <span className="text-sm font-extrabold tabular-nums">{streak}</span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('plan.streak')}</span>
        </div>
      </header>

      <section className={cn('overflow-hidden rounded-3xl border bg-[#0b1220] p-4 text-white shadow-2xl shadow-slate-950/20 sm:p-6', isPremium ? 'border-amber-300/25 shadow-amber-950/10' : 'border-slate-800')} aria-labelledby="today-plan-heading">
        <div className="flex items-center gap-4 sm:gap-5">
          <span className="hidden size-12 shrink-0 place-items-center rounded-2xl border border-violet-300/15 bg-violet-400/10 text-violet-200 sm:grid">
            <BookOpenText className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-violet-300">{t('plan.todayLabel')}</p>
            <h2 id="today-plan-heading" className="mt-1 text-lg font-black tracking-tight sm:text-xl">{t('plan.tasks.title')}</h2>
            <p className="mt-1 text-xs font-medium text-slate-400 sm:text-sm">{t('plan.estimate', { minutes: totalMinutes, steps: plan.tasks.length })}</p>
          </div>
          <CircularProgress value={progressPercent} label={t('plan.progress', { percent: progressPercent })} />
        </div>

        <aside className="mt-5 rounded-2xl border border-indigo-300/15 bg-gradient-to-r from-indigo-400/[.09] to-violet-400/[.04] p-3.5 sm:p-4">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-indigo-300/20 bg-indigo-300/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.13em] text-indigo-200">{t(plan.basisKey)}</span>
            <span className="text-[10px] font-bold text-slate-400">{t('plan.targetLevel', { level: plan.level })}</span>
          </div>
          <p className="text-xs leading-5 text-slate-200 sm:text-sm">{t(plan.reasonKey, { ...plan.reasonValues, skill: plan.reasonValues.skill ? t(plan.reasonValues.skill) : '' })}</p>
        </aside>

        <ol className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
          {plan.tasks.map(({ id, titleKey, detailKey, detailValues = {}, icon: Icon, minutes, target }, index) => {
            const isFirst = index === 0
            return (
              <li key={id} className="grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 sm:gap-4 sm:p-4">
                <span className="text-[10px] font-bold tabular-nums text-slate-500" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-indigo-300/15 bg-gradient-to-br from-violet-500/15 to-indigo-500/10 text-indigo-200 sm:size-11">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <Circle className="size-4 shrink-0 text-slate-600" aria-hidden="true" />
                    <h3 className="truncate text-sm font-extrabold text-white sm:text-[15px]">{t(titleKey)}</h3>
                  </div>
                  <p className="mt-1 truncate pl-6 text-xs text-slate-400">{t(detailKey, detailValues)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="whitespace-nowrap text-[10px] font-bold tabular-nums text-slate-400 sm:text-xs">{t('plan.minutes', { minutes })}</span>
                  <button
                    type="button"
                    onClick={() => navigate?.(target)}
                    className={cn(
                      'inline-flex min-h-11 min-w-[44px] items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 sm:px-4',
                      isFirst
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-lg shadow-indigo-950/40 hover:brightness-110 active:scale-[.98]'
                        : 'border border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-500 hover:bg-slate-700',
                    )}
                  >
                    {t('plan.start')}<ArrowRight className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              </li>
            )
          })}
        </ol>
        <p className="mt-4 flex items-center gap-2 text-[11px] leading-5 text-slate-500">
          <Circle className="size-3 shrink-0" aria-hidden="true" />{t('plan.suggestionsOnly')}
        </p>
      </section>
    </div>
  )
}
