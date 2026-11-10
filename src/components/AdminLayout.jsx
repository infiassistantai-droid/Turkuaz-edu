import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Bell, BookOpen, BookText, ChevronDown, LayoutDashboard, Search, ShieldCheck, Trophy, Users } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'
import AdminDashboard from './admin/AdminDashboard'
import AdminUsers from './admin/AdminUsers'
import AdminCourses from './admin/AdminCourses'
import AdminVocabulary from './admin/AdminVocabulary'
import AdminExams from './admin/AdminExams'
import AdminNotifications from './admin/AdminNotifications'
import AdminLeagues from './admin/AdminLeagues'

const ADMIN_ROUTES = [
  { id: 'dashboard', path: '/admin/dashboard', titleKey: 'admin.dashboard.title', icon: LayoutDashboard },
  { id: 'users', path: '/admin/users', titleKey: 'admin.users.title', icon: Users },
  { id: 'courses', path: '/admin/courses', titleKey: 'admin.courses.title', icon: BookOpen },
  { id: 'vocabulary', path: '/admin/vocabulary', titleKey: 'admin.vocabulary.title', icon: BookText },
  { id: 'exams', path: '/admin/exams', titleKey: 'admin.exams.title', icon: ShieldCheck },
  { id: 'notifications', path: '/admin/notifications', titleKey: 'admin.notifications.title', icon: Bell },
  { id: 'leagues', path: '/admin/leagues', titleKey: 'admin.leagues.title', icon: Trophy },
]

