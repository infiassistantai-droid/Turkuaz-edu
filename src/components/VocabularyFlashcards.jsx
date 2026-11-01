import { useEffect, useMemo, useState } from 'react'
import {
  Table2,
  Users2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  Copy,
  Star,
  BookText,
} from 'lucide-react'
import { flashcards, suffixPlayground, suffixTable, vowelHarmony } from '../data/mockExamData'
import { buildSuffix, cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'
import FlashcardStudyMode from './FlashcardStudyMode'

// ----------------------------------------------------------------------
// Persistence — mastery ("Bilaman ✅" / "Takrorlash kerak 🔄") and
// saved words (Saqlanganlar ⭐)
// ----------------------------------------------------------------------
const MASTERY_KEY = 'turkish-marathon-mastery-v2'
const SAVED_KEY = 'turkish-marathon-saved-words-v2'

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : fallback
  } catch {
    return fallback
  }
}

// ----------------------------------------------------------------------
// Grammar comparison cards — tricky Turkish rules with formula boxes
// ----------------------------------------------------------------------
const GRAMMAR_COMPARISONS = [
  {
    id: 'hal-ekleri',
    tr: 'Hal Ekleri',
    uz: 'Ulashish qoʻshimchalari',
    descKey: 'vocab.grammar.desc.participles',
    forms: [
      {
        suffix: '-an / -en',
        whenKey: 'vocab.grammar.when.present',
        formula: 'oku + an → okuyan',
        uz: 'oʻqiydigan',
        exTr: 'Kitap okuyan öğrenci.',
        exUz: 'Kitob oʻqiydigan talaba.',
      },
      {
        suffix: '-dık / -dik',
        whenKey: 'vocab.grammar.when.past',
        formula: 'yap + dık → yaptık',
        uz: 'amalga oshirilgan, qilinganlarimiz',
        exTr: 'Yaptıklarımız çok iyi oldu.',
        exUz: 'Qilinganlarimiz juda yaxshi boʻldi.',
      },
      {
        suffix: '-acak / -ecek',
        whenKey: 'vocab.grammar.when.future',
        formula: 'yaz + acak → yazacak',
        uz: 'yozadigan, yozmoqchi',
        exTr: 'Yazacaklarım çok fazla.',
        exUz: 'Yozadiganlarim juda koʻp.',
      },
    ],
  },
  {
    id: 'baglaclar',
    tr: 'Bağlaçlar',
    uz: 'Bogʻlovchilar',
    descKey: 'vocab.grammar.desc.connectors',
    forms: [
      {
        suffix: '- mı / -mi / -mu / -mü',
        whenKey: 'vocab.grammar.when.question',
        formula: 'kitap + mı → kitap mı?',
        uz: '...mi? (soʻroq)',
        exTr: 'Bu bir kitap mı?',
        exUz: 'Bu bir kitobmi?',
      },
      {
        suffix: '- ki / -kı / -ku / -kü',
        whenKey: 'vocab.grammar.when.relative',
        formula: 'ev + i + ki → evindeki',
        uz: '-da boʻlgan (qaytgan)',
        exTr: 'Öğrenci evindeki kitapları okudu.',
        exUz: 'Talaba uyidagi kitoblarni oʻqidi.',
      },
      {
        suffix: '- ce / - ça',
        whenKey: 'vocab.grammar.when.manner',
        formula: 'Türk + ce → Türkçe',
        uz: '-cha, -bilan',
        exTr: 'Türkçe konuşuyorum.',
        exUz: 'Turkcha gaplashmaq.',
      },
      {
        suffix: '-dıkça / -dikçe',
        whenKey: 'vocab.grammar.when.repeated',
        formula: 'çalış + dıkça → çalıştıkça',
        uz: 'qancha koʻp... shuncha',
        exTr: 'Çalıştıkça şansımız artar.',
        exUz: 'Qancha koʻp ishlasak, omadimiz ortadi.',
      },
    ],
  },
  {
    id: 'sifat-fiiller',
    tr: 'Sifat-Fiiller',
    uz: 'Sifatdoshlar (-an/-en, -dık, -acak)',
    descKey: 'vocab.grammar.desc.participleUse',
    forms: [
      {
        suffix: '-an / -en',
        whenKey: 'vocab.grammar.when.presentParticiple',
        formula: 'okuyan öğrenci',
        uz: 'oʻqiydigan (talaba)',
        exTr: 'Kitap okuyan öğrenci okula gitti.',
        exUz: 'Kitob oʻqiydigan talaba maktabga ketdi.',
      },
      {
        suffix: '-dık / -dik',
        whenKey: 'vocab.grammar.when.pastParticiple',
        formula: 'yaptığımız işler',
        uz: 'qilingan, amalga oshirilgan',
        exTr: 'Dün yaptığımız işler lazım.',
        exUz: 'Kecha qilgan ishlarimiz kerak.',
      },
      {
        suffix: '-acak / -ecek',
        whenKey: 'vocab.grammar.when.futureParticiple',
        formula: 'yapacaklarımız',
        uz: 'qilmoqchi boʻlganlarimiz',
        exTr: 'Yapacaklarımızı planlıyoruz.',
        exUz: 'Qilmoqchi boʻlganlarimizni rejalashtirmoqdamiz.',
      },
    ],
  },
]

