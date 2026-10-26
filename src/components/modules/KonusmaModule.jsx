import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Mic,
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  Gauge,
  MicOff,
  Sparkles,
  Trophy,
  Volume2,
  Check,
  Circle,
  ChevronRight,
  ChevronUp,
  Timer as TimerIcon,
} from 'lucide-react'
import { speakingPrompts } from '../../data/mockExamData'
import { cn, formatTime } from '../../lib/utils'
import { loadKonusma, saveKonusma } from '../../lib/storage'

// ---------------------------------------------------------------------
// 3-stage Milliy Sertifikat speaking exam structure
// ---------------------------------------------------------------------
const STAGES = [
  { n: 1, id: 'q1', title: '1-Qism', sub: 'Tanishuv va qisqa savollar' },
  { n: 2, id: 'q2', title: '2-Qism', sub: 'Mavzu boʻyicha 2 daqiqalik nutq' },
  { n: 3, id: 'q3', title: '3-Qism', sub: 'Munozara savolları' },
]

// Stage 1 — short personal questions (Tanishuv)
const STAGE1_QUESTIONS = [
  { tr: 'Merhaba, adınız nedir?', uz: 'Salom, ismingiz nima?' },
  { tr: 'Nerede yaşıyorsunuz?', uz: 'Qayerda yashaysiz?' },
  { tr: 'Ne iş yapıyorsunuz?', uz: 'Nima ish bilan shugʻullanasiz?' },
  { tr: 'Bugün sizin için nasıl bir gün?', uz: 'Bugun siz uchun qanday kun?' },
]

// Stage 3 — follow-up discussion questions
const STAGE3_QUESTIONS = [
  { tr: 'Bu görüşe katılıyor musunuz? Neden?', uz: 'Siz bu fikrga qoʻshilasizmi? Nima uchun?' },
  { tr: 'Bu konuya dair deneyimlerinizi paylaşabilir misiniz?', uz: 'Bu mavzu boʻyicha tajribangizni aytib bera olasizmi?' },
  { tr: 'Bu durumla ilgili çözüm önerileriniz var mı?', uz: 'Ushbu holat yuzasidan yechim takliflaringiz bormi?' },
]

// C1 model answer + audio/reading practice tips
const SAMPLE_ANSWER = {
  tr: '«Bu konuda şunu düşünüyorum: öncelikle,ımız büyüdükçe çevremizin önemi artıyor. Biz gençler olarak sürdürülebilir bir gelecek için pek çok şey yapabiliriz. Bunu yaparken, öncelikle deneyimlerimizi paylaşmalı, ardından küçük ama anlamlı adımlarla harekete geçmeliyiz. Özetlemek gerekirse, dönüşüm bir günde olmuyor; ancak istekli ve kararlı olmak her şeyi mümkün kılıyor. Kanaatimce, bu yolda en büyük yardımcımız kendimize olan güvenimizdir.»',
  uz: '«Bu masalada shunday fikrdaman: avvalo, biz katta boʻlgan sari atrof-muhitimizning ahamiyati ortadi. Biz yoshlar barqaror kelecek uchun juda koʻp narsa qila olamiz. Buni amalga oshirishda, avvalo tajribamizni baham koʻrishimiz, keyin esa kichik, ammo muhim qadamlar bilan harakatni boshlashimiz kerak. Xulosa qilib aytganda, oʻzgarish bir kunda yuz bermaydi; ammo istak va qatʼiyat har narsani mumkin qiladi. Menimcha, bu yoʻlda eng katta yordamchimiz oʻzimizga boʻlgan ishonchimizdir.»',
  audioTips: [
    'Soʻzingizni sekin va aniq ayting — tezlik aniqlikka qaraganda muhimroq.',
    'Pauzalar iboralar (buning muqobilida, shuning uchun, nihoyat) uchun qoldiring.',
    'Ovoz balandligi oʻzgaruvchan boʻlsin — muhim nuqtalar balandroq talaffuz qilinadi.',
    'Namuna javobni bir necha marta ovoz chiqarib oʻqing — talaffuzni mushtlash uchun.',
  ],
}