function AdminNavItem({ route, pathname, onNavigate, t, compact = false, onSelect }) {
  const Icon = route.icon
  const active = pathname === route.path || (route.id === 'dashboard' && pathname === '/admin')
  return <button type="button" aria-current={active ? 'page' : undefined} onClick={() => { onNavigate(route.path); onSelect?.() }} className={`group flex min-h-11 ${compact ? 'w-auto px-3.5' : 'w-full px-3'} shrink-0 items-center gap-3 rounded-xl text-left text-sm font-semibold transition-all ${active ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-950'}`}>
    <Icon className={`size-[18px] shrink-0 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} aria-hidden="true"/><span className="truncate">{t(route.titleKey)}</span>
  </button>
}

export default function AdminLayout({ pathname = '/admin/dashboard', user, onNavigate, onHome }) {
  const { t } = useI18n()
  const [toast, setToast] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const route = useMemo(() => pathname === '/admin' ? ADMIN_ROUTES[0] : ADMIN_ROUTES.find((item) => item.path === pathname) || ADMIN_ROUTES[0], [pathname])
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase()
    if (!query) return []
    return ADMIN_ROUTES.filter((item) => t(item.titleKey).toLocaleLowerCase().includes(query)).slice(0, 5)
  }, [searchQuery, t])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 3600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const notify = (message) => setToast(String(message || ''))
  const goToRoute = (nextPath) => {
    onNavigate(nextPath)
    setSearchOpen(false)
    setSearchQuery('')
  }
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || t('admin.owner')
  const initials = userName.slice(0, 2).toLocaleUpperCase()

  return <div className="admin-workspace min-h-[100dvh] bg-slate-50 text-slate-900">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-slate-100 px-4">
        <span className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"><ShieldCheck className="size-5" aria-hidden="true"/></span>
        <div className="min-w-0"><p className="truncate text-sm font-black tracking-tight text-slate-950">Turkuaz<span className="text-indigo-600">.</span></p><p className="mt-0.5 truncate text-[9px] font-black uppercase tracking-[.14em] text-slate-400">{t('admin.workspace')}</p></div>
      </div>
      <nav aria-label={t('admin.nav.label')} className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[9px] font-black uppercase tracking-[.16em] text-slate-400">{t('admin.sidebar.workspace')}</p>
        <div className="space-y-1">{ADMIN_ROUTES.map((item) => <AdminNavItem key={item.id} route={item} pathname={pathname} onNavigate={goToRoute} t={t}/>)}</div>
        <div className="mt-7">
          <p className="mb-2 px-3 text-[9px] font-black uppercase tracking-[.16em] text-slate-400">{t('admin.sidebar.pinned')}</p>
          <div className="space-y-1">{ADMIN_ROUTES.filter((item) => ['users', 'courses'].includes(item.id)).map((item) => {
            const Icon = item.icon
            return <button key={`pinned-${item.id}`} type="button" onClick={() => goToRoute(item.path)} className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-xs font-semibold text-slate-500 transition hover:bg-slate-100/80 hover:text-slate-900"><Icon className="size-4 shrink-0 text-slate-400" aria-hidden="true"/>{t(item.titleKey)}</button>
          })}</div>
        </div>
      </nav>
      <div className="m-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-indigo-100 text-xs font-extrabold text-indigo-700">{initials}</span>
        <div className="min-w-0"><p className="truncate text-xs font-bold text-slate-800">{userName}</p><p className="truncate text-[10px] text-slate-500">{user?.email || t('admin.owner')}</p></div>
      </div>
    </aside>

    <div className="min-h-[100dvh] lg:pl-56">
      <header className="sticky top-0 z-20 flex min-h-[68px] items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 shadow-sm shadow-slate-900/[.02] backdrop-blur sm:px-6 lg:px-8">
        <div className="min-w-0 lg:hidden"><p className="hidden text-[9px] font-black uppercase tracking-[.16em] text-indigo-500 sm:block">{t('admin.workspace')}</p><h1 className="truncate text-base font-black text-slate-900 sm:mt-0.5 sm:text-lg">{t(route.titleKey)}</h1></div>
        <div className="relative hidden max-w-md flex-1 sm:block" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSearchOpen(false) }}>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true"/>
          <input value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); setSearchOpen(true) }} onFocus={() => setSearchOpen(true)} onKeyDown={(event) => { if (event.key === 'Escape') setSearchOpen(false); if (event.key === 'Enter' && searchResults[0]) goToRoute(searchResults[0].path) }} placeholder={t('admin.search.placeholder')} aria-label={t('admin.search.placeholder')} className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-10 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"/>
          {searchQuery && <button type="button" onClick={() => { setSearchQuery(''); setSearchOpen(false) }} aria-label={t('admin.common.clearSearch')} className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"><span aria-hidden="true">×</span></button>}
          {searchOpen && searchQuery.trim() && <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
            {searchResults.length ? searchResults.map((item) => {
              const Icon = item.icon
              return <button key={item.id} type="button" onClick={() => goToRoute(item.path)} className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-xs font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"><Icon className="size-4 text-slate-400" aria-hidden="true"/>{t(item.titleKey)}</button>
            }) : <p className="px-3 py-2 text-xs text-slate-500">{t('admin.search.noResults')}</p>}
          </div>}
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden max-w-48 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 sm:flex">
            <span className="grid size-7 place-items-center rounded-full bg-indigo-100 text-[10px] font-extrabold text-indigo-700">{initials}</span><span className="truncate text-[11px] font-semibold text-slate-600">{user?.email || t('admin.owner')}</span><ChevronDown className="size-3.5 shrink-0 text-slate-400" aria-hidden="true"/>
          </div>
          <button type="button" onClick={onHome} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"><ArrowLeft className="size-4" aria-hidden="true"/><span className="hidden sm:inline">{t('admin.back')}</span></button>
        </div>
      </header>

      <nav aria-label={t('admin.nav.label')} className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 lg:hidden">{ADMIN_ROUTES.map((item) => <AdminNavItem key={item.id} route={item} pathname={pathname} onNavigate={goToRoute} t={t} compact/>)}</nav>
      <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">{Object.entries({ dashboard: <AdminDashboard active={route.id === 'dashboard'} onNavigate={goToRoute}/>, users: <AdminUsers active={route.id === 'users'} notify={notify}/>, courses: <AdminCourses notify={notify}/>, vocabulary: <AdminVocabulary notify={notify}/>, exams: <AdminExams notify={notify}/>, notifications: <AdminNotifications notify={notify}/>, leagues: <AdminLeagues active={route.id === 'leagues'} notify={notify}/> }).map(([id, content]) => <div key={id} hidden={route.id !== id}>{content}</div>)}</main>
    </div>

    {toast && <div role="status" aria-live="polite" className="fixed bottom-5 right-4 z-[100] max-w-sm rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-xl sm:right-6">{toast}</div>}
  </div>
}
