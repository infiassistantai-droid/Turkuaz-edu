import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Mic,
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  Volume2,
  Square,
  LoaderCircle,
  Gauge,
  MicOff,
  Sparkles,
  Trophy,
  Check,
  ChevronRight,
  ChevronUp,
  Timer as TimerIcon,
} from 'lucide-react'
import { speakingPrompts } from '../../data/mockExamData'
import { cn, formatTime } from '../../lib/utils'
import { loadKonusma, saveKonusma } from '../../lib/storage'
import { useI18n } from '../../lib/i18n.jsx'
import { gradeTextMock } from '../../lib/mockAiGrader'
import { analyzeAudioMock } from '../../lib/mockSpeechAnalysis'

// ---------------------------------------------------------------------
// 3-stage Milliy Sertifikat speaking exam structure
// ---------------------------------------------------------------------
const STAGES = [
  { n: 1, id: 'q1', titleKey: 'module.speaking.stage1.title', subKey: 'module.speaking.stage1.subtitle' },
  { n: 2, id: 'q2', titleKey: 'module.speaking.stage2.title', subKey: 'module.speaking.stage2.subtitle' },
  { n: 3, id: 'q3', titleKey: 'module.speaking.stage3.title', subKey: 'module.speaking.stage3.subtitle' },
]

// Stage 1 — short personal questions (Tanishuv)
const STAGE1_QUESTIONS = [
  { tr: 'Merhaba, adınız nedir?', uz: 'Salom, ismingiz nima?' },
  { tr: 'Nerede yaşıyorsunuz?', uz: 'Qayerda yashaysiz?' },
  { tr: 'Ne iş yapıyorsunuz?', uz: 'Nima ish bilan shugʻullanasiz?' },
  { tr: 'Bugün sizin için nasıl bir gün?', uz: 'Bugun siz uchun qanday kun?' },
]

// Stage 3 — follow-up discussion questions
const STAGE3_QUESTIONS = [
  { tr: 'Bu görüşe katılıyor musunuz? Neden?', uz: 'Siz bu fikrga qoʻshilasizmi? Nima uchun?' },
  { tr: 'Bu konuya dair deneyimlerinizi paylaşabilir misiniz?', uz: 'Bu mavzu boʻyicha tajribangizni aytib bera olasizmi?' },
  { tr: 'Bu durumla ilgili çözüm önerileriniz var mı?', uz: 'Ushbu holat yuzasidan yechim takliflaringiz bormi?' },
]

// C1 model answer + audio/reading practice tips
const SAMPLE_ANSWER = {
  tr: '«Bu konuda şunu düşünüyorum: öncelikle,ımız büyüdükçe çevremizin önemi artıyor. Biz gençler olarak sürdürülebilir bir gelecek için pek çok şey yapabiliriz. Bunu yaparken, öncelikle deneyimlerimizi paylaşmalı, ardından küçük ama anlamlı adımlarla harekete geçmeliyiz. Özetlemek gerekirse, dönüşüm bir günde olmuyor; ancak istekli ve kararlı olmak her şeyi mümkün kılıyor. Kanaatimce, bu yolda en büyük yardımcımız kendimize olan güvenimizdir.»',
  uz: '«Bu masalada shunday fikrdaman: avvalo, biz katta boʻlgan sari atrof-muhitimizning ahamiyati ortadi. Biz yoshlar barqaror kelecek uchun juda koʻp narsa qila olamiz. Buni amalga oshirishda, avvalo tajribamizni baham koʻrishimiz, keyin esa kichik, ammo muhim qadamlar bilan harakatni boshlashimiz kerak. Xulosa qilib aytganda, oʻzgarish bir kunda yuz bermaydi; ammo istak va qatʼiyat har narsani mumkin qiladi. Menimcha, bu yoʻlda eng katta yordamchimiz oʻzimizga boʻlgan ishonchimizdir.»',
  audioTips: [
    'Soʻzingizni sekin va aniq ayting — tezlik aniqlikka qaraganda muhimroq.',
    'Pauzalar iboralar (buning muqobilida, shuning uchun, nihoyat) uchun qoldiring.',
    'Ovoz balandligi oʻzgaruvchan boʻlsin — muhim nuqtalar balandroq talaffuz qilinadi.',
    'Namuna javobni bir necha marta ovoz chiqarib oʻqing — talaffuzni mushtlash uchun.',
  ],
}

