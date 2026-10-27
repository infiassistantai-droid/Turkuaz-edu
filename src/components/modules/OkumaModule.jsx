import { useMemo, useState } from 'react'
import {
  BookOpenText,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { readingPassages } from '../../data/mockExamData'
import { cn } from '../../lib/utils'
import { saveScore, loadScores } from '../../lib/storage'

// Turkish keywords with Uzbek meanings — highlighted chips inside the passage
const KEYWORDS = [
  { tr: 'vazgeçilmez', uz: 'ajralmas, muhim' },
  { tr: 'sosyal yaşam', uz: 'ijtimoiy hayot' },
  { tr: 'bağları güçlendirir', uz: 'bogʻlarni kuchaytiradi' },
  { tr: 'servis edilir', uz: 'xizmat qilinadi' },
  { tr: 'duraksamasına', uz: 'toʻxtab qolishiga' },
  { tr: 'hasat zamanı', uz: 'oʻrim payti' },
  { tr: 'aksinine', uz: 'aksincha' },
  { tr: 'hareketli noktaları', uz: 'faol nuqtalari' },
  { tr: 'anlamını yitirir', uz: 'maʼnosini yoʻqotadi' },
  { tr: 'yargılara yol açabilir', uz: 'hukm chiqarishga yoʻl ochishi mumkin' },
  { tr: 'karşılıklı mesajlar', uz: 'oʻzaro xabarlar' },
  { tr: 'dürüst', uz: 'halol, chinakam' },
  { tr: 'nazik', uz: 'muloyim' },
  { tr: 'dijital ortam', uz: 'raqamli muhit' },
  { tr: 'samimi', uz: 'samimiy' },
  { tr: 'düşünceli', uz: 'oʻylab qilingan' },
  { tr: 'kültürümüzün', uz: 'madaniyatimizning' },
  { tr: 'insanî bağlar', uz: 'insoniy bogʻlanishlar' },
  { tr: 'gözlem yeteneği', uz: 'kuzatuv qobiliyati' },
  { tr: 'avantaj', uz: 'afzallik' },
  { tr: 'zorluklardan', uz: 'qiyinchiliklardan' },
  { tr: 'sürdürebilir', uz: 'barqaror, davamli' },
]

// ---------------------------------------------------------------------
// Keyword tokenizer — splits paragraph text and wraps keyword matches
// in interactive chips (hover tooltip / click to pin).
// ---------------------------------------------------------------------
function renderPassageText(text, pinned, onTogglePin) {
  const sorted = [...KEYWORDS].sort((a, b) => b.tr.length - a.tr.length)
  const escaped = sorted.map((k) => k.tr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const parts = text.split(new RegExp(`(${escaped.join('|')})(?![a-zçğıöşü])`, 'gi'))
  return parts
    .filter(Boolean)
    .map((part, i) => {
      const key = sorted.find((k) => k.tr.toLowerCase() === part.toLowerCase())
      if (!key) return <span key={i}>{part}</span>
      return <KeywordChip key={i} kw={key} pinned={pinned === key.tr} onTogglePin={onTogglePin} />
    })
}

function KeywordChip({ kw, pinned, onTogglePin }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onTogglePin(kw.tr)
      }}
      className={cn(
        'group/kw relative z-10 inline rounded px-0.5 py-0 font-semibold text-teal-700 underline decoration-dotted underline-offset-3 transition-all active:scale-95 hover:bg-teal-100 dark:text-teal-300 dark:hover:bg-teal-950/60',
        pinned && 'bg-teal-100 dark:bg-teal-500/10',
      )}
    >
      {kw.tr}
      <span
        className={cn(
          'pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 w-max max-w-[230px] -translate-x-1/2 whitespace-normal rounded-xl bg-slate-900 px-3 py-2 text-left text-xs font-semibold leading-snug text-white shadow-xl opacity-0 transition-opacity duration-150 group-hover/kw:opacity-100 dark:bg-slate-700',
          pinned && 'animate-tooltip opacity-100',
        )}
      >
        <span className="block text-[10px] font-bold uppercase tracking-widest text-white/60">
          Uzbekcha
        </span>
        {kw.uz}
      </span>
    </button>
  )
}

function levelStyle(level) {
  if (level === 'C1') return 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300'
  if (level === 'B2') return 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300'
  return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
}

