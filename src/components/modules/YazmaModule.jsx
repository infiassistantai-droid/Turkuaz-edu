import { ModelAsset, PanelHeading, SectionBanner } from '../BosforArtwork'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Keyboard,
  LockKeyhole,
  LoaderCircle,
  Send,
} from 'lucide-react'
import firstExamTasks from '../../data/turkuaz_bmba_yazma_exam_1.json'
import bmbaWritingData from '../../data/bmbaWritingExams.json'
import { evaluateEssay, EssayEvaluationClientError } from '../../lib/aiEssayGrader.js'
import { useI18n } from '../../lib/i18n.jsx'
import { saveJSON } from '../../lib/storage.js'
import '../../bosfor-writing.css'

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
  const [draftStored, setDraftStored] = useState(false)
  const submissionGuardRef = useRef(new Set())
  const textareaRef = useRef(null)
  const screenRef = useRef(null)
  const resultRef = useRef(null)

  useEffect(() => {
    setDraftStored(saveJSON(storageKey, progress))
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
  const taskSubmitted = Boolean(response?.submitted)
  const stageCompleted = Boolean(activeStage && progress.completedStages.includes(activeStage.number))
  const progressWidth = Math.min(100, (words / Math.max(range.maximum, 1)) * 100)

  const stageCards = useMemo(() => STAGES.map((stage) => ({
    ...stage,
    locked: stage.number > unlockedStage,
    completed: progress.completedStages.includes(stage.number),
    completedTaskCount: stage.tasks.filter((task) => progress.responses[task.id]?.submitted).length,
  })), [progress.completedStages, progress.responses, unlockedStage])

  function openStage(stage) {
    if (submitting || stage.number > unlockedStage || !stage.tasks.length) return
    const pendingTasks = stage.tasks.filter((task) => !progress.responses[task.id]?.submitted)
    const draftTask = pendingTasks.find((task) => progress.responses[task.id]?.text?.trim())
    const task = draftTask || pendingTasks[0] || stage.tasks[0]
    setActiveStageNumber(stage.number)
    setActiveTaskId(task.id)
    setValidationError('')
    requestAnimationFrame(() => screenRef.current?.focus())
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
      requestAnimationFrame(() => resultRef.current?.focus())
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
    requestAnimationFrame(() => screenRef.current?.focus())
  }

  function selectTask(task, focusScreen = false) {
    setActiveTaskId(task.id)
    setValidationError('')
    if (focusScreen) requestAnimationFrame(() => screenRef.current?.focus())
  }

  const nextStage = stageCards.find(({ locked, completed, tasks }) => !locked && !completed && tasks.length)
  const nextTask = stageTasks.find((task) => !progress.responses[task.id]?.submitted)
  const followingStage = stageCards[activeStageNumber]

  if (!activeStage || !activeTask) {
    return (
      <section ref={screenRef} tabIndex={-1} className="bosfor-writing writing-focus mx-auto max-w-6xl space-y-4" aria-labelledby="writing-title">
        <SectionBanner name="yazma" titleId="writing-title" title={t('nav.writing')} description={t('module.write.stagesIntro')}>
          <span>{progress.completedStages.length}/{STAGES.length} {t('module.write.stagesCompleted')}</span>
        </SectionBanner>

        {nextStage && (
          <section className="bosfor-panel rounded-2xl border p-4 sm:p-6" aria-labelledby="writing-next-stage">
            <PanelHeading name="plan" titleId="writing-next-stage" title={t('module.write.nextStage', { number: nextStage.number })} description={t('module.write.stageTaskCount', { done: nextStage.completedTaskCount, total: nextStage.tasks.length })}>
              <button type="button" className="bosfor-action writing-action" onClick={() => openStage(nextStage)}>
                {t(nextStage.completedTaskCount || nextStage.tasks.some((task) => progress.responses[task.id]?.text) ? 'module.write.resume' : 'module.write.start')} <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </PanelHeading>
          </section>
        )}

        <section className="bosfor-panel rounded-2xl border p-4 sm:p-6" aria-labelledby="writing-stages">
          <PanelHeading name="exams" titleId="writing-stages" title={t('module.write.stagesHeading')} />
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            {stageCards.map((stage) => {
              const locked = stage.locked || !stage.tasks.length
              const body = (
                <>
                  <span className="writing-stage-number" aria-hidden="true">{stage.completed ? <Check className="size-5" /> : stage.number}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-extrabold">{t('module.write.stageNumber', { number: stage.number })}</span>
                    <span className="writing-muted mt-0.5 block text-xs">
                      {locked ? t('module.write.stageLocked') : stage.completed ? t('module.write.stageCompleted') : t('module.write.stageTaskCount', { done: stage.completedTaskCount, total: stage.tasks.length })}
                    </span>
                  </span>
                  {locked ? <LockKeyhole className="size-4 shrink-0" aria-hidden="true" /> : <ArrowRight className="size-4 shrink-0" aria-hidden="true" />}
                </>
              )
              return (
                <li key={stage.number}>
                  {locked ? <div className="writing-stage-card bosfor-inset" data-locked="true">{body}</div> : (
                    <button type="button" className="writing-stage-card bosfor-inset" data-current={stage === nextStage} onClick={() => openStage(stage)}>{body}</button>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      </section>
    )
  }

  return (
    <section ref={screenRef} tabIndex={-1} className="bosfor-writing writing-focus mx-auto max-w-6xl space-y-4" aria-labelledby="writing-workspace">
      <header className="bosfor-panel rounded-2xl border p-4 sm:p-5">
        <PanelHeading name="yazma" titleId="writing-workspace" title={t('module.write.workspaceHeading')} description={t('module.write.stageNumber', { number: activeStage.number })}>
          <button type="button" disabled={submitting} onClick={returnToStages} className="bosfor-control writing-action"><ArrowLeft className="size-4" aria-hidden="true" />{t('module.write.backToStages')}</button>
        </PanelHeading>
        <nav className="mt-4 flex flex-wrap gap-2" aria-label={t('module.write.taskNavigation')}>
          {stageTasks.map((task) => (
            <button key={task.id} type="button" disabled={submitting} aria-current={task === activeTask ? 'step' : undefined} onClick={() => selectTask(task)} className="writing-task-tab bosfor-control writing-action">
              {progress.responses[task.id]?.submitted && <CheckCircle2 className="size-4" aria-label={t('module.write.submitted')} />}
              {t('module.write.taskNumber', { number: task.taskNumber })} · {task.level}
            </button>
          ))}
        </nav>
      </header>

      <div className="writing-layout grid items-start gap-4">
        <article className="writing-prompt bosfor-panel min-w-0 rounded-2xl border p-4 sm:p-6" aria-labelledby="writing-prompt-title">
          <div className="flex flex-wrap items-center gap-2">
            <span lang="tr" className="bosfor-badge px-2.5 py-1.5 text-xs font-bold">{activeTask.category}</span>
            <span className="bosfor-badge px-2.5 py-1.5 text-xs font-bold tabular-nums">{activeTask.targetWords} {t('module.words')}</span>
          </div>
          <h2 id="writing-prompt-title" lang="tr" className="mt-4 text-xl font-extrabold leading-snug">{activeTask.title}</h2>
          <p lang="tr" className="writing-prompt-text mt-3 whitespace-pre-line border-s-2 ps-3 text-sm leading-7">{activeTask.prompt}</p>
          <h3 className="mt-5 text-sm font-extrabold">{t('module.write.keyPoints')}</h3>
          <ul lang="tr" className="writing-muted mt-2 space-y-2">
            {activeTask.key_points.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm leading-6"><Check className="writing-check mt-1 size-4 shrink-0" aria-hidden="true" />{point}</li>
            ))}
          </ul>
        </article>

        {taskSubmitted ? (
          <section ref={resultRef} tabIndex={-1} className="writing-focus bosfor-panel min-w-0 rounded-2xl border p-4 sm:p-6" aria-labelledby="writing-result-title">
            <PanelHeading name="medal" titleId="writing-result-title" title={t(stageCompleted ? (followingStage ? 'module.write.stageSuccess' : 'module.write.stageCompleted') : 'module.write.successTitle')}>
              <span className="bosfor-badge px-2.5 py-1.5 text-xs font-bold">{t('module.write.aiScore')} · <strong className="tabular-nums">{response.score}/100</strong></span>
              {response.xpAward > 0 && <span className="bosfor-badge bosfor-reward-badge inline-flex items-center gap-1 px-2 py-1 text-xs font-bold"><ModelAsset name="xp" className="size-5" />+{response.xpAward} XP</span>}
            </PanelHeading>

            <div className="bosfor-inset mt-4 rounded-xl border p-4">
              <h3 className="font-extrabold">{t('module.write.aiFeedback')}</h3>
              <p className="writing-flow mt-2 whitespace-pre-wrap text-sm leading-7">{response.feedback}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-extrabold">{t('module.write.grammarErrors')}</h3>
              {response.grammarErrors.length ? (
                <ul className="writing-muted writing-flow mt-2 list-disc space-y-1.5 ps-5 text-sm leading-6">
                  {response.grammarErrors.map((error, index) => <li key={index}>{error}</li>)}
                </ul>
              ) : <p className="writing-muted mt-2 text-sm">{t('module.write.noGrammarErrors')}</p>}
            </div>
            {response.previouslyRewarded && response.xpAward === 0 && <p className="writing-muted mt-4 text-sm">{t('module.write.xpPreviouslyAwarded')}</p>}
            <details className="bosfor-inset mt-4 rounded-xl border">
              <summary className="writing-disclosure">{t('module.write.editorLabel')}</summary>
              <p lang="tr" className="writing-flow whitespace-pre-wrap px-3 pb-3 text-sm leading-7">{text}</p>
            </details>
            <details className="bosfor-inset mt-2 rounded-xl border">
              <summary className="writing-disclosure">{t('module.write.modelAnswer')}</summary>
              <p lang="tr" className="writing-flow whitespace-pre-wrap px-3 pb-3 text-sm leading-7">{activeTask.model_answer}</p>
            </details>
            {nextTask && (
              <button type="button" className="bosfor-action writing-action mt-4" onClick={() => selectTask(nextTask, true)}>
                {t('module.write.nextTask')} <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            )}
            {stageCompleted && followingStage && !followingStage.locked && followingStage.tasks.length > 0 && (
              <button type="button" className="bosfor-action writing-action mt-4" onClick={() => openStage(followingStage)}>
                {t('module.write.nextStage', { number: followingStage.number })} <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            )}
          </section>
        ) : (
          <section className="bosfor-panel min-w-0 rounded-2xl border p-4 sm:p-6" aria-labelledby="writing-editor-title">
            <PanelHeading name="yazma" titleId="writing-editor-title" title={t('module.write.editorLabel')} description={t('module.write.editorHint')}>
              {draftStored && text.trim() && <span className="bosfor-badge px-2.5 py-1.5 text-xs font-bold">{t('module.write.draftSaved')}</span>}
            </PanelHeading>
            <textarea id="yazma-response" ref={textareaRef} lang="tr" value={text} onChange={(event) => updateDraft(event.target.value)} readOnly={submitting} placeholder={t('module.writePlaceholder')} aria-labelledby="writing-editor-title" aria-describedby="writing-word-target" className="writing-editor bosfor-inset mt-4 min-h-64 w-full resize-y rounded-xl border p-3 text-base leading-7 sm:min-h-80 sm:p-4" />
            <div className="bosfor-inset mt-2 rounded-xl border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <strong className="tabular-nums">{words} {t('module.words')}</strong>
                <span className="writing-muted text-xs font-semibold">{wordLabel}</span>
              </div>
              <div className="bosfor-track mt-2 h-2 overflow-hidden rounded-full" aria-hidden="true">
                <div className="bosfor-progress-fill writing-word-fill h-full rounded-full" data-status={wordStatus} style={{ width: progressWidth + '%' }} />
              </div>
              <p id="writing-word-target" className="writing-muted mt-2 text-xs">{t('module.write.wordRange', { minimum: range.minimum, maximum: range.maximum })}</p>
            </div>
            <details className="bosfor-inset mt-3 rounded-xl border">
              <summary className="writing-disclosure"><Keyboard className="me-2 inline size-4" aria-hidden="true" />{t('module.write.keyboard')}</summary>
              <div className="writing-keys grid gap-1.5 px-3 pb-3">
                {TURKISH_KEYS.map((character) => (
                  <button key={character} type="button" onClick={() => insertAtCursor(character)} disabled={submitting} aria-label={character === ' ' ? t('module.write.space') : undefined} className="bosfor-control min-h-10 rounded-lg font-bold">
                    {character === ' ' ? '␠' : character}
                  </button>
                ))}
              </div>
            </details>
            {validationError && <p className="writing-error mt-3 rounded-xl border p-3 text-sm font-semibold" role="alert">{t(validationError)}</p>}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="writing-muted max-w-xs text-xs leading-relaxed">{t('module.write.practiceScore')}</p>
              <button type="button" onClick={handleSubmit} disabled={!withinWordLimit || submitting} className="bosfor-action writing-action">
                {submitting ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
                {t(submitting ? 'module.write.aiLoading' : 'module.write.submit')}
              </button>
            </div>
          </section>
        )}
      </div>
    </section>
  )
}

