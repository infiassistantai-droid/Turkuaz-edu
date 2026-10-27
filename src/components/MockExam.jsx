import { useEffect, useMemo, useRef, useState } from 'react'
import {
  FileCheck2,
  Clock,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  BarChart3,
  Sparkles,
  ArrowRight as Arrow,
} from 'lucide-react'
import { mockExamQuestions } from '../data/mockExamData'
import { cefrFromScore, cn, formatTime } from '../lib/utils'

const TOTAL_TIME = 900 // 15 minutes in seconds

function levelColor(level) {
  if (level === 'C1') return { badge: 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white', text: 'text-teal-700 dark:text-teal-300', bar: 'bg-teal-500' }
  if (level === 'B2') return { badge: 'bg-cyan-600 text-white', text: 'text-teal-700 dark:text-teal-300', bar: 'bg-cyan-500' }
  return { badge: 'bg-amber-500 text-white', text: 'text-amber-600 dark:text-amber-300', bar: 'bg-amber-500' }
}

function Intro({ onStart }) {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-600 p-6 text-white shadow-xl shadow-teal-900/20 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <FileCheck2 className="h-8 w-8" />
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/70">
              Milliy Sertifikat · B1/B2/C1
            </div>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
              Mock Imtihon — 10 savol
            </h1>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-white/85">
          Gramatika, lugʻat va oʻqish comprehensionlardan 10 ta savol. 15 daqiqa vaqtingiz bor.
          Yigʻilgan ballar asosida B1/B2/C1 darajasi hisoblab beriladi.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <div className="rounded-xl bg-white/15 px-4 py-2 text-sm font-bold ring-1 ring-white/20">
            <Clock className="mr-1.5 inline h-4 w-4" />
            15 daqiqa
          </div>
          <div className="rounded-xl bg-white/15 px-4 py-2 text-sm font-bold ring-1 ring-white/20">
            <Sparkles className="mr-1.5 inline h-4 w-4" />
            10 savol
          </div>
          <div className="rounded-xl bg-white/15 px-4 py-2 text-sm font-bold ring-1 ring-white/20">
            <Trophy className="mr-1.5 inline h-4 w-4" />
            60+ → B2 sertifikat
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
        <h2 className="font-display text-base font-extrabold text-slate-800 dark:text-white">
          Qoidalar
        </h2>
        <ol className="mt-3 space-y-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          <li>1. Vaqt sanaladi — 15 daqiqa oʻtgach test avtomatik yakunlanadi.</li>
          <li>2. Har bir savolga javob bering — qaytish mumkin.</li>
          <li>3. Natijalar hisoblanganda, har bir savol uchun tushuntirish beriladi.</li>
          <li>4. 60 ball — Milliy Sertifikat B2 daraja.</li>
        </ol>
        <button
          type="button"
          onClick={onStart}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-3 text-sm font-bold text-white shadow-xl shadow-teal-900/20 transition-all active:scale-[0.98] hover:from-teal-700 hover:to-cyan-700"
        >
          <Arrow className="h-4 w-4" />
          Imtihoni boshlash
        </button>
      </div>
    </div>
  )
}

