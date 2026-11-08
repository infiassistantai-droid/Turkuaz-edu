import { useEffect, useMemo, useState } from 'react'
import { Activity, BookOpenText, ChevronRight, Flame, Headphones, Mic, PenLine, Sparkles, Trophy } from 'lucide-react'
import { loadTurkuazLearnedIds } from '../data/vocabulary'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'

const CATALOG_TOTAL = 1000
const SKILLS = [
  { id: 'okuma', labelKey: 'nav.reading', icon: BookOpenText, tone: 'blue' },
  { id: 'dinleme', labelKey: 'nav.listening', icon: Headphones, tone: 'cyan' },
  { id: 'yazma', labelKey: 'nav.writing', icon: PenLine, tone: 'emerald' },
  { id: 'konusma', labelKey: 'nav.speaking', icon: Mic, tone: 'violet' },
]

const SKILL_TONES = {
  blue: {
    icon: 'bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-200',
    track: 'bg-blue-100 dark:bg-blue-950/70',
    fill: 'from-blue-500 to-sky-400',
    value: 'text-blue-700 dark:text-blue-200',
    border: 'border-blue-100 dark:border-blue-400/15',
  },
  cyan: {
    icon: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200',
    track: 'bg-cyan-100 dark:bg-cyan-950/70',
    fill: 'from-cyan-500 to-teal-400',
    value: 'text-cyan-700 dark:text-cyan-200',
    border: 'border-cyan-100 dark:border-cyan-400/15',
  },
  emerald: {
    icon: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200',
    track: 'bg-emerald-100 dark:bg-emerald-950/70',
    fill: 'from-emerald-500 to-lime-400',
    value: 'text-emerald-700 dark:text-emerald-200',
    border: 'border-emerald-100 dark:border-emerald-400/15',
  },
  violet: {
    icon: 'bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-200',
    track: 'bg-violet-100 dark:bg-violet-950/70',
    fill: 'from-violet-500 to-fuchsia-400',
    value: 'text-violet-700 dark:text-violet-200',
    border: 'border-violet-100 dark:border-violet-400/15',
  },
}

function getCatalogLearnedCount() {
  return loadTurkuazLearnedIds().filter((id) => {
    const match = /^lugat-(\d+)$/u.exec(id)
    return match && Number(match[1]) >= 1 && Number(match[1]) <= CATALOG_TOTAL
  }).length
}

