import { ArrowLeft, Lock } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'

export default function ComingSoon({ isPremium = false, onBack }) {
  const { t } = useI18n()

  return (
    <section className="mx-auto flex min-h-[min(68vh,640px)] w-full max-w-3xl items-center justify-center px-2 py-8 sm:px-4">
      <div className={`relative isolate w-full overflow-hidden rounded-[30px] border px-6 py-12 text-center shadow-2xl sm:px-12 sm:py-16 ${isPremium ? 'border-white/10 bg-black/35 text-white backdrop-blur-2xl' : 'border-slate-200/80 bg-white text-slate-900 shadow-slate-900/5'}`}>
        <div className={`pointer-events-none absolute -right-20 -top-20 size-64 rounded-full blur-[90px] ${isPremium ? 'bg-amber-300/15' : 'bg-teal-300/25'}`} aria-hidden="true" />
        <div className={`pointer-events-none absolute -bottom-24 -left-20 size-64 rounded-full blur-[90px] ${isPremium ? 'bg-rose-500/15' : 'bg-cyan-300/20'}`} aria-hidden="true" />

        <div className={`relative mx-auto mb-7 grid size-20 place-items-center rounded-[26px] border ${isPremium ? 'border-yellow-300/20 bg-yellow-300/10 text-yellow-200 shadow-[0_0_55px_rgba(250,204,21,.24)]' : 'border-teal-100 bg-teal-50 text-teal-700 shadow-[0_0_45px_rgba(13,148,136,.16)]'}`}>
          <Lock className="size-9" strokeWidth={1.8} aria-hidden="true" />
          <span className={`absolute inset-0 rounded-[26px] ring-1 ${isPremium ? 'ring-yellow-200/20' : 'ring-teal-200/50'}`} aria-hidden="true" />
        </div>

        <p className={`relative mb-3 text-[10px] font-extrabold uppercase tracking-[.28em] ${isPremium ? 'text-yellow-200/70' : 'text-teal-700/70'}`}>
          {t('comingSoon.eyebrow')}
        </p>
        <h1 className="relative font-serif text-4xl font-extrabold tracking-[-.05em] sm:text-5xl">
          {t('comingSoon.title')}<span className={isPremium ? 'text-yellow-300' : 'text-teal-600'}>.</span>
        </h1>
        <p className={`relative mx-auto mt-5 max-w-xl text-sm leading-7 sm:text-base ${isPremium ? 'text-white/65' : 'text-slate-500'}`}>
          {t('comingSoon.description')}
        </p>

        <button
          type="button"
          onClick={onBack}
          className={`relative mt-9 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-2xl px-6 py-3 text-sm font-extrabold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${isPremium ? 'bg-gradient-to-r from-yellow-300 to-amber-500 text-slate-950 shadow-[0_8px_28px_rgba(250,204,21,.22)] hover:shadow-[0_10px_34px_rgba(250,204,21,.35)]' : 'bg-gradient-to-r from-teal-700 to-cyan-600 text-white shadow-[0_8px_28px_rgba(13,148,136,.22)] hover:shadow-[0_10px_34px_rgba(13,148,136,.32)]'}`}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('comingSoon.back')}
        </button>
      </div>
    </section>
  )
}
