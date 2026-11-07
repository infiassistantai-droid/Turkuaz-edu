import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { BookmarkPlus, BookOpen, Check, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, Plus, RotateCcw, Search, Trash2 } from 'lucide-react'
import TURKUAZ_LUGAT_DATA from '../../data/turkuaz_lugat.json'
import { STARTER_VOCABULARY, claimVocabularyXpForWord, createVocabularyWord, loadSavedVocabulary, loadTurkuazLearnedIds, normalizeWordKey, saveTurkuazLearnedIds, saveVocabularyState } from '../../data/vocabulary'
import { cn } from '../../lib/utils'
import { useI18n } from '../../lib/i18n.jsx'

const PAGE_SIZE = 20
const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']
const CATALOG_WORDS = TURKUAZ_LUGAT_DATA.map((item, index) => ({
  id: `lugat-${index + 1}`,
  word: String(item.word || item.tr || '').trim(),
  translation: String(item.translation || item.uz || '').trim(),
  english: String(item.english || item.en || '').trim(),
  level: CEFR_LEVELS.includes(String(item.level || '').toUpperCase()) ? String(item.level).toUpperCase() : '',
  example: String(item.example || '').trim(),
})).filter((item) => item.word)

const FIRST_CATALOG_ID_BY_TERM = new Map()
for (const item of CATALOG_WORDS) {
  const key = normalizeCatalogTerm(item.word)
  if (!FIRST_CATALOG_ID_BY_TERM.has(key)) FIRST_CATALOG_ID_BY_TERM.set(key, item.id)
}

function normalizeCatalogTerm(value) {
  return String(value || '').trim().toLocaleLowerCase('tr-TR').replace(/\s+/gu, ' ')
}

function loadInitialCatalogLearnedIds() {
  const ids = new Set(loadTurkuazLearnedIds())
  const previouslyLearnedTerms = new Set(loadSavedVocabulary().filter((word) => word.learned).map((word) => normalizeCatalogTerm(word.tr)))
  for (const item of CATALOG_WORDS) {
    const key = normalizeCatalogTerm(item.word)
    if (FIRST_CATALOG_ID_BY_TERM.get(key) === item.id && previouslyLearnedTerms.has(key)) ids.add(item.id)
  }
  return saveTurkuazLearnedIds([...ids])
}

function normalizeSearch(value) {
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/gu, 'i')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '')
    .trim()
}

export function Flashcard({ word, language = 'uz', flipped, onFlip, dark = false }) {
  const { t } = useI18n()
  const translation = language === 'uz' ? word.uz : word.en || word.uz
  return (
    <button
      type="button"
      onClick={onFlip}
      aria-label={t(flipped ? 'words.card.flipBack' : 'words.card.flip')}
      aria-pressed={flipped}
      className="group w-full rounded-3xl text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/25"
    >
      <span className="block [perspective:1200px]">
        <span className={cn(
          'relative block min-h-[280px] w-full rounded-3xl transition-transform duration-500 ease-out [transform-style:preserve-3d] sm:min-h-[340px]',
          flipped && '[transform:rotateY(180deg)]',
        )}>
          <span aria-hidden={flipped} className={cn(
            'absolute inset-0 flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-3xl border p-7 text-center [backface-visibility:hidden] sm:min-h-[340px] sm:p-10',
            dark ? 'border-white/10 bg-slate-900 text-white shadow-2xl shadow-black/20' : 'border-teal-100 bg-white text-slate-900 shadow-xl shadow-teal-950/10',
          )}>
            <span className={cn('rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[.18em]', dark ? 'bg-teal-300/10 text-teal-200' : 'bg-teal-50 text-teal-800')}>{t('words.card.front')}</span>
            <span lang="tr" className="mt-7 font-serif text-4xl font-black tracking-tight sm:text-5xl">{word.tr}</span>
            <span className={cn('mt-5 inline-flex items-center gap-2 text-xs font-semibold', dark ? 'text-white/55' : 'text-slate-500')}><CircleHelp className="size-4" />{t('words.card.tapHint')}</span>
            <span aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-teal-400/10 blur-3xl transition group-hover:bg-teal-400/20" />
          </span>
          <span aria-hidden={!flipped} className={cn(
            'absolute inset-0 flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-3xl border p-7 text-center [transform:rotateY(180deg)] [backface-visibility:hidden] sm:min-h-[340px] sm:p-10',
            dark ? 'border-emerald-300/15 bg-slate-900 text-white shadow-2xl shadow-black/20' : 'border-emerald-100 bg-white text-slate-900 shadow-xl shadow-emerald-950/10',
          )}>
            <span className={cn('rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[.18em]', dark ? 'bg-emerald-300/10 text-emerald-200' : 'bg-emerald-50 text-emerald-800')}>{t('words.card.back')}</span>
            <span className={cn('mt-7 font-serif text-3xl font-black sm:text-4xl', dark ? 'text-emerald-100' : 'text-emerald-800')}>{translation || t('words.translationMissing')}</span>
            {language !== 'uz' && word.uz && <span className={cn('mt-2 text-sm font-semibold', dark ? 'text-white/55' : 'text-slate-500')}>{word.uz}</span>}
            <span lang="tr" className={cn('mt-5 text-sm font-bold', dark ? 'text-white/65' : 'text-slate-500')}>{word.tr}</span>
          </span>
        </span>
      </span>
    </button>
  )
}

