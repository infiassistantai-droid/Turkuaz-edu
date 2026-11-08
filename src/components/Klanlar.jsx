import { ArrowRight, LockKeyhole, UsersRound } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'

export default function Klanlar({ onNavigate }) {
  const { t } = useI18n()

  return (
    <main className="mx-auto w-full max-w-5xl space-y-5 px-1 pb-10 sm:px-2">
      <header className="relative isolate overflow-hidden rounded-[28px] border border-teal-200/50 bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600 p-6 text-white shadow-xl shadow-teal-950/15 sm:rounded-[32px] sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-20 -z-10 size-64 rounded-full bg-cyan-200/20 blur-3xl" aria-hidden="true" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/10 shadow-inner shadow-white/10 sm:size-16">
            <UsersRound className="size-7 sm:size-8" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-white/80">
              <LockKeyhole className="size-3.5" aria-hidden="true" />
              {t('clans.soon')}
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{t('clans.title')}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">{t('clans.subtitle')}</p>
          </div>
        </div>
      </header>

      <section className="glass premium-glass rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80 sm:p-7" aria-labelledby="clans-status-title">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-teal-500/10 text-teal-700 ring-1 ring-teal-500/15 dark:text-teal-300">
            <UsersRound className="size-6" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="clans-status-title" className="text-base font-extrabold text-slate-900 dark:text-white sm:text-lg">{t('clans.title')}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{t('clans.notice')}</p>
          </div>
          <button type="button" onClick={() => onNavigate?.('leagues')} className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-md shadow-teal-900/15 transition hover:-translate-y-0.5 hover:brightness-110 sm:w-auto">
            {t('clans.back')}
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  )
}