function ComparisonCard({ item, t, language }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-5 dark:border-slate-800">
        <BookText className="h-5 w-5 text-teal-700 dark:text-teal-400" />
        <h3 className="font-display text-base font-extrabold text-slate-800 dark:text-white">
          {item.tr}
        </h3>
        {language === 'uz' && <span className="rounded-lg bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">{item.uz}</span>}
      </div>
      <p className="px-5 pt-3 text-xs leading-relaxed text-slate-400 dark:text-slate-500">
        {t(item.descKey)}
      </p>
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {item.forms.map((f) => (
          <div
            key={f.suffix}
            className="rounded-xl border border-slate-100 bg-slate-50 p-4 ring-1 ring-slate-200 dark:border-slate-800 dark:bg-slate-800/50 dark:ring-slate-700"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-lg font-extrabold text-teal-700 dark:text-teal-300">
                {f.suffix}
              </span>
              <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-cyan-500/10 dark:text-teal-300">
                {t(f.whenKey)}
              </span>
            </div>

            {/* Formula box */}
            <div className="mt-3 rounded-lg bg-white p-3 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {t('vocab.formula')}
              </div>
              <div className="mt-0.5 font-mono text-sm font-extrabold text-slate-700 dark:text-slate-200">
                {f.formula}
              </div>
              {language === 'uz' && <div className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">→ {f.uz}</div>}
            </div>

            <p className="mt-3 rounded-lg bg-teal-50 p-2.5 text-[13px] font-semibold text-slate-700 ring-1 ring-teal-100 dark:bg-teal-500/10 dark:text-slate-200 dark:ring-teal-800/40">
              {f.exTr}
            </p>
            {language === 'uz' && <p className="mt-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">{f.exUz}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function VocabularyFlashcards({ cheatOnly = false, onToast, onMasteryCountChange, onNewWordLearned, isPremium = false, onStudyComplete, onReturnToDashboard }) {
  const { language, t } = useI18n()
  const [view, setView] = useState('vocab') // vocab | grammar
  const [mastery, setMastery] = useState(() => loadJSON(MASTERY_KEY, {}))
  const [saved, setSaved] = useState(() => loadJSON(SAVED_KEY, []))
  const [filter, setFilter] = useState('all') // all | B1 | B2 | C1 | saved
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [shuffled, setShuffled] = useState(false)

  const list = useMemo(() => {
    let l = flashcards.filter((c) =>
      filter === 'saved' ? saved.includes(c.tr) : filter === 'all' || c.level === filter,
    )
    if (shuffled) l = [...l].sort(() => Math.random() - 0.5)
    return l
  }, [filter, saved, shuffled])

  useEffect(() => {
    if (index >= list.length) {
      setIndex(0)
      setFlipped(false)
    }
  }, [list, index])

  useEffect(() => {
    try {
      localStorage.setItem(MASTERY_KEY, JSON.stringify(mastery))
    } catch {
      // storage might be unavailable; mastery still works in-memory
    }
    onMasteryCountChange?.(Object.values(mastery).filter((value) => value === 'known').length)
  }, [mastery, onMasteryCountChange])

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(saved))
    } catch {
      // ignore storage failures
    }
  }, [saved])

  const counts = {
    all: flashcards.length,
    B1: flashcards.filter((c) => c.level === 'B1').length,
    B2: flashcards.filter((c) => c.level === 'B2').length,
    C1: flashcards.filter((c) => c.level === 'C1').length,
    saved: saved.length,
  }
  const knownCount = Object.values(mastery).filter((v) => v === 'known').length
  const repeatCount = Object.values(mastery).filter((v) => v === 'repeat').length

  const current = list[Math.min(index, list.length - 1)] || flashcards[0]
  const cardKey = current.tr
  const isKnown = mastery[cardKey] === 'known'
  const isRepeat = mastery[cardKey] === 'repeat'
  const isSaved = saved.includes(cardKey)

  function nextCard() {
    setFlipped(false)
    setIndex((i) => (i + 1) % Math.max(1, list.length))
  }

  function prevCard() {
    setFlipped(false)
    setIndex((i) => (i - 1 + list.length) % Math.max(1, list.length))
  }

  function shuffle() {
    setShuffled((s) => !s)
    setIndex(0)
    setFlipped(false)
  }

  function markKnown() {
    if (mastery[cardKey] === undefined) onNewWordLearned?.(cardKey)
    setMastery((m) => ({ ...m, [cardKey]: m[cardKey] === 'known' ? undefined : 'known' }))
  }

  function markRepeat() {
    setMastery((m) => ({ ...m, [cardKey]: m[cardKey] === 'repeat' ? undefined : 'repeat' }))
  }

  function toggleSave() {
    if (saved.includes(cardKey)) {
      setSaved((s) => s.filter((w) => w !== cardKey))
      onToast?.(t('vocab.toast.removed', { word: cardKey }), 'save')
    } else {
      setSaved((s) => [...s, cardKey])
      onToast?.(t('vocab.toast.saved', { word: cardKey }), 'save')
    }
  }

  async function copyWord() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(current.tr)
      }
    } catch {
      // clipboard unavailable in some browsers — toast still shows
    }
    onToast?.(t('vocab.toast.copied', { word: current.tr }), 'copy')
  }

  const FILTERS = [
    { id: 'all', labelKey: 'vocab.filter.all' },
    { id: 'B1', label: 'B1' },
    { id: 'B2', label: 'B2' },
    { id: 'C1', label: 'C1' },
    { id: 'saved', labelKey: 'vocab.filter.saved' },
  ]

  const GrammarView = (
    <div className="space-y-5">
      <div className="grid gap-5">
        {GRAMMAR_COMPARISONS.map((item) => (
          <ComparisonCard key={item.id} item={item} t={t} language={language} />
        ))}
      </div>
      <EklerSection t={t} />
    </div>
  )

  if (cheatOnly) {
    return GrammarView
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex flex-wrap items-center gap-2">
          <Users2 className="h-5 w-5 text-teal-700 dark:text-teal-400" />
          <h1 className="font-display text-xl font-extrabold text-slate-800 dark:text-white">
            {t('vocab.title')}
          </h1>
          <span className="ml-auto flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t('vocab.known')} {knownCount}
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
              <RefreshCw className="h-3.5 w-3.5" />
              {t('vocab.repeat')} {repeatCount}
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-teal-50 px-2 py-1 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
              <Star className="h-3.5 w-3.5" />
              {t('vocab.saved')} {saved.length}
            </span>
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {t('vocab.intro')}
        </p>
      </div>

      {/* View toggle — Lugʻat / Grammatika */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'vocab', labelKey: 'vocab.tab.words', icon: Users2 },
          { id: 'study', labelKey: 'vocab.tab.study', icon: Sparkles },
          { id: 'grammar', labelKey: 'vocab.tab.grammar', icon: BookText },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setView(tab.id)}
              data-view={tab.id}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition-all active:scale-95',
                view === tab.id
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-900/20'
                  : 'border border-slate-200/80 bg-white text-slate-500 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400',
              )}
            >
              <Icon className="h-4 w-4" />
              {t(tab.labelKey)}
            </button>
          )
        })}
      </div>

      {view === 'grammar' ? (
        <div key="grammar" className="animate-fadein">
          {GrammarView}
        </div>
      ) : view === 'study' ? (
        <div key="study" className="animate-fadein">
          <FlashcardStudyMode
            savedWords={saved}
            isPremium={isPremium}
            onComplete={onStudyComplete}
            onReturnToDashboard={onReturnToDashboard}
            onReturnToVocabulary={() => setView('vocab')}
          />
        </div>
      ) : (
        <div key="vocab" className="animate-fadein space-y-5">
          {/* Level filter tabs */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setFilter(f.id)
                  setIndex(0)
                  setFlipped(false)
                }}
                data-filter={f.id}
                className={cn(
                  'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-extrabold transition-all active:scale-95',
                  filter === f.id
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-900/20'
                    : 'border border-slate-200/80 bg-white text-slate-500 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400',
                )}
              >
                {f.labelKey ? t(f.labelKey) : f.label}
                <span
                  className={cn(
                    'grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-extrabold',
                    filter === f.id ? 'bg-white/25' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
                  )}
                >
                  {counts[f.id]}
                </span>
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-800">
              <Star className="mx-auto h-8 w-8 text-amber-500" />
              <p className="mt-3 text-sm font-bold text-slate-500 dark:text-slate-400">
                {t('vocab.empty')}
              </p>
            </div>
          ) : (
            <>
              {/* Flashcard */}
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center">
                <div className="w-full max-w-md">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setFlipped((f) => !f)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setFlipped((f) => !f)
                      }
                    }}
                    className="flip-card block w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
                    aria-label={t('vocab.flip')}
                  >
                    <div className={cn('flip-inner', flipped && 'flipped')}>
                      {/* Face */}
                      <div className="relative flex h-72 flex-col items-center justify-center gap-4 rounded-3xl border border-teal-200 bg-gradient-to-br from-white to-teal-50 p-8 shadow-xl dark:border-teal-800/50 dark:from-slate-800 dark:to-teal-950/60">
                        <span className="absolute right-4 top-4 flex gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              copyWord()
                            }}
                            aria-label={t('vocab.copy')}
                            className="grid h-9 w-9 place-items-center rounded-lg bg-white/80 text-teal-700 shadow-sm ring-1 ring-slate-200 backdrop-blur transition-all hover:scale-110 active:scale-95 dark:bg-slate-700/80 dark:text-teal-300 dark:ring-slate-600"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleSave()
                            }}
                            aria-label={t('vocab.save')}
                            className="grid h-9 w-9 place-items-center rounded-lg bg-white/80 shadow-sm ring-1 ring-slate-200 backdrop-blur transition-all hover:scale-110 active:scale-95 dark:bg-slate-700/80 dark:ring-slate-600"
                          >
                            {isSaved ? (
                              <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                            ) : (
                              <Star className="h-4 w-4 text-slate-400" />
                            )}
                          </button>
                        </span>
                        <span className="rounded-full bg-teal-100 px-3 py-1 text-[11px] font-bold tracking-widest text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                          {t('vocab.turkish')} · {current.level}
                        </span>
                        <div className="font-display text-5xl font-extrabold text-slate-800 dark:text-white">
                          {current.tr}
                        </div>
                        <div className="text-lg font-bold tracking-wide text-teal-700 dark:text-teal-300">
                          /{current.oqishi}/
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setFlipped(false)
                            copyWord()
                          }}
                          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-600/90 to-cyan-500/90 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          {t('vocab.copy')}
                        </button>
                      </div>
                      {/* Back */}
                      <div className="flip-face flip-back flex flex-col items-center justify-center gap-4 rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-8 shadow-xl dark:border-rose-900/50 dark:from-rose-950/60 dark:to-slate-800">
                        <div className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                          {t('vocab.uzbek')}
                        </div>
                        <div className="font-display text-3xl font-extrabold text-slate-800 dark:text-white">
                          {current.uz}
                        </div>
                        <div className="h-px w-24 bg-rose-200 dark:bg-rose-800/60" />
                        <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                          {current.exTr}
                        </p>
                        <p className="text-sm font-bold text-rose-600 dark:text-rose-300">
                          {current.exUz}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setFlipped(true)
                            copyWord()
                          }}
                          className="flex items-center gap-1.5 rounded-full bg-rose-600/90 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          {t('vocab.copy')}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Nav + mastery buttons */}
                  <div className="mt-5 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={prevCard}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-sm font-bold text-slate-500 shadow-sm transition-all hover:border-teal-300 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {t('common.previous')}
                    </button>
                    <span className="font-display font-extrabold text-slate-700 dark:text-slate-200">
                      {index + 1} / {list.length}
                    </span>
                    <button
                      type="button"
                      onClick={nextCard}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 px-3 py-2 text-sm font-bold text-white shadow-lg shadow-teal-900/20 transition-all hover:from-teal-700 hover:to-cyan-600 active:scale-95"
                    >
                      {t('common.next')}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Mastery buttons */}
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      aria-label={t('vocab.markKnown')}
                      onClick={markKnown}
                      className={cn(
                        'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-extrabold transition-all active:scale-95',
                        isKnown
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                          : 'border border-slate-200/80 bg-white text-slate-500 hover:border-emerald-300 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400',
                      )}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {t('vocab.markKnown')} ✅
                    </button>
                    <button
                      type="button"
                      aria-label={t('vocab.markRepeat')}
                      onClick={markRepeat}
                      className={cn(
                        'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-extrabold transition-all active:scale-95',
                        isRepeat
                          ? 'bg-amber-500 text-white shadow-lg shadow-amber-900/20'
                          : 'border border-slate-200/80 bg-white text-slate-500 hover:border-amber-300 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400',
                      )}
                    >
                      <RefreshCw className="h-4 w-4" />
                      {t('vocab.markRepeat')} 🔄
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={shuffle}
                  className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm transition-all hover:border-teal-300 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                >
                  <RotateCcw className={cn('h-4 w-4', shuffled && 'animate-spin')} />
                  {t('vocab.shuffle')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleSave()
                    if (!isSaved) nextCard()
                  }}
                  className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 shadow-sm ring-1 ring-amber-200 transition-all hover:bg-amber-100 active:scale-95 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-900/40"
                >
                  <Star className="h-4 w-4" />
                  {isSaved ? `${t('vocab.saved')} ⭐ — ${t('vocab.removeSaved')}` : `⭐ ${t('vocab.save')}`}
                </button>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {t('vocab.autoSave')}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ----------------------------------------------------------------------
