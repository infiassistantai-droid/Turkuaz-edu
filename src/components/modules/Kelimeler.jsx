import { ModelAsset, PanelHeading, SectionBanner } from '../BosforArtwork'
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { BookmarkCheck, BookmarkPlus, Check, CheckCircle2, ChevronLeft, ChevronRight, Plus, RotateCcw, Search, Trash2 } from 'lucide-react'
import TURKUAZ_LUGAT_DATA from '../../data/turkuaz_lugat.json'
import { STARTER_VOCABULARY, createVocabularyWord, loadSavedVocabulary, loadTurkuazLearnedIds, normalizeWordKey, saveTurkuazLearnedIds, saveVocabularyState } from '../../data/vocabulary'
import { useI18n } from '../../lib/i18n.jsx'
import '../../bosfor-words.css'

const PAGE_SIZE = 20
const VOCABULARY_BATCH_MINIMUM = 20
const VOCABULARY_BATCH_MINIMUM_MS = 10_000
const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']
const CATALOG_WORDS = TURKUAZ_LUGAT_DATA.map((item, index) => ({
  id: `lugat-${index + 1}`,
  word: String(item.word || item.tr || '').trim(),
  translation: String(item.translation || item.uz || '').trim(),
  english: String(item.english || item.en || '').trim(),
  level: CEFR_LEVELS.includes(String(item.level || '').toUpperCase()) ? String(item.level).toUpperCase() : '',
  example: String(item.example || '').trim(),
})).filter((item) => item.word).map((entry) => ({
  ...entry,
  searchable: normalizeSearch([entry.word, entry.translation, entry.english, entry.example].join(' ')),
}))
const AVAILABLE_LEVELS = [...new Set(CATALOG_WORDS.map((word) => word.level).filter(Boolean))].sort()

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

export function Flashcard({ word, language = 'uz', flipped, onFlip }) {
  const { t } = useI18n()
  const translation = (language === 'en' ? word.en || word.uz : word.uz || word.en) || t('words.translationMissing')
  const label = (flipped ? translation : word.tr) + '. ' + t(flipped ? 'words.card.flipBack' : 'words.card.flip')
  return (
    <button type="button" onClick={onFlip} aria-label={label} aria-pressed={flipped} className="words-flashcard">
      <span className="words-card-inner" data-flipped={flipped}>
        <span className="words-card-face" aria-hidden={flipped}>
          <ModelAsset name="lugat" className="size-14 sm:size-16" />
          <span lang="tr" className="text-3xl font-extrabold sm:text-4xl">{word.tr}</span>
          <span className="words-muted text-xs font-semibold">{t('words.card.tapHint')}</span>
        </span>
        <span className="words-card-face words-card-back" aria-hidden={!flipped}>
          <span className="words-muted text-xs font-bold">{t('words.card.back')}</span>
          <span className="text-3xl font-extrabold sm:text-4xl">{translation}</span>
          <span lang="tr" className="words-muted text-sm font-semibold">{word.tr}</span>
        </span>
      </span>
    </button>
  )
}


