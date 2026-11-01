import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, BookOpenText, Headphones, Mic, PenLine, Sparkles, Target, Zap } from 'lucide-react'
import { getCefrLevel } from '../lib/multilevelScoring'
import { useI18n } from '../lib/i18n.jsx'

const SKILLS = [
  { id: 'okuma', labelKey: 'skill.reading', icon: BookOpenText, tone: 'blue' },
  { id: 'dinleme', labelKey: 'skill.listening', icon: Headphones, tone: 'emerald' },
  { id: 'yazma', labelKey: 'skill.writing', icon: PenLine, tone: 'violet' },
  { id: 'konusma', labelKey: 'skill.speaking', icon: Mic, tone: 'rose' },
]

const SKILL_TONES = {
  blue: {
    icon: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
    text: 'text-blue-700 dark:text-blue-300',
    fill: 'bg-gradient-to-r from-blue-600 to-sky-400 shadow-[0_0_15px_currentColor] text-blue-500',
    track: 'bg-blue-100 dark:bg-blue-950/60',
    badge: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200',
  },
  emerald: {
    icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    text: 'text-emerald-700 dark:text-emerald-300',
    fill: 'bg-gradient-to-r from-emerald-600 to-teal-400 shadow-[0_0_15px_currentColor] text-emerald-500',
    track: 'bg-emerald-100 dark:bg-emerald-950/60',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200',
  },
  violet: {
    icon: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
    text: 'text-violet-700 dark:text-violet-300',
    fill: 'bg-gradient-to-r from-violet-600 to-fuchsia-400 shadow-[0_0_15px_currentColor] text-violet-500',
    track: 'bg-violet-100 dark:bg-violet-950/60',
    badge: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-200',
  },
  rose: {
    icon: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',
    text: 'text-rose-700 dark:text-rose-300',
    fill: 'bg-gradient-to-r from-rose-600 to-pink-400 shadow-[0_0_15px_currentColor] text-rose-500',
    track: 'bg-rose-100 dark:bg-rose-950/60',
    badge: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200',
  },
}

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function getTrailingDays(today = new Date()) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6 + index, 12)
    return { date, key: localDateKey(date) }
  })
}

function metricForSkill(skillId, sectionResults, progress) {
  const score = sectionResults?.[skillId]?.scaledScore
  if (Number.isFinite(score)) {
    const boundedScore = Math.min(75, Math.max(0, score))
    return { percent: Math.round((boundedScore / 75) * 100), cefr: getCefrLevel(boundedScore), source: 'exam' }
  }

  // Some skill modules report an actual percentage before an exam result exists.
  // A one-point progress tick is only a completion marker, not a score.
  const modulePercent = Number(progress?.[skillId])
  if (Number.isFinite(modulePercent) && modulePercent > 1) {
    const boundedPercent = Math.min(100, Math.max(0, modulePercent))
    return { percent: Math.round(boundedPercent), cefr: getCefrLevel((boundedPercent / 100) * 75), source: 'module' }
  }
  return null
}

function Shell({ children, premium, className = '' }) {
  return <section className={`rounded-3xl border p-5 sm:p-6 ${premium ? 'border-yellow-500/20 bg-black/40 text-white shadow-[0_20px_55px_-30px_rgba(234,179,8,.3)] backdrop-blur-2xl' : 'border-slate-200 bg-white text-slate-900 shadow-[0_12px_35px_-22px_rgba(15,23,42,.24)]'} ${className}`}>{children}</section>
}