export default function KonusmaModule({ onComplete }) {
  const { language, t } = useI18n()
  const savedKonusma = loadKonusma()
  const [stage, setStage] = useState('q1') // q1 | q2 | q3
  const [reached, setReached] = useState(savedKonusma.reached || 1) // highest stage reached (1..3)
  const [prompt, setPrompt] = useState(null)
  const [phase, setPhase] = useState('idle') // idle | prep | speak | paused | done
  const [prepLeft, setPrepLeft] = useState(60)
  const [speakLeft, setSpeakLeft] = useState(120)
  const [transcript, setTranscript] = useState('')
  const [grading, setGrading] = useState(false)
  const [gradeResult, setGradeResult] = useState(null)
  const intervalRef = useRef(null)

  // 1-qism answers
  const [answered1, setAnswered1] = useState(savedKonusma.answered1 || {})
  const [answered3, setAnswered3] = useState(savedKonusma.answered3 || {})
  const [questionsHeard, setQuestionsHeard] = useState({})
  const [recordingQuestion, setRecordingQuestion] = useState(null)
  const [analyzingQuestion, setAnalyzingQuestion] = useState(null)
  const [questionFeedback, setQuestionFeedback] = useState({})
  const [questionError, setQuestionError] = useState(null)
  const questionRecorderRef = useRef(null)
  const questionStreamRef = useRef(null)
  const questionChunksRef = useRef([])

  // Persist speaking progress — resumes across refreshes
  useEffect(() => {
    saveKonusma({ reached, answered1, answered3 })
  }, [reached, answered1, answered3])

  const questionId = (part, question) => `${part}:${question}`

  function speakQuestion(question, part) {
    const id = questionId(part, question)
    setQuestionError(null)
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setQuestionError({ id, message: t('speakingPractice.ttsUnavailable') })
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(question)
    utterance.lang = 'tr-TR'
    utterance.rate = 0.88
    utterance.pitch = 1
    utterance.voice = window.speechSynthesis.getVoices().find((voice) => voice.lang?.toLowerCase().startsWith('tr')) || null
    utterance.onend = () => setQuestionsHeard((previous) => ({ ...previous, [id]: true }))
    utterance.onerror = () => setQuestionError({ id, message: t('speakingPractice.ttsError') })
    window.speechSynthesis.speak(utterance)
  }

  function startQuestionRecording(question, part) {
    if (recordingQuestion || analyzingQuestion) return
    const id = questionId(part, question)
    setQuestionError(null)
    if (!questionsHeard[id]) {
      setQuestionError({ id, message: t('speakingPractice.listenFirst') })
      return
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setQuestionError({ id, message: t('speakingPractice.recorderUnavailable') })
      return
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      questionStreamRef.current = stream
      questionChunksRef.current = []
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((type) => MediaRecorder.isTypeSupported?.(type))
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
      questionRecorderRef.current = recorder
      recorder.ondataavailable = (event) => { if (event.data?.size) questionChunksRef.current.push(event.data) }
      recorder.onerror = () => {
        stream.getTracks().forEach((track) => track.stop())
        questionStreamRef.current = null
        setRecordingQuestion(null)
        setQuestionError({ id, message: t('speakingPractice.recordingError') })
      }
      recorder.onstop = async () => {
        const audio = new Blob(questionChunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        stream.getTracks().forEach((track) => track.stop())
        questionStreamRef.current = null
        setRecordingQuestion(null)
        setAnalyzingQuestion(id)
        try {
          const feedback = await analyzeAudioMock(question, audio)
          setQuestionFeedback((previous) => ({ ...previous, [id]: feedback }))
          if (part === 'q1') setAnswered1((previous) => ({ ...previous, [question]: true }))
          if (part === 'q3') setAnswered3((previous) => ({ ...previous, [question]: true }))
        } catch {
          setQuestionError({ id, message: t('speakingPractice.recordingError') })
        } finally {
          setAnalyzingQuestion(null)
        }
      }
      recorder.start()
      setRecordingQuestion(id)
    }).catch((reason) => {
      questionStreamRef.current?.getTracks().forEach((track) => track.stop())
      questionStreamRef.current = null
      setQuestionError({ id, message: reason?.name === 'NotAllowedError' || reason?.name === 'PermissionDeniedError'
        ? t('speakingPractice.permissionDenied')
        : t('speakingPractice.permissionError') })
    })
  }

  function stopQuestionRecording() {
    if (questionRecorderRef.current?.state === 'recording') questionRecorderRef.current.stop()
  }

  function retryQuestion(part, question) {
    const id = questionId(part, question)
    setQuestionFeedback((previous) => { const next = { ...previous }; delete next[id]; return next })
    setQuestionsHeard((previous) => ({ ...previous, [id]: false }))
    setQuestionError(null)
    if (part === 'q1') setAnswered1((previous) => ({ ...previous, [question]: false }))
    if (part === 'q3') setAnswered3((previous) => ({ ...previous, [question]: false }))
  }

  useEffect(() => () => {
    window.speechSynthesis?.cancel()
    if (questionRecorderRef.current?.state === 'recording') questionRecorderRef.current.stop()
    questionStreamRef.current?.getTracks().forEach((track) => track.stop())
  }, [])

  const drawPrompt = useCallback(() => {
    setTranscript(''); setGradeResult(null)
    setPrompt(speakingPrompts[Math.floor(Math.random() * speakingPrompts.length)])
    setPhase('idle')
    setPrepLeft(60)
    setSpeakLeft(120)
  }, [])

  useEffect(() => {
    drawPrompt()
  }, [drawPrompt])

  // timer loop — only the active phase counts down
  useEffect(() => {
    if (phase !== 'prep' && phase !== 'speak') return undefined
    intervalRef.current = setInterval(() => {
      if (phase === 'prep') setPrepLeft((t) => Math.max(0, t - 1))
      if (phase === 'speak') setSpeakLeft((t) => Math.max(0, t - 1))
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [phase])

  // phase transitions
  useEffect(() => {
    if (phase === 'prep' && prepLeft <= 0) setPhase('speak')
  }, [prepLeft, phase])

  useEffect(() => {
    if (phase === 'speak' && speakLeft <= 0) {
      setPhase('done')
      setReached(3)
    }
  }, [speakLeft, phase, onComplete])

  const isRecording = phase === 'speak'

  async function gradeSpeaking() {
    if (!transcript.trim() || grading || gradeResult) return
    setGrading(true)
    try { const result = await gradeTextMock(transcript, { kind: 'speaking' }); setGradeResult(result); onComplete?.(result.xp) }
    finally { setGrading(false) }
  }

  function start() {
    setPrepLeft(60)
    setSpeakLeft(120)
    setPhase('prep')
  }

  function skipPrep() {
    setPrepLeft(0)
    setSpeakLeft(120)
    setPhase('speak')
  }

  function pause() {
    setPhase((p) => (p === 'speak' ? 'paused' : p))
  }

  function reset() {
    setTranscript(''); setGradeResult(null)
    setPhase('idle')
    setPrepLeft(60)
    setSpeakLeft(120)
  }

  function goStage(id) {
    if (reached >= STAGES.find((s) => s.id === id).n) {
      setStage(id)
      if (id === 'q2') setPhase('idle')
    }
  }

  const allStage1Done = STAGE1_QUESTIONS.every((q) => answered1[q.tr])
  const allStage3Done = STAGE3_QUESTIONS.every((q) => answered3[q.tr])

  // circular countdown math
  const R = 52
  const C = 2 * Math.PI * R
  const total = phase === 'prep' ? 60 : 120
  const remain = phase === 'prep' ? prepLeft : phase === 'speak' || phase === 'paused' ? speakLeft : 0
  const frac = total > 0 ? remain / total : 0
  const offset = C * (1 - frac)
  const ringColor = phase === 'prep' ? 'var(--exam-timer-primary)' : frac <= 0.25 ? 'var(--exam-timer-alert)' : 'var(--exam-timer-active)'
  const ringPulse = (phase === 'prep' || phase === 'speak') && frac <= 0.25

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex flex-wrap items-center gap-2">
          <Mic className="h-5 w-5 text-amber-500" />
          <h1 className="font-display text-xl font-extrabold text-slate-800 dark:text-white">
            {t('module.speak.title')}
          </h1>
          <span className="rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-bold tracking-wider text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
            B1–C1
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {t('module.speak.intro')}
        </p>
      </div>

      {/* Stage stepper */}
      <div className="flex items-center gap-2">
        {STAGES.map((s, i) => {
          const active = stage === s.id
          const unlocked = reached >= s.n
          return (
            <div key={s.id} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => goStage(s.id)}
                disabled={!unlocked}
                className={cn(
                  'flex w-full items-center gap-2 rounded-2xl border px-3 py-2.5 text-left transition-all',
                  active
                    ? 'border-amber-400 bg-amber-50 shadow-sm dark:border-amber-700/60 dark:bg-amber-500/10'
                    : unlocked
                      ? 'border-slate-200/80 bg-white hover:border-amber-300 dark:border-slate-800 dark:bg-slate-800'
                      : 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-50 dark:border-slate-800 dark:bg-slate-900',
                )}
              >
                <span
                  className={cn(
                    'grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-extrabold',
                    active
                      ? 'bg-amber-500 text-white'
                      : unlocked
                        ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        : 'bg-slate-200 text-slate-400 dark:bg-slate-800',
                  )}
                >
                  {s.n}
                </span>
                <div className="min-w-0 leading-tight">
                  <div className="text-sm font-extrabold text-slate-800 dark:text-white">
                    {t(s.titleKey)}
                  </div>
                  <div className="truncate text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                    {t(s.subKey)}
                  </div>
                </div>
              </button>
              {i < STAGES.length - 1 && (
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
              )}
            </div>
          )
        })}
      </div>

      {/* Stage 1 — Tanishuv va qisqa savollar */}
      {stage === 'q1' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 p-5 dark:border-amber-900/30 dark:from-amber-950/40 dark:to-rose-950/40">
            <h2 className="font-display text-base font-extrabold text-slate-800 dark:text-white">
              {t('module.speaking.part1')}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {t('module.speaking.part1.help')}
            </p>
          </div>
          <div className="space-y-3">
            {STAGE1_QUESTIONS.map((q) => {
              const id = questionId('q1', q.tr)
              const done = !!answered1[q.tr]
              const feedback = questionFeedback[id]
              const recording = recordingQuestion === id
              const analyzing = analyzingQuestion === id
              return (
                <div key={q.tr} className={cn('rounded-2xl border p-4 transition-all', done ? 'border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/30' : 'border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80')}>
                  <div className="flex items-start gap-3">
                    <button type="button" onClick={() => speakQuestion(q.tr, 'q1')} aria-label={t('speakingPractice.listen')} title={t('speakingPractice.listen')} disabled={Boolean(recordingQuestion || analyzingQuestion)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700 transition hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"><Volume2 className="h-5 w-5"/></button>
                    <div className="min-w-0 flex-1 pt-1">
                      <p className="font-bold text-slate-800 dark:text-white">{q.tr}</p>
                      {language === 'uz' && <p className="text-xs text-slate-400 dark:text-slate-500">{q.uz}</p>}
                    </div>
                    {recording ? <button type="button" onClick={stopQuestionRecording} aria-label={t('speakingPractice.stop')} className="flex shrink-0 animate-pulse items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-[0_0_20px_red]"><Square className="h-4 w-4 fill-current"/><span className="hidden sm:inline">{t('speakingPractice.recording')}</span></button>
                    : analyzing ? <span role="status" className="flex shrink-0 items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200"><LoaderCircle className="h-4 w-4 animate-spin"/><span className="hidden sm:inline">{t('module.speaking.aiAnalyzing')}</span></span>
                    : feedback ? <span className="flex shrink-0 items-center gap-1 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"><Check className="h-4 w-4"/>{feedback.score}/100</span>
                    : <button type="button" onClick={() => startQuestionRecording(q.tr, 'q1')} disabled={!questionsHeard[id] || Boolean(recordingQuestion || analyzingQuestion)} aria-label={t('speakingPractice.record')} title={questionsHeard[id] ? t('speakingPractice.record') : t('speakingPractice.listenFirst')} className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-teal-700 px-3 text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"><Mic className="h-5 w-5"/><span className="hidden text-xs font-bold sm:inline">{t('speakingPractice.record')}</span></button>}
                  </div>
                  {questionError?.id === id && <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">{questionError.message}</p>}
                  {!questionsHeard[id] && !feedback && !recording && !analyzing && <p className="mt-2 pl-[3.25rem] text-[11px] text-slate-400 dark:text-slate-500">{t('speakingPractice.listenBeforeRecord')}</p>}
                  {analyzing && <div role="status" aria-live="polite" className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-white/70 px-3 py-2 text-xs font-bold text-amber-700 dark:border-amber-500/20 dark:bg-black/20 dark:text-amber-200"><LoaderCircle className="h-4 w-4 animate-spin"/>{t('module.speaking.aiAnalyzing')}</div>}
                  {feedback && <div className="mt-3 rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-slate-700 dark:bg-black/20">
                    <div className="flex items-center justify-between gap-3"><p className="text-sm font-extrabold text-slate-800 dark:text-white">{t('speakingPractice.results')} · <span className="text-teal-700 dark:text-amber-300">{feedback.score}/100</span></p><button type="button" onClick={() => retryQuestion('q1', q.tr)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10" aria-label={t('speakingPractice.tryAgain')} title={t('speakingPractice.tryAgain')}><RotateCcw className="h-4 w-4"/></button></div>
                    <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-base font-bold leading-relaxed">{feedback.transcript.map((part, index) => <span key={`${part.word}-${index}`} className={part.status === 'correct' ? 'text-emerald-500' : 'text-rose-500 underline decoration-2 underline-offset-4'}>{part.word}</span>)}</div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300"><Sparkles className="mr-1 inline h-3.5 w-3.5 text-amber-500"/>{feedback.advice}</p>
                    <p className="mt-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500">{t('speakingPractice.mockDisclaimer')}</p>
                  </div>}
                </div>
              )
            })}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setReached(2)
                setStage('q2')
                reset()
              }}
              disabled={!allStage1Done}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition-all active:scale-95 hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
            >
              {t('module.nextPart')}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stage 2 — 2 daqiqalik nutq with circular countdown */}
      {stage === 'q2' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 p-5 dark:border-amber-900/30 dark:from-amber-950/40 dark:to-rose-950/40">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200 dark:bg-slate-800 dark:text-amber-300">
                {prompt ? `${prompt.level} · ${t(prompt.categoryKey)}` : '—'}
              </span>
              <button
                type="button"
                onClick={drawPrompt}
                className="ml-auto flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200 transition-all active:scale-95 hover:text-amber-600 dark:bg-slate-800 dark:text-slate-400"
              >
                <Shuffle className="h-3.5 w-3.5" />
                {t('module.newTopic')}
              </button>
            </div>
            {prompt && (
              <div className="mt-4">
                <p className="font-display text-lg font-extrabold text-slate-800 dark:text-white">
                  {prompt.tr}
                </p>
                {language === 'uz' && <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{prompt.uz}</p>}
                <p className="mt-2 rounded-xl bg-white/60 px-3 py-2 text-xs font-bold text-amber-700 ring-1 ring-amber-200 dark:text-amber-300 dark:ring-amber-900/40">
                  {t('module.speaking.part2')}
                </p>
              </div>
            )}
          </div>

          {/* circular countdown timer */}
          <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
              <div className="relative">
                <svg viewBox="0 0 128 128" className="h-36 w-36 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r={R}
                    fill="none"
                    strokeWidth="8"
                    className="stroke-slate-200 dark:stroke-slate-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r={R}
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke={ringColor}
                    strokeDasharray={C}
                    strokeDashoffset={offset}
                    className={ringPulse ? 'pulse-ring' : ''}
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl font-extrabold tabular-nums text-slate-800 dark:text-white">
                    {formatTime(remain)}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {phase === 'prep' ? t('module.speaking.timer.prep') : phase === 'speak' || phase === 'paused' ? t('module.speaking.timer.speech') : t('module.speaking.timer.continue')}
                  </span>
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                {phase === 'idle' && (
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    {t('module.speaking.ready')}
                  </p>
                )}
                {phase === 'prep' && (
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    {t('module.speaking.prep')}
                  </p>
                )}
                {phase === 'speak' && (
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    {t('module.speaking.live')}
                  </p>
                )}
                {phase === 'paused' && (
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    {t('module.speaking.paused')}
                  </p>
                )}
                {phase === 'done' && (
                  <div className="w-full max-w-2xl text-left">
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{t('module.speaking.done')}</p>
                    <label className="mt-3 block text-xs font-bold text-slate-600 dark:text-slate-300" htmlFor="speaking-transcript">{t('grader.transcript')}</label>
                    <textarea id="speaking-transcript" value={transcript} onChange={(event) => setTranscript(event.target.value)} rows={3} placeholder={t('grader.transcript.placeholder')} className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                    <button type="button" disabled={!transcript.trim() || grading || !!gradeResult} onClick={gradeSpeaking} className="mt-2 rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"><Sparkles className={`mr-2 inline size-4 ${grading ? 'animate-pulse' : ''}`}/>{grading ? t('grader.analyzing') : t('grader.evaluate')}</button>
                    {gradeResult && <div className="mt-3 rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm dark:border-teal-500/20 dark:bg-teal-500/10"><strong>{t('grader.mock')} · {t('grader.level')}: {gradeResult.level}</strong><span className="ml-2">{t('grader.score')}: {gradeResult.score}/100 · +{gradeResult.xp} XP</span><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">{Object.entries(gradeResult.rubric).map(([key, value]) => <span key={key} className="rounded-lg bg-white/80 px-2 py-1 text-xs dark:bg-slate-900/70">{t(`grader.${key}`)}: <b>{value}/100</b></span>)}</div><div className="mt-2 text-xs text-slate-600 dark:text-slate-300">{gradeResult.corrections.map((item) => item.suggestion).join(' ')}</div></div>}
                  </div>
                )}
                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {phase === 'idle' && (
                    <button
                      type="button"
                      onClick={start}
                      className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition-all active:scale-95 hover:bg-amber-600"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      {t('module.startSpeaking')}
                    </button>
                  )}
                  {phase === 'prep' && (
                    <button
                      type="button"
                      onClick={skipPrep}
                      className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition-all active:scale-95 hover:bg-amber-600"
                    >
                      <Mic className="h-4 w-4" />
                      {t('module.startSpeaking')}
                    </button>
                  )}
                  {phase === 'speak' && (
                    <button
                      type="button"
                      onClick={pause}
                      className="flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-900/20 transition-all active:scale-95 hover:bg-rose-600"
                    >
                      <Pause className="h-4 w-4 fill-current" />
                      {t('module.stop')}
                    </button>
                  )}
                  {phase === 'paused' && (
                    <button
                      type="button"
                      onClick={() => setPhase('speak')}
                      className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition-all active:scale-95 hover:bg-amber-600"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      {t('module.resume')}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={reset}
                    className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-bold text-slate-500 transition-all active:scale-95 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {t('module.reset')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 3 — Munozara savolları + C1 sample answer */}
      {stage === 'q3' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-teal-50 p-5 dark:border-amber-900/30 dark:from-amber-950/40 dark:to-teal-950/40">
            <h2 className="font-display text-base font-extrabold text-slate-800 dark:text-white">
              {t('module.speaking.part3')}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {t('module.speaking.part3.help')}
            </p>
          </div>
          <div className="space-y-3">
            {STAGE3_QUESTIONS.map((q) => {
              const id = questionId('q3', q.tr)
              const done = !!answered3[q.tr]
              const feedback = questionFeedback[id]
              const recording = recordingQuestion === id
              const analyzing = analyzingQuestion === id
              return (
                <div key={q.tr} className={cn('rounded-2xl border p-4 transition-all', done ? 'border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/30' : 'border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80')}>
                  <div className="flex items-start gap-3">
                    <button type="button" onClick={() => speakQuestion(q.tr, 'q3')} aria-label={t('speakingPractice.listen')} title={t('speakingPractice.listen')} disabled={Boolean(recordingQuestion || analyzingQuestion)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700 transition hover:bg-teal-100 dark:bg-teal-500/10 dark:text-amber-300 dark:hover:bg-teal-500/20"><Volume2 className="h-5 w-5"/></button>
                    <div className="min-w-0 flex-1 pt-1">
                      <p className="font-bold text-slate-800 dark:text-white">{q.tr}</p>
                      {language === 'uz' && <p className="text-xs text-slate-400 dark:text-slate-500">{q.uz}</p>}
                    </div>
                    {recording ? <button type="button" onClick={stopQuestionRecording} aria-label={t('speakingPractice.stop')} className="flex shrink-0 animate-pulse items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-[0_0_20px_red]"><Square className="h-4 w-4 fill-current"/><span className="hidden sm:inline">{t('speakingPractice.recording')}</span></button>
                    : analyzing ? <span role="status" className="flex shrink-0 items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200"><LoaderCircle className="h-4 w-4 animate-spin"/><span className="hidden sm:inline">{t('module.speaking.aiAnalyzing')}</span></span>
                    : feedback ? <span className="flex shrink-0 items-center gap-1 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"><Check className="h-4 w-4"/>{feedback.score}/100</span>
                    : <button type="button" onClick={() => startQuestionRecording(q.tr, 'q3')} disabled={!questionsHeard[id] || Boolean(recordingQuestion || analyzingQuestion)} aria-label={t('speakingPractice.record')} title={questionsHeard[id] ? t('speakingPractice.record') : t('speakingPractice.listenFirst')} className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-teal-700 px-3 text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"><Mic className="h-5 w-5"/><span className="hidden text-xs font-bold sm:inline">{t('speakingPractice.record')}</span></button>}
                  </div>
                  {questionError?.id === id && <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">{questionError.message}</p>}
                  {!questionsHeard[id] && !feedback && !recording && !analyzing && <p className="mt-2 pl-[3.25rem] text-[11px] text-slate-400 dark:text-slate-500">{t('speakingPractice.listenBeforeRecord')}</p>}
                  {analyzing && <div role="status" aria-live="polite" className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-white/70 px-3 py-2 text-xs font-bold text-amber-700 dark:border-amber-500/20 dark:bg-black/20 dark:text-amber-200"><LoaderCircle className="h-4 w-4 animate-spin"/>{t('module.speaking.aiAnalyzing')}</div>}
                  {feedback && <div className="mt-3 rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-slate-700 dark:bg-black/20">
                    <div className="flex items-center justify-between gap-3"><p className="text-sm font-extrabold text-slate-800 dark:text-white">{t('speakingPractice.results')} · <span className="text-teal-700 dark:text-amber-300">{feedback.score}/100</span></p><button type="button" onClick={() => retryQuestion('q3', q.tr)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10" aria-label={t('speakingPractice.tryAgain')} title={t('speakingPractice.tryAgain')}><RotateCcw className="h-4 w-4"/></button></div>
                    <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-base font-bold leading-relaxed">{feedback.transcript.map((part, index) => <span key={`${part.word}-${index}`} className={part.status === 'correct' ? 'text-emerald-500' : 'text-rose-500 underline decoration-2 underline-offset-4'}>{part.word}</span>)}</div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300"><Sparkles className="mr-1 inline h-3.5 w-3.5 text-amber-500"/>{feedback.advice}</p>
                    <p className="mt-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500">{t('speakingPractice.mockDisclaimer')}</p>
                  </div>}
                </div>
              )
            })}
          </div>

          {/* C1 namuna javob toggle card */}
          <SampleAnswerCard />

          {allStage3Done && (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-amber-100 py-4 text-sm font-extrabold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              <Trophy className="h-5 w-5" />
              {t('module.speaking.complete')}
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { icon: Volume2, titleKey: 'module.speaking.tipCard1.title', bodyKey: 'module.speaking.tipCard1.body' },
          { icon: Sparkles, titleKey: 'module.speaking.tipCard2.title', bodyKey: 'module.speaking.tipCard2.body' },
          { icon: Gauge, titleKey: 'module.speaking.tipCard3.title', bodyKey: 'module.speaking.tipCard3.body' },
          { icon: MicOff, titleKey: 'module.speaking.tipCard4.title', bodyKey: 'module.speaking.tipCard4.body' },
        ].map((tip) => {
          const Icon = tip.icon
          return (
            <div
              key={tip.titleKey}
              className="flex items-start gap-3 rounded-3xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-12px_rgba(0,0,0,0.5)]"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 dark:text-white">{t(tip.titleKey)}</div>
                <div className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{t(tip.bodyKey)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// C1 namuna javob — toggle card with reading/audio tips
function SampleAnswerCard() {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-2xl border border-teal-200 bg-white shadow-sm dark:border-teal-800/50 dark:bg-slate-800">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
          <Sparkles className="h-5 w-5 text-teal-700 dark:text-teal-400" />
          {t('module.sampleC1')} {open ? t('module.hide') : t('module.show')}
        </span>
        <ChevronUp className={cn('h-5 w-5 text-slate-400 transition-transform', !open && 'rotate-180')} />
      </button>
      {open && (
        <div className="space-y-4 border-t border-slate-100 px-5 py-4 dark:border-slate-800">
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">
              {t('module.sampleAnswerTr')}
            </h4>
            <p className="rounded-xl bg-teal-50 p-4 text-[15px] leading-relaxed text-slate-700 ring-1 ring-teal-600/15 dark:bg-teal-500/10 dark:text-slate-200 dark:ring-teal-800/50">
              {SAMPLE_ANSWER.tr}
            </p>
          </div>
          {language === 'uz' && (
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {t('module.translation')}
              </h4>
              <p className="text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">{SAMPLE_ANSWER.uz}</p>
            </div>
          )}
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">
              <TimerIcon className="h-3.5 w-3.5" />
              {t('module.audioTips')}
            </h4>
            <ul className="space-y-1.5">
              {SAMPLE_ANSWER.audioTips.map((_, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-xl bg-teal-50 p-3 text-xs leading-relaxed text-slate-600 ring-1 ring-cyan-100 dark:bg-cyan-500/10 dark:text-slate-300 dark:ring-cyan-900/30"
                >
                  <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-400" />
                  {t(`module.speaking.tip${i + 1}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
