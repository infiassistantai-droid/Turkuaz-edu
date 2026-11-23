import { useState } from 'react'
import { ArrowRight, Check, Flag, MapPin } from 'lucide-react'
import { ModelAsset, PanelHeading, SectionBanner } from './BosforArtwork'
import { useI18n } from '../lib/i18n.jsx'
import { loadJSON, readingSectionProgressKey } from '../lib/storage'
import './JourneyMap.css'

const STOPS = [
  { id: 'words', city: 'İzmir', route: 'lugat', model: 'lugat' },
  { id: 'reading', city: 'Çanakkale', route: 'okuma', model: 'okuma' },
  { id: 'listening', city: 'Bursa', route: 'dinleme', model: 'dinleme' },
  { id: 'writing', city: 'Eskişehir', route: 'yazma', model: 'yazma' },
  { id: 'speaking', city: 'Ankara', route: 'konusma', model: 'konusma' },
  { id: 'readingExam', city: 'Konya', route: 'quick-assessment', model: 'exams' },
  { id: 'fullExam', city: 'İstanbul', route: 'full-mock', model: 'certificate' },
]

function StopDetails({ stop, state, detail, titleId, onOpen, t }) {
  return (
    <section className="bosfor-panel journey-details rounded-2xl border p-4 sm:p-5" aria-labelledby={titleId} data-state={state}>
      <div className="journey-detail-art"><ModelAsset name={stop.model} /></div>
      <p className="journey-muted flex items-center gap-1.5 text-xs font-bold"><MapPin className="size-4" aria-hidden="true" /><span lang="tr">{stop.city}</span></p>
      <h2 id={titleId} className="mt-1 text-lg font-extrabold">{t('journey.stop.' + stop.id)}</h2>
      <p className="journey-muted mt-1 text-sm leading-relaxed">{t('journey.stop.' + stop.id + '.goal')}</p>
      {detail && <p className="bosfor-inset mt-3 rounded-xl border p-2.5 text-xs font-bold">{detail}</p>}
      <button type="button" onClick={onOpen} className={(state === 'next' ? 'bosfor-action' : 'bosfor-control') + ' journey-action mt-4 w-full'} data-journey-destination={stop.route}>
        {t('journey.open')} <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </section>
  )
}

export default function JourneyMap({ stats = {}, sectionResults = {}, learnerId, navigate }) {
  const { t } = useI18n()
  const [selectedId, setSelectedId] = useState(null)
  const completedSkills = new Set([
    ...(Array.isArray(stats.completedLessons) ? stats.completedLessons : []),
    ...(Array.isArray(stats.skillsCompleted) ? stats.skillsCompleted : []),
  ])
  const savedWords = Math.max(0, Number(stats.savedWordsCount) || 0)
  const reading = sectionResults.okuma
  const latestReadingExam = reading?.testType === 'reading-only'
    ? reading
    : Array.isArray(reading?.history) ? [...reading.history].reverse().find((result) => result?.testType === 'reading-only') : null
  const readingPractice = loadJSON(readingSectionProgressKey(learnerId), {})
  const completed = {
    words: savedWords > 0,
    reading: stats.readingCompletedCount > 0
      || (!Array.isArray(readingPractice) && Object.keys(readingPractice).length > 0)
      || (!latestReadingExam && completedSkills.has('okuma')),
    listening: completedSkills.has('dinleme') || stats.listeningLessonsCompleted > 0,
    writing: completedSkills.has('yazma'),
    speaking: completedSkills.has('konusma'),
    readingExam: Boolean(latestReadingExam),
    fullExam: Boolean(stats.examDone),
  }
  const completedCount = STOPS.filter(({ id }) => completed[id]).length
  const next = STOPS.find(({ id }) => !completed[id])
  const selected = STOPS.find(({ id }) => id === selectedId) || next || STOPS.at(-1)
  const stateFor = (stop) => completed[stop.id] ? 'done' : stop === next ? 'next' : 'open'
  const selectedDetail = selected.id === 'words' && savedWords
    ? t('journey.words', { count: savedWords })
    : selected.id === 'readingExam' && latestReadingExam?.scaledScore != null
      ? t('journey.readingScore', { score: latestReadingExam.scaledScore })
      : null
  const detailsProps = {
    stop: selected,
    state: stateFor(selected),
    detail: selectedDetail,
    onOpen: () => navigate(selected.route),
    t,
  }

  return (
    <section className="bosfor-journey mx-auto max-w-6xl space-y-4" aria-labelledby="journey-title">
      <SectionBanner name="journey" titleId="journey-title" title={t('journey.title')} description={t('journey.subtitle')} />

      <section className="bosfor-panel rounded-2xl border p-4 sm:p-5" aria-labelledby="journey-progress">
        <PanelHeading name={next ? 'plan' : 'medal'} titleId="journey-progress" title={next ? t('journey.nextHint') : t('journey.finished')} description={next ? next.city + ' · ' + t('journey.stop.' + next.id) : undefined}>
          <span className="bosfor-badge px-2.5 py-1.5 text-xs font-bold tabular-nums">{t('journey.count', { done: completedCount, total: STOPS.length })}</span>
          {next && <button type="button" onClick={() => navigate(next.route)} className="bosfor-action journey-action" data-journey-next={next.route}>{t('journey.open')}<ArrowRight className="size-4" aria-hidden="true" /></button>}
        </PanelHeading>
        <div className="bosfor-track mt-4 grid grid-cols-7 gap-1 rounded-full" role="progressbar" aria-label={t('journey.route')} aria-valuemin={0} aria-valuemax={STOPS.length} aria-valuenow={completedCount}>
          {STOPS.map(({ id }) => <span key={id} className="journey-progress-segment" data-done={Boolean(completed[id])} />)}
        </div>
      </section>

      <div className="journey-layout grid items-start gap-4">
        <section className="journey-board rounded-2xl border p-3 sm:p-5" aria-labelledby="journey-route">
          <h2 id="journey-route" className="mb-3 flex items-center gap-2 font-extrabold"><Flag className="size-4" aria-hidden="true" />{t('journey.route')}</h2>
          <ol className="journey-stops">
            {STOPS.map((stop, index) => {
              const state = stateFor(stop)
              return (
                <li key={stop.id} className="journey-stop" data-state={state}>
                  <button type="button" aria-pressed={stop === selected} className="journey-pin" onClick={() => setSelectedId(stop.id)} data-journey-stop={stop.id}>
                    <span className="journey-token">
                      <ModelAsset name={stop.model} className="journey-model" />
                      <span className="journey-position" aria-hidden="true">{state === 'done' ? <Check className="size-3" /> : index + 1}</span>
                    </span>
                    <span className="journey-pin-caption">
                      <span lang="tr" className="block text-sm font-extrabold">{stop.city}</span>
                      <span className="journey-muted block text-xs font-medium">{t('journey.stop.' + stop.id)}</span>
                      {state !== 'open' && <span className="journey-state mt-1 inline-block text-[.7rem] font-bold">{t(state === 'next' ? 'journey.current' : 'journey.completed')}</span>}
                    </span>
                  </button>
                  {stop === selected && <div className="journey-detail-mobile"><StopDetails {...detailsProps} titleId="journey-mobile-detail" /></div>}
                </li>
              )
            })}
          </ol>
        </section>
        <aside className="journey-detail-desktop"><StopDetails {...detailsProps} titleId="journey-desktop-detail" /></aside>
      </div>
    </section>
  )
}
