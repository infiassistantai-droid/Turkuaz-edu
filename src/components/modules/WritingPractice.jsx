import { useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, LoaderCircle, PenLine, Sparkles } from 'lucide-react'
import { useI18n } from '../../lib/i18n.jsx'

const MIN_WORDS = 150
const PROMPT = 'Görev 2: Çevre kirliliğini önlemek için bireylerin alabileceği önlemler nelerdir? En az 150 kelime yazınız.'

const MOCK_REPLACEMENTS = [
  [/\bçevre\b/iu, 'doğal çevre'],
  [/\bkirlilik\b/iu, 'çevre kirliliği'],
  [/\bcok\b/iu, 'çok'],
  [/\bIstanbul\b/iu, 'İstanbul'],
  [/\bTurkce\b/iu, 'Türkçe'],
  [/\bherkez\b/iu, 'herkes'],
  [/\bbir\s+cok\b/iu, 'birçok'],
  [/\bçok\b/iu, 'oldukça'],
  [/\binsanlar\b/iu, 'bireyler'],
  [/\bbence\b/iu, 'kanımca'],
  [/\bve\b/iu, 'bunun yanı sıra'],
  [/\bönemli\b/iu, 'önem taşır'],
]

function mockCorrectionSegments(text) {
  for (const [pattern, replacement] of MOCK_REPLACEMENTS) {
    const match = pattern.exec(text)
    if (!match) continue
    return [
      { type: 'text', value: text.slice(0, match.index) },
      { type: 'del', value: match[0] },
      { type: 'ins', value: replacement },
      { type: 'text', value: text.slice(match.index + match[0].length) },
    ]
  }
  // Keep the learner's exact text and show a clearly labeled sample style edit
  // if no common typo or connector is present in the response.
  return [
    { type: 'text', value: text },
    { type: 'text', value: '\n\n' },
    { type: 'label', value: 'writingPractice.sampleEdit' },
    { type: 'del', value: 'çok' },
    { type: 'text', value: ' ' },
    { type: 'ins', value: 'oldukça' },
  ]
}

async function analyzeWritingMock(text) {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return {
    score: 82,
    level: 'B2',
    markedText: mockCorrectionSegments(text.trim()),
    tips: ['writingPractice.tip1', 'writingPractice.tip2'],
    isMock: true,
  }
}

