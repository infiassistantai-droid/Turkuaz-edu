import { ArrowRight } from 'lucide-react'
import { ModelAsset, PanelHeading, SectionBanner } from './BosforArtwork'
import { useI18n } from '../lib/i18n.jsx'
import './ExamCenter.css'

const SKILLS = [
  ['okuma', 'nav.reading'],
  ['dinleme', 'nav.listening'],
  ['yazma', 'nav.writing'],
  ['konusma', 'nav.speaking'],
]

const SHORT_EXAMS = [
  { id: 'quick', route: 'quick-assessment', model: 'okuma' },
  { id: 'mixed', route: 'mixed-practice', model: 'quests' },
]

export default function ImtihonlarHub({ onNavigate, onStartSection, sectionResults = {} }) {
  const { t } = useI18n()

  return (
    <section className="exam-center mx-auto max-w-6xl space-y-4" aria-labelledby="exam-center-title">
      <SectionBanner name="exams" titleId="exam-center-title" title={t('examsHub.title')} description={t('examsHub.subtitle')} />

      <article className="bosfor-panel exam-feature rounded-2xl border p-4 sm:p-6" aria-labelledby="exam-full-title">
        <PanelHeading name="certificate" titleId="exam-full-title" title={t('examsHub.full.title')} description={t('examsHub.full.description')}>
          <span className="bosfor-badge px-2.5 py-1.5 text-xs font-bold">{t('examsHub.full.detail')}</span>
        </PanelHeading>
        <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SKILLS.map(([skill, label]) => (
            <li key={skill} className="bosfor-inset flex min-w-0 items-center gap-2 rounded-xl border p-2 text-xs font-bold">
              <ModelAsset name={skill} className="size-8" />{t(label)}
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => onNavigate('full-mock')} className="bosfor-action exam-action mt-4" data-exam-route="full-mock">
          {t('examsHub.full.action')}<ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </article>

      <div className="grid gap-4 md:grid-cols-2">
        {SHORT_EXAMS.map(({ id, route, model }) => {
          const key = 'examsHub.' + id
          return (
            <article key={id} className="bosfor-panel flex min-w-0 flex-col rounded-2xl border p-4 sm:p-5" aria-labelledby={'exam-card-' + id}>
              <PanelHeading name={model} titleId={'exam-card-' + id} title={t(key + '.title')} />
              <p className="exam-muted mb-4 mt-3 flex-1 text-sm leading-6">{t(key + '.description')}</p>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="bosfor-badge px-2.5 py-1.5 text-xs font-bold">{t(key + '.detail')}</span>
                <button type="button" onClick={() => onNavigate(route)} className="bosfor-control exam-action" data-exam-route={route}>
                  {t(key + '.action')}<ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          )
        })}
      </div>

      <section className="bosfor-panel rounded-2xl border p-4 sm:p-6" aria-labelledby="exam-skills">
        <PanelHeading name="plan" titleId="exam-skills" title={t('examsHub.skills.title')} description={t('examsHub.skills.description')} />
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          {SKILLS.filter(([skill]) => skill !== 'okuma').map(([skill, label]) => {
            const score = sectionResults[skill]?.scaledScore
            return (
              <button key={skill} type="button" className="bosfor-inset exam-skill flex min-h-16 min-w-0 items-center gap-2 rounded-xl border p-2 text-start" onClick={() => onStartSection(skill)} data-exam-skill={skill}>
                <ModelAsset name={skill} className="size-10" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold">{t(label)}</span>
                  {score != null && <span className="exam-muted block text-xs">{t('examsHub.skills.latest', { score })}</span>}
                </span>
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </button>
            )
          })}
        </div>
      </section>
    </section>
  )
}
