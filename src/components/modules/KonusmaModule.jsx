import { ModelAsset, PanelHeading, SectionBanner } from '../BosforArtwork'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Mic,
  Play,
  RotateCcw,
  Send,
  Square,
} from 'lucide-react'
import bmbaSpeakingExams from '../../data/bmbaSpeakingExams.json'
import { useI18n } from '../../lib/i18n.jsx'
import { saveJSON } from '../../lib/storage.js'
import '../../bosfor-speaking.css'

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

const FINAL_EXAM = {
  exam_number: 'final',
  part_1: {
    level: 'A2–B1',
    category: 'Günlük konuşma',
    topic: 'Yaşadığım Mahalle',
    questions: [
      'Mahallenizde en çok hangi mekânı kullanıyorsunuz? Neden?',
      'Mahallenizde değiştirmek istediğiniz bir şey var mı?',
      'Komşularınızla birlikte hangi etkinliği düzenlemek isterdiniz?',
    ],
  },
  part_2: {
    level: 'B1–B2',
    category: 'Monolog',
    topic: '2035 Yılında Mahallem',
    prompt: 'Belediyenin mahalleleri geliştirmek için bir proje yarışması düzenlediğini düşünün. Mahalleniz için bir proje önerin ve komşularınızı bu projeye destek vermeye ikna edin.',
    key_points: [
      'Bugünkü sorunu veya ihtiyacı anlatın.',
      'Önerdiğiniz çözümü somut bir örnekle açıklayın.',
      'Projeden kimlerin nasıl yararlanacağını belirtin.',
      'İlk adımı ve komşuların katkısını tarif edin.',
    ],
  },
  part_3: {
    level: 'C1',
    category: 'Tartışma',
    topic: 'Geleceğin Şehrini Kim Tasarlamalı?',
    questions: [
      'Bir şehir yenilenirken uzmanların görüşü mü, mahalle sakinlerinin tercihleri mi öncelikli olmalı? Bir örnek üzerinden tartışın.',
      'Çevreye yararlı bir proje bazı mahalle sakinlerini zor durumda bırakırsa nasıl bir uzlaşma önerirsiniz?',
    ],
  },
}

function examId(exam) {
  return 'exam-' + exam.exam_number
}

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

function isQualified(recording) {
  return Boolean(recording?.url && recording.durationSeconds >= MIN_RECORDING_SECONDS)
}

function reviewItems(part) {
  return part?.questions ?? part?.key_points ?? []
}

