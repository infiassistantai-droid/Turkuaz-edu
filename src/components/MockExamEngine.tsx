import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, BookOpenText, Check, Clock3, FileText, Headphones, Mic, MicOff, Square, Volume2 } from 'lucide-react'
import examSource from '../data/Turkuaz_BMBA_Full_Mock_Exam_1.json'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'

type SectionId = 'okuma' | 'dinleme' | 'yazma' | 'konusma'
type SourceQuestion = { q_id: string; type: string; question: string; options: string[]; correct_answer?: string }
type ReadingPassage = { id: string; title: string; content: string; questions: SourceQuestion[] }
type ListeningItem = { id: string; title: string; transcript: string; questions: SourceQuestion[] }
type WritingTask = { id: string; title: string; category?: string; prompt: string; key_points?: string[] }
type SpeakingPart = { level?: string; category?: string; topic?: string; questions?: string[]; prompt?: string; key_points?: string[] }
type ExamSource = {
  exam_id: string
  title: string
  description: string
  duration_minutes: number
  sections: {
    okuma: { title: string; duration_minutes: number; texts: ReadingPassage[] }
    dinleme: { title: string; duration_minutes: number; audios: ListeningItem[] }
    yazma: { title: string; duration_minutes: number; tasks: WritingTask[] }
    konusma: { title: string; duration_minutes: number; tasks: Array<{ part_1: SpeakingPart; part_2: SpeakingPart; part_3: SpeakingPart }> }
  }
}
type ExamAnswers = {
  okuma: Record<string, string>
  dinleme: Record<string, string>
  yazma: Record<string, string>
  konusma: { audioBlobs: Record<string, Blob> }
}
type ExamStep =
  | { kind: 'reading'; id: string; passage: ReadingPassage }
  | { kind: 'listening'; id: string; item: ListeningItem }
  | { kind: 'writing'; id: string; task: WritingTask }
  | { kind: 'speaking'; id: string; partNumber: number; part: SpeakingPart }

type ExamCompletionResult = { answers: ExamAnswers; timeSpentSeconds: number; correctAnswerCount: number; earnedXp: number; examId: string; examTaskType: string }
type EngineProps = {
  onExamComplete?: (result: ExamCompletionResult) => void
  onExit?: () => void
}

const EXAM = examSource as ExamSource
const SECTION_ORDER: SectionId[] = ['okuma', 'dinleme', 'yazma', 'konusma']
const SECTION_LABELS: Record<SectionId, string> = {
  okuma: 'nav.reading',
  dinleme: 'nav.listening',
  yazma: 'nav.writing',
  konusma: 'nav.speaking',
}
const SECTION_ICONS = { okuma: BookOpenText, dinleme: Headphones, yazma: FileText, konusma: Mic }

function createEmptyAnswers(): ExamAnswers {
  return { okuma: {}, dinleme: {}, yazma: {}, konusma: { audioBlobs: {} } }
}

function getSteps(section: SectionId): ExamStep[] {
  if (section === 'okuma') return EXAM.sections.okuma.texts.map((passage) => ({ kind: 'reading', id: passage.id, passage }))
  if (section === 'dinleme') return EXAM.sections.dinleme.audios.map((item) => ({ kind: 'listening', id: item.id, item }))
  if (section === 'yazma') return EXAM.sections.yazma.tasks.map((task) => ({ kind: 'writing', id: task.id, task }))
  const speakingParts = EXAM.sections.konusma.tasks[0]
  return [speakingParts.part_1, speakingParts.part_2, speakingParts.part_3].map((part, index) => ({
    kind: 'speaking', id: `part_${index + 1}`, partNumber: index + 1, part,
  }))
}

function getSectionDuration(section: SectionId) {
  return EXAM.sections[section].duration_minutes
}

