import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, CheckCircle2, ChevronRight, FastForward, Headphones, LockKeyhole, Pause, Play, RotateCcw, Rewind, Volume2 } from 'lucide-react'
import { completeListeningLesson, loadListeningProgress } from '../../lib/listeningProgress'
import { loadJSON, saveJSON } from '../../lib/storage'
import { cn } from '../../lib/utils'
import { useI18n } from '../../lib/i18n.jsx'

const STAGE_COUNT = 20
const AUDIOS_PER_STAGE = 5
const QUESTIONS_PER_AUDIO = 6
const STAGE_MAX_XP = 100
const examDataModules = import.meta.glob('../../data/dinlemaExamSection.json', { eager: true, import: 'default' })
const bundledExamData = Object.values(examDataModules)[0] ?? null

function unwrapExamData(source) {
  if (Array.isArray(source)) return source
  if (!source || typeof source !== 'object') return []
  for (const key of ['tests', 'questions', 'items', 'data', 'exam', 'sections']) {
    if (Array.isArray(source[key])) return source[key]
  }
  return []
}

function asText(value) {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (!value || typeof value !== 'object') return ''
  return String(value.tr ?? value.uz ?? value.en ?? value.text ?? value.title ?? '')
}

function answerIndex(question, options) {
  const raw = question.correctIndex ?? question.correct_index ?? question.correctAnswerIndex
    ?? question.correct_answer_index ?? question.answerIndex ?? question.answer_index
    ?? question.correctOptionIndex ?? question.correct_option_index ?? question.correct_option
    ?? question.correct ?? question.answer ?? question.correctAnswer ?? question.correct_answer
  if (Number.isInteger(raw) && raw >= 0 && raw < options.length) return raw
  if (typeof raw !== 'string') return -1
  const normalized = raw.trim()
  const letterMatch = normalized.match(/^([A-D])(?:[.)\s:]|$)/i)
  if (letterMatch) return letterMatch[1].toUpperCase().charCodeAt(0) - 65
  if (/^\d+$/.test(normalized)) {
    const numericIndex = Number(normalized)
    if (numericIndex >= 0 && numericIndex < options.length) return numericIndex
  }
  return options.findIndex((option) => asText(option).trim().toLocaleLowerCase() === normalized.toLocaleLowerCase())
}

function normalizeQuestion(question, testId, index) {
  if (!question || typeof question !== 'object') return null
  const rawOptions = question.options ?? question.choices ?? question.answers
  const options = Array.isArray(rawOptions)
    ? rawOptions
    : rawOptions && typeof rawOptions === 'object'
      ? Object.entries(rawOptions).sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true })).map(([, option]) => option)
      : []
  if (options.length < 2) return null
  const cleanOptions = options.map((option) => typeof option === 'object' && option !== null ? option : { tr: String(option) })
  const prompt = question.prompt ?? question.question ?? question.question_text ?? question.text ?? question.title ?? ''
  const correctIndex = answerIndex(question, cleanOptions)
  if (!prompt || correctIndex < 0 || correctIndex >= cleanOptions.length) return null
  return {
    id: String(question.id ?? question.questionId ?? `${testId}-q${index + 1}`),
    prompt: typeof prompt === 'object' ? prompt : { tr: String(prompt) },
    options: cleanOptions,
    correctIndex,
  }
}

function normalizeTests(source) {
  return unwrapExamData(source).map((test, index) => {
    if (!test || typeof test !== 'object' || Array.isArray(test)) return null
    // Keep this stable ID format so local and Supabase progress from the existing
    // Dinleme implementation continues to be recognized.
    const id = String(test.id ?? test.testId ?? test.test_id ?? `dinleme-test-${index + 1}`)
    const rawQuestions = test.quizQuestions ?? test.quiz_questions ?? test.questions ?? test.items ?? test.testQuestions
    const quizQuestions = Array.isArray(rawQuestions)
      ? rawQuestions.map((question, questionIndex) => normalizeQuestion(question, id, questionIndex)).filter(Boolean)
      : [normalizeQuestion(test, id, 0)].filter(Boolean)
    return {
      id,
      index,
      title: asText(test.title ?? test.name ?? test.test_name ?? test.label) || `Dinleme ${index + 1}`,
      level: asText(test.level ?? test.cefr ?? test.difficulty).toUpperCase() || 'A1',
      category: asText(test.category ?? test.type),
      transcript: asText(test.transcript ?? test.audio_script ?? test.audioScript ?? test.audioText ?? test.audio_text ?? ''),
      // Audio paths come only from the explicit data field; never infer a filename.
      audioUrl: asText(test.audio_url).trim() || null,
      quizQuestions,
    }
  }).filter(Boolean)
}

const bundledListeningTests = normalizeTests(bundledExamData)

// Preserve JSON order: five audio tasks form each stage, and CEFR badges are read from each task's `level` field.
function createStages(tests) {
  return Array.from({ length: STAGE_COUNT }, (_, index) => {
    const audioTasks = tests.slice(index * AUDIOS_PER_STAGE, (index + 1) * AUDIOS_PER_STAGE)
    return {
      id: `dinleme-stage-${String(index + 1).padStart(2, '0')}`,
      index,
      number: index + 1,
      audioTasks,
    }
  })
}

function stageTaskKey(stageId, taskId) {
  return `${stageId}:${taskId}`
}

function stageTaskStorageKey(identity) {
  const safeIdentity = String(identity || 'local').trim().toLowerCase()
  return `turkuaz-edu-listening-stage-tasks-v1:${encodeURIComponent(safeIdentity)}`
}

function isTaskCompleted(task, localLessons, moduleScores) {
  const local = localLessons[task.id]
  const cloud = moduleScores?.[task.id]
  return Boolean(local?.completedAt || cloud?.completedAt || Number(cloud?.xpAwarded) > 0)
}

