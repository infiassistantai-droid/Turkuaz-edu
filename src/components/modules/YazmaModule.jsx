import { useMemo, useRef, useState } from 'react'
import {
  PenLine,
  Clock,
  RefreshCw,
  Sparkles,
  Trophy,
  Wand2,
  Info,
  Keyboard,
  CircleDot,
  List,
  X,
  Clipboard,
} from 'lucide-react'
import { writingTasks } from '../../data/mockExamData'
import { gradeWriting, cn } from '../../lib/utils'
import { saveScore, loadScores } from '../../lib/storage'

const TURKISH_KEYS = [
  'a', 'b', 'c', 'ç', 'd', 'e', 'f', 'g', 'ğ', 'h', 'ı', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'ö', 'p', 'r', 's', 'ş', 't', 'u', 'ü', 'v', 'y', 'z',
  'Ç', 'Ğ', 'İ', 'Ö', 'Ş', 'Ü',
  "'", ' ', '.', ',', '!', '?',
]

// C1-level essay connectors (kalıplar) — grouped, with Uzbek meanings
const KALIPLAR = [
  {
    group: 'Boshlanish',
    items: [
      { tr: 'Öncelikle, belirtmek gerekir ki,', uz: 'Avvalo, taʼkidlash kerakki,' },
      { tr: 'Görünen o ki,', uz: 'Koʻrinib turibdiki,' },
      { tr: 'Bu konuda farklı görüşler vardır.', uz: 'Bu masalada turli qarashlar mavjud.' },
    ],
  },
  {
    group: 'Taraqqiyot',
    items: [
      { tr: 'Bunun yanı sıra,', uz: 'Buning muqobilida,' },
      { tr: 'Buna göre,', uz: 'Shuning uchun,' },
      { tr: 'şu da kayda değer ki,', uz: 'Eʼtiborga loyiqki,' },
      { tr: 'Dolayısıyla,', uz: 'Shu sababli,' },
    ],
  },
  {
    group: 'Taqqoslash',
    items: [
      { tr: 'Nihayetinde,', uz: 'Nihoyat,' },
      { tr: 'İtibaren,', uz: 'Hisobga olgan holda,' },
      { tr: 'Aslında,', uz: 'Asl holatda,' },
    ],
  },
  {
    group: 'Xulosa',
    items: [
      { tr: 'Özetlemek gerekirse,', uz: 'Xulosa qilib aytganda,' },
      { tr: 'Kanaatimce,', uz: 'Menimcha,' },
      { tr: 'Sonuç olarak,', uz: 'Natijada,' },
    ],
  },
]

const CONNECTOR_KEYWORDS = [
  'bunun yanı sıra', 'buna göre', 'buna rağmen', 'sonuç olarak',
  'özetlemek gerekirse', 'kanaatimce', 'dolayısıyla', 'aslında', 'bence', 'neticede',
]

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, Math.round(n)))
}

// Deterministic per-criterion analysis (4 rubric criteria)
function analyzeWriting(text) {
  const t = text.trim()
  const words = t.split(/\s+/).filter(Boolean)
  const wc = words.length
  const turkChars = (t.match(/[çğıöşüÇĞİÖŞÜİ]/g) || []).length
  const sentences = t.split(/[.!?]+/).filter((s) => s.trim().length > 2).length
  const lower = t.toLowerCase()
  const foundConn = CONNECTOR_KEYWORDS.filter((c) => lower.includes(c))
  const uniqueWords = new Set(
    words
      .map((w) => w.replace(/[^a-zçğıöşüÇĞİÖŞÜ0-9]/g, '').toLowerCase())
      .filter(Boolean),
  )
  const uniqueRatio = wc > 0 ? uniqueWords.size / wc : 0
  const repeats = wc - uniqueWords.size

  const topic = clamp(40 + sentences * 5 + foundConn.length * 8, 25, 97)
  const grammar = clamp(42 + Math.min(24, turkChars * 2.5) + Math.min(26, sentences * 4), 30, 96)
  const lexicon = clamp(40 + uniqueRatio * 55 + Math.min(12, turkChars * 0.8), 28, 96)
  const cohesion = clamp(34 + foundConn.length * 11 + Math.min(20, sentences * 3) - Math.min(14, repeats * 0.6), 24, 95)

  return {
    wc,
    turkChars,
    sentences,
    foundConn,
    topic,
    grammar,
    lexicon,
    cohesion,
  }
}

