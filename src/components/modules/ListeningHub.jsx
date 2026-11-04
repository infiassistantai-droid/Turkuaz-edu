import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, BookmarkCheck, BookmarkPlus, Check, CheckCircle2, ChevronDown, CircleHelp,
  FileText, Flame, Gauge, Headphones, Pause, Play, RotateCcw, SkipBack, SkipForward,
  Sparkles, Volume2, XCircle,
} from 'lucide-react'
import { extendedListeningLessons as listeningLessons } from '../../data/listeningLessons'
import { completeListeningLesson, loadListeningProgress } from '../../lib/listeningProgress'
import { loadJSON, READING_VOCABULARY_KEY, SAVED_KEY, saveJSON } from '../../lib/storage'
import { cn, formatTime } from '../../lib/utils'
import { useI18n } from '../../lib/i18n.jsx'

const PLAYBACK_SPEEDS = [0.75, 1, 1.25]
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'
const ELEVENLABS_KEY = typeof import.meta.env?.VITE_ELEVENLABS_API_KEY === 'string'
  ? import.meta.env.VITE_ELEVENLABS_API_KEY.trim()
  : ''
const ELEVENLABS_VOICE_ID = typeof import.meta.env?.VITE_ELEVENLABS_VOICE_ID === 'string'
  ? import.meta.env.VITE_ELEVENLABS_VOICE_ID.trim() || DEFAULT_VOICE_ID
  : DEFAULT_VOICE_ID

