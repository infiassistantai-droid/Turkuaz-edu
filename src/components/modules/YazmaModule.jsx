import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Award,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Keyboard,
  LockKeyhole,
  LoaderCircle,
  PenLine,
  Send,
} from 'lucide-react'
import firstExamTasks from '../../data/turkuaz_bmba_yazma_exam_1.json'
import bmbaWritingData from '../../data/bmbaWritingExams.json'
import { cn } from '../../lib/utils'
import { evaluateEssay, EssayEvaluationClientError } from '../../lib/aiEssayGrader.js'
import { useI18n } from '../../lib/i18n.jsx'

const firstStageRecords = firstExamTasks.map((task, index) => ({
  ...task,
  exam_number: 1,
  task_number: index + 1,
}))

const writingTasks = [
  ...firstStageRecords,
  ...bmbaWritingData.exams.filter((task) => task.exam_number !== 1),
]
  .map((task) => ({
    ...task,
    id: task.id || `bmba-yazma-${task.exam_number}-${task.task_number}`,
    taskNumber: task.task_number,
    targetWords: String(task.word_count).replace(/[-–—]/g, '–'),
  }))
  .sort((a, b) => a.exam_number - b.exam_number || a.task_number - b.task_number)

const STAGES = Array.from({ length: 20 }, (_, index) => {
  const number = index + 1
  return {
    number,
    tasks: writingTasks.filter((task) => task.exam_number === number),
  }
})

const TURKISH_KEYS = [
  'a', 'b', 'c', 'ç', 'd', 'e', 'f', 'g', 'ğ', 'h', 'ı', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'ö', 'p', 'r', 's', 'ş', 't', 'u', 'ü', 'v', 'y', 'z',
  'Ç', 'Ğ', 'İ', 'Ö', 'Ş', 'Ü', "'", ' ', '.', ',', '!', '?',
]

function getWordRange(wordCount) {
  const [minimum, maximum] = String(wordCount).split(/[–—-]/).map(Number)
  return { minimum: minimum || 0, maximum: maximum || minimum || 0 }
}

function countWords(value) {
  const trimmed = value.trim()
  return trimmed ? trimmed.split(/\s+/u).length : 0
}

function validateMeaningfulText(text) {
  const normalized = text.toLocaleLowerCase('tr-TR')
  const words = normalized.match(/[a-zçğıöşü]+/giu) || []
  const letters = normalized.match(/[a-zçğıöşü]/giu) || []
  const nonWhitespace = normalized.match(/\S/gu) || []
  const vowels = normalized.match(/[aeıioöuü]/giu) || []

  if (!words.length || letters.length < 20 || letters.length / Math.max(nonWhitespace.length, 1) < 0.65) {
    return 'random'
  }

  if (words.some((word) => word.length > 30 || /(.)\1{7,}/u.test(word))) {
    return 'long-word'
  }

  const frequencies = new Map()
  for (const word of words) frequencies.set(word, (frequencies.get(word) || 0) + 1)
  const repeatedLimit = Math.max(12, Math.ceil(words.length * 0.2))
  if ([...frequencies.values()].some((count) => count >= repeatedLimit)) {
    return 'repeated-word'
  }

  if (letters.length >= 60 && vowels.length / letters.length < 0.17) {
    return 'random'
  }

  const longConsonantTokens = words.filter((word) => word.length >= 8 && !/[aeıioöuü]/iu.test(word))
  if (longConsonantTokens.length >= 3) {
    return 'random'
  }

  return null
}

function getHighestUnlockedStage(completedStages) {
  const completed = new Set(completedStages)
  let unlocked = 1
  while (completed.has(unlocked) && unlocked < STAGES.length) unlocked += 1
  return unlocked
}