function critNote(score, text) {
  const c = analyzeWriting(text)
  return [
    {
      key: 'topic',
      label: 'Mavzuni ochib berish',
      score: c.topic,
      note:
        c.sentences >= 5
          ? `${c.sentences} ta gap — fikrlar ketma-ket rivojlantirilgan. Kirish va xulosani mushtlang.`
          : 'Koʻproq gaplar yozing — fikrni kirish, rivojlanish va xulosada oching.',
      bar: 'bg-teal-500',
    },
    {
      key: 'grammar',
      label: 'Grammatik toʻgʻrilik',
      score: c.grammar,
      note:
        c.turkChars > 0
          ? `Türkcha harflar (ç, ğ, ı, ö, ş, ü) ${c.turkChars} marta qoʻllangan — imlo aniqligi yaxshi.`
          : 'Türkcha maxsus harflarni ishlating — matnni asliroq koʻrsatadi.',
      bar: 'bg-cyan-500',
    },
    {
      key: 'lexicon',
      label: 'Lugʻat boyligi',
      score: c.lexicon,
      note:
        c.uniqueRatio > 0.65
          ? `Soʻz boyligi keng — ${c.wc} ta turkum soʻz ishlatilgan.`
          : 'Takrorlanuvchi soʻzlarni kamaytiring, sinonimlardan foydalaning.',
      bar: 'bg-rose-500',
    },
    {
      key: 'cohesion',
      label: 'Imlo va bogʻlanish',
      score: c.cohesion,
      note:
        c.foundConn.length >= 3
          ? `Bogʻlanish yaxshi — ${c.foundConn.length} ta kalom ibora qoʻllangan.`
          : 'Iboralarni (buning muqobilida, shu sababli, nihoyat) bogʻlovchi sifatida ishlating.',
      bar: 'bg-amber-500',
    },
  ]
}