function normalizeAnswer(value) {
  return String(value || '').trim().toLocaleLowerCase('tr-TR').replace(/[.!?,'’]/gu, '').replace(/\s+/gu, ' ')
}

function countUniqueSavedWords(saved) {
  if (!Array.isArray(saved)) return 0
  const normalized = saved.map((item) => typeof item === 'string' ? item : item?.term)
    .map((term) => String(term || '').trim().toLocaleLowerCase('tr-TR'))
    .filter(Boolean)
  return new Set(normalized).size
}

function Waveform({ playing, premium }) {
  return (
    <div className="flex h-14 items-center justify-center gap-[3px] sm:justify-start" aria-hidden="true">
      {Array.from({ length:  fortyBars }, (_, index) => {
        const height = 8 + Math.abs(Math.sin(index * 1.61)) * 28
        return <span key={index} className={cn('w-1 rounded-full transition-colors', playing ? 'animate-[wave_1s_ease-in-out_infinite]' : 'opacity-55', premium ? 'bg-teal-200' : 'bg-teal-600')} style={{ height, animationDelay: `${(index % 9) * 75}ms` }} />
      })}
    </div>
  )
}
const fortyBars = 40

function AudioStudioPlayer({ lesson, premium, dark }) {
  const { t } = useI18n()
  const spokenText = useMemo(() => lesson.transcript.join(' ').replace(/\s+/gu, ' ').trim(), [lesson])
  const [status, setStatus] = useState('ready')
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [errorCopy, setErrorCopy] = useState('')
  const audioRef = useRef(null)
  const objectUrlRef = useRef(null)
  const utteranceRef = useRef(null)
  const requestRef = useRef(null)
  const playbackIdRef = useRef(0)
  const sourceRef = useRef(null)
  const speedRef = useRef(1)
  const progressRef = useRef(0)
  const hasBrowserSpeech = typeof window !== 'undefined' && Boolean(window.speechSynthesis) && typeof window.SpeechSynthesisUtterance === 'function'
  const estimateDuration = Math.max(20, Math.round(spokenText.split(/\s+/u).length * 0.42 / speedRef.current))

  const releaseAudio = () => {
    const audio = audioRef.current
    audioRef.current = null
    if (audio) {
      audio.onended = null
      audio.onerror = null
      audio.ontimeupdate = null
      try { audio.pause(); audio.removeAttribute('src'); audio.load() } catch { /* Browser cleanup is best-effort. */ }
    }
    if (objectUrlRef.current) {
      try { URL.revokeObjectURL(objectUrlRef.current) } catch { /* Ignore already released URLs. */ }
      objectUrlRef.current = null
    }
  }

  const cancelPlayback = () => {
    playbackIdRef.current += 1
    requestRef.current?.abort()
    requestRef.current = null
    releaseAudio()
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel() } catch { /* Ignore browser shutdown errors. */ }
    }
    utteranceRef.current = null
    sourceRef.current = null
    setStatus('ready')
  }

  useEffect(() => {
    cancelPlayback()
    progressRef.current = 0
    setProgress(0)
    setDuration(0)
    setErrorCopy('')
    return () => cancelPlayback()
    // The lesson identity is intentionally the audio-session boundary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id])


  const updateProgress = (value) => {
    const safe = Math.max(0, Math.min(100, Number(value) || 0))
    progressRef.current = safe
    setProgress(safe)
  }

  const playBrowserSpeech = (startPct, playbackId, pauseOnStart = false) => {
    if (!hasBrowserSpeech || playbackId !== playbackIdRef.current) {
      setStatus('error')
      setErrorCopy(t('listening.audio.unavailable'))
      return
    }
    try {
      const startIndex = Math.max(0, Math.min(spokenText.length, Math.floor(spokenText.length * startPct / 100)))
      let wordIndex = startIndex
      while (wordIndex > 0 && !/\s/u.test(spokenText[wordIndex - 1])) wordIndex -= 1
      const textToSpeak = spokenText.slice(wordIndex)
      if (!textToSpeak) {
        updateProgress(100)
        setStatus('done')
        return
      }
      window.speechSynthesis.cancel()
      const utterance = new window.SpeechSynthesisUtterance(textToSpeak)
      utterance.lang = 'tr-TR'
      utterance.rate = speedRef.current
      utterance.pitch = 1
      const voices = window.speechSynthesis.getVoices?.() || []
      utterance.voice = voices.find((voice) => voice.lang?.toLowerCase().startsWith('tr-tr'))
        || voices.find((voice) => voice.lang?.toLowerCase().startsWith('tr')) || null
      utteranceRef.current = utterance
      sourceRef.current = 'speech'
      setDuration(Math.max(20, Math.round(totalWords * 0.42 / speedRef.current)))
      utterance.onstart = () => {
        if (playbackId !== playbackIdRef.current) return
        if (pauseOnStart) {
          window.speechSynthesis.pause()
          setStatus('paused')
        } else setStatus('playing')
      }
      utterance.onboundary = (event) => {
        if (playbackId !== playbackIdRef.current || !Number.isFinite(event.charIndex)) return
        const char = wordIndex + event.charIndex
        const pct = char / Math.max(1, spokenText.length) * 100
        updateProgress(pct)
      }
      utterance.onend = () => {
        if (playbackId !== playbackIdRef.current) return
        utteranceRef.current = null
        sourceRef.current = null
        updateProgress(100)
        setStatus('done')
      }
      utterance.onerror = (event) => {
        if (playbackId !== playbackIdRef.current || ['canceled', 'interrupted'].includes(event.error)) return
        utteranceRef.current = null
        sourceRef.current = null
        setStatus('error')
        setErrorCopy(t('listening.audio.speechFailed'))
      }
      updateProgress(startPct)
      window.speechSynthesis.speak(utterance)
      if (!pauseOnStart) setStatus('playing')
    } catch {
      setStatus('error')
      setErrorCopy(t('listening.audio.speechFailed'))
    }
  }

  const startPlayback = async (startPct = 0, pauseOnStart = false) => {
    const playbackId = playbackIdRef.current + 1
    playbackIdRef.current = playbackId
    requestRef.current?.abort()
    requestRef.current = null
    releaseAudio()
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel() } catch { /* Fallback remains available. */ }
    }
    utteranceRef.current = null
    sourceRef.current = null
    setErrorCopy('')
    updateProgress(startPct)

    if (!ELEVENLABS_KEY || typeof fetch !== 'function' || typeof Audio === 'undefined') {
      if (hasBrowserSpeech) playBrowserSpeech(startPct, playbackId, pauseOnStart)
      else {
        setStatus('error')
        setErrorCopy(t('listening.audio.unavailable'))
      }
      return
    }

    let controller
    let timeoutId
    try {
      controller = new AbortController()
      requestRef.current = controller
      setStatus('loading')
      timeoutId = window.setTimeout(() => controller.abort(), 30000)
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(ELEVENLABS_VOICE_ID)}`, {
        method: 'POST', signal: controller.signal,
        headers: { Accept: 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': ELEVENLABS_KEY },
        body: JSON.stringify({
          text: spokenText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true },
        }),
      })
      if (!response.ok) throw new Error(`TTS request failed (${response.status})`)
      const blob = await response.blob()
      if (!blob.size) throw new Error('TTS response was empty')
      if (playbackId !== playbackIdRef.current) return
      const url = URL.createObjectURL(blob)
      objectUrlRef.current = url
      const audio = new Audio(url)
      audio.preload = 'auto'
      audioRef.current = audio
      sourceRef.current = 'elevenlabs'
      audio.playbackRate = speedRef.current
      audio.ontimeupdate = () => {
        if (playbackId !== playbackIdRef.current || !Number.isFinite(audio.duration) || audio.duration <= 0) return
        setDuration(audio.duration)
        updateProgress(audio.currentTime / audio.duration * 100)
      }
      audio.onended = () => {
        if (playbackId !== playbackIdRef.current) return
        sourceRef.current = null
        updateProgress(100)
        setStatus('done')
      }
      audio.onerror = () => {
        if (playbackId !== playbackIdRef.current) return
        releaseAudio()
        if (hasBrowserSpeech) playBrowserSpeech(startPct, playbackId, pauseOnStart)
        else {
          setStatus('error')
          setErrorCopy(t('listening.audio.speechFailed'))
        }
      }
      await new Promise((resolve, reject) => {
        if (audio.readyState >= 1) return resolve()
        const onReady = () => { cleanup(); resolve() }
        const onError = () => { cleanup(); reject(new Error('Could not load audio metadata')) }
        const cleanup = () => {
          audio.removeEventListener('loadedmetadata', onReady)
          audio.removeEventListener('error', onError)
        }
        audio.addEventListener('loadedmetadata', onReady, { once: true })
        audio.addEventListener('error', onError, { once: true })
        audio.src = url
        audio.load()
      })
      if (playbackId !== playbackIdRef.current) return
      setDuration(Number.isFinite(audio.duration) ? audio.duration : estimateDuration)
      if (Number.isFinite(audio.duration)) audio.currentTime = audio.duration * startPct / 100
      if (pauseOnStart) {
        await audio.play()
        audio.pause()
        setStatus('paused')
      } else {
        await audio.play()
        setStatus('playing')
      }
    } catch {
      if (playbackId !== playbackIdRef.current) return
      releaseAudio()
      if (hasBrowserSpeech) playBrowserSpeech(startPct, playbackId, pauseOnStart)
      else {
        setStatus('error')
        setErrorCopy(t('listening.audio.speechFailed'))
      }
    } finally {
      if (timeoutId) window.clearTimeout(timeoutId)
      if (requestRef.current === controller) requestRef.current = null
    }
  }

  const togglePlayback = async () => {
    if (status === 'loading') return
    if (status === 'playing') {
      if (sourceRef.current === 'elevenlabs' && audioRef.current) audioRef.current.pause()
      else if (sourceRef.current === 'speech') window.speechSynthesis.pause()
      setStatus('paused')
      return
    }
    if (status === 'paused') {
      if (sourceRef.current === 'elevenlabs' && audioRef.current) {
        try { await audioRef.current.play(); setStatus('playing') } catch { startPlayback(progressRef.current) }
      } else if (sourceRef.current === 'speech') {
        try { window.speechSynthesis.resume(); setStatus('playing') } catch { startPlayback(progressRef.current) }
      } else startPlayback(progressRef.current)
      return
    }
    startPlayback(status === 'done' ? 0 : progressRef.current)
  }

  const seekTo = (value) => {
    const next = Math.max(0, Math.min(100, Number(value) || 0))
    if (sourceRef.current === 'elevenlabs' && audioRef.current && Number.isFinite(audioRef.current.duration)) {
      audioRef.current.currentTime = audioRef.current.duration * next / 100
      updateProgress(next)
      if (status === 'done' && next < 100) setStatus('paused')
    } else {
      startPlayback(next, status === 'paused')
    }
  }

  const skip = (seconds) => {
    const estimated = duration || estimateDuration
    const target = Math.max(0, Math.min(100, progressRef.current + seconds / Math.max(1, estimated) * 100))
    seekTo(target)
  }

  const restart = () => startPlayback(0)

  const setPlaybackSpeed = (next) => {
    setSpeed(next)
    speedRef.current = next
    const audio = audioRef.current
    if (sourceRef.current === 'elevenlabs' && audio) audio.playbackRate = next
    else if (sourceRef.current === 'speech' && ['playing', 'paused'].includes(status)) startPlayback(progressRef.current, status === 'paused')
  }

  const isPlaying = status === 'playing'
  const isPaused = status === 'paused'
  const elapsed = duration * progress / 100
  const surface = premium
    ? 'border-white/10 bg-black/30 text-white shadow-[0_14px_42px_rgba(0,0,0,.3)] backdrop-blur-xl'
    : dark
      ? 'border-slate-800 bg-slate-900 text-slate-100 shadow-xl shadow-black/20'
      : 'border-cyan-200 bg-gradient-to-br from-cyan-50 to-teal-50 text-slate-900 shadow-sm'
  const ButtonIcon = isPlaying ? Pause : Play

  return (
    <section className={cn('rounded-3xl border p-4 sm:p-5', surface)} aria-label={t('listening.audio.title')}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-center">
          <button type="button" onClick={togglePlayback} disabled={status === 'loading'} aria-label={t(`listening.audio.${status === 'loading' ? 'loading' : isPlaying ? 'pause' : isPaused ? 'resume' : 'play'}`)} className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-900/25 transition hover:scale-105 active:scale-95 disabled:opacity-50">
            {status === 'loading' ? <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <ButtonIcon className="size-6 fill-current" aria-hidden="true" />}
          </button>
          <span className={cn('min-h-4 text-xs font-bold', premium ? 'text-teal-100' : dark ? 'text-teal-300' : 'text-teal-800')} role="status">{errorCopy || t(`listening.audio.status.${status}`)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <Waveform playing={isPlaying} premium={premium} />
          <input aria-label={t('listening.audio.seek')} type="range" min="0" max="100" value={progress} onChange={(event) => seekTo(event.target.value)} className="w-full accent-teal-500" />
          <div className="flex justify-between text-[11px] font-semibold tabular-nums text-slate-500 dark:text-slate-400"><span>{formatTime(Math.round(elapsed))}</span><span>{formatTime(Math.round(duration || estimateDuration))}</span></div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => skip(-5)} aria-label={t('listening.audio.rewind')} className={cn('inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition', premium ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : dark ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50')}><SkipBack className="size-3.5" />−5s</button>
        <button type="button" onClick={() => skip(5)} aria-label={t('listening.audio.forward')} className={cn('inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition', premium ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : dark ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50')}><SkipForward className="size-3.5" />+5s</button>
        <button type="button" onClick={restart} aria-label={t('listening.audio.restart')} className={cn('inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition', premium ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : dark ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50')}><RotateCcw className="size-3.5" />{t('listening.audio.restart')}</button>
        <label className={cn('ml-auto inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold', premium ? 'border-white/10 bg-white/5 text-white' : dark ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-white text-slate-700')}><Gauge className="size-3.5 text-teal-500" />{t('listening.audio.speed')}<select value={speed} onChange={(event) => setPlaybackSpeed(Number(event.target.value))} className={cn('bg-transparent font-extrabold outline-none', premium ? 'text-teal-200' : dark ? 'text-teal-300' : 'text-teal-800')}>{PLAYBACK_SPEEDS.map((rate) => <option key={rate} value={rate} className="text-slate-900">{rate.toFixed(rate === 1 ? 1 : 2).replace(/0$/u, '')}×</option>)}</select></label>
        <span className={cn('flex basis-full items-center gap-1.5 text-[10px] sm:basis-auto', premium ? 'text-white/45' : dark ? 'text-slate-400' : 'text-slate-500')}><Volume2 className="size-3.5" />{ELEVENLABS_KEY ? t('listening.audio.elevenlabsReady') : t('listening.audio.browserFallback')}</span>
      </div>
    </section>
  )
}

function InteractiveTranscript({ lesson, language, onWordSelect, activeWord, show }) {
  const { t } = useI18n()
  const vocabulary = useMemo(() => [...lesson.vocabulary].sort((a, b) => b.term.length - a.term.length), [lesson])
  const pattern = useMemo(() => vocabulary.length ? new RegExp(`(${vocabulary.map((item) => item.term.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')).join('|')})`, 'giu') : null, [vocabulary])
  const localizedWord = (word) => language === 'en' ? word.en : word.uz

  if (!show) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-dashed p-5 text-center">
        <p className="mb-3 text-sm font-extrabold">{t('listening.transcript.mode')}</p>
        <p aria-hidden="true" className="select-none text-left text-sm leading-7 opacity-30 blur-sm">{lesson.transcript.join(' ')}</p>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/45 to-white/85 dark:via-slate-950/35 dark:to-slate-950/75" />
        <span className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-xs font-bold">{t('listening.transcript.hiddenHint')}</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {lesson.transcript.map((paragraph, index) => {
        const parts = pattern ? paragraph.split(pattern) : [paragraph]
        return <p key={index} className="text-sm leading-8 sm:text-[15px]">{parts.map((part, partIndex) => {
          const item = vocabulary.find((word) => word.term.toLocaleLowerCase('tr-TR') === part.toLocaleLowerCase('tr-TR'))
          if (!item) return <span key={partIndex}>{part}</span>
          return <button key={partIndex} type="button" onClick={() => onWordSelect(activeWord?.term === item.term ? null : item)} className="rounded px-0.5 font-extrabold text-teal-700 underline decoration-teal-400/50 decoration-dotted underline-offset-4 hover:bg-teal-400/10 dark:text-teal-300" title={t('listening.transcript.tapWord')}>{part}</button>
        })}</p>
      })}
      {activeWord && <div role="status" className="rounded-xl border border-teal-500/20 bg-teal-500/5 px-3 py-2 text-xs"><b className="font-extrabold text-teal-700 dark:text-teal-300">{activeWord.term}</b><span className="mx-2 text-slate-400">·</span><span>{localizedWord(activeWord)}</span></div>}
    </div>
  )
}

