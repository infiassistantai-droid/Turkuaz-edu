import { useState } from 'react'
import { ArrowRight, Target } from 'lucide-react'
import { loadTurkuazLearnedIds } from '../data/vocabulary'
import { useI18n } from '../lib/i18n.jsx'
import { ModelAsset, PanelHeading, SectionBanner } from './BosforArtwork'
import '../bosfor-statistika.css'

const CATALOG_TOTAL = 1000
const EXAM_MAX = 75
const RANGES = [7, 30]
const SKILLS = [
  ['okuma', 'nav.reading'],
  ['dinleme', 'nav.listening'],
  ['yazma', 'nav.writing'],
  ['konusma', 'nav.speaking'],
]
const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']

function formatDay(date, language) {
  if (language === 'uz') return date.getDate() + '-' + UZ_MONTHS[date.getMonth()]
  return date.toLocaleDateString(language, { day: 'numeric', month: 'short' })
}

function getCatalogLearnedCount() {
  return loadTurkuazLearnedIds().filter((id) => {
    const match = /^lugat-(\d+)$/u.exec(id)
    return match && Number(match[1]) >= 1 && Number(match[1]) <= CATALOG_TOTAL
  }).length
}

function getActivityDays(stats, range) {
  const today = new Date()
  const dailyXp = stats.dailyXp || {}
  const trackingSince = stats.analyticsTrackingSince || Object.keys(dailyXp).sort()[0]

  return Array.from({ length: range }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - range + index + 1)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const key = [date.getFullYear(), month, day].join('-')
    const recordedXp = dailyXp[key]
    const isTracked = trackingSince && key >= trackingSince
    const xp = recordedXp != null || isTracked ? Math.max(0, Number(recordedXp) || 0) : null
    return { date, key, xp }
  })
}

function ActivityPanel({ stats, language, t, format }) {
  const [range, setRange] = useState(7)
  const [selectedKey, setSelectedKey] = useState(null)
  const days = getActivityDays(stats, range)
  const activeDays = days.filter(({ xp }) => xp > 0)
  const total = activeDays.reduce((sum, { xp }) => sum + xp, 0)
  const maximum = Math.max(1, ...activeDays.map(({ xp }) => xp))
  const selected = days.find(({ key }) => key === selectedKey) || activeDays.at(-1) || days.at(-1)
  const hasHistory = days.some(({ xp }) => xp !== null)
  const describeXp = (xp) => xp === null ? t('analytics.activity.untracked') : format(xp) + ' XP'

  return (
    <section className="bosfor-panel min-w-0 rounded-2xl border p-4 sm:p-6" aria-labelledby="stats-activity">
      <PanelHeading name="xp" titleId="stats-activity" title={t('statistika.activityTitle')} description={t('statistika.activityDescription')}>
        <div className="bosfor-tabs" role="group" aria-label={t('statistika.period')}>
          {RANGES.map((daysInRange) => (
            <button key={daysInRange} type="button" className="bosfor-tab" aria-pressed={range === daysInRange} onClick={() => { setRange(daysInRange); setSelectedKey(null) }}>
              {t('statistika.range', { count: daysInRange })}
            </button>
          ))}
        </div>
      </PanelHeading>
      {hasHistory ? (
        <>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-3xl font-extrabold tabular-nums">{format(total)} <span className="text-base">XP</span></p>
              <p className="stats-muted text-xs">{t('statistika.activeDays', { count: format(activeDays.length) })}</p>
            </div>
            <div className="bosfor-inset rounded-xl border px-3 py-2 text-sm" aria-live="polite">
              <p className="stats-muted text-xs">{formatDay(selected.date, language)}</p>
              <p className="font-bold">{describeXp(selected.xp)}</p>
            </div>
          </div>
          <div className="stats-chart mt-4" style={{ '--stats-days': range }} role="group" aria-label={t('statistika.activityDescription')}>
            {days.map(({ date, key, xp }, index) => {
              const dateLabel = formatDay(date, language)
              const showDate = range === 7 || [0, 7, 14, 21, 29].includes(index)
              return (
                <div key={key} className="stats-chart-day">
                  <button type="button" aria-label={dateLabel + ', ' + describeXp(xp)} aria-pressed={selected.key === key} title={dateLabel + ' · ' + describeXp(xp)} onClick={() => setSelectedKey(key)}>
                    <span data-untracked={xp === null} style={{ height: xp > 0 ? (xp / maximum) * 100 + '%' : undefined }} />
                  </button>
                  <span aria-hidden="true">{showDate ? date.getDate() : ''}</span>
                </div>
              )
            })}
          </div>
          {range === 30 && (
            <select className="bosfor-control mt-2 min-h-11 w-full rounded-xl px-2 text-sm sm:hidden" aria-label={t('statistika.activityDate')} value={selected.key} onChange={(event) => setSelectedKey(event.target.value)}>
              {[...days].reverse().map(({ date, key, xp }) => (
                <option key={key} value={key}>{formatDay(date, language)} · {describeXp(xp)}</option>
              ))}
            </select>
          )}
        </>
      ) : (
        <div className="bosfor-inset mt-5 grid min-h-48 content-center justify-items-center gap-2 rounded-2xl border p-5 text-center">
          <ModelAsset name="plan" className="size-12" />
          <p className="font-bold">{t('statistika.activityEmpty')}</p>
          <p className="stats-muted max-w-xs text-sm">{t('statistika.activityEmptyNote')}</p>
        </div>
      )}
    </section>
  )
}

