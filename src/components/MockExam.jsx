import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, ArrowRight, BookOpenText, Check, CheckCircle2, Clock, FileCheck2,
  Headphones, Mic, MicOff, Play, RotateCcw, Sparkles, Volume2,
} from 'lucide-react'
import { calculateCertificate, scoreSection, scoreSpeakingParts, scoreWritingTasks } from '../lib/multilevelScoring'
import { generateMockExam, SECTION_LABELS } from '../data/mockExamBank'
import { cn } from '../lib/utils'

const SECTION_KEYS = ['dinleme', 'okuma', 'yazma', 'konusma']
const SECTION_ICONS = { dinleme: Headphones, okuma: BookOpenText, yazma: FileCheck2, konusma: Mic }
const SECTION_META = {
  dinleme: { title: 'Sınav 1 · Dinleme', duration: '45 daqiqa', count: '35 savol', description: '6 bo‘lim: qisqa javob, duyuru, konuşmacı, plan, diyalog va uzun nutq.' },
  okuma: { title: 'Sınav 2 · Okuma', duration: '60 daqiqa', count: '35 savol', description: '5 bo‘lim: boşluk, ilan, başlık, anlatı va biyografik matn.' },
  yazma: { title: 'Sınav 3 · Yazma', duration: '60 daqiqa', count: '2 vazifa', description: 'Resmî mektup (12 raw ball) va kompozitsiya (24 raw ball).' },
  konusma: { title: 'Sınav 4 · Konuşma', duration: '15 daqiqa', count: '3 qism', description: 'Shaxsiy mavzu, 1 daqiqalik tayyorgarlik kartasi va ijtimoiy muhokama.' },
}

function clock(seconds) {
  const value = Math.max(0, seconds)
  const hours = Math.floor(value / 3600)
  const minutes = Math.floor((value % 3600) / 60)
  const remainder = value % 60
  return hours ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}` : `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

function speakTurkish(text) {
  if (!text || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'tr-TR'
  utterance.rate = 0.92
  window.speechSynthesis.speak(utterance)
  return true
}

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/u).filter(Boolean).length : 0
}

const TURKISH_CONNECTORS = ['ancak', 'ayrıca', 'bununla birlikte', 'çünkü', 'dolayısıyla', 'hem', 'örneğin', 'öncelikle', 'sonuç olarak', 'üstelik', 'bu nedenle', 'buna rağmen', 'öte yandan', 'son olarak', 'bunun yanında']

function evaluateWriting(text, prompt) {
  const words = text.trim().split(/\s+/u).filter(Boolean)
  const normalized = text.toLocaleLowerCase('tr-TR')
  const uniqueWords = new Set(words.map((word) => word.toLocaleLowerCase('tr-TR').replace(/[^\p{L}\p{N}]/gu, '')).filter((word) => word.length > 2))
  const diversity = words.length ? uniqueWords.size / words.length : 0
  const connectors = TURKISH_CONNECTORS.filter((connector) => new RegExp(`\\b${connector.replaceAll(' ', '\\s+')}\\b`, 'iu').test(normalized)).length
  const paragraphs = text.split(/\n\s*\n/u).map((paragraph) => paragraph.trim()).filter(Boolean).length
  const sentences = (text.match(/[.!?]+/gu) || []).length
  const countRatio = words.length >= prompt.minWords && words.length <= prompt.maxWords
    ? 1
    : words.length < prompt.minWords
      ? Math.min(1, words.length / prompt.minWords)
      : Math.min(1, prompt.maxWords / words.length)
  const structureRatio = Math.min(1, paragraphs / 3) * 0.55 + Math.min(1, sentences / (prompt.task === 1 ? 5 : 7)) * 0.45
  const connectorRatio = Math.min(1, connectors / (prompt.task === 1 ? 3 : 5))
  const vocabularyRatio = Math.min(1, Math.max(0, (diversity - 0.2) / 0.38))
  const lengthFactor = words.length >= Math.ceil(prompt.minWords * 0.55) ? 1 : words.length / Math.ceil(prompt.minWords * 0.55)
  const raw = Math.round(prompt.maxRaw * (0.3 * countRatio + 0.25 * structureRatio + 0.2 * connectorRatio + 0.25 * vocabularyRatio) * lengthFactor)
  return {
    rawScore: Math.max(0, Math.min(prompt.maxRaw, raw)),
    maxRawScore: prompt.maxRaw,
    wordCount: words.length,
    connectorCount: connectors,
    vocabularyDiversity: Math.round(diversity * 100),
    paragraphCount: paragraphs,
    sentenceCount: sentences,
    checks: {
      length: countRatio,
      structure: structureRatio,
      connectors: connectorRatio,
      vocabulary: vocabularyRatio,
    },
  }
}

