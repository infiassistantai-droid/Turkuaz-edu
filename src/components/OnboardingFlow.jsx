import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  Clapperboard,
  Compass,
  GraduationCap,
  LoaderCircle,
  Plane,
  Sparkles,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'

const GOALS = [
  { id: 'education', labelKey: 'onboarding.goal.education', icon: GraduationCap },
  { id: 'career', labelKey: 'onboarding.goal.career', icon: Briefcase },
  { id: 'travel', labelKey: 'onboarding.goal.travel', icon: Plane },
  { id: 'culture', labelKey: 'onboarding.goal.culture', icon: Clapperboard },
]

const PATHS = [
  { id: 'beginner', labelKey: 'onboarding.path.beginner', detailKey: 'onboarding.path.beginner.detail', level: 'A1', icon: Sparkles },
  { id: 'placement', labelKey: 'onboarding.path.placement', detailKey: 'onboarding.path.placement.detail', level: null, icon: Compass },
]

function OnboardingBackdrop({ isPremium }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className={cn('absolute -right-24 -top-28 size-80 rounded-full blur-[110px]', isPremium ? 'bg-rose-500/15' : 'bg-cyan-300/25')} />
      <div className={cn('absolute -bottom-36 -left-24 size-96 rounded-full blur-[120px]', isPremium ? 'bg-yellow-500/10' : 'bg-teal-300/20')} />
      <div className={cn('absolute inset-0 opacity-[.035]', isPremium ? 'bg-[radial-gradient(rgba(255,255,255,.75)_0.7px,transparent_0.7px)]' : 'bg-[radial-gradient(rgba(15,23,42,.45)_0.7px,transparent_0.7px)]')} style={{ backgroundSize: '6px 6px' }} />
    </div>
  )
}

