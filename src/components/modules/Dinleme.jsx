import { PanelHeading, SectionBanner } from '../BosforArtwork'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpenText, Check, CheckCircle2, CircleX, FastForward, Headphones, LockKeyhole, Pause, Play, RotateCcw, Rewind } from 'lucide-react'
import { completeListeningLesson, loadListeningProgress } from '../../lib/listeningProgress'
import { loadJSON, saveJSON } from '../../lib/storage'
import { useI18n } from '../../lib/i18n.jsx'
import '../../bosfor-listening.css'

const STAGE_COUNT = 20
const AUDIOS_PER_STAGE = 5
const QUESTIONS_PER_AUDIO = 6
const STAGE_COMPLETION_XP = 40
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
    title: 'Tinglab tushunish', subtitle: 'Har bir bosqichda 5 ta audio va 30 ta savol bor.', completed: 'bosqich yakunlandi',
    nextStage: 'Navbatdagi bosqich', openStage: 'Boshlash', allStages: 'Barcha bosqichlar', unlock: 'Beshta audio mashqni yakunlaganingizda keyingi bosqich ochiladi.',
    nextAudio: 'Keyingi audio', back: 'Bosqichlarga qaytish', answered: 'javob tanlandi', quizReady: 'Savollarni topshirish uchun yetarlicha tingladingiz.', wrongAnswer: 'Noto‘g‘ri javob',
    play: 'Tinglash', pause: 'Pauza', resume: 'Davom ettirish', loading: 'Audio yuklanmoqda…', done: 'Audio tugadi',
    fallback: 'Brauzer ovozi ishlatilmoqda', audioError: 'Audio ishga tushmadi. Qayta urinib ko‘ring.', speed: 'Tezlik',
    playerProgress: 'Audio ijrosi', rewind: '5 soniya orqaga qaytarish', forward: '5 soniya oldinga o‘tkazish',
    transcriptShow: 'Matnni ko‘rsatish', transcriptHide: 'Matnni yashirish', transcript: 'Matn', quiz: 'Savollar',
    question: 'Savol', submit: 'Javoblarni tekshirish', choose: 'Har bir savolga javob tanlang.', retry: 'Qayta urinish',
    perfect: 'Ajoyib! Barcha javoblar to‘g‘ri.', passed: 'Audio test yakunlandi', already: 'Bosqich avval yakunlangan — XP qayta berilmaydi.',
    incorrect: 'Javoblaringiz saqlandi.', stage: 'Bosqich', locked: 'Qulflangan',
    stageDone: 'Yakunlandi', progress: 'audio yakunlandi', audio: 'Audio',
    score: 'To‘g‘ri javob', stageScore: 'Bosqich natijasi',
    noQuestions: 'Bu audio uchun savollar to‘liq yuklanmadi.', listenFirst: 'Javoblarni topshirish uchun audioning kamida 80 foizini tinglang.',
    dataMissing: 'Tinglash mashqlari yuklanmadi. Sahifani yangilab ko‘ring.', invalidStage: 'Bu bosqichdagi audio yoki savollar to‘liq yuklanmadi.',
  },
  en: {
    title: 'Listening comprehension', subtitle: 'Each stage has 5 audio tasks and 30 questions.', completed: 'stages completed',
    nextStage: 'Next stage', openStage: 'Start', allStages: 'All stages', unlock: 'Complete all five audio tasks to unlock the next stage.',
    nextAudio: 'Next audio', back: 'Back to stages', answered: 'answered', quizReady: 'You have listened long enough to submit your answers.', wrongAnswer: 'Incorrect answer',
    play: 'Play', pause: 'Pause', resume: 'Resume', loading: 'Loading audio…', done: 'Audio finished',
    fallback: 'Browser speech fallback', audioError: 'Audio could not be played. Try again.', speed: 'Speed',
    playerProgress: 'Audio progress', rewind: 'Rewind 5 seconds', forward: 'Forward 5 seconds',
    transcriptShow: 'Show transcript', transcriptHide: 'Hide transcript', transcript: 'Transcript', quiz: 'Questions',
    question: 'Question', submit: 'Submit answers', choose: 'Choose an answer for every question.', retry: 'Try again',
    perfect: 'Great! Every answer is correct.', passed: 'Audio task submitted', already: 'This stage was already completed — XP is not awarded again.',
    incorrect: 'Your answers are recorded.', stage: 'Stage', locked: 'Locked',
    stageDone: 'Completed', progress: 'audio tasks completed', audio: 'Audio',
    score: 'Correct answers', stageScore: 'Stage score',
    noQuestions: 'The questions for this audio task did not fully load.', listenFirst: 'Listen to at least 80% of the audio before submitting.',
    dataMissing: 'Listening exercises could not load. Try refreshing the page.', invalidStage: 'Some audio or questions did not load for this stage.',
  },
  tr: {
    title: 'Dinlediğini anlama', subtitle: 'Her aşamada 5 ses kaydı ve 30 soru var.', completed: 'aşama tamamlandı',
    nextStage: 'Sıradaki aşama', openStage: 'Başla', allStages: 'Tüm aşamalar', unlock: 'Sonraki aşamayı açmak için beş ses alıştırmasını tamamla.',
    nextAudio: 'Sonraki ses', back: 'Aşamalara dön', answered: 'cevaplandı', quizReady: 'Cevaplarını göndermek için yeterince dinledin.', wrongAnswer: 'Yanlış cevap',
    play: 'Dinle', pause: 'Duraklat', resume: 'Devam et', loading: 'Ses yükleniyor…', done: 'Ses tamamlandı',
    fallback: 'Tarayıcı sesi kullanılıyor', audioError: 'Ses oynatılamadı. Yeniden deneyin.', speed: 'Hız',
    playerProgress: 'Ses ilerlemesi', rewind: '5 saniye geri sar', forward: '5 saniye ileri sar',
    transcriptShow: 'Metni göster', transcriptHide: 'Metni gizle', transcript: 'Metin', quiz: 'Sorular',
    question: 'Soru', submit: 'Cevapları gönder', choose: 'Her soru için bir cevap seçin.', retry: 'Tekrar dene',
    perfect: 'Harika! Tüm cevaplar doğru.', passed: 'Ses testi tamamlandı', already: 'Bu aşama tamamlandı — XP tekrar verilmez.',
    incorrect: 'Cevapların kaydedildi.', stage: 'Aşama', locked: 'Kilitli',
    stageDone: 'Tamamlandı', progress: 'ses alıştırması tamamlandı', audio: 'Ses',
    score: 'Doğru cevap', stageScore: 'Aşama sonucu',
    noQuestions: 'Bu ses alıştırmasının soruları tam yüklenmedi.', listenFirst: 'Cevapları göndermeden önce sesin en az yüzde 80’ini dinle.',
    dataMissing: 'Dinleme alıştırmaları yüklenemedi. Sayfayı yenilemeyi dene.', invalidStage: 'Bu aşamanın bazı sesleri veya soruları yüklenmedi.',
  },
}