function scoreTone(level) {
  if (level === 'C1') return 'border-emerald-300/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
  if (level === 'B2') return 'border-teal-300/50 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300'
  if (level === 'B1') return 'border-amber-300/50 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'
  return 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
}

export default function MockExam({ sectionResults = {}, onSectionComplete, onExamComplete }) {
  const [mock, setMock] = useState(null)
  const [screen, setScreen] = useState('landing')
  const [activeSection, setActiveSection] = useState(null)
  const [completedThisMock, setCompletedThisMock] = useState({})
  const [lastResult, setLastResult] = useState(null)
  const reportedExamRef = useRef(false)

  function generateNewMock() {
    setMock(generateMockExam())
    setCompletedThisMock({})
    setLastResult(null)
    setActiveSection(null)
    reportedExamRef.current = false
    setScreen('overview')
  }

  function openSection(key) {
    setActiveSection(key)
    setLastResult(null)
    setScreen('session')
  }

  function handleSectionComplete(result) {
    setLastResult(result)
    const next = { ...completedThisMock, [result.section]: result }
    setCompletedThisMock(next)
    if (SECTION_KEYS.every((key) => next[key])) {
      const runSignature = SECTION_KEYS.map((key) => next[key].completedAt).join('|')
      if (runSignature !== reportedExamRef.current) {
        reportedExamRef.current = runSignature
        const scaledScores = Object.fromEntries(SECTION_KEYS.map((key) => [key, next[key].scaledScore]))
        const certificate = calculateCertificate(scaledScores)
        onExamComplete?.({
          examId: mock.id,
          completedAt: new Date().toISOString(),
          scores: scaledScores,
          rawScores: Object.fromEntries(SECTION_KEYS.map((key) => [key, next[key].rawScore])),
          sectionResults: next,
          overallScore: certificate.average,
          level: certificate.level,
          earnedXp: SECTION_KEYS.reduce((sum, key) => sum + next[key].earnedXp, 0),
        })
      }
    }
    onSectionComplete?.(result)
    setScreen('result')
  }

  if (screen === 'session' && mock && activeSection) {
    return (
      <SectionSession
        key={`${mock.id}-${activeSection}`}
        mock={mock}
        sectionKey={activeSection}
        onBack={() => setScreen('overview')}
        onComplete={handleSectionComplete}
      />
    )
  }

  if (screen === 'result' && lastResult) {
    const Icon = SECTION_ICONS[lastResult.section]
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <section className="premium-hero rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-500 p-7 text-white shadow-xl sm:p-9">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25"><Icon className="size-6" /></span>
            <div><p className="text-sm text-white/75">Bo‘lim yakunlandi</p><h1 className="text-2xl font-extrabold">{SECTION_LABELS[lastResult.section]} natijasi</h1></div>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/20 bg-black/15 p-4"><p className="text-xs text-white/70">Xom ball</p><p className="mt-1 text-3xl font-extrabold">{lastResult.rawScore}<span className="text-base font-medium text-white/70"> / {lastResult.maxRawScore}</span></p></div>
            <div className="rounded-2xl border border-white/20 bg-black/15 p-4"><p className="text-xs text-white/70">75 ballik shkala</p><p className="mt-1 text-3xl font-extrabold">{lastResult.scaledScore}<span className="text-base font-medium text-white/70"> / 75</span></p></div>
            <div className="rounded-2xl border border-white/20 bg-black/15 p-4"><p className="text-xs text-white/70">CEFR va XP</p><p className="mt-1 text-2xl font-extrabold">{lastResult.level} <span className="text-sm text-white/80">· +{lastResult.earnedXp} XP</span></p></div>
          </div>
          <p className="mt-5 text-sm text-white/80">Natija qurilmangizda saqlandi. To‘liq sertifikat uchun barcha to‘rt bo‘limni yakunlang.</p>
        </section>
        {lastResult.partResults && <section className="glass premium-glass rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h2 className="font-bold text-slate-900 dark:text-white">Bo‘limlar bo‘yicha natija</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{lastResult.partResults.map((part) => <div key={part.partId} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800"><span className="text-slate-700 dark:text-slate-200">{part.title}</span><span className="shrink-0 font-bold tabular-nums text-teal-700 dark:text-teal-300">{part.rawScore}/{part.maxRawScore}</span></div>)}</div></section>}
        {lastResult.taskScores && <section className="glass premium-glass rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h2 className="font-bold text-slate-900 dark:text-white">Yozma vazifalar bo‘yicha natija</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{lastResult.taskScores.map((score, index) => <div key={index} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800"><span className="text-slate-700 dark:text-slate-200">{index === 0 ? 'Mektup' : 'Kompozisyon'}</span><span className="font-bold tabular-nums text-teal-700 dark:text-teal-300">{score}/{index === 0 ? 12 : 24}</span></div>)}</div></section>}
        {lastResult.partScores && <section className="glass premium-glass rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><h2 className="font-bold text-slate-900 dark:text-white">Konuşma qismlari bo‘yicha natija</h2><div className="mt-3 grid grid-cols-3 gap-2">{lastResult.partScores.map((score, index) => <div key={index} className="rounded-xl bg-slate-50 p-3 text-center text-sm dark:bg-slate-800"><span className="block text-slate-500 dark:text-slate-400">Qism {index + 1}</span><span className="font-bold tabular-nums text-teal-700 dark:text-teal-300">{score}/12</span></div>)}</div></section>}
        <div className="flex flex-wrap justify-between gap-3">
          <button type="button" onClick={() => setScreen('overview')} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><ArrowLeft className="size-4"/>Bo‘limlar rejasi</button>
          <button type="button" onClick={() => mock && generateNewMock()} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-2.5 text-sm font-bold text-white"><RotateCcw className="size-4"/>Yangi Mock Boshlash</button>
        </div>
      </div>
    )
  }

  if (!mock || screen === 'landing') {
    return <MockLanding onGenerate={generateNewMock} sectionResults={sectionResults} />
  }

  const certificate = completedThisMock && SECTION_KEYS.every((key) => completedThisMock[key])
    ? calculateCertificate(Object.fromEntries(SECTION_KEYS.map((key) => [key, completedThisMock[key].scaledScore])))
    : null

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">Multilevel · Yangi variant</p><h1 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">To‘liq sinov rejasi</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Har bir yangi to‘plamda savollar va topshiriqlar yangilanadi.</p></div>
        <button type="button" onClick={generateNewMock} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-900/15"><RotateCcw className="size-4"/>Yangi Mock Boshlash</button>
      </div>
      {certificate && <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-800 dark:bg-teal-950/30"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold text-teal-900 dark:text-teal-100">To‘liq mock yakunlandi · {certificate.level}</p><p className="text-sm text-teal-700 dark:text-teal-300">4 bo‘lim o‘rtachasi: {certificate.average} / 75</p></div><span className="text-2xl font-extrabold text-teal-800 dark:text-teal-200">{certificate.average} / 75</span></div></div>}
      <div className="grid gap-4 sm:grid-cols-2">
        {SECTION_KEYS.map((key) => {
          const Icon = SECTION_ICONS[key]
          const result = completedThisMock[key]
          const saved = sectionResults[key]
          return <article key={key} className="glass premium-glass rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-6">
            <div className="flex items-start gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300"><Icon className="size-5"/></span><div className="min-w-0 flex-1"><h2 className="font-bold text-slate-900 dark:text-white">{SECTION_META[key].title}</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{SECTION_META[key].duration} · {SECTION_META[key].count}</p></div>{result && <CheckCircle2 className="size-5 text-emerald-500"/>}</div>
            <p className="mt-4 min-h-12 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{SECTION_META[key].description}</p>
            {result ? <p className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">Ushbu mock: {result.scaledScore}/75 · {result.level}</p> : saved ? <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Oxirgi natija: {saved.scaledScore}/75 · {saved.level}</p> : <p className="mt-3 text-sm text-slate-400">Hozircha natija yo‘q</p>}
            <button type="button" onClick={() => openSection(key)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-2.5 text-sm font-bold text-white"><Play className="size-4"/>{result ? 'Qayta topshirish' : 'Bo‘limni boshlash'}</button>
          </article>
        })}
      </div>
      <p className="text-center text-xs text-slate-400">Sinov ID: {mock.id}</p>
    </div>
  )
}

