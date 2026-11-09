import { useCallback, useEffect, useState } from 'react'
import { Activity, ArrowUpRight, Bell, BookOpen, BookOpenCheck, LoaderCircle, RefreshCw, ShieldCheck, Users, Zap } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useI18n } from '../../lib/i18n.jsx'
import { fetchAdminDashboardStats } from '../../lib/supabase.js'
import { AdminCard, AdminPageHeader, SecondaryButton } from './AdminShared'

const METRICS = [
  { id: 'totalUsers', labelKey: 'admin.metric.users', icon: Users, tone: 'bg-blue-50 text-blue-600' },
  { id: 'todayActive', labelKey: 'admin.metric.active', icon: Activity, tone: 'bg-emerald-50 text-emerald-600' },
  { id: 'completedLessons', labelKey: 'admin.metric.lessons', icon: BookOpenCheck, tone: 'bg-violet-50 text-violet-600' },
  { id: 'averageXp', labelKey: 'admin.metric.xp', icon: Zap, tone: 'bg-amber-50 text-amber-600' },
]

const ADMIN_SHORTCUTS = [
  { id: 'users', path: '/admin/users', titleKey: 'admin.users.title', descriptionKey: 'admin.shortcut.users', icon: Users, tone: 'bg-blue-50 text-blue-600' },
  { id: 'courses', path: '/admin/courses', titleKey: 'admin.courses.title', descriptionKey: 'admin.shortcut.courses', icon: BookOpen, tone: 'bg-emerald-50 text-emerald-600' },
  { id: 'vocabulary', path: '/admin/vocabulary', titleKey: 'admin.vocabulary.title', descriptionKey: 'admin.shortcut.vocabulary', icon: BookOpenCheck, tone: 'bg-violet-50 text-violet-600' },
  { id: 'exams', path: '/admin/exams', titleKey: 'admin.exams.title', descriptionKey: 'admin.shortcut.exams', icon: ShieldCheck, tone: 'bg-amber-50 text-amber-600' },
  { id: 'notifications', path: '/admin/notifications', titleKey: 'admin.notifications.title', descriptionKey: 'admin.shortcut.notifications', icon: Bell, tone: 'bg-rose-50 text-rose-600' },
]

const EMPTY_STATS = { totalUsers: null, todayActive: 0, completedLessons: 0, averageXp: null }
const SAMPLE_GROWTH = [
  { day: '1', learners: 8, activity: 19 },
  { day: '2', learners: 11, activity: 24 },
  { day: '3', learners: 10, activity: 22 },
  { day: '4', learners: 16, activity: 31 },
  { day: '5', learners: 19, activity: 35 },
  { day: '6', learners: 23, activity: 43 },
  { day: '7', learners: 28, activity: 49 },
]

function formatMetric(value) {
  return Number.isFinite(Number(value)) ? Math.max(0, Math.round(Number(value))).toLocaleString() : '—'
}

function GrowthTooltip({ active, payload, label, t }) {
  if (!active || !payload?.length) return null
  return <div className="min-w-36 rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-lg">
    <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">{t('admin.chart.dayLabel', { day: label })}</p>
    {payload.map((entry) => <div key={entry.dataKey} className="flex items-center justify-between gap-4 py-0.5 text-xs">
      <span className="flex items-center gap-2 text-slate-500"><span className="size-2 rounded-full" style={{ backgroundColor: entry.color }}/>{t(`admin.chart.series.${entry.dataKey}`)}</span>
      <strong className="tabular-nums text-slate-800">{Number(entry.value).toLocaleString()}</strong>
    </div>)}
  </div>
}

function GrowthChart({ t }) {
  return <div className="p-4 sm:p-5">
    <div className="h-64 rounded-xl border border-slate-100 bg-[linear-gradient(180deg,#fff,#f8fafc)] p-3 pt-5">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={SAMPLE_GROWTH} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="admin-learners-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={0.32}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0.02}/></linearGradient>
            <linearGradient id="admin-activity-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14b8a6" stopOpacity={0.22}/><stop offset="95%" stopColor="#14b8a6" stopOpacity={0.01}/></linearGradient>
          </defs>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 6" vertical={false}/>
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickMargin={10}/>
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} width={34} allowDecimals={false}/>
          <Tooltip content={<GrowthTooltip t={t}/>} cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }}/>
          <Area type="monotone" dataKey="activity" name={t('admin.chart.series.activity')} stroke="#0d9488" strokeWidth={2.5} fill="url(#admin-activity-gradient)" activeDot={{ r: 4, strokeWidth: 0 }}/>
          <Area type="monotone" dataKey="learners" name={t('admin.chart.series.learners')} stroke="#4f46e5" strokeWidth={3} fill="url(#admin-learners-gradient)" activeDot={{ r: 4, strokeWidth: 0 }}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
      <span>{t('admin.chart.period')}</span>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1"><span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-indigo-600"/>{t('admin.chart.series.learners')}</span><span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-teal-600"/>{t('admin.chart.series.activity')}</span><span className="rounded-full bg-indigo-50 px-2 py-1 font-semibold text-indigo-600">{t('admin.chart.sample')}</span></div>
    </div>
  </div>
}

