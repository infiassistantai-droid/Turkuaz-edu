import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  BadgeCheck,
  BookOpenText,
  Check,
  CheckCircle2,
  Clock,
  Headphones,
  LoaderCircle,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  Zap,
} from 'lucide-react'
import { mockReadingMaterials } from '../../data/mockReadingMaterials'
import { loadJSON, READING_COMPLETIONS_PREFIX, READING_VOCABULARY_KEY, SAVED_KEY, saveJSON } from '../../lib/storage'
import { useI18n } from '../../lib/i18n.jsx'
import { useMascot } from '../../context/MascotContext'
import { cn } from '../../lib/utils'
import OkumaModule from './OkumaModule'

const READING_LEVELS = ['A1', 'A2', 'B1']
const FLAWLESS_BONUS_XP = 10
const SPEED_BONUS_XP = 10

function levelTone(level, premium) {
  if (premium) return 'border-yellow-200/20 bg-yellow-200/10 text-yellow-100'
  return level === 'A1'
    ? 'border-teal-200 bg-teal-50 text-teal-800'
    : level === 'A2'
      ? 'border-indigo-200 bg-indigo-50 text-indigo-800'
      : 'border-amber-200 bg-amber-50 text-amber-900'
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function normalizeQuizAnswer(value) {
  return String(value ?? '')
    .normalize('NFC')
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/[.,!?;:]/gu, '')
    .replace(/\s+/gu, ' ')
}

function formatClock(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function SpeedTimer({ elapsedSeconds, targetSeconds, premium }) {
  const { t } = useI18n()
  const isOverTarget = elapsedSeconds >= targetSeconds
  const displayedSeconds = isOverTarget ? elapsedSeconds : targetSeconds - elapsedSeconds
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-xl border px-3 py-2 tabular-nums',
        premium ? 'border-white/10 bg-black/40 text-white' : 'border-slate-200 bg-white text-slate-700 shadow-sm',
        isOverTarget && (premium ? 'border-amber-200/25 text-amber-100' : 'border-amber-200 text-amber-800'),
      )}
      aria-label={t(isOverTarget ? 'reading.speed.elapsed' : 'reading.speed.remaining', { time: formatClock(displayedSeconds) })}
      title={t('reading.speed.target', { minutes: Math.round(targetSeconds / 60) })}
    >
      <Clock className={cn('size-4 shrink-0', isOverTarget ? 'text-amber-500' : premium ? 'text-cyan-200' : 'text-teal-700')} aria-hidden="true" />
      <span className="hidden text-[11px] font-bold sm:inline">{t(isOverTarget ? 'reading.speed.elapsedShort' : 'reading.speed.remainingShort')}</span>
      <time className="text-sm font-black">{formatClock(displayedSeconds)}</time>
    </div>
  )
}

function InteractiveParagraph({ text, glossary, activeGlossId, setActiveGlossId, premium, materialId, savedWordTerms, onSaveWord }) {
  const { t } = useI18n()
  const sortedGlossary = [...glossary].sort((first, second) => second.term.length - first.term.length)
  const parts = text.split(new RegExp(`(${sortedGlossary.map((item) => escapeRegex(item.term)).join('|')})`, 'giu'))

  return parts.filter(Boolean).map((part, index) => {
    const gloss = sortedGlossary.find((item) => item.term.toLocaleLowerCase('tr-TR') === part.toLocaleLowerCase('tr-TR'))
    if (!gloss) return <span key={`${materialId}-text-${index}`}>{part}</span>

    const id = `${materialId}-${gloss.id}`
    const isOpen = activeGlossId === id
    return (
      <span key={`${materialId}-gloss-${index}`} className="group/reading-gloss relative inline">
        <button
          type="button"
          onClick={() => setActiveGlossId(isOpen ? null : id)}
          onKeyDown={(event) => { if (event.key === 'Escape') setActiveGlossId(null) }}
          aria-expanded={isOpen}
          aria-describedby={isOpen ? `${id}-tooltip` : undefined}
          className={cn(
            'cursor-help rounded-sm border-b border-dotted pb-px font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2',
            premium ? 'border-cyan-300/70 text-cyan-100 hover:bg-cyan-300/10 focus-visible:ring-cyan-200/40' : 'border-teal-600 text-teal-800 hover:bg-teal-50 focus-visible:ring-teal-500/30',
          )}
        >
          {part}
        </button>
        <div
          id={`${id}-tooltip`}
          role="group"
          aria-label={t('reading.vocabulary.glossaryActions')}
          className={cn(
            'invisible absolute bottom-full left-1/2 z-40 mb-2 w-max max-w-[240px] -translate-x-1/2 rounded-xl border px-3 py-2 text-left text-xs font-semibold leading-relaxed opacity-0 shadow-xl transition-all duration-150 group-hover/reading-gloss:visible group-hover/reading-gloss:opacity-100 group-focus-within/reading-gloss:visible group-focus-within/reading-gloss:opacity-100',
            premium ? 'bg-slate-950/95 text-white border-white/10 shadow-black/40 backdrop-blur-xl' : 'border-slate-200 bg-white text-slate-800 shadow-slate-900/15',
            isOpen && 'visible opacity-100',
          )}
        >
          <p>{t(gloss.translationKey)}</p>
          <button
            type="button"
            onClick={() => onSaveWord(gloss, text)}
            disabled={savedWordTerms.includes(gloss.term)}
            className={cn(
              'mt-2 inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold transition-colors disabled:cursor-default',
              savedWordTerms.includes(gloss.term)
                ? premium ? 'bg-emerald-300/10 text-emerald-200' : 'bg-emerald-50 text-emerald-700'
                : premium ? 'bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/20' : 'bg-teal-50 text-teal-800 hover:bg-teal-100',
            )}
          >
            {savedWordTerms.includes(gloss.term) ? <CheckCircle2 className="size-3.5" aria-hidden="true" /> : <Plus className="size-3.5" aria-hidden="true" />}
            {t(savedWordTerms.includes(gloss.term) ? 'reading.vocabulary.saved' : 'reading.vocabulary.add')}
          </button>
        </div>
      </span>
    )
  })
}

function readPublicEnv(name) {
  try {
    const value = import.meta.env?.[name]
    return typeof value === 'string' ? value.trim() : ''
  } catch {
    console.warn(`[Okuma audio] Could not read ${name}; browser speech will be used.`)
    return ''
  }
}

const ELEVENLABS_API_KEY = readPublicEnv('VITE_ELEVENLABS_API_KEY')
// ElevenLabs' multilingual Rachel preset works with Turkish text; configure a
// Turkish-native workspace voice through VITE_ELEVENLABS_VOICE_ID when available.
const DEFAULT_MULTILINGUAL_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'
const ELEVENLABS_VOICE_ID = readPublicEnv('VITE_ELEVENLABS_VOICE_ID') || DEFAULT_MULTILINGUAL_VOICE_ID
if (!ELEVENLABS_API_KEY) {
  console.warn('[Okuma audio] ElevenLabs key is not configured; browser speech synthesis is the fallback.')
}

