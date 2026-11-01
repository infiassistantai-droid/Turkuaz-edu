import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  BookOpenText,
  CalendarCheck,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ClipboardCheck,
  Download,
  Headphones,
  House,
  Library,
  Lock,
  Mic,
  Menu,
  Moon,
  PenLine,
  Search,
  Sun,
  Sparkles,
  Target,
  Trophy,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { getInitials } from '../lib/storage'
import { useI18n } from '../lib/i18n.jsx'
import NotificationPopover from './NotificationPopover'
import MedalBadge from './MedalBadge'
import UserProfileModal from './UserProfileModal'

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

const NAV = [
  {
    sectionKey: 'nav.section.main',
    items: [
      { id: 'home', labelKey: 'nav.home', icon: House },
      { id: 'plan', labelKey: 'nav.plan', icon: CalendarCheck },
      { id: 'leagues', labelKey: 'nav.leagues', icon: Trophy },
      { id: 'analytics', labelKey: 'nav.analytics', icon: Activity },
    ],
  },
  {
    sectionKey: 'nav.section.skills',
    items: [
      { id: 'okuma', labelKey: 'nav.reading', icon: BookOpenText },
      { id: 'dinleme', labelKey: 'nav.listening', icon: Headphones },
      { id: 'yazma', labelKey: 'nav.writing', icon: PenLine },
      { id: 'konusma', labelKey: 'nav.speaking', icon: Mic },
    ],
  },
  {
    sectionKey: 'nav.section.practice',
    items: [
      { id: 'lugat', labelKey: 'nav.vocabulary', icon: Library },
      { id: 'mock', labelKey: 'nav.mock', icon: ClipboardCheck, badgeKey: 'nav.new', urgent: true },
      { id: 'exams', labelKey: 'nav.exams', icon: Trophy },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*                                   Sidebar                                  */
/* -------------------------------------------------------------------------- */

function Sidebar({ active, onNavigate, collapsed, onToggleCollapse, mobileOpen, onCloseMobile, targetPct, level, equippedMedal, profile, onOpenProfile, onInstallApp, showInstall, isPremium, onTogglePremium }) {
  const { t } = useI18n()
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside
        id="app-sidebar"
        aria-label={t('nav.aria')}
        className={cn(
          'glass fixed inset-y-3 left-3 z-50 flex flex-col rounded-[26px] border border-slate-200/80 bg-white/90 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out dark:border-slate-800/80 dark:bg-slate-950/90',
          'lg:sticky lg:inset-y-auto lg:left-auto lg:top-7 lg:my-0 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          collapsed ? 'w-72 lg:w-[84px]' : 'w-72',
        )}
      >
        <div className={cn('relative flex h-16 shrink-0 items-center gap-3 overflow-hidden px-5', collapsed && 'lg:justify-center lg:px-0')}>
          {isPremium && <img src="/icons/turkish-ay-yildiz.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -right-2 -top-2 z-0 size-20 opacity-[0.09]" />}
          <div className="relative z-10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 opacity-60 blur-md" aria-hidden="true" />
            <div className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 font-serif text-xl font-black text-white ring-1 ring-white/20" aria-hidden="true">T</div>
          </div>
          <div className={cn('relative z-10 min-w-0 leading-none', collapsed && 'lg:hidden')}>
            <p className="font-serif text-[18px] font-extrabold tracking-[-.055em] text-slate-900 dark:text-white">turkuaz<span className="text-teal-600">.</span></p>
            <span className="mt-1 inline-flex items-center rounded-md bg-gradient-to-r from-teal-600/10 to-cyan-500/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-teal-700 ring-1 ring-teal-600/20 dark:text-teal-300 dark:ring-teal-400/25">
              TURKCHA CEFR PRO
            </span>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="relative z-10 ml-auto grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            aria-label={t('header.menu.close')}
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-2">
          {NAV.map((group) => (
            <div key={group.sectionKey} className="mt-5 first:mt-2">
              <p
                className={cn(
                  'mb-2 px-3 text-[10.5px] font-semibold tracking-[0.14em] text-slate-400 dark:text-slate-500',
                  collapsed && 'lg:hidden',
                )}
              >
                {t(group.sectionKey)}
              </p>
              {collapsed && <div className="mx-auto mb-2 hidden h-px w-8 bg-slate-200 lg:block dark:bg-slate-800" />}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = active === item.id
                  const isLocked = item.id !== 'home' && item.id !== 'plan'
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => onNavigate(item.id)}
                        title={isLocked ? `${t(item.labelKey)} · ${t('comingSoon.title')}` : collapsed ? t(item.labelKey) : undefined}
                        aria-label={isLocked ? `${t(item.labelKey)} · ${t('comingSoon.title')}` : undefined}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'nav-glow group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-all duration-200 active:scale-[0.98]',
                          collapsed && 'lg:justify-center lg:px-0',
                          isActive
                            ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-md shadow-teal-600/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white',
                        )}
                      >
                        <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                        <span className={cn('min-w-0 flex-1 truncate', collapsed && 'lg:sr-only')}>
                          {t(item.labelKey)}
                        </span>
                        {isLocked ? (
                          <Lock className={cn('size-3.5 shrink-0', isActive ? 'text-white/80' : isPremium ? 'text-yellow-100/65' : 'text-slate-400', collapsed && 'lg:absolute lg:right-1.5 lg:top-1')} aria-hidden="true" />
                        ) : (item.badgeKey || item.badge) ? (
                          <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            {item.badgeKey ? t(item.badgeKey) : item.badge}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-slate-200/80 p-3 dark:border-slate-800/80">
          {showInstall && <button
            type="button"
            onClick={onInstallApp}
            title={collapsed ? t('nav.install') : undefined}
            aria-label={t('nav.install')}
            className={cn(
              'mb-3 flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-700/15 transition hover:from-teal-700 hover:to-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 active:scale-[0.98] dark:focus-visible:ring-offset-slate-950',
              collapsed && 'lg:justify-center lg:px-0',
            )}
          >
            <Download className="size-4 shrink-0" aria-hidden="true" />
            <span className={cn('flex-1 text-left', collapsed && 'lg:sr-only')}>{t('nav.install')}</span>
          </button>}
          <button
            type="button"
            onClick={onTogglePremium}
            aria-pressed={isPremium}
            className={cn(
              'mb-3 flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition active:scale-[0.98]',
              isPremium
                ? 'border-yellow-300/55 bg-yellow-300/15 text-yellow-100 shadow-[0_0_20px_rgba(250,204,21,0.14)]'
                : 'border-slate-200/80 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800',
              collapsed && 'lg:justify-center lg:px-0',
            )}
            data-testid="toggle-premium-view"
            title={collapsed ? t('auth.theme.title') : undefined}
          >
            <Sparkles className="size-4 shrink-0" aria-hidden="true" />
            <span className={cn('flex-1 text-left', collapsed && 'lg:sr-only')}>{t('auth.theme.title')}</span>
            <span className={cn('h-4 w-7 rounded-full p-0.5 transition-colors', isPremium ? 'bg-yellow-400' : 'bg-slate-300 dark:bg-slate-700')} aria-hidden="true">
              <span className={cn('block size-3 rounded-full bg-white shadow transition-transform', isPremium && 'translate-x-3')} />
            </span>
          </button>
          <div
            role="button"
            tabIndex={0}
            onClick={onOpenProfile}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onOpenProfile()
              }
            }}
            className={cn(
              'cursor-pointer rounded-2xl border p-3 transition-all hover:shadow-md active:scale-[0.98]',
              isPremium
                ? collapsed ? 'border-transparent bg-transparent text-white' : 'premium-profile-card border-yellow-300/35 bg-black/70 text-white shadow-lg'
                : 'border-slate-200/80 bg-gradient-to-b from-slate-50 to-white dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60',
              collapsed && 'lg:border-0 lg:bg-none lg:p-0 lg:justify-center',
            )}
          >
            <div className={cn('flex items-center gap-3', collapsed && 'lg:justify-center')}>
              <div className={cn('relative flex shrink-0 items-center gap-2', collapsed && 'lg:items-start')}>
                <div className="relative grid size-9 place-items-center rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 text-xs font-bold text-white">
                  {profile ? getInitials(profile.name, profile.surname) : t('nav.profile').slice(0, 2).toLocaleUpperCase()}
                  <MedalBadge medalId={equippedMedal} isPremium={isPremium} className="absolute -right-1 -top-1 size-4" />
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" aria-hidden="true" />
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-md border px-1.5 py-1 text-[9px] font-black leading-none tracking-wide',
                    isPremium ? 'border-yellow-200/20 bg-yellow-200/10 text-yellow-100' : 'border-amber-200 bg-amber-50 text-amber-800',
                    collapsed && 'lg:absolute lg:left-1/2 lg:top-10 lg:-translate-x-1/2 lg:px-1 lg:text-[8px]',
                  )}
                  title={`Level ${level}`}
                >
                  Lvl {level}
                </span>
              </div>
              <div className={cn('min-w-0 flex-1', collapsed && 'lg:hidden')}>
                <p className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                  {profile ? [profile.name, profile.surname].filter(Boolean).join(' ') : t('nav.profile')}
                </p>
                <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Target className="size-3 text-rose-500" aria-hidden="true" />
                  {t('profile.target')}: {profile?.targetLevel || '—'} CEFR
                </p>
              </div>
            </div>
            <div className={cn('mt-3', collapsed && 'lg:hidden')}>
              <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span>{t('sidebar.progress')}</span>
                <span className="tabular-nums text-slate-700 dark:text-slate-200">{targetPct}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-teal-600 to-cyan-500" style={{ width: `${targetPct}%` }} />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              'mt-2 hidden w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:flex dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
              collapsed && 'justify-center px-0',
            )}
            aria-label={collapsed ? t('nav.expand') : t('nav.collapse')}
          >
            {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
            {!collapsed && <span>{t('nav.collapse')}</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Header                                  */
/* -------------------------------------------------------------------------- */

function Header({ breadcrumb, dark, onToggleDark, isPremium, collapsed, mobileOpen, onToggleSidebar, xp, level, equippedMedal, profile, onOpenProfile }) {
  const { language, t } = useI18n()
  const searchRef = useRef(null)
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && Boolean(window.matchMedia?.('(min-width: 1024px)').matches))
  const sidebarExpanded = isDesktop ? !collapsed : mobileOpen

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const breakpoint = window.matchMedia('(min-width: 1024px)')
    const updateViewport = () => setIsDesktop(breakpoint.matches)
    updateViewport()
    breakpoint.addEventListener?.('change', updateViewport)
    return () => breakpoint.removeEventListener?.('change', updateViewport)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="glass rise-in sticky top-3 z-30 flex min-h-[70px] items-center rounded-[20px] bg-white/80 px-3 py-3 backdrop-blur-xl dark:bg-slate-950/80 sm:px-5">
      <div className="flex w-full items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-200/80 text-slate-600 transition-colors hover:bg-slate-100 active:scale-95 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={sidebarExpanded ? t('header.menu.close') : t('header.menu.open')}
          aria-expanded={sidebarExpanded}
          aria-controls="app-sidebar"
        >
          <Menu className="size-4" aria-hidden="true" />
        </button>

        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex items-center gap-1.5 text-sm">
            <li className="hidden text-slate-400 sm:block dark:text-slate-500">{breadcrumb.section}</li>
            <li className="hidden text-slate-300 sm:block dark:text-slate-700" aria-hidden="true">/</li>
            <li className="truncate font-semibold tracking-tight text-slate-900 dark:text-white" aria-current="page">
              {breadcrumb.label}
            </li>
          </ol>
        </nav>

        <div className="mx-auto hidden w-full max-w-md md:block">
          <label className="group relative flex items-center">
            <span className="sr-only">{t('header.search')}</span>
            <Search className="search-icon pointer-events-none absolute left-3 size-4 text-gray-500" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              placeholder={t('header.search')}
              className={cn(
                'h-10 w-full rounded-xl border pl-9 pr-14 text-sm font-medium outline-none transition-all',
                isPremium
                  ? 'premium-search border-yellow-200/70 bg-white text-gray-900 shadow-[0_3px_14px_rgba(0,0,0,.16)] placeholder:text-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300/40'
                  : 'border-slate-200/80 bg-slate-50/80 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500',
              )}
            />
            <kbd className={cn("pointer-events-none absolute right-2.5 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-medium", isPremium ? "border border-yellow-200/50 bg-white text-gray-600 shadow-sm" : "border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400")}>
              ⌘K
            </kbd>
          </label>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <span role="img" aria-label={`${xp.toLocaleString(language)} XP`} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-2 py-1.5 text-xs font-semibold tabular-nums text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 sm:px-3">
            <Zap className="size-3.5 fill-amber-400 text-amber-500" aria-hidden="true" />
            <span className="hidden min-[400px]:inline">{xp.toLocaleString(language)} XP</span>
          </span>
          {profile && (
            <button
              type="button"
              onClick={onOpenProfile}
              aria-label={`${profile.name || t('nav.profile')} · ${t('profile.settings')}`}
              aria-haspopup="dialog"
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-full border py-1 pl-1 pr-2.5 transition-all hover:-translate-y-0.5 active:translate-y-0',
                isPremium ? 'border-white/10 bg-black/30 text-white hover:bg-white/10' : 'border-slate-200/80 bg-white/80 text-slate-700 hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200',
              )}
            >
              <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 text-xs font-bold text-white ring-1 ring-white/20">
                {getInitials(profile.name, profile.surname)}
                <MedalBadge medalId={equippedMedal} isPremium={isPremium} className="absolute -right-1.5 -top-1 size-4" />
              </span>
              <span className={cn('rounded-md border px-1.5 py-1 text-[9px] font-black leading-none tracking-wide', isPremium ? 'border-yellow-200/20 bg-yellow-200/10 text-yellow-100' : 'border-amber-200 bg-amber-50 text-amber-800')} title={`Level ${level}`}>
                Lvl {level}
              </span>
              <span className="hidden max-w-20 truncate text-sm font-bold sm:block">{profile.name}</span>
              <ChevronDown className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />
            </button>
          )}
          <NotificationPopover isPremium={isPremium} />
          <button
            type="button"
            onClick={onToggleDark}
            className="grid size-9 place-items-center rounded-xl border border-slate-200/80 text-slate-600 transition-all hover:bg-slate-100 active:scale-95 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={dark ? t('header.theme.light') : t('header.theme.dark')}
            aria-pressed={dark}
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </div>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   App shell                                */
/* -------------------------------------------------------------------------- */

