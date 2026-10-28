import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpenText, Clock3, Flag, RotateCcw, Sparkles, Trophy } from 'lucide-react'
import { readingMockExam, readingQuestions, type ReadingPart } from '../data/mockExamData.ts'
import { scoreReadingMock } from '../lib/readingMockScoring'
import { cn } from '../lib/utils'

type ReadingMockResult = ReturnType<typeof scoreReadingMock> & {
  section: 'okuma'
  testType: 'reading-only'
  examId: string
  completedAt: string
  earnedXp: number
  answered: number
  totalQuestions: 35
  partResults: Array<{ partId: string; title: string; rawScore: number; maxRawScore: number }>
}

type MockExamProps = {
  onComplete?: (result: ReadingMockResult) => void
  onExit?: () => void
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

function levelStyle(level: ReadingMockResult['level']) {
  if (level === 'C1') return 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100'
  if (level === 'B2') return 'border-teal-300/40 bg-teal-400/10 text-teal-100'
  if (level === 'B1') return 'border-amber-300/50 bg-amber-400/10 text-amber-100'
  return 'border-slate-300/30 bg-slate-400/10 text-slate-100'
}

function Stimulus({ part }: { part: ReadingPart }) {
  return (
    <section className="glass premium-glass rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-7">
      <div className="mb-4 flex items-center gap-2 text-amber-600 dark:text-amber-300">
        <BookOpenText className="size-4" aria-hidden="true" />
        <h2 className="text-sm font-bold uppercase tracking-wide">{part.stimulusTitle}</h2>
      </div>
      {part.passage && <p className="whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-200 sm:text-[15px]">{part.passage}</p>}
      {part.wordBank && (
        <div className="mt-5 rounded-2xl border border-amber-300/40 bg-amber-50/80 p-4 dark:border-amber-300/25 dark:bg-black/25">
          <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-200">Kelime havuzu · A–G</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {part.wordBank.map((option) => <div key={option.id} className="rounded-lg border border-amber-200/70 bg-white/70 px-3 py-2 text-sm text-slate-800 dark:border-amber-200/20 dark:bg-white/5 dark:text-white"><span className="mr-2 font-extrabold text-amber-700 dark:text-amber-200">{option.id}.</span>{option.label}</div>)}
          </div>
        </div>
      )}
      {part.paragraphs && (
        <div className="space-y-3">
          {part.paragraphs.map(({ label, text }) => <article key={label} className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-700/70 dark:bg-black/20"><span className="mb-2 inline-grid size-7 place-items-center rounded-lg bg-amber-100 text-xs font-extrabold text-amber-900 dark:bg-amber-300/15 dark:text-amber-100">{label}</span><p className="text-sm leading-7 text-slate-700 dark:text-slate-200">{text}</p></article>)}
        </div>
      )}
    </section>
  )
}

export default function MockExam({ onComplete, onExit }: MockExamProps) {
  const [view, setView] = useState<'intro' | 'exam' | 'results'>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [secondsLeft, setSecondsLeft] = useState(readingMockExam.durationMinutes * 60)
  const [result, setResult] = useState<ReadingMockResult | null>(null)
  const submittedRef = useRef(false)
  const questions = useMemo(() => readingQuestions, [])
  const currentQuestion = questions[questionIndex]
  const currentPart = readingMockExam.parts.find((part) => part.id === currentQuestion?.partId)
  const answeredCount = Object.values(answers).filter(Boolean).length
  const remainingCount = questions.length - answeredCount
  const usedMatchingAnswers = new Set(
    currentPart?.questions.filter((question) => question.id !== currentQuestion?.id).map((question) => answers[question.id]).filter(Boolean) ?? [],
  )

  function finishExam() {
    if (submittedRef.current) return
    submittedRef.current = true
    const rawScore = questions.reduce((sum, question) => sum + (answers[question.id] === question.correctAnswer ? 1 : 0), 0)
    const scored = scoreReadingMock(rawScore)
    const partResults = readingMockExam.parts.map((part) => ({
      partId: part.id,
      title: part.title,
      rawScore: part.questions.reduce((sum, question) => sum + (answers[question.id] === question.correctAnswer ? 1 : 0), 0),
      maxRawScore: part.questions.length,
    }))
    const completed: ReadingMockResult = {
      ...scored,
      section: 'okuma',
      testType: 'reading-only',
      examId: `${readingMockExam.id}-${Date.now()}`,
      completedAt: new Date().toISOString(),
      earnedXp: Math.round(scored.scaledScore),
      answered: answeredCount,
      totalQuestions: questions.length,
      partResults,
    }
    setResult(completed)
    setView('results')
    onComplete?.(completed)
  }

  useEffect(() => {
    if (view !== 'exam') return undefined
    const timer = window.setInterval(() => setSecondsLeft((time) => Math.max(0, time - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [view])

  useEffect(() => {
    if (view === 'exam' && secondsLeft === 0) finishExam()
  }, [view, secondsLeft])

  function startExam() {
    submittedRef.current = false
    setAnswers({})
    setQuestionIndex(0)
    setSecondsLeft(readingMockExam.durationMinutes * 60)
    setResult(null)
    setView('exam')
  }

  function submitWithConfirmation() {
    if (remainingCount > 0 && !window.confirm(`${remainingCount} soru boş. Boş yanıtlar yanlış sayılacak. Sınavı bitirmek istiyor musunuz?`)) return
    finishExam()
  }

  if (view === 'intro') {
    return (
      <div className="mx-auto max-w-5xl space-y-5">
        <section className="premium-hero relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-500 p-6 text-white shadow-xl sm:p-9">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold ring-1 ring-white/20"><Sparkles className="size-4" /> MULTILEVEL · OKUMA</div>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Türkçe Okuma Denemesi</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85">B1–C1 düzeylerinde beş bölüm ve 35 soru. Metinleri inceleyin, yanıtlarınızı kaydedin ve süre bitmeden sınavı tamamlayın.</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-white/90"><span className="rounded-lg border border-white/20 bg-black/15 px-3 py-2">60 dakika</span><span className="rounded-lg border border-white/20 bg-black/15 px-3 py-2">35 soru</span><span className="rounded-lg border border-white/20 bg-black/15 px-3 py-2">5 farklı soru türü</span></div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={startExam} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-teal-900 shadow-lg transition hover:bg-amber-50"><BookOpenText className="size-4" />Sınava başla</button>
              {onExit && <button type="button" onClick={onExit} className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-black/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"><ArrowLeft className="size-4" />Mock menüsüne dön</button>}
            </div>
          </div>
        </section>
        <div className="grid gap-3 sm:grid-cols-5">
          {readingMockExam.parts.map((part) => <article key={part.id} className="glass premium-glass rounded-2xl border border-slate-200 bg-white/85 p-4 dark:border-slate-800 dark:bg-slate-900/85"><p className="text-[11px] font-extrabold text-amber-700 dark:text-amber-200">{part.questions.length} soru</p><h2 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{part.title.replace(/^Bölüm \d+ · /u, '')}</h2></article>)}
        </div>
      </div>
    )
  }

  if (view === 'results' && result) {
    return (
      <div className="mx-auto max-w-4xl space-y-5">
        <section className="premium-hero rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-500 p-6 text-white shadow-xl sm:p-9">
          <div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25"><Trophy className="size-6" /></span><div><p className="text-sm text-white/75">Okuma denemesi tamamlandı</p><h1 className="text-2xl font-extrabold">Sonuçların</h1></div></div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/20 bg-black/20 p-4"><p className="text-xs text-white/75">Ham puan</p><p className="mt-1 text-3xl font-extrabold tabular-nums">{result.rawScore}<span className="text-base font-medium text-white/65"> / 35</span></p></div>
            <div className="rounded-2xl border border-white/20 bg-black/20 p-4"><p className="text-xs text-white/75">Ölçeklenmiş puan</p><p className="mt-1 text-3xl font-extrabold tabular-nums">{result.scaledScore}<span className="text-base font-medium text-white/65"> / 75</span></p></div>
            <div className="rounded-2xl border border-white/20 bg-black/20 p-4"><p className="text-xs text-white/75">CEFR düzeyi · kazanılan XP</p><p className="mt-1 flex flex-wrap items-center gap-2 text-2xl font-extrabold"><span>{result.level}</span><span className="text-sm text-amber-100">+{result.earnedXp} XP</span></p></div>
          </div>
          <p className="mt-5 text-sm text-white/80">{result.answered}/35 soru yanıtlandı. Puanlama, verilen 0–75 okuma ölçeğine göre yapılmıştır.</p>
        </section>
        <section className="glass premium-glass rounded-3xl border border-slate-200 bg-white/90 p-5 dark:border-slate-800 dark:bg-slate-900/90 sm:p-7">
          <h2 className="font-bold text-slate-900 dark:text-white">Bölüm sonuçları</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">{result.partResults.map((part) => <div key={part.partId} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-700 dark:bg-black/20"><span className="text-sm text-slate-700 dark:text-slate-200">{part.title}</span><span className="shrink-0 font-bold tabular-nums text-amber-700 dark:text-amber-200">{part.rawScore}/{part.maxRawScore}</span></div>)}</div>
        </section>
        <div className="flex flex-wrap justify-between gap-3"><button type="button" onClick={() => onExit ? onExit() : setView('intro')} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><ArrowLeft className="size-4" />Mock menüsüne dön</button><button type="button" onClick={startExam} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg"><RotateCcw className="size-4" />Yeniden çöz</button></div>
      </div>
    )
  }

  if (!currentQuestion || !currentPart) return null
  const progressPercent = Math.round((answeredCount / questions.length) * 100)
  const selectedAnswer = answers[currentQuestion.id] ?? ''
  const isLastQuestion = questionIndex === questions.length - 1

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-[.16em] text-amber-700 dark:text-amber-200">{currentPart.title}</p><h1 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">Soru {currentQuestion.number} / 35</h1></div>
        <div className={cn('inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-sm font-bold tabular-nums', secondsLeft <= 300 ? 'border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200')}><Clock3 className="size-4" aria-hidden="true" />{formatTime(secondsLeft)}<span className="font-sans text-xs font-medium opacity-70">kaldı</span></div>
      </header>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-[width]" style={{ width: `${progressPercent}%` }} /></div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{currentPart.instructions}</p>
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(340px,.88fr)]">
        <div className="lg:sticky lg:top-4"><Stimulus part={currentPart} /></div>
        <section className="glass premium-glass rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-7">
          <div className="flex items-start justify-between gap-3"><span className="grid size-9 place-items-center rounded-xl bg-amber-100 text-sm font-extrabold text-amber-900 dark:bg-amber-300/15 dark:text-amber-100">{currentQuestion.number}</span><span className="rounded-full border border-amber-300/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-200">{currentQuestion.kind === 'matching' ? 'Eşleştirme' : currentQuestion.kind === 'tfng' ? 'Doğru / Yanlış / Belirtilmemiş' : 'Çoktan seçmeli'}</span></div>
          <h2 className="mt-4 text-base font-bold leading-relaxed text-slate-900 dark:text-white">{currentQuestion.prompt}</h2>
          {currentQuestion.kind === 'matching' ? (
            <select aria-label={`Soru ${currentQuestion.number} yanıtı`} value={selectedAnswer} onChange={(event) => setAnswers((old) => ({ ...old, [currentQuestion.id]: event.target.value }))} className="mt-5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="">Eşleştirme seçin</option>{currentQuestion.options.map((option) => <option key={option.id} value={option.id} disabled={usedMatchingAnswers.has(option.id)}>{option.label}</option>)}
            </select>
          ) : <div className="mt-5 space-y-2">{currentQuestion.options.map((option) => <button key={option.id} type="button" aria-pressed={selectedAnswer === option.id} onClick={() => setAnswers((old) => ({ ...old, [currentQuestion.id]: option.id }))} className={cn('flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition', selectedAnswer === option.id ? 'border-amber-400 bg-amber-300/15 text-amber-900 dark:text-amber-100' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-300 dark:border-slate-700 dark:bg-black/15 dark:text-slate-200')}><span className={cn('grid size-7 shrink-0 place-items-center rounded-lg border text-xs font-extrabold', selectedAnswer === option.id ? 'border-amber-500 bg-amber-400 text-amber-950' : 'border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-300')}>{option.id}</span><span>{option.label.replace(/^[A-H] — /u, '')}</span></button>)}</div>}
          <div className="mt-6 flex items-center justify-between gap-2"><button type="button" onClick={() => setQuestionIndex((index) => Math.max(0, index - 1))} disabled={questionIndex === 0} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"><ArrowLeft className="size-4" />Önceki</button><button type="button" onClick={() => setQuestionIndex((index) => Math.min(questions.length - 1, index + 1))} disabled={isLastQuestion} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40">Sonraki<ArrowRight className="size-4" /></button></div>
        </section>
      </div>
      <section className="glass premium-glass rounded-2xl border border-slate-200/80 bg-white/85 p-4 dark:border-slate-800 dark:bg-slate-900/85"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-bold text-slate-900 dark:text-white">Soru haritası</h2><span className="text-xs text-slate-500 dark:text-slate-400">Yanıtlanan {answeredCount}/35</span></div><div className="grid grid-cols-7 gap-2 sm:grid-cols-10 lg:grid-cols-12">{questions.map((question, index) => <button key={question.id} type="button" aria-label={`Soru ${question.number}${answers[question.id] ? ', yanıtlandı' : ', boş'}`} aria-current={index === questionIndex ? 'step' : undefined} onClick={() => setQuestionIndex(index)} className={cn('h-9 rounded-lg border text-xs font-bold transition', index === questionIndex ? 'border-amber-400 bg-amber-400 text-amber-950' : answers[question.id] ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200' : 'border-slate-200 text-slate-500 hover:border-amber-300 dark:border-slate-700 dark:text-slate-300')}>{question.number}</button>)}</div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-700"><p className="text-xs text-slate-500 dark:text-slate-400">Sınavı bitirdiğinizde boş yanıtlar yanlış sayılır.</p><button type="button" onClick={submitWithConfirmation} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-4 py-2.5 text-sm font-extrabold text-amber-950 shadow-lg shadow-amber-900/15"><Flag className="size-4" />Sınavı bitir</button></div></section>
    </div>
  )
}
