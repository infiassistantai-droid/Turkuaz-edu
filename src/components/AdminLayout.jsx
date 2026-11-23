import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Bell, BookOpen, BookText, LayoutDashboard, Menu, Moon, Search, ShieldCheck, ShoppingBag, Sun, Trophy, Users, X } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'
import AdminDashboard from './admin/AdminDashboard'
import AdminUsers from './admin/AdminUsers'
import AdminCourses from './admin/AdminCourses'
import AdminVocabulary from './admin/AdminVocabulary'
import AdminExams from './admin/AdminExams'
import AdminNotifications from './admin/AdminNotifications'
import AdminLeagues from './admin/AdminLeagues'
import './AdminLayout.css'

const ADMIN_ROUTES = [
  { id: 'dashboard', path: '/admin/dashboard', titleKey: 'admin.dashboard.title', icon: LayoutDashboard },
  { id: 'users', path: '/admin/users', titleKey: 'admin.users.title', icon: Users },
  { id: 'courses', path: '/admin/courses', titleKey: 'admin.courses.title', icon: BookOpen },
  { id: 'vocabulary', path: '/admin/vocabulary', titleKey: 'admin.vocabulary.title', icon: BookText },
  { id: 'exams', path: '/admin/exams', titleKey: 'admin.exams.title', icon: ShieldCheck },
  { id: 'notifications', path: '/admin/notifications', titleKey: 'admin.notifications.title', icon: Bell },
  { id: 'leagues', path: '/admin/leagues', titleKey: 'admin.leagues.title', icon: Trophy },
]

function AdminNav({ active, onNavigate, onOpenShop, id, className }) {
  const { t } = useI18n()
  return (
    <nav id={id} className={className} aria-label={t('admin.nav.label')}>
      {ADMIN_ROUTES.map(({ id: itemId, path, titleKey, icon: Icon }) => (
        <button key={itemId} type="button" aria-current={active === itemId ? 'page' : undefined} onClick={() => onNavigate(path)}>
          <Icon size={18} aria-hidden="true" />
          <span>{t(titleKey)}</span>
        </button>
      ))}
      {onOpenShop && <button type="button" onClick={onOpenShop}><ShoppingBag size={18} aria-hidden="true" /><span>{t('nav.shop')}</span></button>}
    </nav>
  )
}

export default function AdminLayout({ pathname = '/admin/dashboard', user, onNavigate, onHome, onOpenShop, dark, onToggleDark }) {
  const { t } = useI18n()
  const [toast, setToast] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef(null)
  const route = ADMIN_ROUTES.find((item) => item.path === pathname) || ADMIN_ROUTES[0]
  const query = searchQuery.trim().toLocaleLowerCase()
  const searchResults = query ? ADMIN_ROUTES.filter(({ titleKey }) => t(titleKey).toLocaleLowerCase().includes(query)) : []
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || t('admin.owner')
  const initials = String(userName).slice(0, 2).toLocaleUpperCase()

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 3600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const notify = (message) => setToast(String(message || ''))
  const goToRoute = (nextPath) => {
    if (menuOpen) menuButton.current?.focus()
    setMenuOpen(false)
    setSearchOpen(false)
    setSearchQuery('')
    onNavigate(nextPath)
  }

  function handleHeaderKeys(event) {
    if (event.key !== 'Escape' || !menuOpen) return
    setMenuOpen(false)
    menuButton.current?.focus()
  }

  const pages = {
    dashboard: <AdminDashboard active={route.id === 'dashboard'} onNavigate={goToRoute} routes={ADMIN_ROUTES.slice(1)} />,
    users: <AdminUsers active={route.id === 'users'} notify={notify} />,
    courses: <AdminCourses notify={notify} />,
    vocabulary: <AdminVocabulary notify={notify} />,
    exams: <AdminExams notify={notify} />,
    notifications: <AdminNotifications notify={notify} />,
    leagues: <AdminLeagues active={route.id === 'leagues'} notify={notify} />,
  }

  return (
    <div className="studio-admin admin-workspace admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/icons/turkish-education.svg" alt="" width="40" height="40" />
          <div><strong>Turkuaz Edu</strong><span>{t('admin.workspace')}</span></div>
        </div>
        <AdminNav active={route.id} onNavigate={goToRoute} onOpenShop={onOpenShop} className="admin-nav admin-sidebar-nav" />
        <div className="admin-identity">
          <span className="admin-initials">{initials}</span>
          <div className="min-w-0"><strong>{userName}</strong><span title={user?.email}>{t('admin.owner')}</span></div>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-top" onKeyDown={handleHeaderKeys}>
          <div className="admin-top-inner">
            <div className="admin-top-heading">
              <button
                ref={menuButton}
                type="button"
                className="admin-top-button admin-menu-button"
                aria-label={t(menuOpen ? 'header.menu.close' : 'header.menu.open')}
                aria-expanded={menuOpen}
                aria-controls="admin-mobile-nav"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              </button>
              <p>{t(route.titleKey)}</p>
            </div>
            <div className="admin-top-actions">
              <div className="admin-search" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSearchOpen(false) }}>
                <Search size={16} aria-hidden="true" />
                <input
                  value={searchQuery}
                  onChange={(event) => { setSearchQuery(event.target.value); setSearchOpen(true) }}
                  onFocus={() => setSearchOpen(true)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') setSearchOpen(false)
                    if (event.key === 'Enter' && searchResults[0]) goToRoute(searchResults[0].path)
                  }}
                  placeholder={t('admin.search.placeholder')}
                  aria-label={t('admin.search.placeholder')}
                />
                {searchOpen && query && (
                  <div className="admin-search-results admin-nav">
                    {searchResults.length ? searchResults.map(({ id, path, titleKey, icon: Icon }) => (
                      <button type="button" key={id} onClick={() => goToRoute(path)}><Icon size={16} aria-hidden="true" />{t(titleKey)}</button>
                    )) : <p>{t('admin.search.noResults')}</p>}
                  </div>
                )}
              </div>
              {onToggleDark && (
                <button type="button" className="admin-top-button" onClick={onToggleDark} aria-label={t(dark ? 'header.theme.light' : 'header.theme.dark')}>
                  {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
                </button>
              )}
              <button type="button" className="admin-top-button admin-back" onClick={onHome} aria-label={t('admin.back')}>
                <ArrowLeft size={18} aria-hidden="true" /><span>{t('admin.back')}</span>
              </button>
            </div>
          </div>
          {menuOpen && <AdminNav id="admin-mobile-nav" active={route.id} onNavigate={goToRoute} onOpenShop={onOpenShop} className="admin-nav admin-mobile-nav" />}
        </header>

        <main className="admin-content">
          {Object.entries(pages).map(([id, content]) => <div key={id} hidden={route.id !== id}>{content}</div>)}
        </main>
      </div>

      {toast && <div role="status" aria-live="polite" className="admin-toast">{toast}</div>}
    </div>
  )
}