function getCopy(language) {
  return COPY[language] || COPY.uz
}

const API_KEY = typeof import.meta.env?.VITE_ELEVENLABS_API_KEY === 'string'
  ? import.meta.env.VITE_ELEVENLABS_API_KEY.trim()
  : ''
const VOICE_ID = typeof import.meta.env?.VITE_ELEVENLABS_VOICE_ID === 'string'
  ? import.meta.env.VITE_ELEVENLABS_VOICE_ID.trim() || '21m00Tcm4TlvDq8ikWAM'
  : '21m00Tcm4TlvDq8ikWAM'

function AudioPlayer({ lesson, language, qualified, onAudioFinished, playerRef }) {
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
  const speedRef = useRef(1)
  const finishedCallbackRef = useRef(onAudioFinished)
  const heardSecondsRef = useRef(0)
  const lastPositionRef = useRef(null)
  const lastProgressAtRef = useRef(0)
  const completionReportedRef = useRef(false)
  const speechAvailable = typeof window !== 'undefined' && Boolean(window.speechSynthesis) && typeof window.SpeechSynthesisUtterance === 'function'

  useEffect(() => { finishedCallbackRef.current = onAudioFinished }, [onAudioFinished])

  const releaseCurrentPlayback = (audio = audioRef.current) => {
    controllerRef.current?.abort()
    controllerRef.current = null
    if (audio) {
      audio.onloadedmetadata = null
      audio.ontimeupdate = null
      audio.onended = null
      audio.onerror = null
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
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
    completionReportedRef.current = false
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
    const audioDuration = Number(audio.duration)
    if (!completionReportedRef.current && Number.isFinite(audioDuration) && audioDuration > 0
      && heardSecondsRef.current >= audioDuration * 0.8) {
      completionReportedRef.current = true
      finishedCallbackRef.current?.(lesson.id)
    }
  }

  const finishAudioPlayback = (audio, playbackId) => {
    if (playbackId !== playbackIdRef.current) return
    const audioDuration = Number(audio.duration)
    if (Number.isFinite(audioDuration) && audioDuration > 0 && heardSecondsRef.current >= audioDuration * 0.8) {
      if (!completionReportedRef.current) {
        completionReportedRef.current = true
        finishedCallbackRef.current?.(lesson.id)
      }
      setStatus('done')
      return
    }
    // Seeking to the end does not count as listening; restart the audio so the
    // learner can hear enough of the duration before answering the quiz.
    audio.currentTime = 0
    heardSecondsRef.current = 0
    lastPositionRef.current = 0
    lastProgressAtRef.current = Date.now()
    setCurrentTime(0)
    setStatus('ready')
  }

  const finishPlayback = (playbackId) => {
    if (playbackId !== playbackIdRef.current) return
    if (!completionReportedRef.current) {
      completionReportedRef.current = true
      setStatus('done')
      finishedCallbackRef.current?.(lesson.id)
    }
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
    const audio = audioRef.current
    if (!audio) throw new Error('Audio player element is unavailable.')
    audio.preload = 'metadata'
    audio.playbackRate = speedRef.current
    audio.onloadedmetadata = () => {
      if (playbackId !== playbackIdRef.current) return
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    }
    audio.ontimeupdate = () => recordAudioProgress(audio, playbackId)
    audio.onended = () => finishAudioPlayback(audio, playbackId)
    audio.onerror = () => startBrowserSpeech(playbackId)
    audio.src = url
    audio.load()
    sourceRef.current = 'elevenlabs'
    lastPositionRef.current = audio.currentTime || 0
    lastProgressAtRef.current = Date.now()
    await audio.play()
    if (playbackId === playbackIdRef.current) setStatus('playing')
  }

  const startFallback = async (playbackId) => {
    if (playbackId !== playbackIdRef.current || fallbackStartedRef.current === playbackId) return
    fallbackStartedRef.current = playbackId
    releaseCurrentPlayback()
    setCurrentTime(0)
    setDuration(0)
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
    releaseCurrentPlayback()
    setCurrentTime(0)
    setDuration(0)

    if (lesson.audioUrl && audioRef.current) {
      setStatus('loading')
      try {
        const audio = audioRef.current
        audio.preload = 'metadata'
        audio.playbackRate = speedRef.current
        audio.onloadedmetadata = () => {
          if (playbackId !== playbackIdRef.current) return
          setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
        }
        audio.ontimeupdate = () => recordAudioProgress(audio, playbackId)
        audio.onended = () => finishAudioPlayback(audio, playbackId)
        audio.onerror = () => { void startFallback(playbackId) }
        audio.src = lesson.audioUrl
        audio.load()
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
      const nextTime = Math.max(0, Math.min(limit, (audio.currentTime || 0) + delta))
      audio.currentTime = nextTime
      lastPositionRef.current = audio.currentTime
      lastProgressAtRef.current = Date.now()
      setCurrentTime(audio.currentTime)
      return
    }
  }

  const skipBackward = () => seekBy(-5)
  const skipForward = () => seekBy(5)

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

  useEffect(() => {
    const audio = audioRef.current
    return () => {
      playbackIdRef.current += 1
      releaseCurrentPlayback(audio)
    }
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
  const playing = status === 'playing' || status === 'fallback'
  const playbackLabel = playing ? copy.pause : status === 'paused' ? copy.resume : copy.play
  const seekable = duration > 0 && sourceRef.current !== 'speech'
  const progressValue = seekable ? Math.min(currentTime, duration) : 0

  return (
    <section ref={playerRef} tabIndex={-1} className="bosfor-panel listening-player min-w-0 rounded-2xl border p-4 sm:p-5" aria-labelledby="listening-player-heading">
      <audio ref={audioRef} preload="metadata" className="hidden" aria-hidden="true" />
      <PanelHeading name="dinleme" titleId="listening-player-heading" title={localized(lesson.title, language)} description={[lesson.level, lesson.category].filter(Boolean).join(' · ')} />
      <div className="bosfor-inset mt-4 rounded-xl border p-3">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => { void togglePlayback() }} disabled={status === 'loading'} aria-label={playbackLabel} className="bosfor-action listening-play grid size-12 shrink-0 place-items-center rounded-full">
            {playing ? <Pause className="size-5 fill-current" aria-hidden="true" /> : <Play className="size-5 fill-current" aria-hidden="true" />}
          </button>
          <button type="button" onClick={skipBackward} disabled={!seekable} aria-label={copy.rewind} className="bosfor-control listening-action px-2"><Rewind className="size-4" aria-hidden="true" />5s</button>
          <button type="button" onClick={skipForward} disabled={!seekable} aria-label={copy.forward} className="bosfor-control listening-action px-2">5s<FastForward className="size-4" aria-hidden="true" /></button>
          <label className="bosfor-control ml-auto inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-xs font-bold">
            <span className="sr-only">{copy.speed}</span>
            <select value={speed} onChange={(event) => changeSpeed(event.target.value)} className="listening-speed bg-transparent font-bold">
              <option value="0.75">0.75×</option><option value="1">1×</option>
            </select>
          </label>
        </div>
        <div className="mt-3 flex min-w-0 items-center gap-2">
          <span className="listening-muted text-xs tabular-nums">{formatTime(progressValue)}</span>
          <input type="range" min="0" max={duration || 1} step="0.1" value={progressValue} onChange={(event) => seekTo(event.target.value)} disabled={!seekable} aria-label={copy.playerProgress} className="listening-range h-6 min-w-0 flex-1" />
          <span className="listening-muted text-xs tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>
      <p className="listening-muted mt-3 flex min-h-5 items-start gap-2 text-xs font-semibold" role="status">
        {qualified && <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />}
        {qualified && status === 'playing' ? copy.quizReady : statusText}
      </p>
      {lesson.transcript && (
        <div className="mt-2">
          <button type="button" onClick={() => setTranscriptVisible((visible) => !visible)} aria-expanded={transcriptVisible} aria-controls="listening-transcript" className="bosfor-control listening-action">
            <BookOpenText className="size-4" aria-hidden="true" />{transcriptVisible ? copy.transcriptHide : copy.transcriptShow}
          </button>
          <p id="listening-transcript" hidden={!transcriptVisible} lang="tr" className="bosfor-inset mt-3 whitespace-pre-line rounded-xl border p-3 text-sm leading-7">{lesson.transcript}</p>
        </div>
      )}
    </section>
  )
}


export default function Dinleme({ profile, moduleScores = {}, onLessonComplete }) {
  const { language } = useI18n()
  const copy = getCopy(language)
  const identity = profile?.userId || profile?.email || 'local'
  const stagePanelRef = useRef(null)
  const playerRef = useRef(null)
  const overviewRef = useRef(null)
  const summaryRef = useRef(null)
  const [stageOpen, setStageOpen] = useState(false)
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
  const answerCount = selectedAudio?.quizQuestions.filter(({ id, options }) => Number.isInteger(selectedAnswers[id]) && selectedAnswers[id] >= 0 && selectedAnswers[id] < options.length).length || 0
  const stageQuestionCount = selectedStage?.audioTasks.reduce((sum, audio) => sum + audio.quizQuestions.length, 0) || 0
  const stageStructureValid = selectedStage?.audioTasks.length === AUDIOS_PER_STAGE
    && selectedStage.audioTasks.every((audio) => audio.quizQuestions.length === QUESTIONS_PER_AUDIO)
    && stageQuestionCount === AUDIOS_PER_STAGE * QUESTIONS_PER_AUDIO
  const stageIsComplete = Boolean(selectedStage && completedStageIds.has(selectedStage.id))
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
    if (!stage?.audioTasks.length || index >= unlockedStageCount) return
    setSelectedStageIndex(index)
    const nextAudio = stage.audioTasks.find((audio) => !taskIsSubmitted(stage, audio)) || stage.audioTasks[0]
    setSelectedAudioId(nextAudio?.id || null)
    setStageSummary(null)
    setStageOpen(true)
    window.requestAnimationFrame(() => stagePanelRef.current?.focus())
  }

  const showStages = () => {
    setStageOpen(false)
    window.requestAnimationFrame(() => overviewRef.current?.focus())
  }

  const selectAudio = (audio, focusPlayer = false) => {
    if (!selectedStage?.audioTasks.some((item) => item.id === audio.id)) return
    setSelectedAudioId(audio.id)
    if (focusPlayer) window.requestAnimationFrame(() => playerRef.current?.focus())
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
    if (!stageStructureValid || !listenedAudioIds.has(selectedAudio.id) || answerCount !== QUESTIONS_PER_AUDIO) return
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
    // Reward a qualified, fully completed listening stage with a fixed XP amount.
    const xpForStage = STAGE_COMPLETION_XP
    const stageWasAlreadyComplete = completedStageIds.has(selectedStage.id)
    const completion = completeListeningLesson(identity, selectedStage.id, stageScorePct, {
      completionXp: stageWasAlreadyComplete ? 0 : xpForStage,
      flawlessXp: 0,
    })
    const firstCompletion = completion.firstCompletion && !stageWasAlreadyComplete
    const xpAward = firstCompletion ? completion.xpAward : 0

    setProgressVersion((version) => version + 1)
    setStageSummary({ stageId: selectedStage.id, correctCount: totalCorrect, questionCount: totalQuestions, scorePct: stageScorePct, xpAward, firstCompletion })
    window.requestAnimationFrame(() => summaryRef.current?.focus())
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

  const stageProgressText = (stage) => completedAudioCount(stage) + '/' + AUDIOS_PER_STAGE + ' ' + copy.progress
  const nextStage = stages.find((stage) => stage.index < unlockedStageCount && stage.audioTasks.length && !completedStageIds.has(stage.id))
  const nextAudio = selectedStage?.audioTasks.find((audio) => !taskIsSubmitted(selectedStage, audio))
  const listened = selectedAudio && listenedAudioIds.has(selectedAudio.id)
  const questionCount = selectedAudio?.quizQuestions.length || 0
  const summary = stageSummary?.stageId === selectedStage?.id ? stageSummary : null

  if (!stageOpen || !selectedStage) {
    return (
      <section ref={overviewRef} tabIndex={-1} className="bosfor-listening listening-workspace mx-auto w-full max-w-6xl space-y-4" aria-labelledby="listening-title">
        <SectionBanner name="dinleme" titleId="listening-title" title={copy.title} description={copy.subtitle}>
          <span>{completedStageCount}/{STAGE_COUNT} {copy.completed}</span>
        </SectionBanner>

        {loadingTests && <p role="status" className="bosfor-panel rounded-2xl border p-4 text-sm font-bold">{copy.loading}</p>}
        {dataMissing && <p role="alert" className="listening-note rounded-xl border p-4 text-sm font-semibold">{copy.dataMissing}</p>}
        {nextStage && (
          <section className="bosfor-panel rounded-2xl border p-4 sm:p-6" aria-labelledby="listening-next-stage">
            <PanelHeading name="plan" titleId="listening-next-stage" title={copy.nextStage + ' · ' + nextStage.number} description={stageProgressText(nextStage)}>
              <button type="button" onClick={() => selectStage(nextStage.index)} className="bosfor-action listening-action">
                {copy.openStage} <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </PanelHeading>
          </section>
        )}

        {tests.length > 0 && (
          <section className="bosfor-panel rounded-2xl border p-4 sm:p-6" aria-labelledby="listening-all-stages">
            <PanelHeading name="exams" titleId="listening-all-stages" title={copy.allStages} description={copy.unlock} />
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {stages.map((stage) => {
                const locked = stage.index >= unlockedStageCount || stage.audioTasks.length === 0
                const done = completedStageIds.has(stage.id)
                const badge = done ? <Check className="size-5" /> : stage.number
                const label = (
                  <>
                    <span className="listening-stage-number" aria-hidden="true">{badge}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-extrabold">{copy.stage} {stage.number}</span>
                      <span className="listening-muted mt-0.5 block text-xs">{locked ? copy.locked : done ? copy.stageDone : stageProgressText(stage)}</span>
                    </span>
                    {locked ? <LockKeyhole className="size-4 shrink-0" aria-hidden="true" /> : <ArrowRight className="size-4 shrink-0" aria-hidden="true" />}
                  </>
                )
                return (
                  <li key={stage.id}>
                    {locked ? <div className="listening-stage-card bosfor-inset" data-locked="true">{label}</div> : (
                      <button type="button" className="listening-stage-card bosfor-inset" data-current={stage === nextStage} onClick={() => selectStage(stage.index)}>{label}</button>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </section>
    )
  }

  return (
    <section ref={stagePanelRef} tabIndex={-1} className="bosfor-listening listening-workspace mx-auto max-w-6xl space-y-4" aria-labelledby="listening-stage-title">
      <header className="bosfor-panel rounded-2xl border p-4 sm:p-5">
        <PanelHeading name="dinleme" titleId="listening-stage-title" title={copy.stage + ' ' + selectedStage.number} description={stageProgressText(selectedStage)}>
          <button type="button" className="bosfor-control listening-action" onClick={showStages}><ArrowLeft className="size-4" aria-hidden="true" />{copy.back}</button>
        </PanelHeading>
        <div className="bosfor-track mt-4 h-2 overflow-hidden rounded-full" role="progressbar" aria-label={copy.progress} aria-valuemin={0} aria-valuemax={AUDIOS_PER_STAGE} aria-valuenow={completedAudioCount(selectedStage)}>
          <div className="bosfor-progress-fill h-full rounded-full" style={{ width: (completedAudioCount(selectedStage) / AUDIOS_PER_STAGE) * 100 + '%' }} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5" role="group" aria-label={copy.audio}>
          {selectedStage.audioTasks.map((audio, index) => (
            <button key={audio.id} type="button" aria-pressed={selectedAudio?.id === audio.id} onClick={() => selectAudio(audio)} className="listening-audio-tab bosfor-inset flex min-h-14 min-w-0 items-center gap-2 rounded-xl border p-2 text-start">
              {taskIsSubmitted(selectedStage, audio) ? <CheckCircle2 className="size-4 shrink-0" aria-label={copy.stageDone} /> : <Headphones className="size-4 shrink-0" aria-hidden="true" />}
              <span className="min-w-0">
                <span className="block text-xs font-extrabold">{copy.audio} {index + 1} · {audio.level}</span>
                <span className="listening-muted block text-xs">{localized(audio.title, language)}</span>
              </span>
            </button>
          ))}
        </div>
      </header>

      {!stageStructureValid && <p role="alert" className="listening-note rounded-xl border p-4 text-sm font-semibold">{copy.invalidStage}</p>}
      {summary && (
        <section ref={summaryRef} tabIndex={-1} className="bosfor-panel listening-workspace rounded-2xl border p-4 sm:p-5" role="status">
          <PanelHeading name="medal" title={copy.stageScore + ' · ' + summary.scorePct + '%'} description={summary.correctCount + '/' + summary.questionCount + ' · ' + (summary.firstCompletion ? '+' + summary.xpAward + ' XP' : copy.already)}>
            {selectedStage.index + 1 < unlockedStageCount && (
              <button type="button" className="bosfor-action listening-action" onClick={() => selectStage(selectedStage.index + 1)}>{copy.nextStage} <ArrowRight className="size-4" aria-hidden="true" /></button>
            )}
          </PanelHeading>
        </section>
      )}

      {selectedAudio && (
        <div className="listening-layout grid items-start gap-4">
          <AudioPlayer key={selectedAudio.id} lesson={selectedAudio} language={language} playerRef={playerRef} qualified={listened} onAudioFinished={markAudioFinished} />
          <section className="bosfor-panel min-w-0 rounded-2xl border p-4 sm:p-5" aria-labelledby="listening-questions">
            <PanelHeading name="quests" titleId="listening-questions" title={copy.quiz}>
              <span className="bosfor-badge px-2.5 py-1.5 text-xs font-bold tabular-nums">{answerCount}/{questionCount} {copy.answered}</span>
            </PanelHeading>
            {questionCount !== QUESTIONS_PER_AUDIO ? <p className="listening-note mt-4 rounded-xl border p-4 text-sm font-semibold">{copy.noQuestions}</p> : (
              <div className="mt-4 space-y-4">
                {selectedAudio.quizQuestions.map((question, index) => (
                  <fieldset key={question.id} disabled={Boolean(selectedTaskResult)} className="listening-question min-w-0 rounded-xl border p-3">
                    <legend className="px-1 text-sm font-extrabold">{copy.question} {index + 1}. {localized(question.prompt, language)}</legend>
                    <div className="mt-1 grid gap-2">
                      {question.options.map((option, optionIndex) => {
                        const picked = selectedAnswers[question.id] === optionIndex
                        const correct = selectedTaskResult && optionIndex === question.correctIndex
                        const wrong = selectedTaskResult && picked && !correct
                        return (
                          <label key={optionIndex} data-result={correct ? 'correct' : wrong ? 'wrong' : undefined} data-picked={picked} className="listening-option bosfor-inset flex min-h-11 items-start gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold">
                            <input type="radio" className="mt-0.5 size-4 shrink-0" name={question.id} value={optionIndex} checked={picked} onChange={() => updateTaskProgress(selectedTaskKey, (previous) => ({ ...previous, answers: { ...(previous.answers || {}), [question.id]: optionIndex }, submitted: false, result: null }))} />
                            <span className="min-w-0 flex-1">{localized(option, language)}</span>
                            {correct && <CheckCircle2 className="size-4 shrink-0" aria-label={copy.score} />}
                            {wrong && <CircleX className="size-4 shrink-0" aria-label={copy.wrongAnswer} />}
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            )}

            {selectedTaskResult ? (
              <div className="bosfor-inset mt-4 rounded-xl border p-4" role="status">
                <p className="text-sm font-extrabold">{copy.score} · {selectedTaskResult.correctCount}/{selectedTaskResult.questionCount} · {selectedTaskResult.scorePct}%</p>
                <p className="listening-muted mt-1 text-sm">{selectedTaskResult.scorePct === 100 ? copy.perfect : copy.incorrect}</p>
                {!stageIsComplete && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {nextAudio && <button type="button" onClick={() => selectAudio(nextAudio, true)} className="bosfor-action listening-action">{copy.nextAudio}<ArrowRight className="size-4" aria-hidden="true" /></button>}
                    <button type="button" onClick={resetAudioQuiz} className="bosfor-control listening-action"><RotateCcw className="size-4" aria-hidden="true" />{copy.retry}</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="listening-muted text-xs font-semibold">{listened ? copy.choose : copy.listenFirst}</p>
                <button type="button" onClick={submitAudioQuiz} disabled={!stageStructureValid || !listened || answerCount !== QUESTIONS_PER_AUDIO} className="bosfor-action listening-action"><CheckCircle2 className="size-4" aria-hidden="true" />{copy.submit}</button>
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  )
}

