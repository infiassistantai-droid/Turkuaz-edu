import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, Check, Compass, GraduationCap, LoaderCircle, Sparkles } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'
import { EXAM_LEVELS, normalizeExamDate, STUDY_LEVELS, studyDateKey } from '../lib/studyPlan'
import './OnboardingFlow.css'

const PATHS = [
  { id: 'known', icon: GraduationCap, label: 'setup.level.known', description: 'setup.level.knownDetail' },
  { id: 'beginner', icon: Sparkles, label: 'onboarding.path.beginner', description: 'onboarding.path.beginner.detail' },
  { id: 'placement', icon: Compass, label: 'setup.level.unsure', description: 'setup.level.unsureDetail' },
]
const GOALS = ['education', 'career', 'travel', 'culture']
const STEP_TITLES = ['setup.level.title', 'setup.target.title', 'setup.exam.title']

function LevelChoices({ levels, value, onChange, label }) {
  return (
    <div className="setup-levels" role="group" aria-label={label}>
      {levels.map((level) => (
        <button key={level} type="button" aria-pressed={value === level} onClick={() => onChange(level)}>{level}</button>
      ))}
    </div>
  )
}

export default function OnboardingFlow({ isPremium = false, dark = false, profile, onComplete }) {
  const { t } = useI18n()
  const heading = useRef(null)
  const [step, setStep] = useState(0)
  const [path, setPath] = useState(profile?.startingPath || '')
  const [startingLevel, setStartingLevel] = useState(profile?.startingLevel || '')
  const [targetLevel, setTargetLevel] = useState(EXAM_LEVELS.includes(profile?.targetLevel) ? profile.targetLevel : '')
  const [goal, setGoal] = useState(profile?.learningGoal || '')
  const [examDate, setExamDate] = useState(() => {
    const savedDate = normalizeExamDate(profile?.examDate)
    return savedDate && savedDate >= studyDateKey() ? savedDate : ''
  })
  const [noExamDate, setNoExamDate] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const today = studyDateKey()
  const validDate = normalizeExamDate(examDate)
  const canContinue = step === 0
    ? PATHS.some(({ id }) => path === id) && (path !== 'known' || STUDY_LEVELS.includes(startingLevel))
    : step === 1
      ? EXAM_LEVELS.includes(targetLevel) && GOALS.includes(goal)
      : noExamDate || Boolean(validDate && validDate >= today)

  useEffect(() => {
    heading.current?.focus({ preventScroll: true })
  }, [step])

  async function submit(event) {
    event.preventDefault()
    if (!canContinue || busy) return
    if (step < STEP_TITLES.length - 1) {
      setStep(step + 1)
      return
    }
    setBusy(true)
    setError('')
    try {
      await onComplete?.({
        learningGoal: goal,
        startingPath: path,
        startingLevel: path === 'known' ? startingLevel : path === 'beginner' ? 'A1' : null,
        targetLevel,
        examDate: noExamDate ? null : validDate,
      })
    } catch {
      setError(t('setup.saveError'))
      setBusy(false)
    }
  }

  return (
    <main data-theme={isPremium ? 'premium' : dark ? 'night' : 'default'} className="studio-shell setup-screen">
      <section className="setup-card" aria-labelledby="onboarding-title">
        <header className="setup-head">
          <img src="/icons/turkish-education.svg" alt="" width="40" height="40" />
          <strong>Turkuaz Edu</strong>
          <span aria-label={t('onboarding.progress', { current: step + 1, total: STEP_TITLES.length })}>
            {t('onboarding.step', { current: step + 1, total: STEP_TITLES.length })}
          </span>
        </header>
        <progress className="setup-progress" value={step + 1} max={STEP_TITLES.length} aria-label={t('onboarding.progress', { current: step + 1, total: STEP_TITLES.length })} />

        <form className="setup-form" onSubmit={submit}>
          <h1 id="onboarding-title" tabIndex={-1} ref={heading}>{t(STEP_TITLES[step])}</h1>

          {step === 0 && (
            <>
              <p>{t('setup.level.subtitle')}</p>
              <div role="group" aria-label={t('setup.level.title')} className="setup-options">
                {PATHS.map(({ id, icon: Icon, label, description }) => (
                  <button key={id} type="button" className="setup-option" data-starting-path={id} aria-pressed={path === id} onClick={() => setPath(id)}>
                    <span className="setup-option-icon"><Icon size={19} aria-hidden="true" /></span>
                    <span><strong>{t(label)}</strong><small>{t(description)}</small></span>
                    {path === id && <Check size={18} aria-hidden="true" />}
                  </button>
                ))}
              </div>
              {path === 'known' && (
                <section className="setup-field" aria-labelledby="setup-current">
                  <h2 id="setup-current">{t('setup.level.current')}</h2>
                  <LevelChoices levels={STUDY_LEVELS} value={startingLevel} onChange={setStartingLevel} label={t('setup.level.current')} />
                </section>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <p>{t('setup.target.subtitle')}</p>
              <LevelChoices levels={EXAM_LEVELS} value={targetLevel} onChange={setTargetLevel} label={t('setup.target.title')} />
              <section className="setup-field" aria-labelledby="setup-goal">
                <h2 id="setup-goal">{t('setup.target.reason')}</h2>
                <div className="setup-goals" role="group" aria-labelledby="setup-goal">
                  {GOALS.map((id) => (
                    <button key={id} type="button" data-learning-goal={id} aria-pressed={goal === id} onClick={() => setGoal(id)}>{t('onboarding.goal.' + id)}</button>
                  ))}
                </div>
              </section>
            </>
          )}

          {step === 2 && (
            <>
              <p>{t('setup.exam.subtitle')}</p>
              <div className="setup-field setup-date">
                <label htmlFor="onboarding-exam-date"><CalendarDays size={18} aria-hidden="true" />{t('setup.exam.label')}</label>
                <input id="onboarding-exam-date" type="date" min={today} value={examDate} disabled={noExamDate || busy} onChange={(event) => setExamDate(event.target.value)} />
                {examDate && (!validDate || validDate < today) && <p role="alert">{t('setup.exam.invalid')}</p>}
                <label className="setup-date-unknown"><input type="checkbox" checked={noExamDate} disabled={busy} onChange={(event) => setNoExamDate(event.target.checked)} />{t('setup.exam.unknown')}</label>
              </div>
            </>
          )}

          {error && <p role="alert" className="setup-error">{error}</p>}
          <footer className="setup-actions">
            {step > 0 && <button type="button" disabled={busy} onClick={() => { setError(''); setStep(step - 1) }}><ArrowLeft size={17} aria-hidden="true" />{t('onboarding.back')}</button>}
            <button type="submit" disabled={!canContinue || busy}>
              {t(busy ? 'auth.saving' : step === STEP_TITLES.length - 1 ? 'onboarding.prepare' : 'onboarding.continue')}
              {busy ? <LoaderCircle size={17} className="animate-spin" aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </footer>
        </form>
      </section>
    </main>
  )
}

