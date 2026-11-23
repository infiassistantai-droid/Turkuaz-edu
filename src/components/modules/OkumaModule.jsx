import { useEffect, useRef, useState } from 'react'
import { PanelHeading, SectionBanner } from '../BosforArtwork'
import { ArrowLeft, ArrowRight, CheckCircle2, CircleX, LockKeyhole, RotateCcw } from 'lucide-react'
import { readingExamSections, READING_SECTION_COUNT, QUESTIONS_PER_READING_SECTION } from '../../data/mockExamData'
import { loadJSON, readingSectionProgressKey, saveJSON } from '../../lib/storage'
import { useI18n } from '../../lib/i18n.jsx'
import '../../bosfor-reading.css'

function isSectionReady(section) {
  return section?.status === 'active' &&
    section.questions?.length === QUESTIONS_PER_READING_SECTION &&
    section.questions.every((question) =>
      Array.isArray(question.options) && question.options.length === 4 &&
      Number.isInteger(question.correctOption) && question.correctOption >= 0 && question.correctOption < question.options.length,
    )
}

const readySections = readingExamSections.filter(isSectionReady)

export function getUnlockedReadingSectionNumber(sectionScores = {}) {
  let unlockedSectionNumber = 1
  for (const section of readingExamSections) {
    if (!isSectionReady(section) || !Object.prototype.hasOwnProperty.call(sectionScores, section.id)) break
    unlockedSectionNumber = section.sectionNumber + 1
  }
  return Math.min(unlockedSectionNumber, READING_SECTION_COUNT)
}

export function scoreReadingExam(answers, questions = []) {
  const correctCount = questions.reduce(
    (count, question, index) => count + (answers[index] === question.correctOption ? 1 : 0),
    0,
  )
  const totalQuestions = questions.length
  const incorrectCount = totalQuestions - correctCount
  return {
    correctCount,
    incorrectCount,
    totalQuestions,
    percent: totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0,
  }
}