export default function Statistika({ profile, stats = {}, progress = {}, sectionResults = {}, navigate }) {
  const { language, t } = useI18n()
  const { format } = new Intl.NumberFormat(language)
  const [learnedWords] = useState(getCatalogLearnedCount)
  const name = [profile?.name, profile?.surname].filter(Boolean).join(' ').trim() || t('statistika.profileFallback')
  const metrics = [
    ['xp', 'totalXp', stats.xp, 'XP'],
    ['streak', 'streak', stats.streak, t('statistika.days')],
    ['exams', 'completedQuizzes', stats.completedQuizzes],
    ['lugat', 'learnedWords', learnedWords],
  ]

  const skills = SKILLS.map(([id, labelKey]) => {
    const rawScore = sectionResults[id]?.scaledScore
    const score = rawScore != null && rawScore !== '' && Number.isFinite(Number(rawScore))
      ? Math.max(0, Math.min(EXAM_MAX, Number(rawScore)))
      : null
    const percent = Math.round(Math.max(0, Math.min(100, Number(progress[id]) || 0)))
    return { id, label: t(labelKey), score, percent }
  })
  const assessed = skills.filter(({ score }) => score !== null).length

  return (
    <div className="bosfor-statistika mx-auto w-full max-w-6xl space-y-4 pb-4" aria-labelledby="stats-title">
      <SectionBanner name="readiness" titleId="stats-title" title={t('statistika.title')} description={t('statistika.greeting', { name })}>
        {profile?.targetLevel && <span><Target className="size-3.5" />{t('statistika.levelBadge', { level: profile.targetLevel })}</span>}
      </SectionBanner>

      <dl className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
        {metrics.map(([asset, label, value, unit]) => (
          <div key={label} className="bosfor-panel stats-metric relative min-w-0 rounded-2xl border p-3 sm:p-4">
            <dt className="stats-muted text-xs font-semibold">{t('statistika.' + label)}</dt>
            <dd className="mt-1 text-xl font-extrabold tabular-nums sm:text-3xl">{format(Math.max(0, Number(value) || 0))} {unit && <span className="stats-muted text-xs font-bold sm:text-sm">{unit}</span>}</dd>
            <ModelAsset name={asset} className="stats-metric-model" />
          </div>
        ))}
      </dl>

      <div className="stats-main-grid grid items-stretch gap-4">
        <ActivityPanel stats={stats} language={language} t={t} format={format} />
        <section className="bosfor-panel stats-vocabulary flex min-w-0 flex-col rounded-2xl border p-4 sm:p-6" aria-labelledby="stats-vocabulary">
          <PanelHeading name="lugat" titleId="stats-vocabulary" title={t('statistika.vocabularyTitle')} />
          <div className="my-auto py-5">
            <p className="text-3xl font-extrabold tabular-nums">{format(learnedWords)} <span className="stats-muted text-sm font-semibold">{t('statistika.ofWords', { total: format(CATALOG_TOTAL) })}</span></p>
            <progress className="stats-progress mt-3" max={CATALOG_TOTAL} value={learnedWords} aria-label={t('statistika.learnedWords')} />
            <p className="stats-muted mt-2 text-sm">{t('statistika.vocabularySubtitle')}</p>
          </div>
          <button type="button" className="bosfor-control flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 text-sm font-bold" onClick={() => navigate('lugat')}>
            {t('statistika.openVocabulary')} <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
          </button>
        </section>
      </div>

      <section className="bosfor-panel rounded-2xl border p-4 sm:p-6" aria-labelledby="stats-skills">
        <PanelHeading name="exams" titleId="stats-skills" title={t('statistika.skillsTitle')} description={t('statistika.skillsDescription')}>
          <span className="bosfor-badge px-2.5 py-1.5 text-xs font-bold">{t('analytics.assessed', { count: assessed, total: SKILLS.length })}</span>
        </PanelHeading>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {skills.map(({ id, label, score, percent }) => (
            <li key={id} className="bosfor-inset min-w-0 rounded-xl border p-3">
              <button type="button" className="stats-skill-link flex min-h-11 w-full items-center gap-2 text-start font-bold" onClick={() => navigate(id)}>
                <ModelAsset name={id} className="size-10" />
                <span className="flex-1">{label}</span>
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </button>
              <div className="mt-3 flex items-baseline justify-between gap-2 text-xs">
                <span className="stats-muted">{t('statistika.practice')}</span>
                <strong className="tabular-nums">{format(percent)}%</strong>
              </div>
              <progress className="stats-progress mt-1.5" max={100} value={percent} aria-label={t('statistika.progressAria', { skill: label, percent: format(percent) })} />
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 border-t pt-2.5 text-xs [border-color:var(--studio-line)]">
                <span className="stats-muted">{t('statistika.examScore')}</span>
                <strong className="tabular-nums">{score === null ? t('analytics.skills.notAssessed') : format(score) + ' / ' + EXAM_MAX}</strong>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
