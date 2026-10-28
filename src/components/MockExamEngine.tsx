import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpenText, Check, CheckCircle2, Clock3, FileText, Headphones, Mic, MicOff, Play, RotateCcw, Sparkles, Trophy, Volume2 } from 'lucide-react'
import { MOCK_01, type MockPart, type MockQuestion, type MockSkillKey, type MockSpeakingPart, type MockWritingTask } from '../data/mockDatabase'
import { gradeFullMock, gradeObjectiveSection, gradeSpeakingSection, gradeWritingSection, evaluateWritingTask, type MockSectionScore } from '../lib/mockExamScoring'
import { cn } from '../lib/utils'

const SKILL_KEYS: MockSkillKey[] = ['dinleme', 'okuma', 'yazma', 'konusma']
const SKILL_LABELS: Record<MockSkillKey, string> = { dinleme: 'Dinleme', okuma: 'Okuma', yazma: 'Yazma', konusma: 'Konuşma' }
const SKILL_ICONS = { dinleme: Headphones, okuma: BookOpenText, yazma: FileText, konusma: Mic }
const INITIAL_TIMES = Object.fromEntries(SKILL_KEYS.map((key) => [key, MOCK_01.sections[key].durationMinutes * 60])) as Record<MockSkillKey, number>

type ObjectiveStep = { type: 'objective'; id: string; question: MockQuestion; part: MockPart }
type WritingStep = { type: 'writing'; id: string; task: MockWritingTask }
type SpeakingStep = { type: 'speaking'; id: string; prompt: MockSpeakingPart }
type ExamStep = ObjectiveStep | WritingStep | SpeakingStep
type EngineResult = MockSectionScore & {
  testType: 'mock-database'
  examId: string
  completedAt: string
  timeUsedSeconds: number
  breakdown?: Array<{ id: string; title: string; rawScore: number; maxRawScore: number }>
}
type FullExamResult = ReturnType<typeof gradeFullMock> & { examId: string; completedAt: string; sectionResults: Partial<Record<MockSkillKey, EngineResult>> }

type EngineProps = {
  onSectionComplete?: (result: EngineResult) => void
  onExamComplete?: (result: FullExamResult) => void
  onExit?: () => void
}

function buildSteps(skill: MockSkillKey): ExamStep[] {
  if (skill === 'dinleme' || skill === 'okuma') {
    const section = MOCK_01.sections[skill]
    return section.parts.flatMap((part) => part.questions.map((question) => ({ type: 'objective' as const, id: question.id, question, part })))
  }
  if (skill === 'yazma') return MOCK_01.sections.yazma.tasks.map((task) => ({ type: 'writing' as const, id: task.id, task }))
  return MOCK_01.sections.konusma.parts.map((prompt) => ({ type: 'speaking' as const, id: prompt.id, prompt }))
}

function sectionItemCount(skill: MockSkillKey) {
  if (skill === 'dinleme' || skill === 'okuma') return MOCK_01.sections[skill].totalQuestions
  if (skill === 'yazma') return MOCK_01.sections.yazma.tasks.length
  return MOCK_01.sections.konusma.parts.length
}