function ExamView({ answers, setAnswers, current, setCurrent, timeLeft, onFinish }) {
  const answeredCount = answers.filter((a) => a !== undefined).length
  const question = mockExamQuestions[current]

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Timer bar */}
      <div className="sticky top-[73px] z-30 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-800/95">
        <div className="flex flex-wrap items-center gap-3">
          <div
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2 font-display text-lg font-extrabold tabular-nums',
              timeLeft <= 60
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300'
                : 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300',
            )}
          >
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm font-bold text-slate-500 dark:text-slate-400">
            <span className="font-display text-teal-700 dark:text-teal-300">{answeredCount}</span>
            /{mockExamQuestions.length} ta savol javoblandi
          </div>
          <button
            type="button"
            onClick={onFinish}
            className="ml-auto rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-rose-900/20 transition-all active:scale-95 hover:bg-rose-700"
          >
            Yakunlash
          </button>
        </div>
        {/* time progress */}
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={cn(
              'h-full rounded-full pbar',
              timeLeft <= 60 ? 'bg-rose-500' : 'bg-gradient-to-r from-teal-500 to-cyan-500',
            )}
            style={{ width: `${Math.max(0, (timeLeft / TOTAL_TIME) * 100)}%` }}
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_180px]">
        {/* Question card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-teal-50 px-2 py-1 text-[11px] font-bold tracking-wider text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
              {question.category}
            </span>
            <span className="text-sm font-bold text-slate-400 dark:text-slate-500">
              Savol {current + 1} / {mockExamQuestions.length}
            </span>
          </div>
          <h3 className="mt-3 font-display text-lg font-extrabold text-slate-800 dark:text-white">
            {question.question}
          </h3>
          {question.miniText && (
            <div className="mt-3 rounded-xl bg-teal-50 p-4 text-[15px] leading-relaxed text-slate-600 ring-1 ring-cyan-100 dark:bg-cyan-500/10 dark:text-slate-300 dark:ring-cyan-900/40">
              {question.miniText}
            </div>
          )}
          <div className="mt-4 grid gap-2">
            {question.options.map((opt, oi) => (
              <button
                key={oi}
                type="button"
                onClick={() => setAnswers((a) => {
                  const next = [...a]
                  next[current] = oi
                  return next
                })}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all active:scale-[0.98]',
                  answers[current] === oi
                    ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300',
                )}
              >
                <span
                  className={cn(
                    'grid h-7 w-7 shrink-0 place-items-center rounded-lg border font-bold text-xs',
                    answers[current] === oi
                      ? 'border-teal-500 bg-gradient-to-r from-teal-600 to-cyan-500 text-white'
                      : 'border-slate-300 text-slate-500 dark:border-slate-600',
                  )}
                >
                  {String.fromCharCode(65 + oi)}
                </span>
                {opt}
              </button>
            ))}
          </div>

          {/* Prev / Next */}
          <div className="mt-5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm font-bold text-slate-500 transition-all active:scale-95 hover:text-teal-700 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Oʻtmish
            </button>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              {current + 1} / {mockExamQuestions.length}
            </span>
            <button
              type="button"
              onClick={() => setCurrent((c) => Math.min(mockExamQuestions.length - 1, c + 1))}
              disabled={current === mockExamQuestions.length - 1}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-teal-900/20 transition-all active:scale-95 hover:from-teal-700 hover:to-cyan-600 disabled:opacity-40"
            >
              Keyingi
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Palette */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Savol paleta
          </div>
          <div className="grid grid-cols-5 gap-2">
            {mockExamQuestions.map((q, qi) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrent(qi)}
                className={cn(
                  'grid h-9 place-items-center rounded-lg font-display text-sm font-extrabold transition-all active:scale-90',
                  answers[qi] !== undefined
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
                  qi === current && 'ring-2 ring-offset-2 ring-teal-500 dark:ring-offset-slate-800',
                )}
              >
                {qi + 1}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-teal-500" />
              javob berilgan
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-slate-200 dark:bg-slate-700" />
              javob berilmagan
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultView({ result, onRestart, onFinish }) {
  const lc = levelColor(result.level)
  const categories = useMemo(() => {
    const map = {}
    mockExamQuestions.forEach((q) => {
      if (!map[q.category]) {
        map[q.category] = { total: 0, correct: 0 }
      }
      map[q.category].total += 1
      if (result.answers[mockExamQuestions.indexOf(q)] === q.answer) {
        map[q.category].correct += 1
      }
    })
    return map
  }, [result])

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Score hero */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-600 p-6 text-white shadow-xl shadow-teal-900/20 sm:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <div className="rounded-2xl bg-white/15 px-6 py-5 backdrop-blur-sm ring-1 ring-white/20">
            <div className="font-display text-4xl font-extrabold">{result.score}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/70">/ 100</div>
          </div>
          <div>
            <span className="inline-block rounded-xl bg-white px-3 py-1.5 font-display text-3xl font-extrabold tracking-widest text-teal-700">
              {result.level}
            </span>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/90">{result.message}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {mockExamQuestions.map((q, qi) => (
            <span
              key={q.id}
              className={cn(
                'grid h-7 w-7 place-items-center rounded-lg text-xs font-bold',
                result.answers[qi] === q.answer
                  ? 'bg-white/30 text-white'
                  : 'bg-rose-900/40 text-white/80',
              )}
            >
              {qi + 1}
            </span>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-teal-700 dark:text-teal-400" />
          <h2 className="font-display text-lg font-extrabold text-slate-800 dark:text-white">
            Boʻlimlar natijasi
          </h2>
        </div>
        <div className="space-y-3">
          {Object.entries(categories).map(([cat, data]) => {
            const pct = Math.round((data.correct / data.total) * 100)
            return (
              <div key={cat}>
                <div className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                  <span>{cat}</span>
                  <span className="ml-auto text-xs font-semibold text-slate-400 dark:text-slate-500">
                    {data.correct}/{data.total} · {pct}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full pbar bg-gradient-to-r from-teal-500 to-cyan-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-extrabold text-slate-800 dark:text-white">
          Savollarni tahlil qilish
        </h2>
        {mockExamQuestions.map((q, qi) => {
          const userAnswer = result.answers[qi]
          const correct = userAnswer === q.answer
          return (
            <div
              key={q.id}
              className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5">
                  {correct ? (
                    <CheckCircle2 className="h-5 w-5 text-teal-700 dark:text-teal-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-rose-500" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {q.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                      Savol {qi + 1}
                    </span>
                  </div>
                  <h3 className="mt-2 font-bold text-slate-800 dark:text-white">{q.question}</h3>
                  {q.miniText && (
                    <p className="mt-2 rounded-lg bg-teal-50 p-2 text-xs leading-relaxed text-slate-500 dark:bg-cyan-500/10 dark:text-slate-400">
                      {q.miniText}
                    </p>
                  )}
                  <div className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Sizning javob: {userAnswer !== undefined ? String.fromCharCode(65 + userAnswer) + '. ' + q.options[userAnswer] : '— berilmadi'}
                  </div>
                  {!correct && (
                    <div className="mt-1 text-sm font-bold text-teal-700 dark:text-teal-300">
                      Toʻgʻri javob: {String.fromCharCode(65 + q.answer)}. {q.options[q.answer]}
                    </div>
                  )}
                  <p
                    className="mt-2 rounded-lg bg-slate-50 p-3 text-[13px] leading-relaxed text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:ring-slate-700"
                    dangerouslySetInnerHTML={{ __html: q.explanation }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/20 transition-all active:scale-95 hover:from-teal-700 hover:to-cyan-600"
        >
          <RotateCcw className="h-4 w-4" />
          Imtihonni qayta topshirish
        </button>
        <span className="flex items-center gap-2 rounded-xl bg-amber-100 px-4 py-3 text-sm font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
          <CalendarClock className="h-4 w-4" />
          Keyingi imtihon {new Date(2026, 10, 20).toLocaleDateString('uz-UZ')}
        </span>
        <button
          type="button"
          onClick={onFinish}
          className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-bold text-slate-500 transition-all active:scale-95 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
        >
          <Trophy className="h-4 w-4" />
          Dashboardga
        </button>
      </div>
    </div>
  )
}

export default function MockExam({ result, onResult, onRestart, onFinish }) {
  const [phase, setPhase] = useState(result ? 'result' : 'intro')
  const [answers, setAnswers] = useState(Array(mockExamQuestions.length).fill(undefined))
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const finishedRef = useRef(Boolean(result))

  // countdown timer — pure tick; finishing is handled by a separate effect
  useEffect(() => {
    if (phase !== 'exam') return undefined
    const timer = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [phase])

  // auto-finish when time runs out
  useEffect(() => {
    if (phase === 'exam' && timeLeft === 0) {
      finishExam()
    }
  }, [phase, timeLeft])

  function startExam() {
    finishedRef.current = false
    setAnswers(Array(mockExamQuestions.length).fill(undefined))
    setCurrent(0)
    setTimeLeft(TOTAL_TIME)
    setPhase('exam')
  }

  function finishExam() {
    if (finishedRef.current) return
    finishedRef.current = true
    let correct = 0
    const perQuestion = []
    mockExamQuestions.forEach((q, qi) => {
      if (answers[qi] === q.answer) correct += 1
      perQuestion.push({ correct: answers[qi] === q.answer, given: answers[qi] })
    })
    const score = Math.round((correct / mockExamQuestions.length) * 100)
    const cefr = cefrFromScore(score)
    const finalResult = {
      score,
      level: cefr.level,
      message: cefr.message,
      correct,
      total: mockExamQuestions.length,
      answers,
    }
    setPhase('result')
    onResult(finalResult)
  }

  if (phase === 'intro') {
    return <Intro onStart={startExam} />
  }
  if (phase === 'result') {
    return (
      <ResultView
        result={result}
        onRestart={() => {
          onRestart()
          startExam()
        }}
        onFinish={onFinish}
      />
    )
  }
  return (
    <ExamView
      answers={answers}
      setAnswers={setAnswers}
      current={current}
      setCurrent={setCurrent}
      timeLeft={timeLeft}
      onFinish={finishExam}
    />
  )
}
