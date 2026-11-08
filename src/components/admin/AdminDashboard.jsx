import { Activity, BookOpenCheck, ShieldCheck, Users, Zap } from 'lucide-react'
import { useI18n } from '../../lib/i18n.jsx'
import { AdminCard, AdminPageHeader } from './AdminShared'

const METRICS = [
  { id: 'users', labelKey: 'admin.metric.users', icon: Users, tone: 'bg-blue-50 text-blue-600' },
  { id: 'active', labelKey: 'admin.metric.active', icon: Activity, tone: 'bg-emerald-50 text-emerald-600' },
  { id: 'lessons', labelKey: 'admin.metric.lessons', icon: BookOpenCheck, tone: 'bg-violet-50 text-violet-600' },
  { id: 'xp', labelKey: 'admin.metric.xp', icon: Zap, tone: 'bg-amber-50 text-amber-600' },
]

export default function AdminDashboard() {
  const { t } = useI18n()
  return <div className="mx-auto max-w-7xl">
    <AdminPageHeader eyebrow={t('admin.dashboard.eyebrow')} title={t('admin.dashboard.title')} description={t('admin.dashboard.subtitle')}/>
    <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-xs leading-5 text-indigo-900"><span className="font-extrabold">{t('admin.data.pending')}:</span> {t('admin.dashboard.dataNote')}</div>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {METRICS.map(({ id, labelKey, icon: Icon, tone }) => <article key={id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold text-slate-500">{t(labelKey)}</p><span className={`grid size-10 place-items-center rounded-xl ${tone}`}><Icon className="size-4" aria-hidden="true"/></span></div>
        <p className="mt-3 text-3xl font-black tracking-tight text-slate-300" aria-label={t('admin.data.pending')}>—</p>
        <p className="mt-1 text-[10px] font-medium text-slate-400">{t('admin.metric.awaitingData')}</p>
      </article>)}
    </div>

    <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(260px,.8fr)]">
      <AdminCard title={t('admin.chart.title')} description={t('admin.chart.description')}>
        <div className="p-4 sm:p-5">
          <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-[linear-gradient(to_bottom,#fff_0%,#f8fafc_100%)]">
            <div className="absolute inset-0 grid grid-rows-4 divide-y divide-slate-100" aria-hidden="true"><span/><span/><span/><span/></div>
            <p className="relative max-w-xs px-5 text-center text-xs leading-5 text-slate-400">{t('admin.chart.empty')}</p>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400"><span>{t('admin.chart.period')}</span><span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-indigo-400"/>{t('admin.chart.registrations')}</span></div>
        </div>
      </AdminCard>
      <AdminCard title={t('admin.security.title')}>
        <div className="p-5"><span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><ShieldCheck className="size-5" aria-hidden="true"/></span><p className="mt-3 text-sm font-extrabold text-slate-800">{t('admin.security.state')}</p><p className="mt-1 text-xs leading-5 text-slate-500">{t('admin.security.details')}</p><p className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-[10px] leading-4 text-amber-900">{t('admin.security.note')}</p></div>
      </AdminCard>
    </div>
  </div>
}
