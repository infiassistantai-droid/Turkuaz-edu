import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Bell, BookOpen, BookText, LayoutDashboard, ShieldCheck, Users } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'
import AdminDashboard from './admin/AdminDashboard'
import AdminUsers from './admin/AdminUsers'
import AdminCourses from './admin/AdminCourses'
import AdminVocabulary from './admin/AdminVocabulary'
import AdminExams from './admin/AdminExams'
import AdminNotifications from './admin/AdminNotifications'

const ADMIN_ROUTES = [
  { id: 'dashboard', path: '/admin/dashboard', titleKey: 'admin.dashboard.title', icon: LayoutDashboard },
  { id: 'users', path: '/admin/users', titleKey: 'admin.users.title', icon: Users },
  { id: 'courses', path: '/admin/courses', titleKey: 'admin.courses.title', icon: BookOpen },
  { id: 'vocabulary', path: '/admin/vocabulary', titleKey: 'admin.vocabulary.title', icon: BookText },
  { id: 'exams', path: '/admin/exams', titleKey: 'admin.exams.title', icon: ShieldCheck },
  { id: 'notifications', path: '/admin/notifications', titleKey: 'admin.notifications.title', icon: Bell },
]

function AdminNavItem({ route, pathname, onNavigate, t, compact = false }) {
  const Icon = route.icon
  const active = pathname === route.path || (route.id === 'dashboard' && pathname === '/admin')
  return <button type="button" aria-current={active ? 'page' : undefined} onClick={() => onNavigate(route.path)} className={`flex min-h-11 ${compact ? 'w-auto px-3' : 'w-full px-3.5'} shrink-0 items-center gap-3 rounded-xl text-left text-sm font-semibold transition ${active ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}>
    <Icon className={`size-[18px] shrink-0 ${active ? 'text-indigo-600' : 'text-slate-400'}`} aria-hidden="true"/><span className="truncate">{t(route.titleKey)}</span>
  </button>
}

export default function AdminLayout({ pathname = '/admin/dashboard', user, onNavigate, onHome }) {
  const { t } = useI18n()
  const [toast, setToast] = useState('')
  const route = useMemo(() => pathname === '/admin' ? ADMIN_ROUTES[0] : ADMIN_ROUTES.find((item) => item.path === pathname) || ADMIN_ROUTES[0], [pathname])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 3600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const notify = (message) => setToast(String(message || ''))
  return <div className="min-h-[100dvh] bg-slate-50 text-slate-900">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-slate-100 px-5"><span className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"><ShieldCheck className="size-5" aria-hidden="true"/></span><div><p className="text-xs font-black tracking-tight text-slate-950">Turkuaz<span className="text-indigo-600">.</span></p><p className="mt-0.5 text-[9px] font-black uppercase tracking-[.16em] text-slate-400">{t('admin.workspace')}</p></div></div>
      <nav aria-label={t('admin.nav.label')} className="flex-1 space-y-1 overflow-y-auto px-3 py-5">{ADMIN_ROUTES.map((item) => <AdminNavItem key={item.id} route={item} pathname={pathname} onNavigate={onNavigate} t={t}/>)}</nav>
      <div className="m-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3"><p className="text-[9px] font-black uppercase tracking-[.15em] text-indigo-500">{t('admin.owner')}</p><p className="mt-1 break-all text-[11px] font-semibold text-slate-700">{user?.email || '—'}</p></div>
    </aside>

    <div className="min-h-[100dvh] lg:pl-64">
      <header className="sticky top-0 z-20 flex min-h-[68px] items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 shadow-sm shadow-slate-900/[.02] backdrop-blur sm:px-6 lg:px-8">
        <div className="min-w-0"><p className="hidden text-[9px] font-black uppercase tracking-[.16em] text-indigo-500 sm:block">{t('admin.workspace')}</p><h1 className="truncate text-base font-black text-slate-900 sm:mt-0.5 sm:text-lg">{t(route.titleKey)}</h1></div>
        <div className="flex shrink-0 items-center gap-2"><span className="hidden max-w-52 truncate rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-500 md:block">{user?.email || '—'}</span><button type="button" onClick={onHome} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"><ArrowLeft className="size-4" aria-hidden="true"/><span className="hidden sm:inline">{t('admin.back')}</span></button></div>
      </header>

      <nav aria-label={t('admin.nav.label')} className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 lg:hidden">{ADMIN_ROUTES.map((item) => <AdminNavItem key={item.id} route={item} pathname={pathname} onNavigate={onNavigate} t={t} compact/>)}</nav>
      <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">{Object.entries({ dashboard: <AdminDashboard/>, users: <AdminUsers notify={notify}/>, courses: <AdminCourses notify={notify}/>, vocabulary: <AdminVocabulary notify={notify}/>, exams: <AdminExams notify={notify}/>, notifications: <AdminNotifications notify={notify}/> }).map(([id, content]) => <div key={id} hidden={route.id !== id}>{content}</div>)}</main>
    </div>

    {toast && <div role="status" aria-live="polite" className="fixed bottom-5 right-4 z-[100] max-w-sm rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-xl sm:right-6">{toast}</div>}
  </div>
}