export default function ListeningHub({ profile, isPremium = false, dark = false, onLessonComplete, onSavedWordsChange }) {
  const { language, t } = useI18n()
  const identity = profile?.userId || profile?.email || 'local'
  const [selectedId, setSelectedId] = useState(listeningLessons[0].id)
  const [levelFilter, setLevelFilter] = useState('all')
  const [showTranscript, setShowTranscript] = useState(false)
  const [activeWord, setActiveWord] = useState(null)
  const [answers, setAnswers] = useState({})
  const [gapAnswers, setGapAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [savedTerms, setSavedTerms] = useState(() => {
    const words = loadJSON(READING_VOCABULARY_KEY, [])
    const saved = loadJSON(SAVED_KEY, [])
    const fromVocabulary = Array.isArray(words) ? words.map((word) => word?.term) : []
    const fromSaved = Array.isArray(saved) ? saved.map((word) => typeof word === 'string' ? word : word?.term) : []
    return new Set([...fromVocabulary, ...fromSaved].map((term) => String(term || '').trim().toLocaleLowerCase('tr-TR')).filter(Boolean))
  })
  const [progressRecords, setProgressRecords] = useState(() => loadListeningProgress(identity).lessons)
  const selectedLesson = listeningLessons.find((lesson) => lesson.id === selectedId) || listeningLessons[0]
  const completedCount = Object.values(progressRecords).filter((entry) => Boolean(entry?.completedAt)).length
  const surface = isPremium
    ? 'border-white/10 bg-black/30 text-white shadow-xl shadow-black/20 backdrop-blur-xl'
    : dark
      ? 'border-slate-800 bg-slate-900 text-slate-100 shadow-xl shadow-black/20'
      : 'border-slate-200 bg-white text-slate-900 shadow-sm'
  const muted = isPremium ? 'text-white/55' : dark ? 'text-slate-400' : 'text-slate-500'
  const levels = ['all', 'A1', 'A2', 'B1', 'B2/C1']
  const visibleLessons = listeningLessons.filter((lesson) => levelFilter === 'all' || lesson.level === levelFilter)

  useEffect(() => {
    const nextProgress = loadListeningProgress(identity).lessons
    setProgressRecords(nextProgress)
  }, [identity])

  useEffect(() => {
    setShowTranscript(false)
    setActiveWord(null)
    setAnswers({})
    setGapAnswers({})
    setResult(null)
  }, [selectedId])

  const selectLesson = (lessonId) => {
    setSelectedId(lessonId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saveWord = (word) => {
    const normalized = word.term.toLocaleLowerCase('tr-TR')
    const vocabulary = loadJSON(READING_VOCABULARY_KEY, [])
    const vocabularyList = Array.isArray(vocabulary) ? vocabulary : []
    if (!vocabularyList.some((entry) => String(entry?.term || '').toLocaleLowerCase('tr-TR') === normalized)) {
      saveJSON(READING_VOCABULARY_KEY, [...vocabularyList, {
        id: `listening-${selectedLesson.id}-${normalized.replace(/\s+/gu, '-')}`,
        term: word.term, uz: word.uz, en: word.en, context: selectedLesson.transcript.join(' '),
        level: selectedLesson.level, lessonId: selectedLesson.id, source: 'listening',
      }])
    }
    const saved = loadJSON(SAVED_KEY, [])
    const savedList = Array.isArray(saved) ? saved : []
    const nextSaved = savedList.some((entry) => String(typeof entry === 'string' ? entry : entry?.term || '').toLocaleLowerCase('tr-TR') === normalized)
      ? savedList
      : [...savedList, word.term]
    saveJSON(SAVED_KEY, nextSaved)
    setSavedTerms((current) => new Set([...current, normalized]))
    onSavedWordsChange?.(countUniqueSavedWords(nextSaved))
  }

  const resetExercises = () => {
    setAnswers({})
    setGapAnswers({})
    setResult(null)
  }

  const submitExercises = () => {
    if (result) return
    const correctQuestions = selectedLesson.questions.filter((item) => answers[item.id] === item.answer).length
    const correctGaps = selectedLesson.gaps.filter((item) => normalizeAnswer(gapAnswers[item.id]) === normalizeAnswer(item.answer)).length
    const total = selectedLesson.questions.length + selectedLesson.gaps.length
    const scorePct = Math.round(((correctQuestions + correctGaps) / total) * 100)
    const completion = completeListeningLesson(identity, selectedLesson.id, scorePct)
    setProgressRecords(loadListeningProgress(identity).lessons)
    setResult({ correctQuestions, correctGaps, total, scorePct, flawless: scorePct === 100, completion })
    onLessonComplete?.({
      lessonId: selectedLesson.id,
      scorePct,
      xpAward: completion.xpAward,
      flawless: scorePct === 100,
      flawlessAwarded: completion.newlyFlawless,
      completedCount: completion.completedCount,
      firstCompletion: completion.firstCompletion,
    })
  }

  const answeredAll = selectedLesson.questions.every((item) => Number.isInteger(answers[item.id]))
    && selectedLesson.gaps.every((item) => String(gapAnswers[item.id] || '').trim())
  const levelCopy = selectedLesson.level === 'B2/C1' ? 'B2 · C1' : selectedLesson.level
  const allSavedSet = savedTerms

  return (
    <div className="mx-auto max-w-[1440px] space-y-5 pb-8">
      <header className={cn('overflow-hidden rounded-[28px] border p-5 sm:p-7', surface)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <span className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[.18em]', isPremium ? 'border-teal-200/20 bg-teal-200/10 text-teal-100' : dark ? 'border-teal-300/20 bg-teal-300/10 text-teal-200' : 'border-teal-200 bg-teal-50 text-teal-800')}><Headphones className="size-3.5" />{t('listening.eyebrow')}</span>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{t('listening.title')}</h1>
            <p className={cn('mt-2 max-w-xl text-sm leading-relaxed', muted)}>{t('listening.subtitle')}</p>
          </div>
          <div className={cn('rounded-2xl border px-4 py-3 text-right', isPremium ? 'border-white/10 bg-black/25' : dark ? 'border-slate-700 bg-slate-800/70' : 'border-slate-200 bg-white/80')}>
            <p className={cn('text-[10px] font-black uppercase tracking-[.15em]', muted)}>{t('listening.completed')}</p>
            <p className="mt-1 text-2xl font-black tabular-nums">{completedCount}<span className={cn('ml-1 text-sm font-bold', muted)}>/{listeningLessons.length}</span></p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label={t('listening.levelFilter')}>
          {levels.map((level) => <button key={level} type="button" role="tab" aria-selected={levelFilter === level} onClick={() => setLevelFilter(level)} className={cn('rounded-xl border px-3 py-2 text-xs font-extrabold transition', levelFilter === level ? 'border-teal-400 bg-teal-500 text-white shadow-sm shadow-teal-900/15' : isPremium ? 'border-white/10 bg-white/5 text-white/65 hover:bg-white/10' : dark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50')}>{level === 'all' ? t('listening.allLevels') : level}</button>)}
        </div>
      </header>

      <div className="grid items-start gap-5 xl:grid-cols-[330px_minmax(0,1fr)]">
        <aside className={cn('rounded-3xl border p-3 sm:p-4', surface)} aria-label={t('listening.lessons')}>
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-sm font-black">{t('listening.lessonList')}</h2>
            <span className={cn('text-[10px] font-bold', muted)}>{visibleLessons.length} {t('listening.lessons')}</span>
          </div>
          <div className="space-y-2">
            {visibleLessons.map((lesson, index) => {
              const complete = Boolean(progressRecords[lesson.id]?.completedAt)
              return <button key={lesson.id} type="button" onClick={() => selectLesson(lesson.id)} aria-current={selectedLesson.id === lesson.id ? 'true' : undefined} className={cn('w-full rounded-2xl border p-3 text-left transition-all', selectedLesson.id === lesson.id ? 'border-teal-400/50 bg-teal-500/10 shadow-[0_8px_24px_rgba(20,184,166,.1)]' : isPremium ? 'border-white/10 bg-white/[.035] hover:bg-white/[.07]' : dark ? 'border-slate-700 bg-slate-800/65 hover:bg-slate-800' : 'border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/40')}>
                <span className="flex items-start gap-3"><span className={cn('grid size-8 shrink-0 place-items-center rounded-xl text-xs font-black', selectedLesson.id === lesson.id ? 'bg-teal-500 text-white' : isPremium ? 'bg-white/10 text-teal-100' : dark ? 'bg-slate-700 text-teal-200' : 'bg-teal-50 text-teal-800')}>{complete ? <Check className="size-4" /> : String(index + 1).padStart(2, '0')}</span><span className="min-w-0 flex-1"><span className="block text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-300">{lesson.level}</span><span className="mt-1 block text-xs font-extrabold leading-snug">{lesson.title}</span><span className={cn('mt-1 block text-[10px] font-semibold', muted)}>{t('listening.lessonMeta', { minutes: lesson.minutes })}</span></span><ChevronDown className={cn('mt-1 size-3.5 rotate-[-90deg]', muted)} /></span>
              </button>
            })}
          </div>
        </aside>

        <main className="min-w-0 space-y-5">
          <section className={cn('rounded-3xl border p-4 sm:p-6', surface)}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-lg bg-teal-500/10 px-2 py-1 text-[10px] font-black text-teal-700 dark:text-teal-300">{levelCopy}</span>{progressRecords[selectedLesson.id]?.completedAt && <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="size-3" />{t('listening.completedBadge')}</span>}</div><h2 className="mt-2 text-xl font-black leading-tight sm:text-2xl">{selectedLesson.title}</h2><p className={cn('mt-2 text-sm leading-relaxed', muted)}>{selectedLesson.summaries[language] || selectedLesson.summaries.en}</p></div>
              <span className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold', isPremium ? 'border-white/10 bg-white/5 text-white/65' : dark ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600')}><FileText className="size-3.5" />{t('listening.wordsCount', { count: selectedLesson.transcript.join(' ').split(/\s+/u).length })}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold', isPremium ? 'bg-white/5 text-white/55' : dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600')}><CircleHelp className="size-3.5" />{t('listening.questionCount', { count: selectedLesson.questions.length })}</span>
              <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold', isPremium ? 'bg-white/5 text-white/55' : dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600')}><Sparkles className="size-3.5" />{t('listening.gapCount', { count: selectedLesson.gaps.length })}</span>
            </div>
          </section>

          <AudioStudioPlayer key={selectedLesson.id} lesson={selectedLesson} premium={isPremium} dark={dark} />

          <section className={cn('rounded-3xl border p-4 sm:p-5', surface)}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h3 className="flex items-center gap-2 text-sm font-black"><FileText className="size-4 text-teal-500" />{t('listening.transcript.title')}</h3><p className={cn('mt-1 text-[11px]', muted)}>{t('listening.transcript.subtitle')}</p></div><button type="button" onClick={() => setShowTranscript((value) => !value)} aria-expanded={showTranscript} className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-3 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-teal-600"><FileText className="size-3.5" />{t(showTranscript ? 'listening.transcript.hide' : 'listening.transcript.show')}</button></div>
            <InteractiveTranscript lesson={selectedLesson} language={language} onWordSelect={setActiveWord} activeWord={activeWord} show={showTranscript} />
          </section>

          <section className={cn('rounded-3xl border p-4 sm:p-5', surface)}>
            <div className="mb-4 flex items-start justify-between gap-3"><div><h3 className="flex items-center gap-2 text-sm font-black"><BookmarkCheck className="size-4 text-amber-500" />{t('listening.vocabulary.title')}</h3><p className={cn('mt-1 text-[11px]', muted)}>{t('listening.vocabulary.subtitle')}</p></div><span className={cn('rounded-lg px-2 py-1 text-[10px] font-extrabold', isPremium ? 'bg-white/5 text-white/55' : dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600')}>{selectedLesson.vocabulary.length} {t('listening.vocabulary.words')}</span></div>
            <div className="grid gap-2 sm:grid-cols-2">
              {selectedLesson.vocabulary.map((word) => {
                const saved = allSavedSet.has(word.term.toLocaleLowerCase('tr-TR'))
                return <div key={word.term} className={cn('flex items-center gap-3 rounded-2xl border p-3', isPremium ? 'border-white/10 bg-black/20' : dark ? 'border-slate-700 bg-slate-800/65' : 'border-slate-200 bg-white')}><div className="min-w-0 flex-1"><p className="text-sm font-extrabold">{word.term}</p><p className={cn('mt-0.5 text-xs', muted)}>{language === 'en' ? word.en : word.uz}<span className="mx-1 text-slate-400">·</span><span className="text-slate-400">{word.en}</span></p></div><button type="button" disabled={saved} onClick={() => saveWord(word)} aria-label={t(saved ? 'listening.vocabulary.saved' : 'listening.vocabulary.save', { word: word.term })} className={cn('grid size-9 shrink-0 place-items-center rounded-xl border transition', saved ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : isPremium ? 'border-white/10 bg-white/5 text-teal-100 hover:bg-white/10' : dark ? 'border-slate-600 bg-slate-800 text-teal-200 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 text-teal-700 hover:bg-teal-50')}>{saved ? <Check className="size-4" /> : <BookmarkPlus className="size-4" />}</button></div>
              })}
            </div>
          </section>

          <section className={cn('rounded-3xl border p-4 sm:p-6', surface)}>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><h3 className="flex items-center gap-2 text-sm font-black"><CircleHelp className="size-4 text-cyan-500" />{t('listening.quiz.title')}</h3><p className={cn('mt-1 text-[11px]', muted)}>{t('listening.quiz.subtitle')}</p></div><span className={cn('rounded-full px-3 py-1.5 text-[10px] font-black', result?.flawless ? 'bg-amber-300/20 text-amber-600 dark:text-amber-200' : isPremium ? 'bg-white/5 text-white/60' : dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600')}>{t('listening.quiz.totalCount', { count: selectedLesson.questions.length + selectedLesson.gaps.length })}</span></div>
            <div className="space-y-4">
              {selectedLesson.questions.map((item, index) => {
                const prompt = item.prompt[language] || item.prompt.en
                const chosen = answers[item.id]
                const correct = result && chosen === item.answer
                return <article key={item.id} className={cn('rounded-2xl border p-4', isPremium ? 'border-white/10 bg-white/[.035]' : dark ? 'border-slate-700 bg-slate-800/55' : 'border-slate-200 bg-white')}>
                  <h4 className="text-sm font-extrabold"><span className="mr-2 text-teal-500">{String(index + 1).padStart(2,'0')}.</span>{prompt}</h4>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">{item.options.map((option, optionIndex) => {
                    const selected = chosen === optionIndex
                    const correctOption = result && optionIndex === item.answer
                    const wrongChoice = result && selected && optionIndex !== item.answer
                    return <button key={optionIndex} type="button" disabled={Boolean(result)} onClick={() => setAnswers((prev) => ({ ...prev, [item.id]: optionIndex }))} className={cn('rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition', correctOption ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : wrongChoice ? 'border-rose-400/50 bg-rose-500/10 text-rose-700 dark:text-rose-300' : selected ? 'border-teal-400/50 bg-teal-500/10 text-teal-700 dark:text-teal-200' : isPremium ? 'border-white/10 bg-black/20 text-white/75 hover:bg-white/10' : dark ? 'border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-teal-50')}>{option[language] || option.en}</button>
                  })}</div>
                  {result && <div className={cn('mt-3 rounded-xl p-3 text-xs leading-relaxed', correct ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/10 text-rose-700 dark:text-rose-200')}><p className="flex items-center gap-1.5 font-extrabold">{correct ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}{t(correct ? 'listening.feedback.correct' : 'listening.feedback.incorrect')}</p><p className="mt-1">{item.explanation[language] || item.explanation.en}</p></div>}
                </article>
              })}
            </div>

            <div className="mt-5 space-y-3">
              <h4 className="text-sm font-black">{t('listening.gaps.title')}</h4>
              {selectedLesson.gaps.map((gap, index) => {
                const answer = gapAnswers[gap.id] || ''
                const isCorrect = result && normalizeAnswer(answer) === normalizeAnswer(gap.answer)
                return <article key={gap.id} className={cn('rounded-2xl border p-4', isPremium ? 'border-white/10 bg-white/[.035]' : dark ? 'border-slate-700 bg-slate-800/55' : 'border-slate-200 bg-white')}>
                  <label htmlFor={`gap-${gap.id}`} className="text-sm font-bold"><span className="mr-2 text-cyan-500">{String(index + 1).padStart(2,'0')}.</span>{language === 'en' ? gap.en : language === 'uz' ? gap.uz : gap.sentence}</label>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row"><input id={`gap-${gap.id}`} type="text" value={answer} disabled={Boolean(result)} onChange={(event) => setGapAnswers((prev) => ({ ...prev, [gap.id]: event.target.value }))} placeholder={t('listening.gaps.placeholder')} className={cn('min-h-10 min-w-0 flex-1 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/30', isPremium ? 'border-white/10 bg-black/30 text-white placeholder:text-white/35' : dark ? 'border-slate-600 bg-slate-900 text-white placeholder:text-slate-500' : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400')} />
                    <div className="flex flex-wrap gap-1.5">{gap.options.map((option) => <button key={option} type="button" disabled={Boolean(result)} onClick={() => setGapAnswers((prev) => ({ ...prev, [gap.id]: option }))} className={cn('rounded-lg border px-2.5 py-2 text-[11px] font-bold transition', normalizeAnswer(answer) === normalizeAnswer(option) ? 'border-teal-400/40 bg-teal-500/10 text-teal-700 dark:text-teal-200' : isPremium ? 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10' : dark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100')}>{option}</button>)}</div>
                  </div>
                  {result && <div className={cn('mt-2 text-xs font-bold', isCorrect ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300')}>{t(isCorrect ? 'listening.feedback.correct' : 'listening.feedback.answerWas', { answer: gap.answer })}</div>}
                </article>
              })}
            </div>

            {result ? (
              <div className={cn('mt-5 rounded-2xl border p-4', result.flawless ? 'border-amber-400/35 bg-amber-300/10' : isPremium ? 'border-white/10 bg-black/25' : dark ? 'border-slate-700 bg-slate-800/75' : 'border-slate-200 bg-slate-50')}>
                <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-black">{t('listening.feedback.result')}</p><p className={cn('mt-1 text-xs', muted)}>{t('listening.feedback.score', { correct: result.correctQuestions + result.correctGaps, total: result.total, pct: result.scorePct })}</p></div><span className="text-3xl font-black tabular-nums text-teal-500">{result.scorePct}%</span></div>
                <p className={cn('mt-2 text-xs leading-relaxed', muted)}>{t(result.flawless ? 'listening.feedback.flawless' : 'listening.feedback.lessonComplete')}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-500"><Sparkles className="size-4" />{t('listening.feedback.xpEarned', { xp: result.completion.xpAward })}</span><button type="button" onClick={resetExercises} className="rounded-xl border border-teal-400/25 bg-teal-500/10 px-3 py-2 text-xs font-extrabold text-teal-700 dark:text-teal-200">{t('listening.quiz.retry')}</button></div>
              </div>
            ) : (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className={cn('text-xs font-semibold', muted)}>{t('listening.quiz.answerProgress', { answered: Object.keys(answers).length + Object.values(gapAnswers).filter((value) => String(value).trim()).length, total: selectedLesson.questions.length + selectedLesson.gaps.length })}</p><button type="button" disabled={!answeredAll} onClick={submitExercises} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-teal-900/15 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"><CheckCircle2 className="size-4" />{t('listening.quiz.submit')}</button></div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