export default function KonusmaModule({ onComplete, profileId = 'local' }) {
  const { t } = useI18n()
  const progressStorageKey = getProgressStorageKey(profileId)
  const [completedExamIds, setCompletedExamIds] = useState(() => readCompletedExams(progressStorageKey))
  const [selectedExamNumber, setSelectedExamNumber] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [recordings, setRecordings] = useState({})
  const [reviewed, setReviewed] = useState({})
  const [preparationSeconds, setPreparationSeconds] = useState(60)
  const [preparationRunning, setPreparationRunning] = useState(false)
  const [preparationReady, setPreparationReady] = useState(false)
  const [speechSeconds, setSpeechSeconds] = useState(120)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [recordingPart, setRecordingPart] = useState(null)
  const [requestingMicrophone, setRequestingMicrophone] = useState(false)
  const [recordingError, setRecordingError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [xpGrantedThisRun, setXpGrantedThisRun] = useState(false)

  const recorderRef = useRef(null)
  const screenRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const discardRecordingRef = useRef(false)
  const recordingsRef = useRef(recordings)
  const mountedRef = useRef(true)
  const submitGuardRef = useRef(false)
  const preparationDeadlineRef = useRef(0)
  const recordingStartedAtRef = useRef(0)
  const recordingStoppedAtRef = useRef(null)

  const selectedExam = useMemo(
    () => selectedExamNumber === FINAL_EXAM.exam_number
      ? FINAL_EXAM
      : EXAMS.find((exam) => exam.exam_number === selectedExamNumber) || null,
    [selectedExamNumber],
  )
  const nextExam = EXAMS.find((exam) => !completedExamIds.includes(examId(exam)))
  const completedCount = EXAMS.filter((exam) => completedExamIds.includes(examId(exam))).length
  const finalComplete = completedExamIds.includes(examId(FINAL_EXAM))
  const currentPart = PARTS[currentStep]
  const partContent = selectedExam?.[currentPart.key]
  const alreadyCompleted = selectedExam && completedExamIds.includes(examId(selectedExam))
  const isFinalExam = selectedExam === FINAL_EXAM
  const partReady = (key) => isQualified(recordings[key])
    && reviewItems(selectedExam?.[key]).every((_, index) => reviewed[key]?.includes(index))
  const firstIncompletePart = PARTS.findIndex(({ key }) => !partReady(key))
  const lastUnlockedStep = firstIncompletePart === -1 ? PARTS.length - 1 : firstIncompletePart
  const allPartsReady = firstIncompletePart === -1
  const busy = Boolean(recordingPart || requestingMicrophone || preparationRunning)

  useEffect(() => {
    saveJSON(progressStorageKey, { completedExamIds })
  }, [completedExamIds, progressStorageKey])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      const recorder = recorderRef.current
      if (recorder) {
        recorder.onstop = null
        recorder.onerror = null
        recorder.ondataavailable = null
        if (recorder.state !== 'inactive') recorder.stop()
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
      setPreparationSeconds(Math.max(0, Math.ceil((preparationDeadlineRef.current - performance.now()) / 1000)))
    }, 250)
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
      const elapsed = Math.floor((performance.now() - recordingStartedAtRef.current) / 1000)
      setElapsedSeconds(elapsed)
      if (recordingPart === 'part_2') setSpeechSeconds(Math.max(0, 120 - elapsed))
    }, 250)
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
    const target = examNumber === FINAL_EXAM.exam_number
      ? FINAL_EXAM
      : EXAMS.find((exam) => exam.exam_number === examNumber)
    if (busy || !target) return
    if (target === FINAL_EXAM ? nextExam : target !== nextExam && !completedExamIds.includes(examId(target))) return
    releaseStream()
    clearRecordings()
    setSelectedExamNumber(examNumber)
    setCurrentStep(0)
    setReviewed({})
    setPreparationSeconds(60)
    setPreparationRunning(false)
    setPreparationReady(false)
    setSpeechSeconds(120)
    setElapsedSeconds(0)
    setRecordingError('')
    setSubmitted(false)
    setXpGrantedThisRun(false)
    submitGuardRef.current = false
    requestAnimationFrame(() => screenRef.current?.focus())
  }

  function returnToExamLibrary() {
    if (busy) return
    releaseStream()
    clearRecordings()
    setSelectedExamNumber(null)
    setCurrentStep(0)
    setSubmitted(false)
    setRecordingError('')
    submitGuardRef.current = false
    requestAnimationFrame(() => screenRef.current?.focus())
  }

  function goToStep(index) {
    if (busy || submitted || index === currentStep || index < 0 || index > lastUnlockedStep) return
    releaseStream()
    setCurrentStep(index)
    setRecordingError('')
    requestAnimationFrame(() => screenRef.current?.focus())
  }

  function startPreparationTimer() {
    if (currentStep !== 1 || busy || preparationReady) return
    setRecordingError('')
    setPreparationSeconds(60)
    preparationDeadlineRef.current = performance.now() + 60_000
    setPreparationRunning(true)
  }

  function cancelPreparationTimer() {
    setPreparationRunning(false)
    setPreparationSeconds(60)
  }

  async function requestMicrophoneAndRecord() {
    if (!selectedExam || submitted || busy || recordings[currentPart.key]) return
    if (currentStep === 1 && !preparationReady) return
    setRecordingError('')

    if (!window.isSecureContext) {
      setRecordingError('konusma.record.secureContext')
      return
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof window.MediaRecorder === 'undefined') {
      setRecordingError('konusma.record.notSupported')
      return
    }

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
      startRecording(pendingStream)
    } catch (error) {
      pendingStream?.getTracks().forEach((track) => track.stop())
      if (streamRef.current === pendingStream) streamRef.current = null
      if (mountedRef.current) setRecordingError(getPermissionErrorKey(error))
    } finally {
      if (mountedRef.current) setRequestingMicrophone(false)
    }
  }

  function startRecording(stream) {
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
        if (discardRecordingRef.current) {
          discardRecordingRef.current = false
          return
        }
        if (!blob.size) {
          setRecordingError('konusma.record.failed')
          return
        }

        const url = URL.createObjectURL(blob)
        const stoppedAt = recordingStoppedAtRef.current ?? performance.now()
        const durationSeconds = Math.floor((stoppedAt - recordingStartedAtRef.current) / 1000)
        const nextRecordings = {
          ...recordingsRef.current,
          [currentPart.key]: { blob, url, mimeType: blob.type, durationSeconds },
        }
        replaceRecordings(nextRecordings)
        setRecordingError(durationSeconds < MIN_RECORDING_SECONDS ? 'konusma.record.minimumDuration' : '')
      }

      recordingStartedAtRef.current = performance.now()
      recordingStoppedAtRef.current = null
      setElapsedSeconds(0)
      if (currentStep === 1) setSpeechSeconds(120)
      recorder.start(250)
      setRecordingPart(currentPart.key)
    } catch {
      stream.getTracks().forEach((track) => track.stop())
      if (streamRef.current === stream) streamRef.current = null
      recorderRef.current = null
      if (mountedRef.current) {
        setRecordingError('konusma.record.failed')
      }
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === 'recording') {
      recordingStoppedAtRef.current = performance.now()
      recorderRef.current.stop()
    }
  }

  function deleteRecording(partKey) {
    if (busy || submitted) return
    const previous = recordingsRef.current[partKey]
    if (previous?.url) URL.revokeObjectURL(previous.url)
    const next = { ...recordingsRef.current }
    delete next[partKey]
    replaceRecordings(next)
    setReviewed((current) => ({ ...current, [partKey]: [] }))
    setRecordingError('')
    if (partKey === 'part_2') {
      setPreparationSeconds(60)
      setPreparationRunning(false)
      setPreparationReady(false)
      setSpeechSeconds(120)
    }
  }

  function toggleReviewItem(index) {
    if (busy || submitted || !isQualified(recordings[currentPart.key])) return
    setReviewed((current) => {
      const items = current[currentPart.key] || []
      const next = items.includes(index) ? items.filter((item) => item !== index) : [...items, index]
      return { ...current, [currentPart.key]: next }
    })
  }

  function submitExam() {
    if (!selectedExam || !allPartsReady || busy || submitted || submitGuardRef.current) return
    submitGuardRef.current = true
    const completionId = examId(selectedExam)
    const knownCompletions = [...new Set([...completedExamIds, ...readCompletedExams(progressStorageKey)])]
    const wasAlreadyCompleted = knownCompletions.includes(completionId)
    setCompletedExamIds(knownCompletions)
    if (!wasAlreadyCompleted) {
      const nextCompletions = [...knownCompletions, completionId]
      setCompletedExamIds(nextCompletions)
      saveJSON(progressStorageKey, { completedExamIds: nextCompletions })
      setXpGrantedThisRun(true)
      onComplete?.(COMPLETION_XP, 'speaking:' + completionId)
    }
    setSubmitted(true)
    requestAnimationFrame(() => screenRef.current?.focus())
  }

  if (!selectedExam) {
    return (
      <section ref={screenRef} tabIndex={-1} className="bosfor-speaking speaking-focus mx-auto max-w-6xl space-y-4" aria-labelledby="speaking-title">
        <SectionBanner name="konusma" titleId="speaking-title" title={t('nav.speaking')} description={t('konusma.library.intro', { count: EXAMS.length })}>
          <span>{completedCount}/{EXAMS.length} {t('konusma.exam.completedCount')}</span>
        </SectionBanner>

        {nextExam && (
          <section className="bosfor-panel rounded-2xl border p-4 sm:p-6">
            <PanelHeading name="plan" title={t('konusma.library.next', { number: nextExam.exam_number })} description={nextExam.part_1.topic}>
              <button type="button" onClick={() => openExam(nextExam.exam_number)} className="speaking-start bosfor-action speaking-action">{t('konusma.library.start')} <ArrowRight className="size-4" aria-hidden="true" /></button>
            </PanelHeading>
          </section>
        )}

        <section className="bosfor-panel speaking-finale rounded-2xl border p-4 sm:p-6" aria-labelledby="speaking-finale">
          <PanelHeading name={finalComplete ? 'medal' : 'certificate'} titleId="speaking-finale" title={t('konusma.final.title')} description={t(nextExam ? 'konusma.final.locked' : 'konusma.final.description', { count: EXAMS.length })}>
            {nextExam ? (
              <span className="bosfor-badge inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold"><LockKeyhole className="size-4" aria-hidden="true" />{completedCount}/{EXAMS.length}</span>
            ) : (
              <button type="button" onClick={() => openExam(FINAL_EXAM.exam_number)} className="speaking-final-open bosfor-action speaking-action">
                {t(finalComplete ? 'konusma.final.retry' : 'konusma.final.start')}<ArrowRight className="size-4" aria-hidden="true" />
              </button>
            )}
          </PanelHeading>
          {finalComplete && <p className="speaking-muted mt-2 text-sm font-bold">{t('konusma.final.completed')}</p>}
        </section>

        <section className="bosfor-panel rounded-2xl border p-4 sm:p-6" aria-labelledby="speaking-exams">
          <PanelHeading name="exams" titleId="speaking-exams" title={t('konusma.library.title')} />
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            {EXAMS.map((exam) => {
              const completed = completedExamIds.includes(examId(exam))
              const locked = !completed && exam !== nextExam
              return (
                <li key={exam.exam_number} className="min-w-0">
                  <button type="button" disabled={locked} onClick={() => openExam(exam.exam_number)} className="speaking-exam bosfor-inset flex h-full min-h-20 w-full items-center gap-2.5 rounded-xl border p-3 text-start" data-next={exam === nextExam}>
                    <span className="speaking-exam-number" aria-hidden="true">{exam.exam_number}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-extrabold" lang="tr">{exam.part_1.topic}</span>
                      <span className="speaking-muted block text-xs">{t('konusma.exam.number', { number: exam.exam_number })}{(completed || locked) && ' · ' + t(completed ? 'konusma.exam.completed' : 'konusma.exam.locked')}</span>
                    </span>
                    {completed ? <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" /> : locked ? <LockKeyhole className="size-4 shrink-0" aria-hidden="true" /> : <ArrowRight className="size-4 shrink-0" aria-hidden="true" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      </section>
    )
  }

  if (submitted) {
    return (
      <section ref={screenRef} tabIndex={-1} className="bosfor-speaking speaking-focus mx-auto max-w-5xl space-y-4" aria-labelledby="speaking-result">
        <SectionBanner name="medal" titleId="speaking-result" title={t(isFinalExam ? 'konusma.final.completed' : 'konusma.complete.title')} description={t('konusma.complete.body')}>
          <span><ModelAsset name="xp" className="size-5" />{xpGrantedThisRun ? '+' + COMPLETION_XP + ' XP' : t('konusma.complete.noDuplicateXp')}</span>
        </SectionBanner>
        <section className="bosfor-panel rounded-2xl border p-4 sm:p-6" aria-labelledby="speaking-review">
          <PanelHeading name="konusma" titleId="speaking-review" title={t('konusma.record.preview')} />
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {PARTS.map((part) => (
              <div key={part.key} className="bosfor-inset min-w-0 rounded-xl border p-3">
                <p className="flex flex-wrap justify-between gap-1 text-sm font-bold"><span>{t(part.labelKey)}</span><span className="speaking-muted tabular-nums">{formatClock(recordings[part.key].durationSeconds)}</span></p>
                <audio controls preload="metadata" src={recordings[part.key].url} aria-label={t(part.labelKey)} className="speaking-audio mt-2 h-10 w-full" />
              </div>
            ))}
          </div>
          <p className="speaking-muted mt-4 text-xs leading-5">{t('konusma.record.privacy')}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {!isFinalExam && nextExam && <button type="button" onClick={() => openExam(nextExam.exam_number)} className="speaking-next-exam bosfor-action speaking-action">{t('konusma.complete.next', { number: nextExam.exam_number })}<ArrowRight className="size-4" aria-hidden="true" /></button>}
            {!isFinalExam && !nextExam && !finalComplete && <button type="button" onClick={() => openExam(FINAL_EXAM.exam_number)} className="speaking-final-open bosfor-action speaking-action">{t('konusma.final.start')}<ArrowRight className="size-4" aria-hidden="true" /></button>}
            <button type="button" onClick={returnToExamLibrary} className="bosfor-control speaking-action"><ArrowLeft className="size-4" aria-hidden="true" />{t('konusma.complete.return')}</button>
          </div>
        </section>
      </section>
    )
  }

  const isPartTwo = currentStep === 1
  const currentRecording = recordings[currentPart.key]
  const isRecording = recordingPart === currentPart.key
  const timerLabel = isPartTwo && !currentRecording ? t('konusma.speech.remaining') : t('konusma.record.elapsed')
  const timerValue = isPartTwo && !currentRecording ? speechSeconds : isRecording ? elapsedSeconds : currentRecording?.durationSeconds || 0
  const readyToRecord = !busy && (!isPartTwo || preparationReady)
  const completedParts = PARTS.filter(({ key }) => partReady(key)).length
  const currentItems = reviewItems(partContent)
  const checkedItems = reviewed[currentPart.key] || []

  return (
    <section ref={screenRef} tabIndex={-1} className="bosfor-speaking speaking-focus mx-auto max-w-6xl space-y-4" aria-labelledby="speaking-workspace">
      <header className="bosfor-panel rounded-2xl border p-4 sm:p-5">
        <PanelHeading name="konusma" titleId="speaking-workspace" title={t('konusma.workspace.title')} description={isFinalExam ? t('konusma.final.title') : t('konusma.exam.number', { number: selectedExam.exam_number })}>
          <button type="button" onClick={returnToExamLibrary} disabled={busy} className="bosfor-control speaking-action"><ArrowLeft className="size-4" aria-hidden="true" />{t('konusma.back')}</button>
        </PanelHeading>
        <div className="bosfor-track mt-4 h-2 overflow-hidden rounded-full" role="progressbar" aria-label={t('konusma.step.navigation')} aria-valuemin={0} aria-valuemax={PARTS.length} aria-valuenow={completedParts}>
          <div className="bosfor-progress-fill h-full rounded-full" style={{ width: (completedParts / PARTS.length) * 100 + '%' }} />
        </div>
        <nav className="mt-3 grid gap-2 sm:grid-cols-3" aria-label={t('konusma.step.navigation')}>
          {PARTS.map((part, index) => (
            <button key={part.key} type="button" onClick={() => goToStep(index)} aria-current={index === currentStep ? 'step' : undefined} disabled={index > lastUnlockedStep || busy} className="speaking-tab bosfor-control speaking-action justify-start">
              {index > lastUnlockedStep ? <LockKeyhole className="size-4" aria-hidden="true" /> : partReady(part.key) ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <Mic className="size-4" aria-hidden="true" />}
              {t(part.labelKey)}
            </button>
          ))}
        </nav>
      </header>

      {alreadyCompleted && <p className="bosfor-reward-badge rounded-xl border p-3 text-sm font-semibold">{t('konusma.exam.alreadyRewarded')}</p>}

      <div className="speaking-layout grid items-start gap-4">
        <article className="bosfor-panel min-w-0 rounded-2xl border p-4 sm:p-6" aria-labelledby="speaking-prompt">
          <div className="flex flex-wrap gap-2">
            <span className="bosfor-badge px-2.5 py-1.5 text-xs font-bold">{partContent.level}</span>
            <span className="bosfor-badge px-2.5 py-1.5 text-xs font-bold" lang="tr">{partContent.category}</span>
          </div>
          <h3 id="speaking-prompt" className="mt-3 text-xl font-extrabold" lang="tr">{partContent.topic}</h3>
          {isPartTwo && <p className="speaking-prompt mt-3 whitespace-pre-line border-s-2 ps-3 text-sm leading-7" lang="tr">{partContent.prompt}</p>}
          <h4 className="mt-4 text-sm font-extrabold">{t(isPartTwo ? 'konusma.keyPoints' : 'konusma.questions')}</h4>
          <p className="speaking-muted mt-1 text-xs leading-5">{t('konusma.review.hint')}</p>
          <ol className="mt-2 space-y-2" lang="tr">
            {currentItems.map((item, index) => (
              <li key={index}>
                <label className="speaking-point bosfor-inset flex items-start gap-2 rounded-xl border p-3 text-sm leading-6">
                  <input type="checkbox" checked={checkedItems.includes(index)} onChange={() => toggleReviewItem(index)} disabled={busy || !isQualified(currentRecording)} className="mt-1 size-4 shrink-0" />
                  <span>{item}</span>
                </label>
              </li>
            ))}
          </ol>
        </article>

        <section className="bosfor-panel min-w-0 rounded-2xl border p-4 sm:p-6" aria-labelledby="speaking-recorder">
          <PanelHeading name="konusma" titleId="speaking-recorder" title={isPartTwo ? t('konusma.speech.timer') : t('konusma.record.title')} />
          {isPartTwo && !preparationReady && (
            <div className="bosfor-inset speaking-prep mt-4 rounded-xl border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="flex items-center gap-1.5 text-sm font-extrabold"><Clock3 className="size-4 shrink-0" aria-hidden="true" />{t('konusma.prep.title')}</h3>
                <time className="text-xl font-extrabold tabular-nums">{formatClock(preparationSeconds)}</time>
              </div>
              <p className="speaking-muted mt-1 text-xs leading-5">{preparationRunning ? t('konusma.prep.running') : t('konusma.prep.description')}</p>
              <div className="bosfor-track mt-2 h-2 overflow-hidden rounded-full">
                <div className="bosfor-progress-fill h-full rounded-full" style={{ width: ((60 - preparationSeconds) / 60) * 100 + '%' }} />
              </div>
              <button type="button" onClick={preparationRunning ? cancelPreparationTimer : startPreparationTimer} className={(preparationRunning ? 'bosfor-control' : 'bosfor-action') + ' speaking-action mt-3'}>{t(preparationRunning ? 'konusma.prep.cancel' : 'konusma.prep.start')}</button>
            </div>
          )}

          <div className="speaking-meter bosfor-inset mt-4 rounded-xl border p-3" data-recording={isRecording}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="speaking-muted text-xs font-semibold">{timerLabel}</p>
                <time className="text-3xl font-extrabold tabular-nums">{formatClock(timerValue)}</time>
              </div>
              {isRecording && <span role="status" className="speaking-live text-xs font-bold">{t('konusma.record.recording')}</span>}
            </div>
            {isPartTwo && (
              <div className="bosfor-track mt-2 h-2 overflow-hidden rounded-full">
                <div className="bosfor-progress-fill h-full rounded-full" style={{ width: Math.min(100, ((currentRecording?.durationSeconds || (120 - speechSeconds)) / 120) * 100) + '%' }} />
              </div>
            )}
            {!currentRecording && <p className="speaking-muted mt-2 text-xs leading-5">{t('konusma.record.minimumDuration')}</p>}
          </div>

          {recordingError && <p className="speaking-error mt-3 rounded-xl border p-3 text-sm font-semibold" role="alert">{t(recordingError)}</p>}
          {currentRecording ? (
            <div className="bosfor-inset mt-3 rounded-xl border p-3">
              <p className="flex items-center gap-2 text-sm font-bold"><Play className="size-4" aria-hidden="true" />{t('konusma.record.preview')}</p>
              <audio controls preload="metadata" src={currentRecording.url} aria-label={t('konusma.record.preview')} className="speaking-audio mt-2 h-10 w-full" />
              <p className="speaking-muted mt-2 text-xs font-bold" aria-live="polite">{t('konusma.review.count', { done: checkedItems.length, total: currentItems.length })}</p>
              <button type="button" onClick={() => deleteRecording(currentPart.key)} disabled={busy} className="bosfor-control speaking-action mt-3"><RotateCcw className="size-4" aria-hidden="true" />{t('konusma.record.rerecord')}</button>
            </div>
          ) : (
            <div className="mt-3">
              {isRecording ? (
                <button type="button" onClick={stopRecording} className="speaking-stop speaking-action"><Square className="size-4 fill-current" aria-hidden="true" />{t('konusma.record.stop')}</button>
              ) : (
                <button type="button" onClick={requestMicrophoneAndRecord} disabled={!readyToRecord} className="bosfor-action speaking-action speaking-record"><Mic className="size-4" aria-hidden="true" />{t(requestingMicrophone ? 'konusma.record.requesting' : 'konusma.record.start')}</button>
              )}
            </div>
          )}

          <div className="speaking-footer mt-4 flex flex-wrap justify-between gap-2 border-t pt-4">
            <button type="button" onClick={() => goToStep(currentStep - 1)} disabled={currentStep === 0 || busy} className="bosfor-control speaking-action"><ArrowLeft className="size-4" aria-hidden="true" />{t('konusma.previous')}</button>
            {currentStep < PARTS.length - 1 ? (
              <button type="button" onClick={() => goToStep(currentStep + 1)} disabled={currentStep >= lastUnlockedStep || busy} className="bosfor-action speaking-action">{t('konusma.next')} <ArrowRight className="size-4" aria-hidden="true" /></button>
            ) : (
              <button type="button" onClick={submitExam} disabled={!allPartsReady || busy} className="bosfor-action speaking-action"><Send className="size-4" aria-hidden="true" />{t('konusma.submit')}</button>
            )}
          </div>
          <p className="speaking-muted mt-3 text-xs leading-5">{t('konusma.record.privacy')}</p>
        </section>
      </div>
    </section>
  )
}

