import { useCallback, useEffect, useRef, useState } from 'react'
import { Award, Clock3, Download, FileCheck2, Share2, Shield, Sparkles, Trophy } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'

const EXAM_SECONDS = 60 * 60
const QUESTIONS = [
  { id: 1, prompt: 'Aşağıdaki cümlelerin hangisinde yazım yanlışı yoktur?', options: ['Herkez toplantıya zamanında geldi.', 'Herkes toplantıya zamanında geldi.', 'Her kes toplantıya zamanında geldi.', 'Herkez toplantıya zamanında geldi mi?'], answer: 1 },
  { id: 2, prompt: '“Kitapları masanın üzerine bıraktım.” cümlesinde bulunma hâl eki hangisidir?', options: ['-ları', '-ın', '-a', 'Bulunma hâl eki yoktur.'], answer: 3 },
  { id: 3, prompt: 'Boşluğu uygun bağlaçla tamamlayın: “Hava çok soğuktu, ___ dışarı çıkmak zorundaydık.”', options: ['çünkü', 'ancak', 'örneğin', 'üstelik'], answer: 1 },
  { id: 4, prompt: 'Hangisi gelecek zamanla çekimlenmiştir?', options: ['Yarın seni arayacağım.', 'Dün seni aradım.', 'Şimdi seni arıyorum.', 'Her gün seni ararım.'], answer: 0 },
  { id: 5, prompt: '“Çalıştıkça daha iyi sonuçlar alıyorum.” cümlesindeki “-dıkça” eki ne anlamı katar?', options: ['Koşul ve tekrarlanan süreç', 'Geçmiş zaman', 'Eylemi yapan kişi', 'Soru anlamı'], answer: 0 },
  { id: 6, prompt: 'Aşağıdaki ifadelerden hangisi bir öneri bildirir?', options: ['Keşke daha erken gelseydin.', 'Bence toplu taşıma kullanmalıyız.', 'Dün otobüsle geldim.', 'Ne kadar güzel bir şehir!'], answer: 1 },
  { id: 7, prompt: '“Ağzından bal damlıyor.” deyiminin anlamı nedir?', options: ['Çok hızlı konuşmak', 'Güzel ve tatlı sözler söylemek', 'Bir şeyi gizlemek', 'Çok acıkmış olmak'], answer: 1 },
  { id: 8, prompt: 'Paragrafın ana düşüncesini bulmak için öncelikle ne yapılmalıdır?', options: ['Yalnızca son cümleyi okumak', 'Bilinmeyen tüm kelimeleri çevirmek', 'Paragrafı bütün olarak okuyup tekrar eden düşünceleri belirlemek', 'İlk gördüğümüz seçeneği işaretlemek'], answer: 2 },
]