export default function OnboardingFlow({ isPremium = false, profile, onComplete }) {
  const { t } = useI18n()
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState(profile?.learningGoal || '')
  const [path, setPath] = useState(profile?.startingPath || '')
  const [processing, setProcessing] = useState(false)
  const premium = Boolean(isPremium)

  useEffect(() => {
    if (!processing) return undefined
    const timeout = window.setTimeout(() => {
      const selectedPath = PATHS.find((item) => item.id === path)
      onComplete?.({
        learningGoal: goal,
        startingPath: path,
        startingLevel: selectedPath?.level || null,
      })
    }, 2000)
    return () => window.clearTimeout(timeout)
  }, [goal, onComplete, path, processing])

  const shellClass = premium
    ? 'border-white/10 bg-black/40 text-white shadow-[0_28px_100px_rgba(0,0,0,.5)] backdrop-blur-2xl'
    : 'border-white bg-white/95 text-slate-900 shadow-[0_28px_100px_rgba(15,23,42,.12)] backdrop-blur-2xl'
  const mutedText = premium ? 'text-white/55' : 'text-slate-500'
  const isReady = step === 1 ? Boolean(goal) : Boolean(path)

  const continueFlow = () => {
    if (!isReady) return
    if (step === 1) setStep(2)
    else {
      setStep(3)
      setProcessing(true)
    }
  }

  return (
    <main className={cn(
      'relative isolate flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 py-8 sm:px-6',
      premium ? 'bg-[#140609] text-white' : 'bg-gradient-to-br from-cyan-50 via-white to-teal-50 text-slate-900',
    )}>
      <OnboardingBackdrop isPremium={premium} />

      <section className={cn('relative w-full max-w-3xl overflow-hidden rounded-[30px] border', shellClass)} aria-labelledby="onboarding-title">
        <header className={cn('flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-8 sm:py-5', premium ? 'border-white/10' : 'border-slate-100')}>
          <div className="flex min-w-0 items-center gap-3">
            <span className={cn('grid size-10 shrink-0 place-items-center rounded-2xl font-serif text-xl font-black text-white shadow-lg', premium ? 'bg-gradient-to-br from-rose-600 to-red-800 shadow-rose-900/30' : 'bg-gradient-to-br from-teal-600 to-cyan-500 shadow-teal-900/20')}>T</span>
            <div className="min-w-0">
              <p className="truncate font-serif text-lg font-extrabold tracking-tight">turkuaz<span className={premium ? 'text-yellow-300' : 'text-teal-600'}>.</span></p>
              <p className={cn('text-[9px] font-bold uppercase tracking-[.2em]', premium ? 'text-white/40' : 'text-slate-400')}>{t('onboarding.eyebrow')}</p>
            </div>
          </div>
          <span className={cn('shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-extrabold', premium ? 'border-yellow-200/20 bg-yellow-300/10 text-yellow-100' : 'border-teal-100 bg-teal-50 text-teal-800')}>
            {step < 3 ? t('onboarding.step', { current: step, total: 2 }) : t('onboarding.processing.label')}
          </span>
        </header>

        <div className="px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
          <div key={step} className="onboarding-step-enter">
            {step === 1 && (
              <>
                <div className="mb-6 text-center sm:mb-8">
                  <span className={cn('mx-auto mb-4 grid size-12 place-items-center rounded-2xl border', premium ? 'border-yellow-200/20 bg-yellow-300/10 text-yellow-100' : 'border-teal-100 bg-teal-50 text-teal-700')}>
                    <Sparkles className="size-5" aria-hidden="true" />
                  </span>
                  <h1 id="onboarding-title" className="text-2xl font-black tracking-tight sm:text-3xl">{t('onboarding.welcome.title')}</h1>
                  <p className={cn('mt-2 text-sm sm:text-base', mutedText)}>{t('onboarding.goal.subtitle')}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  {GOALS.map(({ id, icon: Icon, labelKey }) => {
                    const selected = goal === id
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setGoal(id)}
                        aria-pressed={selected}
                        className={cn(
                          'group flex min-h-[104px] items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 sm:min-h-[116px] sm:p-5',
                          premium ? 'focus-visible:ring-yellow-200' : 'focus-visible:ring-teal-500',
                          selected
                            ? premium
                              ? 'border-yellow-200/45 bg-yellow-300/10 shadow-[0_0_28px_rgba(250,204,21,.11)] ring-1 ring-yellow-100/20'
                              : 'border-teal-300 bg-teal-50 shadow-lg shadow-teal-900/5 ring-1 ring-teal-200'
                            : premium
                              ? 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/5'
                              : 'border-slate-200 bg-white/75 hover:border-teal-200 hover:bg-white hover:shadow-lg',
                        )}
                      >
                        <span className={cn('grid size-12 shrink-0 place-items-center rounded-2xl transition-colors', selected ? premium ? 'bg-yellow-300/15 text-yellow-100' : 'bg-teal-100 text-teal-800' : premium ? 'bg-white/5 text-white/70 group-hover:bg-white/10' : 'bg-slate-100 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-700')}>
                          <Icon className="size-6" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-extrabold sm:text-base">{t(labelKey)}</span>
                          <span className={cn('mt-1 block text-xs', mutedText)}>{t(`onboarding.goal.${id}.detail`)}</span>
                        </span>
                        <span className={cn('grid size-5 shrink-0 place-items-center rounded-full border transition-all', selected ? premium ? 'border-yellow-200 bg-yellow-300 text-slate-950' : 'border-teal-600 bg-teal-600 text-white' : premium ? 'border-white/25' : 'border-slate-300')}>
                          {selected && <Check className="size-3" aria-hidden="true" />}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-6 text-center sm:mb-8">
                  <span className={cn('mx-auto mb-4 grid size-12 place-items-center rounded-2xl border', premium ? 'border-yellow-200/20 bg-yellow-300/10 text-yellow-100' : 'border-teal-100 bg-teal-50 text-teal-700')}>
                    <Compass className="size-5" aria-hidden="true" />
                  </span>
                  <h1 id="onboarding-title" className="text-2xl font-black tracking-tight sm:text-3xl">{t('onboarding.level.title')}</h1>
                  <p className={cn('mt-2 text-sm sm:text-base', mutedText)}>{t('onboarding.level.subtitle')}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {PATHS.map(({ id, icon: Icon, labelKey, detailKey, level }) => {
                    const selected = path === id
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPath(id)}
                        aria-pressed={selected}
                        className={cn(
                          'group relative flex min-h-[190px] flex-col rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 sm:min-h-[220px] sm:p-6',
                          premium ? 'focus-visible:ring-yellow-200' : 'focus-visible:ring-teal-500',
                          selected
                            ? premium
                              ? 'border-yellow-200/45 bg-yellow-300/10 shadow-[0_0_28px_rgba(250,204,21,.11)] ring-1 ring-yellow-100/20'
                              : 'border-teal-300 bg-teal-50 shadow-lg shadow-teal-900/5 ring-1 ring-teal-200'
                            : premium
                              ? 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/5'
                              : 'border-slate-200 bg-white/75 hover:border-teal-200 hover:bg-white hover:shadow-lg',
                        )}
                      >
                        <span className={cn('grid size-12 place-items-center rounded-2xl', selected ? premium ? 'bg-yellow-300/15 text-yellow-100' : 'bg-teal-100 text-teal-800' : premium ? 'bg-white/5 text-white/70' : 'bg-slate-100 text-slate-600')}>
                          <Icon className="size-6" aria-hidden="true" />
                        </span>
                        <span className={cn('mt-5 block text-base font-extrabold', selected && !premium && 'text-teal-900')}>{t(labelKey)}</span>
                        <span className={cn('mt-2 block text-xs leading-relaxed', mutedText)}>{t(detailKey)}</span>
                        {level && <span className={cn('mt-auto pt-4 text-[10px] font-black uppercase tracking-[.18em]', premium ? 'text-yellow-200' : 'text-teal-700')}>{t('onboarding.level.startsAt', { level })}</span>}
                        <span className={cn('absolute right-4 top-4 grid size-5 place-items-center rounded-full border', selected ? premium ? 'border-yellow-200 bg-yellow-300 text-slate-950' : 'border-teal-600 bg-teal-600 text-white' : premium ? 'border-white/25' : 'border-slate-300')}>
                          {selected && <Check className="size-3" aria-hidden="true" />}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {step === 3 && (
              <div className="flex min-h-[360px] flex-col items-center justify-center py-8 text-center sm:min-h-[420px]">
                <span className={cn('relative mb-7 grid size-24 place-items-center rounded-[30px] border', premium ? 'border-yellow-200/25 bg-yellow-300/10 text-yellow-100 shadow-[0_0_55px_rgba(250,204,21,.18)]' : 'border-teal-200 bg-teal-50 text-teal-700 shadow-[0_0_50px_rgba(20,184,166,.16)]')}>
                  <span className={cn('absolute inset-[-10px] rounded-[36px] border animate-ping opacity-20 motion-reduce:animate-none', premium ? 'border-yellow-200' : 'border-teal-400')} />
                  <LoaderCircle className="size-10 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                </span>
                <h1 id="onboarding-title" className="max-w-lg text-2xl font-black tracking-tight sm:text-3xl">{t('onboarding.processing.title')}</h1>
                <p className={cn('mt-3 max-w-md text-sm leading-relaxed', mutedText)}>{t('onboarding.processing.subtitle')}</p>
                <div className={cn('mt-8 h-2 w-full max-w-sm overflow-hidden rounded-full', premium ? 'bg-white/10' : 'bg-slate-100')}>
                  <div className={cn('h-full w-full origin-left animate-onboarding-progress rounded-full', premium ? 'bg-gradient-to-r from-rose-500 via-yellow-300 to-amber-200' : 'bg-gradient-to-r from-teal-500 to-cyan-400')} />
                </div>
                <span className={cn('mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em]', premium ? 'text-yellow-100/70' : 'text-teal-700/70')}>
                  <Sparkles className="size-3.5" aria-hidden="true" />{t('onboarding.processing.label')}
                </span>
              </div>
            )}
          </div>

          {step < 3 && (
            <footer className={cn('mt-7 flex flex-col-reverse gap-5 border-t pt-5 sm:mt-8 sm:flex-row sm:items-center sm:justify-between', premium ? 'border-white/10' : 'border-slate-100')}>
              <div className="flex items-center justify-center gap-2 sm:justify-start" aria-label={t('onboarding.progress', { current: step, total: 2 })}>
                {[1, 2].map((dot) => <span key={dot} className={cn('h-2 rounded-full transition-all duration-300', dot === step ? premium ? 'w-8 bg-yellow-300' : 'w-8 bg-teal-600' : premium ? 'w-2 bg-white/20' : 'w-2 bg-slate-200')} />)}
              </div>
              <div className="flex items-center justify-between gap-3">
                {step === 2 ? (
                  <button type="button" onClick={() => setStep(1)} className={cn('inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-xs font-bold transition-all', premium ? 'border-white/10 text-white/65 hover:bg-white/5 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50')}>
                    <ArrowLeft className="size-4" aria-hidden="true" />{t('onboarding.back')}
                  </button>
                ) : <span />}
                <button
                  type="button"
                  onClick={continueFlow}
                  disabled={!isReady}
                  className={cn(
                    'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-xs font-extrabold transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40',
                    premium ? 'bg-gradient-to-r from-yellow-300 to-amber-400 text-slate-950 shadow-[0_0_22px_rgba(250,204,21,.16)] hover:shadow-[0_0_30px_rgba(250,204,21,.28)]' : 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-900/15 hover:shadow-xl',
                  )}
                >
                  {t(step === 1 ? 'onboarding.continue' : 'onboarding.prepare')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </footer>
          )}
        </div>
      </section>
    </main>
  )
}