function getCompletedStageIds(stages, identity, moduleScores) {
  const localLessons = loadListeningProgress(identity).lessons
  return new Set(stages.filter((stage) => {
    const localStage = localLessons[stage.id]
    const cloudStage = moduleScores?.[stage.id]
    const stageRecordComplete = Boolean(localStage?.completedAt || cloudStage?.completedAt || Number(cloudStage?.xpAwarded) > 0)
    const migratedTaskRecordsComplete = stage.audioTasks.length === AUDIOS_PER_STAGE
      && stage.audioTasks.every((task) => isTaskCompleted(task, localLessons, moduleScores))
    return stageRecordComplete || migratedTaskRecordsComplete
  }).map((stage) => stage.id))
}

function taskScoreFromLegacyRecord(task, identity, moduleScores) {
  const local = loadListeningProgress(identity).lessons[task.id]
  const cloud = moduleScores?.[task.id]
  const bestScore = Math.max(Number(local?.bestScore) || 0, Number(cloud?.best) || 0, Number(cloud?.bestScore) || 0)
  return Math.round(task.quizQuestions.length * Math.min(100, bestScore) / 100)
}

function localized(value, language) {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return value?.[language] || value?.uz || value?.tr || value?.en || value?.text || value?.label || value?.title || ''
}