function formatTime(totalSeconds) {
  const minutes = Math.floor(Math.max(0, totalSeconds) / 60)
  const seconds = Math.max(0, totalSeconds) % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function escapeXml(value) {
  return String(value)
    .replace(/[<>&]/gu, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[char])
    .replace(/'/gu, '&apos;')
    .replace(/"/gu, '&quot;')
}

function makeCertificateSvg({ name, date, level, score }) {
  const safeName = escapeXml(name)
  const safeDate = escapeXml(date)
  const safeLevel = escapeXml(level)
  const safeScore = escapeXml(score)
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="848" viewBox="0 0 1200 848">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffdf5"/><stop offset=".5" stop-color="#fffaf0"/><stop offset="1" stop-color="#f9f0d8"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8e4a1"/><stop offset=".5" stop-color="#c69a3a"/><stop offset="1" stop-color="#f0d47d"/></linearGradient>
    <pattern id="motif" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M24 3C30 16 32 18 45 24 32 30 30 32 24 45 18 32 16 30 3 24 16 18 18 16 24 3Z" fill="none" stroke="#b89143" stroke-opacity=".08" stroke-width="1"/></pattern>
  </defs>
  <rect width="1200" height="848" fill="url(#paper)"/><rect width="1200" height="848" fill="url(#motif)"/>
  <rect x="25" y="25" width="1150" height="798" rx="12" fill="none" stroke="url(#gold)" stroke-width="12"/><rect x="49" y="49" width="1102" height="750" rx="8" fill="none" stroke="#8c6a2a" stroke-opacity=".62" stroke-width="2"/><rect x="65" y="65" width="1070" height="718" rx="5" fill="none" stroke="#c69a3a" stroke-opacity=".35" stroke-width="1"/>
  <text x="600" y="145" text-anchor="middle" fill="#9a762d" font-family="Georgia,serif" font-size="20" letter-spacing="8">TURKUAZ EDU</text>
  <path d="M430 172h340" stroke="#c69a3a" stroke-width="2"/><circle cx="600" cy="172" r="5" fill="#c69a3a"/>
  <text x="600" y="245" text-anchor="middle" fill="#28333b" font-family="Georgia,serif" font-size="48" font-weight="700" letter-spacing="2">BAŞARI SERTİFİKASI</text>
  <text x="600" y="302" text-anchor="middle" fill="#69747a" font-family="Georgia,serif" font-size="20">Bu belge, aşağıdaki katılımcının deneme sınavını tamamladığını onaylar.</text>
  <text x="600" y="390" text-anchor="middle" fill="#876720" font-family="Georgia,serif" font-size="42" font-style="italic">${safeName}</text>
  <path d="M280 412h640" stroke="#c69a3a" stroke-opacity=".75" stroke-width="2"/>
  <text x="600" y="468" text-anchor="middle" fill="#69747a" font-family="Georgia,serif" font-size="19">Türkçe Çok Düzeyli Deneme Sınavı</text>
  <text x="600" y="532" text-anchor="middle" fill="#28333b" font-family="Georgia,serif" font-size="28" font-weight="700">CEFR Düzeyi: ${safeLevel}</text>
  <text x="600" y="573" text-anchor="middle" fill="#69747a" font-family="Georgia,serif" font-size="18">Sınav puanı: ${safeScore}/100</text>
  <text x="600" y="626" text-anchor="middle" fill="#69747a" font-family="Georgia,serif" font-size="18">${safeDate}</text>
  <g transform="translate(600 704)"><circle r="48" fill="url(#gold)"/><circle r="38" fill="none" stroke="#fff7d9" stroke-width="2"/><path d="M0-25 7-7 26-7 11 5 17 24 0 13-17 24-11 5-26-7-7-7Z" fill="#fffaf0" stroke="#96702a" stroke-width="1.5"/><circle r="58" fill="none" stroke="#b89143" stroke-width="2" stroke-dasharray="3 5"/></g>
  <path d="M175 704h225M800 704h225" stroke="#9c7a38" stroke-width="1.5"/>
  <text x="288" y="688" text-anchor="middle" fill="#4a4b46" font-family="Georgia,serif" font-size="23" font-style="italic">Turkuaz Edu</text><text x="288" y="735" text-anchor="middle" fill="#78736a" font-family="Georgia,serif" font-size="14">Eğitim Platformu</text>
  <text x="912" y="688" text-anchor="middle" fill="#4a4b46" font-family="Georgia,serif" font-size="22" font-style="italic">Sınav Kurulu</text><text x="912" y="735" text-anchor="middle" fill="#78736a" font-family="Georgia,serif" font-size="14">Yetkili İmza</text>
</svg>`
}

function getCefr(score) {
  if (score >= 87) return 'C1'
  if (score >= 75) return 'B2'
  if (score >= 50) return 'B1'
  return 'A2'
}

export default function MockExamSimulator({ profile, isPremium = false, onToast }) {
  const { t, language } = useI18n()
  const [screen, setScreen] = useState('intro')
  const [secondsLeft, setSecondsLeft] = useState(EXAM_SECONDS)
  const [deadline, setDeadline] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const submitted = useRef(false)
  const premium = Boolean(isPremium)
  const locale = { uz: 'uz-UZ', tr: 'tr-TR', en: 'en-US' }[language] || 'tr-TR'
  const learnerName = [profile?.name, profile?.surname].filter(Boolean).join(' ') || profile?.fullName || t('examSimulator.learnerFallback')
  const date = result?.submittedAt ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(result.submittedAt) : ''
  const levelName = result ? t(`examSimulator.level.${result.level}`) : ''
  const timerWarning = secondsLeft <= 5 * 60

  const submitExam = useCallback((timedOut = false) => {
    if (submitted.current) return
    submitted.current = true
    const expired = timedOut || (deadline !== null && Date.now() >= deadline)
    const correct = QUESTIONS.reduce((sum, question) => sum + (answers[question.id] === question.answer ? 1 : 0), 0)
    const score = Math.round((correct / QUESTIONS.length) * 100)
    setResult({ correct, score, level: getCefr(score), submittedAt: new Date(), timedOut: expired })
    setScreen('results')
  }, [answers, deadline])

  useEffect(() => {
    if (screen !== 'exam' || !deadline) return undefined
    const updateCountdown = () => setSecondsLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)))
    updateCountdown()
    const interval = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(interval)
  }, [screen, deadline])

  useEffect(() => {
    if (screen === 'exam' && secondsLeft === 0) submitExam(true)
  }, [screen, secondsLeft, submitExam])

  function startExam() {
    submitted.current = false
    setAnswers({})
    setResult(null)
    setSecondsLeft(EXAM_SECONDS)
    setDeadline(Date.now() + EXAM_SECONDS * 1000)
    setScreen('exam')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateAnswer(questionId, optionIndex) {
    if (deadline !== null && Date.now() >= deadline) {
      submitExam(true)
      return
    }
    setAnswers((current) => ({ ...current, [questionId]: optionIndex }))
  }

  function certificateSvg() {
    return makeCertificateSvg({ name: learnerName, date, level: levelName, score: result?.score || 0 })
  }

  function downloadCertificate() {
    if (!result) return
    const blob = new Blob([certificateSvg()], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `turkuaz-edu-sertifika-${learnerName.trim().replace(/\s+/gu, '-').toLocaleLowerCase('tr-TR')}.svg`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    onToast?.(t('examSimulator.downloaded'), 'success')
  }

  async function shareCertificate() {
    if (!result) return
    const shareText = t('examSimulator.shareText', { name: learnerName, level: levelName, score: result.score })
    try {
      if (navigator.share) {
        const file = new File([certificateSvg()], `turkuaz-edu-sertifika.svg`, { type: 'image/svg+xml' })
        const shareData = { title: t('examSimulator.certificateTitle'), text: shareText }
        if (navigator.canShare?.({ files: [file] })) shareData.files = [file]
        await navigator.share(shareData)
      }
      else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText)
        onToast?.(t('examSimulator.shareCopied'), 'copy')
      } else {
        window.prompt(t('examSimulator.sharePrompt'), shareText)
      }
    } catch (error) {
      if (error?.name !== 'AbortError') onToast?.(t('examSimulator.shareError'), 'default')
    }
  }

  const shell = premium ? 'border border-yellow-500/25 bg-black/35 text-white shadow-2xl backdrop-blur-xl' : 'border border-slate-200 bg-white text-slate-900 shadow-sm'
  const muted = premium ? 'text-white/60' : 'text-slate-500'

  if (screen === 'intro') return <section className="mx-auto max-w-4xl space-y-5">
    <div className={`overflow-hidden rounded-3xl border p-6 sm:p-9 ${shell}`}>
      <div className="flex flex-wrap items-start gap-4">
        <span className={`grid size-14 place-items-center rounded-2xl ${premium ? 'bg-yellow-300/10 text-yellow-200' : 'bg-teal-50 text-teal-700'}`}><Trophy className="size-7"/></span>
        <div className="min-w-0 flex-1"><p className={`text-xs font-bold uppercase tracking-[.16em] ${premium ? 'text-yellow-300' : 'text-teal-700'}`}>{t('examSimulator.eyebrow')}</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">{t('examSimulator.title')}</h1><p className={`mt-2 max-w-2xl text-sm leading-relaxed ${muted}`}>{t('examSimulator.intro')}</p></div>
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Clock3, title: t('examSimulator.duration'), detail: t('examSimulator.durationValue') },
          { icon: FileCheck2, title: t('examSimulator.questions'), detail: t('examSimulator.questionCount', { count: QUESTIONS.length }) },
          { icon: Shield, title: t('examSimulator.certificate'), detail: t('examSimulator.certificateDetail') },
        ].map(({ icon: Icon, title, detail }) => <div key={title} className={`rounded-2xl border p-4 ${premium ? 'border-white/10 bg-white/[.04]' : 'border-slate-100 bg-slate-50'}`}><Icon className={`size-5 ${premium ? 'text-yellow-300' : 'text-teal-700'}`}/><p className="mt-3 text-sm font-extrabold">{title}</p><p className={`mt-1 text-xs ${muted}`}>{detail}</p></div>)}
      </div>
      <button type="button" onClick={startExam} className={`mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 ${premium ? 'bg-gradient-to-r from-yellow-600 to-amber-500 shadow-[0_0_28px_rgba(234,179,8,.25)]' : 'bg-gradient-to-r from-teal-700 to-cyan-600 shadow-[0_8px_24px_rgba(13,148,136,.22)]'}`}><Sparkles className="size-4"/>{t('examSimulator.start')}</button>
    </div>
  </section>

  if (screen === 'exam') return <section className="mx-auto max-w-4xl space-y-5">
    <div className={`sticky top-16 z-20 flex flex-wrap items-center gap-3 rounded-2xl border p-3 shadow-lg backdrop-blur-xl sm:px-5 ${premium ? 'border-yellow-500/30 bg-black/85 text-white' : 'border-slate-200 bg-white/95 text-slate-900'}`}>
      <Clock3 className={`size-5 ${timerWarning ? 'text-rose-500' : premium ? 'text-yellow-300' : 'text-teal-700'}`}/>
      <div className="min-w-0 flex-1"><p className={`text-xs font-bold uppercase tracking-wider ${muted}`}>{t('examSimulator.timeRemaining')}</p><p role="timer" aria-live="polite" className={`font-mono text-xl font-black tabular-nums ${timerWarning ? 'animate-pulse text-rose-500' : premium ? 'text-yellow-100' : 'text-slate-900'}`}>{formatTime(secondsLeft)}</p></div>
      <span className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${premium ? 'bg-white/10 text-white/80' : 'bg-slate-100 text-slate-600'}`}>{t('examSimulator.answered', { count: Object.keys(answers).length, total: QUESTIONS.length })}</span>
      <button type="button" onClick={() => submitExam(false)} className={`rounded-xl px-4 py-2.5 text-xs font-extrabold text-white ${premium ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-teal-700 hover:bg-teal-800'}`}>{t('examSimulator.submit')}</button>
    </div>

    <header className={`rounded-2xl border p-5 ${shell}`}><h1 className="text-xl font-extrabold">{t('examSimulator.examTitle')}</h1><p className={`mt-1 text-sm ${muted}`}>{t('examSimulator.examHelp')}</p></header>
    <div className="space-y-4">
      {QUESTIONS.map((question, index) => <fieldset key={question.id} className={`rounded-2xl border p-5 sm:p-6 ${shell}`}>
        <legend className="sr-only">{t('examSimulator.questionLabel', { count: index + 1 })}</legend>
        <div className="flex items-start gap-3"><span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-black ${premium ? 'bg-yellow-300/10 text-yellow-200' : 'bg-teal-50 text-teal-800'}`}>{index + 1}</span><p lang="tr" className="pt-1 font-bold leading-relaxed">{question.prompt}</p></div>
        <div className="mt-4 grid gap-2 sm:pl-11">{question.options.map((option, optionIndex) => {
          const selected = answers[question.id] === optionIndex
          return <label key={option} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${selected ? premium ? 'border-yellow-300/55 bg-yellow-300/10 text-yellow-50' : 'border-teal-400 bg-teal-50 text-teal-950' : premium ? 'border-white/10 bg-white/[.025] text-white/80 hover:bg-white/[.07]' : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'}`}><input type="radio" name={`question-${question.id}`} checked={selected} onChange={() => updateAnswer(question.id, optionIndex)} className="mt-0.5 accent-teal-700"/><span lang="tr">{option}</span></label>
        })}</div>
      </fieldset>)}
    </div>
    <div className="flex justify-end"><button type="button" onClick={() => submitExam(false)} className={`rounded-xl px-5 py-3 text-sm font-extrabold text-white ${premium ? 'bg-gradient-to-r from-yellow-600 to-amber-500' : 'bg-gradient-to-r from-teal-700 to-cyan-600'}`}>{t('examSimulator.submit')}</button></div>
  </section>

  if (!result) return null

  const level = t(`examSimulator.level.${result.level}`)
  const certificateFrame = premium ? 'border-yellow-500/35 bg-black/35 p-3 shadow-[0_0_35px_rgba(234,179,8,.1)] backdrop-blur-xl' : 'border-slate-200 bg-white/80 p-3 shadow-xl'
  const certificatePaper = 'relative isolate overflow-hidden border-[10px] border-double border-amber-500/75 bg-gradient-to-br from-[#fffdf5] via-[#fffaf0] to-[#f8f0d8] px-5 py-8 text-slate-800 shadow-inner sm:px-10 sm:py-10'

  return <section className="animate-fadein mx-auto max-w-5xl space-y-5">
    <div className={`rounded-3xl border p-5 sm:p-6 ${shell}`}>
      <div className="flex items-center gap-3"><span className={`grid size-12 place-items-center rounded-2xl ${premium ? 'bg-yellow-300/10 text-yellow-200' : 'bg-emerald-50 text-emerald-700'}`}><Trophy className="size-6"/></span><div className="flex-1"><p className={`text-xs font-bold uppercase tracking-widest ${premium ? 'text-yellow-300' : 'text-teal-700'}`}>{t('examSimulator.resultsEyebrow')}</p><h1 className="text-2xl font-black">{t('examSimulator.resultsTitle')}</h1></div><div className={`rounded-xl px-4 py-2 text-center ${premium ? 'bg-white/10 text-yellow-100' : 'bg-slate-100 text-slate-800'}`}><strong className="block text-xl">{result.score}/100</strong><span className="text-xs font-bold">{result.correct}/{QUESTIONS.length}</span></div></div>
      <p className={`mt-3 text-sm ${muted}`}>{result.timedOut ? t('examSimulator.autoSubmitted') : t('examSimulator.completed')}</p>
    </div>

    <article id="achievement-certificate" className={`rounded-3xl border ${certificateFrame}`}>
      <div className={certificatePaper}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 50% 48%, rgba(198,154,58,.16), transparent 42%), repeating-linear-gradient(45deg, transparent 0 25px, rgba(184,145,67,.045) 25px 26px)' }}/>
        <div className="pointer-events-none absolute inset-3 border border-amber-700/25 sm:inset-5"/>
        <div className="relative flex flex-col items-center text-center">
          <span className="text-[10px] font-bold uppercase tracking-[.35em] text-amber-800 sm:text-xs">Turkuaz Edu · {t('examSimulator.certificateLabel')}</span>
          <span className="my-3 h-px w-36 bg-gradient-to-r from-transparent via-amber-600 to-transparent"/>
          <h2 className="font-serif text-2xl font-black tracking-wide text-slate-800 sm:text-4xl">{t('examSimulator.certificateTitle')}</h2>
          <p className="mt-3 max-w-2xl font-serif text-xs leading-relaxed text-slate-600 sm:text-base">{t('examSimulator.certificateIntro')}</p>
          <p className="mt-7 font-serif text-xs italic text-slate-500 sm:mt-9 sm:text-base">{t('examSimulator.presentedTo')}</p>
          <p className="mt-2 max-w-full break-words font-serif text-2xl font-bold italic text-amber-800 sm:text-4xl">{learnerName}</p>
          <span className="mt-3 h-px w-4/5 max-w-xl bg-gradient-to-r from-transparent via-amber-600/70 to-transparent"/>
          <p className="mt-4 font-serif text-xs text-slate-600 sm:text-base">{t('examSimulator.certificateAchievement')}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full border border-amber-500/40 bg-amber-100/70 px-4 py-2 font-serif text-lg font-bold text-amber-900 sm:text-2xl">{level}</span>
            <span className="rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-bold text-slate-700">{result.score}/100</span>
          </div>
          <p className="mt-4 text-xs font-semibold tracking-wide text-slate-500 sm:text-sm">{date}</p>

          <div className="mt-7 grid w-full grid-cols-1 items-end gap-6 sm:mt-9 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
            <div className="order-2 flex flex-col items-center sm:order-1"><div className="font-serif text-lg italic text-slate-700">Türkçe Eğitim Kurulu</div><div className="mt-1 h-px w-40 bg-amber-800/60"/><span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">{t('examSimulator.signatureLeft')}</span></div>
            <div className="order-1 flex justify-center sm:order-2"><div className="relative grid size-20 place-items-center rounded-full border-4 border-double border-amber-600 bg-gradient-to-br from-amber-100 to-yellow-300 text-amber-900 shadow-lg shadow-amber-900/20"><Award className="size-10"/><Shield className="absolute -bottom-2 -right-2 size-7 rounded-full border-2 border-amber-600 bg-[#fff8e7] p-1 text-amber-800"/></div></div>
            <div className="order-3 flex flex-col items-center"><div className="font-serif text-lg italic text-slate-700">Turkuaz Edu</div><div className="mt-1 h-px w-40 bg-amber-800/60"/><span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">{t('examSimulator.signatureRight')}</span></div>
          </div>
        </div>
      </div>
    </article>

    <div className="flex flex-wrap justify-center gap-3">
      <button type="button" onClick={startExam} className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-extrabold transition ${premium ? 'border-white/15 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50'}`}><Sparkles className="size-4"/>{t('examSimulator.retry')}</button>
      <button type="button" onClick={downloadCertificate} className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 ${premium ? 'bg-gradient-to-r from-yellow-600 to-amber-500 shadow-[0_0_28px_rgba(234,179,8,.28)]' : 'bg-gradient-to-r from-teal-700 to-cyan-600 shadow-[0_8px_25px_rgba(13,148,136,.25)]'}`}><Download className="size-4"/>{t('examSimulator.download')}</button>
      <button type="button" onClick={shareCertificate} className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-extrabold transition ${premium ? 'border-white/15 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50'}`}><Share2 className="size-4"/>{t('examSimulator.share')}</button>
    </div>
  </section>
}