function readSavedProgress(storageKey) {
  if (typeof window === 'undefined') return { responses: {}, completedStages: [] }
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || 'null')
    if (!saved || typeof saved !== 'object') return { responses: {}, completedStages: [] }
    const validTaskIds = new Set(writingTasks.map((task) => task.id))
    const rawResponses = saved.responses && typeof saved.responses === 'object' ? saved.responses : {}
    const responses = Object.fromEntries(
      Object.entries(rawResponses)
        .filter(([taskId, response]) => validTaskIds.has(taskId) && response && typeof response === 'object')
        .map(([taskId, response]) => {
          const score = Number(response.score)
          const aiEvaluated = response.aiEvaluated === true && Boolean(response.submitted) &&
            Number.isInteger(score) && score >= 1 && score <= 100 &&
            typeof response.feedback === 'string' && Array.isArray(response.grammarErrors)
          const previouslyRewarded = Boolean(response.previouslyRewarded || (!aiEvaluated && (response.xpAwardFixed === true || (response.submitted && Number(response.xpAward) > 0))))
          return [taskId, {
            text: typeof response.text === 'string' ? response.text : '',
            submitted: aiEvaluated,
            aiEvaluated,
            previouslyRewarded,
            ...(aiEvaluated && Number.isInteger(score) && score >= 1 && score <= 100 ? { score } : {}),
            ...(aiEvaluated && typeof response.feedback === 'string' ? { feedback: response.feedback } : {}),
            ...(aiEvaluated && Array.isArray(response.grammarErrors) ? { grammarErrors: response.grammarErrors.filter((item) => typeof item === 'string') } : {}),
            ...(aiEvaluated && Number.isFinite(Number(response.xpAward)) ? { xpAward: Number(response.xpAward) } : {}),
          }]
        }),
    )
    const completedStages = STAGES
      .filter((stage) => stage.tasks.length > 0 && stage.tasks.every((task) => responses[task.id]?.aiEvaluated))
      .map((stage) => stage.number)
    return { responses, completedStages }
  } catch {
    return { responses: {}, completedStages: [] }
  }
}