export default function TurkchaDashboard({ active, onNavigate, dark, onToggleDark, isPremium, onTogglePremium, xp, unlockedMedals, equippedMedal, onEquipMedal, targetPct, profile, onEditProfile, onClearData, onLogout, onInstallApp, children }) {
  const { t } = useI18n()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const level = Math.floor(Math.max(0, Number(xp) || 0) / 500) + 1
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false
    return Boolean(window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true)
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const breakpoint = window.matchMedia('(min-width: 1024px)')
    const closeMobileDrawerOnDesktop = (event) => {
      if (event.matches) setMobileOpen(false)
    }
    breakpoint.addEventListener?.('change', closeMobileDrawerOnDesktop)
    return () => breakpoint.removeEventListener?.('change', closeMobileDrawerOnDesktop)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const standaloneQuery = window.matchMedia?.('(display-mode: standalone)')
    const updateStandalone = () => {
      if (standaloneQuery?.matches || window.navigator.standalone === true) setIsInstalled(true)
    }
    const handleInstalled = () => setIsInstalled(true)
    updateStandalone()
    standaloneQuery?.addEventListener?.('change', updateStandalone)
    window.addEventListener('appinstalled', handleInstalled)
    return () => {
      standaloneQuery?.removeEventListener?.('change', updateStandalone)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const breadcrumb = useMemo(() => {
    for (const group of NAV) {
      const item = group.items.find((i) => i.id === active)
      if (item) return { section: t(group.sectionKey), label: t(item.labelKey) }
    }
    return { section: t('breadcrumb.main'), label: t('nav.home') }
  }, [active, t])

  const navigate = (id) => {
    onNavigate(id)
    setMobileOpen(false)
  }

  const toggleSidebar = () => {
    const desktopViewport = window.matchMedia?.('(min-width: 1024px)').matches ?? window.innerWidth >= 1024
    if (desktopViewport) {
      setCollapsed((value) => !value)
      setMobileOpen(false)
    } else {
      setMobileOpen((value) => !value)
    }
  }

  return (
    <div data-theme={isPremium ? 'premium' : 'default'} className={cn('min-h-[100dvh] bg-slate-50 font-sans text-slate-900 antialiased selection:bg-teal-500/20 dark:bg-slate-950 dark:text-slate-100', isPremium ? 'theme-premium bg-gradient-to-br from-[#4a0000] via-[#E30A17] to-[#8a0000]' : 'theme-default')}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className={`absolute -right-32 top-28 size-96 rounded-full blur-[100px] ${isPremium ? 'bg-amber-300/10' : 'bg-cyan-300/10'}`} />
        <div className={`absolute -left-36 bottom-[-4rem] size-[32rem] rounded-full blur-[100px] ${isPremium ? 'bg-red-950/45' : 'bg-teal-900/10'}`} />
        <div className="absolute inset-0 opacity-[.035]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.55) .65px, transparent .65px)', backgroundSize: '5px 5px' }} />
      </div>
      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1600px] gap-3 p-3 sm:gap-5 sm:p-5 lg:gap-5 lg:p-7">
        <Sidebar
          active={active}
          onNavigate={navigate}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          targetPct={targetPct}
          level={level}
          equippedMedal={equippedMedal}
          profile={profile}
          onOpenProfile={() => setProfileOpen(true)}
          onInstallApp={onInstallApp}
          showInstall={!isInstalled}
          isPremium={isPremium}
          onTogglePremium={onTogglePremium}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            breadcrumb={breadcrumb}
            dark={dark}
            onToggleDark={onToggleDark}
            isPremium={isPremium}
            collapsed={collapsed}
            mobileOpen={mobileOpen}
            onToggleSidebar={toggleSidebar}
            xp={xp}
            level={level}
            equippedMedal={equippedMedal}
            profile={profile}
            onOpenProfile={() => setProfileOpen(true)}
          />

          <main className="mx-auto w-full max-w-[1320px] min-w-0 flex-1 pb-10 pt-4 sm:pt-6">
            {children}
          </main>
        </div>
      </div>
      <UserProfileModal
        open={profileOpen}
        onOpenChange={setProfileOpen}
        profile={profile}
        stats={{ xp }}
        level={level}
        unlockedMedals={unlockedMedals}
        equippedMedal={equippedMedal}
        onEquipMedal={onEquipMedal}
        onEditProfile={onEditProfile}
        onClearData={onClearData}
        onLogout={onLogout}
        isPremium={isPremium}
      />
    </div>
  )
}
