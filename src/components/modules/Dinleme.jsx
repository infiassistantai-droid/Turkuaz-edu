import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, CheckCircle2, ChevronRight, Headphones, Pause, Play, RotateCcw, Volume2 } from 'lucide-react'
import { listeningLessons } from '../../data/listeningLessons'
import { completeListeningLesson, getListeningCompletedCount, loadListeningProgress } from '../../lib/listeningProgress'
import { cn } from '../../lib/utils'
import { useI18n } from '../../lib/i18n.jsx'
import { useMascot } from '../../context/MascotContext'

const COPY = {
  uz: {
    eyebrow: 'TINGLAB TUSHUNISH', title: 'Dinleme', subtitle: 'Avval tinglang, keyin tushunganingizni tekshiring.', completed: 'yakunlangan', play: 'Tinglashni boshlash', pause: 'Pauza', resume: 'Davom ettirish', loading: 'Audio tayyorlanmoqda…', done: 'Tinglash tugadi', fallback: 'Brauzer ovozi ishlatilmoqda', audioError: 'Audio ishga tushmadi. Qayta urinib ko‘ring.', speed: 'Tezlik', transcriptShow: 'Matnni ko‘rsatish', transcriptHide: 'Matnni yashirish', transcript: 'Matn', quiz: 'Tushunganingizni tekshiring', question: 'Savol', submit: 'Javoblarni tekshirish', choose: 'Har bir savolga javob tanlang.', retry: 'Qayta urinish', perfect: 'Ajoyib! Barcha javoblar to‘g‘ri.', passed: 'Dars yakunlandi', already: 'Bu dars avval yakunlangan — XP qayta berilmaydi.', incorrect: 'Hamma javob to‘g‘ri emas. Matnni tinglab, yana urinib ko‘ring.', earned: '+20 XP', of: '/',
  },
  en: {
    eyebrow: 'LISTENING PRACTICE', title: 'Dinleme', subtitle: 'Listen first, then check what you understood.', completed: 'completed', play: 'Play audio', pause: 'Pause', resume: 'Resume', loading: 'Preparing audio…', done: 'Listening finished', fallback: 'Using browser speech', audioError: 'Audio could not start. Please try again.', speed: 'Speed', transcriptShow: 'Show transcript', transcriptHide: 'Hide transcript', transcript: 'Transcript', quiz: 'Check your understanding', question: 'Question', submit: 'Check answers', choose: 'Choose an answer for every question.', retry: 'Try again', perfect: 'Excellent! Every answer is correct.', passed: 'Lesson completed', already: 'This lesson was already completed — XP is not awarded again.', incorrect: 'Not every answer is correct. Listen again and try once more.', earned: '+20 XP', of: '/',
  },
  tr: {
    eyebrow: 'DİNLEME ALIŞTIRMASI', title: 'Dinleme', subtitle: 'Önce dinleyin, sonra anladıklarınızı kontrol edin.', completed: 'tamamlandı', play: 'Dinlemeyi başlat', pause: 'Duraklat', resume: 'Devam et', loading: 'Ses hazırlanıyor…', done: 'Dinleme bitti', fallback: 'Tarayıcı sesi kullanılıyor', audioError: 'Ses başlatılamadı. Lütfen tekrar deneyin.', speed: 'Hız', transcriptShow: 'Metni göster', transcriptHide: 'Metni gizle', transcript: 'Metin', quiz: 'Anladıklarınızı kontrol edin', question: 'Soru', submit: 'Cevapları kontrol et', choose: 'Her soru için bir cevap seçin.', retry: 'Tekrar dene', perfect: 'Harika! Bütün cevaplar doğru.', passed: 'Ders tamamlandı', already: 'Bu ders daha önce tamamlandı — XP yeniden verilmez.', incorrect: 'Tüm cevaplar doğru değil. Tekrar dinleyip yeniden deneyin.', earned: '+20 XP', of: '/',
  },
}

const API_KEY = typeof import.meta.env?.VITE_ELEVENLABS_API_KEY === 'string'
  ? import.meta.env.VITE_ELEVENLABS_API_KEY.trim()
  : ''
const VOICE_ID = typeof import.meta.env?.VITE_ELEVENLABS_VOICE_ID === 'string'
  ? import.meta.env.VITE_ELEVENLABS_VOICE_ID.trim() || '21m00Tcm4TlvDq8ikWAM'
  : '21m00Tcm4TlvDq8ikWAM'