// Ekler (suffix cheat sheet) section — vowel harmony + suffix table +
// suffix playground
// ----------------------------------------------------------------------
function EklerSection({ t }) {
  const [playWord, setPlayWord] = useState(suffixPlayground.words[0])
  const [playSuffix, setPlaySuffix] = useState(suffixPlayground.suffixes[0].id)
  const built = buildSuffix(playWord, playSuffix)

  return (
    <div className="space-y-5">
      {/* Vowel harmony */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h2 className="font-display text-lg font-extrabold text-slate-800 dark:text-white">
            {t('vocab.harmony')}
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {vowelHarmony.map((group) => (
            <div
              key={group.group}
              className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700"
            >
              <div className="mb-3 font-bold text-slate-700 dark:text-slate-200">{t(group.labelKey)}</div>
              <div className="mb-3 flex flex-wrap gap-2">
                {group.vowels.map((v) => (
                  <span
                    key={v}
                    className="grid h-9 w-9 place-items-center rounded-lg bg-white font-display text-lg font-extrabold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700"
                  >
                    {v}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.suffixes.map((s) => (
                  <span
                    key={s}
                    className="rounded-lg bg-teal-100 px-2 py-1 font-bold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.examples.map((e) => (
                  <span
                    key={e}
                    className="rounded-lg bg-white px-2 py-1 font-mono text-xs font-bold text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suffix table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 border-b border-slate-100 p-5 dark:border-slate-800">
          <Table2 className="h-5 w-5 text-teal-700 dark:text-teal-400" />
          <h2 className="font-display text-lg font-extrabold text-slate-800 dark:text-white">
            {t('vocab.suffixTable')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-widest text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                <th className="px-5 py-3">{t('vocab.type')}</th>
                <th className="px-5 py-3">{t('vocab.suffix')}</th>
                <th className="px-5 py-3">{t('vocab.meaning')}</th>
                <th className="px-5 py-3">{t('vocab.example')}</th>
              </tr>
            </thead>
            <tbody>
              {suffixTable.map((row) => (
                <tr
                  key={row.typeKey}
                  className="border-t border-slate-100 text-slate-600 dark:border-slate-800/50 dark:text-slate-300"
                >
                  <td className="px-5 py-3 font-bold text-slate-800 dark:text-white">{t(row.typeKey)}</td>
                  <td className="px-5 py-3 font-mono font-bold text-teal-700 dark:text-teal-300">
                    {row.suffix}
                  </td>
                  <td className="px-5 py-3">{t(row.meaningKey)}</td>
                  <td className="px-5 py-3 font-mono text-xs">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suffix playground */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-teal-50 to-cyan-50 p-5 shadow-sm dark:border-teal-900/40 dark:from-teal-950/50 dark:to-cyan-950/40">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-teal-700 dark:text-teal-400" />
          <h2 className="font-display text-lg font-extrabold text-slate-800 dark:text-white">
            {t('vocab.suffixGame')}
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Word selector */}
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {t('vocab.chooseWord')}
            </div>
            <div className="flex flex-wrap gap-2">
              {suffixPlayground.words.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setPlayWord(w)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 font-mono font-bold transition-all active:scale-95',
                    playWord === w
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-md shadow-teal-900/20'
                      : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-teal-700 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700',
                  )}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
          {/* Suffix selector */}
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {t('vocab.chooseSuffix')}
            </div>
            <div className="flex flex-wrap gap-2">
              {suffixPlayground.suffixes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setPlaySuffix(s.id)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-bold transition-all active:scale-95',
                    playSuffix === s.id
                      ? 'bg-teal-700 text-white shadow-md shadow-teal-900/20'
                      : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700',
                  )}
                >
                  {t(s.nameKey)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="mt-4 rounded-xl bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900/80 dark:ring-slate-700">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl font-extrabold text-slate-800 dark:text-white">
              {playWord}
            </span>
            <span className="font-display text-3xl font-extrabold text-teal-500">+</span>
            <span className="font-mono text-xl font-bold text-teal-700 dark:text-teal-300">
              {t(suffixPlayground.suffixes.find((s) => s.id === playSuffix)?.nameKey || 'vocab.suffix')}
            </span>
            <span className="ml-auto font-display text-3xl font-extrabold text-white">
              <span className="rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 px-4 py-2 shadow-lg shadow-teal-900/20">
                {built.form}
              </span>
            </span>
          </div>
          <p className="mt-4 rounded-lg bg-slate-50 p-3 text-[13px] leading-relaxed text-slate-500 ring-1 ring-slate-200 dark:bg-slate-950/60 dark:text-slate-400 dark:ring-slate-800">
            {t('vocab.suffix.rule', { word: playWord, suffix: t(suffixPlayground.suffixes.find((s) => s.id === playSuffix)?.nameKey || 'vocab.suffix'), form: built.form })}
          </p>
        </div>
      </div>
    </div>
  )
}
