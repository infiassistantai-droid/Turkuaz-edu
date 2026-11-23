import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, Check, Clock3 } from 'lucide-react'
import { ModelAsset, PanelHeading, SectionBanner } from './BosforArtwork'
import { loadJSON, saveJSON } from '../lib/storage'
import { useI18n } from '../lib/i18n.jsx'
import { buildStudyPlan, studyDateKey } from '../lib/studyPlan'

const DURATIONS = { 15: [7, 5, 3], 30: [14, 9, 7], 45: [20, 15, 10] }
const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
const UZ_WEEKDAYS = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan']

function formatDate(date, language, weekday = false, includeYear = false) {
  if (language === 'uz') {
    if (weekday) return UZ_WEEKDAYS[date.getDay()]
    const label = date.getDate() + '-' + UZ_MONTHS[date.getMonth()]
    return includeYear ? label + ' ' + date.getFullYear() : label
  }
  return new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-US', weekday
    ? { weekday: 'short' }
    : { day: 'numeric', month: 'long', year: includeYear ? 'numeric' : undefined }).format(date)
}

function readPlan(key, fallback = {}) {
  const saved = loadJSON(key, fallback)
  const budget = Object.hasOwn(DURATIONS, saved?.budget) ? Number(saved.budget) : null
  return { budget, days: saved?.days && typeof saved.days === 'object' ? saved.days : {} }
}

function detailsFor(plan, target, t) {
  const { level, focus, review, phase } = plan
  const values = { level }
  if (target === focus?.id) return t('plan.task.focusDetail', { ...values, score: Math.round(focus.score) })
  if (target === review?.id) return t('plan.task.reviewDetail', { ...values, score: Math.round(review.score) })
  if (target === 'quick-assessment') return t('plan.personal.diagnosticDetail')
  if (phase === 'foundation' && ['lugat', 'okuma', 'dinleme'].includes(target)) return t('plan.personal.foundation.' + target, { level: plan.startingLevel || 'A1' })
  if (target === 'lugat') return t('plan.task.vocabularySupport.detail', values)
  if (target === 'exams') return t('plan.task.checkSkills.detail', values)
  return t('plan.activity.' + target, values)
}

export default function KunlikReja({ stats = {}, sectionResults = {}, profile, navigate, learnerId, onEditProfile }) {
  const { t, language } = useI18n()
  const accessKey = 'turkuaz-daily-plan-v1:' + encodeURIComponent(learnerId || 'local')

  return <StudyPlan key={accessKey} accessKey={accessKey} stats={stats} sectionResults={sectionResults} profile={profile} navigate={navigate} t={t} language={language} onEditProfile={onEditProfile} />
}

