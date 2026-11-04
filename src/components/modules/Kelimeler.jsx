import { useEffect, useMemo, useState } from 'react'
import { BookmarkPlus, BookOpen, Check, CheckCircle2, CircleHelp, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { STARTER_VOCABULARY, claimVocabularyXpForWord, createVocabularyWord, loadSavedVocabulary, normalizeWordKey, saveVocabularyState } from '../../data/vocabulary'
import { cn } from '../../lib/utils'
import { useI18n } from '../../lib/i18n.jsx'

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
  const [flipped, setFlipped] = useState(false)
  const [form, setForm] = useState({ tr: '', uz: '', en: '' })
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')

  const uniqueSavedCount = useMemo(() => new Set(words.map((word) => normalizeWordKey(word.tr))).size, [words])
  const learnedCount = useMemo(() => words.filter((word) => word.learned).length, [words])
  const current = words.find((word) => word.id === queue[0]) || null

  useEffect(() => {
    saveVocabularyState(words)
    onSavedWordsChange?.(uniqueSavedCount)
  }, [words, uniqueSavedCount, onSavedWordsChange])

  useEffect(() => {
    setQueue((previous) => previous.filter((id) => words.some((word) => word.id === id)))
  }, [words])

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
    <main className="mx-auto w-full max-w-6xl space-y-6 pb-10" aria-label={t('words.title')}>
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