function SectionHeading({ icon: Icon, title, subtitle, premium, trailing }) {
  return <div className="flex items-start gap-3">
    <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${premium ? 'border border-yellow-300/20 bg-yellow-300/10 text-yellow-200' : 'border border-slate-100 bg-slate-50 text-teal-700'}`}><Icon className="size-5" aria-hidden="true"/></span>
    <div className="min-w-0 flex-1"><h2 className="text-lg font-extrabold tracking-tight sm:text-xl">{title}</h2>{subtitle && <p className={`mt-1 text-sm leading-relaxed ${premium ? 'text-white/55' : 'text-slate-500'}`}>{subtitle}</p>}</div>
    {trailing}
  </div>
}

export default function AnalyticsDashboard({ sectionResults = {}, progress = {}, stats = {}, isPremium = false }) {
  const { t, language } = useI18n()
  const [mounted, setMounted] = useState(false)
  const premium = Boolean(isPremium)
  const locale = { uz: 'uz-UZ', tr: 'tr-TR', en: 'en-US' }[language] || 'tr-TR'

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const skills = useMemo(() => SKILLS.map((skill) => ({
    ...skill,
    label: t(skill.labelKey),
    metric: metricForSkill(skill.id, sectionResults, progress),
  })), [sectionResults, progress, t])
  const assessedSkills = skills.filter((skill) => skill.metric)
  const strongest = assessedSkills.length ? [...assessedSkills].sort((a, b) => b.metric.percent - a.metric.percent)[0] : null
  const weakest = assessedSkills.length ? [...assessedSkills].sort((a, b) => a.metric.percent - b.metric.percent)[0] : null
  const selectedDays = useMemo(() => getTrailingDays(), [])
  const dailyXp = stats.dailyXp || stats.daily_xp || {}
  const trackingSince = stats.analyticsTrackingSince || stats.analytics_tracking_since || Object.keys(dailyXp).sort()[0] || null
  const todayKey = localDateKey(new Date())
  const chartDays = selectedDays.map(({ date, key }) => {
    const tracked = Boolean(trackingSince && key >= trackingSince && key <= todayKey)
    const storedXp = Number(dailyXp[key])
    const xp = tracked ? (Number.isFinite(storedXp) ? Math.max(0, storedXp) : 0) : null
    return { date, key, xp }
  })
  const knownXp = chartDays.filter((day) => day.xp !== null).map((day) => day.xp)
  const maxXp = Math.max(...knownXp, 1)
  const totalXp = knownXp.length ? knownXp.reduce((sum, value) => sum + value, 0) : null
  const now = new Date()
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7), 12)
  const currentWeekKey = localDateKey(monday)
  const currentWeekXp = stats.weekStart === currentWeekKey
    ? (Number(stats.weeklyXp) || 0)
    : Object.entries(dailyXp).reduce((sum, [dateKey, value]) => dateKey >= currentWeekKey && dateKey <= todayKey ? sum + (Number(value) || 0) : sum, 0)
  const maxXpDay = chartDays.reduce((max, day) => day.xp !== null && (max === null || day.xp > max.xp) ? day : max, null)
  const weekDayKeys = ['weekday.sun', 'weekday.mon', 'weekday.tue', 'weekday.wed', 'weekday.thu', 'weekday.fri', 'weekday.sat']

  const surfaceMuted = premium ? 'text-white/55' : 'text-slate-500'
  const chartTrack = premium ? 'bg-white/[.07]' : 'bg-slate-100'
  const chartBar = premium
    ? 'bg-gradient-to-t from-amber-600 via-yellow-400 to-yellow-200 text-yellow-300 shadow-[0_0_15px_currentColor]'
    : 'bg-gradient-to-t from-teal-700 via-teal-500 to-cyan-400 text-teal-500 shadow-[0_0_15px_currentColor]'
  const averagePercent = assessedSkills.length ? Math.round(assessedSkills.reduce((sum, skill) => sum + skill.metric.percent, 0) / assessedSkills.length) : null

  let insightMessage = t('analytics.insight.empty')
  let highlightText = ''
  if (assessedSkills.length === 1 && strongest) {
    insightMessage = t('analytics.insight.single', { skill: strongest.label, level: t(`level.${strongest.metric.cefr === 'Below B1' ? 'belowB1' : strongest.metric.cefr}`), percent: strongest.metric.percent })
    highlightText = strongest.label
  } else if (assessedSkills.length > 1 && strongest && weakest && strongest.metric.percent === weakest.metric.percent) {
    insightMessage = t('analytics.insight.balanced', { percent: strongest.metric.percent })
  } else if (assessedSkills.length > 1 && strongest && weakest) {
    insightMessage = t('analytics.insight.summary', {
      strongSkill: strongest.label,
      strongLevel: t(`level.${strongest.metric.cefr === 'Below B1' ? 'belowB1' : strongest.metric.cefr}`),
      weakSkill: weakest.label,
    })
    highlightText = weakest.label
  }
  const highlightIndex = highlightText ? insightMessage.indexOf(highlightText) : -1
  const insightContent = highlightIndex >= 0
    ? <>{insightMessage.slice(0, highlightIndex)}<strong className={`rounded-md px-1 font-black ${premium ? 'bg-rose-400/15 text-rose-200' : 'bg-rose-50 text-rose-700'}`}>{highlightText}</strong>{insightMessage.slice(highlightIndex + highlightText.length)}</>
    : insightMessage

  return <main className="mx-auto max-w-6xl space-y-5 pb-8 sm:space-y-6">
    <header className={`relative isolate overflow-hidden rounded-[28px] border p-5 sm:p-7 ${premium ? 'border-yellow-500/20 bg-black/40 text-white shadow-[0_20px_70px_-30px_rgba(234,179,8,.34)] backdrop-blur-2xl' : 'border-slate-200 bg-white text-slate-900 shadow-sm'}`}>
      <div aria-hidden="true" className={`pointer-events-none absolute -right-14 -top-24 -z-10 size-72 rounded-full blur-3xl ${premium ? 'bg-yellow-400/15' : 'bg-cyan-300/25'}`}/>
      <div className="flex flex-wrap items-start gap-4">
        <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${premium ? 'border border-yellow-300/25 bg-yellow-300/10 text-yellow-200 shadow-[0_0_32px_rgba(234,179,8,.15)]' : 'bg-teal-50 text-teal-700'}`}><BarChart3 className="size-7"/></span>
        <div className="min-w-0 flex-1"><p className={`text-[11px] font-black uppercase tracking-[.18em] ${premium ? 'text-yellow-300' : 'text-teal-700'}`}>{t('analytics.eyebrow')}</p><h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{t('analytics.title')}</h1><p className={`mt-2 max-w-2xl text-sm leading-relaxed ${surfaceMuted}`}>{t('analytics.subtitle')}</p></div>
        <div className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-bold ${premium ? 'border-white/10 bg-white/[.04] text-white/75' : 'border-slate-200 bg-slate-50 text-slate-600'}`}><Target className={`size-4 ${premium ? 'text-yellow-300' : 'text-teal-700'}`}/>{t('analytics.assessed', { count: assessedSkills.length, total: SKILLS.length })}</div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className={`rounded-2xl border p-4 ${premium ? 'border-yellow-500/15 bg-white/[.035]' : 'border-slate-100 bg-slate-50/80'}`}><p className={`text-xs font-semibold ${surfaceMuted}`}>{t('analytics.stat.average')}</p><p className="mt-1 text-2xl font-black tabular-nums">{averagePercent === null ? '—' : `%${averagePercent}`}</p></div>
        <div className={`rounded-2xl border p-4 ${premium ? 'border-yellow-500/15 bg-white/[.035]' : 'border-slate-100 bg-slate-50/80'}`}><p className={`text-xs font-semibold ${surfaceMuted}`}>{t('analytics.stat.weeklyXp')}</p><p className="mt-1 flex items-center gap-2 text-2xl font-black tabular-nums">{currentWeekXp.toLocaleString(locale)}<span className={`text-xs font-bold ${premium ? 'text-yellow-200' : 'text-teal-700'}`}>XP</span></p></div>
        <div className={`rounded-2xl border p-4 ${premium ? 'border-yellow-500/15 bg-white/[.035]' : 'border-slate-100 bg-slate-50/80'}`}><p className={`text-xs font-semibold ${surfaceMuted}`}>{t('analytics.stat.strongest')}</p><p className="mt-1 truncate text-lg font-black">{strongest ? strongest.label : '—'}</p></div>
      </div>
    </header>

    <Shell premium={premium} className="relative overflow-hidden">
      {premium && <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-12 size-44 rounded-full bg-yellow-300/10 blur-3xl"/>}
      <SectionHeading icon={Sparkles} title={t('analytics.insight.title')} subtitle={t('analytics.insight.subtitle')} premium={premium} trailing={<span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${premium ? 'bg-white/10 text-white/65' : 'bg-slate-100 text-slate-500'}`}>{t('analytics.insight.mockLabel')}</span>}/>
      <div className={`mt-4 rounded-2xl border px-4 py-4 text-sm leading-7 sm:px-5 sm:py-5 sm:text-base ${premium ? 'border-yellow-400/20 bg-gradient-to-r from-yellow-400/[.08] via-white/[.035] to-rose-400/[.06] text-white/85' : 'border-teal-100 bg-gradient-to-r from-teal-50/70 via-white to-rose-50/60 text-slate-700'}`}>
        <p><span className={`mr-1 font-black ${premium ? 'text-yellow-200' : 'text-teal-800'}`}>{t('analytics.insight.label')}</span>{insightContent}</p>
      </div>
      <p className={`mt-3 text-[11px] leading-relaxed ${surfaceMuted}`}>{t('analytics.insight.disclaimer')}</p>
    </Shell>

    <div className="grid gap-5 lg:grid-cols-[1.04fr_.96fr]">
      <Shell premium={premium}>
        <SectionHeading icon={Activity} title={t('analytics.skills.title')} subtitle={t('analytics.skills.subtitle')} premium={premium} trailing={<span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${premium ? 'bg-white/[.06] text-white/60' : 'bg-slate-50 text-slate-500'}`}>4 {t('analytics.skills.pillars')}</span>}/>
        <div className="mt-6 space-y-5">
          {skills.map((skill, index) => {
            const Icon = skill.icon
            const tone = SKILL_TONES[skill.tone]
            const metric = skill.metric
            const cefrKey = metric?.cefr === 'Below B1' ? 'belowB1' : metric?.cefr
            return <div key={skill.id} className="group" style={{ transitionDelay: `${index * 80}ms` }}>
              <div className="mb-2.5 flex items-center gap-3">
                <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${tone.icon}`}><Icon className="size-[18px]" aria-hidden="true"/></span>
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="font-extrabold">{skill.label}</span>{metric && <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${tone.badge}`}>{t(`level.${cefrKey}`)}</span>}</div><p className={`mt-0.5 text-[11px] ${surfaceMuted}`}>{metric ? t('analytics.skills.basedOn', { source: t(metric.source === 'exam' ? 'analytics.skills.examSource' : 'analytics.skills.moduleSource') }) : t('analytics.skills.notAssessed')}</p></div>
                <span className={`text-lg font-black tabular-nums ${metric ? tone.text : surfaceMuted}`}>{metric ? `%${metric.percent}` : '—'}</span>
              </div>
              <div role="progressbar" aria-label={skill.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={metric?.percent ?? 0} aria-valuetext={metric ? `${metric.percent}% · ${t(`level.${cefrKey}`)}` : t('analytics.skills.notAssessed')} className={`h-2.5 overflow-hidden rounded-full ${tone.track}`}>
                <div className={`h-full rounded-full ${tone.fill} transition-[width] duration-[1100ms] ease-out`} style={{ width: metric && mounted ? `${metric.percent}%` : '0%' }}/>
              </div>
            </div>
          })}
        </div>
      </Shell>

      <Shell premium={premium}>
        <SectionHeading icon={BarChart3} title={t('analytics.activity.title')} subtitle={t('analytics.activity.subtitle')} premium={premium} trailing={<span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${premium ? 'bg-yellow-300/10 text-yellow-100' : 'bg-teal-50 text-teal-800'}`}><Zap className="size-3"/>{t('analytics.activity.xp')}</span>}/>
        <div className="mt-6 flex items-center justify-between gap-3">
          <div><p className={`text-xs font-semibold ${surfaceMuted}`}>{t('analytics.activity.lastSeven')}</p><p className="mt-1 text-2xl font-black tabular-nums">{totalXp === null ? '—' : totalXp.toLocaleString(locale)} <span className={`text-sm ${surfaceMuted}`}>XP</span></p></div>
          {maxXpDay?.xp > 0 && <div className={`text-right text-xs ${surfaceMuted}`}><span className="flex items-center justify-end gap-1 font-bold"><ArrowUpRight className={`size-3.5 ${premium ? 'text-yellow-300' : 'text-teal-700'}`}/>{t('analytics.activity.bestDay')}</span><span className="mt-1 block font-black">{t(weekDayKeys[maxXpDay.date.getDay()])} · {maxXpDay.xp.toLocaleString(locale)} XP</span></div>}
        </div>
        <div className={`relative mt-5 grid h-40 grid-cols-7 gap-2 border-b px-1 ${premium ? 'border-white/15' : 'border-slate-200'}`}>
          {[25, 50, 75].map((line) => <div key={line} aria-hidden="true" className={`pointer-events-none absolute inset-x-0 border-t border-dashed ${premium ? 'border-white/[.08]' : 'border-slate-200/80'}`} style={{ bottom: `${line}%` }}/>) }
          {chartDays.map((day) => {
            const xp = day.xp
            const height = xp === null ? 0 : xp === 0 ? 3 : Math.max(7, (xp / maxXp) * 100)
            const weekday = t(weekDayKeys[day.date.getDay()])
            const tooltip = xp === null ? t('analytics.activity.untracked') : `${xp.toLocaleString(locale)} XP`
            return <div key={day.key} className="group relative z-10 flex min-w-0 flex-col items-center justify-end">
              <span role="tooltip" className={`pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[10px] font-black opacity-0 shadow-xl transition group-hover:opacity-100 group-focus-within:opacity-100 ${premium ? 'border border-yellow-300/20 bg-slate-950 text-yellow-100' : 'border border-slate-200 bg-white text-slate-800'}`}>{tooltip}</span>
              <div className={`relative flex h-[calc(100%-24px)] w-full items-end justify-center rounded-t-xl ${xp === null ? 'border border-dashed border-transparent' : chartTrack}`} title={`${weekday}, ${day.date.toLocaleDateString(locale)}: ${tooltip}`}>
                {xp !== null && <div tabIndex={0} aria-label={`${weekday}, ${tooltip}`} className={`w-[min(70%,32px)] rounded-t-lg outline-none transition-[height,filter] duration-[1000ms] ease-out hover:brightness-125 focus-visible:ring-2 focus-visible:ring-offset-2 ${premium ? 'focus-visible:ring-yellow-300' : 'focus-visible:ring-teal-500'} ${chartBar}`} style={{ height: mounted ? `${height}%` : '0%' }}/>}
              </div>
              <span className={`mt-2 h-4 text-[9px] font-bold sm:text-[10px] ${day.key === todayKey ? premium ? 'text-yellow-200' : 'text-teal-800' : surfaceMuted}`}>{weekday}</span>
            </div>
          })}
        </div>
        <div className={`mt-4 flex items-start gap-2 text-[11px] leading-relaxed ${surfaceMuted}`}><ArrowDownRight className={`mt-0.5 size-3.5 shrink-0 ${premium ? 'text-yellow-300' : 'text-teal-700'}`}/><p>{trackingSince ? t('analytics.activity.trackedNote') : t('analytics.activity.emptyNote')}</p></div>
      </Shell>
    </div>
  </main>
}