function formatClock(seconds: number) {
  const safe = Math.max(0, seconds)
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`
}

function speakTurkish(text: string) {
  if (!text || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'tr-TR'
  utterance.rate = 0.92
  window.speechSynthesis.speak(utterance)
  return true
}

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/u).filter(Boolean).length : 0
}

function ResultPill({ level }: { level: string }) {
  const tone = level === 'C1' ? 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100' : level === 'B2' ? 'border-teal-300/40 bg-teal-400/10 text-teal-100' : level === 'B1' ? 'border-amber-300/50 bg-amber-400/10 text-amber-100' : 'border-slate-300/30 bg-white/10 text-white/80'
  return <span className={cn('inline-flex rounded-full border px-3 py-1 text-xs font-extrabold', tone)}>{level}</span>
}

function StimulusPane({ part, question }: { part: MockPart; question: MockQuestion }) {
  const paragraphQuestion = question.prompt.match(/^Paragraf\s+[IVX]+:\s*(.+)$/u)?.[1]
  return (
    <section className="glass premium-glass rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-7">
      <div className="mb-4 flex items-center gap-2 text-amber-700 dark:text-amber-200"><BookOpenText className="size-4"/><h2 className="text-sm font-bold">{part.contextTitle || part.title}</h2></div>
      {part.planLocations && <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{part.planLocations.map((location, index) => <div key={location} className="flex items-center gap-2 rounded-xl border border-amber-200/50 bg-amber-50/70 p-2 text-xs text-slate-700 dark:border-amber-200/20 dark:bg-black/20 dark:text-slate-200"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-amber-200 font-extrabold text-amber-950">{String.fromCharCode(65 + index)}</span>{location.replace(/^[A-H]\.\s*/u, '')}</div>)}</div>}
      {part.context && <p className="whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-200">{part.context}</p>}
      {!part.context && paragraphQuestion && <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">{paragraphQuestion}</p>}
      {!part.context && !paragraphQuestion && !part.planLocations && <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{part.instructions}</p>}
    </section>
  )
}

export default function MockExamEngine({ onSectionComplete, onExamComplete, onExit }: EngineProps) {
  const [view, setView] = useState<'intro' | 'exam' | 'results'>('intro')
  const [activeSkill, setActiveSkill] = useState<MockSkillKey>('dinleme')
  const [stepIndexes, setStepIndexes] = useState<Record<MockSkillKey, number>>({ dinleme: 0, okuma: 0, yazma: 0, konusma: 0 })
  const [remaining, setRemaining] = useState<Record<MockSkillKey, number>>(INITIAL_TIMES)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [writingResponses, setWritingResponses] = useState<Record<string, string>>({})
  const [speakingScores, setSpeakingScores] = useState<Record<string, number>>({})
  const [speakingTouched, setSpeakingTouched] = useState<Record<string, boolean>>({})
  const [speakingNotes, setSpeakingNotes] = useState<Record<string, string>>({})
  const [prepSeconds, setPrepSeconds] = useState(60)
  const [prepStarted, setPrepStarted] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [completed, setCompleted] = useState<Partial<Record<MockSkillKey, EngineResult>>>({})
  const [fullResult, setFullResult] = useState<FullExamResult | null>(null)
  const [recording, setRecording] = useState(false)
  const [recordingError, setRecordingError] = useState('')
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({})
  const submittedSkillsRef = useRef(new Set<MockSkillKey>())
  const fullSubmittedRef = useRef(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioUrlsRef = useRef(audioUrls)

  const stepsBySkill = useMemo(() => Object.fromEntries(SKILL_KEYS.map((key) => [key, buildSteps(key)])) as Record<MockSkillKey, ExamStep[]>, [])
  const currentSteps = stepsBySkill[activeSkill]
  const currentIndex = stepIndexes[activeSkill]
  const currentStep = currentSteps[currentIndex]
  const currentTimeLimit = MOCK_01.sections[activeSkill].durationMinutes * 60
  const timeUsed = currentTimeLimit - remaining[activeSkill]
  const totalStepCount = SKILL_KEYS.reduce((sum, key) => sum + stepsBySkill[key].length, 0)

  useEffect(() => { audioUrlsRef.current = audioUrls }, [audioUrls])
  useEffect(() => () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    streamRef.current?.getTracks().forEach((track) => track.stop())
    Object.values(audioUrlsRef.current).forEach((url) => URL.revokeObjectURL(url))
  }, [])

  useEffect(() => {
    if (view !== 'exam' || completed[activeSkill]) return undefined
    const timer = window.setInterval(() => setRemaining((times) => ({ ...times, [activeSkill]: Math.max(0, times[activeSkill] - 1) })), 1000)
    return () => window.clearInterval(timer)
  }, [view, activeSkill, completed[activeSkill]])

  useEffect(() => {
    if (view === 'exam' && remaining[activeSkill] === 0 && !completed[activeSkill]) completeSection(activeSkill, true)
  }, [view, activeSkill, remaining[activeSkill], completed[activeSkill]])

  useEffect(() => {
    if (view !== 'exam' || activeSkill !== 'konusma' || !prepStarted || prepSeconds <= 0 || currentStep?.type !== 'speaking' || currentStep.prompt.part !== 2) return undefined
    const timer = window.setInterval(() => setPrepSeconds((seconds) => Math.max(0, seconds - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [view, activeSkill, currentIndex, prepStarted, prepSeconds, currentStep])

  useEffect(() => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop()
      setRecording(false)
    }
    setShowTranscript(false)
    setRecordingError('')
    if (activeSkill === 'konusma' && currentStep?.type === 'speaking' && currentStep.prompt.part === 2) {
      setPrepSeconds(60)
      setPrepStarted(false)
    }
  }, [activeSkill, currentIndex])

  function startExam() {
    submittedSkillsRef.current = new Set()
    fullSubmittedRef.current = false
    setView('exam')
    setActiveSkill('dinleme')
    setStepIndexes({ dinleme: 0, okuma: 0, yazma: 0, konusma: 0 })
    setRemaining(INITIAL_TIMES)
    setAnswers({})
    setWritingResponses({})
    setSpeakingScores({})
    setSpeakingTouched({})
    setSpeakingNotes({})
    setCompleted({})
    setFullResult(null)
  }

  function completeSection(skill: MockSkillKey, timedOut = false) {
    if (submittedSkillsRef.current.has(skill) || completed[skill]) return
    submittedSkillsRef.current.add(skill)
    let score: MockSectionScore
    if (skill === 'dinleme' || skill === 'okuma') {
      const section = MOCK_01.sections[skill]
      const questions = section.parts.flatMap((part) => part.questions)
      const titles = Object.fromEntries(section.parts.map((part) => [part.id, part.title]))
      score = gradeObjectiveSection(skill, questions, answers, titles)
    } else if (skill === 'yazma') {
      score = gradeWritingSection(MOCK_01.sections.yazma.tasks, writingResponses)
    } else {
      score = gradeSpeakingSection(MOCK_01.sections.konusma.parts.map((part) => part.id), speakingScores)
    }
    const result: EngineResult = {
      ...score,
      testType: 'mock-database',
      examId: MOCK_01.id,
      completedAt: new Date().toISOString(),
      timeUsedSeconds: timeUsed,
      ...(timedOut ? { timedOut: true } : {}),
    }
    const next = { ...completed, [skill]: result }
    setCompleted(next)
    onSectionComplete?.(result)
    if (SKILL_KEYS.every((key) => next[key]) && !fullSubmittedRef.current) {
      fullSubmittedRef.current = true
      const aggregate = gradeFullMock(next)
      const finished: FullExamResult = { ...aggregate, examId: MOCK_01.id, completedAt: new Date().toISOString(), sectionResults: next }
      setFullResult(finished)
      setView('results')
      onExamComplete?.(finished)
    }
  }

  function selectSkill(skill: MockSkillKey) {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop()
      setRecording(false)
    }
    setActiveSkill(skill)
  }

  function goToStep(index: number) {
    const bounded = Math.max(0, Math.min(currentSteps.length - 1, index))
    setStepIndexes((values) => ({ ...values, [activeSkill]: bounded }))
  }

  async function toggleRecording(partId: string) {
    setRecordingError('')
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop()
      setRecording(false)
      return
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setRecordingError('Bu tarayıcıda ses kaydı desteklenmiyor; sözlü yanıtınızı kayıtsız olarak da değerlendirebilirsiniz.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const recorder = new MediaRecorder(stream)
      recorderRef.current = recorder
      audioChunksRef.current = []
      recorder.addEventListener('dataavailable', (event) => { if (event.data.size) audioChunksRef.current.push(event.data) })
      recorder.addEventListener('stop', () => {
        const url = URL.createObjectURL(new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' }))
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
      setRecordingError('Mikrofona erişim izni verilmedi. Tarayıcı izinlerini kontrol edin.')
    }
  }

  const progressCount = SKILL_KEYS.reduce((sum, skill) => {
    if (completed[skill]) return sum + stepsBySkill[skill].length
    return sum + stepsBySkill[skill].filter((step) => {
      if (step.type === 'objective') return Boolean(answers[step.id])
      if (step.type === 'writing') return Boolean(writingResponses[step.id]?.trim())
      return Boolean(speakingTouched[step.id] || speakingNotes[step.id]?.trim() || audioUrls[step.id])
    }).length
  }, 0)
  const globalProgress = totalStepCount ? Math.round((progressCount / totalStepCount) * 100) : 0
  if (view === 'intro') {
    return (
      <div className="mx-auto max-w-5xl space-y-5">
        <section className="premium-hero relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-500 p-6 text-white shadow-xl sm:p-9">
          <div className="relative z-10 max-w-3xl"><div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold ring-1 ring-white/20"><Sparkles className="size-4"/> SCALED MOCK DATABASE · {MOCK_01.levelRange}</div><h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{MOCK_01.title}</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85">Dört beceri, esnek soru bankası ve bölüm başına süre. Yanıtlarınız bölüm değiştirirken korunur; her bölüm ayrı tamamlanabilir.</p><div className="mt-5 flex flex-wrap gap-2">{SKILL_KEYS.map((key) => { const section = MOCK_01.sections[key]; const Icon = SKILL_ICONS[key]; const count = sectionItemCount(key); return <span key={key} className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-black/15 px-3 py-2 text-xs font-semibold"><Icon className="size-4 text-amber-200"/>{SKILL_LABELS[key]} · {count} · {section.durationMinutes} dk</span> })}</div><div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={startExam} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-teal-900 shadow-lg hover:bg-amber-50"><Play className="size-4"/>Sınavı başlat</button>{onExit && <button type="button" onClick={onExit} className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-black/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"><ArrowLeft className="size-4"/>Mock menüsüne dön</button>}</div></div>
        </section>
        <p className="text-center text-xs text-slate-400">Soru bankası şeması, ileride her beceriye 100+ öğe eklenmesini destekler. Mock 01 için toplam {totalStepCount} sınav adımı bulunur.</p>
      </div>
    )
  }

  if (view === 'results' && fullResult) {
    return (
      <div className="mx-auto max-w-5xl space-y-5">
        <section className="premium-hero rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-500 p-6 text-white shadow-xl sm:p-9"><div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-white/15"><Trophy className="size-6"/></span><div><p className="text-sm text-white/75">Mock 01 tamamlandı</p><h1 className="text-2xl font-extrabold">Genel CEFR sonucu</h1></div></div><div className="mt-6 flex flex-wrap items-end gap-4"><p className="text-5xl font-extrabold tabular-nums">{fullResult.overallScore}<span className="text-xl text-white/70"> / 75</span></p><ResultPill level={fullResult.level}/></div><p className="mt-3 text-sm text-white/80">Ortalama, dört becerinin 75 puanlık bölüm sonuçlarından hesaplandı. XP: +{fullResult.earnedXp}</p></section>
        <section className="grid gap-3 sm:grid-cols-2">{SKILL_KEYS.map((key) => { const Icon = SKILL_ICONS[key]; const result = fullResult.sectionResults[key]; return <article key={key} className="glass premium-glass rounded-2xl border border-slate-200 bg-white/85 p-5 dark:border-slate-800 dark:bg-slate-900/85"><div className="flex items-center gap-2"><Icon className="size-4 text-amber-600 dark:text-amber-200"/><h2 className="font-bold text-slate-900 dark:text-white">{SKILL_LABELS[key]}</h2></div><p className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">{result?.scaledScore ?? 0}<span className="text-sm font-semibold text-slate-500"> / 75</span></p><div className="mt-2 flex items-center justify-between"><ResultPill level={result?.level ?? 'Below B1'}/><span className="text-xs text-slate-500 dark:text-slate-400">Ham puan: {result?.rawScore ?? 0}/{result?.maxRawScore ?? 0}</span></div>{result?.breakdown && <ul className="mt-4 space-y-1 border-t border-slate-200 pt-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-300">{result.breakdown.slice(0, 6).map((part) => <li key={part.id} className="flex justify-between gap-2"><span>{part.title}</span><span className="font-bold tabular-nums">{part.rawScore}/{part.maxRawScore}</span></li>)}</ul>}</article> })}</section>
        <div className="flex flex-wrap justify-between gap-3"><button type="button" onClick={() => onExit?.()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><ArrowLeft className="size-4"/>Kapat</button><button type="button" onClick={startExam} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-4 py-2.5 text-sm font-bold text-white"><RotateCcw className="size-4"/>Mock 01’i yeniden çöz</button></div>
      </div>
    )
  }

  const currentDone = completed[activeSkill]
  const steps = stepsBySkill[activeSkill]
  const step = steps[stepIndexes[activeSkill]]
  const currentQuestion = step?.type === 'objective' ? step.question : null
  const currentPart = step?.type === 'objective' ? step.part : null
  const audioText = currentQuestion?.audioText || currentPart?.audioText || currentPart?.media?.transcript || ''
  const usedMatchingAnswers = currentPart?.questions.filter((question) => question.id !== currentQuestion?.id).map((question) => answers[question.id]).filter(Boolean) ?? []
  const currentWriting = step?.type === 'writing' ? writingResponses[step.id] ?? '' : ''
  const writingEstimate = step?.type === 'writing' ? evaluateWritingTask(currentWriting, step.task) : null
  const currentSpeech = step?.type === 'speaking' ? step.prompt : null

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-amber-700 dark:text-amber-200">{MOCK_01.id} · {SKILL_LABELS[activeSkill]}</p><h1 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">{SKILL_LABELS[activeSkill]} · {steps.length ? stepIndexSafe(stepIndexes[activeSkill], steps.length) + 1 : 0}/{steps.length}</h1></div><div className={cn('inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-sm font-bold tabular-nums', remaining[activeSkill] <= 300 ? 'border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200')}><Clock3 className="size-4"/>{formatClock(remaining[activeSkill])}<span className="font-sans text-xs font-medium opacity-70">kaldı</span></div></header>
      <section className="glass premium-glass rounded-2xl border border-slate-200 bg-white/85 p-3 dark:border-slate-800 dark:bg-slate-900/85"><div className="mb-2 flex items-center justify-between text-xs"><span className="font-bold text-slate-700 dark:text-slate-200">Genel ilerleme · {progressCount}/{totalStepCount} adım</span><span className="font-extrabold text-amber-700 dark:text-amber-200">{globalProgress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-[width]" style={{ width: `${globalProgress}%` }}/></div></section>
      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Sınav bölümleri">{SKILL_KEYS.map((key) => { const Icon = SKILL_ICONS[key]; const done = completed[key]; const section = MOCK_01.sections[key]; const count = stepsBySkill[key].length; return <button key={key} type="button" onClick={() => selectSkill(key)} aria-current={activeSkill === key ? 'step' : undefined} className={cn('flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition', activeSkill === key ? 'border-amber-400 bg-amber-300/20 text-amber-950 dark:text-amber-100' : done ? 'border-emerald-400/50 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300')}><span className="flex min-w-0 items-center gap-2"><Icon className="size-4 shrink-0"/><span className="truncate text-sm font-bold">{SKILL_LABELS[key]}</span></span><span className="flex items-center gap-1 text-[10px] font-bold">{done ? <CheckCircle2 className="size-4"/> : `${count} · ${section.durationMinutes}m`}</span></button> })}</nav>
      {currentDone ? (
        <section className="premium-hero rounded-3xl bg-gradient-to-br from-teal-700 to-cyan-600 p-6 text-white"><h2 className="text-xl font-extrabold">{SKILL_LABELS[activeSkill]} tamamlandı</h2><p className="mt-2 text-sm text-white/80">Ham puan {currentDone.rawScore}/{currentDone.maxRawScore} · Ölçeklenmiş {currentDone.scaledScore}/75 · {currentDone.level} · +{currentDone.earnedXp} XP</p><button type="button" onClick={() => { const next = SKILL_KEYS.find((key) => !completed[key]); if (next) selectSkill(next) }} className="mt-4 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-teal-900">Sonraki tamamlanmamış bölüm</button></section>
      ) : !step ? null : step.type === 'objective' ? (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,.95fr)]">
          <div className="space-y-3">{activeSkill === 'dinleme' && audioText && <section className="glass premium-glass rounded-2xl border border-slate-200 bg-white/85 p-4 dark:border-slate-800 dark:bg-slate-900/85"><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => { if (!speakTurkish(audioText)) setRecordingError('Web Speech bu tarayıcıda kullanılamıyor.') }} className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-3 py-2 text-sm font-bold text-white"><Volume2 className="size-4"/>Türkçe dinle</button><button type="button" onClick={() => setShowTranscript((shown) => !shown)} className="rounded-lg border border-amber-300/50 px-3 py-2 text-sm font-semibold text-amber-800 dark:text-amber-100">{showTranscript ? 'Transkripti gizle' : 'Transkripti göster'}</button></div>{showTranscript && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700 dark:text-slate-200">{audioText}</p>}{recordingError && <p role="status" className="mt-2 text-xs text-amber-700 dark:text-amber-200">{recordingError}</p>}</section>}{currentPart && <StimulusPane part={currentPart} question={currentQuestion!}/>}</div>
          <section className="glass premium-glass rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-7"><div className="flex items-start justify-between gap-3"><span className="grid size-9 place-items-center rounded-xl bg-amber-100 text-sm font-extrabold text-amber-950 dark:bg-amber-300/15 dark:text-amber-100">{currentQuestion!.number}</span><span className="rounded-full border border-amber-300/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-200">{currentQuestion!.kind === 'matching' ? 'Eşleştirme' : currentQuestion!.kind === 'boolean' ? 'Doğru / Yanlış' : 'Çoktan seçmeli'}</span></div><p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{currentPart?.instructions}</p><h2 className="mt-3 text-base font-bold leading-relaxed text-slate-900 dark:text-white">{currentQuestion!.prompt.startsWith('Paragraf ') ? 'Bu paragrafa en uygun başlık hangisidir?' : currentQuestion!.prompt}</h2>{currentQuestion!.kind === 'matching' ? <select aria-label={`Soru ${currentQuestion!.number} yanıtı`} value={answers[currentQuestion!.id] ?? ''} onChange={(event) => setAnswers((old) => ({ ...old, [currentQuestion!.id]: event.target.value }))} className="mt-5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"><option value="">Seçiminizi yapın</option>{currentQuestion!.options.map((option) => <option key={option.id} value={option.id} disabled={usedMatchingAnswers.includes(option.id)}>{option.label}</option>)}</select> : <div className="mt-5 space-y-2">{currentQuestion!.options.map((option) => <button key={option.id} type="button" onClick={() => setAnswers((old) => ({ ...old, [currentQuestion!.id]: option.id }))} className={cn('flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition', answers[currentQuestion!.id] === option.id ? 'border-amber-400 bg-amber-300/15 text-amber-900 dark:text-amber-100' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-300 dark:border-slate-700 dark:bg-black/15 dark:text-slate-200')}><span className="grid size-7 shrink-0 place-items-center rounded-lg border border-current text-xs font-extrabold">{option.id}</span><span>{option.label.replace(/^[A-H]\.\s*/u, '').replace(/^[A-H] — /u, '')}</span></button>)}</div>}</section>
        </div>
      ) : step.type === 'writing' ? (
        <section className="glass premium-glass rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Görev {step.task.task} · {step.task.rubricLabel}</h2><span className="rounded-full border border-amber-300/40 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-200">Ağırlık %{step.task.weightPercent} · {step.task.maxRaw} ham puan</span></div><p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{step.task.prompt}</p><textarea value={currentWriting} onChange={(event) => setWritingResponses((old) => ({ ...old, [step.id]: event.target.value }))} rows={step.task.task === 1 ? 10 : 13} placeholder="Türkçe yanıtınızı buraya yazın..." className="mt-4 w-full resize-y rounded-2xl border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"/><div className="mt-2 flex justify-between text-xs"><span className="text-slate-500 dark:text-slate-400">{step.task.minWords}–{step.task.maxWords} kelime önerilir</span><span className={cn('font-bold', wordCount(currentWriting) < step.task.minWords ? 'text-amber-600' : wordCount(currentWriting) > step.task.maxWords ? 'text-rose-600' : 'text-emerald-600')}>{wordCount(currentWriting)} kelime</span></div>{writingEstimate && <div className="mt-4 rounded-xl border border-amber-300/30 bg-amber-50/70 p-3 text-xs text-slate-600 dark:bg-black/20 dark:text-slate-300"><span className="font-bold text-amber-800 dark:text-amber-200">Otomatik tahmin: {writingEstimate.rawScore}/{writingEstimate.maxRawScore} ham puan.</span> Bu, uzunluk, düzen, bağlaç ve kelime çeşitliliğine dayalı yaklaşık bir geri bildirimdir.</div>}</section>
      ) : (
        <section className="glass premium-glass rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Konuşma {step.prompt.part} · {step.prompt.title}</h2>{step.prompt.part === 2 && <span className="rounded-full border border-amber-300/40 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-200">1 dakika hazırlık</span>}</div><p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-200">{step.prompt.prompt}</p>{step.prompt.part === 2 && <div className="mt-4 rounded-xl border border-amber-300/30 bg-amber-50/70 p-4 dark:bg-black/20"><p className="font-bold text-amber-800 dark:text-amber-200">Hazırlık süresi: {formatClock(prepSeconds)}</p><button type="button" onClick={() => setPrepStarted(true)} disabled={prepStarted || prepSeconds === 0} className="mt-2 rounded-lg bg-amber-500 px-3 py-2 text-sm font-bold text-amber-950 disabled:opacity-50">{prepStarted ? 'Hazırlanıyorsunuz…' : prepSeconds === 0 ? 'Süre tamamlandı' : 'Hazırlığı başlat'}</button></div>}<textarea value={speakingNotes[step.id] ?? ''} onChange={(event) => setSpeakingNotes((old) => ({ ...old, [step.id]: event.target.value }))} rows={3} placeholder="Kısa notlar (isteğe bağlı)" className="mt-4 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"/><div className="mt-4 flex flex-wrap items-center gap-2"><button type="button" onClick={() => toggleRecording(step.id)} className={cn('inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white', recording ? 'bg-rose-600' : 'bg-teal-700')}>{recording ? <MicOff className="size-4"/> : <Mic className="size-4"/>}{recording ? 'Kaydı durdur' : 'Yanıtı kaydet'}</button>{audioUrls[step.id] && <audio controls src={audioUrls[step.id]} className="h-10 max-w-full"/>}{recordingError && <p role="status" className="text-xs text-amber-700 dark:text-amber-200">{recordingError}</p>}</div><div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-black/20"><div className="flex items-center justify-between gap-2"><label htmlFor={`self-score-${step.id}`} className="text-sm font-bold text-slate-800 dark:text-white">Kendi performansını değerlendir</label><span className="font-mono font-extrabold text-amber-700 dark:text-amber-200">{speakingScores[step.id] ?? 0}/12</span></div><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{step.prompt.evaluationCriteria.join(' · ')}</p><input id={`self-score-${step.id}`} type="range" min={0} max={12} step={1} value={speakingScores[step.id] ?? 0} onChange={(event) => { setSpeakingScores((old) => ({ ...old, [step.id]: Number(event.target.value) })); setSpeakingTouched((old) => ({ ...old, [step.id]: true })) }} className="mt-3 w-full accent-amber-500"/></div></section>
      )}

      <section className="glass premium-glass rounded-2xl border border-slate-200/80 bg-white/85 p-4 dark:border-slate-800 dark:bg-slate-900/85"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-bold text-slate-900 dark:text-white">Bölüm adımları</h2><span className="text-xs text-slate-500 dark:text-slate-400">Yanıtlanan {Math.min(progressCount, totalStepCount)}/{totalStepCount}</span></div><div className="grid grid-cols-7 gap-2 sm:grid-cols-10 lg:grid-cols-12">{steps.map((item, index) => { const done = item.type === 'objective' ? Boolean(answers[item.id]) : item.type === 'writing' ? Boolean(writingResponses[item.id]?.trim()) : Boolean(speakingTouched[item.id] || speakingNotes[item.id]?.trim() || audioUrls[item.id]); return <button key={item.id} type="button" onClick={() => goToStep(index)} className={cn('h-9 rounded-lg border text-xs font-bold', currentIndex === index ? 'border-amber-400 bg-amber-400 text-amber-950' : done ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200' : 'border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-300')}>{index + 1}</button>})}</div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-700"><div className="flex gap-2"><button type="button" onClick={() => goToStep(currentIndex - 1)} disabled={currentIndex === 0} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"><ArrowLeft className="size-4"/>Önceki</button><button type="button" onClick={() => goToStep(currentIndex + 1)} disabled={currentIndex >= steps.length - 1} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">Sonraki<ArrowRight className="size-4"/></button></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => completeSection(activeSkill)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-4 py-2.5 text-sm font-extrabold text-amber-950"><Check className="size-4"/>Bölümü tamamla</button></div></div></section>

      {recordingError && activeSkill !== 'konusma' && <p role="status" className="text-sm text-amber-700 dark:text-amber-200">{recordingError}</p>}
      {currentDone && <p className="rounded-xl border border-emerald-300/40 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200">Bu bölüm tamamlandı.</p>}
      <p className="text-center text-xs text-slate-400">75 puan eşikleri kullanıcı tarafından sağlanan ölçeğe dayanır; resmî BBA/Rasch dönüşümü olarak bağımsız biçimde doğrulanmamıştır. Sonuç resmî belge değildir.</p>
    </div>
  )
}

function stepIndexSafe(index: number, total: number) {
  return Math.max(0, Math.min(index, total - 1))
}