function formatClock(seconds: number) {
  const safe = Math.max(0, seconds)
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`
}

function speakTurkish(text: string, onEnd: () => void, onError: () => void) {
  if (!text || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'tr-TR'
  utterance.rate = 0.92
  utterance.onend = onEnd
  utterance.onerror = onError
  window.speechSynthesis.speak(utterance)
  return true
}

function SectionProgress({ activeIndex, submittedSections, t }: { activeIndex: number; submittedSections: SectionId[]; t: (key: string, values?: Record<string, string | number>) => string }) {
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label={t('engine.sectionNavigation')}>
      {SECTION_ORDER.map((section, index) => {
        const Icon = SECTION_ICONS[section]
        const isComplete = submittedSections.includes(section)
        const isActive = index === activeIndex
        return (
          <li key={section} aria-current={isActive ? 'step' : undefined}>
            <div className={cn(
              'flex min-h-10 items-center justify-center gap-1.5 rounded-xl border px-1.5 text-center text-[10px] font-bold transition-colors sm:gap-2 sm:px-3 sm:text-xs',
              isActive ? 'border-teal-400/70 bg-teal-500/15 text-teal-800 dark:text-teal-100' : isComplete ? 'border-emerald-300/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200' : 'border-slate-200/80 bg-white/65 text-slate-500 dark:border-slate-700/80 dark:bg-slate-900/55 dark:text-slate-400',
            )}>
              {isComplete ? <Check className="size-3.5 shrink-0" aria-hidden="true" /> : <Icon className="size-3.5 shrink-0" aria-hidden="true" />}
              <span className="truncate">{t(SECTION_LABELS[section])}</span>
              <span className="hidden text-[10px] opacity-70 sm:inline">{index + 1}/4</span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function ObjectiveQuestions({ questions, answers, onSelect, t }: {
  questions: SourceQuestion[]
  answers: Record<string, string>
  onSelect: (questionId: string, option: string) => void
  t: (key: string, values?: Record<string, string | number>) => string
}) {
  return (
    <div className="space-y-5">
      {questions.map((question, index) => (
        <fieldset key={question.q_id} className="rounded-2xl border border-slate-200/80 bg-white/65 p-4 dark:border-slate-700/80 dark:bg-slate-950/45 sm:p-5">
          <legend className="sr-only">{t('fullExam.question', { number: index + 1 })}</legend>
          <div className="mb-3 flex items-start gap-2.5">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-teal-100 text-xs font-extrabold text-teal-900 dark:bg-teal-300/15 dark:text-teal-100">{index + 1}</span>
            <div>
              <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300">{t('fullExam.question', { number: index + 1 })}</p>
              <p className="text-sm font-semibold leading-6 text-slate-800 dark:text-slate-100">{question.question}</p>
            </div>
          </div>
          <p className="mb-2 ml-9 text-xs text-slate-500 dark:text-slate-400">{t('fullExam.selectAnswer')}</p>
          <div className="space-y-2 pl-0 sm:pl-9">
            {question.options.map((option, optionIndex) => {
              const selected = answers[question.q_id] === option
              return (
                <button
                  key={`${question.q_id}-${optionIndex}`}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(question.q_id, option)}
                  className={cn(
                    'flex min-h-11 min-w-[44px] w-full items-start gap-3 rounded-xl border px-3 py-3 text-left text-sm leading-5 transition-colors active:scale-[.99]',
                    selected ? 'border-teal-500 bg-teal-500/10 text-teal-950 ring-1 ring-teal-500/35 dark:border-teal-400 dark:bg-teal-400/10 dark:text-teal-50' : 'border-slate-200/80 bg-white/70 text-slate-700 hover:border-teal-400/60 hover:bg-teal-50/60 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-teal-500/60 dark:hover:bg-teal-950/35',
                  )}
                >
                  <span className={cn('mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border', selected ? 'border-teal-600 bg-teal-600 text-white dark:border-teal-300 dark:bg-teal-300 dark:text-slate-950' : 'border-slate-400 dark:border-slate-500')}>
                    {selected && <span className="size-1.5 rounded-full bg-current" />}
                  </span>
                  <span className="min-w-0 break-words">{option}</span>
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}
    </div>
  )
}

export default function MockExamEngine({ onExamComplete, onExit }: EngineProps) {
  const { t } = useI18n()
  const stepsBySection = useMemo(() => Object.fromEntries(SECTION_ORDER.map((section) => [section, getSteps(section)])) as Record<SectionId, ExamStep[]>, [])
  const [phase, setPhase] = useState<'intro' | 'exam' | 'submitted'>('intro')
  const [sectionIndex, setSectionIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [submittedSections, setSubmittedSections] = useState<SectionId[]>([])
  const [examAnswers, setExamAnswers] = useState<ExamAnswers>(createEmptyAnswers)
  const [deadline, setDeadline] = useState<number | null>(null)
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const [isBusy, setIsBusy] = useState(false)
  const [timeoutNotice, setTimeoutNotice] = useState(false)
  const [audioFallback, setAudioFallback] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingPart, setRecordingPart] = useState<string | null>(null)
  const [recordingError, setRecordingError] = useState('')
  const [requestingMicrophone, setRequestingMicrophone] = useState(false)
  const [audioPreviewUrls, setAudioPreviewUrls] = useState<Record<string, string>>({})

  const answersRef = useRef(examAnswers)
  const mountedRef = useRef(true)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const currentSectionRef = useRef<SectionId>(SECTION_ORDER[sectionIndex])
  const phaseRef = useRef(phase)
  const transitionLockRef = useRef(false)
  const finishLockRef = useRef(false)
  const examStartedAtRef = useRef<number | null>(null)
  const timeoutHandlerRef = useRef<() => void>(() => undefined)
  const timeoutDeadlineRef = useRef<number | null>(null)
  const previewUrlsRef = useRef(audioPreviewUrls)
  const currentStepId = stepsBySection[SECTION_ORDER[sectionIndex]]?.[stepIndex]?.id
  const currentStepIdRef = useRef<string | undefined>(currentStepId)
  currentStepIdRef.current = currentStepId

  answersRef.current = examAnswers
  currentSectionRef.current = SECTION_ORDER[sectionIndex]
  phaseRef.current = phase
  previewUrlsRef.current = audioPreviewUrls

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
      Object.values(previewUrlsRef.current).forEach((url) => URL.revokeObjectURL(url))
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [])

  function updateAnswers(update: (current: ExamAnswers) => ExamAnswers) {
    const next = update(answersRef.current)
    answersRef.current = next
    setExamAnswers(next)
  }

  function correctObjectiveAnswerCount(answers: ExamAnswers) {
    const questions = [
      ...EXAM.sections.okuma.texts.flatMap((passage) => passage.questions),
      ...EXAM.sections.dinleme.audios.flatMap((audio) => audio.questions),
    ]
    return questions.reduce((total, question) => {
      const selected = String(answers.okuma[question.q_id] ?? answers.dinleme[question.q_id] ?? '').trim().toLocaleLowerCase('tr-TR')
      const correct = String(question.correct_answer ?? '').trim()
      const letter = correct.match(/^([A-H])(?:[.)\s:]|$)/iu)
      const correctOption = letter ? question.options[letter[1].toUpperCase().charCodeAt(0) - 65] : correct
      return total + (selected && selected === String(correctOption).trim().toLocaleLowerCase('tr-TR') ? 1 : 0)
    }, 0)
  }

  function completeExam() {
    if (finishLockRef.current) return
    finishLockRef.current = true
    setPhase('submitted')
    setDeadline(null)
    const answers = answersRef.current
    const timeSpentSeconds = examStartedAtRef.current === null ? 0 : Math.max(0, Math.floor((Date.now() - examStartedAtRef.current) / 1000))
    const correctAnswerCount = correctObjectiveAnswerCount(answers)
    onExamComplete?.({
      answers,
      timeSpentSeconds,
      correctAnswerCount,
      earnedXp: timeSpentSeconds >= 60 ? 50 + correctAnswerCount * 10 : 0,
      examId: EXAM.exam_id,
      examTaskType: 'exam:full-mock',
    })
  }

  async function stopActiveRecording() {
    const recorder = recorderRef.current
    if (!recorder || recorder.state !== 'recording') return
    setRecordingPart(null)
    await new Promise<void>((resolve) => {
      recorder.addEventListener('stop', () => resolve(), { once: true })
      try {
        recorder.stop()
      } catch {
        resolve()
      }
    })
  }

  async function submitSectionAndAdvance(section: SectionId, dueToTimeout: boolean) {
    if (transitionLockRef.current || phaseRef.current !== 'exam' || currentSectionRef.current !== section) return
    transitionLockRef.current = true
    setIsBusy(true)
    try {
      await stopActiveRecording()
      setSubmittedSections((existing) => existing.includes(section) ? existing : [...existing, section])
      if (dueToTimeout) setTimeoutNotice(true)
      const index = SECTION_ORDER.indexOf(section)
      if (index === SECTION_ORDER.length - 1) {
        completeExam()
        return
      }
      const nextSection = SECTION_ORDER[index + 1]
      const nextDeadline = Date.now() + getSectionDuration(nextSection) * 60_000
      setSectionIndex(index + 1)
      setStepIndex(0)
      setDeadline(nextDeadline)
      setSecondsRemaining(getSectionDuration(nextSection) * 60)
      setAudioFallback(false)
      setIsPlaying(false)
    } finally {
      transitionLockRef.current = false
      setIsBusy(false)
    }
  }

  timeoutHandlerRef.current = () => {
    const section = SECTION_ORDER[sectionIndex]
    void submitSectionAndAdvance(section, true)
  }

  useEffect(() => {
    if (phase !== 'exam' || deadline === null) return undefined
    const activeDeadline = deadline
    let timeoutDispatched = false
    const tick = () => {
      const next = Math.max(0, Math.ceil((activeDeadline - Date.now()) / 1000))
      setSecondsRemaining(next)
      if (next === 0 && !timeoutDispatched && timeoutDeadlineRef.current !== activeDeadline && !transitionLockRef.current) {
        timeoutDispatched = true
        timeoutDeadlineRef.current = activeDeadline
        timeoutHandlerRef.current()
      }
    }
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [phase, deadline, sectionIndex])

  useEffect(() => {
    setAudioFallback(false)
    setIsPlaying(false)
    setRecordingError('')
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }, [sectionIndex, stepIndex])

  function startExam() {
    if (recorderRef.current?.state === 'recording') void stopActiveRecording()
    const freshAnswers = createEmptyAnswers()
    answersRef.current = freshAnswers
    setExamAnswers(freshAnswers)
    setPhase('exam')
    examStartedAtRef.current = Date.now()
    setSectionIndex(0)
    setStepIndex(0)
    setSubmittedSections([])
    setTimeoutNotice(false)
    setIsBusy(false)
    transitionLockRef.current = false
    finishLockRef.current = false
    timeoutDeadlineRef.current = null
    const firstDeadline = Date.now() + getSectionDuration(SECTION_ORDER[0]) * 60_000
    setDeadline(firstDeadline)
    setSecondsRemaining(getSectionDuration(SECTION_ORDER[0]) * 60)
  }

  async function continueExam() {
    if (transitionLockRef.current || phaseRef.current !== 'exam') return
    setTimeoutNotice(false)
    const section = SECTION_ORDER[sectionIndex]
    const steps = stepsBySection[section]
    if (stepIndex === steps.length - 1) {
      await submitSectionAndAdvance(section, false)
      return
    }
    transitionLockRef.current = true
    setIsBusy(true)
    try {
      await stopActiveRecording()
      setStepIndex((current) => current + 1)
    } finally {
      transitionLockRef.current = false
      setIsBusy(false)
    }
  }

  async function finishExam() {
    if (transitionLockRef.current || finishLockRef.current || phaseRef.current !== 'exam') return
    transitionLockRef.current = true
    setIsBusy(true)
    try {
      await stopActiveRecording()
      setSubmittedSections((existing) => existing.includes('konusma') ? existing : [...existing, 'konusma'])
      completeExam()
    } finally {
      transitionLockRef.current = false
      setIsBusy(false)
    }
  }

  function selectObjectiveAnswer(section: 'okuma' | 'dinleme', questionId: string, option: string) {
    updateAnswers((current) => ({ ...current, [section]: { ...current[section], [questionId]: option } }))
  }

  function updateWritingResponse(taskId: string, text: string) {
    updateAnswers((current) => ({ ...current, yazma: { ...current.yazma, [taskId]: text } }))
  }

  async function toggleRecording(partId: string) {
    setRecordingError('')
    if (recorderRef.current?.state === 'recording') {
      await stopActiveRecording()
      return
    }
    if (!window.isSecureContext) {
      setRecordingError(t('konusma.record.secureContext'))
      return
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setRecordingError(t('fullExam.speak.unsupported'))
      return
    }
    setRequestingMicrophone(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (!mountedRef.current || phaseRef.current !== 'exam' || currentSectionRef.current !== 'konusma' || currentStepIdRef.current !== partId) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      streamRef.current = stream
      const recorder = new MediaRecorder(stream)
      recorderRef.current = recorder
      audioChunksRef.current = []
      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data)
      })
      recorder.addEventListener('stop', () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        if (mountedRef.current && blob.size > 0) {
          updateAnswers((current) => ({ ...current, konusma: { ...current.konusma, audioBlobs: { ...current.konusma.audioBlobs, [partId]: blob } } }))
          const url = URL.createObjectURL(blob)
          setAudioPreviewUrls((existing) => {
            if (existing[partId]) URL.revokeObjectURL(existing[partId])
            return { ...existing, [partId]: url }
          })
        }
        if (mountedRef.current) setRecordingPart(null)
        stream.getTracks().forEach((track) => track.stop())
        if (streamRef.current === stream) streamRef.current = null
      }, { once: true })
      recorder.start()
      setRecordingPart(partId)
    } catch (error) {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      recorderRef.current = null
      const name = error && typeof error === 'object' ? error.name : ''
      const errorKey = ['NotAllowedError', 'PermissionDeniedError'].includes(name)
        ? 'konusma.record.permissionDenied'
        : name === 'SecurityError'
          ? 'konusma.record.secureContext'
          : 'fullExam.speak.failed'
      if (mountedRef.current) setRecordingError(t(errorKey))
    } finally {
      if (mountedRef.current) setRequestingMicrophone(false)
    }
  }

  function playListeningText(text: string) {
    if (isPlaying && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }
    const started = speakTurkish(text, () => setIsPlaying(false), () => {
      setIsPlaying(false)
      setAudioFallback(true)
    })
    if (started) setIsPlaying(true)
    else setAudioFallback(true)
  }

  const section = SECTION_ORDER[sectionIndex]
  const sectionSteps = stepsBySection[section]
  const currentStep = sectionSteps[stepIndex]
  const isFinalSpeakingStep = section === 'konusma' && stepIndex === sectionSteps.length - 1
  const sectionMinutes = getSectionDuration(section)
  const timerUrgent = secondsRemaining <= 5 * 60
  const answerCounts = useMemo(() => ({
    okuma: Object.keys(examAnswers.okuma).length,
    dinleme: Object.keys(examAnswers.dinleme).length,
    yazma: Object.values(examAnswers.yazma).filter((text) => text.trim().length > 0).length,
    konusma: Object.keys(examAnswers.konusma.audioBlobs).length,
  }), [examAnswers])

  if (phase === 'intro') {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/85 p-6 shadow-xl shadow-slate-950/5 dark:border-slate-700/70 dark:bg-slate-900/75 sm:p-9 lg:p-12">
          <div className="absolute -right-20 -top-24 size-72 rounded-full bg-teal-400/20 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-32 -left-10 size-72 rounded-full bg-cyan-500/10 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">{t('fullExam.eyebrow')}</p>
            <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">{EXAM.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">{EXAM.description}</p>

            <div className="mt-7 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,20rem)] xl:items-stretch">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SECTION_ORDER.map((id, index) => {
                  const Icon = SECTION_ICONS[id]
                  return (
                    <div key={id} className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-700/70 dark:bg-slate-950/45">
                      <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-300/15 dark:text-teal-200"><Icon className="size-4" aria-hidden="true" /></div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{t(SECTION_LABELS[id])}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('fullExam.sectionDuration', { minutes: getSectionDuration(id) })}</p>
                      <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{index + 1} / 4</span>
                    </div>
                  )
                })}
              </div>
              <div className="flex min-w-0 flex-col justify-between rounded-2xl border border-teal-300/40 bg-gradient-to-br from-teal-600/10 to-cyan-500/10 p-5 dark:border-teal-300/20 dark:from-teal-500/10 dark:to-cyan-400/10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('fullExam.duration')}</p>
                  <p className="mt-1 flex items-baseline gap-2 text-3xl font-black text-slate-950 dark:text-white"><Clock3 className="size-6 text-teal-700 dark:text-teal-300" />{EXAM.duration_minutes}<span className="text-sm font-bold text-slate-600 dark:text-slate-300">{t('fullExam.minutes')}</span></p>
                  <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">{t('fullExam.startHint')}</p>
                </div>
                <button type="button" onClick={startExam} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-teal-700/20 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
                  {t('fullExam.start')}<ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            {onExit && <button type="button" onClick={onExit} className="mt-6 text-sm font-semibold text-slate-500 underline decoration-slate-400/50 underline-offset-4 hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-200">{t('fullExam.exit')}</button>}
          </div>
        </section>
      </main>
    )
  }

  if (phase === 'submitted') {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-emerald-300/40 bg-white/90 p-7 text-center shadow-xl shadow-emerald-950/5 dark:border-emerald-300/20 dark:bg-slate-900/80 sm:p-12">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200"><Check className="size-8" aria-hidden="true" /></div>
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">{t('fullExam.complete.answers')}</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{t('fullExam.complete.title')}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{t('fullExam.complete.body')}</p>
          <div className="mx-auto mt-7 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {SECTION_ORDER.map((id) => {
              const Icon = SECTION_ICONS[id]
              return <div key={id} className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/50"><Icon className="mx-auto size-4 text-teal-700 dark:text-teal-300" aria-hidden="true" /><p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-200">{t(SECTION_LABELS[id])}</p><p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{t('fullExam.complete.count', { count: answerCounts[id] })}</p></div>
            })}
          </div>
          <p className="mx-auto mt-5 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">{t('fullExam.sessionNote')}</p>
          {onExit && <button type="button" onClick={onExit} className="mt-7 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900">{t('fullExam.exit')}</button>}
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-3 sm:px-6 lg:px-8">
      <div className="sticky top-[76px] z-30 mb-6 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-lg shadow-slate-950/10 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-950/95 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-300/15 dark:text-teal-200"><Clock3 className="size-4" aria-hidden="true" /></span>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{t('fullExam.remaining')} · {t(SECTION_LABELS[section])}</p>
              <p className={cn('font-mono text-xl font-black tabular-nums sm:text-2xl', timerUrgent ? 'text-rose-700 dark:text-rose-300' : 'text-slate-900 dark:text-white')} aria-label={`${formatClock(secondsRemaining)} ${t('fullExam.remaining')}`}>{formatClock(secondsRemaining)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('fullExam.inProgress')}</p>
            <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-200">{t('fullExam.sectionOf', { current: sectionIndex + 1, total: 4 })}</p>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{t('fullExam.stepOf', { current: stepIndex + 1, total: sectionSteps.length })} · {t('fullExam.sectionDuration', { minutes: sectionMinutes })}</p>
          </div>
        </div>
        <SectionProgress activeIndex={sectionIndex} submittedSections={submittedSections} t={t} />
      </div>

      {timeoutNotice && <div role="status" className="mb-4 rounded-xl border border-amber-300/50 bg-amber-50/80 px-4 py-3 text-sm font-medium text-amber-950 dark:border-amber-300/25 dark:bg-amber-300/10 dark:text-amber-100">{t('fullExam.timeout')}</div>}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">{t('fullExam.eyebrow')}</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">{t(SECTION_LABELS[section])}</h1>
        </div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{EXAM.title}</p>
      </div>

      {currentStep?.kind === 'reading' && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <section className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/75 sm:p-7">
            <div className="mb-4 flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-300/15 dark:text-teal-200"><BookOpenText className="size-5" aria-hidden="true" /></span><div><p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">{t('fullExam.reading.passage', { number: stepIndex + 1 })}</p><h2 className="mt-1 text-lg font-extrabold leading-6 text-slate-900 dark:text-white">{currentStep.passage.title}</h2></div></div>
            <p className="whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-200">{currentStep.passage.content}</p>
          </section>
          <ObjectiveQuestions questions={currentStep.passage.questions} answers={examAnswers.okuma} onSelect={(id, option) => selectObjectiveAnswer('okuma', id, option)} t={t} />
        </div>
      )}

      {currentStep?.kind === 'listening' && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <section className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/75 sm:p-7">
            <div className="mb-4 flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-100 text-cyan-900 dark:bg-cyan-300/15 dark:text-cyan-100"><Headphones className="size-5" aria-hidden="true" /></span><div><p className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300">{t('fullExam.listening.audio', { number: stepIndex + 1 })}</p><h2 className="mt-1 text-lg font-extrabold leading-6 text-slate-900 dark:text-white">{currentStep.item.title}</h2></div></div>
            <p className="mb-4 text-xs leading-5 text-slate-600 dark:text-slate-300">{t('fullExam.audio.info')}</p>
            <button type="button" onClick={() => playListeningText(currentStep.item.transcript)} className="inline-flex min-h-11 min-w-[44px] items-center gap-2 rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
              {isPlaying ? <Square className="size-4" aria-hidden="true" /> : <Volume2 className="size-4" aria-hidden="true" />}{isPlaying ? t('fullExam.audio.stop') : t(audioFallback ? 'fullExam.audio.replay' : 'fullExam.audio.play')}
            </button>
            {audioFallback && <div className="mt-4 rounded-xl border border-amber-300/50 bg-amber-50/80 p-3 text-xs leading-5 text-amber-950 dark:border-amber-300/25 dark:bg-amber-300/10 dark:text-amber-100">{t('fullExam.audio.fallback')}</div>}
            {audioFallback && <p className="mt-4 whitespace-pre-line rounded-xl border border-slate-200/80 bg-slate-50/75 p-4 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200">{currentStep.item.transcript}</p>}
          </section>
          <ObjectiveQuestions questions={currentStep.item.questions} answers={examAnswers.dinleme} onSelect={(id, option) => selectObjectiveAnswer('dinleme', id, option)} t={t} />
        </div>
      )}

      {currentStep?.kind === 'writing' && (
        <section className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/75 sm:p-7">
          <div className="mb-5 flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-900 dark:bg-violet-300/15 dark:text-violet-100"><FileText className="size-5" aria-hidden="true" /></span><div><p className="text-[10px] font-bold uppercase tracking-wider text-violet-800 dark:text-violet-300">{t('fullExam.writing.task', { number: stepIndex + 1 })} · {currentStep.task.category}</p><h2 className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">{currentStep.task.title}</h2></div></div>
          <p className="whitespace-pre-line rounded-2xl border border-slate-200/80 bg-slate-50/75 p-4 text-sm leading-7 text-slate-700 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-200">{currentStep.task.prompt}</p>
          {currentStep.task.key_points?.length ? <ul className="mt-4 grid gap-2 sm:grid-cols-2">{currentStep.task.key_points.map((point, index) => <li key={`${currentStep.id}-point-${index}`} className="flex items-start gap-2 rounded-xl border border-slate-200/70 bg-white/50 px-3 py-2 text-xs leading-5 text-slate-600 dark:border-slate-700/70 dark:bg-slate-950/35 dark:text-slate-300"><span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-teal-500" />{point}</li>)}</ul> : null}
          <label htmlFor={`writing-${currentStep.id}`} className="mb-2 mt-5 block text-sm font-bold text-slate-800 dark:text-slate-100">{t('fullExam.write.response')}</label>
          <textarea id={`writing-${currentStep.id}`} value={examAnswers.yazma[currentStep.id] || ''} onChange={(event) => updateWritingResponse(currentStep.id, event.target.value)} rows={10} placeholder={t('fullExam.write.placeholder')} className="w-full resize-y rounded-2xl border border-slate-300 bg-white p-4 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-600 dark:bg-slate-950/75 dark:text-slate-100 dark:placeholder:text-slate-500" />
        </section>
      )}

      {currentStep?.kind === 'speaking' && (
        <section className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/75 sm:p-7">
          <div className="mb-5 flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-900 dark:bg-rose-300/15 dark:text-rose-100"><Mic className="size-5" aria-hidden="true" /></span><div><p className="text-[10px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">{t('fullExam.speaking.part', { number: currentStep.partNumber })} · {currentStep.part.category}</p><h2 className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">{currentStep.part.topic}</h2></div></div>
          {currentStep.part.prompt && <p className="whitespace-pre-line rounded-2xl border border-slate-200/80 bg-slate-50/75 p-4 text-sm leading-7 text-slate-700 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-200">{currentStep.part.prompt}</p>}
          {currentStep.part.questions?.length ? <ol className="space-y-3">{currentStep.part.questions.map((prompt, index) => <li key={`${currentStep.id}-prompt-${index}`} className="flex gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/75 p-4 dark:border-slate-700 dark:bg-slate-950/50"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-rose-100 text-xs font-bold text-rose-900 dark:bg-rose-300/15 dark:text-rose-100">{index + 1}</span><p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{prompt}</p></li>)}</ol> : null}
          {currentStep.part.key_points?.length ? <ul className="mt-4 grid gap-2 sm:grid-cols-2">{currentStep.part.key_points.map((point, index) => <li key={`${currentStep.id}-key-${index}`} className="flex items-start gap-2 rounded-xl border border-slate-200/70 bg-white/50 px-3 py-2 text-xs leading-5 text-slate-600 dark:border-slate-700/70 dark:bg-slate-950/35 dark:text-slate-300"><span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-rose-500" />{point}</li>)}</ul> : null}
          <div className="mt-6 rounded-2xl border border-rose-200/70 bg-rose-50/65 p-4 dark:border-rose-300/20 dark:bg-rose-400/5">
            <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">{t('fullExam.speak.privacy')}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button type="button" disabled={requestingMicrophone || isBusy} onClick={() => void toggleRecording(currentStep.id)} className={cn('inline-flex min-h-11 min-w-[44px] items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900', recordingPart === currentStep.id ? 'bg-rose-700 hover:bg-rose-600 focus:ring-rose-400' : 'bg-teal-700 hover:bg-teal-600 focus:ring-teal-400', (requestingMicrophone || isBusy) && 'cursor-wait opacity-60')}>
                {recordingPart === currentStep.id ? <MicOff className="size-4" aria-hidden="true" /> : <Mic className="size-4" aria-hidden="true" />}{requestingMicrophone ? t('konusma.record.requesting') : recordingPart === currentStep.id ? t('fullExam.speak.stop') : t('fullExam.speak.record')}
              </button>
              {recordingPart === currentStep.id && <span className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300"><span className="size-2 animate-pulse rounded-full bg-rose-500" />{t('fullExam.speak.recording')}</span>}
              {examAnswers.konusma.audioBlobs[currentStep.id] && recordingPart !== currentStep.id && <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300"><Check className="size-4" aria-hidden="true" />{t('fullExam.speak.recorded')}</span>}
            </div>
            {recordingError && <p role="alert" className="mt-3 text-xs font-medium text-rose-800 dark:text-rose-200">{recordingError}</p>}
            {audioPreviewUrls[currentStep.id] && recordingPart !== currentStep.id && <audio className="mt-4 w-full" controls preload="metadata" src={audioPreviewUrls[currentStep.id]} aria-label={t('fullExam.speak.play')} />}
          </div>
        </section>
      )}

      <div className="mt-6 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">{t('fullExam.sessionNote')}</p>
        {isFinalSpeakingStep ? (
          <button type="button" disabled={isBusy || Boolean(recordingPart)} onClick={() => void finishExam()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-700 to-orange-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-rose-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 dark:focus:ring-offset-slate-950">
            {t('fullExam.finishOriginal')}<Check className="size-4" aria-hidden="true" />
          </button>
        ) : (
          <button type="button" disabled={isBusy || Boolean(recordingPart)} onClick={() => void continueExam()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-teal-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-slate-950">
            {stepIndex === sectionSteps.length - 1 ? t('fullExam.submitContinue') : t('fullExam.continue')}<ArrowRight className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </main>
  )
}
