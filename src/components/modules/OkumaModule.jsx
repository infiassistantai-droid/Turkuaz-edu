import { useState } from 'react'
import { ArrowLeft, BookOpenText, CheckCircle2, LockKeyhole, RotateCcw } from 'lucide-react'
import { readingExamSections, READING_SECTION_COUNT, QUESTIONS_PER_READING_SECTION } from '../../data/mockExamData'
import { useI18n } from '../../lib/i18n.jsx'
import { cn } from '../../lib/utils'

function isSectionReady(section) {
  return section?.status === 'active' &&
    section.questions?.length === QUESTIONS_PER_READING_SECTION &&
    section.questions.every((question) =>
      Array.isArray(question.options) && question.options.length === 4 &&
      Number.isInteger(question.correctOption) && question.correctOption >= 0 && question.correctOption < question.options.length,
    )
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

export default function OkumaModule({ completeLevel, onPerfectScore, premium = false }) {
  const { t } = useI18n()
  const [selectedSectionId, setSelectedSectionId] = useState(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [sectionScores, setSectionScores] = useState({})

  const section = readingExamSections.find((item) => item.id === selectedSectionId) || null
  const currentQuestion = section?.questions?.[questionIndex]
  const sectionQuestionCount = section?.questions?.length || 0
  const progress = sectionQuestionCount ? Math.round(((questionIndex + 1) / sectionQuestionCount) * 100) : 0
  const surface = premium
    ? 'border-slate-700 bg-slate-900 text-slate-100'
    : 'border-slate-200 bg-white text-slate-900'
  const muted = premium ? 'text-slate-300' : 'text-slate-600'

  function startSection(sectionToStart) {
    if (!isSectionReady(sectionToStart)) return
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
    setSelectedOption(null)
  }

  function restartSection() {
    if (!section) return
    setQuestionIndex(0)
    setSelectedOption(null)
    setAnswers(Array(section.questions.length).fill(null))
    setResult(null)
  }

  if (result && section) {
    return (
      <section className={cn('mx-auto max-w-3xl rounded-2xl border p-6 sm:p-8', surface)} aria-labelledby="reading-exam-result-title">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <CheckCircle2 className={cn('size-10', result.percent === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-teal-700 dark:text-teal-400')} aria-hidden="true" />
          <h2 id="reading-exam-result-title" className="mt-4 text-2xl font-bold">{t('reading.exam.result.title')}</h2>
          <p className={cn('mt-2 text-sm font-semibold', muted)}>{t('reading.sections.section', { number: section.sectionNumber })}</p>
          <p className="mt-3 text-4xl font-bold tabular-nums">{t('reading.exam.result.percentage', { percent: result.percent })}</p>
          <div className={cn('mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm', muted)}>
            <span>{t('reading.exam.result.correct', { correct: result.correctCount, total: section.questions.length })}</span>
            <span>{t('reading.exam.result.incorrect', { count: result.incorrectCount })}</span>
          </div>
          {result.percent === 100 && (
            <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
              {t('reading.exam.result.perfect')}
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={restartSection}
              className={cn(
                'inline-flex min-h-10 items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2',
                premium ? 'border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
              )}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              {t('reading.exam.result.retry')}
            </button>
            <button
              type="button"
              onClick={returnToSections}
              className={cn(
                'inline-flex min-h-10 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2',
                premium ? 'bg-teal-400 text-slate-950 hover:bg-teal-300' : 'bg-teal-700 text-white hover:bg-teal-800',
              )}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {t('reading.sections.return')}
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (section && currentQuestion) {
    return (
      <section className="mx-auto max-w-4xl space-y-4" aria-labelledby="reading-exam-title">
        <button
          type="button"
          onClick={returnToSections}
          className={cn(
            'inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2',
            premium ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
          )}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('reading.sections.return')}
        </button>

        <header className={cn('rounded-2xl border p-5 sm:p-6', surface)}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <BookOpenText className="mt-0.5 size-5 shrink-0 text-teal-700 dark:text-teal-400" aria-hidden="true" />
              <div>
                <h2 id="reading-exam-title" className="text-xl font-bold">{t('reading.sections.section', { number: section.sectionNumber })}</h2>
                <p className={cn('mt-1 text-sm', muted)}>{currentQuestion.sourceTitle} · {currentQuestion.level}</p>
              </div>
            </div>
            <span className="shrink-0 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-semibold tabular-nums dark:border-slate-700">
              {t('reading.exam.progress', { current: questionIndex + 1, total: section.questions.length })}
            </span>
          </div>
          <div
            className={cn('mt-5 h-2 overflow-hidden rounded-full', premium ? 'bg-slate-700' : 'bg-slate-100')}
            role="progressbar"
            aria-label={t('reading.exam.progress', { current: questionIndex + 1, total: section.questions.length })}
            aria-valuemin={1}
            aria-valuemax={section.questions.length}
            aria-valuenow={questionIndex + 1}
          >
            <div className="h-full rounded-full bg-teal-700 transition-[width] duration-200 dark:bg-teal-400" style={{ width: `${progress}%` }} />
          </div>
        </header>

        <article className={cn('rounded-2xl border p-5 sm:p-6', surface)}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className={cn('text-xs font-bold uppercase tracking-wide', muted)}>{t('reading.exam.passage')}</h3>
            <span className={cn('text-xs font-medium', muted)}>{t('reading.sections.passageCount', { count: section.passages.length })}</span>
          </div>
          <p lang="tr" className="mt-3 whitespace-pre-line text-sm leading-7 sm:text-base">{currentQuestion.passage}</p>
        </article>

        <fieldset className={cn('rounded-2xl border p-5 sm:p-6', surface)}>
          <legend className="sr-only">{t('reading.exam.question')}</legend>
          <p lang="tr" className="text-base font-semibold leading-relaxed sm:text-lg">
            <span className={cn('mb-2 block text-xs font-bold uppercase tracking-wide', muted)}>{t('reading.exam.question')}</span>
            {currentQuestion.question}
          </p>
          <div className="mt-5 space-y-2.5">
            {currentQuestion.options.map((option, optionIndex) => {
              const isSelected = selectedOption === optionIndex
              return (
                <label
                  key={`${currentQuestion.id}-option-${optionIndex}`}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2',
                    isSelected
                      ? premium ? 'border-teal-400 bg-teal-950/40' : 'border-teal-700 bg-teal-50'
                      : premium ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50',
                  )}
                >
                  <input
                    type="radio"
                    name={`reading-exam-question-${section.id}-${questionIndex}`}
                    value={optionIndex}
                    checked={isSelected}
                    onChange={() => setSelectedOption(optionIndex)}
                    className="mt-0.5 size-4 accent-teal-700"
                    aria-label={t('reading.exam.option', { number: optionIndex + 1 })}
                  />
                  <span lang="tr">{option}</span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={goToNextQuestion}
            disabled={selectedOption === null}
            className={cn(
              'inline-flex min-h-10 items-center justify-center rounded-lg px-5 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              premium ? 'bg-teal-400 text-slate-950 hover:bg-teal-300' : 'bg-teal-700 text-white hover:bg-teal-800',
            )}
          >
            {questionIndex === section.questions.length - 1 ? t('reading.exam.finish') : t('reading.exam.next')}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-5xl space-y-5" aria-labelledby="reading-sections-title">
      <header className={cn('flex flex-wrap items-start justify-between gap-4 rounded-2xl border p-5 sm:p-6', surface)}>
        <div>
          <h2 id="reading-sections-title" className="flex items-center gap-2 text-xl font-bold">
            <BookOpenText className="size-5 text-teal-700 dark:text-teal-400" aria-hidden="true" />
            {t('reading.sections.title')}
          </h2>
          <p className={cn('mt-2 max-w-2xl text-sm leading-relaxed', muted)}>
            {t('reading.sections.subtitle', { active: readingExamSections.filter((item) => item.status === 'active').length, total: READING_SECTION_COUNT, questions: QUESTIONS_PER_READING_SECTION })}
          </p>
        </div>
        <button
          type="button"
          disabled
          aria-disabled="true"
          className={cn(
            'inline-flex min-h-10 cursor-not-allowed items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold opacity-70',
            premium ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-500',
          )}
        >
          <LockKeyhole className="size-4" aria-hidden="true" />
          {t('reading.sections.libraryLocked')}
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {readingExamSections.map((item) => {
          const isActive = isSectionReady(item)
          const bestScore = sectionScores[item.id]
          return (
            <article key={item.id} className={cn('flex min-h-32 flex-col justify-between rounded-xl border p-4', surface, !isActive && (premium ? 'opacity-65' : 'bg-slate-50 text-slate-500'))}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{t('reading.sections.section', { number: item.sectionNumber })}</h3>
                  <p className={cn('mt-1 text-xs', muted)}>
                    {isActive
                      ? t('reading.sections.summary', { passages: item.passages.length, questions: item.questions.length })
                      : item.questions.length
                        ? t('reading.sections.upcomingSummary', { passages: item.passages.length, questions: item.questions.length })
                        : t('reading.sections.comingSoon')}
                  </p>
                </div>
                {bestScore !== undefined && <span className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold tabular-nums dark:border-slate-700">{t('reading.sections.bestScore', { percent: bestScore })}</span>}
              </div>
              <button
                type="button"
                onClick={() => startSection(item)}
                disabled={!isActive}
                className={cn(
                  'mt-4 inline-flex min-h-9 w-full items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed',
                  isActive
                    ? premium ? 'border-teal-400 bg-teal-400 text-slate-950 hover:bg-teal-300' : 'border-teal-700 bg-teal-700 text-white hover:bg-teal-800'
                    : premium ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-400',
                )}
                aria-label={t(isActive ? 'reading.sections.start' : 'reading.sections.comingSoon')}
              >
                {t(isActive ? 'reading.sections.start' : 'reading.sections.comingSoon')}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