export default function YazmaModule({ completeLevel, profileId = 'local' }) {
  const { t } = useI18n()
  const storageKey = `turkuaz-yazma-stage-progress-v1:${profileId}`
  const [progress, setProgress] = useState(() => readSavedProgress(storageKey))
  const [activeStageNumber, setActiveStageNumber] = useState(null)
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState('')
  const submissionGuardRef = useRef(new Set())
  const textareaRef = useRef(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(progress))
    } catch {
      // Keep progress available in memory if local storage is unavailable.
    }
  }, [progress, storageKey])

  const unlockedStage = getHighestUnlockedStage(progress.completedStages)
  const activeStage = STAGES.find((stage) => stage.number === activeStageNumber) || null
  const stageTasks = activeStage?.tasks || []
  const activeTask = stageTasks.find((task) => task.id === activeTaskId) || stageTasks[0] || null
  const response = activeTask ? progress.responses[activeTask.id] || { text: '', submitted: false } : null
  const text = response?.text || ''
  const words = countWords(text)
  const range = activeTask ? getWordRange(activeTask.word_count) : { minimum: 0, maximum: 0 }
  const withinWordLimit = Boolean(activeTask && words >= range.minimum && words <= range.maximum)
  const wordStatus = words > range.maximum ? 'long' : withinWordLimit ? 'ok' : 'short'
  const wordLabel = t(`module.write.word.${words === 0 ? 'empty' : wordStatus}`)
  const wordTone = withinWordLimit
    ? 'text-emerald-700 dark:text-emerald-300'
    : 'text-rose-700 dark:text-rose-300'
  const taskSubmitted = Boolean(response?.submitted)
  const completedTaskCount = stageTasks.filter((task) => progress.responses[task.id]?.submitted).length
  const stageCompleted = Boolean(activeStage && progress.completedStages.includes(activeStage.number))
  const progressWidth = Math.min(100, (words / Math.max(range.maximum, 1)) * 100)

  const stageCards = useMemo(() => STAGES.map((stage) => ({
    ...stage,
    locked: stage.number > unlockedStage,
    completed: progress.completedStages.includes(stage.number),
    completedTaskCount: stage.tasks.filter((task) => progress.responses[task.id]?.submitted).length,
  })), [progress.completedStages, progress.responses, unlockedStage])

  function openStage(stage) {
    if (stage.number > unlockedStage || !stage.tasks.length) return
    setActiveStageNumber(stage.number)
    setActiveTaskId(stage.tasks[0].id)
    setValidationError('')
  }

  function updateDraft(nextText) {
    if (!activeTask || taskSubmitted || submitting) return
    setValidationError('')
    setProgress((current) => ({
      ...current,
      responses: {
        ...current.responses,
        [activeTask.id]: {
          ...(current.responses[activeTask.id] || {}),
          text: nextText,
          submitted: false,
        },
      },
    }))
  }

  function insertAtCursor(character) {
    if (!activeTask || taskSubmitted || submitting) return
    const textarea = textareaRef.current
    const start = textarea?.selectionStart ?? text.length
    const end = textarea?.selectionEnd ?? start
    updateDraft(`${text.slice(0, start)}${character}${text.slice(end)}`)
    requestAnimationFrame(() => {
      if (!textarea) return
      textarea.focus()
      textarea.setSelectionRange(start + character.length, start + character.length)
    })
  }

  async function handleSubmit() {
    if (!activeTask || !text.trim() || !withinWordLimit || taskSubmitted || submitting || submissionGuardRef.current.has(activeTask.id)) return
    const validationFailure = validateMeaningfulText(text)
    if (validationFailure) {
      setValidationError('module.write.validation.meaningful')
      return
    }

    const task = activeTask
    const draft = text
    const stageNumber = activeStage.number
    const alreadyRewarded = Boolean(response?.previouslyRewarded)
    submissionGuardRef.current.add(task.id)
    setSubmitting(true)
    setValidationError('')

    try {
      const evaluation = await evaluateEssay(draft, task.prompt, task.key_points, task.word_count)
      const xpAward = alreadyRewarded ? 0 : Math.max(1, Math.round(evaluation.score * 0.5))
      const nextResponse = {
        text: draft,
        submitted: true,
        aiEvaluated: true,
        score: evaluation.score,
        feedback: evaluation.feedback,
        grammarErrors: evaluation.grammar_errors,
        xpAward,
        previouslyRewarded: alreadyRewarded,
      }
      setProgress((current) => {
        const responses = { ...current.responses, [task.id]: nextResponse }
        const stageIsNowComplete = stageTasks.every((stageTask) => responses[stageTask.id]?.aiEvaluated)
        const completedStages = stageIsNowComplete
          ? [...new Set([...current.completedStages, stageNumber])].sort((a, b) => a - b)
          : current.completedStages
        return { ...current, responses, completedStages }
      })
      // The score and score-derived XP are from the authenticated server-side Gemini evaluation.
      completeLevel?.(evaluation.score, xpAward)
    } catch (error) {
      submissionGuardRef.current.delete(task.id)
      const code = error instanceof EssayEvaluationClientError ? error.code : 'AI_SERVICE_ERROR'
      setValidationError(`module.write.api.${code}`)
    } finally {
      setSubmitting(false)
    }
  }

  function returnToStages() {
    setActiveStageNumber(null)
    setActiveTaskId(null)
    setValidationError('')
  }

  function selectTask(task) {
    setActiveTaskId(task.id)
    setValidationError('')
  }

  if (!activeStage || !activeTask) {
    return (
      <main className="mx-auto w-full max-w-7xl space-y-6 px-1 pb-8">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-300">
              <PenLine className="h-4 w-4" aria-hidden="true" />
              {t('module.write.title')}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {t('module.write.stagesHeading')}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              {t('module.write.stagesIntro')}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {progress.completedStages.length} / {STAGES.length} · {t('module.write.stagesCompleted')}
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5" aria-label={t('module.write.taskNavigation')}>
          {stageCards.map((stage) => (
            <button
              key={stage.number}
              type="button"
              onClick={() => openStage(stage)}
              disabled={stage.locked}
              aria-disabled={stage.locked}
              className={cn(
                'flex min-h-28 flex-col justify-between rounded-lg border p-4 text-left transition-colors',
                stage.locked
                  ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-600'
                  : stage.completed
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-950 hover:border-emerald-500 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100'
                    : 'border-teal-300 bg-white text-slate-900 hover:border-teal-600 hover:bg-teal-50 dark:border-teal-900 dark:bg-slate-900 dark:text-white dark:hover:border-teal-500 dark:hover:bg-teal-950/30',
              )}
            >
              <span className="flex w-full items-center justify-between gap-2">
                <span className="text-base font-bold">{t('module.write.stageNumber', { number: stage.number })}</span>
                {stage.locked
                  ? <LockKeyhole className="h-4 w-4" aria-label={t('module.write.stageLocked')} />
                  : stage.completed
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" aria-label={t('module.write.stageCompleted')} />
                    : <ChevronRight className="h-4 w-4 text-teal-700 dark:text-teal-300" aria-hidden="true" />}
              </span>
              <span className="text-xs font-medium opacity-80">
                {stage.locked
                  ? t('module.write.stageLocked')
                  : stage.completed
                    ? t('module.write.stageCompleted')
                    : t('module.write.stageTaskCount', { done: stage.completedTaskCount, total: stage.tasks.length })}
              </span>
            </button>
          ))}
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-5 px-1 pb-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={returnToStages}
            disabled={submitting}
            className="inline-flex h-10 items-center gap-2 rounded-lg border disabled:cursor-wait disabled:opacity-60 border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            {t('module.write.backToStages')}
          </button>
          <div>
            <p className="text-xs font-semibold text-teal-700 dark:text-teal-300">{t('module.write.stageNumber', { number: activeStage.number })}</p>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('module.write.workspaceHeading')}</h1>
          </div>
        </div>
        <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          {completedTaskCount} / {stageTasks.length} · {t('module.write.tasksCompleted')}
        </span>
      </header>

      <nav className="flex flex-wrap gap-2" aria-label={t('module.write.taskNavigation')}>
        {stageTasks.map((task) => {
          const isActive = task.id === activeTask.id
          const isComplete = Boolean(progress.responses[task.id]?.submitted)
          return (
            <button
              key={task.id}
              type="button"
              onClick={() => selectTask(task)}
              disabled={submitting}
              aria-current={isActive ? 'step' : undefined}
              className={cn(
                'inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-60',
                isActive
                  ? 'border-teal-700 bg-teal-700 text-white dark:border-teal-400 dark:bg-teal-400 dark:text-slate-950'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
              )}
            >
              {isComplete ? <Check className="h-4 w-4" aria-hidden="true" /> : <CircleDot className="h-4 w-4" aria-hidden="true" />}
              {t('module.write.taskNumber', { number: task.taskNumber })} · {task.level}
            </button>
          )
        })}
      </nav>

      <section className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <article className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <CircleDot className="h-3.5 w-3.5" aria-hidden="true" />
              {activeTask.category}
            </span>
            <span className="rounded-md border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-bold tabular-nums text-teal-800 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-200">
              {activeTask.word_count} {t('module.words')}
            </span>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t('module.write.taskNumber', { number: activeTask.taskNumber })} · {activeTask.level}
            </p>
            <h2 className="text-xl font-bold leading-snug text-slate-900 dark:text-white">{activeTask.title}</h2>
          </div>

          <div className="border-l-2 border-teal-600 pl-4 dark:border-teal-400">
            <p className="whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">{activeTask.prompt}</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">{t('module.write.keyPoints')}</h3>
            <ul className="space-y-3">
              {activeTask.key_points.map((point, index) => (
                <li key={`${activeTask.id}-point-${index}`} className="flex items-start gap-2.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" aria-label={t('module.write.editorLabel')}>
          <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-5">
            <h2 className="font-semibold text-slate-900 dark:text-white">{t('module.write.editorLabel')}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{taskSubmitted ? t('module.write.submitted') : t('module.write.editorHint')}</p>
          </div>

          <div className="p-4 sm:p-5">
            <label className="sr-only" htmlFor="yazma-response">{t('module.write.editorLabel')}</label>
            <textarea
              id="yazma-response"
              ref={textareaRef}
              value={text}
              onChange={(event) => updateDraft(event.target.value)}
              readOnly={taskSubmitted || submitting}
              placeholder={t('module.writePlaceholder')}
              className="min-h-[360px] w-full resize-y rounded-lg border border-slate-300 bg-white p-4 text-[15px] leading-7 text-slate-800 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 read-only:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-teal-400 dark:read-only:bg-slate-900 sm:min-h-[440px]"
            />

            <div className="mt-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-950/70" aria-live="polite">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {words} {t('module.words')} <span className="font-normal text-slate-400">/ {activeTask.word_count}</span>
                </span>
                <span className={cn('font-bold', wordTone)}>{wordLabel}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className={cn('h-full transition-[width] duration-150', withinWordLimit ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-rose-600')}
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {t('module.write.wordRange', { minimum: range.minimum, maximum: range.maximum })}
              </p>
            </div>

            <details className="mt-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-600 marker:hidden dark:text-slate-300">
                <Keyboard className="h-4 w-4" aria-hidden="true" />
                {t('module.write.keyboard')}
              </summary>
              <div className="grid grid-cols-7 gap-1.5 border-t border-slate-200 p-3 dark:border-slate-800 sm:grid-cols-10">
                {TURKISH_KEYS.map((character, index) => (
                  <button
                    key={`${character}-${index}`}
                    type="button"
                    onClick={() => insertAtCursor(character)}
                    disabled={taskSubmitted || submitting}
                    className="h-9 rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-teal-500 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-teal-950"
                  >
                    {character === ' ' ? '␠' : character}
                  </button>
                ))}
              </div>
            </details>

            {validationError && (
              <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200" role="alert">
                {t(validationError)}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">{t('module.write.aiScoreDisclaimer')}</p>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!text.trim() || !withinWordLimit || taskSubmitted || submitting}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
              >
                {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : taskSubmitted ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                {submitting ? t('module.write.aiLoading') : taskSubmitted ? t('module.write.submitted') : t('module.write.submit')}
              </button>
            </div>
          </div>
        </section>
      </section>

      {taskSubmitted && (
        <section className="space-y-5" aria-live="polite">
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40 sm:p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-700 text-white dark:bg-emerald-400 dark:text-slate-950">
              <Award className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-emerald-950 dark:text-emerald-100">{stageCompleted ? t('module.write.stageSuccess') : t('module.write.successTitle')}</h2>
              <p className="mt-0.5 text-sm text-emerald-800 dark:text-emerald-300">{t('module.write.taskCompleted')}</p>
            </div>
            <div className="rounded-md bg-white px-3 py-2 text-center dark:bg-slate-900">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('module.write.aiScore')}</span>
              <span className="text-xl font-extrabold tabular-nums text-emerald-800 dark:text-emerald-300">{response.score}/100</span>
            </div>
            {response.xpAward > 0 && (
              <span className="rounded-md bg-white px-3 py-2 text-sm font-extrabold text-emerald-800 dark:bg-slate-900 dark:text-emerald-300">
                +{response.xpAward} XP
              </span>
            )}
          </div>

          {response.previouslyRewarded && response.xpAward === 0 && (
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              {t('module.write.xpPreviouslyAwarded')}
            </p>
          )}

          <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">{t('module.write.aiFeedback')}</h2>
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">{response.feedback}</p>

            <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
              <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">{t('module.write.grammarErrors')}</h3>
              {response.grammarErrors.length > 0 ? (
                <ul className="space-y-2">
                  {response.grammarErrors.map((error, index) => (
                    <li key={`${activeTask.id}-error-${index}`} className="flex items-start gap-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      <CircleDot className="mt-1 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-emerald-700 dark:text-emerald-300">{t('module.write.noGrammarErrors')}</p>
              )}
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <BookOpenCheck className="h-5 w-5 text-teal-700 dark:text-teal-400" aria-hidden="true" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('module.write.modelAnswer')}</h2>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">{activeTask.model_answer}</p>
          </article>

          {stageCompleted && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={returnToStages}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-teal-700 px-4 py-2.5 text-sm font-bold text-teal-800 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-200 dark:hover:bg-teal-950/40"
              >
                {t('module.write.backToStages')} <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  )
}