function StudyPlan({ accessKey, stats, sectionResults, profile, navigate, t, language, onEditProfile }) {
  const [date, setDate] = useState(() => new Date())
  const [saved, setSaved] = useState(() => readPlan(accessKey))
  const today = studyDateKey(date)
  const dailyRecord = saved.days[today]
  const storedPlan = dailyRecord?.plan
  const generated = buildStudyPlan(profile || {}, sectionResults, date)
  const matchesProfile = storedPlan?.profileKey === generated.profileKey
    || (!storedPlan?.profileKey && !profile?.startingPath && !generated.examDate && storedPlan?.level === generated.level)
  const plan = matchesProfile && Array.isArray(storedPlan?.targets) && storedPlan.targets.length === 3
    ? { ...generated, ...storedPlan }
    : generated
  const budget = saved.budget ?? plan.recommendedBudget
  const completed = Array.isArray(dailyRecord?.completed) ? dailyRecord.completed : []
  const completedCount = plan.targets.filter((id) => completed.includes(id)).length
  const percent = Math.round(completedCount / plan.targets.length * 100)
  const next = plan.targets.find((id) => !completed.includes(id))

  useEffect(() => {
    function refreshDay() {
      const now = new Date()
      setDate((previous) => studyDateKey(previous) === studyDateKey(now) ? previous : now)
    }
    function sync(event) {
      if (event.key === accessKey || event.key === null) setSaved(readPlan(accessKey))
    }
    const timer = window.setInterval(refreshDay, 30000)
    window.addEventListener('focus', refreshDay)
    window.addEventListener('storage', sync)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', refreshDay)
      window.removeEventListener('storage', sync)
    }
  }, [accessKey])

  function updatePlan(budget, target) {
    const now = new Date()
    const currentDay = studyDateKey(now)
    if (currentDay !== today) {
      setDate(now)
      return
    }
    const latest = readPlan(accessKey, saved)
    const record = latest.days[currentDay] || { plan, completed: [] }
    const marks = Array.isArray(record.completed) ? record.completed : []
    const currentMarks = marks.filter((id) => plan.targets.includes(id))
    const nextMarks = !target ? currentMarks : currentMarks.includes(target) ? currentMarks.filter((id) => id !== target) : [...currentMarks, target]
    const days = { ...latest.days, [currentDay]: { plan, completed: nextMarks } }
    const recent = Object.entries(days).sort(([a], [b]) => a.localeCompare(b)).slice(-31)
    const updated = { budget: budget ?? latest.budget, days: Object.fromEntries(recent) }
    saveJSON(accessKey, updated)
    setSaved(updated)
  }

  return (
    <div className="bosfor-plan mx-auto w-full max-w-6xl space-y-5">
      <SectionBanner name="plan" title={t('plan.title')} description={t('plan.today', { date: formatDate(date, language) })}>
        <span><ModelAsset name="streak" className="size-6" />{Math.max(0, Number(stats.streak) || 0)} {t('plan.streak')}</span>
        <span>{t('plan.targetLevel', { level: plan.level })}</span>
      </SectionBanner>

      <section className="bosfor-panel bosfor-plan-preparation rounded-2xl border p-4 sm:p-5" aria-labelledby="plan-personal-heading">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="plan-personal-heading" className="text-base font-extrabold">{t('plan.personal.title')}</h2>
          {onEditProfile && <button type="button" className="bosfor-control min-h-10 rounded-xl px-3 text-xs font-bold" onClick={onEditProfile}>{t('plan.personal.edit')}</button>}
        </div>
        <dl>
          <div><dt>{t('setup.level.current')}</dt><dd>{plan.startingLevel || t('plan.personal.unknownLevel')}</dd></div>
          <div><dt>{t('setup.target.title')}</dt><dd>{plan.level}</dd></div>
          <div><dt><CalendarDays size={13} aria-hidden="true" />{t('setup.exam.label')}</dt><dd>{plan.examDate ? <time dateTime={plan.examDate}>{formatDate(new Date(plan.examDate + 'T12:00:00'), language, false, true)}</time> : t('plan.personal.noDate')}</dd></div>
        </dl>
        <p className="text-xs leading-relaxed text-[var(--studio-muted)]">
          {plan.daysLeft === null ? null : t(plan.daysLeft < 0 ? 'plan.personal.past' : plan.daysLeft === 0 ? 'plan.personal.today' : 'plan.personal.remaining', { count: plan.daysLeft }) + ' '}
          {t('plan.personal.phase.' + plan.phase)}
        </p>
      </section>

      <div className="bosfor-plan-layout grid items-start gap-4">
        <section className="bosfor-plan-progress-card bosfor-panel rounded-2xl border p-4 sm:p-5" aria-labelledby="plan-progress-heading">
          <div className="flex items-center justify-between gap-3">
            <h2 id="plan-progress-heading" className="font-extrabold">{t('plan.checklist.progressTitle')}</h2>
            <span className="bosfor-badge px-2 py-1 text-xs font-bold tabular-nums" aria-live="polite">{t('quests.completedCount', { count: completedCount, total: plan.targets.length })}</span>
          </div>
          <progress className="bosfor-plan-progress mt-3" max={100} value={percent} aria-label={t('plan.progress', { percent })} />
          <p className="mt-2 text-xs text-[var(--studio-muted)]">{t(next ? 'plan.checklist.keepGoing' : 'plan.checklist.finished')}</p>
          <div className="bosfor-tabs mt-4" role="group" aria-label={t('plan.time.title')}>
            {[15, 30, 45].map((minutes) => <button key={minutes} type="button" className="bosfor-tab" aria-pressed={budget === minutes} onClick={() => updatePlan(minutes)}>{t('plan.minutes', { minutes })}</button>)}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--studio-muted)]"><Clock3 size={14} aria-hidden="true" />{t('plan.time.title')}</p>
        </section>


        <section className="bosfor-plan-checklist bosfor-panel rounded-2xl border p-4 sm:p-6" aria-labelledby="today-plan-heading">
          <PanelHeading name="quests" titleId="today-plan-heading" title={t('plan.tasks.title')} description={t('plan.estimate', { minutes: budget, steps: plan.targets.length })} />
          <p className="mt-4 text-xs text-[var(--studio-muted)]">{t('plan.checklist.note')}</p>
          <ol className="mt-3 space-y-2.5">
            {plan.targets.map((target, index) => {
              const done = completed.includes(target)
              const label = t(target === 'lugat' ? 'nav.vocabulary' : target === 'exams' ? 'nav.exams' : target === 'quick-assessment' ? 'plan.personal.diagnostic' : 'plan.skill.' + target)
              return (
                <li key={target} className="bosfor-plan-task bosfor-inset grid items-center gap-3 rounded-xl border p-3 sm:p-4" data-done={done}>
                  <label className="bosfor-plan-check" title={t('plan.checklist.mark', { task: label })}>
                    <input type="checkbox" checked={done} onChange={() => updatePlan(undefined, target)} aria-label={t('plan.checklist.mark', { task: label })} />
                    <Check size={16} aria-hidden="true" />
                  </label>
                  <div className="flex min-w-0 items-center gap-2.5">
                    <ModelAsset name={target === 'quick-assessment' ? 'exams' : target} className="size-10 sm:size-12" />
                    <div className="min-w-0">
                      <h3 className="break-words text-sm font-extrabold sm:text-base">{label}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--studio-muted)]">{detailsFor(plan, target, t)}</p>
                    </div>
                  </div>
                  <div className="bosfor-plan-task-action flex items-center justify-between gap-2 sm:flex-col sm:items-end">
                    <span className="whitespace-nowrap text-xs font-bold tabular-nums text-[var(--studio-muted)]">{t('plan.minutes', { minutes: DURATIONS[budget][index] })}</span>
                    <button type="button" onClick={() => { updatePlan(); navigate?.(target) }} className={(next === target ? 'bosfor-action' : 'bosfor-control') + ' inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-bold'} aria-label={t('plan.openActivity', { task: label })}>
                      {t(done ? 'plan.checklist.review' : 'plan.start')} <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        <section className="bosfor-plan-history-card bosfor-panel rounded-2xl border p-4 sm:p-5" aria-labelledby="plan-history-heading">
          <h2 id="plan-history-heading" className="font-extrabold">{t('plan.history.title')}</h2>
          <ul className="mt-3 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 7 }, (_, index) => {
              const day = new Date(date.getFullYear(), date.getMonth(), date.getDate() - (6 - index))
              const key = studyDateKey(day)
              const record = saved.days[key]
              const count = Array.isArray(record?.completed) ? record.completed.length : 0
              const total = record?.plan?.targets?.length || 3
              return (
                <li key={key} className="bosfor-plan-day" data-today={key === today} data-done={count === total} title={formatDate(day, language) + ' · ' + count + '/' + total}>
                  <span>{formatDate(day, language, true)}</span>
                  <span className="tabular-nums">{count}/{total}</span>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="bosfor-plan-reason-card bosfor-panel rounded-2xl border p-4 sm:p-5" aria-labelledby="plan-reason-heading">
          <h2 id="plan-reason-heading" className="font-extrabold">{t('plan.why.title')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--studio-muted)]">
            {plan.focus
              ? t('plan.reason.assessed', { level: plan.level, skill: t('plan.skill.' + plan.focus.id), score: Math.round(plan.focus.score) })
              : t('plan.reason.noAssessment', { level: plan.level })}
          </p>
        </section>
      </div>
    </div>
  )
}