function MockLanding({ onGenerate, sectionResults }) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="premium-hero relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-500 p-6 text-white shadow-xl sm:p-9">
        <div className="relative z-10 max-w-3xl"><div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold ring-1 ring-white/20"><Sparkles className="size-4"/> BİLİM VE DEĞERLENDİRME · MULTILEVEL</div><h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">Türkçe Multilevel Mock Exam</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85">Dinleme, Okuma, Yazma va Konuşma bo‘limlarini imtihon blueprinti bo‘yicha bajaring. Har bir natija 75 ballik shkalaga o‘girilib, qurilmangizda saqlanadi.</p><button type="button" onClick={onGenerate} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-teal-800 shadow-lg hover:bg-teal-50"><RotateCcw className="size-4"/>Yangi Mock Boshlash</button></div>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{SECTION_KEYS.map((key) => { const Icon = SECTION_ICONS[key]; const saved = sectionResults[key]; return <div key={key} className="glass premium-glass rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/80"><div className="flex items-center gap-2"><Icon className="size-4 text-teal-700 dark:text-teal-300"/><span className="font-semibold text-slate-900 dark:text-white">{SECTION_LABELS[key]}</span></div><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{saved ? `${saved.scaledScore}/75 · ${saved.level}` : '0 / 75 · Hali topshirilmagan'}</p></div> })}</div>
    </div>
  )
}