export default function Kelimeler({ onSavedWordsChange, onBatchComplete, onNewQuestWord, onToast }) {
  const { language, t } = useI18n()
  const [view, setView] = useState('catalog')
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
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const practiceBatchRef = useRef(null)
  const practiceRef = useRef(null)
  const resultsRef = useRef(null)

  const uniqueSavedCount = useMemo(() => new Set(words.map((word) => normalizeWordKey(word.tr))).size, [words])
  const learnedCount = useMemo(() => words.filter((word) => word.learned).length, [words])
  const current = words.find((word) => word.id === queue[0]) || null
  const learnedIdSet = useMemo(() => new Set(learnedCatalogIds), [learnedCatalogIds])
  const catalogLearnedCount = useMemo(() => CATALOG_WORDS.filter((word) => learnedIdSet.has(word.id)).length, [learnedIdSet])

  const normalizedQuery = normalizeSearch(deferredSearchQuery)
  const filteredCatalog = useMemo(() => CATALOG_WORDS.filter((word) => {
    if (levelFilter && word.level !== levelFilter) return false
    if (statusFilter !== 'all' && learnedIdSet.has(word.id) !== (statusFilter === 'learned')) return false
    return word.searchable.includes(normalizedQuery)
  }), [levelFilter, learnedIdSet, normalizedQuery, statusFilter])
  const totalPages = Math.max(1, Math.ceil(filteredCatalog.length / PAGE_SIZE))
  const page = Math.min(currentPage, totalPages)
  const visibleCatalog = filteredCatalog.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    saveVocabularyState(words)
    onSavedWordsChange?.(uniqueSavedCount)
  }, [words, uniqueSavedCount, onSavedWordsChange])

  useEffect(() => {
    setQueue((previous) => previous.filter((id) => words.some((word) => word.id === id)))
  }, [words])

  useEffect(() => {
    setCurrentPage(1)
  }, [normalizedQuery, levelFilter, statusFilter])

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
    const batch = practiceBatchRef.current || {
      wordIds: queue.slice(0, VOCABULARY_BATCH_MINIMUM),
      learnedIds: [],
      newlyLearnedIds: [],
      startedAt: Date.now(),
    }
    if (!practiceBatchRef.current) practiceBatchRef.current = batch
    if (!batch.learnedIds.includes(current.id)) batch.learnedIds.push(current.id)

    if (!current.learned) {
      setWords((previous) => previous.map((word) => word.id === current.id ? { ...word, learned: true } : word))
      batch.newlyLearnedIds.push(current.id)
    }

    const finishesDeck = batch.wordIds.length > 0 && batch.wordIds.every((wordId) => batch.learnedIds.includes(wordId))
    if (finishesDeck) {
      const elapsedMs = Date.now() - batch.startedAt
      if (batch.wordIds.length >= VOCABULARY_BATCH_MINIMUM && batch.learnedIds.length >= batch.wordIds.length) {
        if (elapsedMs < VOCABULARY_BATCH_MINIMUM_MS) {
          const message = t('words.batch.tooFast')
          setNotice(message)
          onToast?.(message, 'default')
        } else {
          batch.newlyLearnedIds.forEach((wordId) => {
            const word = words.find((item) => item.id === wordId)
            if (word) onNewQuestWord?.(word.tr)
          })
          const awarded = onBatchComplete?.(15, 'vocabulary:deck')
          const message = awarded === false ? t('words.batch.limit') : t('words.batch.completed', { count: batch.wordIds.length })
          setNotice(message)
          if (awarded === false) onToast?.(message, 'default')
        }
      } else if (batch.wordIds.length < VOCABULARY_BATCH_MINIMUM) {
        setNotice(t('words.batch.minimum', { count: VOCABULARY_BATCH_MINIMUM }))
      }
      practiceBatchRef.current = null
    }

    setQueue((previous) => previous.slice(1))
    setFlipped(false)
  }

  const markCatalogWordLearned = (entry) => {
    const alreadyLearned = learnedIdSet.has(entry.id)
    if (alreadyLearned) return

    const nextLearnedIds = [...learnedCatalogIds, entry.id]
    setLearnedCatalogIds(nextLearnedIds)
    saveTurkuazLearnedIds(nextLearnedIds)
    // Catalogue learning stays separate from personal saved words and XP quests.
    setNotice(t('words.catalog.learnedNoReward', { word: entry.word }))
  }

  const reviewAgain = () => {
    if (!current) return
    setQueue((previous) => previous.length > 1 ? [...previous.slice(1), previous[0]] : [...previous])
    setFlipped(false)
  }

  const restartPractice = () => {
    practiceBatchRef.current = null
    setQueue(words.map((word) => word.id))
    setFlipped(false)
  }

  const removeSavedWord = (wordId) => {
    if (practiceBatchRef.current?.wordIds.includes(wordId)) practiceBatchRef.current = null
    setWords((previous) => previous.filter((word) => word.id !== wordId))
    setQueue((previous) => previous.filter((id) => id !== wordId))
    if (queue[0] === wordId) setFlipped(false)
  }

  const savedTerms = new Set(words.map((word) => normalizeWordKey(word.tr)))
  const tabs = [
    ['catalog', 'words.view.catalog'],
    ['saved', 'words.view.saved'],
    ['practice', 'words.view.practice'],
  ]

  const saveCatalogWord = (entry) => appendWords([
    createVocabularyWord({ tr: entry.word, uz: entry.translation, en: entry.english }, 'catalog-' + entry.id),
  ])

  const openPractice = (word) => {
    setQueue((previous) => [word.id, ...previous.filter((id) => id !== word.id)])
    setFlipped(false)
    setNotice('')
    setView('practice')
    requestAnimationFrame(() => practiceRef.current?.focus())
  }

  const changePage = (delta) => {
    setCurrentPage((page) => Math.min(totalPages, Math.max(1, page + delta)))
    requestAnimationFrame(() => resultsRef.current?.focus())
  }

  return (
    <section className="bosfor-words mx-auto max-w-6xl space-y-4" aria-labelledby="words-title">
      <SectionBanner name="lugat" titleId="words-title" title={t('words.title')} description={t('words.subtitle')}>
        <span>{uniqueSavedCount} {t('words.stats.saved')}</span>
      </SectionBanner>

      <div className="bosfor-tabs words-tabs" role="group" aria-label={t('words.view.navigation')}>
        {tabs.map(([id, label]) => (
          <button key={id} type="button" className="bosfor-tab" aria-pressed={view === id} onClick={() => { setView(id); setNotice('') }}>
            {t(label)}
          </button>
        ))}
      </div>
      {notice && <p role="status" className="bosfor-inset rounded-xl border px-4 py-2.5 text-sm font-semibold">{notice}</p>}

      {view === 'catalog' && (
        <section className="bosfor-panel rounded-2xl border p-4 sm:p-6" aria-labelledby="words-catalog">
          <PanelHeading name="lugat" titleId="words-catalog" title={t('words.catalog.title')}>
            <span className="bosfor-badge px-2.5 py-1.5 text-xs font-bold">{catalogLearnedCount}/{CATALOG_WORDS.length} {t('words.stats.learned')}</span>
          </PanelHeading>
          <div className="bosfor-track mt-4 h-2 overflow-hidden rounded-full" role="progressbar" aria-label={t('words.catalog.progressLabel')} aria-valuemin={0} aria-valuemax={CATALOG_WORDS.length} aria-valuenow={catalogLearnedCount}>
            <div className="bosfor-progress-fill h-full rounded-full" style={{ width: (catalogLearnedCount / CATALOG_WORDS.length) * 100 + '%' }} />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
            <label className="relative min-w-0">
              <span className="sr-only">{t('words.catalog.searchLabel')}</span>
              <Search className="words-muted pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2" aria-hidden="true" />
              <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t('words.catalog.searchPlaceholder')} className="words-field bosfor-inset w-full rounded-xl border py-2.5 pe-3 ps-9 text-sm" />
            </label>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label={t('words.view.status')} className="words-field bosfor-inset min-w-0 rounded-xl border px-2.5 text-sm">
              <option value="all">{t('words.view.all')}</option>
              <option value="unlearned">{t('words.view.unlearned')}</option>
              <option value="learned">{t('words.learned')}</option>
            </select>
            {AVAILABLE_LEVELS.length > 0 && (
              <select value={levelFilter} onChange={(event) => setLevelFilter(event.target.value)} aria-label={t('words.catalog.levelLabel')} className="words-field bosfor-inset min-w-0 rounded-xl border px-2.5 text-sm">
                <option value="">{t('words.catalog.allLevels')}</option>
                {AVAILABLE_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
              </select>
            )}
          </div>
          <p ref={resultsRef} tabIndex={-1} className="words-muted words-focus mb-3 mt-3 text-xs font-semibold" aria-live="polite">{t('words.catalog.results', { count: filteredCatalog.length })}</p>
          {visibleCatalog.length ? (
            <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleCatalog.map((entry) => {
                const learned = learnedIdSet.has(entry.id)
                const saved = savedTerms.has(normalizeWordKey(entry.word))
                return (
                  <li key={entry.id} className="words-catalog-card bosfor-inset flex min-w-0 flex-col rounded-xl border p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 lang="tr" className="text-lg font-extrabold">{entry.word}</h3>
                      {entry.level && <span className="bosfor-badge px-2 py-0.5 text-xs font-bold">{entry.level}</span>}
                    </div>
                    {entry.translation && <p lang="uz" className="mt-0.5 text-sm font-semibold">{entry.translation}</p>}
                    {entry.english && <p lang="en" className="words-muted mt-0.5 text-xs">{entry.english}</p>}
                    {entry.example && <p lang="tr" className="words-muted mt-2 text-xs italic">{entry.example}</p>}
                    <div className="mt-auto flex flex-wrap gap-2 pt-3">
                      <button type="button" onClick={() => markCatalogWordLearned(entry)} disabled={learned} className="bosfor-control words-action words-learned" data-learned={learned}>
                        {learned ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <Check className="size-4" aria-hidden="true" />}{t(learned ? 'words.catalog.learned' : 'words.catalog.markLearned')}
                      </button>
                      <button type="button" onClick={() => saveCatalogWord(entry)} disabled={saved} aria-label={t(saved ? 'words.starters.saved' : 'words.starters.save', { word: entry.word })} className="bosfor-control words-action">
                        {saved ? <BookmarkCheck className="size-4" aria-hidden="true" /> : <BookmarkPlus className="size-4" aria-hidden="true" />}{t(saved ? 'words.view.savedLabel' : 'words.view.save')}
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="bosfor-inset words-muted rounded-xl border p-5 text-center text-sm">{t('words.catalog.noResults')}</p>
          )}
          {totalPages > 1 && (
            <nav className="mt-4 flex flex-wrap items-center justify-between gap-2" aria-label={t('words.catalog.pagination')}>
              <button type="button" onClick={() => changePage(-1)} disabled={page === 1} className="bosfor-control words-action"><ChevronLeft className="size-4" aria-hidden="true" />{t('words.catalog.previous')}</button>
              <span className="words-muted text-xs tabular-nums">{t('words.catalog.pageOf', { page, pages: totalPages })}</span>
              <button type="button" onClick={() => changePage(1)} disabled={page === totalPages} className="bosfor-control words-action">{t('words.catalog.next')}<ChevronRight className="size-4" aria-hidden="true" /></button>
            </nav>
          )}
        </section>
      )}

      {view === 'saved' && (
        <section className="bosfor-panel rounded-2xl border p-4 sm:p-6" aria-labelledby="words-saved">
          <PanelHeading name="lugat" titleId="words-saved" title={t('words.saved.title')}>
            <span className="bosfor-badge px-2.5 py-1.5 text-xs font-bold">{learnedCount}/{uniqueSavedCount} {t('words.stats.learned')}</span>
          </PanelHeading>
          <details className="bosfor-inset mt-4 rounded-xl border">
            <summary className="words-disclosure">{t('words.form.title')}</summary>
            <form onSubmit={addCustomWord} className="grid gap-2.5 px-3 pb-3 sm:grid-cols-3">
              {['tr', 'uz', 'en'].map((code, index) => {
                const key = ['turkish', 'uzbek', 'english'][index]
                return <label key={code} className="text-xs font-bold">{t('words.form.' + key)}<input lang={code} value={form[code]} onChange={(event) => setForm((value) => ({ ...value, [code]: event.target.value }))} className="words-field bosfor-inset mt-1.5 w-full rounded-xl border px-3 text-sm" placeholder={t('words.form.' + key + 'Placeholder')} /></label>
              })}
              <div className="flex flex-wrap items-center gap-2 sm:col-span-3">
                <button type="submit" className="bosfor-action words-action"><Plus className="size-4" aria-hidden="true" />{t('words.form.add')}</button>
                {formError && <p role="alert" className="text-xs font-semibold">{formError}</p>}
              </div>
            </form>
          </details>
          {words.length ? (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {words.map((word) => <li key={word.id} className="bosfor-inset flex min-w-0 items-center gap-2 rounded-xl border p-2.5">
                <button type="button" onClick={() => openPractice(word)} className="min-h-11 min-w-0 flex-1 text-start" aria-label={t('words.view.practiceWord', { word: word.tr })}>
                  <span lang="tr" className="block break-words text-sm font-extrabold">{word.tr}</span><span className="words-muted block break-words text-xs">{language === 'en' ? word.en || word.uz : word.uz || word.en}</span>
                </button>
                {word.learned && <CheckCircle2 className="size-4 shrink-0" aria-label={t('words.learned')} />}
                <button type="button" onClick={() => removeSavedWord(word.id)} aria-label={t('words.saved.remove', { word: word.tr })} className="words-remove bosfor-control grid size-11 shrink-0 place-items-center rounded-lg"><Trash2 className="size-4" aria-hidden="true" /></button>
              </li>)}
            </ul>
          ) : <p className="words-muted mt-4 text-sm">{t('words.saved.empty')}</p>}
          <details className="bosfor-inset mt-4 rounded-xl border">
            <summary className="words-disclosure">{t('words.starters.title')}</summary>
            <div className="px-3 pb-3">
              <button type="button" onClick={saveAllStarterWords} className="bosfor-control words-action"><BookmarkPlus className="size-4" aria-hidden="true" />{t('words.saved.addAll')}</button>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {STARTER_VOCABULARY.map((word) => {
                  const saved = savedTerms.has(normalizeWordKey(word.tr))
                  return <li key={word.id} className="bosfor-inset flex min-w-0 items-center gap-2 rounded-xl border px-3 py-1">
                    <span className="min-w-0 flex-1"><span lang="tr" className="block break-words text-sm font-extrabold">{word.tr}</span><span className="words-muted block text-xs">{language === 'en' ? word.en || word.uz : word.uz || word.en}</span></span>
                    <button type="button" disabled={saved} onClick={() => saveStarterWord(word)} aria-label={t(saved ? 'words.starters.saved' : 'words.starters.save', { word: word.tr })} className="bosfor-control words-action">
                      {saved ? <Check className="size-4" aria-hidden="true" /> : <BookmarkPlus className="size-4" aria-hidden="true" />}
                    </button>
                  </li>
                })}
              </ul>
            </div>
          </details>
        </section>
      )}

      {view === 'practice' && (
        <section ref={practiceRef} tabIndex={-1} className="bosfor-panel words-focus rounded-2xl border p-4 sm:p-6" aria-labelledby="words-practice">
          <PanelHeading name="quests" titleId="words-practice" title={t('words.practice.title')}>
            {queue.length > 0 && <span className="bosfor-badge px-2.5 py-1.5 text-xs font-bold">{t('words.queueRemaining', { count: queue.length })}</span>}
          </PanelHeading>
          {current ? (
            <div className="mx-auto mt-4 max-w-2xl">
              <Flashcard word={current} language={language} flipped={flipped} onFlip={() => setFlipped((value) => !value)} />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={reviewAgain} className="bosfor-control words-action"><RotateCcw className="size-4" aria-hidden="true" />{t('words.reviewAgain')}</button>
                <button type="button" onClick={markLearned} className="bosfor-action words-action"><Check className="size-4" aria-hidden="true" />{t('words.gotIt')}</button>
              </div>
              <p className="words-muted mt-3 text-center text-xs">{t('words.batch.rewardHint', { count: VOCABULARY_BATCH_MINIMUM, xp: 15 })}</p>
            </div>
          ) : (
            <div className="bosfor-inset mt-4 rounded-xl border p-5 text-center">
              <ModelAsset name={words.length ? 'medal' : 'lugat'} className="size-14" />
              <h3 className="mt-2 font-extrabold">{t(words.length ? 'words.practice.complete' : 'words.practice.empty')}</h3>
              <button type="button" onClick={words.length ? restartPractice : () => setView('catalog')} className="bosfor-action words-action mt-3">
                {t(words.length ? 'words.practice.restart' : 'words.view.catalog')}
              </button>
            </div>
          )}
        </section>
      )}
    </section>
  )
}