export default function OkumaModule({ completeLevel, onPerfectScore, profile }) {
  const { t } = useI18n()
  const sectionProgressKey = readingSectionProgressKey(profile?.userId || profile?.email)
  const [selectedSectionId, setSelectedSectionId] = useState(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const headingRef = useRef(null)
  const questionRef = useRef(null)
  const previousPassage = useRef(null)
  const hasStarted = useRef(false)
  const [sectionScores, setSectionScores] = useState(() => {
    const stored = loadJSON(sectionProgressKey, {})
    return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {}
  })
  const unlockedSectionNumber = getUnlockedReadingSectionNumber(sectionScores)

  useEffect(() => {
    saveJSON(sectionProgressKey, sectionScores)
  }, [sectionProgressKey, sectionScores])

  const section = readingExamSections.find((item) => item.id === selectedSectionId) || null
  const currentQuestion = section?.questions?.[questionIndex]
  const sectionQuestionCount = section?.questions?.length || 0
  const progress = sectionQuestionCount ? Math.round(((questionIndex + 1) / sectionQuestionCount) * 100) : 0
  function startSection(sectionToStart) {
    if (!isSectionReady(sectionToStart) || sectionToStart.sectionNumber > unlockedSectionNumber) return
    hasStarted.current = true
    setSelectedSectionId(sectionToStart.id)
    setQuestionIndex(0)
    setSelectedOption(null)
    setAnswers(Array(sectionToStart.questions.length).fill(null))
    setResult(null)
  }

  function returnToSections() {
    setSelectedSectionId(null)
    setQuestionIndex(0)
    setSelectedOption(null)
    setAnswers([])
    setResult(null)
  }

  function finishExam(finalAnswers) {
    if (!section) return
    const finalResult = scoreReadingExam(finalAnswers, section.questions)
    setAnswers(finalAnswers)
    setResult(finalResult)
    setSectionScores((current) => ({
      ...current,
      [section.id]: Math.max(current[section.id] ?? 0, finalResult.percent),
    }))
    completeLevel?.(finalResult.percent, 50)
    if (finalResult.percent === 100) onPerfectScore?.(section.id)
  }

  function goToNextQuestion() {
    if (selectedOption === null || !currentQuestion || !section) return
    const nextAnswers = [...answers]
    nextAnswers[questionIndex] = selectedOption

    if (questionIndex === section.questions.length - 1) {
      finishExam(nextAnswers)
      return
    }

    setAnswers(nextAnswers)
    setQuestionIndex((current) => current + 1)
    setSelectedOption(nextAnswers[questionIndex + 1])
  }

  function goToPreviousQuestion() {
    if (questionIndex === 0) return
    const nextAnswers = [...answers]
    nextAnswers[questionIndex] = selectedOption
    setAnswers(nextAnswers)
    setQuestionIndex((current) => current - 1)
    setSelectedOption(nextAnswers[questionIndex - 1])
  }

  function restartSection() {
    if (!section) return
    setQuestionIndex(0)
    setSelectedOption(null)
    setAnswers(Array(section.questions.length).fill(null))
    setResult(null)
  }


  const focusKey = result ? 'result' : section ? section.id + ':' + questionIndex : 'overview'
  const passage = result ? null : currentQuestion?.passage
  useEffect(() => {
    if (focusKey === 'overview' && !hasStarted.current) return
    const focusTarget = passage && passage === previousPassage.current ? questionRef : headingRef
    previousPassage.current = passage
    focusTarget.current?.focus()
  }, [focusKey, passage])

  if (result && section) {
    return (
      <section ref={headingRef} tabIndex={-1} className="bosfor-reading reading-focus mx-auto max-w-3xl space-y-4" aria-labelledby="reading-exam-result-title">
        <SectionBanner name={result.percent === 100 ? 'medal' : 'readiness'} titleId="reading-exam-result-title" title={t('reading.exam.result.title')} description={t('reading.sections.section', { number: section.sectionNumber })}>
          <span>{t('reading.exam.result.percentage', { percent: result.percent })}</span>
        </SectionBanner>
        <div className="bosfor-panel rounded-2xl border p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-2.5">
            <p className="bosfor-inset rounded-xl border p-3 text-sm font-bold"><CheckCircle2 className="mb-2 size-5" aria-hidden="true" />{t('reading.exam.result.correct', { correct: result.correctCount, total: result.totalQuestions })}</p>
            <p className="bosfor-inset rounded-xl border p-3 text-sm font-bold"><CircleX className="mb-2 size-5" aria-hidden="true" />{t('reading.exam.result.incorrect', { count: result.incorrectCount })}</p>
          </div>
          {result.percent === 100 && <p className="bosfor-reward-badge mt-4 rounded-xl border p-3 text-sm font-bold">{t('reading.exam.result.perfect')}</p>}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button type="button" onClick={returnToSections} className="bosfor-action reading-action"><ArrowLeft className="size-4" aria-hidden="true" />{t('reading.sections.return')}</button>
            <button type="button" onClick={restartSection} className="bosfor-control reading-action"><RotateCcw className="size-4" aria-hidden="true" />{t('reading.exam.result.retry')}</button>
          </div>
        </div>
      </section>
    )
  }

  if (section && currentQuestion) {
    const questionTitle = t('reading.exam.progress', { current: questionIndex + 1, total: sectionQuestionCount })
    const isLastQuestion = questionIndex === sectionQuestionCount - 1
    return (
      <section className="bosfor-reading mx-auto max-w-6xl space-y-4" aria-labelledby="reading-exam-title">
        <header className="bosfor-panel rounded-2xl border p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <PanelHeading name="okuma" titleId="reading-exam-title" title={t('reading.sections.section', { number: section.sectionNumber })} description={questionTitle} />
            <button type="button" onClick={returnToSections} className="bosfor-control reading-action"><ArrowLeft className="size-4" aria-hidden="true" />{t('reading.sections.return')}</button>
          </div>
          <div className="bosfor-track mt-4 h-2 overflow-hidden rounded-full" role="progressbar" aria-label={questionTitle} aria-valuemin={0} aria-valuemax={sectionQuestionCount} aria-valuenow={questionIndex + 1}>
            <div className="bosfor-progress-fill h-full rounded-full" style={{ width: progress + '%' }} />
          </div>
        </header>

        <div className="reading-exam-layout grid items-start gap-4">
          <article className="bosfor-panel min-w-0 rounded-2xl border p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bosfor-badge px-2.5 py-1 text-xs font-bold">{currentQuestion.level}</span>
              <span className="reading-muted text-xs font-semibold">{t('reading.exam.passage')}</span>
            </div>
            <h3 ref={headingRef} tabIndex={-1} lang="tr" className="reading-focus mt-3 text-lg font-extrabold">{currentQuestion.sourceTitle}</h3>
            <p lang="tr" className="reading-passage mt-3 whitespace-pre-line text-[.95rem] leading-7 sm:text-base sm:leading-8">{currentQuestion.passage}</p>
          </article>

          <div className="reading-question-panel bosfor-panel min-w-0 rounded-2xl border p-4 sm:p-6">
            <fieldset className="min-w-0">
              <legend className="reading-muted text-xs font-bold">{t('reading.exam.question')}</legend>
              <p ref={questionRef} tabIndex={-1} id="reading-question-text" lang="tr" className="reading-focus mt-2 break-words font-extrabold leading-relaxed">{currentQuestion.question}</p>
              <div className="mt-4 space-y-2" role="radiogroup" aria-labelledby="reading-question-text">
                {currentQuestion.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="reading-option bosfor-inset flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm leading-relaxed" data-selected={selectedOption === optionIndex}>
                    <input type="radio" name={currentQuestion.id} value={optionIndex} checked={selectedOption === optionIndex} onChange={() => setSelectedOption(optionIndex)} className="mt-0.5 size-4 shrink-0" />
                    <span lang="tr" className="min-w-0 break-words">{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-4 flex flex-wrap justify-between gap-2">
              <button type="button" onClick={goToPreviousQuestion} disabled={questionIndex === 0} className="bosfor-control reading-action"><ArrowLeft className="size-4" aria-hidden="true" />{t('reading.exam.previous')}</button>
              <button type="button" onClick={goToNextQuestion} disabled={selectedOption === null} className="bosfor-action reading-action">
                {t(isLastQuestion ? 'reading.exam.finish' : 'reading.exam.next')}<ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const completedCount = readySections.filter(({ id }) => Object.hasOwn(sectionScores, id)).length
  const nextSection = readySections.find(({ id, sectionNumber }) => sectionNumber <= unlockedSectionNumber && !Object.hasOwn(sectionScores, id))
  return (
    <section className="bosfor-reading mx-auto max-w-6xl space-y-4" aria-labelledby="reading-sections-title">
      <SectionBanner name="okuma" titleId="reading-sections-title" title={t('reading.sections.title')} description={t('reading.sections.format', { questions: QUESTIONS_PER_READING_SECTION })}>
        <span>{t('reading.sections.completed', { completed: completedCount, total: readySections.length })}</span>
      </SectionBanner>

      {nextSection && (
        <section className="bosfor-panel reading-next rounded-2xl border p-4 sm:p-6" aria-labelledby="reading-next-section">
          <PanelHeading name="plan" titleId="reading-next-section" title={t('reading.sections.nextSection', { number: nextSection.sectionNumber })} description={t('reading.sections.summary', { passages: nextSection.passages.length, questions: nextSection.questions.length })}>
            <button ref={headingRef} type="button" onClick={() => startSection(nextSection)} className="bosfor-action reading-action">
              {t('reading.sections.start')} <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </PanelHeading>
        </section>
      )}

      <section className="bosfor-panel rounded-2xl border p-4 sm:p-6" aria-labelledby="reading-all-sections">
        <PanelHeading name="exams" titleId="reading-all-sections" title={t('reading.sections.all')} description={t('reading.sections.unlockHint')} />
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {readingExamSections.map((item) => {
            const isReady = isSectionReady(item)
            const isUnlocked = isReady && item.sectionNumber <= unlockedSectionNumber
            const bestScore = Object.hasOwn(sectionScores, item.id) ? sectionScores[item.id] : undefined
            const title = t('reading.sections.section', { number: item.sectionNumber })
            const body = (
              <>
                <span className="reading-section-icon" aria-hidden="true">{bestScore !== undefined ? <CheckCircle2 className="size-5" /> : item.sectionNumber}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-extrabold">{title}</span>
                  <span className="reading-muted mt-0.5 block text-xs">{bestScore !== undefined
                    ? t('reading.sections.bestScore', { percent: bestScore })
                    : isUnlocked
                      ? t('reading.sections.summary', { passages: item.passages.length, questions: item.questions.length })
                      : t(isReady ? 'reading.sections.locked' : 'reading.sections.comingSoon')}</span>
                </span>
                {isUnlocked ? <ArrowRight className="size-4 shrink-0" aria-hidden="true" /> : <LockKeyhole className="reading-muted size-4 shrink-0" aria-hidden="true" />}
              </>
            )
            return (
              <li key={item.id} className="min-w-0">
                {isUnlocked ? (
                  <button ref={item === readySections[0] && !nextSection ? headingRef : undefined} type="button" onClick={() => startSection(item)} className="reading-section-card bosfor-inset" data-current={item === nextSection}>{body}</button>
                ) : <div className="reading-section-card bosfor-inset" data-locked="true">{body}</div>}
              </li>
            )
          })}
        </ul>
      </section>
    </section>
  )
}