function levelStyle(level) {
  if (level === 'C1') return { bg: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200', bar: 'bg-rose-500' }
  if (level === 'B2') return { bg: 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300', bar: 'bg-teal-500' }
  return { bg: 'bg-teal-50 text-teal-700 dark:bg-cyan-500/10 dark:text-teal-300', bar: 'bg-cyan-500' }
}

export default function YazmaModule({ addXp }) {
  const [taskId, setTaskId] = useState(writingTasks[0].id)
  const task = useMemo(() => writingTasks.find((t) => t.id === taskId) || writingTasks[0], [taskId])
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [bestInfo, setBestInfo] = useState(() => loadScores().yazma || { best: 0, attempts: 0 })
  const taRef = useRef(null)
  const caretRef = useRef(0)

  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const [lo, hi] = task.targetWords.split('–').map(Number)

  // word-count status: too short (gray) · optimal (emerald) · too long (amber)
  const wordState = words === 0 ? 'empty' : words < lo ? 'short' : words > hi ? 'long' : 'ok'
  const wordColor =
    wordState === 'ok'
      ? 'text-emerald-600 dark:text-emerald-400'
      : wordState === 'long'
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-slate-400 dark:text-slate-500'
  const wordLabel =
    wordState === 'ok' ? 'Normaga mos ✓' : wordState === 'long' ? 'Normadan ortiq' : wordState === 'short' ? 'Haddi normadan kam' : 'Yozishni boshlang'

  function selectTask(id) {
    setTaskId(id)
    setText('')
    setResult(null)
    setRevealed(false)
  }

  function trackCaret() {
    const el = taRef.current
    if (el) caretRef.current = el.selectionStart ?? el.value.length
  }

  // insert at cursor position inside the textarea
  function insertAtCursor(str) {
    const el = taRef.current
    const pos = el ? el.selectionStart ?? el.value.length : text.length
    const next = text.slice(0, pos) + str + text.slice(pos)
    setText(next)
    setRevealed(false)
    setTimeout(() => {
      if (el) {
        el.focus()
        el.selectionStart = el.selectionEnd = pos + str.length
      }
    }, 0)
  }

  function appendChar(ch) {
    insertAtCursor(ch)
  }

  function insertSample() {
    setText(task.sample)
    setRevealed(false)
  }

  function grade() {
    if (text.trim().length < 20) return
    const res = gradeWriting(text, task.targetWords)
    setResult(res)
    setRevealed(true)
    const saved = saveScore('yazma', { best: res.score, attempts: 1 })
    setBestInfo(saved)
    if (res && res.score >= 60) {
      addXp(40)
    }
  }

  const lv = result ? levelStyle(result.level) : levelStyle('A2')

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex flex-wrap items-center gap-2">
          <PenLine className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          <h1 className="font-display text-xl font-extrabold text-slate-800 dark:text-white">
            Yozma module — Rasmiy 2-topshiriq struktura
          </h1>
          <span className="rounded-lg bg-rose-50 px-2 py-1 text-[11px] font-bold tracking-wider text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
            {task.level}
          </span>
          <span className="ml-auto flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
            <Clock className="h-4 w-4" />
            {task.title}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Milliy Sertifikat yozma ish: 1-topshiriq — rasmiy/norasmiy maktub (120–150 soʻz),
          2-topshiriq — esse (180–220 soʻz). Virtual klaviatura matnning kursor joyiga yoziladi.
        </p>
      </div>

      {/* 1-Topshiriq / 2-Topshiriq tabs */}
      <div className="flex flex-wrap gap-2">
        {writingTasks.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => selectTask(t.id)}
            className={cn(
              'flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-extrabold transition-all',
              t.id === taskId
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20'
                : 'border border-slate-200/80 bg-white text-slate-500 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            <span
              className={cn(
                'grid h-6 w-6 place-items-center rounded-lg text-[11px] font-extrabold',
                t.id === taskId ? 'bg-white/20' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300',
              )}
            >
              {t.task}
            </span>
            {t.title}
          </button>
        ))}
      </div>

      {/* Prompt */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
        <h2 className="font-display text-base font-extrabold text-slate-800 dark:text-white">
          {task.promptTr}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
          {task.promptUz}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {task.criteria.map((c, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 rounded-lg bg-rose-50 px-2 py-1 text-xs font-bold text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"
            >
              <CircleDot className="h-3.5 w-3.5" />
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setRevealed(false)
          }}
          onSelect={trackCaret}
          onKeyUp={trackCaret}
          onClick={trackCaret}
          placeholder="Turk tilida matn yozing… Virtual klaviatura yoki Kalıplar panelidan foydalaning."
          className="h-52 w-full resize-y border-0 bg-slate-50 p-4 text-[15px] leading-relaxed text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:bg-slate-900/80 dark:text-slate-200"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
          <span className="text-xs font-bold">
            <span className={wordColor}>{words}</span> soʻz · {task.targetWords} ·{' '}
            <span className={wordColor}>{wordLabel}</span>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={insertSample}
              className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 font-bold text-slate-500 transition-all active:scale-95 hover:text-teal-700 dark:bg-slate-800 dark:text-slate-400"
            >
              <Wand2 className="h-3.5 w-3.5" />
              Misol matn
            </button>
            <button
              type="button"
              onClick={() => {
                setText('')
                setRevealed(false)
              }}
              className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 font-bold text-slate-500 transition-all active:scale-95 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-400"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Tozalash
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 py-1 font-bold text-teal-700 ring-1 ring-teal-600/15 transition-all active:scale-95 hover:bg-teal-100 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-800/50"
            >
              <List className="h-3.5 w-3.5" />
              Kalıplar
            </button>
          </div>
        </div>

        {/* Sticky Turkish virtual keyboard — inserts at cursor */}
        <div className="border-t border-slate-100 bg-slate-50/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <Keyboard className="h-4 w-4" />
            Türk virtual klaviaturasi — kursor joyiga yoziladi
          </div>
          <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-14">
            {TURKISH_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => appendChar(k)}
                className="h-9 rounded-lg border border-slate-200/80 bg-white font-semibold text-slate-600 shadow-sm transition-all active:scale-95 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-rose-700 dark:hover:bg-rose-950/40"
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={grade}
          disabled={text.trim().length < 20}
          className="flex w-full items-center justify-center gap-2 border-t border-slate-100 bg-gradient-to-r from-rose-500 to-rose-600 py-3 text-sm font-bold text-white shadow-lg shadow-rose-900/20 transition-all active:scale-95 hover:from-rose-600 hover:to-rose-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800"
        >
          <Sparkles className="h-4 w-4" />
          AI Tekshiruv — 4 mezon boʻyicha tahlil
        </button>
      </div>

      {/* Result */}
      {revealed && result && (
        <div className="animate-fadein space-y-4">
          <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
            <div className="flex flex-wrap items-center gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 px-6 py-4 text-center text-white shadow-lg shadow-rose-900/20">
                <div className="font-display text-4xl font-extrabold">{result.score}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/80">
                  / 100
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-rose-500" />
                  <span className={cn('rounded-lg px-2 py-1 text-xs font-bold tracking-wider', lv.bg)}>
                    {result.level} darajasi
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {result.message}
                </p>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className={cn('h-full rounded-full pbar', lv.bar)} style={{ width: `${result.score}%` }} />
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs font-bold text-slate-500 dark:text-slate-400">
              Eng yaxshi natija: {bestInfo.best}/100 · {bestInfo.attempts} ta urinish
            </p>
          </div>

          {/* 4-criteria breakdown */}
          <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
            <h3 className="mb-4 flex items-center gap-2 font-display text-base font-extrabold text-slate-800 dark:text-white">
              <Sparkles className="h-4 w-4 text-rose-500" />
              AI Tekshiruv — 4 mezon boʻyicha tahlil
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {critNote(result.score, text).map((c) => (
                <div
                  key={c.key}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4 ring-1 ring-slate-200 dark:border-slate-800 dark:bg-slate-800/50 dark:ring-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-800 dark:text-white">
                      {c.label}
                    </span>
                    <span className="font-display text-sm font-extrabold tabular-nums text-slate-600 dark:text-slate-300">
                      {c.score}/100
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className={cn('h-full rounded-full pbar', c.bar)}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {c.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-teal-50 p-3 text-xs leading-relaxed text-teal-700 ring-1 ring-teal-600/15 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-800/50">
            <Info className="mr-1 inline h-4 w-4" />
            Bu baho AI algoritmi tomonidan soʻz hajmi, turkcha harflar, gap qurumi va soʻz
            davomi asosida natijani koʻrsatadi — bu Milliy Sertifikat balingiz emas.
          </div>
        </div>
      )}

      {/* Foydali iboralar (Kalıplar) side-drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 animate-fadein bg-slate-900/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85vw] animate-drawerin flex-col gap-4 overflow-y-auto border-l border-slate-200/80 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display text-base font-extrabold text-slate-800 dark:text-white">
                <Sparkles className="h-5 w-5 text-teal-700 dark:text-teal-400" />
                Foydali iboralar (Kalıplar)
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Yopish"
                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200/80 text-slate-500 transition-all active:scale-95 hover:text-rose-600 dark:border-slate-800 dark:text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 dark:text-slate-500">
              C1 darajasidagi bogʻlovchi iboralar. Har birini «Nusxalash» orqali matnning kursor
              joyiga qoʻshish mumkin.
            </p>

            {KALIPLAR.map((group) => (
              <div key={group.group}>
                <h4 className="mb-2 text-[11px] font-extrabold uppercase tracking-widest text-teal-700 dark:text-teal-400">
                  {group.group}
                </h4>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <div
                      key={item.tr}
                      className="rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-800"
                    >
                      <p className="text-sm font-bold text-slate-800 dark:text-white">
                        {item.tr}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                        {item.uz}
                      </p>
                      <button
                        type="button"
                        onClick={() => insertAtCursor(item.tr + ' ')}
                        className="mt-2 flex items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 py-1.5 text-xs font-bold text-teal-700 ring-1 ring-teal-600/15 transition-all active:scale-95 hover:bg-teal-100 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-800/50"
                      >
                        <Clipboard className="h-3.5 w-3.5" />
                        Nusxalash
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-auto rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-900/40">
              💡 Iboralarni roʻyxatda qalin koʻring — bu matnning bogʻlanishini kuchaytiradi.
            </div>
          </div>
        </>
      )}
    </div>
  )
}