export default function AdminDashboard({ active = true, onNavigate }) {
  const { t } = useI18n()
  const [stats, setStats] = useState(EMPTY_STATS)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState(false)

  const refresh = useCallback(async () => {
    setBusy(true)
    setError(false)
    try {
      const result = await fetchAdminDashboardStats()
      setStats({
        totalUsers: result.totalUsers,
        averageXp: result.averageXp,
        todayActive: 0,
        completedLessons: 0,
      })
    } catch {
      setError(true)
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    if (active) void refresh()
  }, [active, refresh])

  return <div className="mx-auto max-w-7xl">
    <AdminPageHeader eyebrow={t('admin.dashboard.eyebrow')} title={t('admin.dashboard.title')} description={t('admin.dashboard.subtitle')} actions={<SecondaryButton type="button" onClick={refresh} disabled={busy}><RefreshCw className={`size-4 ${busy ? 'animate-spin' : ''}`} aria-hidden="true"/>{t('admin.dashboard.refresh')}</SecondaryButton>}/>
    {error && <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-100 bg-white px-4 py-3 text-xs text-slate-600 shadow-sm"><span>{t('admin.dashboard.statsError')}</span><button type="button" onClick={refresh} className="font-semibold text-indigo-600 hover:text-indigo-700">{t('admin.dashboard.retry')}</button></div>}
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {METRICS.map(({ id, labelKey, icon: Icon, tone }) => <article key={id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold text-slate-500">{t(labelKey)}</p><span className={`grid size-10 place-items-center rounded-xl ${tone}`}><Icon className="size-4" aria-hidden="true"/></span></div>
        {busy ? <span className="mt-3 flex h-9 items-center text-indigo-400" role="status" aria-label={t('admin.dashboard.loading')}><LoaderCircle className="size-5 animate-spin" aria-hidden="true"/></span> : <p className="mt-3 text-3xl font-black tracking-tight text-slate-900 tabular-nums">{error ? '—' : formatMetric(stats[id])}</p>}
      </article>)}
    </div>

    <section className="mt-7" aria-labelledby="admin-shortcuts-heading">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div><h2 id="admin-shortcuts-heading" className="text-base font-black tracking-tight text-slate-900">{t('admin.shortcut.title')}</h2><p className="mt-1 text-xs text-slate-500">{t('admin.shortcut.subtitle')}</p></div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {ADMIN_SHORTCUTS.map(({ id, path, titleKey, descriptionKey, icon: Icon, tone }) => <button key={id} type="button" onClick={() => onNavigate?.(path)} className="group min-h-40 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:p-5">
          <div className="flex items-start justify-between gap-3"><span className={`grid size-10 place-items-center rounded-xl ${tone}`}><Icon className="size-4" aria-hidden="true"/></span><ArrowUpRight className="size-4 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-500" aria-hidden="true"/></div>
          <h3 className="mt-4 text-sm font-extrabold text-slate-900">{t(titleKey)}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{t(descriptionKey)}</p>
        </button>)}
      </div>
    </section>

    <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(260px,.8fr)]">
      <AdminCard title={t('admin.chart.title')} description={t('admin.chart.description')}>
        <GrowthChart t={t}/>
      </AdminCard>
      <AdminCard title={t('admin.security.title')}>
        <div className="p-5"><span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><ShieldCheck className="size-5" aria-hidden="true"/></span><p className="mt-3 text-sm font-extrabold text-slate-800">{t('admin.security.state')}</p><p className="mt-1 text-xs leading-5 text-slate-500">{t('admin.security.details')}</p><p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[10px] leading-4 text-slate-500">{t('admin.security.note')}</p></div>
      </AdminCard>
    </div>
  </div>
}