export default function Kelimeler({ onSavedWordsChange, onWordLearned, onNewQuestWord, isPremium = false, dark = false }) {
  const { language, t } = useI18n()
  const isDark = Boolean(isPremium || dark)
  const [words, setWords] = useState(loadSavedVocabulary)
  const [queue, setQueue] = useState(() => loadSavedVocabulary().map((word) => word.id))
  const [learnedCatalogIds, setLearnedCatalogIds] = useState(loadInitialCatalogLearnedIds)
  const [flipped, setFlipped] = useState(false)
  const [form, setForm] = useState({ tr: '', uz: '', en: '' })
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const [levelFilter, setLevelFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const uniqueSavedCount = useMemo(() => new Set(words.map((word) => normalizeWordKey(word.tr))).size, [words])
  const learnedCount = useMemo(() => words.filter((word) => word.learned).length, [words])
  const current = words.find((word) => word.id === queue[0]) || null
  const availableLevels = useMemo(() => [...new Set(CATALOG_WORDS.map((word) => word.level).filter(Boolean))].sort(), [])
  const learnedIdSet = useMemo(() => new Set(learnedCatalogIds), [learnedCatalogIds])
  const catalogLearnedCount = useMemo(() => CATALOG_WORDS.filter((word) => learnedIdSet.has(word.id)).length, [learnedIdSet])

  const normalizedQuery = normalizeSearch(deferredSearchQuery)
  const filteredCatalog = useMemo(() => CATALOG_WORDS.filter((word) => {
    if (levelFilter && word.level !== levelFilter) return false
    if (!normalizedQuery) return true
    const searchable = normalizeSearch([word.word, word.translation, word.english, word.example].join(' '))
    return searchable.includes(normalizedQuery)
  }), [levelFilter, normalizedQuery])
  const totalPages = Math.max(1, Math.ceil(filteredCatalog.length / PAGE_SIZE))
  const visibleCatalog = filteredCatalog.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => {
    saveVocabularyState(words)
    onSavedWordsChange?.(uniqueSavedCount)
  }, [words, uniqueSavedCount, onSavedWordsChange])

  useEffect(() => {
    setQueue((previous) => previous.filter((id) => words.some((word) => word.id === id)))
  }, [words])

  useEffect(() => {
    setCurrentPage(1)
  }, [normalizedQuery, levelFilter])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  const appendWords = (candidates) => {
    const existing = new Set(words.map((word) => normalizeWordKey(word.tr)))
    const added = candidates.filter((word) => {
      const key = normalizeWordKey(word.tr)
      if (!key || existing.has(key)) return false
      existing.add(key)
      return true
    })
    if (!added.length) return false
    setWords((previous) => [...previous, ...added])
    setQueue((previous) => [...previous, ...added.map((word) => word.id)])
    setFlipped(false)
    setNotice(t(added.length === 1 ? 'words.savedOne' : 'words.savedMany', { count: added.length }))
    return true
  }

  const saveStarterWord = (word) => {
    if (!appendWords([word])) setNotice(t('words.alreadySaved'))
  }

  const saveAllStarterWords = () => {
    if (!appendWords(STARTER_VOCABULARY)) setNotice(t('words.startersAlreadySaved'))
  }

  const addCustomWord = (event) => {
    event.preventDefault()
    const clean = { tr: form.tr.trim(), uz: form.uz.trim(), en: form.en.trim() }
    if (!clean.tr || (!clean.uz && !clean.en)) {
      setFormError(t('words.form.required'))
      return
    }
    if (words.some((word) => normalizeWordKey(word.tr) === normalizeWordKey(clean.tr))) {
      setFormError(t('words.form.duplicate'))
      return
    }
    const word = createVocabularyWord(clean, `custom-${Date.now()}`)
    appendWords([word])
    setForm({ tr: '', uz: '', en: '' })
    setFormError('')
  }

  const markLearned = () => {
    if (!current) return
    if (!current.learned) {
      setWords((previous) => previous.map((word) => word.id === current.id ? { ...word, learned: true } : word))
      if (claimVocabularyXpForWord(current.tr)) onWordLearned?.(current)
      onNewQuestWord?.(current.tr)
    }
    setQueue((previous) => previous.slice(1))
    setFlipped(false)
  }

  const markCatalogWordLearned = (entry) => {
    const termKey = normalizeWordKey(entry.word)
    const alreadyLearned = learnedIdSet.has(entry.id)
    if (alreadyLearned) return

    const nextLearnedIds = [...learnedCatalogIds, entry.id]
    setLearnedCatalogIds(nextLearnedIds)
    saveTurkuazLearnedIds(nextLearnedIds)
    setWords((previous) => {
      const existingIndex = previous.findIndex((word) => normalizeWordKey(word.tr) === termKey)
      if (existingIndex >= 0) return previous.map((word, index) => index === existingIndex ? { ...word, learned: true } : word)
      return [...previous, {
        id: `catalog-saved-${entry.id}`,
        tr: entry.word,
        uz: entry.translation,
        en: entry.english,
        learned: true,
      }]
    })

    const learnedWord = { tr: entry.word, uz: entry.translation, en: entry.english, learned: true }
    const earnedXp = claimVocabularyXpForWord(entry.word)
    if (earnedXp) {
      onWordLearned?.(learnedWord)
      onNewQuestWord?.(entry.word)
    }
    setNotice(t(earnedXp ? 'words.catalog.learnedReward' : 'words.catalog.learnedNoReward', { word: entry.word }))
  }

  const reviewAgain = () => {
    if (!current) return
    setQueue((previous) => previous.length > 1 ? [...previous.slice(1), previous[0]] : [...previous])
    setFlipped(false)
  }

  const restartPractice = () => {
    setQueue(words.map((word) => word.id))
    setFlipped(false)
  }

  const removeSavedWord = (wordId) => {
    setWords((previous) => previous.filter((word) => word.id !== wordId))
    setQueue((previous) => previous.filter((id) => id !== wordId))
    if (queue[0] === wordId) setFlipped(false)
  }

  const panel = isDark ? 'border-white/10 bg-slate-950/55 text-white' : 'border-slate-200 bg-white text-slate-900'
  const muted = isDark ? 'text-white/60' : 'text-slate-500'
  const field = isDark ? 'border-white/10 bg-black/30 text-white placeholder:text-white/35 focus:border-teal-300/50' : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-500'

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 pb-10" aria-label={t('words.title')}>
      <header className={cn('flex flex-wrap items-center justify-between gap-4 rounded-3xl border p-5 sm:p-7', panel)}>
        <div className="flex items-center gap-4">
          <span className={cn('grid size-12 place-items-center rounded-2xl', isDark ? 'bg-teal-300/10 text-teal-200' : 'bg-teal-50 text-teal-700')}><BookOpen className="size-6" /></span>
          <div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{t('words.title')}</h1>
            <p className={cn('mt-1 text-sm', muted)}>{t('words.subtitle')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className={cn('min-w-24 rounded-2xl border px-4 py-2.5 text-center', isDark ? 'border-white/10 bg-white/[.04]' : 'border-slate-100 bg-slate-50')}>
            <div className="text-xl font-black tabular-nums">{uniqueSavedCount}</div><div className={cn('text-[10px] font-bold uppercase tracking-wide', muted)}>{t('words.stats.saved')}</div>
          </div>
          <div className={cn('min-w-24 rounded-2xl border px-4 py-2.5 text-center', isDark ? 'border-white/10 bg-white/[.04]' : 'border-slate-100 bg-slate-50')}>
            <div className="text-xl font-black tabular-nums">{learnedCount}</div><div className={cn('text-[10px] font-bold uppercase tracking-wide', muted)}>{t('words.stats.learned')}</div>
          </div>
        </div>
      </header>

      {notice && <p role="status" className={cn('rounded-xl border px-4 py-2.5 text-sm font-semibold', isDark ? 'border-emerald-300/15 bg-emerald-300/[.05] text-emerald-100' : 'border-emerald-100 bg-emerald-50 text-emerald-800')}>{notice}</p>}

      <section className={cn('overflow-hidden rounded-3xl border p-4 sm:p-6', panel)} aria-label={t('words.catalog.title')}>
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">{t('words.catalog.title')}</h2>
            <p className={cn('mt-1 text-sm', muted)}>{t('words.catalog.subtitle', { count: CATALOG_WORDS.length })}</p>
          </div>
          <div className={cn('min-w-44 rounded-2xl border px-4 py-2.5 text-center', isDark ? 'border-emerald-300/15 bg-emerald-300/[.05]' : 'border-emerald-100 bg-emerald-50/70')}>
            <div className="text-xl font-black tabular-nums">{catalogLearnedCount} / {CATALOG_WORDS.length}</div>
            <div className={cn('text-[10px] font-bold uppercase tracking-wide', muted)}>{t('words.catalog.progressLabel')}</div>
          </div>
        </div>
        <div className={cn('mb-5 h-2 overflow-hidden rounded-full', isDark ? 'bg-white/10' : 'bg-slate-100')} role="progressbar" aria-label={t('words.catalog.progressLabel')} aria-valuemin={0} aria-valuemax={CATALOG_WORDS.length} aria-valuenow={catalogLearnedCount}>
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-[width] duration-300" style={{ width: `${Math.min(100, (catalogLearnedCount / CATALOG_WORDS.length) * 100)}%` }} />
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block">
            <span className="sr-only">{t('words.catalog.searchLabel')}</span>
            <Search className={cn('pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2', muted)} />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('words.catalog.searchPlaceholder')}
              className={cn('w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-teal-500/20', field)}
            />
          </label>
          {availableLevels.length > 0 ? (
            <label className="flex items-center gap-2">
              <span className={cn('text-xs font-bold', muted)}>{t('words.catalog.levelLabel')}</span>
              <select value={levelFilter} onChange={(event) => setLevelFilter(event.target.value)} className={cn('min-w-36 rounded-xl border px-3 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-500/20', field)}>
                <option value="">{t('words.catalog.allLevels')}</option>
                {availableLevels.map((level) => <option key={level} value={level}>{level}</option>)}
              </select>
            </label>
          ) : (
            <p className={cn('self-center text-xs', muted)}>{t('words.catalog.levelsUnavailable')}</p>
          )}
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className={cn('text-xs font-semibold', muted)}>{t('words.catalog.results', { count: filteredCatalog.length })}</p>
          <p className={cn('text-xs', muted)}>{t('words.catalog.pageOf', { page: currentPage, pages: totalPages })}</p>
        </div>

        {visibleCatalog.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {visibleCatalog.map((entry) => {
              const isLearned = learnedIdSet.has(entry.id)
              return (
                <li key={entry.id} className={cn('flex min-w-0 flex-col rounded-2xl border p-4 transition-colors', isDark ? 'border-white/10 bg-white/[.025] hover:bg-white/[.045]' : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md hover:shadow-slate-900/5')}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 lang="tr" className="min-w-0 break-words text-lg font-black tracking-tight">{entry.word}</h3>
                    <span className={cn('shrink-0 rounded-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide', entry.level ? isDark ? 'bg-indigo-300/10 text-indigo-100' : 'bg-indigo-50 text-indigo-700' : isDark ? 'bg-white/[.06] text-white/45' : 'bg-slate-100 text-slate-500')}>
                      {entry.level || t('words.catalog.levelUnknown')}
                    </span>
                  </div>
                  <p className={cn('mt-3 text-base font-bold', isDark ? 'text-teal-100' : 'text-teal-800')}><span className={cn('mr-1 text-[10px] font-bold uppercase tracking-wide', muted)}>{t('words.catalog.uzbekLabel')}</span>{entry.translation || '—'}</p>
                  {entry.english && <p className={cn('mt-1 text-xs', muted)}>{entry.english}</p>}
                  <div className={cn('mt-4 flex-1 rounded-xl border px-3 py-2.5', isDark ? 'border-white/[.07] bg-black/15' : 'border-slate-100 bg-white/80')}>
                    <p className={cn('text-[10px] font-extrabold uppercase tracking-wider', muted)}>{t('words.catalog.exampleLabel')}</p>
                    <p className={cn('mt-1 text-xs leading-relaxed', entry.example ? '' : muted)}>{entry.example || t('words.catalog.exampleUnavailable')}</p>
                  </div>
                  <button
                    type="button"
                    disabled={isLearned}
                    onClick={() => markCatalogWordLearned(entry)}
                    className={cn('mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20 disabled:cursor-default', isLearned ? isDark ? 'bg-emerald-300/10 text-emerald-100' : 'bg-emerald-50 text-emerald-800' : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/10 hover:-translate-y-0.5 hover:from-emerald-700 hover:to-teal-700 active:scale-[.98]')}
                  >
                    {isLearned ? <CheckCircle2 className="size-4" /> : <Check className="size-4" />}
                    {t(isLearned ? 'words.catalog.learned' : 'words.catalog.markLearned')}
                    {!isLearned && <span className="text-xs text-white/80">+5 XP</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className={cn('rounded-2xl border border-dashed p-8 text-center text-sm', isDark ? 'border-white/15 text-white/55' : 'border-slate-200 text-slate-500')}>
            <Search className="mx-auto size-7 opacity-50" />
            <p className="mt-2 font-semibold">{t('words.catalog.noResults')}</p>
          </div>
        )}

        <nav className="mt-5 flex items-center justify-between gap-3" aria-label={t('words.catalog.pagination')}>
          <button type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className={cn('inline-flex min-h-10 items-center gap-1 rounded-xl border px-3 py-2 text-xs font-extrabold transition disabled:cursor-not-allowed disabled:opacity-40', isDark ? 'border-white/10 bg-white/[.04] hover:bg-white/10' : 'border-slate-200 bg-white hover:bg-slate-50')}>
            <ChevronLeft className="size-4" />{t('words.catalog.previous')}
          </button>
          <span className={cn('text-xs font-semibold tabular-nums', muted)}>{t('words.catalog.pageOf', { page: currentPage, pages: totalPages })}</span>
          <button type="button" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className={cn('inline-flex min-h-10 items-center gap-1 rounded-xl border px-3 py-2 text-xs font-extrabold transition disabled:cursor-not-allowed disabled:opacity-40', isDark ? 'border-white/10 bg-white/[.04] hover:bg-white/10' : 'border-slate-200 bg-white hover:bg-slate-50')}>
            {t('words.catalog.next')}<ChevronRight className="size-4" />
          </button>
        </nav>
        <p className={cn('mt-3 text-[11px] leading-relaxed', muted)}>{t('words.catalog.sourceLimitations')}</p>
      </section>

      <section className={cn('rounded-3xl border p-4 sm:p-6', panel)} aria-label={t('words.practice.title')}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-lg font-black">{t('words.practice.title')}</h2><p className={cn('mt-1 text-xs', muted)}>{t('words.practice.subtitle')}</p></div>
          {queue.length > 0 && <span className={cn('rounded-full px-3 py-1 text-xs font-extrabold tabular-nums', isDark ? 'bg-teal-300/10 text-teal-100' : 'bg-teal-50 text-teal-800')}>{t('words.queueRemaining', { count: queue.length })}</span>}
        </div>

        {current ? (
          <div className="mx-auto max-w-2xl">
            <Flashcard word={current} language={language} flipped={flipped} onFlip={() => setFlipped((value) => !value)} dark={isDark} />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={reviewAgain} className={cn('min-h-16 rounded-2xl border-2 px-5 py-4 text-base font-black transition hover:-translate-y-0.5 active:scale-[.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/20', isDark ? 'border-amber-300/25 bg-amber-300/[.06] text-amber-100 hover:bg-amber-300/10' : 'border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100')}>
                <RotateCcw className="mr-2 inline size-5" />{t('words.reviewAgain')}
              </button>
              <button type="button" onClick={markLearned} className="min-h-16 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 text-base font-black text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:from-emerald-700 hover:to-teal-700 active:scale-[.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25">
                <Check className="mr-2 inline size-5" />{t('words.gotIt')} <span className="ml-1 text-sm text-white/80">+5 XP</span>
              </button>
            </div>
            <p className={cn('mt-3 text-center text-xs', muted)}>{t('words.rewardOnce')}</p>
          </div>
        ) : words.length > 0 ? (
          <div className={cn('rounded-2xl border border-dashed p-8 text-center', isDark ? 'border-white/15 bg-white/[.02]' : 'border-slate-200 bg-slate-50/60')}>
            <CheckCircle2 className={cn('mx-auto size-9', isDark ? 'text-emerald-200' : 'text-emerald-600')} />
            <h3 className="mt-3 text-lg font-black">{t('words.practice.complete')}</h3>
            <p className={cn('mx-auto mt-1 max-w-md text-sm', muted)}>{t('words.practice.completeHint')}</p>
            <button type="button" onClick={restartPractice} className="mt-4 rounded-xl bg-teal-700 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-teal-800"><RotateCcw className="mr-2 inline size-4" />{t('words.practice.restart')}</button>
          </div>
        ) : (
          <div className={cn('rounded-2xl border border-dashed p-8 text-center', isDark ? 'border-white/15 bg-white/[.02]' : 'border-slate-200 bg-slate-50/60')}>
            <BookmarkPlus className={cn('mx-auto size-9', isDark ? 'text-teal-200' : 'text-teal-700')} />
            <h3 className="mt-3 text-lg font-black">{t('words.practice.empty')}</h3>
            <p className={cn('mx-auto mt-1 max-w-md text-sm', muted)}>{t('words.practice.emptyHint')}</p>
            <button type="button" onClick={saveAllStarterWords} className="mt-4 rounded-xl bg-teal-700 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-teal-800"><BookmarkPlus className="mr-2 inline size-4" />{t('words.saved.addAll')}</button>
          </div>
        )}
      </section>

      <section className={cn('rounded-3xl border p-4 sm:p-6', panel)}>
        <div className="mb-4"><h2 className="text-lg font-black">{t('words.form.title')}</h2><p className={cn('mt-1 text-xs', muted)}>{t('words.form.subtitle')}</p></div>
        <form onSubmit={addCustomWord} className="grid gap-3 sm:grid-cols-3">
          <label className="text-xs font-bold">{t('words.form.turkish')}<input value={form.tr} onChange={(event) => setForm((value) => ({ ...value, tr: event.target.value }))} className={cn('mt-1.5 w-full rounded-xl border px-3 py-3 text-sm outline-none transition focus:ring-2 focus:ring-teal-500/20', field)} placeholder={t('words.form.turkishPlaceholder')} /></label>
          <label className="text-xs font-bold">{t('words.form.uzbek')}<input value={form.uz} onChange={(event) => setForm((value) => ({ ...value, uz: event.target.value }))} className={cn('mt-1.5 w-full rounded-xl border px-3 py-3 text-sm outline-none transition focus:ring-2 focus:ring-teal-500/20', field)} placeholder={t('words.form.uzbekPlaceholder')} /></label>
          <label className="text-xs font-bold">{t('words.form.english')}<input value={form.en} onChange={(event) => setForm((value) => ({ ...value, en: event.target.value }))} className={cn('mt-1.5 w-full rounded-xl border px-3 py-3 text-sm outline-none transition focus:ring-2 focus:ring-teal-500/20', field)} placeholder={t('words.form.englishPlaceholder')} /></label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-3">
            <button type="submit" className="rounded-xl bg-teal-700 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-teal-800"><Plus className="mr-1.5 inline size-4" />{t('words.form.add')}</button>
            {formError && <p role="alert" className="text-xs font-semibold text-rose-600 dark:text-rose-300">{formError}</p>}
          </div>
        </form>
      </section>

      <section className={cn('rounded-3xl border p-4 sm:p-6', panel)}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-black">{t('words.saved.title')}</h2><p className={cn('mt-1 text-xs', muted)}>{t('words.saved.subtitle')}</p></div><button type="button" onClick={saveAllStarterWords} className={cn('rounded-xl border px-3 py-2 text-xs font-extrabold transition', isDark ? 'border-white/10 bg-white/[.04] text-white hover:bg-white/10' : 'border-teal-100 bg-teal-50 text-teal-800 hover:bg-teal-100')}><BookmarkPlus className="mr-1.5 inline size-4" />{t('words.saved.addAll')}</button></div>
        {words.length > 0 ? <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((word) => <li key={word.id} className={cn('flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5', isDark ? 'border-white/10 bg-white/[.03]' : 'border-slate-100 bg-slate-50')}>
            <button type="button" onClick={() => { setQueue((previous) => previous.includes(word.id) ? previous : [...previous, word.id]); setFlipped(false) }} className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/30"><span lang="tr" className="block truncate text-sm font-black">{word.tr}</span><span className={cn('block truncate text-xs', muted)}>{language === 'uz' ? word.uz || word.en : word.en || word.uz}</span></button>
            {word.learned && <CheckCircle2 className="size-4 shrink-0 text-emerald-500" aria-label={t('words.learned')} />}
            <button type="button" onClick={() => removeSavedWord(word.id)} aria-label={t('words.saved.remove', { word: word.tr })} className={cn('grid size-8 shrink-0 place-items-center rounded-lg transition', isDark ? 'text-white/45 hover:bg-rose-400/10 hover:text-rose-200' : 'text-slate-400 hover:bg-rose-50 hover:text-rose-600')}><Trash2 className="size-4" /></button>
          </li>)}
        </ul> : <p className={cn('rounded-xl border border-dashed p-5 text-center text-sm', isDark ? 'border-white/10 text-white/55' : 'border-slate-200 text-slate-500')}>{t('words.saved.empty')}</p>}
      </section>

      <section className={cn('rounded-3xl border p-4 sm:p-6', panel)}>
        <div className="mb-4"><h2 className="text-lg font-black">{t('words.starters.title')}</h2><p className={cn('mt-1 text-xs', muted)}>{t('words.starters.subtitle')}</p></div>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {STARTER_VOCABULARY.map((word) => {
            const saved = words.some((item) => normalizeWordKey(item.tr) === normalizeWordKey(word.tr))
            return <li key={word.id} className={cn('flex items-center gap-3 rounded-xl border px-3 py-2.5', isDark ? 'border-white/10 bg-white/[.03]' : 'border-slate-100 bg-slate-50')}>
              <span className="min-w-0 flex-1"><span lang="tr" className="block truncate text-sm font-black">{word.tr}</span><span className={cn('block truncate text-xs', muted)}>{language === 'uz' ? word.uz : word.en}</span></span>
              <button type="button" disabled={saved} onClick={() => saveStarterWord(word)} aria-label={t(saved ? 'words.starters.saved' : 'words.starters.save', { word: word.tr })} className={cn('grid size-9 shrink-0 place-items-center rounded-xl transition disabled:cursor-default', saved ? isDark ? 'bg-emerald-300/10 text-emerald-200' : 'bg-emerald-50 text-emerald-700' : isDark ? 'bg-teal-300/10 text-teal-100 hover:bg-teal-300/20' : 'bg-teal-50 text-teal-800 hover:bg-teal-100')}>
                {saved ? <Check className="size-4" /> : <BookmarkPlus className="size-4" />}
              </button>
            </li>
          })}
        </ul>
      </section>
    </main>
  )
}
