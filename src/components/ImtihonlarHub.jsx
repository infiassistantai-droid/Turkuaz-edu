import { ArrowRight, BookOpenText, Clock3, Layers3, Shuffle, Trophy } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'
import { cn } from '../lib/utils'

const EXAM_CARDS = [
  {
    id: 'full',
    icon: Trophy,
    route: 'full-mock',
    titleKey: 'examsHub.full.title',
    descriptionKey: 'examsHub.full.description',
    buttonKey: 'examsHub.full.action',
    detailKey: 'examsHub.full.detail',
    tone: 'from-teal-500/15 via-cyan-400/10 to-transparent',
    iconTone: 'bg-teal-100 text-teal-800 dark:bg-teal-300/15 dark:text-teal-200',
    buttonTone: 'bg-gradient-to-r from-teal-700 to-cyan-600 shadow-teal-900/20',
    badgeTone: 'border-teal-300/50 bg-teal-50/80 text-teal-800 dark:border-teal-300/20 dark:bg-teal-300/10 dark:text-teal-200',
  },
  {
    id: 'mixed',
    icon: Shuffle,
    route: 'mixed-practice',
    titleKey: 'examsHub.mixed.title',
    descriptionKey: 'examsHub.mixed.description',
    buttonKey: 'examsHub.mixed.action',
    detailKey: 'examsHub.mixed.detail',
    tone: 'from-cyan-500/15 via-blue-400/10 to-transparent',
    iconTone: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-300/15 dark:text-cyan-100',
    buttonTone: 'bg-gradient-to-r from-cyan-700 to-blue-600 shadow-cyan-900/20',
    badgeTone: 'border-cyan-300/50 bg-cyan-50/80 text-cyan-900 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100',
  },
  {
    id: 'quick',
    icon: BookOpenText,
    route: 'quick-assessment',
    titleKey: 'examsHub.quick.title',
    descriptionKey: 'examsHub.quick.description',
    buttonKey: 'examsHub.quick.action',
    detailKey: 'examsHub.quick.detail',
    tone: 'from-amber-500/15 via-orange-400/10 to-transparent',
    iconTone: 'bg-amber-100 text-amber-900 dark:bg-amber-300/15 dark:text-amber-100',
    buttonTone: 'bg-gradient-to-r from-amber-600 to-orange-500 shadow-amber-900/20',
    badgeTone: 'border-amber-300/50 bg-amber-50/80 text-amber-900 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100',
  },
]

export default function ImtihonlarHub({ onNavigate }) {
  const { t } = useI18n()

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
      <header className="relative isolate overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/85 p-6 shadow-xl shadow-slate-950/5 dark:border-slate-700/70 dark:bg-slate-900/75 sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-24 -z-10 size-72 rounded-full bg-teal-400/15 blur-3xl" />
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">{t('examsHub.eyebrow')}</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">{t('examsHub.title')}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">{t('examsHub.subtitle')}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-300">
          <Layers3 className="size-4 text-teal-700 dark:text-teal-300" aria-hidden="true" />{t('examsHub.choiceCount')}
        </div>
      </header>

      <section className="mt-6 grid items-stretch gap-4 lg:grid-cols-3" aria-label={t('examsHub.cardsLabel')}>
        {EXAM_CARDS.length === 0 ? (
          <p className="col-span-full rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
            {t('examsHub.empty')}
          </p>
        ) : EXAM_CARDS.map((card) => {
          const Icon = card.icon
          const isFull = card.id === 'full'
          return (
            <article key={card.id} className="group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-lg shadow-slate-950/5 transition duration-200 hover:-translate-y-1 hover:border-teal-300/70 hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-900/80 dark:hover:border-teal-400/40 sm:p-6">
              <div className={cn('pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-br opacity-90', card.tone)} aria-hidden="true" />
              <div className="relative flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <span className={cn('grid size-12 place-items-center rounded-2xl', card.iconTone)}><Icon className="size-6" aria-hidden="true" /></span>
                  <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider', card.badgeTone)}>
                    {isFull ? <Clock3 className="size-3.5" aria-hidden="true" /> : <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />}{t(card.detailKey)}
                  </span>
                </div>
                <h2 className="mt-6 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-2xl">{t(card.titleKey)}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{t(card.descriptionKey)}</p>
                <button type="button" onClick={() => onNavigate(card.route)} className={cn('mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold text-white shadow-lg transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900', card.buttonTone)}>
                  {t(card.buttonKey)}<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
                {card.id === 'mixed' && <button type="button" onClick={() => onNavigate('mock')} className="mt-3 text-center text-xs font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4 transition hover:text-teal-700 dark:text-slate-400 dark:decoration-slate-600 dark:hover:text-teal-200">{t('examsHub.mixed.extended')}</button>}
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}