function localized(value, language) {
  return value?.[language] || value?.en || ''
}

function coreCompletedCount(identity) {
  const lessons = loadListeningProgress(identity).lessons
  return listeningLessons.filter((lesson) => lessons[lesson.id]?.completedAt).length
}

function AudioPlayer({ lesson, language, isPremium = false, dark = false }) {
  const copy = COPY[language] || COPY.uz
  const [status, setStatus] = useState('ready')
  const [speed, setSpeed] = useState(1)
  const [transcriptVisible, setTranscriptVisible] = useState(false)
  const audioRef = useRef(null)
  const objectUrlRef = useRef(null)
  const utteranceRef = useRef(null)
  const controllerRef = useRef(null)
  const sourceRef = useRef('')
  const playbackRef = useRef(0)
  const speedRef = useRef(1)
  const speechAvailable = typeof window !== 'undefined' && Boolean(window.speechSynthesis) && typeof window.SpeechSynthesisUtterance === 'function'

  const cleanup = () => {
    playbackRef.current += 1
    controllerRef.current?.abort()
    controllerRef.current = null
    if (audioRef.current) {
      audioRef.current.onended = null
      audioRef.current.onerror = null
      audioRef.current.pause()
      audioRef.current = null
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
    utteranceRef.current = null
    sourceRef.current = ''
  }

  useEffect(() => () => cleanup(), [lesson.id])

  const playBrowserSpeech = (playbackId) => {
    if (!speechAvailable || playbackId !== playbackRef.current) {
      setStatus('error')
      sourceRef.current = ''
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
      utterance.onstart = () => playbackId === playbackRef.current && setStatus('fallback')
      utterance.onend = () => playbackId === playbackRef.current && setStatus('done')
      utterance.onerror = (event) => {
        if (playbackId === playbackRef.current && !['canceled', 'interrupted'].includes(event.error)) setStatus('error')
      }
      utteranceRef.current = utterance
      sourceRef.current = 'speech'
      setStatus('fallback')
      window.speechSynthesis.speak(utterance)
    } catch {
      setStatus('error')
    }
  }

  const startAudio = async () => {
    const playbackId = playbackRef.current + 1
    playbackRef.current = playbackId
    controllerRef.current?.abort()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    if (speechAvailable) window.speechSynthesis.cancel()

    if (!API_KEY || typeof Audio === 'undefined') {
      playBrowserSpeech(playbackId)
      return
    }

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
      if (!blob.size || playbackId !== playbackRef.current) throw new Error('TTS response unavailable')
      const url = URL.createObjectURL(blob)
      objectUrlRef.current = url
      const audio = new Audio(url)
      audio.playbackRate = speedRef.current
      audioRef.current = audio
      sourceRef.current = 'elevenlabs'
      audio.onended = () => playbackId === playbackRef.current && setStatus('done')
      audio.onerror = () => {
        if (playbackId === playbackRef.current) playBrowserSpeech(playbackId)
      }
      await audio.play()
      if (playbackId === playbackRef.current) setStatus('playing')
    } catch {
      if (playbackId === playbackRef.current) playBrowserSpeech(playbackId)
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null
    }
  }

  const togglePlayback = async () => {
    if (status === 'loading') return
    if (status === 'playing' || status === 'fallback') {
      if (sourceRef.current === 'elevenlabs') audioRef.current?.pause()
      else if (sourceRef.current === 'speech') window.speechSynthesis.pause()
      setStatus('paused')
      return
    }
    if (status === 'paused') {
      if (sourceRef.current === 'elevenlabs' && audioRef.current) {
        try { await audioRef.current.play(); setStatus('playing') } catch { void startAudio() }
      } else if (sourceRef.current === 'speech') {
        window.speechSynthesis.resume()
        setStatus('fallback')
      } else void startAudio()
      return
    }
    void startAudio()
  }

  const changeSpeed = (value) => {
    const next = Number(value)
    speedRef.current = next
    setSpeed(next)
    if (audioRef.current) audioRef.current.playbackRate = next
    if (utteranceRef.current) utteranceRef.current.rate = next
  }

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

  return (
    <section className={cn('rounded-2xl border p-4 sm:p-5', surface)} aria-label={copy.play}>
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={togglePlayback} disabled={status === 'loading'} aria-label={statusText} className="grid size-12 shrink-0 place-items-center rounded-full bg-teal-600 text-white shadow-lg transition hover:bg-teal-700 disabled:opacity-60">
          {status === 'playing' || status === 'fallback' ? <Pause className="size-5 fill-current" aria-hidden="true" /> : <Play className="size-5 fill-current" aria-hidden="true" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm font-extrabold"><Volume2 className="size-4 text-teal-500" />{statusText}</div>
          <p className="mt-1 text-xs text-slate-500">{API_KEY ? 'ElevenLabs · eleven_multilingual_v2' : copy.fallback}</p>
        </div>
        <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold">
          {copy.speed}
          <select value={speed} onChange={(event) => changeSpeed(event.target.value)} aria-label={copy.speed} className="bg-transparent font-extrabold outline-none">
            <option value="0.75">0.75×</option>
            <option value="1">1×</option>
          </select>
        </label>
      </div>
      <button type="button" onClick={() => setTranscriptVisible((visible) => !visible)} aria-expanded={transcriptVisible} className="mt-4 text-sm font-bold text-teal-700 underline decoration-dotted underline-offset-4 dark:text-teal-300">
        {transcriptVisible ? copy.transcriptHide : copy.transcriptShow}
      </button>
      {transcriptVisible && <p className="mt-3 whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-800 dark:bg-slate-800 dark:text-slate-100">{lesson.transcript}</p>}
    </section>
  )
}

export default function Dinleme({ profile, isPremium = false, dark = false, onLessonComplete }) {
  const { language, t } = useI18n()
  const { showMascot } = useMascot()
  const copy = COPY[language] || COPY.uz
  const identity = profile?.userId || profile?.email || 'local'
  const [selectedId, setSelectedId] = useState(listeningLessons[0]?.id)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [completedCount, setCompletedCount] = useState(() => coreCompletedCount(identity))
  const selectedLesson = useMemo(() => listeningLessons.find((lesson) => lesson.id === selectedId) || listeningLessons[0], [selectedId])
  const completedIds = useMemo(() => {
    const records = loadListeningProgress(identity).lessons
    return new Set(listeningLessons.filter((lesson) => records[lesson.id]?.completedAt).map((lesson) => lesson.id))
  }, [identity, completedCount])
  const muted = isPremium ? 'text-white/60' : dark ? 'text-slate-400' : 'text-slate-500'

  useEffect(() => {
    setCompletedCount(coreCompletedCount(identity))
  }, [identity])

  const selectLesson = (id) => {
    setSelectedId(id)
    setAnswers({})
    setResult(null)
  }

  const submitQuiz = () => {
    if (Object.keys(answers).length !== selectedLesson.quizQuestions.length) return
    const correctCount = selectedLesson.quizQuestions.reduce((count, question) => count + (answers[question.id] === question.correctIndex ? 1 : 0), 0)
    const scorePct = Math.round(correctCount / selectedLesson.quizQuestions.length * 100)
    const perfect = scorePct === 100
    if (!perfect) {
      setResult({ scorePct, correctCount, xpAward: 0, firstCompletion: false })
      return
    }

    const completion = completeListeningLesson(identity, selectedLesson.id, scorePct, { completionXp: 20, flawlessXp: 0 })
    const nextCount = coreCompletedCount(identity)
    setCompletedCount(nextCount)
    const nextResult = { scorePct, correctCount, xpAward: completion.xpAward, firstCompletion: completion.firstCompletion }
    setResult(nextResult)
    showMascot({ message: t('listening.feedback.celebration'), emotion: 'cheer', duration: 5200 })
    onLessonComplete?.({ ...nextResult, completedCount: getListeningCompletedCount(identity), flawlessAwarded: completion.newlyFlawless })
  }

  const resetQuiz = () => {
    setAnswers({})
    setResult(null)
  }

  const pageCard = isPremium ? 'border-yellow-500/20 bg-black/30 text-white' : dark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900'

  return (
    <main className="mx-auto max-w-5xl space-y-5 pb-10">
      <header className={cn('rounded-3xl border p-5 shadow-sm sm:p-7', pageCard)}>
        <p className="text-xs font-black uppercase tracking-[.2em] text-teal-600 dark:text-teal-300">{copy.eyebrow}</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="text-3xl font-black tracking-tight">{copy.title}</h1><p className={cn('mt-2 max-w-xl text-sm leading-relaxed', muted)}>{copy.subtitle}</p></div>
          <p className="rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-2 text-xs font-bold text-teal-700 dark:text-teal-200">
            <span className="tabular-nums">{completedCount}{copy.of}{listeningLessons.length}</span> {copy.completed}
          </p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {listeningLessons.map((lesson) => {
          const selected = selectedLesson.id === lesson.id
          const complete = completedIds.has(lesson.id)
          return <button key={lesson.id} type="button" onClick={() => selectLesson(lesson.id)} aria-pressed={selected} className={cn('flex items-center gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5', isPremium ? 'border-white/10 bg-black/30' : dark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white', selected && 'border-teal-500 ring-2 ring-teal-500/20')}>
            <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', complete ? 'bg-emerald-500 text-white' : 'bg-teal-500/10 text-teal-700 dark:text-teal-300')}>{complete ? <Check className="size-5" /> : <Headphones className="size-5" />}</span>
            <span className="min-w-0"><span className="block text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-300">{lesson.level}</span><span className="mt-1 block text-sm font-extrabold">{lesson.title}</span>{complete && <span className={cn('mt-1 block text-[10px] font-bold', muted)}>{copy.passed}</span>}</span>
            <ChevronRight className={cn('ml-auto size-4 shrink-0', muted)} />
          </button>
        })}
      </div>

      <section className={cn('rounded-3xl border p-5 shadow-sm sm:p-7', pageCard)}>
        <div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-300">{selectedLesson.level}</p><h2 className="mt-1 text-2xl font-black">{selectedLesson.title}</h2></div><span className="grid size-11 place-items-center rounded-2xl bg-teal-500/10 text-teal-700 dark:text-teal-300"><Headphones className="size-5" /></span></div>
        <AudioPlayer key={selectedLesson.id} lesson={selectedLesson} language={language} isPremium={isPremium} dark={dark} />

        <div className="mt-6">
          <h3 className="mb-4 text-lg font-black">{copy.quiz}</h3>
          <div className="space-y-4">
            {selectedLesson.quizQuestions.map((question, index) => (
              <fieldset key={question.id} disabled={Boolean(result)} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <legend className="px-1 text-sm font-extrabold">{copy.question} {index + 1}. {localized(question.prompt, language)}</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {question.options.map((option, optionIndex) => {
                    const picked = answers[question.id] === optionIndex
                    const correctAnswer = result && optionIndex === question.correctIndex
                    const wrongAnswer = result && picked && optionIndex !== question.correctIndex
                    return <button key={optionIndex} type="button" onClick={() => setAnswers((previous) => ({ ...previous, [question.id]: optionIndex }))} className={cn('rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition', correctAnswer ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200' : wrongAnswer ? 'border-rose-400 bg-rose-500/10 text-rose-800 dark:text-rose-200' : picked ? 'border-teal-500 bg-teal-500/10 text-teal-900 dark:text-teal-100' : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700')}>{localized(option, language)}</button>
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          {result ? <div role="status" className={cn('mt-5 rounded-2xl border p-4', result.scorePct === 100 ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-amber-500/30 bg-amber-500/10')}>
            <p className="flex items-center gap-2 font-extrabold">{result.scorePct === 100 ? <CheckCircle2 className="size-5 text-emerald-600" /> : <RotateCcw className="size-5 text-amber-600" />}{result.scorePct === 100 ? copy.perfect : copy.incorrect}</p>
            {result.scorePct === 100 && <p className="mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-200">{result.firstCompletion ? `${copy.passed} · ${copy.earned}` : copy.already}</p>}
            {result.scorePct !== 100 && <button type="button" onClick={resetQuiz} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"><RotateCcw className="size-4" />{copy.retry}</button>}
          </div> : <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className={cn('text-xs', muted)}>{copy.choose}</p>
            <button type="button" onClick={submitQuiz} disabled={Object.keys(answers).length !== selectedLesson.quizQuestions.length} className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"><CheckCircle2 className="size-4" />{copy.submit}</button>
          </div>}
        </div>
      </section>
    </main>
  )
}