function AudioPlayer({ text, premium, voiceId = ELEVENLABS_VOICE_ID }) {
  const { t } = useI18n()
  const [status, setStatus] = useState('ready')
  const [progress, setProgress] = useState(0)
  const [speed, setSpeed] = useState(1)
  const utteranceRef = useRef(null)
  const audioRef = useRef(null)
  const audioUrlRef = useRef(null)
  const requestRef = useRef(null)
  const playbackIdRef = useRef(0)
  const sourceRef = useRef(null)
  const speedRef = useRef(1)
  const spokenText = String(text ?? '').replace(/\s+/gu, ' ').trim()
  const hasSpeech = typeof window !== 'undefined'
    && Boolean(window.speechSynthesis)
    && typeof window.SpeechSynthesisUtterance === 'function'
  const safeVoiceId = typeof voiceId === 'string' ? voiceId.trim() : ''
  const hasElevenLabs = Boolean(ELEVENLABS_API_KEY && safeVoiceId && typeof fetch === 'function')
  const canPlay = hasSpeech || hasElevenLabs

  const releaseAudio = () => {
    const audio = audioRef.current
    audioRef.current = null
    if (audio) {
      try {
        audio.onended = null
        audio.onerror = null
        audio.ontimeupdate = null
        audio.pause()
        audio.removeAttribute('src')
        audio.load()
      } catch {
        // Media cleanup must never block the browser-speech fallback.
      }
    }
    const objectUrl = audioUrlRef.current
    audioUrlRef.current = null
    if (objectUrl && typeof URL !== 'undefined') {
      try { URL.revokeObjectURL(objectUrl) } catch { /* Ignore already-released URLs. */ }
    }
  }

  useEffect(() => () => {
    playbackIdRef.current += 1
    try { requestRef.current?.abort() } catch { /* Ignore abort during teardown. */ }
    requestRef.current = null
    releaseAudio()
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel() } catch { /* Ignore browser shutdown errors. */ }
    }
    utteranceRef.current = null
    sourceRef.current = null
  }, [text])

  const playWithBrowserSpeech = (rate, playbackId, pauseOnStart = false) => {
    if (!hasSpeech || playbackId !== playbackIdRef.current) {
      setStatus('error')
      return
    }

    try {
      const speech = window.speechSynthesis
      speech.cancel()
      const utterance = new window.SpeechSynthesisUtterance(spokenText)
      utteranceRef.current = utterance
      sourceRef.current = 'speech'
      utterance.lang = 'tr-TR'
      utterance.rate = rate
      utterance.pitch = 1
      const voices = speech.getVoices?.() || []
      utterance.voice = voices.find((voice) => voice.lang?.toLowerCase().startsWith('tr')) || null
      utterance.onstart = () => {
        if (playbackId !== playbackIdRef.current) return
        if (pauseOnStart) {
          speech.pause()
          setStatus('paused')
        } else {
          setStatus('playing')
        }
      }
      utterance.onboundary = (event) => {
        if (playbackId === playbackIdRef.current && spokenText.length && Number.isFinite(event.charIndex)) {
          setProgress(Math.min(99, Math.round((event.charIndex / spokenText.length) * 100)))
        }
      }
      utterance.onend = () => {
        if (playbackId !== playbackIdRef.current) return
        setProgress(100)
        setStatus('done')
        utteranceRef.current = null
        sourceRef.current = null
      }
      utterance.onerror = () => {
        if (playbackId !== playbackIdRef.current) return
        setStatus('error')
        utteranceRef.current = null
        sourceRef.current = null
      }
      speech.speak(utterance)
      if (!pauseOnStart) setStatus('playing')
    } catch (error) {
      console.warn('[Okuma audio] Browser speech synthesis is unavailable.', error)
      setStatus('error')
      utteranceRef.current = null
      sourceRef.current = null
    }
  }

  const startPlayback = async (rate = speedRef.current, pauseOnStart = false) => {
    const playbackId = playbackIdRef.current + 1
    playbackIdRef.current = playbackId
    requestRef.current?.abort()
    requestRef.current = null
    releaseAudio()
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel() } catch { /* Continue with the requested playback. */ }
    }
    utteranceRef.current = null
    sourceRef.current = null
    setProgress(0)

    if (hasElevenLabs) {
      let controller = null
      let timeoutId = null
      try {
        controller = new AbortController()
        requestRef.current = controller
        setStatus('loading')
        timeoutId = window.setTimeout(() => controller.abort(), 30_000)
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(safeVoiceId)}`, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            Accept: 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text: spokenText,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.45,
              similarity_boost: 0.8,
              style: 0.15,
              use_speaker_boost: true,
            },
          }),
        })
        if (!response.ok) throw new Error(`ElevenLabs request failed (${response.status})`)
        const audioBlob = await response.blob()
        if (!audioBlob.size) throw new Error('ElevenLabs returned an empty audio response')
        if (playbackId !== playbackIdRef.current) return

        const objectUrl = URL.createObjectURL(audioBlob)
        audioUrlRef.current = objectUrl
        const audio = new Audio(objectUrl)
        audioRef.current = audio
        sourceRef.current = 'elevenlabs'
        audio.playbackRate = speedRef.current
        audio.ontimeupdate = () => {
          if (playbackId !== playbackIdRef.current) return
          if (Number.isFinite(audio.duration) && audio.duration > 0) {
            setProgress(Math.min(99, Math.round((audio.currentTime / audio.duration) * 100)))
          }
        }
        audio.onended = () => {
          if (playbackId !== playbackIdRef.current) return
          setProgress(100)
          setStatus('done')
          sourceRef.current = null
          releaseAudio()
        }
        audio.onerror = () => {
          if (playbackId !== playbackIdRef.current) return
          releaseAudio()
          playWithBrowserSpeech(speedRef.current, playbackId)
        }
        await audio.play()
        if (playbackId === playbackIdRef.current) setStatus('playing')
        return
      } catch (error) {
        if (playbackId !== playbackIdRef.current) return
        releaseAudio()
        console.warn('[Okuma audio] ElevenLabs playback failed; falling back to browser speech synthesis.')
      } finally {
        if (timeoutId !== null && typeof window !== 'undefined') window.clearTimeout(timeoutId)
        if (requestRef.current === controller) requestRef.current = null
      }
    }

    if (playbackId === playbackIdRef.current) playWithBrowserSpeech(speedRef.current, playbackId, pauseOnStart)
  }

  const togglePlayback = async () => {
    if (!canPlay || status === 'loading') return
    if (status === 'playing') {
      try {
        if (sourceRef.current === 'elevenlabs' && audioRef.current) audioRef.current.pause()
        else if (sourceRef.current === 'speech') window.speechSynthesis.pause()
        setStatus('paused')
      } catch (error) {
        console.warn('[Okuma audio] Could not pause playback safely.', error)
        setStatus('error')
        releaseAudio()
      }
      return
    }
    if (status === 'paused') {
      if (sourceRef.current === 'elevenlabs' && audioRef.current) {
        try {
          await audioRef.current.play()
          setStatus('playing')
        } catch {
          const playbackId = playbackIdRef.current + 1
          playbackIdRef.current = playbackId
          releaseAudio()
          playWithBrowserSpeech(speedRef.current, playbackId)
        }
      } else if (sourceRef.current === 'speech') {
        try {
          window.speechSynthesis.resume()
          setStatus('playing')
        } catch (error) {
          console.warn('[Okuma audio] Could not resume browser speech safely.', error)
          const playbackId = playbackIdRef.current + 1
          playbackIdRef.current = playbackId
          playWithBrowserSpeech(speedRef.current, playbackId)
        }
      } else {
        startPlayback(speedRef.current)
      }
      return
    }
    startPlayback(speedRef.current)
  }

  const changeSpeed = (event) => {
    const nextSpeed = Number(event.target.value)
    if (!Number.isFinite(nextSpeed) || nextSpeed <= 0) return
    const shouldResumePausedPlayback = status === 'paused'
    setSpeed(nextSpeed)
    speedRef.current = nextSpeed
    if (sourceRef.current === 'elevenlabs' && audioRef.current) {
      try {
        audioRef.current.playbackRate = nextSpeed
      } catch (error) {
        console.warn('[Okuma audio] Could not change audio playback speed.', error)
        const playbackId = playbackIdRef.current + 1
        playbackIdRef.current = playbackId
        releaseAudio()
        playWithBrowserSpeech(nextSpeed, playbackId, shouldResumePausedPlayback)
      }
    } else if (sourceRef.current === 'speech' && (status === 'playing' || status === 'paused')) {
      const playbackId = playbackIdRef.current + 1
      playbackIdRef.current = playbackId
      try { window.speechSynthesis.cancel() } catch { /* Restarting speech is still attempted below. */ }
      utteranceRef.current = null
      setProgress(0)
      playWithBrowserSpeech(nextSpeed, playbackId, shouldResumePausedPlayback)
    }
  }

  let statusCopy = t('reading.audio.status.ready')
  if (status === 'loading') statusCopy = t('reading.audio.status.loading')
  else if (!canPlay) statusCopy = t('reading.audio.unavailable')
  else if (status === 'playing') statusCopy = t('reading.audio.status.playing')
  else if (status === 'paused') statusCopy = t('reading.audio.status.paused')
  else if (status === 'done') statusCopy = t('reading.audio.status.done')
  else if (status === 'error') statusCopy = t('reading.audio.unavailable')
  const ButtonIcon = status === 'loading' ? LoaderCircle : status === 'playing' ? Pause : Play

  return (
    <section className={cn('mb-5 rounded-2xl border p-4 sm:p-5', premium ? 'border-white/10 bg-black/40 text-white backdrop-blur-xl' : 'border-slate-200 bg-white text-slate-900 shadow-sm')} aria-label={t('reading.audio.title')}>
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={togglePlayback}
          disabled={!canPlay || status === 'loading'}
          aria-label={status === 'loading' ? t('reading.audio.status.loading') : status === 'playing' ? t('reading.audio.pause') : t('reading.audio.play')}
          className={cn(
            'grid size-11 shrink-0 place-items-center rounded-full transition hover:scale-105 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50',
            premium ? 'bg-cyan-300 text-slate-950 shadow-[0_0_18px_rgba(34,211,238,.25)] focus-visible:ring-cyan-200/30' : 'bg-teal-700 text-white shadow-md shadow-teal-900/15 focus-visible:ring-teal-500/25',
          )}
        >
          <ButtonIcon className={cn('size-4', status === 'loading' && 'animate-spin')} aria-hidden="true" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Volume2 className={cn('size-4', premium ? 'text-cyan-200' : 'text-teal-700')} aria-hidden="true" />
              <h2 className="text-sm font-extrabold">{t('reading.audio.title')}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('text-[11px] font-semibold', premium ? 'text-white/60' : 'text-slate-500')} role="status" aria-live="polite">{statusCopy}</span>
              <label className="sr-only" htmlFor="reading-audio-speed">{t('reading.audio.speedLabel')}</label>
              <select
                id="reading-audio-speed"
                value={speed}
                onChange={changeSpeed}
                disabled={!canPlay}
                aria-label={t('reading.audio.speedLabel')}
                className={cn(
                  'rounded-lg border px-2 py-1 text-xs font-extrabold outline-none focus-visible:ring-2 disabled:opacity-50',
                  premium ? 'border-white/10 bg-slate-900 text-cyan-100 focus-visible:ring-cyan-200/40' : 'border-slate-200 bg-slate-50 text-slate-700 focus-visible:ring-teal-500/30',
                )}
              >
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
              </select>
            </div>
          </div>
          <p className={cn('mt-1 text-xs', premium ? 'text-white/55' : 'text-slate-500')}>{t('reading.audio.subtitle')}</p>
          <div className={cn('mt-2 flex h-5 items-center gap-1 reading-audio-wave', status === 'playing' && 'is-playing')} aria-hidden="true">
            {[8, 13, 10, 17, 12, 20, 11, 16, 9, 18, 12, 15, 8, 17, 11, 14].map((height, index) => (
              <span key={index} style={{ height, animationDelay: `${index * 45}ms` }} className={cn('w-1 rounded-full transition-colors', status === 'playing' ? premium ? 'bg-cyan-300' : 'bg-teal-500' : premium ? 'bg-white/20' : 'bg-slate-300')} />
            ))}
          </div>
          <div className={cn('mt-2 h-1.5 overflow-hidden rounded-full', premium ? 'bg-white/10' : 'bg-slate-100')} role="progressbar" aria-label={t('reading.audio.progress')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <div className={cn('h-full rounded-full transition-[width] duration-300', premium ? 'bg-gradient-to-r from-cyan-400 to-teal-300' : 'bg-gradient-to-r from-teal-600 to-cyan-500')} style={{ width: `${progress}%` }} />
          </div>
        </div>
        <Headphones className={cn('hidden size-5 shrink-0 sm:block', premium ? 'text-white/45' : 'text-slate-400')} aria-hidden="true" />
      </div>
    </section>
  )
}

export default function ReadingLibrary({ addXp, completeLevel, isPremium = false, dark = false, profile, onReadingCompletionsChange, onSavedWordsChange, onFlawlessQuiz, onSpeedBonus }) {
  const { t } = useI18n()
  const { showMascot } = useMascot()
  // Reuse the dark glass reading palette when the app's regular dark mode is on,
  // so reading panels don't stay white against the dark dashboard background.
  const premium = Boolean(isPremium || dark)
  const storageIdentity = String(profile?.userId || profile?.email || 'local').trim().toLowerCase()
  const completionStorageKey = `${READING_COMPLETIONS_PREFIX}${encodeURIComponent(storageIdentity)}`
  const [completedIds, setCompletedIds] = useState(() => {
    const stored = loadJSON(completionStorageKey, [])
    return Array.isArray(stored) ? stored : []
  })
  const [savedWordTerms, setSavedWordTerms] = useState(() => {
    const stored = loadJSON(SAVED_KEY, [])
    return Array.isArray(stored) ? stored : []
  })
  const [readingVocabulary, setReadingVocabulary] = useState(() => {
    const stored = loadJSON(READING_VOCABULARY_KEY, [])
    return Array.isArray(stored) ? stored : []
  })
  const completedIdsRef = useRef(new Set(completedIds))
  const timerStartedAtRef = useRef(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [finalElapsedSeconds, setFinalElapsedSeconds] = useState(0)
  const [view, setView] = useState('library')
  const [selectedId, setSelectedId] = useState(null)
  const [quizStep, setQuizStep] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [answerFeedback, setAnswerFeedback] = useState(null)
  const [quizResults, setQuizResults] = useState([])
  const [finalScore, setFinalScore] = useState(0)
  const [earnedXp, setEarnedXp] = useState(0)
  const [earnedFlawlessBonus, setEarnedFlawlessBonus] = useState(0)
  const [earnedSpeedBonus, setEarnedSpeedBonus] = useState(0)
  const [activeGlossId, setActiveGlossId] = useState(null)
  const selectedMaterial = mockReadingMaterials.find((material) => material.id === selectedId)
  const speedTargetSeconds = selectedMaterial ? (selectedMaterial.timeToReadMinutes + 4) * 60 : 0
  const currentQuestion = selectedMaterial?.questions?.[quizStep]
  const surface = premium
    ? 'border-white/10 bg-black/40 text-white shadow-xl shadow-black/15 backdrop-blur-xl'
    : 'border-slate-200 bg-white text-slate-900 shadow-sm'
  const muted = premium ? 'text-white/65' : 'text-slate-600'

  useEffect(() => {
    onReadingCompletionsChange?.(new Set(completedIds).size)
  }, [completedIds, onReadingCompletionsChange])

  useEffect(() => {
    onSavedWordsChange?.(savedWordTerms.length)
  }, [savedWordTerms.length, onSavedWordsChange])

  useEffect(() => {
    if (!timerStartedAtRef.current || !['reading', 'quiz', 'results'].includes(view)) return undefined
    const updateElapsed = () => setElapsedSeconds(Math.floor((Date.now() - timerStartedAtRef.current) / 1000))
    updateElapsed()
    const timer = window.setInterval(updateElapsed, 1000)
    return () => window.clearInterval(timer)
  }, [selectedId, view])

  const levelMaterials = (level) => mockReadingMaterials.filter((material) => material.level === level)
  const resetQuizState = () => {
    setQuizStep(0)
    setSelectedAnswer('')
    setAnswerFeedback(null)
    setQuizResults([])
    setFinalScore(0)
  }

  const openMaterial = (material) => {
    setSelectedId(material.id)
    timerStartedAtRef.current = Date.now()
    setElapsedSeconds(0)
    setFinalElapsedSeconds(0)
    resetQuizState()
    setEarnedXp(0)
    setEarnedFlawlessBonus(0)
    setEarnedSpeedBonus(0)
    setActiveGlossId(null)
    setView('reading')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saveGlossaryWord = (gloss, paragraph) => {
    const normalizedTerm = gloss.term.toLocaleLowerCase('tr-TR')
    const savedRecordExists = readingVocabulary.some((word) => word.term.toLocaleLowerCase('tr-TR') === normalizedTerm)
    if (!savedRecordExists) {
      const context = paragraph.split(/(?<=[.!?])\s+/u).find((sentence) => sentence.toLocaleLowerCase('tr-TR').includes(normalizedTerm)) || paragraph
      const nextVocabulary = [...readingVocabulary, {
        id: `${selectedId}-${gloss.id}`,
        term: gloss.term,
        translationKey: gloss.translationKey,
        context,
        level: selectedMaterial?.level || 'A1',
        source: 'reading',
      }]
      setReadingVocabulary(nextVocabulary)
      saveJSON(READING_VOCABULARY_KEY, nextVocabulary)
    }
    if (!savedWordTerms.includes(gloss.term)) {
      const nextSavedTerms = [...savedWordTerms, gloss.term]
      setSavedWordTerms(nextSavedTerms)
      saveJSON(SAVED_KEY, nextSavedTerms)
    }
  }

  const backToLibrary = () => {
    setView('library')
    setSelectedId(null)
    timerStartedAtRef.current = null
    setElapsedSeconds(0)
    setFinalElapsedSeconds(0)
    setEarnedSpeedBonus(0)
    resetQuizState()
    setActiveGlossId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const backToReading = () => {
    setView('reading')
    resetQuizState()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startQuiz = () => {
    if (!selectedMaterial) return
    resetQuizState()
    setEarnedXp(0)
    setEarnedFlawlessBonus(0)
    setEarnedSpeedBonus(0)
    setFinalElapsedSeconds(0)
    setView('quiz')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const checkCurrentAnswer = () => {
    if (!currentQuestion || !String(selectedAnswer).trim() || answerFeedback) return
    const isCorrect = currentQuestion.type === 'fillBlank'
      ? normalizeQuizAnswer(selectedAnswer) === normalizeQuizAnswer(t(currentQuestion.answerKey))
      : selectedAnswer === currentQuestion.correctAnswer
    setQuizResults((results) => {
      const nextResults = [...results]
      nextResults[quizStep] = isCorrect
      return nextResults
    })
    setAnswerFeedback(isCorrect ? 'correct' : 'incorrect')
    if (!isCorrect) {
      showMascot({
        message: t('reading.quiz.encourage'),
        emotion: 'encourage',
        duration: 4600,
      })
    }
  }

  const completeQuiz = () => {
    if (!selectedMaterial) return
    const score = quizResults.filter(Boolean).length
    const elapsedAtCompletion = timerStartedAtRef.current
      ? Math.floor((Date.now() - timerStartedAtRef.current) / 1000)
      : elapsedSeconds
    const isSpeedEligible = elapsedAtCompletion < speedTargetSeconds
    setFinalScore(score)
    setFinalElapsedSeconds(elapsedAtCompletion)
    if (score === 10) onFlawlessQuiz?.()

    if (score < 8) {
      setEarnedXp(0)
      setEarnedFlawlessBonus(0)
      setEarnedSpeedBonus(0)
      if (score < 5) {
        showMascot({ message: t('reading.quiz.encourage'), emotion: 'encourage', duration: 5200 })
      }
      setView('results')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const isFirstCompletion = !completedIdsRef.current.has(selectedMaterial.id)
    const baseAward = isFirstCompletion ? selectedMaterial.xpReward : 0
    const flawlessBonus = isFirstCompletion ? FLAWLESS_BONUS_XP : 0
    const speedBonus = isFirstCompletion && isSpeedEligible ? SPEED_BONUS_XP : 0
    const totalAward = baseAward + flawlessBonus + speedBonus
    if (speedBonus > 0) onSpeedBonus?.()
    let completionPercent = 0

    if (isFirstCompletion) {
      const nextCompletedIds = [...completedIdsRef.current, selectedMaterial.id]
      completedIdsRef.current = new Set(nextCompletedIds)
      setCompletedIds(nextCompletedIds)
      saveJSON(completionStorageKey, nextCompletedIds)
      completionPercent = Math.round((nextCompletedIds.length / mockReadingMaterials.length) * 100)
    }
    if (totalAward > 0) addXp(totalAward, { markLessonActivity: false })
    if (isFirstCompletion) completeLevel(completionPercent, 0)
    setEarnedXp(totalAward)
    setEarnedFlawlessBonus(flawlessBonus)
    setEarnedSpeedBonus(speedBonus)
    showMascot({
      message: speedBonus > 0 ? t('reading.speed.mascot') : t('reading.mascot.success'),
      emotion: speedBonus > 0 ? 'speed' : 'cheer',
      duration: speedBonus > 0 ? 7000 : 6000,
    })
    setView('success')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const advanceQuiz = () => {
    if (!selectedMaterial) return
    if (quizStep >= selectedMaterial.questions.length - 1) {
      completeQuiz()
      return
    }
    setQuizStep((step) => step + 1)
    setSelectedAnswer('')
    setAnswerFeedback(null)
  }

  const continueQuiz = () => {
    if (answerFeedback !== 'correct') return
    advanceQuiz()
  }

  const skipQuestion = () => {
    if (answerFeedback !== 'incorrect') return
    advanceQuiz()
  }

  const retryQuestion = () => {
    setSelectedAnswer('')
    setAnswerFeedback(null)
  }

  if (view === 'practice') {
    return (
      <section className="mx-auto max-w-6xl space-y-5">
        <button
          type="button"
          onClick={backToLibrary}
          className={cn(
            'inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors',
            premium ? 'border-white/15 text-white/80 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
          )}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('reading.backLibrary')}
        </button>
        <OkumaModule completeLevel={completeLevel} />
      </section>
    )
  }

  if (view === 'results' && selectedMaterial) {
    const messageKey = finalScore < 5 ? 'reading.quiz.lowScore' : 'reading.quiz.midScore'
    return (
      <section className="mx-auto max-w-3xl py-4 sm:py-10">
        <div className={cn('rounded-[2rem] border px-6 py-10 text-center sm:px-12 sm:py-14', surface)}>
          <div className={cn(
            'mx-auto grid size-20 place-items-center rounded-[1.6rem] border text-2xl font-black tabular-nums',
            finalScore < 5
              ? premium ? 'border-rose-200/25 bg-rose-300/10 text-rose-100' : 'border-rose-200 bg-rose-50 text-rose-700'
              : premium ? 'border-amber-200/25 bg-amber-300/10 text-amber-100' : 'border-amber-200 bg-amber-50 text-amber-800',
          )}>
            {finalScore}/10
          </div>
          <p className={cn('mt-6 text-xs font-black uppercase tracking-[.2em]', premium ? 'text-cyan-200' : 'text-teal-700')}>
            {t('reading.quiz.eyebrow')}
          </p>
          <h1 className={cn('mt-3 text-3xl font-black tracking-tight sm:text-4xl', premium ? 'text-white' : 'text-slate-950')}>
            {t('reading.success.score', { score: finalScore })}
          </h1>
          <div className="mt-3 flex justify-center"><SpeedTimer elapsedSeconds={elapsedSeconds} targetSeconds={speedTargetSeconds} premium={premium} /></div>
          <p className={cn('mx-auto mt-3 max-w-xl text-base leading-relaxed sm:text-lg', muted)}>{t(messageKey)}</p>
          <p className={cn('mt-2 text-xs font-semibold tabular-nums', muted)}>
            {t('reading.speed.finishTime', { time: formatClock(elapsedSeconds), minutes: selectedMaterial.timeToReadMinutes + 4 })}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={startQuiz}
              className={cn(
                'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-extrabold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4',
                premium ? 'bg-gradient-to-r from-cyan-300 to-teal-300 text-slate-950 shadow-lg focus-visible:ring-cyan-200/30' : 'bg-gradient-to-r from-teal-700 to-cyan-600 text-white shadow-lg focus-visible:ring-teal-500/25',
              )}
            >
              <RotateCcw className="size-4" aria-hidden="true" />{t('reading.quiz.tryAgain')}
            </button>
            <button
              type="button"
              onClick={backToLibrary}
              className={cn(
                'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-extrabold transition hover:-translate-y-0.5',
                premium ? 'border-white/15 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
              )}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />{t('reading.backLibrary')}
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (view === 'success' && selectedMaterial) {
    return (
      <section className="mx-auto max-w-3xl py-4 sm:py-10">
        <div className={cn('reading-success-card relative overflow-hidden rounded-[2rem] border px-6 py-12 text-center sm:px-12 sm:py-16', surface)}>
          <Sparkles className={cn('absolute left-[12%] top-[15%] size-7 animate-pulse', premium ? 'text-yellow-200' : 'text-amber-500')} aria-hidden="true" />
          <Sparkles className={cn('absolute right-[13%] top-[25%] size-5 animate-pulse [animation-delay:300ms]', premium ? 'text-sky-200' : 'text-teal-500')} aria-hidden="true" />
          <div className={cn('reading-success-burst mx-auto grid size-24 place-items-center rounded-[2rem] shadow-xl', premium ? 'bg-gradient-to-br from-yellow-200 to-amber-500 text-amber-950 shadow-yellow-900/25' : 'bg-gradient-to-br from-amber-200 to-yellow-400 text-amber-950 shadow-amber-200/70')}>
            <Trophy className="size-12" aria-hidden="true" />
          </div>
          <p className={cn('mt-7 text-xs font-black uppercase tracking-[.2em]', premium ? 'text-yellow-200' : 'text-teal-700')}>
            {t('reading.success.eyebrow')}
          </p>
          <h1 className={cn('mt-3 text-3xl font-black tracking-tight sm:text-4xl', premium ? 'text-white' : 'text-slate-950')}>
            {t('reading.success.title')}
          </h1>
          <p className={cn('mx-auto mt-3 max-w-xl text-base leading-relaxed sm:text-lg', muted)}>
            {t('reading.mascot.success')}
          </p>
          <p className={cn('mt-3 text-sm font-black tabular-nums', premium ? 'text-cyan-100' : 'text-teal-800')}>
            {t('reading.success.score', { score: finalScore })}
          </p>
          <p className={cn('mt-1 text-xs font-semibold tabular-nums', muted)}>
            {t('reading.speed.finishTime', { time: formatClock(finalElapsedSeconds), minutes: selectedMaterial.timeToReadMinutes + 4 })}
          </p>
          {earnedFlawlessBonus > 0 && <span className={cn('mx-auto mt-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black', premium ? 'border-yellow-200/25 bg-yellow-200/10 text-yellow-100' : 'border-amber-200 bg-amber-50 text-amber-900')}>
            <Sparkles className="size-3.5" aria-hidden="true" />{t('reading.success.perfect')}
          </span>}
          {earnedXp > 0 ? (
            <div className={cn('mx-auto mt-7 max-w-sm rounded-2xl border p-4 text-left', premium ? 'border-emerald-200/20 bg-emerald-300/10 text-emerald-50' : 'border-emerald-200 bg-emerald-50 text-emerald-900')}>
              <div className="flex items-center justify-between gap-3 text-sm font-bold">
                <span>{t('reading.success.baseXp')}</span>
                <span className="inline-flex items-center gap-1"><Zap className="size-4 text-amber-500" aria-hidden="true" />+{selectedMaterial.xpReward} XP</span>
              </div>
              {earnedFlawlessBonus > 0 && <div className="mt-2 flex items-center justify-between gap-3 text-sm font-bold">
                <span>{t('reading.success.bonusXp')}</span>
                <span className="inline-flex items-center gap-1"><Sparkles className="size-4 text-amber-500" aria-hidden="true" />+{earnedFlawlessBonus} XP</span>
              </div>}
              {earnedSpeedBonus > 0 && <div className="mt-2 flex items-center justify-between gap-3 text-sm font-bold">
                <span>{t('reading.speed.bonusLabel')}</span>
                <span className="inline-flex items-center gap-1"><Clock className="size-4 text-cyan-600" aria-hidden="true" />+{earnedSpeedBonus} XP</span>
              </div>}
              <div className={cn('mt-3 border-t pt-3 text-center text-base font-black', premium ? 'border-white/15 text-white' : 'border-emerald-200 text-emerald-950')}>
                {t('reading.success.totalXp', { xp: earnedXp })}
              </div>
            </div>
          ) : (
            <div className={cn('mx-auto mt-7 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold', premium ? 'border-white/10 bg-white/5 text-white/70' : 'border-slate-200 bg-slate-50 text-slate-600')}>
              <BadgeCheck className="size-4 text-emerald-500" aria-hidden="true" />{t('reading.success.alreadyCompleted')}
            </div>
          )}
          <button
            type="button"
            onClick={backToLibrary}
            className={cn(
              'mx-auto mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-extrabold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4',
              premium ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 shadow-lg focus-visible:ring-yellow-200/30' : 'bg-gradient-to-r from-teal-700 to-cyan-600 text-white shadow-lg focus-visible:ring-teal-500/25',
            )}
          >
            <Check className="size-4" aria-hidden="true" />{t('reading.success.continue')}
          </button>
        </div>
      </section>
    )
  }

  if (view === 'quiz' && selectedMaterial && currentQuestion) {
    const questions = selectedMaterial.questions
    const progressPercent = Math.round(((quizStep + 1) / questions.length) * 100)
    const questionTypeLabel = currentQuestion.type === 'trueFalse'
      ? t('reading.quiz.type.trueFalse')
      : currentQuestion.type === 'fillBlank'
        ? t('reading.quiz.type.fillBlank')
        : t('reading.quiz.type.multipleChoice')

    return (
      <section className="mx-auto max-w-4xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={backToReading}
            className={cn(
              'inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors',
              premium ? 'border-white/15 text-white/80 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
            )}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />{t('reading.backToText')}
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <SpeedTimer elapsedSeconds={elapsedSeconds} targetSeconds={speedTargetSeconds} premium={premium} />
            <span className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-extrabold', levelTone(selectedMaterial.level, premium))}>
              {selectedMaterial.level}<span className="opacity-60">·</span>{t('reading.quiz.step', { current: quizStep + 1, total: questions.length })}
            </span>
          </div>
        </div>

        <div className={cn('rounded-2xl border p-4 sm:p-5', premium ? 'border-white/10 bg-black/40 backdrop-blur-xl' : 'border-slate-200 bg-white shadow-sm')}>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className={cn('text-xs font-extrabold uppercase tracking-[.14em]', premium ? 'text-cyan-200' : 'text-teal-700')}>{t('reading.quiz.progressLabel')}</span>
            <span className={cn('text-xs font-black tabular-nums', premium ? 'text-white/75' : 'text-slate-600')}>{progressPercent}%</span>
          </div>
          <div role="progressbar" aria-label={t('reading.quiz.progressLabel')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercent} className={cn('h-2.5 overflow-hidden rounded-full', premium ? 'bg-white/10' : 'bg-slate-100')}>
            <div className={cn('h-full rounded-full transition-[width] duration-500 ease-out', premium ? 'bg-gradient-to-r from-cyan-400 to-teal-300 shadow-[0_0_14px_rgba(34,211,238,.45)]' : 'bg-gradient-to-r from-teal-600 to-cyan-500')} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <header className={cn('rounded-2xl border p-5 sm:p-6', surface)}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className={cn('text-xs font-extrabold uppercase tracking-[.16em]', premium ? 'text-yellow-200' : 'text-teal-700')}>{t('reading.quiz.eyebrow')}</p>
            <span className={cn('rounded-full border px-2.5 py-1 text-[10px] font-extrabold', premium ? 'border-cyan-200/20 bg-cyan-300/10 text-cyan-100' : 'border-teal-200 bg-teal-50 text-teal-800')}>{questionTypeLabel}</span>
          </div>
          <h1 className={cn('mt-2 text-2xl font-black tracking-tight sm:text-3xl', premium ? 'text-white' : 'text-slate-950')}>{t(selectedMaterial.titleKey)}</h1>
          <p className={cn('mt-2 text-sm leading-relaxed', muted)}>{t('reading.quiz.instructions', { count: questions.length })}</p>
          <p className={cn('mt-2 text-xs font-semibold', premium ? 'text-white/55' : 'text-slate-500')}>{t('reading.quiz.flawlessRule')}</p>
          <p className={cn('mt-2 text-xs font-semibold leading-relaxed', premium ? 'text-cyan-100/70' : 'text-teal-700')}>{t('reading.speed.hint', { minutes: selectedMaterial.timeToReadMinutes + 4, xp: SPEED_BONUS_XP })}</p>
        </header>

        <fieldset className={cn('rounded-2xl border p-4 sm:p-6', surface)}>
          <legend className="sr-only">{t(currentQuestion.questionKey)}</legend>
          <div className="flex items-start gap-3">
            <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl text-xs font-black', premium ? 'bg-white/10 text-yellow-100' : 'bg-teal-50 text-teal-800')}>
              {String(quizStep + 1).padStart(2, '0')}
            </span>
            <h2 className={cn('pt-1 text-base font-extrabold leading-relaxed sm:text-lg', premium ? 'text-white' : 'text-slate-900')}>
              {t(currentQuestion.questionKey)}
            </h2>
          </div>
          <div className="mt-5 grid gap-2.5 sm:ml-12">
            {currentQuestion.type === 'fillBlank' ? (
              <div>
                <input
                  type="text"
                  value={selectedAnswer}
                  onChange={(event) => setSelectedAnswer(event.target.value)}
                  disabled={Boolean(answerFeedback)}
                  aria-label={t(currentQuestion.questionKey)}
                  aria-describedby={`${currentQuestion.id}-fill-hint`}
                  aria-invalid={answerFeedback === 'incorrect'}
                  placeholder={t('reading.quiz.fillBlank.placeholder')}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className={cn(
                    'min-h-12 w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none transition focus:ring-4 disabled:opacity-75',
                    premium
                      ? 'border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-cyan-200/50 focus:ring-cyan-200/10'
                      : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-100',
                    answerFeedback === 'correct' && 'reading-quiz-option-correct',
                    answerFeedback === 'incorrect' && 'reading-quiz-option-wrong',
                  )}
                />
                <p id={`${currentQuestion.id}-fill-hint`} className={cn('mt-2 text-xs font-medium', muted)}>{t('reading.quiz.fillBlank.hint')}</p>
              </div>
            ) : currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer === option.id
              const isCorrectOption = answerFeedback === 'correct' && option.id === currentQuestion.correctAnswer
              const isWrongSelection = answerFeedback === 'incorrect' && isSelected
              return (
                <label
                  key={option.id}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3.5 text-sm leading-relaxed transition-all',
                    isCorrectOption
                      ? 'reading-quiz-option-correct'
                      : isWrongSelection
                        ? 'reading-quiz-option-wrong'
                        : isSelected
                          ? premium ? 'border-cyan-200/55 bg-cyan-300/10 text-white' : 'border-teal-400 bg-teal-50 text-teal-950'
                          : premium ? 'border-white/10 bg-white/[.025] text-white/80 hover:border-cyan-200/35 hover:bg-white/[.07]' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-300 hover:bg-white',
                    answerFeedback && 'cursor-default',
                  )}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option.id}
                    checked={isSelected}
                    disabled={Boolean(answerFeedback)}
                    onChange={() => setSelectedAnswer(option.id)}
                    className={cn('mt-1', premium ? 'accent-cyan-300' : 'accent-teal-700')}
                  />
                  {currentQuestion.type === 'multipleChoice' && <span className="grid size-6 shrink-0 place-items-center rounded-lg border border-current text-[10px] font-black">{option.id}</span>}
                  <span className="font-semibold">{t(option.textKey)}</span>
                  {isCorrectOption && <CheckCircle2 className="ml-auto size-5 shrink-0 text-emerald-500" aria-hidden="true" />}
                </label>
              )
            })}
          </div>
        </fieldset>

        {answerFeedback && (
          <div role="status" className={cn(
            'flex items-start gap-3 rounded-2xl border p-4 text-sm font-bold leading-relaxed',
            answerFeedback === 'correct' ? 'reading-quiz-option-correct' : 'reading-quiz-error',
          )}>
            {answerFeedback === 'correct' ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" aria-hidden="true" /> : <Sparkles className="mt-0.5 size-5 shrink-0 text-rose-500" aria-hidden="true" />}
            <span>{t(answerFeedback === 'correct' ? 'reading.quiz.feedback.correct' : 'reading.quiz.feedback.incorrect')}</span>
          </div>
        )}

        <div className={cn('sticky bottom-0 z-20 rounded-2xl border p-3 shadow-xl backdrop-blur-xl sm:p-4', premium ? 'border-white/10 bg-black/80' : 'border-slate-200 bg-white/95 dark:border-slate-700 dark:bg-slate-900/95')}>
          <div className="flex flex-wrap items-center justify-between gap-3 pr-20 sm:pr-24">
            <span className={cn('text-xs font-semibold sm:text-sm', muted)}>
              {answerFeedback === 'incorrect' ? t('reading.quiz.retryHint') : t('reading.quiz.answerStep', { current: quizStep + 1, total: questions.length })}
            </span>
            {answerFeedback === 'incorrect' ? (
              <div className="flex flex-wrap justify-end gap-2">
                <button type="button" onClick={retryQuestion} className={cn('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold transition hover:-translate-y-0.5', premium ? 'border border-white/15 bg-white/5 text-white hover:bg-white/10' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50')}>
                  <RotateCcw className="size-4" aria-hidden="true" />{t('reading.quiz.retryQuestion')}
                </button>
                <button type="button" onClick={skipQuestion} className={cn('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition hover:-translate-y-0.5', premium ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950' : 'bg-gradient-to-r from-teal-700 to-cyan-600 text-white')}>
                  {quizStep === questions.length - 1 ? t('reading.quiz.finish') : t('reading.quiz.skipQuestion')}
                  <ArrowLeft className="size-4 rotate-180" aria-hidden="true" />
                </button>
              </div>
            ) : answerFeedback === 'correct' ? (
              <button type="button" onClick={continueQuiz} className={cn('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition hover:-translate-y-0.5', premium ? 'bg-gradient-to-r from-cyan-300 to-teal-300 text-slate-950 shadow-[0_0_18px_rgba(34,211,238,.22)]' : 'bg-gradient-to-r from-teal-700 to-cyan-600 text-white shadow-lg')}>
                {quizStep === questions.length - 1 ? t('reading.quiz.finish') : t('reading.quiz.continue')}
                <Check className="size-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={checkCurrentAnswer}
                disabled={!String(selectedAnswer).trim()}
                className={cn(
                  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
                  premium ? 'bg-gradient-to-r from-cyan-300 to-teal-300 text-slate-950 shadow-[0_0_18px_rgba(34,211,238,.22)]' : 'bg-gradient-to-r from-teal-700 to-cyan-600 text-white shadow-lg',
                )}
              >
                <CheckCircle2 className="size-4" aria-hidden="true" />{t('reading.quiz.checkAnswer')}
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (view === 'reading' && selectedMaterial) {
    const isCompleted = completedIds.includes(selectedMaterial.id)
    const paragraphs = selectedMaterial.content.split(/\n\s*\n/u).filter(Boolean)

    return (
      <section className="mx-auto max-w-5xl pb-4">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={backToLibrary}
            className={cn(
              'inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors',
              premium ? 'border-white/15 text-white/80 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
            )}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />{t('reading.backLibrary')}
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn('rounded-full border px-3 py-1 text-xs font-extrabold', levelTone(selectedMaterial.level, premium))}>{selectedMaterial.level}</span>
            <span className={cn('rounded-full border px-3 py-1 text-xs font-bold', premium ? 'border-white/10 bg-white/5 text-white/70' : 'border-slate-200 bg-white text-slate-600')}>{t(selectedMaterial.categoryKey)}</span>
          </div>
        </div>

        <AudioPlayer key={selectedMaterial.id} text={selectedMaterial.content} premium={premium} />

        <div className={cn('rounded-3xl border', surface)}>
          <header className={cn('rounded-t-3xl border-b px-6 py-7 sm:px-10 sm:py-9', premium ? 'border-white/10 bg-black/20' : 'border-slate-100 bg-slate-50/70')}>
            <div className={cn('mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold', muted)}>
              <span className="inline-flex items-center gap-2"><Clock className="size-4" aria-hidden="true" />{t('reading.timeToRead', { minutes: selectedMaterial.timeToReadMinutes })}</span>
              <span className="inline-flex items-center gap-2"><Zap className="size-4 text-amber-500" aria-hidden="true" />{t('reading.xpReward', { xp: selectedMaterial.xpReward })}</span>
              <SpeedTimer elapsedSeconds={elapsedSeconds} targetSeconds={speedTargetSeconds} premium={premium} />
            </div>
            <h1 className={cn('text-2xl font-black leading-tight tracking-tight sm:text-4xl', premium ? 'text-white' : 'text-slate-950')}>{t(selectedMaterial.titleKey)}</h1>
            <p className={cn('mt-3 text-xs font-semibold leading-relaxed', muted)}>
              {t('reading.speed.hint', { minutes: selectedMaterial.timeToReadMinutes + 4, xp: SPEED_BONUS_XP })}
            </p>
          </header>
          <article className={cn('reading-prose prose prose-lg mx-auto max-w-3xl px-6 py-8 text-lg leading-relaxed sm:px-10 sm:py-12', premium ? 'reading-prose-premium' : 'reading-prose-default')}>
            {paragraphs.map((paragraph, index) => (
              <p key={`${selectedMaterial.id}-${index}`}>
                <InteractiveParagraph
                  text={paragraph}
                  glossary={selectedMaterial.glossary || []}
                  activeGlossId={activeGlossId}
                  setActiveGlossId={setActiveGlossId}
                  premium={premium}
                  materialId={selectedMaterial.id}
                  savedWordTerms={savedWordTerms}
                  onSaveWord={saveGlossaryWord}
                />
              </p>
            ))}
          </article>
        </div>

        <div className={cn('sticky bottom-0 z-20 mt-5 rounded-2xl border p-3 shadow-lg backdrop-blur-xl sm:p-4', premium ? 'border-white/10 bg-black/75' : 'border-slate-200 bg-white/95')}>
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
            <p className={cn('flex min-w-0 items-center gap-2 text-xs font-semibold sm:text-sm', muted)}>
              {isCompleted
                ? <><CheckCircle2 className="size-4 shrink-0 text-emerald-500" aria-hidden="true" />{t('reading.completed')}</>
                : <><Sparkles className={cn('size-4 shrink-0', premium ? 'text-yellow-200' : 'text-teal-600')} aria-hidden="true" />{t('reading.finishHint')}</>}
            </p>
            <button
              type="button"
              onClick={startQuiz}
              className={cn(
                'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4',
                premium ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 shadow-lg shadow-yellow-900/20 focus-visible:ring-yellow-200/30' : 'bg-gradient-to-r from-teal-700 to-cyan-600 text-white shadow-lg shadow-teal-900/15 focus-visible:ring-teal-500/25',
              )}
            >
              <BookOpenText className="size-4" aria-hidden="true" />
              {isCompleted ? t('reading.quiz.review') : t('reading.quiz.start')}
              {isCompleted ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px]">{selectedMaterial.questions.length}</span>}
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn(
      'mx-auto max-w-5xl space-y-7 rounded-3xl border p-4 pb-8 sm:p-6',
      premium ? 'border-white/10 bg-black/40 text-white shadow-xl shadow-black/15 backdrop-blur-xl' : 'border-slate-200 bg-white text-slate-900 shadow-sm',
    )}>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className={cn('mb-2 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em]', premium ? 'text-yellow-200' : 'text-teal-700')}>
            <BookOpenText className="size-4" aria-hidden="true" />{t('reading.eyebrow')}
          </div>
          <h1 className={cn('text-3xl font-black tracking-tight sm:text-4xl', premium ? 'text-white' : 'text-slate-950')}>{t('reading.title')}</h1>
          <p className={cn('mt-2 max-w-2xl text-sm leading-relaxed sm:text-base', muted)}>{t('reading.subtitle')}</p>
        </div>
        <span className={cn('rounded-full border px-3 py-1.5 text-xs font-bold', premium ? 'border-white/10 bg-white/5 text-white/75' : 'border-slate-200 bg-white text-slate-600')}>
          {t('reading.materialCount', { count: mockReadingMaterials.length })}
        </span>
      </header>

      <div className="relative space-y-8 pl-5 sm:pl-8">
        <div className={cn('absolute bottom-6 left-[7px] top-4 border-l-2 border-dashed sm:left-[11px]', premium ? 'border-yellow-200/20' : 'border-teal-200')} aria-hidden="true" />
        {READING_LEVELS.map((level, levelIndex) => {
          const materials = levelMaterials(level)
          const completedInLevel = materials.filter((material) => completedIds.includes(material.id)).length
          const isLevelComplete = materials.length > 0 && completedInLevel === materials.length
          return (
            <section key={level} className="relative">
              <span className={cn(
                'absolute -left-[25px] top-0 z-10 grid size-7 place-items-center rounded-full border-2 text-[10px] font-black shadow-sm sm:-left-[33px] sm:size-8',
                isLevelComplete
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : premium ? 'border-yellow-200/60 bg-[#281c05] text-yellow-100' : 'border-teal-500 bg-white text-teal-800',
              )} aria-hidden="true">
                {isLevelComplete ? <Check className="size-4" /> : levelIndex + 1}
              </span>

              <div className={cn('rounded-2xl border p-4 sm:p-5', surface)}>
                <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={cn('rounded-xl border px-3 py-1.5 text-sm font-black tracking-wide', levelTone(level, premium))}>{level}</span>
                    <div>
                      <h2 className={cn('font-extrabold', premium ? 'text-white' : 'text-slate-900')}>{t(`reading.level.${level}`)}</h2>
                      <p className={cn('mt-0.5 text-xs', muted)}>{t('reading.level.unlocked')}</p>
                    </div>
                  </div>
                  <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold tabular-nums', premium ? 'border-white/10 bg-white/5 text-white/75' : 'border-slate-200 bg-slate-50 text-slate-600')}>
                    {isLevelComplete && <CheckCircle2 className="size-3.5 text-emerald-500" aria-hidden="true" />}
                    {completedInLevel}/{materials.length} {t('reading.level.tasks')}
                  </span>
                </header>

                <div className="space-y-2.5">
                  {materials.map((material, taskIndex) => {
                    const completed = completedIds.includes(material.id)
                    return (
                      <button
                        key={material.id}
                        type="button"
                        onClick={() => openMaterial(material)}
                        className={cn(
                          'group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 hover:translate-x-1 hover:shadow-md sm:gap-4 sm:p-4',
                          premium ? 'border-white/10 bg-black/40 text-white hover:bg-black/50' : 'border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50/60',
                          completed && (premium ? 'border-emerald-300/30 shadow-emerald-300/5' : 'border-emerald-200 bg-emerald-50/40'),
                        )}
                        aria-label={t('reading.task.open', { title: t(material.titleKey), level: material.level })}
                      >
                        <span className={cn(
                          'grid size-10 shrink-0 place-items-center rounded-xl text-sm font-black',
                          completed
                            ? 'bg-emerald-500 text-white'
                            : premium ? 'bg-yellow-200/10 text-yellow-100' : 'bg-teal-50 text-teal-800',
                        )}>
                          {completed ? <CheckCircle2 className="size-5" aria-hidden="true" /> : `${levelIndex + 1}.${taskIndex + 1}`}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={cn('block font-extrabold leading-snug', premium ? 'text-white' : 'text-slate-900')}>{t(material.titleKey)}</span>
                          <span className={cn('mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold', muted)}>
                            <span className="inline-flex items-center gap-1"><Clock className="size-3.5" aria-hidden="true" />{t('reading.timeToRead', { minutes: material.timeToReadMinutes })}</span>
                            <span className="inline-flex items-center gap-1"><Zap className="size-3.5 text-amber-500" aria-hidden="true" />{t('reading.xpReward', { xp: material.xpReward })}</span>
                          </span>
                        </span>
                        {completed
                          ? <CheckCircle2 className="size-5 shrink-0 text-emerald-500" aria-label={t('reading.completed')} />
                          : <BookOpenText className={cn('size-5 shrink-0 transition-transform group-hover:translate-x-0.5', premium ? 'text-yellow-200' : 'text-teal-700')} aria-hidden="true" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <div className={cn('flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 sm:p-5', surface)}>
        <div>
          <h2 className={cn('font-extrabold', premium ? 'text-white' : 'text-slate-900')}>{t('reading.practice.title')}</h2>
          <p className={cn('mt-1 text-sm leading-relaxed', muted)}>{t('reading.practice.description')}</p>
        </div>
        <button
          type="button"
          onClick={() => { setSelectedId(null); setView('practice'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className={cn(
            'inline-flex min-h-10 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-extrabold transition-colors',
            premium ? 'border-yellow-200/25 bg-white/5 text-yellow-100 hover:bg-white/10' : 'border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100',
          )}
        >
          {t('reading.practice.open')}<ArrowLeft className="size-4 rotate-180" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