function SectionSession({ mock, sectionKey, onBack, onComplete }) {
  const section = mock[sectionKey]
  const [secondsLeft, setSecondsLeft] = useState(section.durationMinutes * 60)
  const [showTranscript, setShowTranscript] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [writingText, setWritingText] = useState({})
  const [writingEvaluations, setWritingEvaluations] = useState({})
  const [speakingPartIndex, setSpeakingPartIndex] = useState(0)
  const [speakingDone, setSpeakingDone] = useState({})
  const [speakingScores, setSpeakingScores] = useState([0, 0, 0])
  const [prepSeconds, setPrepSeconds] = useState(60)
  const [prepStarted, setPrepStarted] = useState(false)
  const [recording, setRecording] = useState(false)
  const [recordingError, setRecordingError] = useState('')
  const [audioUrls, setAudioUrls] = useState({})
  const [notes, setNotes] = useState({})
  const questionSection = sectionKey === 'dinleme' || sectionKey === 'okuma'
  const questions = useMemo(() => questionSection ? section.parts.flatMap((part) => part.questions) : [], [section, questionSection])
  const currentQuestion = questions[questionIndex]
  const currentPart = questionSection ? section.parts.find((part) => part.questions.some((item) => item.id === currentQuestion?.id)) : null
  const currentSpeakPart = sectionKey === 'konusma' ? section.parts[speakingPartIndex] : null
  const finishedRef = useRef(false)
  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const recordingChunksRef = useRef([])
  const questionCount = questionSection ? questions.length : sectionKey === 'yazma' ? 2 : 3

  useEffect(() => {
    const interval = window.setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (sectionKey !== 'konusma' || !prepStarted || prepSeconds <= 0) return undefined
    const interval = window.setInterval(() => setPrepSeconds((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(interval)
  }, [sectionKey, prepStarted, prepSeconds])

  useEffect(() => () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    streamRef.current?.getTracks().forEach((track) => track.stop())
    Object.values(audioUrls).forEach((url) => URL.revokeObjectURL(url))
  }, [audioUrls])

  function complete(rawScore, maxRawScore, extra = {}) {
    if (finishedRef.current) return
    finishedRef.current = true
    const scored = scoreSection(sectionKey, rawScore)
    onComplete({
      ...scored,
      maxRawScore,
      earnedXp: Math.round(scored.scaledScore),
      examId: mock.id,
      completedAt: new Date().toISOString(),
      ...extra,
    })
  }

  function submitQuestions() {
    const raw = questions.reduce((sum, question) => sum + (answers[question.id] === question.correctAnswer ? 1 : 0), 0)
    const partResults = section.parts.map((part) => ({
      partId: part.id,
      title: part.title,
      rawScore: part.questions.reduce((sum, question) => sum + (answers[question.id] === question.correctAnswer ? 1 : 0), 0),
      maxRawScore: part.questions.length,
      answered: part.questions.filter((question) => answers[question.id] !== undefined && answers[question.id] !== '').length,
    }))
    complete(raw, questions.length, { answered: Object.keys(answers).filter((key) => answers[key] !== undefined && answers[key] !== '').length, totalQuestions: questions.length, partResults })
  }

  function gradeWriting(task) {
    if (writingEvaluations[task.id]) return
    setWritingEvaluations((previous) => ({ ...previous, [task.id]: evaluateWriting(writingText[task.id] || '', task) }))
  }

  function submitWriting() {
    if (finishedRef.current || section.tasks.some((task) => !writingEvaluations[task.id])) return
    const first = writingEvaluations[section.tasks[0].id].rawScore
    const second = writingEvaluations[section.tasks[1].id].rawScore
    const result = scoreWritingTasks(first, second)
    complete(result.rawScore, result.maxRawScore, { taskScores: [first, second], tasks: section.tasks.map((task) => ({ id: task.id, rawScore: writingEvaluations[task.id].rawScore, ...writingEvaluations[task.id] })) })
  }

  function markSpeakingDone() {
    setSpeakingDone((previous) => ({ ...previous, [currentSpeakPart.id]: true }))
  }

  function submitSpeaking() {
    if (finishedRef.current || section.parts.some((part) => !speakingDone[part.id])) return
    const result = scoreSpeakingParts(speakingScores)
    complete(result.rawScore, result.maxRawScore, { partScores: result.parts, selfEvaluated: true })
  }

  useEffect(() => {
    if (secondsLeft !== 0 || finishedRef.current) return
    if (questionSection) {
      submitQuestions()
      return
    }
    if (sectionKey === 'yazma') {
      const evaluations = section.tasks.map((task) => ({ task, evaluation: evaluateWriting(writingText[task.id] || '', task) }))
      const result = scoreWritingTasks(evaluations[0].evaluation.rawScore, evaluations[1].evaluation.rawScore)
      complete(result.rawScore, result.maxRawScore, { taskScores: [evaluations[0].evaluation.rawScore, evaluations[1].evaluation.rawScore], tasks: evaluations.map(({ task, evaluation }) => ({ id: task.id, ...evaluation })) })
      return
    }
    const result = scoreSpeakingParts(speakingScores)
    complete(result.rawScore, result.maxRawScore, { partScores: result.parts, selfEvaluated: true, timedOut: true })
  }, [secondsLeft])

  async function toggleRecording() {
    setRecordingError('')
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop()
      setRecording(false)
      return
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setRecordingError('Bu brauzerda ovoz yozish qo‘llab-quvvatlanmaydi. Javobingizni og‘zaki aytib, o‘z-o‘zingizni baholang.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const recorder = new MediaRecorder(stream)
      recorderRef.current = recorder
      recordingChunksRef.current = []
      const partId = currentSpeakPart.id
      recorder.addEventListener('dataavailable', (event) => { if (event.data.size) recordingChunksRef.current.push(event.data) })
      recorder.addEventListener('stop', () => {
        const blob = new Blob(recordingChunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrls((previous) => {
          if (previous[partId]) URL.revokeObjectURL(previous[partId])
          return { ...previous, [partId]: url }
        })
        stream.getTracks().forEach((track) => track.stop())
        if (streamRef.current === stream) streamRef.current = null
      }, { once: true })
      recorder.start()
      setRecording(true)
    } catch {
      setRecordingError('Mikrofonga kirish berilmadi. Ruxsatni tekshiring yoki o‘z-o‘zingizni baholashdan foydalaning.')
    }
  }

  function changeSpeakingPart(index) {
    if (recording) toggleRecording()
    setSpeakingPartIndex(index)
    setPrepSeconds(60)
    setPrepStarted(false)
    setRecordingError('')
  }

  const remaining = Math.max(0, section.durationMinutes * 60 - secondsLeft)
  const timerWarning = secondsLeft <= 300

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><ArrowLeft className="size-4"/>Sinov rejasiga qaytish</button>
        <div className={cn('inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-sm font-bold tabular-nums', timerWarning ? 'border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200')}><Clock className="size-4"/>{clock(secondsLeft)}<span className="font-sans text-xs font-medium opacity-70">qoldi</span></div>
      </div>

      {questionSection && currentQuestion && currentPart && <QuestionSession section={section} currentPart={currentPart} currentQuestion={currentQuestion} questions={questions} questionIndex={questionIndex} answers={answers} setAnswers={setAnswers} setQuestionIndex={setQuestionIndex} showTranscript={showTranscript} setShowTranscript={setShowTranscript} onSubmit={submitQuestions} />}
      {sectionKey === 'yazma' && <WritingSession section={section} text={writingText} setText={setWritingText} evaluations={writingEvaluations} onGrade={gradeWriting} onSubmit={submitWriting} />}
      {sectionKey === 'konusma' && currentSpeakPart && <SpeakingSession section={section} currentPart={currentSpeakPart} partIndex={speakingPartIndex} done={speakingDone} scores={speakingScores} setScores={setSpeakingScores} notes={notes} setNotes={setNotes} audioUrl={audioUrls[currentSpeakPart.id]} recording={recording} recordingError={recordingError} onToggleRecording={toggleRecording} prepSeconds={prepSeconds} prepStarted={prepStarted} onStartPrep={() => setPrepStarted(true)} onMarkDone={markSpeakingDone} onSelectPart={changeSpeakingPart} onSubmit={submitSpeaking} />}
      <p className="text-center text-xs text-slate-400">Vaqt sarflandi: {clock(remaining)} · Natijalar siz bergan rubrika asosida 75 ballik shkalada hisoblanadi.</p>
    </div>
  )
}

function QuestionSession({ section, currentPart, currentQuestion, questions, questionIndex, answers, setAnswers, setQuestionIndex, showTranscript, setShowTranscript, onSubmit }) {
  const answeredCount = Object.values(answers).filter((value) => value !== undefined && value !== '').length
  const matchingChoicesInUse = new Set(currentPart.questions.filter((question) => question.id !== currentQuestion.id).map((question) => answers[question.id]).filter(Boolean))
  const audioText = currentQuestion.audioText || currentPart.audioText
  const contextText = currentPart.context
  const qNum = currentQuestion.number
  return (
    <>
      <header className="premium-hero rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-500 p-5 text-white sm:p-7"><p className="text-xs font-bold uppercase tracking-widest text-white/70">{section.label} · {currentPart.title}</p><h1 className="mt-1 text-2xl font-extrabold">Savol {qNum} / {section.totalQuestions}</h1><p className="mt-2 text-sm text-white/85">{currentPart.instructions}</p></header>
      {currentPart.contextTitle && <h2 className="-mb-2 font-bold text-slate-800 dark:text-white">{currentPart.contextTitle}</h2>}
      {currentPart.planLocations && <div role="group" aria-label="A–H reja joylari" className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-4">{currentPart.planLocations.map((location, index) => <div key={`${index}-${location}`} className="flex min-h-14 items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-teal-100 font-extrabold text-teal-800 dark:bg-teal-500/20 dark:text-teal-200">{String.fromCharCode(65 + index)}</span>{location}</div>)}</div>}
      {contextText && <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 text-sm leading-7 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><p className="whitespace-pre-line">{contextText}</p></article>}
      {(audioText || currentQuestion.audioText) && <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-teal-200 bg-teal-50 p-3 dark:border-teal-800 dark:bg-teal-950/30"><button type="button" onClick={() => { if (!speakTurkish(audioText)) window.alert('Ushbu brauzerda Web Speech API mavjud emas.') }} className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-3 py-2 text-sm font-bold text-white"><Volume2 className="size-4"/>Türkçe dinle</button><button type="button" onClick={() => setShowTranscript((value) => !value)} className="rounded-lg border border-teal-300 px-3 py-2 text-sm font-semibold text-teal-800 dark:text-teal-200">{showTranscript ? 'Transkriptni yashirish' : 'Transkriptni ko‘rsatish'}</button>{showTranscript && <p className="w-full pt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{audioText}</p>}</div>}
      <article className="glass premium-glass rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-7">
        <div className="flex items-start justify-between gap-3"><span className="rounded-lg bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">Q{qNum}</span><span className="text-xs text-slate-500 dark:text-slate-400">{currentQuestion.kind === 'matching' ? 'Eşleştirme' : currentQuestion.kind === 'boolean' ? 'Doğru / Yanlış' : 'Çoktan seçmeli'}</span></div>
        <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{currentQuestion.prompt}</h2>
        {currentQuestion.kind === 'matching' ? <select value={answers[currentQuestion.id] || ''} onChange={(event) => setAnswers((previous) => ({ ...previous, [currentQuestion.id]: event.target.value }))} className="mt-5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"><option value="">Javobni tanlang</option>{currentQuestion.options.map((option) => <option key={option.id} value={option.id} disabled={matchingChoicesInUse.has(option.id)}>{option.label}</option>)}</select> : <div className="mt-5 grid gap-2">{currentQuestion.options.map((option) => <button key={option.id} type="button" onClick={() => setAnswers((previous) => ({ ...previous, [currentQuestion.id]: option.id }))} className={cn('flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors', answers[currentQuestion.id] === option.id ? 'border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-500/10 dark:text-teal-200' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200')}><span className="grid size-7 shrink-0 place-items-center rounded-lg border border-current text-xs">{option.id}</span><span>{option.label.replace(/^[A-J]\.\s*/, '')}</span>{answers[currentQuestion.id] === option.id && <Check className="ml-auto size-4"/>}</button>)}</div>}
        <div className="mt-6 flex items-center justify-between gap-3"><button type="button" onClick={() => { setQuestionIndex((index) => Math.max(0, index - 1)); setShowTranscript(false) }} disabled={questionIndex === 0} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"><ArrowLeft className="size-4"/>Oldingi</button><span className="text-xs text-slate-500">Javoblangan: {answeredCount}/{questions.length}</span><button type="button" onClick={() => { setQuestionIndex((index) => Math.min(questions.length - 1, index + 1)); setShowTranscript(false) }} disabled={questionIndex === questions.length - 1} className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-2 text-sm font-bold text-white disabled:opacity-40">Keyingi<ArrowRight className="size-4"/></button></div>
        <div className="mt-5 grid grid-cols-7 gap-2 sm:grid-cols-10">{questions.map((question, index) => <button key={question.id} type="button" onClick={() => { setQuestionIndex(index); setShowTranscript(false) }} className={cn('h-9 rounded-lg border text-xs font-bold', questionIndex === index ? 'border-teal-700 bg-teal-700 text-white' : answers[question.id] ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400')}>{question.number}</button>)}</div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-700"><span className="text-sm text-slate-500 dark:text-slate-400">Bo‘sh javoblar noto‘g‘ri hisoblanadi.</span><button type="button" onClick={() => { if (window.confirm(`Bo‘limni yakunlashga tayyormisiz? ${questions.length - answeredCount} ta javobsiz savol noto‘g‘ri hisoblanadi.`)) onSubmit() }} className="rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-5 py-2.5 text-sm font-bold text-white">Bo‘limni yakunlash</button></div>
      </article>
    </>
  )
}

function WritingSession({ section, text, setText, evaluations, onGrade, onSubmit }) {
  return (
    <div className="space-y-5"><header className="premium-hero rounded-3xl bg-gradient-to-br from-teal-700 to-cyan-600 p-5 text-white sm:p-7"><p className="text-xs font-bold uppercase tracking-widest text-white/70">Sınav 3 · Yazma · 60 daqiqa</p><h1 className="mt-1 text-2xl font-extrabold">Ikki yozma vazifa</h1><p className="mt-2 text-sm text-white/85">Matn hajmi, bog‘lovchilar, lug‘at xilma-xilligi va tuzilma bo‘yicha avtomatik mezon tekshiruvi.</p></header>
      {section.tasks.map((task) => { const content = text[task.id] || ''; const evaluation = evaluations[task.id]; return <article key={task.id} className="glass premium-glass rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-bold text-slate-900 dark:text-white">{task.title}</h2><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">Maksimum {task.maxRaw} xom ball</span></div><p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{task.prompt}</p><textarea value={content} disabled={!!evaluation} onChange={(event) => setText((previous) => ({ ...previous, [task.id]: event.target.value }))} rows={task.task === 1 ? 8 : 11} placeholder="Türkçe cevabınızı shu yerga yozing..." className="mt-4 w-full resize-y rounded-2xl border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white"/><div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400"><span>{task.minWords}–{task.maxWords} so‘z tavsiya qilinadi</span><span className={cn('font-bold tabular-nums', countWords(content) < task.minWords ? 'text-amber-600' : countWords(content) > task.maxWords ? 'text-rose-600' : 'text-emerald-600')}>{countWords(content)} so‘z</span></div>
        {evaluation ? <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-800 dark:bg-teal-950/30"><div className="flex items-center justify-between gap-2"><p className="font-bold text-teal-900 dark:text-teal-100">Avtomatik rubrika bahosi</p><p className="text-xl font-extrabold text-teal-800 dark:text-teal-200">{evaluation.rawScore}/{evaluation.maxRawScore}</p></div><div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300"><span>So‘z: {evaluation.wordCount}</span><span>Bog‘lovchilar: {evaluation.connectorCount}</span><span>Lug‘at xilma-xilligi: {evaluation.vocabularyDiversity}%</span><span>Paragraflar: {evaluation.paragraphCount}</span></div><p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Bu avtomatik taxminiy rubrika; yakuniy rasmiy baho sifatida talqin qilinmasin.</p></div> : <button type="button" onClick={() => onGrade(task)} className="mt-4 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white">Rubrika bo‘yicha baholash</button>}</article> })}
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-500 dark:text-slate-400">Yakunlash uchun ikkala vazifani ham baholang.</p><button type="button" onClick={onSubmit} disabled={section.tasks.some((task) => !evaluations[task.id])} className="rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Yazma bo‘limini yakunlash</button></div>
    </div>
  )
}

function SpeakingSession({ section, currentPart, partIndex, done, scores, setScores, notes, setNotes, audioUrl, recording, recordingError, onToggleRecording, prepSeconds, prepStarted, onStartPrep, onMarkDone, onSelectPart, onSubmit }) {
  const needsPreparation = currentPart.part === 2
  return (
    <div className="space-y-5"><header className="premium-hero rounded-3xl bg-gradient-to-br from-teal-700 to-cyan-600 p-5 text-white sm:p-7"><p className="text-xs font-bold uppercase tracking-widest text-white/70">Sınav 4 · Konuşma · 15 daqiqa</p><h1 className="mt-1 text-2xl font-extrabold">Uch bosqichli nutq topshirig‘i</h1><p className="mt-2 text-sm text-white/85">Ovozingizni yozib oling yoki javobni og‘zaki aytib, har bir qismga 0–12 oralig‘ida o‘z bahoingizni qo‘ying.</p></header>
      <div className="grid gap-2 sm:grid-cols-3">{section.parts.map((part, index) => <button key={part.id} type="button" onClick={() => onSelectPart(index)} className={cn('rounded-xl border p-3 text-left text-sm font-semibold', partIndex === index ? 'border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-500/10 dark:text-teal-200' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300')}>{done[part.id] && <Check className="mr-1 inline size-4 text-emerald-500"/>}Qism {part.part}: {part.title}</button>)}</div>
      <article className="glass premium-glass rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-7"><h2 className="text-lg font-bold text-slate-900 dark:text-white">{currentPart.title}</h2><p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{currentPart.prompt}</p>
        {needsPreparation && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30"><p className="font-bold text-amber-800 dark:text-amber-200">Tayyorgarlik vaqti: {clock(prepSeconds)}</p><button type="button" onClick={onStartPrep} disabled={prepStarted || prepSeconds === 0} className="mt-2 rounded-lg bg-amber-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-50">{prepStarted ? 'Tayyorgarlik davom etmoqda' : prepSeconds === 0 ? 'Tayyorgarlik yakunlandi' : '1 daqiqalik tayyorgarlikni boshlash'}</button></div>}
        <textarea value={notes[currentPart.id] || ''} onChange={(event) => setNotes((previous) => ({ ...previous, [currentPart.id]: event.target.value }))} rows={3} placeholder="Nutqingiz uchun qisqa qaydlar (ixtiyoriy)" className="mt-4 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"/>
        <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={onToggleRecording} className={cn('inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white', recording ? 'bg-rose-600' : 'bg-teal-700')}>{recording ? <MicOff className="size-4"/> : <Mic className="size-4"/>}{recording ? 'Yozishni to‘xtatish' : 'Ovoz yozishni boshlash'}</button>{audioUrl && <audio controls src={audioUrl} className="h-10 max-w-full"/>}</div>
        {recordingError && <p role="status" className="mt-2 text-sm text-amber-700 dark:text-amber-300">{recordingError}</p>}
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60"><div className="flex flex-wrap items-center justify-between gap-3"><label htmlFor={`speaking-score-${currentPart.id}`} className="font-semibold text-slate-800 dark:text-white">O‘z-o‘zini baholash</label><span className="font-mono text-lg font-extrabold text-teal-700 dark:text-teal-300">{scores[partIndex]} / 12</span></div><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Ravonlik, vazifani bajarish, so‘z boyligi va grammatik aniqlikni hisobga oling.</p><input id={`speaking-score-${currentPart.id}`} type="range" min="0" max="12" step="1" value={scores[partIndex]} onChange={(event) => setScores((previous) => previous.map((value, index) => index === partIndex ? Number(event.target.value) : value))} className="mt-3 w-full accent-teal-600"/></div>
        <button type="button" onClick={onMarkDone} disabled={done[currentPart.id] || (needsPreparation && prepSeconds > 0)} className="mt-4 rounded-xl border border-teal-300 px-4 py-2.5 text-sm font-bold text-teal-800 disabled:opacity-40 dark:text-teal-200">{done[currentPart.id] ? 'Qism belgilandi' : 'Javob berdim — qismni belgilash'}</button>
      </article>
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-500 dark:text-slate-400">Bajarilgan: {Object.keys(done).length}/3 · Raw ball: {scores.reduce((sum, score) => sum + score, 0)}/36</p><button type="button" onClick={onSubmit} disabled={section.parts.some((part) => !done[part.id])} className="rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Konuşma bo‘limini yakunlash</button></div>
    </div>
  )
}