export default function OkumaModule({ completeLevel }) {
  const [passageId, setPassageId] = useState(readingPassages[0].id)
  const passage = useMemo(
    () => readingPassages.find((p) => p.id === passageId) || readingPassages[0],
    [passageId],
  )
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState({})
  const [fontSize, setFontSize] = useState(15)
  const [pinned, setPinned] = useState(null)
  const [best, setBest] = useState(() => loadScores().okuma?.best || 0)

  const answeredCount = Object.values(answers).filter(
    (v) => v !== undefined && v !== '' && v !== null,
  ).length
  const revealedNow = revealed[passage.id] === 'done'
  const isComplete = revealedNow

  const estMin = Math.max(1, Math.round(passage.words / 130))

  function isCorrect(q) {
    if (q.type === 'bool') return answers[q.id] === q.answer
    if (q.type === 'choice') return answers[q.id] === q.answer
    return (answers[q.id] || '').trim().length > 0
  }

  const correctCount = revealedNow ? passage.questions.filter(isCorrect).length : 0
  const pct = passage.questions.length
    ? Math.round((correctCount / passage.questions.length) * 100)
    : 0
  const summaryTone =
    pct === 100
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-500/10 dark:text-emerald-300'
      : pct >= 50
        ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/10 dark:text-amber-300'
        : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-500/10 dark:text-rose-300'

  function selectPassage(id) {
    setPassageId(id)
    setAnswers({})
    setRevealed({})
    setPinned(null)
  }

  function reveal() {
    if (revealedNow || answeredCount < passage.questions.length) return
    const next = { ...revealed }
    next[passage.id] = 'done'
    setRevealed(next)
    const correct = passage.questions.filter(isCorrect).length
    const modulePct = passage.questions.length ? Math.round((correct / passage.questions.length) * 100) : 0
    const saved = saveScore('okuma', { best: modulePct, attempts: 1 })
    setBest(saved.best)
    completeLevel(saved.best)
  }

  function reset() {
    setAnswers({})
    setRevealed({})
    setPinned(null)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex flex-wrap items-center gap-2">
          <BookOpenText className="h-5 w-5 text-teal-700 dark:text-teal-400" />
          <h1 className="font-display text-xl font-extrabold text-slate-800 dark:text-white">
            Oʻqish module — Milliy Sertifikat imtihoni uslubida
          </h1>
          <span
            className={cn(
              'rounded-lg px-2 py-1 text-[11px] font-bold tracking-wider',
              levelStyle(passage.level),
            )}
          >
            {passage.level}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Milliy Sertifikat imtihoni: sol tomonda matn, oʻng tomonda savollar. Kalit soʻzlarni bosing —
          Uzbekcha izoh paydo boʻladi. Barcha savollarga javob berib «Javoblarni tekshirish»ni bosing.
        </p>
      </div>

      {/* Passage switcher */}
      <div className="flex flex-wrap gap-2">
        {readingPassages.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => selectPassage(p.id)}
            className={cn(
              'rounded-xl px-3 py-2 text-sm font-bold transition-all',
              p.id === passageId
                ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-900/20'
                : 'border border-slate-200/80 bg-white text-slate-500 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {p.title.split(':')[0]} · {p.level}
          </button>
        ))}
      </div>

      {/* Split-screen grid */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Left pane — sticky reading surface */}
        <section className="lg:sticky lg:top-[88px] lg:h-[calc(100vh-110px)] lg:overflow-y-auto">
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4 dark:border-slate-800">
              <span
                className={cn(
                  'rounded-lg px-2 py-0.5 text-[11px] font-bold tracking-wider',
                  levelStyle(passage.level),
                )}
              >
                {passage.level}
              </span>
              <h2 className="min-w-0 flex-1 font-display text-base font-extrabold leading-tight text-slate-800 dark:text-white">
                {passage.title}
              </h2>
            </div>

            {/* Toolbar — font-size + reading estimate */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500">
                <Clock className="h-4 w-4" />
                ~{estMin} daqiqa · {passage.words} soʻz
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFontSize((s) => Math.max(12, s - 1.5))}
                  aria-label="Kattalikni kamaytirish"
                  className="grid h-7 w-9 place-items-center rounded-lg border border-slate-200/80 font-bold text-slate-600 transition-all active:scale-95 hover:border-teal-400 hover:text-teal-700 dark:border-slate-800 dark:text-slate-300"
                >
                  A-
                </button>
                <span className="w-9 text-center text-xs font-bold tabular-nums text-slate-400 dark:text-slate-500">
                  {fontSize.toFixed(1)}
                </span>
                <button
                  type="button"
                  onClick={() => setFontSize((s) => Math.min(22, s + 1.5))}
                  aria-label="Kattalikni oshirish"
                  className="grid h-7 w-9 place-items-center rounded-lg border border-slate-200/80 font-bold text-slate-600 transition-all active:scale-95 hover:border-teal-400 hover:text-teal-700 dark:border-slate-800 dark:text-slate-300"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Reading text */}
            <div className="space-y-4 p-4" style={{ fontSize: `${fontSize}px` }}>
              {passage.paragraphs.map((para, i) => (
                <p key={i} className="leading-[1.75] text-slate-600 dark:text-slate-300">
                  <span className="mr-2 select-none font-bold text-teal-700 dark:text-teal-400">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {renderPassageText(para, pinned, setPinned)}
                </p>
              ))}
              <p className="pt-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                💡 Izlangan soʻzlarni bosing yoki ustiga olib boring — Uzbekcha
                tarjima chiqadi.
              </p>
            </div>
          </div>
        </section>

        {/* Right pane — questions */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 px-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Savol va javoblar · radio tanlash (A/B/C/D)
            </span>
            {revealedNow && (
              <span
                className={cn(
                  'ml-auto rounded-lg px-2 py-1 text-xs font-extrabold',
                  summaryTone,
                )}
              >
                {correctCount}/{passage.questions.length} toʻgʻri · {pct}%
              </span>
            )}
          </div>

          {revealedNow && (
            <div className={cn('animate-fadein rounded-2xl border p-4', summaryTone)}>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                <div className="text-sm font-extrabold">
                  Natija: {correctCount}/{passage.questions.length} toʻgʻri javob ({pct}%)
                </div>
              </div>
              <p className="mt-1 text-xs font-semibold">
                {pct === 100
                  ? 'Ajoyib! Barcha savollar toʻgʻri — module yakunlandi.'
                  : pct >= 50
                    ? 'Yaxshi natija! Izohlarni oʻqib, xato ustida ishlang.'
                    : 'Qayta oʻqib, izohlarga eʼtibor bering.'}
              </p>
              <p className="mt-1 text-[11px] font-bold opacity-80">Eng yaxshi natija: {best}%</p>
            </div>
          )}

          {passage.questions.map((q, idx) => {
            const answered = answers[q.id] !== undefined && answers[q.id] !== ''
            return (
              <div
                key={q.id}
                className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-teal-50 font-bold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-white">{q.question}</h3>

                    {/* Type: choice — radio options A/B/C/D */}
                    {q.type === 'choice' && (
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {q.options.map((opt, oi) => {
                          const isCorrectOpt = revealedNow && oi === q.answer
                          const isWrongPick =
                            revealedNow && answers[q.id] === oi && oi !== q.answer
                          return (
                            <button
                              key={oi}
                              type="button"
                              disabled={revealedNow}
                              onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                              className={cn(
                                'flex items-start gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all active:scale-95',
                                isCorrectOpt
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                                  : isWrongPick
                                    ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                                    : answered && answers[q.id] === oi
                                      ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300'
                                      : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300',
                              )}
                            >
                              <span
                                className={cn(
                                  'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 text-[10px] font-bold',
                                  isCorrectOpt
                                    ? 'border-emerald-500'
                                    : isWrongPick
                                      ? 'border-rose-500'
                                      : 'border-slate-300 dark:border-slate-600',
                                )}
                              >
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
                    )}

                    {/* Type: bool — TO'G'RI / YALGI'N */}
                    {q.type === 'bool' && (
                      <div className="mt-3 flex gap-2">
                        {['true', 'false'].map((b) => {
                          const val = b === 'true'
                          const isCorrectBtn = revealedNow && q.answer === val
                          const isWrongPick =
                            revealedNow && answers[q.id] === val && q.answer !== val
                          return (
                            <button
                              key={b}
                              type="button"
                              disabled={revealedNow}
                              onClick={() => setAnswers((a) => ({ ...a, [q.id]: val }))}
                              className={cn(
                                'flex-1 rounded-xl px-3 py-2.5 text-sm font-bold transition-all active:scale-95',
                                isCorrectBtn
                                  ? 'bg-emerald-600 text-white'
                                  : isWrongPick
                                    ? 'bg-rose-500 text-white'
                                    : answered && answers[q.id] === val
                                      ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white'
                                      : 'border border-slate-300 bg-slate-50 text-slate-500 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300',
                              )}
                            >
                              {val ? 'TOʻGʻRI' : 'YALĢIN'}
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* Type: text */}
                    {q.type === 'text' && (
                      <input
                        type="text"
                        value={answers[q.id] || ''}
                        disabled={revealedNow}
                        onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                        placeholder="Javobingizni yozing…"
                        className="mt-3 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white"
                      />
                    )}

                    {/* Revealed: verdict + Izoh box */}
                    {revealedNow && (
                      <div className="mt-3 space-y-2">
                        <div
                          className={cn(
                            'flex items-start gap-2 rounded-xl p-3 text-sm font-bold',
                            isCorrect(q)
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200',
                          )}
                        >
                          {isCorrect(q) ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                          ) : (
                            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                          )}
                          <span>
                            {q.type === 'text'
                              ? 'Javob berilgan — model javobni solishtiring.'
                              : isCorrect(q)
                                ? 'Toʻgʻri!'
                                : 'Yana bir bor oʻylab koʻring — Izohga eʼtibor bering.'}
                          </span>
                        </div>

                        {q.type === 'text' && (
                          <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
                            <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                              Model javob
                            </div>
                            <p className="mt-0.5 text-[13px] font-semibold text-slate-700 dark:text-slate-200">
                              {q.answer}
                            </p>
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
        </section>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={reveal}
          disabled={revealedNow || answeredCount < passage.questions.length}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-all active:scale-95 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-700"
        >
          <Sparkles className="h-4 w-4" />
          Javoblarni tekshirish · {answeredCount}/{passage.questions.length}
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-bold text-slate-500 transition-all active:scale-95 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-teal-300"
        >
          <RotateCcw className="h-4 w-4" />
          Takrorlash
        </button>
        {isComplete && (
          <span className="flex items-center gap-2 rounded-xl bg-amber-100 px-3 py-2.5 text-sm font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            <Trophy className="h-4 w-4" />
            Module yakunlandi · +50 XP!
          </span>
        )}
      </div>
    </div>
  )
}