export default function Statistika({ profile, stats = {}, progress = {}, isPremium = false, dark = false, navigate }) {
  const { language, t } = useI18n()
  const isDark = Boolean(isPremium || dark)
  const [mounted, setMounted] = useState(false)
  const [learnedWords] = useState(getCatalogLearnedCount)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const locale = language === 'tr' ? 'tr-TR' : language === 'en' ? 'en-US' : 'uz-UZ'
  const formatNumber = useMemo(() => new Intl.NumberFormat(locale), [locale])
  const fullName = [profile?.name, profile?.surname].filter(Boolean).join(' ').trim() || t('statistika.profileFallback')
  const targetLevel = String(profile?.targetLevel || '').trim() || '—'
  const totalXp = Math.max(0, Number(stats?.xp) || 0)
  const streak = Math.max(0, Number(stats?.streak) || 0)
  const vocabularyPercent = Math.min(100, (learnedWords / CATALOG_TOTAL) * 100)
  const vocabularyCircumference = 2 * Math.PI * 46
  const initials = fullName.split(/\s+/u).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase()

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 pb-10" aria-label={t('statistika.title')}>
      <section className={cn(
        'relative isolate overflow-hidden rounded-[30px] border p-5 shadow-sm sm:p-7 lg:p-8',
        isDark ? 'border-white/10 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-900',
      )}>
        <div aria-hidden="true" className={cn('pointer-events-none absolute -right-12 -top-24 -z-10 size-80 rounded-full blur-3xl', isDark ? 'bg-violet-500/15' : 'bg-cyan-300/35')} />
        <div aria-hidden="true" className={cn('pointer-events-none absolute -bottom-28 left-1/3 -z-10 size-64 rounded-full blur-3xl', isDark ? 'bg-teal-400/10' : 'bg-teal-200/30')} />

        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className={cn('grid size-[68px] shrink-0 place-items-center overflow-hidden rounded-[22px] border text-xl font-black shadow-inner', isDark ? 'border-white/10 bg-white/[.06] text-teal-100' : 'border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-100 text-teal-800')}>
              {profile?.avatarUrl ? <img src={profile.avatarUrl} alt={t('statistika.avatarAlt', { name: fullName })} className="size-full object-cover" /> : initials || 'T'}
            </div>
            <div className="min-w-0">
              <p className={cn('flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em]', isDark ? 'text-teal-200' : 'text-teal-700')}><Sparkles className="size-3.5" />{t('statistika.eyebrow')}</p>
              <h1 className="mt-1 truncate text-2xl font-black tracking-tight sm:text-3xl">{t('statistika.title')}</h1>
              <p className={cn('mt-1 truncate text-sm font-semibold', isDark ? 'text-white/65' : 'text-slate-500')}>{t('statistika.greeting', { name: fullName })}</p>
            </div>
          </div>
          <span className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black', isDark ? 'border-white/10 bg-white/[.05] text-white/80' : 'border-slate-200 bg-slate-50 text-slate-700')}>
            <Trophy className={cn('size-4', isDark ? 'text-cyan-200' : 'text-teal-700')} />
            {t('statistika.levelBadge', { level: targetLevel })}
          </span>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div className={cn('relative overflow-hidden rounded-2xl border p-4 sm:p-5', isDark ? 'border-teal-300/20 bg-gradient-to-br from-teal-950 via-cyan-950 to-slate-950' : 'border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-teal-50')}>
            <div aria-hidden="true" className={cn('pointer-events-none absolute -right-4 -top-10 size-32 rounded-full blur-2xl', isDark ? 'bg-cyan-300/15' : 'bg-cyan-300/25')} />
            <p className={cn('relative text-xs font-bold', isDark ? 'text-white/80' : 'text-slate-800')}>{t('statistika.totalXp')}</p>
            <p className="relative mt-1 flex items-baseline gap-2 text-3xl font-black tabular-nums sm:text-4xl">
              <span className={cn('drop-shadow-[0_0_18px_rgba(255,255,255,.6)]', isDark ? 'text-cyan-100' : 'text-slate-950')}>{formatNumber.format(totalXp)}</span>
              <span className={cn('text-sm font-black', isDark ? 'text-cyan-100' : 'text-slate-800')}>XP</span>
            </p>
          </div>
          <div className={cn('flex items-center justify-between gap-4 rounded-2xl border p-4 sm:p-5', isDark ? 'border-teal-300/20 bg-gradient-to-br from-teal-950 via-cyan-950 to-slate-950' : 'border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-teal-50')}>
            <div>
              <p className={cn('text-xs font-bold', isDark ? 'text-white/80' : 'text-slate-800')}>{t('statistika.streak')}</p>
              <p className="mt-1 text-3xl font-black tabular-nums sm:text-4xl">{formatNumber.format(streak)} <span className={cn('text-sm font-bold', isDark ? 'text-white/75' : 'text-slate-800')}>{t('statistika.days')}</span></p>
            </div>
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-500/20"><Flame className="size-6 fill-current" /></span>
          </div>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="statistika-skills-title">
        <div>
          <p className={cn('text-[10px] font-black uppercase tracking-[.18em]', isDark ? 'text-teal-200' : 'text-teal-700')}>{t('statistika.skillsEyebrow')}</p>
          <h2 id="statistika-skills-title" className={cn('mt-1 text-xl font-black tracking-tight sm:text-2xl', isDark ? 'text-white' : 'text-slate-900')}>{t('statistika.skillsTitle')}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SKILLS.map((skill, index) => {
            const Icon = skill.icon
            const tone = SKILL_TONES[skill.tone]
            const percent = Math.round(Math.max(0, Math.min(100, Number(progress?.[skill.id]) || 0)))
            return (
              <article key={skill.id} className={cn('group rounded-3xl border p-4 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5', tone.border, isDark ? 'bg-slate-950/60 text-white hover:shadow-black/20' : 'bg-white text-slate-900 hover:shadow-slate-900/5')} style={{ transitionDelay: `${index * 45}ms` }}>
                <div className="flex items-center gap-3">
                  <span className={cn('grid size-11 place-items-center rounded-2xl', tone.icon)}><Icon className="size-5" /></span>
                  <h3 className="min-w-0 flex-1 truncate font-black">{t(skill.labelKey)}</h3>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-2">
                  <span className={cn('text-lg font-black tabular-nums', tone.value)}>{formatNumber.format(percent)}%</span>
                  <span className={cn('text-[11px] font-semibold', isDark ? 'text-white/50' : 'text-slate-500')}>{t('statistika.currentProgress')}</span>
                </div>
                <div role="progressbar" aria-label={t(skill.labelKey)} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-valuetext={t('statistika.progressAria', { skill: t(skill.labelKey), percent: formatNumber.format(percent) })} className={cn('mt-3 h-2.5 overflow-hidden rounded-full', tone.track)}>
                  <div className={cn('h-full rounded-full bg-gradient-to-r transition-[width] duration-1000 ease-out motion-reduce:transition-none', tone.fill)} style={{ width: mounted ? `${percent}%` : '0%' }} />
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className={cn('overflow-hidden rounded-3xl border p-4 sm:p-6 lg:p-7', isDark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900')}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={cn('text-[10px] font-black uppercase tracking-[.18em]', isDark ? 'text-violet-200' : 'text-violet-700')}>{t('statistika.vocabularyEyebrow')}</p>
            <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">{t('statistika.vocabularyTitle')}</h2>
            <p className={cn('mt-1 text-sm', isDark ? 'text-white/55' : 'text-slate-500')}>{t('statistika.vocabularySubtitle')}</p>
          </div>
          <button type="button" onClick={() => navigate?.('lugat')} className={cn('inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-extrabold transition hover:gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/20', isDark ? 'bg-violet-300/10 text-violet-100 hover:bg-violet-300/15' : 'bg-violet-50 text-violet-800 hover:bg-violet-100')}>
            {t('statistika.openVocabulary')}<ChevronRight className="size-4" />
          </button>
        </div>
        <div className="mt-5 grid items-center gap-5 sm:grid-cols-[auto_1fr] sm:gap-7">
          <div className="relative mx-auto grid size-36 place-items-center sm:mx-0 sm:size-40" role="progressbar" aria-label={t('statistika.vocabularyTitle')} aria-valuemin={0} aria-valuemax={CATALOG_TOTAL} aria-valuenow={learnedWords}>
            <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
              <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="10" className={isDark ? 'text-white/10' : 'text-slate-100'} />
              <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeDasharray={vocabularyCircumference} strokeDashoffset={vocabularyCircumference * (1 - (mounted ? vocabularyPercent : 0) / 100)} className="text-violet-500 transition-[stroke-dashoffset] duration-[1200ms] ease-out motion-reduce:transition-none" />
            </svg>
            <div className="absolute text-center">
              <p className="text-2xl font-black tabular-nums">{formatNumber.format(learnedWords)}</p>
              <p className={cn('text-[10px] font-bold uppercase tracking-wider', isDark ? 'text-white/45' : 'text-slate-500')}>{t('statistika.ofWords', { total: formatNumber.format(CATALOG_TOTAL) })}</p>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-base font-extrabold">{t('statistika.learnedWords')}</p>
              <p className={cn('text-sm font-black tabular-nums', isDark ? 'text-violet-200' : 'text-violet-700')}>{formatNumber.format(learnedWords)} / {formatNumber.format(CATALOG_TOTAL)}</p>
            </div>
            <div className={cn('mt-3 h-3 overflow-hidden rounded-full', isDark ? 'bg-white/10' : 'bg-slate-100')}>
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-400 transition-[width] duration-1000 ease-out motion-reduce:transition-none" style={{ width: mounted ? `${vocabularyPercent}%` : '0%' }} />
            </div>
            <p className={cn('mt-3 text-xs leading-relaxed', isDark ? 'text-white/55' : 'text-slate-500')}>{t('statistika.vocabularySourceNote')}</p>
          </div>
        </div>
      </section>

      <section className={cn('rounded-3xl border p-4 sm:p-6', isDark ? 'border-white/10 bg-slate-950/70 text-white' : 'border-slate-200 bg-white text-slate-900')}>
        <div>
          <p className={cn('text-[10px] font-black uppercase tracking-[.18em]', isDark ? 'text-blue-200' : 'text-blue-700')}>{t('statistika.activityEyebrow')}</p>
          <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">{t('statistika.activityTitle')}</h2>
        </div>
        <div className={cn('mt-4 flex items-center gap-3 rounded-2xl border p-4 text-sm', isDark ? 'border-white/[.07] bg-white/[.025] text-white/55' : 'border-slate-100 bg-slate-50/70 text-slate-500')}>
          <Activity className="size-5 shrink-0" aria-hidden="true" />
          <p>{t('statistika.activityEmpty')}</p>
        </div>
        {navigate && <button type="button" onClick={() => navigate('home')} className={cn('mt-4 inline-flex items-center gap-1 text-xs font-extrabold transition hover:gap-2', isDark ? 'text-teal-200' : 'text-teal-800')}>{t('statistika.backDashboard')}<ChevronRight className="size-4" /></button>}
      </section>
    </main>
  )
}