export default function KonusmaModule() {
  const savedKonusma = loadKonusma()
  const [stage, setStage] = useState('q1') // q1 | q2 | q3
  const [reached, setReached] = useState(savedKonusma.reached || 1) // highest stage reached (1..3)
  const [prompt, setPrompt] = useState(null)
  const [phase, setPhase] = useState('idle') // idle | prep | speak | paused | done
  const [prepLeft, setPrepLeft] = useState(60)
  const [speakLeft, setSpeakLeft] = useState(120)
  const intervalRef = useRef(null)

  // 1-qism answers
  const [answered1, setAnswered1] = useState(savedKonusma.answered1 || {})
  const [answered3, setAnswered3] = useState(savedKonusma.answered3 || {})

  // Persist speaking progress — resumes across refreshes
  useEffect(() => {
    saveKonusma({ reached, answered1, answered3 })
  }, [reached, answered1, answered3])

  const drawPrompt = useCallback(() => {
    setPrompt(speakingPrompts[Math.floor(Math.random() * speakingPrompts.length)])
    setPhase('idle')
    setPrepLeft(60)
    setSpeakLeft(120)
  }, [])

  useEffect(() => {
    drawPrompt()
  }, [drawPrompt])

  // timer loop — only the active phase counts down
  useEffect(() => {
    if (phase !== 'prep' && phase !== 'speak') return undefined
    intervalRef.current = setInterval(() => {
      if (phase === 'prep') setPrepLeft((t) => Math.max(0, t - 1))
      if (phase === 'speak') setSpeakLeft((t) => Math.max(0, t - 1))
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [phase])

  // phase transitions
  useEffect(() => {
    if (phase === 'prep' && prepLeft <= 0) setPhase('speak')
  }, [prepLeft, phase])

  useEffect(() => {
    if (phase === 'speak' && speakLeft <= 0) {
      setPhase('done')
      setReached(3)
      setStage('q3')
    }
  }, [speakLeft, phase])

  const isRecording = phase === 'speak'

  function start() {
    setPrepLeft(60)
    setSpeakLeft(120)
    setPhase('prep')
  }

  function skipPrep() {
    setPrepLeft(0)
    setSpeakLeft(120)
    setPhase('speak')
  }

  function pause() {
    setPhase((p) => (p === 'speak' ? 'paused' : p))
  }

  function reset() {
    setPhase('idle')
    setPrepLeft(60)
    setSpeakLeft(120)
  }

  function goStage(id) {
    if (reached >= STAGES.find((s) => s.id === id).n) {
      setStage(id)
      if (id === 'q2') setPhase('idle')
    }
  }

  const allStage1Done = STAGE1_QUESTIONS.every((q) => answered1[q.tr])
  const allStage3Done = STAGE3_QUESTIONS.every((q) => answered3[q.tr])

  // circular countdown math
  const R = 52
  const C = 2 * Math.PI * R
  const total = phase === 'prep' ? 60 : 120
  const remain = phase === 'prep' ? prepLeft : phase === 'speak' || phase === 'paused' ? speakLeft : 0
  const frac = total > 0 ? remain / total : 0
  const offset = C * (1 - frac)
  const ringColor = phase === 'prep' ? '#f59e0b' : frac <= 0.25 ? '#ef4444' : '#f43f5e'
  const ringPulse = (phase === 'prep' || phase === 'speak') && frac <= 0.25

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex flex-wrap items-center gap-2">
          <Mic className="h-5 w-5 text-amber-500" />
          <h1 className="font-display text-xl font-extrabold text-slate-800 dark:text-white">
            Konushma module — 3-qismli imtihón simulatori
          </h1>
          <span className="rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-bold tracking-wider text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
            B1–C1
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Milliy Sertifikat suhbat imtihonining haqiqiy strukturasi: 1-qism — tanishuv,
          2-qism — 2 daqiqalik nutq, 3-qism — munozara savollari.
        </p>
      </div>

      {/* Stage stepper */}
      <div className="flex items-center gap-2">
        {STAGES.map((s, i) => {
          const active = stage === s.id
          const unlocked = reached >= s.n
          return (
            <div key={s.id} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => goStage(s.id)}
                disabled={!unlocked}
                className={cn(
                  'flex w-full items-center gap-2 rounded-2xl border px-3 py-2.5 text-left transition-all',
                  active
                    ? 'border-amber-400 bg-amber-50 shadow-sm dark:border-amber-700/60 dark:bg-amber-500/10'
                    : unlocked
                      ? 'border-slate-200/80 bg-white hover:border-amber-300 dark:border-slate-800 dark:bg-slate-800'
                      : 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-50 dark:border-slate-800 dark:bg-slate-900',
                )}
              >
                <span
                  className={cn(
                    'grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-extrabold',
                    active
                      ? 'bg-amber-500 text-white'
                      : unlocked
                        ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        : 'bg-slate-200 text-slate-400 dark:bg-slate-800',
                  )}
                >
                  {s.n}
                </span>
                <div className="min-w-0 leading-tight">
                  <div className="text-sm font-extrabold text-slate-800 dark:text-white">
                    {s.title}
                  </div>
                  <div className="truncate text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                    {s.sub}
                  </div>
                </div>
              </button>
              {i < STAGES.length - 1 && (
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
              )}
            </div>
          )
        })}
      </div>

      {/* Stage 1 — Tanishuv va qisqa savollar */}
      {stage === 'q1' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 p-5 dark:border-amber-900/30 dark:from-amber-950/40 dark:to-rose-950/40">
            <h2 className="font-display text-base font-extrabold text-slate-800 dark:text-white">
              1-Qism · Tanishuv va qisqa savollar
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Hayotida muntazam savollar. Har biriga javob berib, «Javob berildi» deb belgilang.
            </p>
          </div>
          <div className="space-y-3">
            {STAGE1_QUESTIONS.map((q) => {
              const done = !!answered1[q.tr]
              return (
                <div
                  key={q.tr}
                  className={cn(
                    'flex items-center gap-4 rounded-2xl border p-4 transition-all',
                    done
                      ? 'border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/30'
                      : 'border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80',
                  )}
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                    <Mic className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 dark:text-white">{q.tr}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{q.uz}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnswered1((a) => ({ ...a, [q.tr]: !a[q.tr] }))}
                    className={cn(
                      'flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all active:scale-95',
                      done
                        ? 'bg-amber-500 text-white'
                        : 'border border-slate-200/80 bg-white text-slate-500 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400',
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    {done ? 'Javob berildi' : 'Javob berildi?'}
                  </button>
                </div>
              )
            })}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setReached(2)
                setStage('q2')
                reset()
              }}
              disabled={!allStage1Done}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition-all active:scale-95 hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
            >
              2-Qismga oʻtish
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stage 2 — 2 daqiqalik nutq with circular countdown */}
      {stage === 'q2' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 p-5 dark:border-amber-900/30 dark:from-amber-950/40 dark:to-rose-950/40">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200 dark:bg-slate-800 dark:text-amber-300">
                {prompt ? prompt.tag : '—'}
              </span>
              <button
                type="button"
                onClick={drawPrompt}
                className="ml-auto flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200 transition-all active:scale-95 hover:text-amber-600 dark:bg-slate-800 dark:text-slate-400"
              >
                <Shuffle className="h-3.5 w-3.5" />
                Yangi mavzu
              </button>
            </div>
            {prompt && (
              <div className="mt-4">
                <p className="font-display text-lg font-extrabold text-slate-800 dark:text-white">
                  {prompt.tr}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {prompt.uz}
                </p>
                <p className="mt-2 rounded-xl bg-white/60 px-3 py-2 text-xs font-bold text-amber-700 ring-1 ring-amber-200 dark:text-amber-300 dark:ring-amber-900/40">
                  Nutq: 1 daqiqa tayyorlik → 2 daqiqa gapirish
                </p>
              </div>
            )}
          </div>

          {/* circular countdown timer */}
          <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
              <div className="relative">
                <svg viewBox="0 0 128 128" className="h-36 w-36 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r={R}
                    fill="none"
                    strokeWidth="8"
                    className="stroke-slate-200 dark:stroke-slate-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r={R}
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke={ringColor}
                    strokeDasharray={C}
                    strokeDashoffset={offset}
                    className={ringPulse ? 'pulse-ring' : ''}
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl font-extrabold tabular-nums text-slate-800 dark:text-white">
                    {formatTime(remain)}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {phase === 'prep' ? 'Tayyorlik' : phase === 'speak' || phase === 'paused' ? 'Nutq' : 'Davom'}
                  </span>
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                {phase === 'idle' && (
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    Tayyor boʻldingizmi? «Gaplashni boshlash»ni bosing.
                  </p>
                )}
                {phase === 'prep' && (
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    Tayyorlik vaqti — eslatma yozishingiz mumkin.
                  </p>
                )}
                {phase === 'speak' && (
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    Gapiryapsiz — ishorangizni aniq ayting!
                  </p>
                )}
                {phase === 'paused' && (
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    Toʻxtatildi — «Davom etish»ni bosing.
                  </p>
                )}
                {phase === 'done' && (
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    ✅ Nutq tugadi — 3-qism munozara savollariga oʻtish.
                  </p>
                )}
                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {phase === 'idle' && (
                    <button
                      type="button"
                      onClick={start}
                      className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition-all active:scale-95 hover:bg-amber-600"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Gaplashni boshlash
                    </button>
                  )}
                  {phase === 'prep' && (
                    <button
                      type="button"
                      onClick={skipPrep}
                      className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition-all active:scale-95 hover:bg-amber-600"
                    >
                      <Mic className="h-4 w-4" />
                      Gaplashni boshlash
                    </button>
                  )}
                  {phase === 'speak' && (
                    <button
                      type="button"
                      onClick={pause}
                      className="flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-900/20 transition-all active:scale-95 hover:bg-rose-600"
                    >
                      <Pause className="h-4 w-4 fill-current" />
                      Toʻxtatish
                    </button>
                  )}
                  {phase === 'paused' && (
                    <button
                      type="button"
                      onClick={() => setPhase('speak')}
                      className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition-all active:scale-95 hover:bg-amber-600"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Davom etish
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={reset}
                    className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-bold text-slate-500 transition-all active:scale-95 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Qayta tiklash
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 3 — Munozara savolları + C1 sample answer */}
      {stage === 'q3' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-teal-50 p-5 dark:border-amber-900/30 dark:from-amber-950/40 dark:to-teal-950/40">
            <h2 className="font-display text-base font-extrabold text-slate-800 dark:text-white">
              3-Qism · Munozara savolları
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Mavzu boʻyicha qoʻshimcha savollar — fikringizni asoslab javob bering.
            </p>
          </div>
          <div className="space-y-3">
            {STAGE3_QUESTIONS.map((q) => {
              const done = !!answered3[q.tr]
              return (
                <div
                  key={q.tr}
                  className={cn(
                    'flex items-center gap-4 rounded-2xl border p-4 transition-all',
                    done
                      ? 'border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/30'
                      : 'border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80',
                  )}
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 dark:text-white">{q.tr}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{q.uz}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnswered3((a) => ({ ...a, [q.tr]: !a[q.tr] }))}
                    className={cn(
                      'flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all active:scale-95',
                      done
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white'
                        : 'border border-slate-200/80 bg-white text-slate-500 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400',
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    {done ? 'Javob berildi' : 'Javob berildi?'}
                  </button>
                </div>
              )
            })}
          </div>

          {/* C1 namuna javob toggle card */}
          <SampleAnswerCard />

          {allStage3Done && (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-amber-100 py-4 text-sm font-extrabold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              <Trophy className="h-5 w-5" />
              Barcha 3 qism tugallandi — suhbat imtihoni simulatori yakunlandi!
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { icon: Volume2, title: 'Ishorangiz aniq', tip: 'Alifbo yoki takrorlashni qilmang — fikringizni davom eting.' },
          { icon: Sparkles, title: 'Iboralarni foydalaning', tip: '«Bence…», «Aslında…», «Bir ara…» kabi soʻzlarni qoʻshing.' },
          { icon: Gauge, title: 'Tezlikni kontrol qiling', tip: 'Tez gapirish kerak emas, durust va aniqlik muhim.' },
          { icon: MicOff, title: 'Diqqat bilan tinglang', tip: 'Avvalo gapni toʻla eshiting, keyin javob bering.' },
        ].map((tip) => {
          const Icon = tip.icon
          return (
            <div
              key={tip.title}
              className="flex items-start gap-3 rounded-3xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 dark:text-white">{tip.title}</div>
                <div className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{tip.tip}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// C1 namuna javob — toggle card with reading/audio tips
function SampleAnswerCard() {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-2xl border border-teal-200 bg-white shadow-sm dark:border-teal-800/50 dark:bg-slate-800">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
          <Sparkles className="h-5 w-5 text-teal-700 dark:text-teal-400" />
          C1 Namuna Javobni Koʻrish — {open ? 'Yopish' : 'Koʻrsatish'}
        </span>
        <ChevronUp className={cn('h-5 w-5 text-slate-400 transition-transform', !open && 'rotate-180')} />
      </button>
      {open && (
        <div className="space-y-4 border-t border-slate-100 px-5 py-4 dark:border-slate-800">
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">
              C1 namuna javob (Turkcha)
            </h4>
            <p className="rounded-xl bg-teal-50 p-4 text-[15px] leading-relaxed text-slate-700 ring-1 ring-teal-600/15 dark:bg-teal-500/10 dark:text-slate-200 dark:ring-teal-800/50">
              {SAMPLE_ANSWER.tr}
            </p>
          </div>
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Oʻzbek tarjimasi
            </h4>
            <p className="text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
              {SAMPLE_ANSWER.uz}
            </p>
          </div>
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">
              <TimerIcon className="h-3.5 w-3.5" />
              Audio / oʻqish maslahatlari
            </h4>
            <ul className="space-y-1.5">
              {SAMPLE_ANSWER.audioTips.map((t, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-xl bg-teal-50 p-3 text-xs leading-relaxed text-slate-600 ring-1 ring-cyan-100 dark:bg-cyan-500/10 dark:text-slate-300 dark:ring-cyan-900/30"
                >
                  <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