function formatTime(value) {
  const seconds = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

const COPY = {
  uz: {
    eyebrow: 'TINGLAB TUSHUNISH', title: 'Dinleme', subtitle: '20 bosqich · har birida 5 audio va 30 savol.', completed: 'bosqich yakunlandi',
    play: 'Tinglash', pause: 'Pauza', resume: 'Davom ettirish', loading: 'Audio yuklanmoqda…', done: 'Audio tugadi',
    fallback: 'Brauzer ovozi ishlatilmoqda', audioError: 'Audio ishga tushmadi. Qayta urinib ko‘ring.', speed: 'Tezlik',
    playerProgress: 'Audio ijrosi', rewind: '5 soniya orqaga qaytarish', forward: '5 soniya oldinga o‘tkazish',
    transcriptShow: 'Matnni ko‘rsatish', transcriptHide: 'Matnni yashirish', transcript: 'Matn', quiz: 'Savollar',
    question: 'Savol', submit: 'Javoblarni tekshirish', choose: 'Har bir savolga javob tanlang.', retry: 'Qayta urinish',
    perfect: 'Ajoyib! Barcha javoblar to‘g‘ri.', passed: 'Audio test yakunlandi', already: 'Bosqich avval yakunlangan — XP qayta berilmaydi.',
    incorrect: 'Javoblaringiz saqlandi. Keyingi audio testga o‘tishingiz mumkin.', earned: 'XP', stage: 'BOSQICH', locked: 'Qulflangan',
    stageDone: 'YAKUNLANDI', progress: 'audio yakunlandi', audio: 'audio', stageReady: 'OCHIQ',
    stageSubtitle: 'Bosqichni yakunlash uchun 5 audio testdagi barcha 30 savolga javob bering.',
    questionsTotal: 'savol', score: 'To‘g‘ri javob', stageScore: 'Bosqich natijasi',
    noQuestions: 'Audio testda 6 ta yaroqli savol bo‘lishi kerak.', listenFirst: 'Javob berishdan oldin audioni oxirigacha tinglang.',
    dataMissing: 'dinlemaExamSection.json topilmadi yoki testlar mavjud emas.', invalidStage: 'Bu bosqichda 5 ta audio test va jami 30 ta savol bo‘lishi kerak.',
  },
  en: {
    eyebrow: 'LISTENING COMPREHENSION', title: 'Listening', subtitle: '20 stages · 5 audio tasks and 30 questions each.', completed: 'stages completed',
    play: 'Play', pause: 'Pause', resume: 'Resume', loading: 'Loading audio…', done: 'Audio finished',
    fallback: 'Browser speech fallback', audioError: 'Audio could not be played. Try again.', speed: 'Speed',
    playerProgress: 'Audio progress', rewind: 'Rewind 5 seconds', forward: 'Forward 5 seconds',
    transcriptShow: 'Show transcript', transcriptHide: 'Hide transcript', transcript: 'Transcript', quiz: 'Questions',
    question: 'Question', submit: 'Submit answers', choose: 'Choose an answer for every question.', retry: 'Try again',
    perfect: 'Great! Every answer is correct.', passed: 'Audio task submitted', already: 'This stage was already completed — XP is not awarded again.',
    incorrect: 'Your answers are recorded. You can continue to the next audio task.', earned: 'XP', stage: 'STAGE', locked: 'Locked',
    stageDone: 'COMPLETED', progress: 'audios completed', audio: 'audio', stageReady: 'UNLOCKED',
    stageSubtitle: 'Answer all 30 questions across the five audio tasks to complete this stage.',
    questionsTotal: 'questions', score: 'Correct answers', stageScore: 'Stage score',
    noQuestions: 'Each audio task must contain six valid questions.', listenFirst: 'Listen to the full audio before answering.',
    dataMissing: 'dinlemaExamSection.json was not found or contains no tests.', invalidStage: 'This stage must have five audio tasks and 30 questions total.',
  },
  tr: {
    eyebrow: 'DİNLEME', title: 'Dinleme', subtitle: '20 aşama · her birinde 5 ses ve 30 soru.', completed: 'aşama tamamlandı',
    play: 'Dinle', pause: 'Duraklat', resume: 'Devam et', loading: 'Ses yükleniyor…', done: 'Ses tamamlandı',
    fallback: 'Tarayıcı sesi kullanılıyor', audioError: 'Ses oynatılamadı. Yeniden deneyin.', speed: 'Hız',
    playerProgress: 'Ses ilerlemesi', rewind: '5 saniye geri sar', forward: '5 saniye ileri sar',
    transcriptShow: 'Metni göster', transcriptHide: 'Metni gizle', transcript: 'Metin', quiz: 'Sorular',
    question: 'Soru', submit: 'Cevapları gönder', choose: 'Her soru için bir cevap seçin.', retry: 'Tekrar dene',
    perfect: 'Harika! Tüm cevaplar doğru.', passed: 'Ses testi tamamlandı', already: 'Bu aşama tamamlandı — XP tekrar verilmez.',
    incorrect: 'Cevaplarınız kaydedildi. Sonraki ses testine geçebilirsiniz.', earned: 'XP', stage: 'AŞAMA', locked: 'Kilitli',
    stageDone: 'TAMAMLANDI', progress: 'ses tamamlandı', audio: 'ses', stageReady: 'AÇIK',
    stageSubtitle: 'Aşamayı tamamlamak için beş ses testindeki 30 sorunun tümünü cevaplayın.',
    questionsTotal: 'soru', score: 'Doğru cevap', stageScore: 'Aşama sonucu',
    noQuestions: 'Her ses testinde altı geçerli soru bulunmalıdır.', listenFirst: 'Cevaplamadan önce sesin tamamını dinleyin.',
    dataMissing: 'dinlemaExamSection.json bulunamadı veya test içermiyor.', invalidStage: 'Bu aşamada toplam beş ses testi ve 30 soru olmalıdır.',
  },
}

function getCopy(language) {
  const localized = COPY[language] || COPY.uz
  return {
    ...localized,
    loading: COPY.uz.loading,
    audioError: COPY.uz.audioError,
    choose: COPY.uz.choose,
    noQuestions: COPY.uz.noQuestions,
    listenFirst: COPY.uz.listenFirst,
    dataMissing: COPY.uz.dataMissing,
    invalidStage: COPY.uz.invalidStage,
  }
}

const API_KEY = typeof import.meta.env?.VITE_ELEVENLABS_API_KEY === 'string'
  ? import.meta.env.VITE_ELEVENLABS_API_KEY.trim()
  : ''
const VOICE_ID = typeof import.meta.env?.VITE_ELEVENLABS_VOICE_ID === 'string'
  ? import.meta.env.VITE_ELEVENLABS_VOICE_ID.trim() || '21m00Tcm4TlvDq8ikWAM'
  : '21m00Tcm4TlvDq8ikWAM'

function AudioPlayer({ lesson, language, dark, isPremium, onAudioFinished }) {
  const copy = getCopy(language)
  const [status, setStatus] = useState('ready')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [transcriptVisible, setTranscriptVisible] = useState(false)
  const audioRef = useRef(null)
  const sourceRef = useRef('')
  const objectUrlRef = useRef(null)
  const utteranceRef = useRef(null)
  const controllerRef = useRef(null)
  const playbackIdRef = useRef(0)
  const fallbackStartedRef = useRef(0)
  const pendingSeekRef = useRef(0)
  const speedRef = useRef(1)
  const finishedCallbackRef = useRef(onAudioFinished)
  const heardSecondsRef = useRef(0)
  const lastPositionRef = useRef(null)
  const lastProgressAtRef = useRef(0)
  const speechAvailable = typeof window !== 'undefined' && Boolean(window.speechSynthesis) && typeof window.SpeechSynthesisUtterance === 'function'

  useEffect(() => { finishedCallbackRef.current = onAudioFinished }, [onAudioFinished])

  const releaseCurrentPlayback = () => {
    controllerRef.current?.abort()
    controllerRef.current = null
    if (audioRef.current) {
      audioRef.current.onloadedmetadata = null
      audioRef.current.ontimeupdate = null
      audioRef.current.onended = null
      audioRef.current.onerror = null
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
    utteranceRef.current = null
    sourceRef.current = ''
    heardSecondsRef.current = 0
    lastPositionRef.current = null
    lastProgressAtRef.current = 0
  }

  const recordAudioProgress = (audio, playbackId) => {
    if (playbackId !== playbackIdRef.current) return
    const now = Date.now()
    const position = Number(audio.currentTime) || 0
    const previousPosition = lastPositionRef.current
    const previousAt = lastProgressAtRef.current
    if (!audio.paused && previousPosition !== null && previousAt > 0 && now > previousAt) {
      const positionDelta = position - previousPosition
      const elapsed = ((now - previousAt) / 1000) * (Number(audio.playbackRate) || 1)
      // Do not count time jumps from the seek controls as listened audio.
      if (positionDelta >= 0 && positionDelta <= elapsed + 0.75) {
        heardSecondsRef.current += Math.min(positionDelta, elapsed + 0.15)
      }
    }
    lastPositionRef.current = position
    lastProgressAtRef.current = now
    setCurrentTime(position)
  }

  const finishAudioPlayback = (audio, playbackId) => {
    if (playbackId !== playbackIdRef.current) return
    const audioDuration = Number(audio.duration)
    if (!Number.isFinite(audioDuration) || audioDuration <= 0 || heardSecondsRef.current >= audioDuration - 1.25) {
      setStatus('done')
      finishedCallbackRef.current?.(lesson.id)
      return
    }
    // A seek-to-end is not considered a full listen; restart so the learner
    // can actually hear the skipped portion before answering.
    audio.currentTime = 0
    heardSecondsRef.current = 0
    lastPositionRef.current = 0
    lastProgressAtRef.current = Date.now()
    setCurrentTime(0)
    setStatus('ready')
  }

  const finishPlayback = (playbackId) => {
    if (playbackId !== playbackIdRef.current) return
    setStatus('done')
    finishedCallbackRef.current?.(lesson.id)
  }

  const startBrowserSpeech = (playbackId) => {
    if (playbackId !== playbackIdRef.current) return
    if (!speechAvailable || !lesson.transcript) {
      setStatus('error')
      return
    }
    try {
      window.speechSynthesis.cancel()
      const utterance = new window.SpeechSynthesisUtterance(lesson.transcript)
      utterance.lang = 'tr-TR'
      utterance.rate = speedRef.current
      const voices = window.speechSynthesis.getVoices?.() || []
      utterance.voice = voices.find((voice) => voice.lang?.toLowerCase().startsWith('tr-tr'))
        || voices.find((voice) => voice.lang?.toLowerCase().startsWith('tr')) || null
      utterance.onend = () => finishPlayback(playbackId)
      utterance.onerror = (event) => {
        if (playbackId === playbackIdRef.current && !['canceled', 'interrupted'].includes(event.error)) setStatus('error')
      }
      utteranceRef.current = utterance
      sourceRef.current = 'speech'
      setStatus('fallback')
      window.speechSynthesis.speak(utterance)
    } catch {
      setStatus('error')
    }
  }

  const playBlobAudio = async (blob, playbackId) => {
    if (playbackId !== playbackIdRef.current || !blob?.size) return
    const url = URL.createObjectURL(blob)
    objectUrlRef.current = url
    const audio = new Audio(url)
    audio.preload = 'metadata'
    audio.playbackRate = speedRef.current
    audio.onloadedmetadata = () => {
      if (playbackId !== playbackIdRef.current) return
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    }
    audio.ontimeupdate = () => recordAudioProgress(audio, playbackId)
    audio.onended = () => finishAudioPlayback(audio, playbackId)
    audio.onerror = () => startBrowserSpeech(playbackId)
    audioRef.current = audio
    sourceRef.current = 'elevenlabs'
    lastPositionRef.current = audio.currentTime || 0
    lastProgressAtRef.current = Date.now()
    await audio.play()
    if (playbackId === playbackIdRef.current) setStatus('playing')
  }

  const startFallback = async (playbackId) => {
    if (playbackId !== playbackIdRef.current || fallbackStartedRef.current === playbackId) return
    fallbackStartedRef.current = playbackId
    if (API_KEY && typeof Audio !== 'undefined' && lesson.transcript) {
      const controller = new AbortController()
      controllerRef.current = controller
      setStatus('loading')
      try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(VOICE_ID)}`, {
          method: 'POST',
          signal: controller.signal,
          headers: { Accept: 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': API_KEY },
          body: JSON.stringify({
            text: lesson.transcript,
            model_id: 'eleven_multilingual_v2',
            voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true },
          }),
        })
        if (!response.ok) throw new Error('TTS request failed')
        const blob = await response.blob()
        if (playbackId !== playbackIdRef.current) return
        await playBlobAudio(blob, playbackId)
        return
      } catch {
        if (playbackId !== playbackIdRef.current) return
      } finally {
        if (controllerRef.current === controller) controllerRef.current = null
      }
    }
    startBrowserSpeech(playbackId)
  }

  const startAudio = async () => {
    const playbackId = playbackIdRef.current + 1
    playbackIdRef.current = playbackId
    fallbackStartedRef.current = 0
    pendingSeekRef.current = 0
    releaseCurrentPlayback()
    setCurrentTime(0)
    setDuration(0)

    if (lesson.audioUrl && typeof Audio !== 'undefined') {
      setStatus('loading')
      try {
        const audio = new Audio(lesson.audioUrl)
        audio.preload = 'metadata'
        audio.playbackRate = speedRef.current
        audio.onloadedmetadata = () => {
          if (playbackId !== playbackIdRef.current) return
          setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
          if (pendingSeekRef.current > 0 && Number.isFinite(audio.duration)) {
            audio.currentTime = Math.min(pendingSeekRef.current, audio.duration)
            pendingSeekRef.current = 0
          }
        }
        audio.ontimeupdate = () => recordAudioProgress(audio, playbackId)
        audio.onended = () => finishAudioPlayback(audio, playbackId)
        audio.onerror = () => { void startFallback(playbackId) }
        audioRef.current = audio
        sourceRef.current = 'file'
        lastPositionRef.current = audio.currentTime || 0
        lastProgressAtRef.current = Date.now()
        await audio.play()
        if (playbackId === playbackIdRef.current) setStatus('playing')
        return
      } catch {
        if (playbackId === playbackIdRef.current) await startFallback(playbackId)
        return
      }
    }
    await startFallback(playbackId)
  }

  const togglePlayback = async () => {
    if (status === 'loading') return
    if (status === 'playing' || status === 'fallback') {
      if (sourceRef.current === 'file' || sourceRef.current === 'elevenlabs') audioRef.current?.pause()
      else if (sourceRef.current === 'speech') window.speechSynthesis.pause()
      setStatus('paused')
      return
    }
    if (status === 'paused') {
      if ((sourceRef.current === 'file' || sourceRef.current === 'elevenlabs') && audioRef.current) {
        try {
          lastPositionRef.current = audioRef.current.currentTime || 0
          lastProgressAtRef.current = Date.now()
          await audioRef.current.play()
          setStatus('playing')
        } catch { void startAudio() }
      } else if (sourceRef.current === 'speech') {
        window.speechSynthesis.resume()
        setStatus('fallback')
      } else void startAudio()
      return
    }
    void startAudio()
  }

  const seekBy = (delta) => {
    const audio = audioRef.current
    if (audio && (sourceRef.current === 'file' || sourceRef.current === 'elevenlabs')) {
      const limit = Number.isFinite(audio.duration) ? audio.duration : Number.MAX_SAFE_INTEGER
      audio.currentTime = Math.max(0, Math.min(limit, (audio.currentTime || 0) + delta))
      lastPositionRef.current = audio.currentTime
      lastProgressAtRef.current = Date.now()
      setCurrentTime(audio.currentTime)
      return
    }
    if (status === 'ready') pendingSeekRef.current = Math.max(0, pendingSeekRef.current + delta)
  }

  const seekTo = (value) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration) || sourceRef.current === 'speech') return
    audio.currentTime = Math.max(0, Math.min(audio.duration, Number(value) || 0))
    lastPositionRef.current = audio.currentTime
    lastProgressAtRef.current = Date.now()
    setCurrentTime(audio.currentTime)
  }

  const changeSpeed = (value) => {
    speedRef.current = Number(value)
    setSpeed(speedRef.current)
    if (audioRef.current) audioRef.current.playbackRate = speedRef.current
    if (utteranceRef.current) utteranceRef.current.rate = speedRef.current
  }

  useEffect(() => () => {
    playbackIdRef.current += 1
    releaseCurrentPlayback()
  }, [lesson.id])

  const statusText = {
    ready: copy.play,
    loading: copy.loading,
    playing: copy.pause,
    paused: copy.resume,
    fallback: copy.fallback,
    done: copy.done,
    error: copy.audioError,
  }[status]
  const surface = isPremium ? 'border-yellow-500/20 bg-black/35 text-white' : dark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900'
  const progressValue = duration > 0 ? Math.min(currentTime, duration) : 0

  return (
    <section className={cn('min-w-0 rounded-2xl border p-3 sm:p-5', surface)} aria-label={copy.play}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
        <button type="button" onClick={() => { void togglePlayback() }} disabled={status === 'loading'} aria-label={statusText} className="grid size-12 shrink-0 place-items-center rounded-full bg-teal-600 text-white transition hover:bg-teal-700 disabled:opacity-60">
          {status === 'playing' || status === 'fallback' ? <Pause className="size-5 fill-current" aria-hidden="true" /> : <Play className="size-5 fill-current" aria-hidden="true" />}
        </button>
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2 text-sm font-extrabold"><Volume2 className="size-4 shrink-0 text-teal-500" /><span className="truncate">{statusText}</span></div>
          <p className="mt-1 truncate text-xs text-slate-500">{lesson.audioUrl ? `MP3 · ${lesson.audioUrl}` : copy.fallback}</p>
        </div>
        <label className="col-span-2 inline-flex min-h-11 items-center justify-self-end gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold dark:border-slate-700 sm:col-span-1">
          {copy.speed}
          <select value={speed} onChange={(event) => changeSpeed(event.target.value)} aria-label={copy.speed} className="bg-transparent font-extrabold outline-none">
            <option value="0.75">0.75×</option><option value="1">1×</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex min-w-0 items-center gap-2 sm:gap-3">
        <span className="w-10 shrink-0 text-right font-mono text-xs tabular-nums">{formatTime(progressValue)}</span>
        <input type="range" min="0" max={duration || 0} step="0.1" value={Math.min(progressValue, duration || 0)} onChange={(event) => seekTo(event.target.value)} disabled={!duration || sourceRef.current === 'speech'} aria-label={copy.playerProgress} className="h-2 min-w-0 flex-1 cursor-pointer accent-teal-600 disabled:cursor-not-allowed disabled:opacity-50" />
        <span className="w-10 shrink-0 font-mono text-xs tabular-nums">{formatTime(duration)}</span>
      </div>
      <div className="mt-3 flex justify-center gap-2 sm:justify-start">
        <button type="button" onClick={() => seekBy(-5)} aria-label={copy.rewind} className="inline-flex min-h-11 min-w-24 items-center justify-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-extrabold transition hover:border-teal-500 dark:border-slate-700"><Rewind className="size-4" aria-hidden="true" />- 5s</button>
        <button type="button" onClick={() => seekBy(5)} aria-label={copy.forward} className="inline-flex min-h-11 min-w-24 items-center justify-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-extrabold transition hover:border-teal-500 dark:border-slate-700">+ 5s<FastForward className="size-4" aria-hidden="true" /></button>
      </div>
      <button type="button" onClick={() => setTranscriptVisible((visible) => !visible)} aria-expanded={transcriptVisible} className="mt-4 text-sm font-bold text-teal-700 underline decoration-dotted underline-offset-4 dark:text-teal-300">
        {transcriptVisible ? copy.transcriptHide : copy.transcriptShow}
      </button>
      {transcriptVisible && <p className="mt-3 whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-800 dark:bg-slate-800 dark:text-slate-100">{lesson.transcript}</p>}
    </section>
  )
}

export default function Dinleme({ profile, moduleScores = {}, isPremium = false, dark = false, onLessonComplete }) {
  const { language } = useI18n()
  const copy = getCopy(language)
  const identity = profile?.userId || profile?.email || 'local'
  const stagePanelRef = useRef(null)
  const [tests, setTests] = useState(bundledListeningTests)
  const [loadingTests, setLoadingTests] = useState(!bundledListeningTests.length)
  const [dataMissing, setDataMissing] = useState(false)
  const [selectedStageIndex, setSelectedStageIndex] = useState(0)
  const stages = useMemo(() => createStages(tests), [tests])
  const [selectedAudioId, setSelectedAudioId] = useState(stages[0]?.audioTasks[0]?.id || null)
  const [taskProgress, setTaskProgress] = useState(() => loadJSON(stageTaskStorageKey(identity), {}))
  const [listenedAudioIds, setListenedAudioIds] = useState(() => new Set())
  const [stageSummary, setStageSummary] = useState(null)
  const [progressVersion, setProgressVersion] = useState(0)

  const localLessons = loadListeningProgress(identity).lessons
  const completedStageIds = useMemo(
    () => getCompletedStageIds(stages, identity, moduleScores),
    [stages, identity, moduleScores, progressVersion],
  )
  const unlockedStageCount = useMemo(() => {
    let count = 1
    for (let index = 0; index < STAGE_COUNT - 1; index += 1) {
      if (!completedStageIds.has(stages[index]?.id)) break
      count = index + 2
    }
    return Math.min(STAGE_COUNT, count)
  }, [completedStageIds, stages])
  const completedStageCount = completedStageIds.size
  const selectedStage = stages[selectedStageIndex] || stages[0]
  const selectedAudio = selectedStage?.audioTasks.find((audio) => audio.id === selectedAudioId)
    || selectedStage?.audioTasks[0] || null
  const selectedTaskKey = selectedStage && selectedAudio ? stageTaskKey(selectedStage.id, selectedAudio.id) : ''
  const selectedTaskState = selectedTaskKey ? taskProgress[selectedTaskKey] || { answers: {}, result: null, submitted: false } : { answers: {}, result: null, submitted: false }
  const selectedAnswers = selectedTaskState.answers || {}
  const selectedTaskResult = selectedTaskState.result || null
  const stageQuestionCount = selectedStage?.audioTasks.reduce((sum, audio) => sum + audio.quizQuestions.length, 0) || 0
  const stageStructureValid = selectedStage?.audioTasks.length === AUDIOS_PER_STAGE
    && selectedStage.audioTasks.every((audio) => audio.quizQuestions.length === QUESTIONS_PER_AUDIO)
    && stageQuestionCount === AUDIOS_PER_STAGE * QUESTIONS_PER_AUDIO
  const stageIsComplete = Boolean(selectedStage && completedStageIds.has(selectedStage.id))
  const muted = isPremium ? 'text-white/60' : dark ? 'text-slate-400' : 'text-slate-500'
  const pageCard = isPremium ? 'border-yellow-500/20 bg-black/30 text-white' : dark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900'

  useEffect(() => {
    saveJSON(stageTaskStorageKey(identity), taskProgress)
  }, [identity, taskProgress])

  useEffect(() => {
    let alive = true
    if (bundledListeningTests.length) {
      setTests(bundledListeningTests)
      setSelectedStageIndex(0)
      setSelectedAudioId(createStages(bundledListeningTests)[0]?.audioTasks[0]?.id || null)
      setLoadingTests(false)
      return () => { alive = false }
    }
    const loadExam = async () => {
      for (const path of ['/dinlemaExamSection.json', '/src/data/dinlemaExamSection.json']) {
        try {
          const response = await fetch(path, { headers: { Accept: 'application/json' } })
          if (!response.ok) continue
          const parsed = normalizeTests(await response.json())
          if (!parsed.length || !alive) continue
          setTests(parsed)
          setSelectedStageIndex(0)
          setSelectedAudioId(createStages(parsed)[0]?.audioTasks[0]?.id || null)
          setDataMissing(false)
          setLoadingTests(false)
          return
        } catch {
          // Try a public-folder copy if this repository data file was not bundled.
        }
      }
      if (!alive) return
      setTests([])
      setDataMissing(true)
      setLoadingTests(false)
    }
    void loadExam()
    return () => { alive = false }
  }, [identity])

  const taskIsSubmitted = (stage, audio, progress = taskProgress) => {
    const saved = progress[stageTaskKey(stage.id, audio.id)]
    return Boolean(saved?.submitted || isTaskCompleted(audio, localLessons, moduleScores))
  }

  const completedAudioCount = (stage) => stage.audioTasks.filter((audio) => taskIsSubmitted(stage, audio)).length

  const selectStage = (index) => {
    const stage = stages[index]
    if (!stage || index >= unlockedStageCount) return
    setSelectedStageIndex(index)
    const nextAudio = stage.audioTasks.find((audio) => !taskIsSubmitted(stage, audio)) || stage.audioTasks[0]
    setSelectedAudioId(nextAudio?.id || null)
    setStageSummary(null)
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => stagePanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }

  const selectAudio = (audio) => {
    if (!selectedStage?.audioTasks.some((item) => item.id === audio.id)) return
    setSelectedAudioId(audio.id)
  }

  const updateTaskProgress = (key, updater) => {
    setTaskProgress((previous) => {
      const current = previous[key] || { answers: {}, result: null, submitted: false }
      return { ...previous, [key]: updater(current) }
    })
  }

  const markAudioFinished = (audioId) => {
    setListenedAudioIds((previous) => {
      if (previous.has(audioId)) return previous
      const next = new Set(previous)
      next.add(audioId)
      return next
    })
  }

  const submitAudioQuiz = () => {
    if (!selectedStage || !selectedAudio || selectedAudio.quizQuestions.length !== QUESTIONS_PER_AUDIO) return
    if (!listenedAudioIds.has(selectedAudio.id) || Object.keys(selectedAnswers).length !== QUESTIONS_PER_AUDIO) return
    const correctCount = selectedAudio.quizQuestions.reduce((count, question) => count + (selectedAnswers[question.id] === question.correctIndex ? 1 : 0), 0)
    const audioScore = {
      submitted: true,
      answers: { ...selectedAnswers },
      result: { correctCount, questionCount: QUESTIONS_PER_AUDIO, scorePct: Math.round(correctCount / QUESTIONS_PER_AUDIO * 100) },
      updatedAt: new Date().toISOString(),
    }
    const nextTaskProgress = { ...taskProgress, [selectedTaskKey]: audioScore }
    setTaskProgress(nextTaskProgress)

    const allAudioTasksSubmitted = selectedStage.audioTasks.every((audio) => {
      if (audio.id === selectedAudio.id) return true
      return taskIsSubmitted(selectedStage, audio, nextTaskProgress)
    })
    if (!allAudioTasksSubmitted || selectedStage.audioTasks.length !== AUDIOS_PER_STAGE || stageQuestionCount !== AUDIOS_PER_STAGE * QUESTIONS_PER_AUDIO) return

    const totalCorrect = selectedStage.audioTasks.reduce((sum, audio) => {
      if (audio.id === selectedAudio.id) return sum + correctCount
      const savedResult = nextTaskProgress[stageTaskKey(selectedStage.id, audio.id)]
      if (savedResult?.submitted && savedResult.result) return sum + Math.max(0, Math.min(audio.quizQuestions.length, Number(savedResult.result.correctCount) || 0))
      if (isTaskCompleted(audio, localLessons, moduleScores)) return sum + taskScoreFromLegacyRecord(audio, identity, moduleScores)
      return sum
    }, 0)
    const totalQuestions = AUDIOS_PER_STAGE * QUESTIONS_PER_AUDIO
    const stageScorePct = Math.round(totalCorrect / totalQuestions * 100)
    // Preserve the previous module's maximum of 100 XP per five-audio unit,
    // now weighted by the learner's correct answers out of all 30 questions.
    const xpForStage = Math.round(totalCorrect / totalQuestions * STAGE_MAX_XP)
    const stageWasAlreadyComplete = completedStageIds.has(selectedStage.id)
    const completion = completeListeningLesson(identity, selectedStage.id, stageScorePct, {
      completionXp: stageWasAlreadyComplete ? 0 : xpForStage,
      flawlessXp: 0,
    })
    const firstCompletion = completion.firstCompletion && !stageWasAlreadyComplete
    const xpAward = firstCompletion ? completion.xpAward : 0

    setProgressVersion((version) => version + 1)
    setStageSummary({ stageId: selectedStage.id, correctCount: totalCorrect, questionCount: totalQuestions, scorePct: stageScorePct, xpAward, firstCompletion })
    onLessonComplete?.({
      testId: selectedStage.id,
      scorePct: stageScorePct,
      xpAward,
      firstCompletion,
      completedCount: getCompletedStageIds(stages, identity, moduleScores).size,
      flawlessAwarded: false,
    })
  }

  const resetAudioQuiz = () => {
    updateTaskProgress(selectedTaskKey, (previous) => ({ ...previous, answers: {}, result: null, submitted: false }))
    setStageSummary(null)
  }

  const stageProgressText = (stage) => `${completedAudioCount(stage)}/${AUDIOS_PER_STAGE} ${copy.progress}`

  return (
    <main className="mx-auto w-full max-w-6xl space-y-4 px-3 pb-10 sm:space-y-5 sm:px-4 lg:px-6">
      <header className={cn('relative overflow-hidden rounded-3xl border p-5 shadow-sm sm:p-7', pageCard)}>
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="relative">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-teal-600 dark:text-teal-300"><Headphones className="size-4" />{copy.eyebrow}</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div><h1 className="text-3xl font-black tracking-tight">{copy.title}</h1><p className={cn('mt-2 max-w-xl text-sm leading-relaxed', muted)}>{copy.subtitle}</p></div>
            <div className="flex items-center gap-2 rounded-2xl border border-teal-500/20 bg-teal-500/10 px-4 py-3 text-xs font-extrabold text-teal-800 dark:text-teal-100">
              <CheckCircle2 className="size-4" /><span className="tabular-nums">{completedStageCount}/{STAGE_COUNT}</span> {copy.completed}
            </div>
          </div>
        </div>
      </header>

      {loadingTests && <div role="status" className={cn('rounded-2xl border p-4 text-sm font-bold', pageCard)}>{copy.loading}</div>}
      {(dataMissing || (!loadingTests && !tests.length)) && <div role="alert" className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm font-semibold text-amber-800 dark:text-amber-100">{copy.dataMissing}</div>}

      <section aria-label={copy.subtitle} className="grid grid-cols-1 gap-2 min-[520px]:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 sm:gap-3">
        {stages.map((stage) => {
          const locked = stage.index >= unlockedStageCount
          const done = completedStageIds.has(stage.id)
          const selected = selectedStageIndex === stage.index
          const cefr = [...new Set(stage.audioTasks.map((audio) => audio.level))].join(' · ')
          return (
            <button
              key={stage.id}
              type="button"
              disabled={locked}
              aria-disabled={locked}
              aria-pressed={!locked && selected}
              onClick={() => selectStage(stage.index)}
              className={cn(
                'relative flex min-h-[84px] min-w-0 items-center gap-3 rounded-2xl border p-3 text-left transition sm:min-h-28 sm:p-4',
                locked
                  ? 'cursor-not-allowed border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800'
                  : isPremium
                    ? 'border-white/10 bg-slate-950/80 text-white hover:border-teal-400/50'
                    : dark
                      ? 'border-slate-700 bg-slate-900 text-slate-100 hover:border-teal-500/60'
                      : 'border-slate-200 bg-white text-slate-900 hover:border-teal-500/60 hover:shadow-md',
                selected && !locked && 'ring-2 ring-teal-500/50',
              )}
            >
              <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl font-black tabular-nums sm:size-12', locked ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : done ? 'bg-emerald-500 text-white' : 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white')}>
                {locked ? <LockKeyhole className="size-5" /> : done ? <Check className="size-5" /> : String(stage.number).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn('block text-[10px] font-black uppercase tracking-[.16em]', locked ? 'text-slate-600 dark:text-slate-300' : 'text-teal-600 dark:text-teal-300')}>{copy.stage} {String(stage.number).padStart(2, '0')} · {cefr || '—'}</span>
                <span className={cn('mt-2 block text-[10px] font-black uppercase tracking-wider', locked ? 'text-slate-600 dark:text-slate-300' : done ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300')}>
                  {locked ? copy.locked : done ? copy.stageDone : stageProgressText(stage)}
                </span>
              </span>
              {!locked && <ChevronRight className="size-4 shrink-0 text-slate-400" />}
            </button>
          )
        })}
      </section>

      {selectedStage && <section ref={stagePanelRef} className={cn('scroll-mt-4 min-w-0 overflow-hidden rounded-2xl border shadow-sm sm:rounded-3xl', pageCard)}>
        <div className="border-b border-slate-200/70 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-4 py-4 text-white dark:border-slate-700 sm:px-6 sm:py-5 lg:px-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-teal-300 sm:tracking-[.22em]">{copy.stage} {String(selectedStage.number).padStart(2, '0')} · {completedAudioCount(selectedStage)}/{AUDIOS_PER_STAGE} {copy.progress}</p>
              <h2 className="mt-1 text-xl font-black sm:text-2xl">{copy.stage} {String(selectedStage.number).padStart(2, '0')}</h2>
              <p className="mt-1 text-sm text-white/70">{copy.stageSubtitle}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-xs font-black text-emerald-200"><span className="size-2 animate-pulse rounded-full bg-emerald-400" />{stageIsComplete ? copy.stageDone : copy.stageReady}</span>
          </div>
        </div>

        <div className="min-w-0 p-3 sm:p-5 lg:p-7">
          {!stageStructureValid && <p role="alert" className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm font-semibold text-amber-800 dark:text-amber-100">{copy.invalidStage}</p>}
          <div className="mb-4 grid grid-cols-2 gap-2 min-[520px]:grid-cols-3 xl:grid-cols-5 sm:mb-5" aria-label={copy.audio}>
            {selectedStage.audioTasks.map((audio, index) => {
              const submitted = taskIsSubmitted(selectedStage, audio)
              const selected = selectedAudio?.id === audio.id
              return (
                <button key={audio.id} type="button" aria-pressed={selected} onClick={() => selectAudio(audio)} className={cn('flex min-h-14 min-w-0 items-center gap-2 rounded-xl border p-2 text-left transition sm:p-3', selected ? 'border-teal-500 bg-teal-500/10 text-teal-800 dark:text-teal-100' : 'border-slate-200 hover:border-teal-500 dark:border-slate-700', submitted && 'border-emerald-500/50')}>
                  {submitted ? <CheckCircle2 className="size-4 shrink-0 text-emerald-500" /> : <span className="grid size-6 shrink-0 place-items-center rounded-md bg-slate-100 text-[10px] font-black dark:bg-slate-800">{String(index + 1).padStart(2, '0')}</span>}
                  <span className="min-w-0"><span className="block text-[10px] font-black uppercase tracking-wider">{audio.level} · {copy.audio} {index + 1}</span><span className="block truncate text-xs font-bold">{localized(audio.title, language)}</span></span>
                </button>
              )
            })}
          </div>

          {selectedAudio && <>
            <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2 sm:mb-4">
              <div className="min-w-0 flex-1"><p className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-300">{selectedAudio.level} · {selectedAudio.category}</p><h3 className="mt-1 break-words text-base font-black sm:text-lg">{localized(selectedAudio.title, language)}</h3></div>
              <span className="shrink-0 rounded-full border border-teal-500/20 bg-teal-500/10 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-200 sm:px-3">{selectedAudio.quizQuestions.length}/{QUESTIONS_PER_AUDIO} {copy.questionsTotal}</span>
            </div>
            <AudioPlayer key={selectedAudio.id} lesson={selectedAudio} language={language} isPremium={isPremium} dark={dark} onAudioFinished={markAudioFinished} />
            <div className="mt-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-black">{copy.quiz}</h3><span className="rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-200">{selectedAudio.quizQuestions.length} · {copy.question}</span></div>
              {selectedAudio.quizQuestions.length !== QUESTIONS_PER_AUDIO ? <p className={cn('rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm font-semibold', muted)}>{copy.noQuestions}</p> : <div className="space-y-4">
                {selectedAudio.quizQuestions.map((question, index) => (
                  <fieldset key={question.id} disabled={Boolean(selectedTaskResult)} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <legend className="px-1 text-sm font-extrabold">{copy.question} {index + 1}. {localized(question.prompt, language)}</legend>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {question.options.map((option, optionIndex) => {
                        const picked = selectedAnswers[question.id] === optionIndex
                        const correctAnswer = selectedTaskResult && optionIndex === question.correctIndex
                        const wrongAnswer = selectedTaskResult && picked && optionIndex !== question.correctIndex
                        return <button key={optionIndex} type="button" onClick={() => updateTaskProgress(selectedTaskKey, (previous) => ({ ...previous, answers: { ...(previous.answers || {}), [question.id]: optionIndex }, submitted: false, result: null }))} className={cn('rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition', correctAnswer ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200' : wrongAnswer ? 'border-rose-400 bg-rose-500/10 text-rose-800 dark:text-rose-200' : picked ? 'border-teal-500 bg-teal-500/10 text-teal-900 dark:text-teal-100' : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700')}>{localized(option, language)}</button>
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>}

              {selectedTaskResult && <div role="status" className={cn('mt-5 rounded-2xl border p-4', selectedTaskResult.scorePct === 100 ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-amber-500/30 bg-amber-500/10')}>
                <p className="flex items-center gap-2 font-extrabold">{selectedTaskResult.scorePct === 100 ? <CheckCircle2 className="size-5 text-emerald-600" /> : <RotateCcw className="size-5 text-amber-600" />}{selectedTaskResult.correctCount}/{selectedTaskResult.questionCount} · {selectedTaskResult.scorePct}%</p>
                <p className="mt-1 text-sm font-semibold">{selectedTaskResult.scorePct === 100 ? copy.perfect : copy.incorrect}</p>
                {!stageIsComplete && <button type="button" onClick={resetAudioQuiz} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"><RotateCcw className="size-4" />{copy.retry}</button>}
              </div>}

              {!selectedTaskResult && <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className={cn('text-xs', muted)}>{listenedAudioIds.has(selectedAudio.id) ? copy.choose : copy.listenFirst}</p>
                <button type="button" onClick={submitAudioQuiz} disabled={!stageStructureValid || !listenedAudioIds.has(selectedAudio.id) || selectedAudio.quizQuestions.length !== QUESTIONS_PER_AUDIO || Object.keys(selectedAnswers).length !== QUESTIONS_PER_AUDIO} className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"><CheckCircle2 className="size-4" />{copy.submit}</button>
              </div>}
            </div>
          </>}

          {stageSummary?.stageId === selectedStage.id && <div role="status" className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="font-extrabold">{copy.stageScore}: {stageSummary.correctCount}/{stageSummary.questionCount} · {stageSummary.scorePct}%</p>
            <p className="mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-200">{stageSummary.firstCompletion ? `${copy.passed} · +${stageSummary.xpAward} ${copy.earned}` : copy.already}</p>
            {selectedStage.number < STAGE_COUNT && <p className="mt-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">{copy.stage} {String(selectedStage.number + 1).padStart(2, '0')} · {copy.stageReady}</p>}
          </div>}
        </div>
      </section>}
    </main>
  )
}
