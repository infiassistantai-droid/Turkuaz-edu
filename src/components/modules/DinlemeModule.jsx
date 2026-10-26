import { useEffect, useRef, useState } from 'react'
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Sparkles,
  Trophy,
  Gauge,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import { listeningTracks } from '../../data/mockExamData'
import { cn, formatTime } from '../../lib/utils'
import { saveScore, loadScores } from '../../lib/storage'

const SPEEDS = [0.75, 1, 1.25]

// Turkish idioms in the transcript — bolded in the text + meanings below
const TR_IDIOMS = [
  { tr: 'bir araya gelip', uz: 'birga yigʻilib' },
  { tr: 'fikirlerini paylaşıyorlar', uz: 'fikrlarini almashadilar' },
  { tr: 'okuma ilgileri', uz: 'oʻqish qiziqishlari' },
  { tr: 'düşünme becerileri', uz: 'fikrlash qobiliyatlari' },
  { tr: 'daha samimi hale gelmiştir', uz: 'ancha samimiy boʻlib qolgan' },
  { tr: 'benzer projeler', uz: 'oʻxshash loyihalar' },
]

function renderIdiomText(text) {
  const sorted = [...TR_IDIOMS].sort((a, b) => b.tr.length - a.tr.length)
  const escaped = sorted.map((k) => k.tr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const parts = text.split(new RegExp(`(${escaped.join('|')})(?![a-zçğıöşü])`, 'gi'))
  return parts
    .filter(Boolean)
    .map((part, i) => {
      const idiom = sorted.find((k) => k.tr.toLowerCase() === part.toLowerCase())
      if (!idiom) return <span key={i}>{part}</span>
      return (
        <strong
          key={i}
          className="rounded bg-cyan-100 px-1 font-extrabold text-teal-800 dark:bg-cyan-500/10 dark:text-teal-300"
        >
          {part}
        </strong>
      )
    })
}

export default function DinlemeModule({ completeLevel }) {
  const track = listeningTracks[0]
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [showTranscript, setShowTranscript] = useState(false)
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState(false)
  const [best, setBest] = useState(() => loadScores().dinleme?.best || 0)
  const timerRef = useRef(null)
  const barRef = useRef(null)

  // simulated playback ticker
  useEffect(() => {
    if (!playing) return undefined
    timerRef.current = setInterval(() => {
      setElapsed((t) => Math.min(track.duration, t + 0.1 * speed))
    }, 100)
    return () => clearInterval(timerRef.current)
  }, [playing, speed, track.duration])

  const isFinished = elapsed >= track.duration
  const progressPct = Math.round((elapsed / track.duration) * 100)

  function togglePlay() {
    if (isFinished) {
      setElapsed(0)
      setPlaying(true)
      return
    }
    setPlaying((p) => !p)
  }

  function replay() {
    setElapsed(0)
    setPlaying(true)
  }

  // click the progress bar to seek
  function seek(e) {
    const rect = barRef.current.getBoundingClientRect()
    const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    setElapsed(frac * track.duration)
  }

  function skip(seconds) {
    setElapsed((t) => Math.min(track.duration, Math.max(0, t + seconds)))
  }

  function reveal() {
    setRevealed(true)
    const correctCount = track.questions.filter((q) => answers[q.id] === q.answer).length
    const pct = track.questions.length ? Math.round((correctCount / track.questions.length) * 100) : 0
    const saved = saveScore('dinleme', { best: pct, attempts: 1 })
    setBest(saved.best)
    completeLevel()
  }

  const answeredCount = Object.values(answers).filter(
    (v) => v !== undefined && v !== '' && v !== null,
  ).length
  const correctCount = revealed ? track.questions.filter((q) => answers[q.id] === q.answer).length : 0
  const pct = track.questions.length ? Math.round((correctCount / track.questions.length) * 100) : 0
  const summaryTone =
    pct === 100
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/10 dark:text-emerald-300'
      : pct >= 50
        ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/10 dark:text-amber-300'
        : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-500/10 dark:text-rose-300'

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex flex-wrap items-center gap-2">
          <Headphones className="h-5 w-5 text-teal-700 dark:text-teal-400" />
          <h1 className="font-display text-xl font-extrabold text-slate-800 dark:text-white">
            Tinglash module — Audio Studio
          </h1>
          <span className="rounded-lg bg-teal-50 px-2 py-1 text-[11px] font-bold tracking-wider text-teal-700 dark:bg-cyan-500/10 dark:text-teal-300">
            {track.level}
          </span>
          <span className="ml-auto text-xs font-bold text-slate-400 dark:text-slate-500">
            {formatTime(track.duration)}
          </span>
        </div>
        <h2 className="mt-1 font-display text-base font-extrabold text-slate-800 dark:text-white">
          {track.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Tinglang, qayta-qayta tinglang: surʼatni sozlang, -5s / +5s tugmasi bilan orqaga /
          oldiga oʻting. Audio tugab boʻlgandan soʻng savollarga javob bering.
        </p>
      </div>

      {/* Audio studio card */}
      <div className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-teal-50 p-5 shadow-sm dark:border-cyan-900/30 dark:from-cyan-950/40 dark:to-teal-950/40">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          {/* play button */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? 'Toʻxtatish' : 'Qiloʻqish'}
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-xl shadow-teal-900/25 transition-all active:scale-95 hover:from-teal-700 hover:to-cyan-600 active:scale-95"
          >
            {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 fill-current" />}
          </button>

          {/* waveform + progress */}
          <div className="flex-1">
            {/* animated waveform while playing */}
            <div className="flex h-16 items-center gap-[3px]">
              {Array.from({ length: 48 }, (_, i) => {
                const h = 10 + Math.abs(Math.sin(i * 1.7)) * 18
                const played = (i / 48) * 100 <= progressPct
                return (
                  <span
                    key={i}
                    className={cn(
                      'w-[4px] shrink-0 rounded-full',
                      playing ? 'animate-[wave_1s_ease-in-out_infinite]' : 'opacity-60',
                      played
                        ? 'bg-teal-500 dark:bg-teal-300'
                        : 'bg-slate-300 dark:bg-slate-600',
                    )}
                    style={{ height: h, animationDelay: `${(i % 8) * 0.09}s` }}
                  />
                )
              })}
            </div>

            {/* seekable progress bar */}
            <div
              ref={barRef}
              onClick={seek}
              className="group relative mt-3 h-3 cursor-pointer rounded-full bg-slate-200 dark:bg-slate-700"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 pbar"
                style={{ width: `${progressPct}%` }}
              />
              <div
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover:opacity-100"
                style={{ left: `${progressPct}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="tabular-nums">{formatTime(Math.round(elapsed))}</span>
              <span className="tabular-nums">{formatTime(track.duration)}</span>
            </div>
          </div>
        </div>

        {/* studio controls */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* skip -5s / +5s */}
          <button
            type="button"
            onClick={() => skip(-5)}
            aria-label="5 sekund orqaga"
            className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200 transition-all active:scale-95 hover:text-teal-700 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
          >
            <SkipBack className="h-3.5 w-3.5" />
            -5s
          </button>
          <button
            type="button"
            onClick={() => skip(5)}
            aria-label="5 sekund oldiga"
            className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200 transition-all active:scale-95 hover:text-teal-700 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
          >
            <SkipForward className="h-3.5 w-3.5" />
            +5s
          </button>

          {/* speed 0.75x / 1x / 1.25x */}
          <span className="ml-2 flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500">
            <Gauge className="h-4 w-4" />
            Surʼat:
          </span>
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={cn(
                'rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all active:scale-95',
                speed === s
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-teal-700 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700',
              )}
            >
              {s === 1 ? '1.0×' : `${s}×`}
            </button>
          ))}
          <button
            type="button"
            onClick={replay}
            className="ml-auto flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-500 ring-1 ring-slate-200 transition-all active:scale-95 hover:text-teal-700 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Takrorlash
          </button>
        </div>

        {isFinished && (
          <div className="mt-3 rounded-xl bg-cyan-100 p-3 text-sm font-bold text-teal-700 dark:bg-cyan-500/10 dark:text-teal-300">
            ✅ Audio tugab boʻldi — savollarga oʻtish mumkin.
          </div>
        )}
      </div>

      {/* Audio matni (Transkript) accordion */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
        <button
          type="button"
          onClick={() => setShowTranscript((s) => !s)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <span className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
            <FileText className="h-5 w-5 text-teal-700 dark:text-teal-400" />
            Audio matni (Transkript) — {showTranscript ? 'Yashirish' : 'Koʻrsatish'}
          </span>
          {showTranscript ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </button>
        {showTranscript && (
          <div className="space-y-5 border-t border-slate-100 px-5 py-4 dark:border-slate-800">
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">
                Turkish (iboralar qalin)
              </h4>
              <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                {renderIdiomText(track.transcript.tr)}
              </p>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">
                Oʻzbek tarjimasi
              </h4>
              <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                {track.transcript.uz}
              </p>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Turkcha iboralar — maʼnolar
              </h4>
              <ul className="grid gap-2 sm:grid-cols-2">
                {TR_IDIOMS.map((idm) => (
                  <li
                    key={idm.tr}
                    className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:ring-slate-700"
                  >
                    <b className="text-teal-700 dark:text-teal-300">{idm.tr}</b> — {idm.uz}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {track.questions.map((q, idx) => {
          const answered = answers[q.id] !== undefined
          return (
            <div
              key={q.id}
              className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-teal-50 font-bold text-teal-700 dark:bg-cyan-500/10 dark:text-teal-300">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 dark:text-white">{q.question}</h3>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {q.options.map((opt, oi) => {
                      const isCorrectOpt = revealed && oi === q.answer
                      const isWrongPick = revealed && answers[q.id] === oi && oi !== q.answer
                      return (
                        <button
                          key={oi}
                          type="button"
                          disabled={revealed}
                          onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                          className={cn(
                            'flex items-start gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all active:scale-95',
                            isCorrectOpt
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                              : isWrongPick
                                ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                                : answered && answers[q.id] === oi
                                  ? 'border-cyan-500 bg-teal-50 text-teal-700 dark:bg-cyan-500/10 dark:text-teal-300'
                                  : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-cyan-300 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300',
                          )}
                        >
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 text-[10px] font-bold">
                            {isCorrectOpt ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : isWrongPick ? (
                              <XCircle className="h-4 w-4 text-rose-600" />
                            ) : (
                              String.fromCharCode(65 + oi)
                            )}
                          </span>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  {revealed && (
                    <div className="mt-3 space-y-2">
                      {answers[q.id] === q.answer ? (
                        <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                          Toʻgʻri javob!
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          {answers[q.id] !== undefined ? 'Yalnish qildingiz.' : 'Javob berilmagan.'}
                        </div>
                      )}
                      <div className="overflow-hidden rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-teal-700 dark:text-teal-400">
                          <Sparkles className="h-3.5 w-3.5" />
                          Izoh
                        </div>
                        <p
                          className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400"
                          dangerouslySetInnerHTML={{ __html: q.explanation }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Result summary — revealed after checking answers */}
      {revealed && (
        <div className={cn('animate-fadein rounded-2xl border p-4', summaryTone)}>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            <div className="text-sm font-extrabold">
              Natija: {correctCount}/{track.questions.length} toʻgʻri javob ({pct}%)
            </div>
          </div>
          <p className="mt-1 text-xs font-semibold">
            {pct === 100
              ? 'Ajoyib! Barcha savollar toʻgʻri — module yakunlandi.'
              : pct >= 50
                ? 'Yaxshi natija! Izohlarni oʻqib, xato ustida ishlang.'
                : 'Qayta tinglang, izohlarga eʼtibor bering.'}
          </p>
          {best > 0 && (
            <p className="mt-1 text-[11px] font-bold opacity-80">Eng yaxshi natija: {best}%</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={reveal}
          disabled={answeredCount < track.questions.length}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-all active:scale-95 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-700"
        >
          <Sparkles className="h-4 w-4" />
          Javoblarni tekshirish · {answeredCount}/{track.questions.length}
        </button>
        {revealed && (
          <span className="flex items-center gap-2 rounded-xl bg-amber-100 px-3 py-2.5 text-sm font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            <Trophy className="h-4 w-4" />
            Module yakunlandi · +50 XP!
          </span>
        )}
      </div>
    </div>
  )
}
