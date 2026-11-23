import { ModelAsset } from './BosforArtwork'
import { useEffect, useRef, useState } from 'react'
import {
  Activity,
  BookOpenText,
  CalendarCheck,
  ChevronDown,
  Download,
  Headphones,
  House,
  Library,
  Lock,
  Map,
  LogOut,
  Mic,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  PenLine,
  Snowflake,
  ShoppingBag,
  Sun,
  ShieldCheck,
  Target,
  Trophy,
  UsersRound,
  X,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabase.js'
import { getInitials, loadJSON, saveJSON } from '../lib/storage'
import { getRatingTier } from '../lib/ranks'
import { useI18n } from '../lib/i18n.jsx'
import { canAccessShop, isOwnerEmail } from '../config/admin'
import { useWinterUpdate } from '../features/winter/WinterUpdateContext'
import NotificationPopover from './NotificationPopover'
import RankUpModal from './RankUpModal'
import StreakMilestoneModal from './StreakMilestoneModal'
import TrophyCelebrationModal from './TrophyCelebrationModal'
import UserProfileModal from './UserProfileModal'
import ProfileAvatar from './ProfileAvatar'
import WinterEffects from '../features/winter/WinterEffects'

const SIDEBAR_PREFERENCE_KEY = 'turkuaz-sidebar-collapsed'
const WIDE_NAV_QUERY = '(min-width: 1280px)'

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

const NAV = [
  {
    sectionKey: 'nav.section.main',
    items: [
      { id: 'home', labelKey: 'nav.home', icon: House },
      { id: 'plan', labelKey: 'nav.plan', icon: CalendarCheck },
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
      { id: 'lugat', labelKey: 'nav.vocabulary', icon: Library },
    ],
  },
  {
    sectionKey: 'nav.section.practice',
    items: [
      { id: 'exams', labelKey: 'nav.exams', icon: Trophy },
      { id: 'journey', labelKey: 'nav.journey', icon: Map },
      { id: 'shop', labelKey: 'nav.shop', icon: ShoppingBag, adminOnly: true },
      { id: 'leagues', labelKey: 'nav.leagues', icon: Trophy },
      { id: 'clans', labelKey: 'nav.clans', icon: UsersRound },
    ],
  },
  {
    sectionKey: 'nav.section.admin',
    items: [{ id: 'admin', labelKey: 'nav.admin', icon: ShieldCheck, ownerOnly: true }],
  },
]

/* -------------------------------------------------------------------------- */
/*                                   Sidebar                                  */
/* -------------------------------------------------------------------------- */

function Sidebar({ active, onNavigate, mobileOpen, onCloseMobile, collapsed, onToggleCollapsed, targetPct, level, profile, onOpenProfile, onInstallApp, onLogout, showInstall, isPremium }) {
  const { t } = useI18n()
  const { user: authUser } = useAuth()
  const groups = NAV.map((group) => ({
    ...group,
    items: group.items.filter((item) => (!item.ownerOnly || isOwnerEmail(authUser?.email)) && (!item.adminOnly || canAccessShop(authUser))),
  })).filter(({ items }) => items.length)
  const closeButtonRef = useRef(null)
  const toggleLabel = t(collapsed ? 'nav.expand' : 'nav.collapse')
  const { enabled: winterModeEnabled, featureEnabled: winterFeatureEnabled, toggle: toggleWinterMode } = useWinterUpdate()

  useEffect(() => {
    if (!mobileOpen) return undefined
    const frame = requestAnimationFrame(() => closeButtonRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [mobileOpen])

  function handleDrawerKeyDown(event) {
    if (!mobileOpen) return
    if (event.key === 'Escape') {
      event.preventDefault()
      onCloseMobile()
    }
    if (event.key !== 'Tab') return
    const buttons = Array.from(event.currentTarget.querySelectorAll('button:not([disabled]), [tabindex="0"]'))
      .filter((button) => button.getClientRects().length > 0)
    const first = buttons[0]
    const last = buttons[buttons.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside
        id="app-sidebar"
        aria-label={t('nav.aria')}
        role={mobileOpen ? 'dialog' : undefined}
        aria-modal={mobileOpen || undefined}
        onKeyDown={handleDrawerKeyDown}
        className={cn(
          'studio-sidebar bosfor-sidebar fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-transform duration-200 ease-out motion-reduce:transition-none lg:visible lg:translate-x-0',
          mobileOpen ? 'visible translate-x-0' : 'invisible -translate-x-full',
        )}
      >
        <div className={cn('relative flex h-16 shrink-0 items-center gap-3 overflow-hidden px-5', collapsed && 'lg:justify-center lg:px-0')}>
          {isPremium && <img src="/icons/turkish-ay-yildiz.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -right-2 -top-2 z-0 size-20 opacity-[0.09]" />}
          <img src="/icons/turkish-education.svg" alt="" className="relative z-10 size-9 shrink-0 rounded-xl" />
          <div className={cn('relative z-10 min-w-0 leading-none', collapsed && 'lg:hidden')}>
            <p className="studio-wordmark">Turkuaz <span>Edu</span></p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onCloseMobile}
            className="bosfor-theme-switch relative z-10 ml-auto grid size-11 shrink-0 place-items-center rounded-xl transition active:scale-95 lg:hidden"
            aria-label={t('header.menu.close')}
          >
            <X className="size-4" />
          </button>
        </div>

        <button
          type="button"
          className={cn('bosfor-sidebar-toggle mx-3.5 mt-1 hidden min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-semibold lg:flex', collapsed && 'lg:justify-center lg:px-0')}
          onClick={onToggleCollapsed}
          aria-label={toggleLabel}
          title={toggleLabel}
          aria-expanded={!collapsed}
          aria-controls="app-sidebar-navigation"
        >
          {collapsed ? <PanelLeftOpen size={18} aria-hidden="true" /> : <PanelLeftClose size={18} aria-hidden="true" />}
          {!collapsed && <span>{toggleLabel}</span>}
        </button>

        <nav id="app-sidebar-navigation" aria-label={t('nav.aria')} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4 pt-2 lg:px-3.5">
          {groups.map((group) => (
            <div key={group.sectionKey} className="mt-5 first:mt-2 lg:mt-2">
              <p
                className={cn(
                  'mb-2 px-3 text-[10.5px] font-semibold tracking-[0.14em] text-slate-400 dark:text-slate-500',
                  collapsed && 'lg:hidden',
                )}
              >
                {t(group.sectionKey)}
              </p>
              {collapsed && <div className="bosfor-rail-rule mx-auto mb-2 hidden h-px w-6 lg:block" />}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isDisabled = item.id === 'clans'
                  const isActive = active === item.id && !isDisabled
                  const isLocked = isDisabled || !['home', 'plan', 'journey', 'shop', 'analytics', 'okuma', 'dinleme', 'yazma', 'konusma', 'lugat', 'exams', 'leagues', 'admin'].includes(item.id)
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        disabled={isDisabled}
                        onClick={() => { if (!isDisabled) onNavigate(item.id) }}
                        title={isLocked ? `${t(item.labelKey)} · ${t('comingSoon.title')}` : collapsed ? t(item.labelKey) : undefined}
                        aria-label={isLocked ? `${t(item.labelKey)} · ${t('comingSoon.title')}` : undefined}
                        aria-disabled={isDisabled || undefined}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'studio-nav-item group relative flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors lg:min-h-10',
                          collapsed && 'lg:justify-center lg:px-0',
                          isDisabled
                            ? 'cursor-not-allowed opacity-60 text-slate-400 dark:text-slate-600'
                            : isActive
                              ? 'bg-gradient-to-r from-teal-600 to-cyan-500 font-bold text-white shadow-md shadow-teal-600/20'
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
              'studio-install mb-3 flex min-h-10 w-full items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
              collapsed && 'lg:justify-center lg:px-0',
            )}
          >
            <Download className="size-4 shrink-0" aria-hidden="true" />
            <span className={cn('flex-1 text-left', collapsed && 'lg:sr-only')}>{t('nav.install')}</span>
          </button>}
          {winterFeatureEnabled && (
            <button
              type="button"
              onClick={toggleWinterMode}
              aria-pressed={winterModeEnabled}
              aria-label={t(winterModeEnabled ? 'winter.mode.disable' : 'winter.mode.enable')}
              title={collapsed ? t('winter.mode.label') : undefined}
              className={cn(
                'mb-3 flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition active:scale-[0.98]',
                winterModeEnabled
                  ? isPremium
                    ? 'winter-frost border-sky-100/30 bg-emerald-950/55 text-sky-100 shadow-[0_0_20px_rgba(125,211,252,.13)]'
                    : 'border-sky-200 bg-gradient-to-r from-sky-50 to-emerald-50 text-emerald-900 dark:border-sky-400/20 dark:from-slate-900 dark:to-emerald-950/50 dark:text-sky-100'
                  : isPremium
                    ? 'border-white/10 bg-white/[.035] text-white/60 hover:bg-white/[.07]'
                    : 'border-slate-200/80 text-slate-600 hover:bg-sky-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800',
                collapsed && 'lg:justify-center lg:px-0',
              )}
              data-testid="toggle-winter-mode"
            >
              <Snowflake className="size-4 shrink-0 text-sky-500" aria-hidden="true" />
              <span className={cn('flex-1 text-left', collapsed && 'lg:sr-only')}>{t('winter.mode.label')}</span>
              <span className={cn('h-4 w-7 rounded-full p-0.5 transition-colors', collapsed && 'lg:hidden', winterModeEnabled ? 'bg-sky-400' : 'bg-slate-300 dark:bg-slate-700')} aria-hidden="true">
                <span className={cn('block size-3 rounded-full bg-white shadow transition-transform', winterModeEnabled && 'translate-x-3')} />
              </span>
            </button>
          )}
          <div
            role="button"
            tabIndex={0}
            aria-label={t('nav.profile')}
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
              <div className="relative shrink-0">
                <ProfileAvatar
                  profile={profile}
                  fallbackText={profile ? getInitials(profile.name, profile.surname) : t('nav.profile').slice(0, 2).toLocaleUpperCase()}
                  sizeClass="size-9"
                />
              </div>
              <div className={cn('min-w-0 flex-1', collapsed && 'lg:hidden')}>
                <p className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                  {profile ? [profile.name, profile.surname].filter(Boolean).join(' ') : t('nav.profile')}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className={cn('rounded-md border px-1.5 py-1 text-[9px] font-bold leading-none', isPremium ? 'border-yellow-200/20 bg-yellow-200/10 text-yellow-100' : 'border-amber-200 bg-amber-50 text-amber-800')}>
                    {t('rank.level', { level })}
                  </span>
                  {profile?.targetLevel && (
                    <span className="flex items-center gap-1 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                      <Target className="size-3 text-rose-500" aria-hidden="true" />
                      {profile.targetLevel} CEFR
                    </span>
                  )}
                </div>
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
          <button type="button" title={t('profile.logout')} onClick={() => { onCloseMobile(); onLogout?.() }} className={cn('studio-signout mt-2 inline-flex min-h-10 w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors', collapsed && 'lg:justify-center lg:px-0')}>
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            <span className={collapsed ? 'lg:sr-only' : undefined}>{t('profile.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Header                                  */
/* -------------------------------------------------------------------------- */

function Header({ active, isPremium, xp, currentStreak, profile, targetPct, onNavigate, onOpenProfile, dark, onToggleTheme }) {
  const { language, t } = useI18n()
  const { user: authUser } = useAuth()
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    let active = true
    const userId = authUser?.id
    setUserProfile(null)
    if (!supabase || !userId) {
      setUserProfile(null)
      return undefined
    }

    supabase.from('profiles')
      .select('total_xp,current_streak')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          console.warn('[Turkuaz Edu] Could not load header profile statistics.', error)
          setUserProfile(null)
          return
        }
        setUserProfile(data || null)
      })
      .catch((error) => {
        if (!active) return
        console.warn('[Turkuaz Edu] Could not load header profile statistics.', error)
        setUserProfile(null)
      })

    return () => { active = false }
  }, [authUser?.id])

  const cloudXp = userProfile?.total_xp == null ? null : Math.max(0, Number(userProfile.total_xp) || 0)
  const displayedXp = Math.max(0, Number(xp) || 0, cloudXp || 0)
  const displayedStreak = Math.max(0, Number(currentStreak) || 0, Number(userProfile?.current_streak) || 0)
  const displayedLeague = getRatingTier(displayedXp).toLowerCase()
  const themeLabel = t(dark ? 'header.theme.light' : 'header.theme.dark')
  const activeItem = NAV.flatMap(({ items }) => items).find(({ id }) => id === active)
  const xpLabel = `${displayedXp.toLocaleString(language)} XP`
  const compactNumber = new Intl.NumberFormat(language, { notation: 'compact', maximumFractionDigits: 1 })
  const leagueLabel = t(`leaderboard.league.${displayedLeague}`)
  const streakLabel = t('header.streak', { count: displayedStreak })

  return (
    <header className="studio-header bosfor-header sticky top-0 z-30 border-b">
      <div className="bosfor-header-inner mx-auto max-w-[1500px] px-3 py-2 sm:px-6">
        <button type="button" className="bosfor-wordmark flex min-h-11 min-w-0 items-center gap-2 text-left lg:hidden" onClick={() => onNavigate('home')}>
          <img src="/icons/turkish-education.svg" alt="" className="size-8 shrink-0 rounded-lg" />
          <span className="truncate">Turkuaz Edu</span>
        </button>
        <p className="bosfor-wordmark hidden min-w-0 truncate lg:block">{activeItem ? t(activeItem.labelKey) : 'Turkuaz Edu'}</p>

        <div className="bosfor-header-metrics">
          <div className="bosfor-header-goal">
            {profile?.targetLevel && <button type="button" className="bosfor-header-level" aria-label={`${t('profile.target')}: ${profile.targetLevel}`} aria-haspopup="dialog" onClick={onOpenProfile}>{profile.targetLevel}<ChevronDown size={13} aria-hidden="true" /></button>}
            <div className="bosfor-header-progress">
              <div><span className="hidden xl:inline">{t('sidebar.progress')}</span><strong aria-hidden="true">{targetPct}%</strong></div>
              <progress max={100} value={targetPct} aria-label={t('sidebar.progress')} />
            </div>
          </div>
          <span role="img" aria-label={xpLabel} title={xpLabel} className="bosfor-header-stat bosfor-header-xp">
            <ModelAsset name="xp" className="size-5 xl:size-6" />
            <span className="lg:hidden">{compactNumber.format(displayedXp)} XP</span>
            <span className="hidden lg:inline">{xpLabel}</span>
          </span>
          <span role="img" aria-label={leagueLabel} title={leagueLabel} className="bosfor-header-stat">
            <ModelAsset name="medal" className="size-5 xl:size-6" />
            <span className="hidden min-[420px]:max-lg:inline xl:inline">{leagueLabel}</span>
          </span>
          <span role="img" aria-label={streakLabel} title={streakLabel} className="bosfor-header-stat">
            <ModelAsset name="streak" className="size-5 xl:size-6" />
            <span>{compactNumber.format(displayedStreak)}</span>
          </span>
        </div>

        <div className="bosfor-header-actions flex items-center gap-1.5 sm:gap-2">
          {profile && (
            <button
              type="button"
              onClick={onOpenProfile}
              aria-label={`${profile.name || t('nav.profile')} · ${t('profile.settings')}`}
              aria-haspopup="dialog"
              className={cn(
                'bosfor-header-profile grid size-11 shrink-0 place-items-center rounded-xl border transition-colors',
                isPremium ? 'border-white/10 bg-black/30 text-white hover:bg-white/10' : 'border-slate-200/80 bg-white/80 text-slate-700 hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200',
              )}
            >
              <ProfileAvatar
                profile={profile}
                sizeClass="size-8"
              />
            </button>
          )}
          {onToggleTheme && (
            <button type="button" className="bosfor-theme-switch grid size-11 shrink-0 place-items-center rounded-xl border" title={themeLabel} aria-label={themeLabel} onClick={onToggleTheme}>
              {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>
          )}
          <NotificationPopover isPremium={isPremium} />
        </div>
      </div>
    </header>
  )
}

function MobileDock({ active, onNavigate, mobileOpen, onOpenMenu, menuButtonRef }) {
  const { t } = useI18n()
  const items = [
    { id: 'home', icon: House, label: 'nav.mobile.home' },
    { id: 'plan', icon: CalendarCheck, label: 'nav.mobile.plan' },
    { id: 'lugat', icon: Library, label: 'nav.mobile.vocabulary' },
    { id: 'exams', icon: Trophy, label: 'nav.exams' },
  ]
  return (
    <nav className="bosfor-dock" aria-label={t('nav.mobile.aria')}>
      {items.map(({ id, icon: Icon, label }) => (
        <button key={id} type="button" aria-current={active === id ? 'page' : undefined} onClick={() => onNavigate(id)}>
          <Icon size={20} aria-hidden="true" />
          <span>{t(label)}</span>
        </button>
      ))}
      <button
        ref={menuButtonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={mobileOpen}
        aria-controls="app-sidebar"
        data-active={mobileOpen || !items.some(({ id }) => id === active) || undefined}
        onClick={onOpenMenu}
      >
        <Menu size={20} aria-hidden="true" />
        <span>{t('nav.mobile.menu')}</span>
      </button>
    </nav>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   App shell                                */
/* -------------------------------------------------------------------------- */

export default function TurkchaDashboard({ active, onNavigate, dark, onToggleDark, isPremium, xp, rankUpEvent, onDismissRankUp, currentStreak = 0, streakMilestones = [], winterStudy = null, streakMilestoneEvent, onDismissStreakMilestone, trophyMetrics, trophyUnlocks = [], trophyCelebrationEvent, onDismissTrophyCelebration, targetPct, profile, onEditProfile, onClearData, onLogout, onInstallApp, children }) {
  const { t } = useI18n()
  const { enabled: winterModeEnabled } = useWinterUpdate()
  const safeStreakMilestones = Array.isArray(streakMilestones) ? streakMilestones : []
  const safeTrophyUnlocks = Array.isArray(trophyUnlocks) ? trophyUnlocks : []
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarPreference, setSidebarPreference] = useState(() => loadJSON(SIDEBAR_PREFERENCE_KEY, {})?.collapsed)
  const [wideNav, setWideNav] = useState(() => window.matchMedia(WIDE_NAV_QUERY).matches)
  const sidebarCollapsed = typeof sidebarPreference === 'boolean' ? sidebarPreference : !wideNav
  const menuButtonRef = useRef(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const level = Math.floor(Math.max(0, Number(xp) || 0) / 500) + 1
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false
    return Boolean(window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true)
  })

  useEffect(() => {
    if (!mobileOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [mobileOpen])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const breakpoint = window.matchMedia('(min-width: 1024px)')
    const wideBreakpoint = window.matchMedia(WIDE_NAV_QUERY)
    const closeMobileDrawerOnDesktop = (event) => {
      if (event.matches) setMobileOpen(false)
    }
    breakpoint.addEventListener?.('change', closeMobileDrawerOnDesktop)
    const resizeDesktopSidebar = (event) => setWideNav(event.matches)
    wideBreakpoint.addEventListener?.('change', resizeDesktopSidebar)
    return () => {
      breakpoint.removeEventListener?.('change', closeMobileDrawerOnDesktop)
      wideBreakpoint.removeEventListener?.('change', resizeDesktopSidebar)
    }
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

  const navigate = (id) => {
    onNavigate(id)
    if (mobileOpen) closeMobileDrawer()
  }

  function closeMobileDrawer() {
    setMobileOpen(false)
    if (mobileOpen) requestAnimationFrame(() => menuButtonRef.current?.focus())
  }

  function toggleDesktopSidebar() {
    const collapsed = !sidebarCollapsed
    saveJSON(SIDEBAR_PREFERENCE_KEY, { collapsed })
    setSidebarPreference(collapsed)
  }

  return (
    <div data-theme={isPremium ? 'premium' : dark ? 'night' : 'default'} data-winter={winterModeEnabled || undefined} data-sidebar-collapsed={sidebarCollapsed} className={cn('studio-shell min-h-[100dvh] antialiased selection:bg-teal-500/20', isPremium ? 'theme-premium' : dark ? 'theme-night' : 'theme-default', winterModeEnabled && 'winter-mode')}>
      <WinterEffects />
      <div className="relative z-10 flex min-h-[100dvh] w-full">
        <Sidebar
          active={active}
          onNavigate={navigate}
          mobileOpen={mobileOpen}
          onCloseMobile={closeMobileDrawer}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={toggleDesktopSidebar}
          targetPct={targetPct}
          level={level}
          profile={profile}
          onOpenProfile={() => { setProfileOpen(true); setMobileOpen(false) }}
          onInstallApp={onInstallApp}
          onLogout={onLogout}
          showInstall={!isInstalled}
          isPremium={isPremium}
        />

        <div className="bosfor-shell-main flex min-w-0 flex-1 flex-col" inert={mobileOpen ? '' : undefined}>
          <Header
            active={active}
            isPremium={isPremium}
            xp={xp}
            currentStreak={currentStreak}
            profile={profile}
            dark={dark}
            onToggleTheme={isPremium ? undefined : onToggleDark}
            targetPct={targetPct}
            onNavigate={navigate}
            onOpenProfile={() => setProfileOpen(true)}
          />

          <main data-section={active} className="studio-learning bosfor-main mx-auto w-full max-w-[1500px] min-w-0 flex-1 overflow-x-clip px-3 pb-24 pt-2 sm:px-6 lg:pb-10">
            {children}
          </main>
          <MobileDock active={active} onNavigate={navigate} mobileOpen={mobileOpen} onOpenMenu={() => setMobileOpen(true)} menuButtonRef={menuButtonRef} />
        </div>
      </div>
      <UserProfileModal
        open={profileOpen}
        onOpenChange={setProfileOpen}
        profile={profile}
        stats={{ xp }}
        currentStreak={currentStreak}
        streakMilestones={safeStreakMilestones}
        winterStudy={winterStudy}
        winterChampionUnlocked={safeTrophyUnlocks.some((record) => record?.id === 'winter-champion')}
        trophyMetrics={trophyMetrics}
        trophyUnlocks={safeTrophyUnlocks}
        onEditProfile={onEditProfile}
        onClearData={onClearData}
        onLogout={onLogout}
        isPremium={isPremium}
        dark={dark}
        onToggleDark={onToggleDark}
      />
      <RankUpModal event={trophyCelebrationEvent || streakMilestoneEvent ? null : rankUpEvent} isPremium={isPremium} dark={dark} onDismiss={onDismissRankUp} />
      <StreakMilestoneModal event={trophyCelebrationEvent ? null : streakMilestoneEvent} isPremium={isPremium} dark={dark} onDismiss={onDismissStreakMilestone} />
      <TrophyCelebrationModal event={trophyCelebrationEvent} isPremium={isPremium} dark={dark} onDismiss={onDismissTrophyCelebration} />
    </div>
  )
}
