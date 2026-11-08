import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  LockKeyhole,
  Mic,
  Play,
  RotateCcw,
  Send,
  Square,
  Trash2,
  Trophy,
} from 'lucide-react'
import bmbaSpeakingExams from '../../data/bmbaSpeakingExams.json'
import { cn } from '../../lib/utils'
import { useI18n } from '../../lib/i18n.jsx'

const SPEAKING_PROGRESS_PREFIX = 'turkuaz-edu-speaking-recording-progress-v1:'
const COMPLETION_XP = 40
const MIN_RECORDING_SECONDS = 5
const PARTS = [
  { key: 'part_1', labelKey: 'konusma.part.part1' },
  { key: 'part_2', labelKey: 'konusma.part.part2' },
  { key: 'part_3', labelKey: 'konusma.part.part3' },
]

const EXAMS = (bmbaSpeakingExams?.exams || [])
  .filter((exam) => exam?.part_1 && exam?.part_2 && exam?.part_3)
  .sort((a, b) => a.exam_number - b.exam_number)

function formatClock(seconds) {
  const safe = Math.max(0, Math.floor(seconds))
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`
}

function getProgressStorageKey(profileId) {
  return `${SPEAKING_PROGRESS_PREFIX}${String(profileId || 'local')}`
}

function readCompletedExams(storageKey) {
  if (typeof window === 'undefined') return []
  try {
    const value = JSON.parse(window.localStorage.getItem(storageKey) || 'null')
    return Array.isArray(value?.completedExamIds)
      ? value.completedExamIds.filter((id) => typeof id === 'string')
      : []
  } catch {
    return []
  }
}

function getPermissionErrorKey(error) {
  if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') return 'konusma.record.permissionDenied'
  if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') return 'konusma.record.noMicrophone'
  if (error?.name === 'SecurityError' || error?.name === 'TypeError') return 'konusma.record.secureContext'
  return 'konusma.record.failed'
}

export default function KonusmaModule({ onComplete, profileId = 'local' }) {
  const { t } = useI18n()
  const progressStorageKey = getProgressStorageKey(profileId)
  const [completedExamIds, setCompletedExamIds] = useState(() => readCompletedExams(progressStorageKey))
  const [selectedExamNumber, setSelectedExamNumber] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [recordings, setRecordings] = useState({})
  const [checkedKeyPoints, setCheckedKeyPoints] = useState([])
  const [preparationSeconds, setPreparationSeconds] = useState(60)
  const [preparationRunning, setPreparationRunning] = useState(false)
  const [preparationReady, setPreparationReady] = useState(false)
  const [speechSeconds, setSpeechSeconds] = useState(120)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [recordingPart, setRecordingPart] = useState(null)
  const [requestingMicrophone, setRequestingMicrophone] = useState(false)
  const [microphoneStatus, setMicrophoneStatus] = useState('idle')
  const [recordingError, setRecordingError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [xpGrantedThisRun, setXpGrantedThisRun] = useState(false)

  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const discardRecordingRef = useRef(false)
  const recordingsRef = useRef(recordings)
  const mountedRef = useRef(true)
  const submitGuardRef = useRef(false)
  const recordingSecondsRef = useRef(0)
  const recordingStartedAtRef = useRef(0)

  const selectedExam = useMemo(
    () => EXAMS.find((exam) => exam.exam_number === selectedExamNumber) || null,
    [selectedExamNumber],
  )
  const currentPart = PARTS[currentStep]
  const partContent = selectedExam?.[currentPart.key]
  const alreadyCompleted = selectedExam
    ? completedExamIds.includes(`exam-${selectedExam.exam_number}`)
    : false
  const hasPreviousPartRecording = currentStep === 0 || Boolean(recordings[PARTS[currentStep - 1].key])
  const lastUnlockedStep = recordings.part_1
    ? recordings.part_2 ? 2 : 1
    : 0
  const hasAllRecordings = PARTS.every(({ key }) => Boolean(recordings[key]?.url))
  const hasQualifiedRecordings = PARTS.every(({ key }) => Boolean(recordings[key]?.url) && Number(recordings[key]?.durationSeconds) >= MIN_RECORDING_SECONDS)
  const busy = Boolean(recordingPart || requestingMicrophone || preparationRunning)

  useEffect(() => {
    try {
      window.localStorage.setItem(progressStorageKey, JSON.stringify({ completedExamIds }))
    } catch {
      // Keep completion state in memory when browser storage is unavailable.
    }
  }, [completedExamIds, progressStorageKey])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (recorderRef.current?.state === 'recording') {
        recorderRef.current.onstop = null
        recorderRef.current.onerror = null
        recorderRef.current.stop()
      }
      streamRef.current?.getTracks().forEach((track) => track.stop())
      Object.values(recordingsRef.current).forEach((recording) => {
        if (recording?.url) URL.revokeObjectURL(recording.url)
      })
    }
  }, [])

  useEffect(() => {
    if (!preparationRunning) return undefined
    const timer = window.setInterval(() => {
      setPreparationSeconds((remaining) => Math.max(0, remaining - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [preparationRunning])

  useEffect(() => {
    if (preparationRunning && preparationSeconds === 0) {
      setPreparationRunning(false)
      setPreparationReady(true)
    }
  }, [preparationRunning, preparationSeconds])

  useEffect(() => {
    if (!recordingPart) return undefined
    const timer = window.setInterval(() => {
      recordingSecondsRef.current += 1
      setElapsedSeconds(recordingSecondsRef.current)
      if (recordingPart === 'part_2') setSpeechSeconds((remaining) => Math.max(0, remaining - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [recordingPart])

  useEffect(() => {
    if (recordingPart === 'part_2' && speechSeconds === 0) stopRecording()
    // stopRecording is intentionally read from the current recorder ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordingPart, speechSeconds])

  function releaseStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  function replaceRecordings(next) {
    recordingsRef.current = next
    setRecordings(next)
  }

  function clearRecordings() {
    Object.values(recordingsRef.current).forEach((recording) => {
      if (recording?.url) URL.revokeObjectURL(recording.url)
    })
    replaceRecordings({})
  }

  function openExam(examNumber) {
    if (busy) return
    releaseStream()
    setMicrophoneStatus('idle')
    clearRecordings()
    setSelectedExamNumber(examNumber)
    setCurrentStep(0)
    setCheckedKeyPoints([])
    setPreparationSeconds(60)
    setPreparationRunning(false)
    setPreparationReady(false)
    setSpeechSeconds(120)
    setElapsedSeconds(0)
    setRecordingError('')
    setSubmitted(false)
    setXpGrantedThisRun(false)
    recordingSecondsRef.current = 0
    submitGuardRef.current = false
  }

  function returnToExamLibrary() {
    if (busy) return
    releaseStream()
    setMicrophoneStatus('idle')
    clearRecordings()
    setSelectedExamNumber(null)
    setCurrentStep(0)
    setSubmitted(false)
    setRecordingError('')
    submitGuardRef.current = false
  }

  function goToStep(index) {
    if (busy || submitted || index < 0 || index > lastUnlockedStep) return
    releaseStream()
    setMicrophoneStatus('idle')
    setCurrentStep(index)
    setRecordingError('')
  }

  function startPreparationTimer() {
    if (currentStep !== 1 || busy || preparationReady) return
    setRecordingError('')
    setPreparationSeconds(60)
    setPreparationRunning(true)
  }

  async function requestMicrophonePermission() {
    if (!selectedExam || submitted || recordingPart || requestingMicrophone || recordings[currentPart.key]) return
    setRecordingError('')

    if (!window.isSecureContext) {
      setRecordingError('konusma.record.secureContext')
      return
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof window.MediaRecorder === 'undefined') {
      setRecordingError('konusma.record.notSupported')
      return
    }

    setMicrophoneStatus('prompting')
    setRequestingMicrophone(true)
    let pendingStream
    try {
      pendingStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (!mountedRef.current) {
        pendingStream.getTracks().forEach((track) => track.stop())
        return
      }
      releaseStream()
      streamRef.current = pendingStream
      setMicrophoneStatus('ready')
    } catch (error) {
      pendingStream?.getTracks().forEach((track) => track.stop())
      if (streamRef.current === pendingStream) streamRef.current = null
      const errorName = error && typeof error === 'object' ? error.name : ''
      const denied = ['NotAllowedError', 'PermissionDeniedError'].includes(errorName)
      if (mountedRef.current) {
        setMicrophoneStatus(denied ? 'denied' : 'idle')
        setRecordingError(getPermissionErrorKey(error))
      }
    } finally {
      if (mountedRef.current) setRequestingMicrophone(false)
    }
  }

  async function startRecording() {
    if (!selectedExam || submitted || recordingPart || requestingMicrophone || recordings[currentPart.key]) return
    if (currentStep === 1 && !preparationReady) {
      setRecordingError('konusma.prep.required')
      return
    }
    const stream = streamRef.current
    if (!stream) {
      setMicrophoneStatus('idle')
      return
    }
    setRecordingError('')

    try {
      const Recorder = window.MediaRecorder
      const supportedMime = ['audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/mp4']
        .find((mimeType) => typeof Recorder.isTypeSupported === 'function' && Recorder.isTypeSupported(mimeType))
      const recorder = supportedMime
        ? new Recorder(stream, { mimeType: supportedMime })
        : new Recorder(stream)
      chunksRef.current = []
      discardRecordingRef.current = false
      recorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data?.size) chunksRef.current.push(event.data)
      }
      recorder.onerror = () => {
        discardRecordingRef.current = true
        setRecordingError('konusma.record.failed')
        if (recorder.state !== 'inactive') recorder.stop()
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        releaseStream()
        recorderRef.current = null
        setRecordingPart(null)
        setMicrophoneStatus('idle')
        if (discardRecordingRef.current) {
          discardRecordingRef.current = false
          return
        }
        if (!blob.size) {
          setRecordingError('konusma.record.failed')
          return
        }

        const url = URL.createObjectURL(blob)
        const durationSeconds = Math.max(recordingSecondsRef.current, Math.floor((Date.now() - recordingStartedAtRef.current) / 1000))
        const nextRecordings = {
          ...recordingsRef.current,
          [currentPart.key]: { blob, url, mimeType: blob.type, durationSeconds },
        }
        replaceRecordings(nextRecordings)
        setRecordingError(durationSeconds < MIN_RECORDING_SECONDS ? 'konusma.record.minimumDuration' : '')
      }

      recordingSecondsRef.current = 0
      recordingStartedAtRef.current = Date.now()
      setElapsedSeconds(0)
      if (currentStep === 1) setSpeechSeconds(120)
      recorder.start(250)
      setRecordingPart(currentPart.key)
      setMicrophoneStatus('recording')
    } catch {
      stream.getTracks().forEach((track) => track.stop())
      if (streamRef.current === stream) streamRef.current = null
      recorderRef.current = null
      if (mountedRef.current) {
        setMicrophoneStatus('idle')
        setRecordingError('konusma.record.failed')
      }
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }

  function deleteRecording(partKey) {
    if (busy || submitted) return
    const previous = recordingsRef.current[partKey]
    if (previous?.url) URL.revokeObjectURL(previous.url)
    const next = { ...recordingsRef.current }
    delete next[partKey]
    replaceRecordings(next)
    setRecordingError('')
    if (partKey === 'part_2') {
      setPreparationSeconds(60)
      setPreparationRunning(false)
      setPreparationReady(false)
      setSpeechSeconds(120)
    }
    const nextLastUnlockedStep = next.part_1 ? next.part_2 ? 2 : 1 : 0
    if (currentStep > nextLastUnlockedStep) setCurrentStep(nextLastUnlockedStep)
  }

  function toggleKeyPoint(index) {
    setCheckedKeyPoints((current) => current.includes(index)
      ? current.filter((item) => item !== index)
      : [...current, index])
  }

  function submitExam() {
    if (!selectedExam || !hasAllRecordings || !hasQualifiedRecordings || !hasPreviousPartRecording || submitted || submitGuardRef.current) return
    submitGuardRef.current = true
    const completionId = `exam-${selectedExam.exam_number}`
    const knownCompletions = [...new Set([...completedExamIds, ...readCompletedExams(progressStorageKey)])]
    const wasAlreadyCompleted = knownCompletions.includes(completionId)
    setCompletedExamIds(knownCompletions)
    if (!wasAlreadyCompleted) {
      const nextCompletions = [...knownCompletions, completionId]
      setCompletedExamIds(nextCompletions)
      try {
        window.localStorage.setItem(progressStorageKey, JSON.stringify({ completedExamIds: nextCompletions }))
      } catch {
        // State still marks this completion for the current session.
      }
      setXpGrantedThisRun(true)
      onComplete?.(COMPLETION_XP, `speaking:exam-${selectedExam.exam_number}`)
    }
    setSubmitted(true)
  }

  if (!selectedExam) {
    return (
      <main className="mx-auto w-full max-w-7xl space-y-6 px-1 pb-8">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-300"><Mic className="size-4" aria-hidden="true" />{t('nav.speaking')}</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">{t('konusma.library.title')}</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{t('konusma.library.intro')}</p>
          </div>
          <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {completedExamIds.length} / {EXAMS.length} · {t('konusma.exam.completedCount')}
          </span>
        </header>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label={t('konusma.library.title')}>
          {EXAMS.map((exam) => {
            const isCompleted = completedExamIds.includes(`exam-${exam.exam_number}`)
            return (
              <button
                key={exam.exam_number}
                type="button"
                onClick={() => openExam(exam.exam_number)}
                className="group flex min-h-36 flex-col rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-teal-500 hover:bg-teal-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-500 dark:hover:bg-teal-950/30"
              >
                <span className="flex w-full items-center justify-between gap-3">
                  <span className="text-base font-bold text-slate-900 dark:text-white">{t('konusma.exam.number', { number: exam.exam_number })}</span>
                  {isCompleted
                    ? <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" aria-label={t('konusma.exam.completed')} />
                    : <ArrowRight className="size-5 text-teal-700 transition-transform group-hover:translate-x-1 dark:text-teal-300" aria-hidden="true" />}
                </span>
                <span className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">{exam.part_1.topic}</span>
                <span className="mt-auto pt-3 text-xs text-slate-500 dark:text-slate-400">{exam.part_1.level} · {exam.part_1.category}</span>
                {isCompleted && <span className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">{t('konusma.exam.completed')}</span>}
              </button>
            )
          })}
        </section>

        <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          {t('konusma.record.privacy')}
        </p>
      </main>
    )
  }

  const isPartTwo = currentStep === 1
  const currentRecording = recordings[currentPart.key]
  const timerLabel = isPartTwo && !currentRecording ? t('konusma.speech.remaining') : t('konusma.record.elapsed')
  const timerValue = isPartTwo && !currentRecording
    ? speechSeconds
    : recordingPart ? elapsedSeconds : currentRecording?.durationSeconds || 0
  const canStartRecording = !submitted && !currentRecording && !recordingPart && !requestingMicrophone && (!isPartTwo || preparationReady)
  const canRequestMicrophone = !submitted && !currentRecording && !recordingPart && !requestingMicrophone
  const canContinue = Boolean(currentRecording) && Number(currentRecording?.durationSeconds) >= MIN_RECORDING_SECONDS && currentStep < 2 && currentStep < lastUnlockedStep && !busy
  const isExamComplete = submitted

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 px-1 pb-8">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button type="button" onClick={returnToExamLibrary} disabled={busy} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <ArrowLeft className="size-4" aria-hidden="true" />{t('konusma.back')}
          </button>
          <div>
            <p className="text-xs font-semibold text-teal-700 dark:text-teal-300">{t('konusma.exam.number', { number: selectedExam.exam_number })}</p>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('konusma.workspace.title')}</h1>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          {t('konusma.step.progress', { current: currentStep + 1 })}
        </div>
      </header>

      {alreadyCompleted && !submitted && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
          {t('konusma.exam.alreadyRewarded')}
        </p>
      )}

      <nav className="grid grid-cols-3 gap-2" aria-label={t('konusma.step.navigation')}>
        {PARTS.map((part, index) => {
          const isUnlocked = index <= lastUnlockedStep
          const isDone = Boolean(recordings[part.key])
          return (
            <button
              key={part.key}
              type="button"
              onClick={() => goToStep(index)}
              disabled={!isUnlocked || busy || submitted}
              aria-current={currentStep === index ? 'step' : undefined}
              className={cn(
                'flex min-h-12 items-center justify-center gap-2 rounded-lg border px-2 py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed',
                currentStep === index
                  ? 'border-teal-700 bg-teal-700 text-white dark:border-teal-400 dark:bg-teal-400 dark:text-slate-950'
                  : isDone
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200'
                    : isUnlocked
                      ? 'border-slate-200 bg-white text-slate-700 hover:border-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                      : 'border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-600',
              )}
            >
              {isUnlocked ? isDone ? <Check className="size-4" aria-hidden="true" /> : <CircleDot className="size-4" aria-hidden="true" /> : <LockKeyhole className="size-4" aria-hidden="true" />}
              {t(part.labelKey)}
            </button>
          )
        })}
      </nav>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <header className="border-b border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/50 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-teal-100 px-2.5 py-1 text-xs font-bold text-teal-900 dark:bg-teal-950 dark:text-teal-200">{t(currentPart.labelKey)}</span>
            <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">{partContent.level}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{partContent.category}</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t('konusma.topic')}: <span className="font-semibold text-slate-900 dark:text-white">{partContent.topic}</span></p>
        </header>

        <div className="space-y-5 p-5 sm:p-6">
          {currentStep === 0 || currentStep === 2 ? (
            <div>
              <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">{t('konusma.questions')}</h3>
              <ol className="space-y-3">
                {partContent.questions.map((question, index) => (
                  <li key={`${currentPart.key}-question-${index}`} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-teal-800 dark:bg-slate-800 dark:text-teal-200">{index + 1}</span>
                    <p className="pt-0.5 text-sm leading-6 text-slate-800 dark:text-slate-200">{question}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">{t('konusma.questions.recordHint')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border-l-4 border-teal-600 bg-teal-50 p-4 dark:border-teal-400 dark:bg-teal-950/30">
                <h3 className="mb-1 text-sm font-bold text-teal-950 dark:text-teal-100">{t('konusma.prompt')}</h3>
                <p className="whitespace-pre-line text-sm leading-7 text-slate-800 dark:text-slate-200">{partContent.prompt}</p>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">{t('konusma.keyPoints')}</h3>
                <ul className="space-y-2">
                  {partContent.key_points.map((point, index) => {
                    const isChecked = checkedKeyPoints.includes(index)
                    return (
                      <li key={`key-point-${index}`}>
                        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 px-3 py-3 text-sm leading-6 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-950/60">
                          <input type="checkbox" checked={isChecked} onChange={() => toggleKeyPoint(index)} disabled={Boolean(recordingPart || requestingMicrophone || submitted || currentRecording)} className="mt-1 size-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600" />
                          <span className={cn(isChecked && 'text-slate-500 line-through dark:text-slate-500')}>{point}</span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )}

          {isPartTwo && (
            <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/25">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-amber-950 dark:text-amber-100"><Clock3 className="size-4" aria-hidden="true" />{t('konusma.prep.title')}</h3>
                  <p className="mt-1 max-w-xl text-xs leading-5 text-amber-900/80 dark:text-amber-200/80">{t('konusma.prep.description')}</p>
                </div>
                <span className="font-mono text-2xl font-extrabold tabular-nums text-amber-900 dark:text-amber-100">{formatClock(preparationSeconds)}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-amber-200 dark:bg-amber-900/70"><div className="h-full rounded-full bg-amber-600 transition-[width] dark:bg-amber-400" style={{ width: `${preparationRunning || preparationReady ? ((60 - preparationSeconds) / 60) * 100 : 0}%` }} /></div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">{preparationRunning ? t('konusma.prep.running') : preparationReady ? t('konusma.prep.ready') : t('konusma.prep.waiting')}</p>
                <button type="button" onClick={startPreparationTimer} disabled={busy || preparationReady || Boolean(currentRecording)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-amber-700 px-3 py-2 text-sm font-bold text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-400 dark:text-amber-950 dark:hover:bg-amber-300">
                  <Clock3 className="size-4" aria-hidden="true" />{preparationRunning ? t('konusma.prep.runningButton') : preparationReady ? t('konusma.prep.ready') : t('konusma.prep.start')}
                </button>
              </div>
            </section>
          )}

          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><Mic className="size-4 text-teal-700 dark:text-teal-300" aria-hidden="true" />{isPartTwo ? t('konusma.speech.timer') : t('konusma.record.title')}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{recordingPart ? t('konusma.record.recording') : currentRecording ? t('konusma.record.previewReady') : t('konusma.record.instruction')}</p>
              </div>
              <div className="min-w-24 rounded-lg bg-white px-3 py-2 text-center dark:bg-slate-900">
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{timerLabel}</span>
                <span className="font-mono text-2xl font-extrabold tabular-nums text-slate-900 dark:text-white">{formatClock(timerValue)}</span>
              </div>
            </div>
            {isPartTwo && <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-teal-600 transition-[width] dark:bg-teal-400" style={{ width: `${Math.min(100, ((recordingPart === 'part_2' ? 120 - speechSeconds : currentRecording?.durationSeconds || 0) / 120) * 100)}%` }} /></div>}

            {microphoneStatus === 'denied' && recordingError === 'konusma.record.permissionDenied' ? (
              <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200" role="alert">{t('konusma.record.permissionDenied')}</p>
            ) : recordingError ? (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200" role="status">{t(recordingError)}</p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {recordingPart === currentPart.key ? (
                <button type="button" onClick={stopRecording} className="inline-flex min-h-12 min-w-[44px] items-center gap-2 rounded-lg bg-rose-700 px-5 py-3 text-sm font-extrabold text-white transition active:scale-95 active:bg-rose-800 hover:bg-rose-800"><Square className="size-4 fill-current" aria-hidden="true" />{t('konusma.record.stop')}</button>
              ) : requestingMicrophone || microphoneStatus === 'prompting' ? (
                <button type="button" disabled className="inline-flex min-h-12 min-w-[44px] items-center gap-2 rounded-lg bg-slate-400 px-5 py-3 text-sm font-bold text-white"><Mic className="size-4 animate-pulse" aria-hidden="true" />{t('konusma.record.requesting')}</button>
              ) : !currentRecording && microphoneStatus !== 'ready' ? (
                <button type="button" onClick={requestMicrophonePermission} disabled={!canRequestMicrophone} className="inline-flex min-h-12 min-w-[44px] items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-extrabold text-white transition active:scale-95 active:bg-teal-800 hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"><Mic className="size-5" aria-hidden="true" />{t('konusma.record.allow')}</button>
              ) : !currentRecording ? (
                <button type="button" onClick={startRecording} disabled={!canStartRecording} className="inline-flex min-h-12 min-w-[44px] items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-extrabold text-white transition active:scale-95 active:bg-teal-800 hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"><Mic className="size-5" aria-hidden="true" />{t('konusma.record.start')}</button>
              ) : (
                <button type="button" onClick={() => deleteRecording(currentPart.key)} disabled={busy || submitted} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-teal-700 px-4 py-2.5 text-sm font-bold text-teal-800 hover:bg-teal-50 disabled:opacity-50 dark:border-teal-400 dark:text-teal-200 dark:hover:bg-teal-950/40"><RotateCcw className="size-4" aria-hidden="true" />{t('konusma.record.rerecord')}</button>
              )}

              {currentRecording && (
                <button type="button" onClick={() => deleteRecording(currentPart.key)} disabled={busy || submitted} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/30"><Trash2 className="size-4" aria-hidden="true" />{t('konusma.record.delete')}</button>
              )}
            </div>

            {currentRecording && <div className="mt-4 rounded-lg border border-emerald-200 bg-white p-3 dark:border-emerald-900 dark:bg-slate-900"><p className="mb-2 flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300"><Play className="size-3.5" aria-hidden="true" />{t('konusma.record.preview')}</p><audio controls preload="metadata" src={currentRecording.url} className="h-10 w-full" /></div>}
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            <button type="button" onClick={() => goToStep(currentStep - 1)} disabled={currentStep === 0 || busy || submitted} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"><ArrowLeft className="size-4" aria-hidden="true" />{t('konusma.previous')}</button>
            <div className="flex flex-wrap items-center gap-2">
              {currentStep < 2 ? (
                <button type="button" onClick={() => goToStep(currentStep + 1)} disabled={!canContinue} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-400">{t('konusma.next')}<ArrowRight className="size-4" aria-hidden="true" /></button>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  {hasAllRecordings && hasQualifiedRecordings
                    ? <button type="button" onClick={submitExam} disabled={busy || submitted} className="inline-flex min-h-12 min-w-[44px] items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-extrabold text-white transition active:scale-95 active:bg-teal-800 hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"><Send className="size-4" aria-hidden="true" />{submitted ? t('konusma.submit.done') : t('konusma.submit')}</button>
                    : <p className="text-xs text-slate-500 dark:text-slate-400">{hasAllRecordings ? t('konusma.record.minimumDuration') : t('konusma.submit.hint')}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">{t('konusma.record.privacy')}</p>

      {isExamComplete && (
        <section className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30 sm:p-6" aria-live="polite">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-emerald-700 text-white dark:bg-emerald-400 dark:text-slate-950"><Trophy className="size-5" aria-hidden="true" /></span>
            <div className="min-w-0 flex-1"><h2 className="font-bold text-emerald-950 dark:text-emerald-100">{t('konusma.complete.title')}</h2><p className="mt-1 text-sm text-emerald-900 dark:text-emerald-200">{t('konusma.complete.body')}</p></div>
            <span className="rounded-md bg-white px-3 py-2 text-sm font-extrabold text-emerald-800 dark:bg-slate-900 dark:text-emerald-300">{xpGrantedThisRun ? `+${COMPLETION_XP} XP` : t('konusma.complete.noDuplicateXp')}</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {PARTS.map((part) => <div key={part.key} className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-900 dark:border-emerald-900 dark:bg-slate-900 dark:text-emerald-200"><CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />{t(part.labelKey)} · {formatClock(recordings[part.key]?.durationSeconds || 0)}</div>)}
          </div>
          <button type="button" onClick={returnToExamLibrary} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-emerald-700 px-4 py-2 text-sm font-bold text-emerald-900 hover:bg-emerald-100 dark:border-emerald-400 dark:text-emerald-100 dark:hover:bg-emerald-950"><ArrowLeft className="size-4" aria-hidden="true" />{t('konusma.complete.return')}</button>
        </section>
      )}
    </main>
  )
}
