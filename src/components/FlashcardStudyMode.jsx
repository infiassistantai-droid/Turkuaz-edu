import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, CheckCircle2, RotateCcw, Star, Volume2 } from 'lucide-react'
import { flashcards } from '../data/mockExamData'
import { useI18n } from '../lib/i18n.jsx'
import { recordVocabularyRating } from '../lib/vocabularySrs'

export default function FlashcardStudyMode({ savedWords = [], additionalCards = [], isPremium = false, onComplete, onReturnToDashboard, onReturnToVocabulary }) {
  const { t } = useI18n()
  const cardPool = useMemo(() => [...flashcards, ...additionalCards], [additionalCards])
  const cards = useMemo(() => savedWords.map((word) => cardPool.find((item) => item.tr === word)).filter(Boolean), [cardPool, savedWords])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [finished, setFinished] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const completionClaimed = useRef(false)
  const current = cards[index]
  const premium = Boolean(isPremium)

  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  function speakWord() {
    if (!current || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(current.tr)
    utterance.lang = 'tr-TR'
    utterance.rate = 0.88
    utterance.pitch = 1
    utterance.voice = window.speechSynthesis.getVoices().find((voice) => voice.lang?.toLowerCase().startsWith('tr')) || null
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  function rateCard(rating) {
    if (!current || leaving) return
    recordVocabularyRating(current.tr, rating)
    setLeaving(true)
    window.setTimeout(() => {
      if (index + 1 >= cards.length) {
        setFinished(true)
      } else {
        setIndex((value) => value + 1)
        setFlipped(false)
      }
      setLeaving(false)
    }, 260)
  }

  function claimRewardAndReturn() {
    if (!completionClaimed.current) {
      completionClaimed.current = true
      onComplete?.(50)
    }
    onReturnToDashboard?.()
  }

  const faceCard = premium
    ? 'border border-yellow-500/30 bg-black/40 text-white shadow-[0_20px_60px_rgba(0,0,0,.45)] backdrop-blur-2xl'
    : 'border border-slate-200 bg-white text-slate-900 shadow-lg'
  const muted = premium ? 'text-white/60' : 'text-slate-500'

  if (cards.length === 0) return <section className="mx-auto max-w-2xl">
    <div className={`rounded-3xl border border-dashed p-8 text-center shadow-sm sm:p-12 ${premium ? 'border-yellow-500/30 bg-black/35 text-white backdrop-blur-2xl' : 'border-slate-300 bg-white text-slate-900'}`}>
      <Star className={`mx-auto size-10 ${premium ? 'text-yellow-300' : 'text-amber-500'}`}/>
      <h2 className="mt-4 text-xl font-extrabold">{t('srs.empty.title')}</h2>
      <p className={`mx-auto mt-2 max-w-md text-sm leading-relaxed ${muted}`}>{t('vocab.empty')}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onReturnToVocabulary} className={`rounded-xl px-4 py-2.5 text-sm font-bold ${premium ? 'bg-yellow-400 text-slate-950 hover:bg-yellow-300' : 'bg-teal-700 text-white hover:bg-teal-800'}`}><ArrowLeft className="mr-2 inline size-4"/>{t('srs.backToVocabulary')}</button>
        <button type="button" onClick={onReturnToDashboard} className={`rounded-xl border px-4 py-2.5 text-sm font-bold ${premium ? 'border-white/15 text-white hover:bg-white/10' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{t('srs.dashboard')}</button>
      </div>
    </div>
  </section>

  if (finished) return <section className="mx-auto max-w-2xl">
    <div className={`relative overflow-hidden rounded-3xl border p-8 text-center shadow-2xl sm:p-12 ${premium ? 'border-yellow-500/35 bg-black/40 text-white backdrop-blur-2xl' : 'border-slate-200 bg-white text-slate-900 shadow-lg'}`}>
      <span aria-hidden="true" className={`pointer-events-none absolute -right-10 -top-10 size-40 rounded-full blur-3xl ${premium ? 'bg-yellow-400/15' : 'bg-emerald-300/25'}`}/>
      <div className={`relative mx-auto grid size-16 place-items-center rounded-2xl ${premium ? 'bg-yellow-300/10 text-yellow-200' : 'bg-emerald-50 text-emerald-600'}`}><CheckCircle2 className="size-9"/></div>
      <h2 className={`relative mt-5 text-2xl font-black leading-tight ${premium ? 'text-yellow-100' : 'text-slate-900'}`}>{t('srs.complete.title')}</h2>
      <p className={`relative mt-2 text-sm ${muted}`}>{t('srs.complete.body', { count: cards.length })}</p>
      <button type="button" onClick={claimRewardAndReturn} className={`relative mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 ${premium ? 'bg-gradient-to-r from-yellow-600 to-amber-500 shadow-[0_0_28px_rgba(234,179,8,.25)]' : 'bg-gradient-to-r from-teal-700 to-cyan-600 shadow-lg shadow-teal-900/20'}`}>
        <CheckCircle2 className="size-4"/>{t('srs.complete.dashboard')} <span className={premium ? 'text-yellow-100' : 'text-white/85'}>+50 XP</span>
      </button>
    </div>
  </section>

  if (!current) return null

  return <section className="mx-auto max-w-3xl space-y-5" aria-label={t('srs.title')}>
    <header className={`flex flex-wrap items-center gap-3 rounded-2xl border p-4 ${premium ? 'border-yellow-500/25 bg-black/35 text-white backdrop-blur-xl' : 'border-slate-200 bg-white text-slate-900 shadow-sm'}`}>
      <button type="button" onClick={onReturnToVocabulary} className={`grid size-10 place-items-center rounded-xl transition ${premium ? 'text-yellow-100 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`} aria-label={t('srs.backToVocabulary')}><ArrowLeft className="size-5"/></button>
      <div className="min-w-0 flex-1"><h1 className="font-display text-xl font-extrabold">{t('srs.title')}</h1><p className={`mt-0.5 text-xs ${muted}`}>{t('srs.subtitle')}</p></div>
      <span className={`rounded-full px-3 py-1.5 text-xs font-extrabold tabular-nums ${premium ? 'bg-yellow-300/10 text-yellow-100' : 'bg-teal-50 text-teal-800'}`}>{index + 1} / {cards.length}</span>
    </header>

    <div className={`animate-fadein flashcard-study-entry ${leaving ? 'translate-x-6 rotate-1 scale-[.98] opacity-0' : ''} transition-all duration-300 ease-out`} key={current.tr}>
      <div className="[perspective:1400px]">
        <div className={`relative min-h-[330px] transition-transform duration-500 ease-out [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
          <article className={`absolute inset-0 flex min-h-[330px] flex-col items-center justify-center rounded-3xl p-7 text-center sm:p-10 [backface-visibility:hidden] ${faceCard}`}>
            <p className={`text-xs font-bold uppercase tracking-[.18em] ${premium ? 'text-yellow-300/75' : 'text-teal-700'}`}>{t('srs.frontLabel')}</p>
            <div lang="tr" className={`mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl ${premium ? 'text-yellow-50' : 'text-slate-900'}`}>{current.tr}</div>
            <button type="button" onClick={speakWord} aria-label={t('srs.listen')} className={`mt-5 grid size-11 place-items-center rounded-full transition hover:scale-105 ${premium ? 'bg-yellow-300/10 text-yellow-200 hover:bg-yellow-300/20' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'}`}><Volume2 className={`size-5 ${speaking ? 'animate-pulse' : ''}`}/></button>
            <button type="button" onClick={() => setFlipped(true)} className={`mt-5 rounded-full px-3 py-1.5 text-xs font-bold transition ${premium ? 'text-white/55 hover:bg-white/10 hover:text-yellow-100' : 'text-slate-500 hover:bg-slate-100 hover:text-teal-800'}`} aria-label={t('srs.flip')}>{t('srs.tapToFlip')}</button>
          </article>
          <article className={`absolute inset-0 flex min-h-[330px] flex-col items-center justify-center rounded-3xl p-6 text-center sm:p-9 [transform:rotateY(180deg)] [backface-visibility:hidden] ${faceCard}`}>
            <p className={`text-xs font-bold uppercase tracking-[.18em] ${premium ? 'text-yellow-300/75' : 'text-teal-700'}`}>{t('srs.backLabel')}</p>
            <p className={`mt-3 text-[10px] font-bold uppercase tracking-widest ${muted}`}>{t('srs.pronunciation')}</p>
            <p className={`text-lg font-bold ${premium ? 'text-yellow-100' : 'text-teal-800'}`}>/{current.oqishi}/</p>
            <p className={`mt-1 text-[10px] font-bold uppercase tracking-widest ${muted}`}>{t('srs.translation')}</p>
            <h2 className={`font-serif text-3xl font-bold ${premium ? 'text-white' : 'text-slate-900'}`}>{current.uz}</h2>
            <div className={`my-3 h-px w-20 ${premium ? 'bg-yellow-400/30' : 'bg-slate-200'}`}/>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${muted}`}>{t('srs.example')}</p>
            <p className={`text-sm font-semibold leading-relaxed ${premium ? 'text-white/85' : 'text-slate-700'}`} lang="tr">{current.exTr}</p>
            {current.exUz && <p className={`text-sm ${muted}`}>{current.exUz}</p>}
            <button type="button" onClick={() => setFlipped(false)} className={`mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold ${premium ? 'bg-white/10 text-yellow-100 hover:bg-white/15' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><RotateCcw className="size-3.5"/>{t('srs.flipBack')}</button>
          </article>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3">
      <button type="button" onClick={() => rateCard('again')} className={`rounded-2xl border px-3 py-3.5 text-sm font-extrabold transition hover:-translate-y-0.5 active:scale-95 ${premium ? 'border-rose-400/25 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20' : 'border-rose-200 bg-white text-rose-700 shadow-sm hover:bg-rose-50'}`}>{t('srs.again')}</button>
      <button type="button" onClick={() => rateCard('hard')} className={`rounded-2xl border px-3 py-3.5 text-sm font-extrabold transition hover:-translate-y-0.5 active:scale-95 ${premium ? 'border-amber-400/25 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20' : 'border-amber-200 bg-white text-amber-700 shadow-sm hover:bg-amber-50'}`}>{t('srs.hard')}</button>
      <button type="button" onClick={() => rateCard('easy')} className={`rounded-2xl border px-3 py-3.5 text-sm font-extrabold transition hover:-translate-y-0.5 active:scale-95 ${premium ? 'border-emerald-400/25 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20' : 'border-emerald-200 bg-white text-emerald-700 shadow-sm hover:bg-emerald-50'}`}>{t('srs.easy')}</button>
    </div>
    <p className={`text-center text-xs ${muted}`}>{t('srs.ratingsHelp')}</p>
  </section>
}