export default function WritingPractice({ isPremium = false, onBack }) {
  const { t } = useI18n()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const wordCount = useMemo(() => text.trim() ? text.trim().split(/\s+/u).length : 0, [text])
  const reachedMinimum = wordCount >= MIN_WORDS

  const card = isPremium
    ? 'border border-white/20 bg-black/30 text-white shadow-2xl backdrop-blur-xl'
    : 'border border-slate-200/80 bg-white/85 text-slate-900 shadow-[0_12px_34px_rgba(15,23,42,.08)] backdrop-blur-xl'
  const muted = isPremium ? 'text-white/60' : 'text-slate-500'

  async function analyze() {
    if (!text.trim() || loading) return
    setFeedback(null)
    setLoading(true)
    try { setFeedback(await analyzeWritingMock(text)) }
    finally { setLoading(false) }
  }

  return <section className="mx-auto max-w-4xl space-y-5" aria-labelledby="writing-practice-title">
    <header className={`rounded-3xl p-5 sm:p-6 ${card}`}>
      <div className="mb-4"><button type="button" onClick={onBack} className={`inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-bold transition ${isPremium ? 'text-white/70 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-teal-800'}`}><ArrowLeft className="size-4"/>{t('writingPractice.back')}</button></div>
      <div className="flex items-start gap-3">
        <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${isPremium ? 'bg-yellow-300/10 text-yellow-300' : 'bg-teal-50 text-teal-700'}`}><PenLine className="size-6"/></span>
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-bold uppercase tracking-[.15em] ${isPremium ? 'text-yellow-300' : 'text-teal-700'}`}>{t('writingPractice.eyebrow')}</p>
          <h1 id="writing-practice-title" className="mt-1 text-2xl font-extrabold tracking-tight">{t('writingPractice.title')}</h1>
          <p className={`mt-2 text-sm leading-relaxed ${muted}`}>{t('writingPractice.intro')}</p>
        </div>
        <span className={`hidden rounded-full px-3 py-1 text-[10px] font-extrabold sm:inline-flex ${isPremium ? 'bg-yellow-300/10 text-yellow-200' : 'bg-teal-50 text-teal-800'}`}>B1–C1</span>
      </div>
    </header>

    <div className={`rounded-3xl p-5 sm:p-7 ${card}`}>
      <div className="flex items-center gap-2"><Sparkles className={`size-4 ${isPremium ? 'text-yellow-300' : 'text-teal-600'}`}/><h2 className="text-sm font-extrabold uppercase tracking-wider">{t('writingPractice.task')}</h2></div>
      <p lang="tr" className={`mt-3 rounded-2xl p-4 text-base font-semibold leading-relaxed ${isPremium ? 'border border-yellow-300/15 bg-yellow-300/5 text-white' : 'border border-teal-100 bg-teal-50/80 text-slate-800'}`}>{PROMPT}</p>
      <div className={`mt-5 overflow-hidden rounded-2xl border ${isPremium ? 'border-white/20 bg-black/30' : 'border-slate-200 bg-white/75'}`}>
        <label htmlFor="writing-practice-response" className="sr-only">{t('writingPractice.textareaLabel')}</label>
        <textarea
          id="writing-practice-response"
          lang="tr"
          value={text}
          onChange={(event) => { setText(event.target.value); setFeedback(null) }}
          placeholder={t('writingPractice.placeholder')}
          rows={12}
          className={`block min-h-[300px] w-full resize-y border-0 bg-transparent p-4 text-[15px] leading-7 outline-none placeholder:text-slate-400 focus:ring-2 ${isPremium ? 'text-white placeholder:text-white/35 focus:ring-yellow-300/25' : 'text-slate-900 focus:ring-teal-500/20'}`}
        />
        <div className={`flex items-center justify-between gap-3 border-t px-4 py-3 ${isPremium ? 'border-white/10 bg-black/20' : 'border-slate-100 bg-slate-50/80'}`}>
          <span className={`text-xs ${muted}`}>{t('writingPractice.minimumHint', { minimum: MIN_WORDS })}</span>
          <span aria-live="polite" className={`shrink-0 text-sm font-extrabold tabular-nums ${reachedMinimum ? 'text-emerald-500' : isPremium ? 'text-white/65' : 'text-slate-500'}`}>{t('writingPractice.wordCount', { count: wordCount, minimum: MIN_WORDS })}</span>
        </div>
      </div>

      <button type="button" onClick={analyze} disabled={!text.trim() || loading} className={`mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 ${isPremium ? 'bg-gradient-to-r from-yellow-600 to-amber-500 shadow-[0_0_25px_rgba(234,179,8,.25)] hover:from-yellow-500 hover:to-amber-400' : 'bg-gradient-to-r from-teal-700 to-cyan-600 shadow-[0_8px_25px_rgba(13,148,136,.25)] hover:from-teal-600 hover:to-cyan-500'}`}>
        {loading ? <LoaderCircle className="size-4 animate-spin"/> : <Sparkles className="size-4"/>}
        {loading ? t('writingPractice.loading') : t('writingPractice.analyze')}
      </button>
    </div>

    {loading && <div role="status" aria-live="polite" className={`flex items-center justify-center gap-3 rounded-2xl p-5 ${card}`}><LoaderCircle className={`size-5 animate-spin ${isPremium ? 'text-yellow-300' : 'text-teal-700'}`}/><span className="font-bold">{t('writingPractice.loading')}</span></div>}

    {feedback && <article className={`space-y-4 rounded-3xl p-5 sm:p-7 ${card}`}>
      <header className="flex flex-wrap items-center gap-3">
        <span className={`grid size-12 place-items-center rounded-2xl ${isPremium ? 'bg-yellow-300/10 text-yellow-200' : 'bg-teal-50 text-teal-700'}`}><CheckCircle2 className="size-6"/></span>
        <div className="min-w-0 flex-1"><h2 className="text-xl font-extrabold">{t('writingPractice.feedbackTitle')}</h2><p className={`mt-1 text-xs ${muted}`}>{t('writingPractice.mockNotice')}</p></div>
        <div className={`rounded-2xl px-4 py-2 text-center ${isPremium ? 'border border-yellow-300/25 bg-yellow-300/10' : 'border border-teal-100 bg-teal-50'}`}><p className={`text-xs font-bold ${muted}`}>{t('writingPractice.score')}</p><p className={`text-lg font-black ${isPremium ? 'text-yellow-200' : 'text-teal-800'}`}>{feedback.score}/100 <span className="text-sm">· {t('writingPractice.level')} {feedback.level}</span></p></div>
      </header>
      <div className={`rounded-2xl border p-4 leading-8 ${isPremium ? 'border-white/15 bg-black/30' : 'border-slate-200 bg-white/80'}`}>
        <h3 className={`mb-2 text-xs font-extrabold uppercase tracking-wider ${isPremium ? 'text-yellow-200' : 'text-slate-600'}`}>{t('writingPractice.markedText')}</h3>
        <p lang="tr" className={`whitespace-pre-wrap break-words text-sm sm:text-base ${isPremium ? 'text-white/90' : 'text-slate-800'}`}>
          {feedback.markedText.map((part, index) => part.type === 'label'
            ? <span key={index} className={`font-semibold ${muted}`}>{t(part.value)}</span>
            : part.type === 'del'
            ? <del key={index} className="text-rose-500">{part.value}</del>
            : part.type === 'ins'
              ? <ins key={index} className="text-emerald-500 no-underline">{part.value}</ins>
              : <span key={index}>{part.value}</span>)}
        </p>
      </div>
      <div className={`rounded-2xl border p-4 ${isPremium ? 'border-yellow-300/15 bg-yellow-300/[.04]' : 'border-amber-100 bg-amber-50/80'}`}>
        <h3 className={`mb-2 flex items-center gap-2 text-sm font-extrabold ${isPremium ? 'text-yellow-100' : 'text-amber-900'}`}><Sparkles className="size-4 text-amber-500"/>{t('writingPractice.tips')}</h3>
        <ul className={`list-disc space-y-1 pl-5 text-sm leading-relaxed ${isPremium ? 'text-white/75' : 'text-slate-700'}`}>
          {feedback.tips.map((tip) => <li key={tip}>{t(tip)}</li>)}
        </ul>
      </div>
    </article>}
  </section>
}
