import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  BookOpenText,
  CalendarCheck,
  ChevronDown,
  Download,
  Flame,
  Headphones,
  House,
  Library,
  Lock,
  Map,
  LogOut,
  Mic,
  Menu,
  PenLine,
  Snowflake,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UsersRound,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabase.js'
import { getInitials } from '../lib/storage'
import { getRatingTier } from '../lib/ranks'
import { useI18n } from '../lib/i18n.jsx'
import { isOwnerEmail } from '../config/admin'
import { useWinterUpdate } from '../features/winter/WinterUpdateContext'
import NotificationPopover from './NotificationPopover'
import RankUpModal from './RankUpModal'
import StreakMilestoneModal from './StreakMilestoneModal'
import TrophyCelebrationModal from './TrophyCelebrationModal'
import UserProfileModal from './UserProfileModal'
import ProfileAvatar from './ProfileAvatar'
import WinterEffects from '../features/winter/WinterEffects'

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
    ],
  },
  {
    sectionKey: 'nav.section.practice',
    items: [
      { id: 'lugat', labelKey: 'nav.vocabulary', icon: Library },
      { id: 'exams', labelKey: 'nav.exams', icon: Trophy },
      { id: 'journey', labelKey: 'nav.journey', icon: Map },
      { id: 'shop', labelKey: 'nav.shop', icon: ShoppingBag },
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

function Sidebar({ active, onNavigate, mobileOpen, onCloseMobile, targetPct, level, profile, onOpenProfile, onInstallApp, onLogout, showInstall, isPremium }) {
  const { t } = useI18n()
  const { user: authUser } = useAuth()
  const collapsed = false
  const { enabled: winterModeEnabled, featureEnabled: winterFeatureEnabled, toggle: toggleWinterMode } = useWinterUpdate()
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside
        id="app-sidebar"
        aria-label={t('nav.aria')}
        className={cn(
          'glass fixed inset-y-0 left-0 z-50 flex w-[min(16rem,calc(100vw-1rem))] flex-col rounded-r-[26px] border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur-md transition-transform duration-300 ease-out dark:border-slate-800/80 dark:bg-slate-950/95 md:inset-y-5 md:left-5 md:w-64 md:translate-x-0 md:rounded-[26px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
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
            className="relative z-10 ml-auto grid size-11 place-items-center rounded-lg text-slate-500 transition active:scale-95 hover:bg-slate-100 md:hidden dark:hover:bg-slate-800"
            aria-label={t('header.menu.close')}
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-2">
          {NAV.filter((group) => group.items.some((item) => !item.ownerOnly || isOwnerEmail(authUser?.email))).map((group) => (
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
                {group.items.filter((item) => !item.ownerOnly || isOwnerEmail(authUser?.email)).map((item) => {
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
                          'nav-glow group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-all duration-200 active:scale-[0.98]',
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
              'mb-3 flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-700/15 transition hover:from-teal-700 hover:to-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 active:scale-[0.98] dark:focus-visible:ring-offset-slate-950',
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
              <span className={cn('h-4 w-7 rounded-full p-0.5 transition-colors', winterModeEnabled ? 'bg-sky-400' : 'bg-slate-300 dark:bg-slate-700')} aria-hidden="true">
                <span className={cn('block size-3 rounded-full bg-white shadow transition-transform', winterModeEnabled && 'translate-x-3')} />
              </span>
            </button>
          )}
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
                <div className="relative">
                  <ProfileAvatar
                    profile={profile}
                    fallbackText={profile ? getInitials(profile.name, profile.surname) : t('nav.profile').slice(0, 2).toLocaleUpperCase()}
                    sizeClass="size-9"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" aria-hidden="true" />
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-md border px-1.5 py-1 text-[9px] font-black leading-none tracking-wide',
                    isPremium ? 'border-yellow-200/20 bg-yellow-200/10 text-yellow-100' : 'border-amber-200 bg-amber-50 text-amber-800',
                    collapsed && 'lg:absolute lg:left-1/2 lg:top-10 lg:-translate-x-1/2 lg:px-1 lg:text-[8px]',
                  )}
                  title={t('rank.level', { level })}
                >
                  {t('rank.level', { level })}
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
          <button type="button" onClick={() => { onCloseMobile(); onLogout?.() }} className="mt-3 inline-flex min-h-11 w-full items-center gap-2 rounded-xl border border-rose-200/80 px-3 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-50 active:scale-[.98] dark:border-rose-400/20 dark:text-rose-300 dark:hover:bg-rose-400/10">
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            <span>{t('profile.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Header                                  */
/* -------------------------------------------------------------------------- */

function Header({ breadcrumb, isPremium, mobileOpen, onToggleSidebar, xp, level, currentStreak, profile, onOpenProfile }) {
  const { language, t } = useI18n()
  const { user: authUser } = useAuth()
  const [userProfile, setUserProfile] = useState(null)
  const sidebarExpanded = mobileOpen

  useEffect(() => {
    let active = true
    const userId = authUser?.id
    setUserProfile(null)
    if (!supabase || !userId) {
      setUserProfile(null)
      return undefined
    }

    supabase.from('profiles')
      .select('total_xp,rating_tier,current_streak')
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
  const validTiers = ['Bronze', 'Silver', 'Gold']
  const cloudTierIsCurrent = cloudXp !== null && cloudXp >= Math.max(0, Number(xp) || 0)
  const ratingTier = cloudTierIsCurrent && validTiers.includes(userProfile?.rating_tier)
    ? userProfile.rating_tier
    : validTiers.includes(profile?.ratingTier) ? profile.ratingTier : getRatingTier(displayedXp)
  const ratingLabel = t(`rating.tier.${ratingTier.toLowerCase()}`)
  const displayedStreak = Math.max(0, Number(currentStreak) || 0, Number(userProfile?.current_streak) || 0)

  return (
    <header className="glass rise-in sticky top-2 z-30 flex min-h-[60px] items-center rounded-[20px] bg-white/80 px-2.5 py-2.5 backdrop-blur-xl dark:bg-slate-950/80 sm:top-3 sm:min-h-[70px] sm:px-5 sm:py-3">
      <div className="flex w-full min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200/80 text-slate-600 transition-colors hover:bg-slate-100 active:scale-95 md:hidden dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={sidebarExpanded ? t('header.menu.close') : t('header.menu.open')}
          aria-expanded={sidebarExpanded}
          aria-controls="app-sidebar"
        >
          {mobileOpen ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
        </button>

        <nav aria-label={t('breadcrumb.label')} className="min-w-0 flex-1 overflow-hidden">
          <ol className="flex min-w-0 items-center gap-1.5 text-sm">
            <li className="hidden text-slate-400 sm:block dark:text-slate-500">{breadcrumb.section}</li>
            <li className="hidden text-slate-300 sm:block dark:text-slate-700" aria-hidden="true">/</li>
            <li className="min-w-0 truncate font-semibold tracking-tight text-slate-900 dark:text-white" aria-current="page">
              {breadcrumb.label}
            </li>
          </ol>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <span role="img" aria-label={`${displayedXp.toLocaleString(language)} XP`} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-2 py-1.5 text-xs font-semibold tabular-nums text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 sm:px-3">
            <Zap className="size-3.5 fill-amber-400 text-amber-500" aria-hidden="true" />
            <span className="hidden min-[480px]:inline">{displayedXp.toLocaleString(language)} XP</span>
          </span>
          <span role="status" aria-label={t('rating.aria', { tier: ratingLabel })} title={t('rating.label')} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-teal-200/80 bg-teal-50 px-2 py-1.5 text-[10px] font-extrabold text-teal-800 dark:border-teal-500/20 dark:bg-teal-500/10 dark:text-teal-200 sm:gap-1.5 sm:px-2.5">
            <Trophy className="size-3.5" aria-hidden="true" />
            <span>{ratingLabel}</span>
          </span>
          <span role="status" aria-label={t('header.streak', { count: displayedStreak })} title={t('dashboard.stat.streak')} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-orange-200/80 bg-orange-50 px-2 py-1.5 text-[10px] font-extrabold tabular-nums text-orange-800 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200 sm:gap-1.5 sm:px-2.5">
            <Flame className="size-3.5" aria-hidden="true" />
            <span>{displayedStreak}</span>
          </span>
          {profile && (
            <button
              type="button"
              onClick={onOpenProfile}
              aria-label={`${profile.name || t('nav.profile')} · ${t('profile.settings')}`}
              aria-haspopup="dialog"
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full border py-1 pl-1 pr-1.5 transition-all hover:-translate-y-0.5 active:translate-y-0 min-[480px]:gap-2 min-[480px]:pr-2.5',
                isPremium ? 'border-white/10 bg-black/30 text-white hover:bg-white/10' : 'border-slate-200/80 bg-white/80 text-slate-700 hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200',
              )}
            >
              <ProfileAvatar
                profile={profile}
                sizeClass="size-8"
                className="ring-1 ring-white/20"
              />
              <span className={cn('hidden rounded-md border px-1.5 py-1 text-[9px] font-black leading-none tracking-wide min-[480px]:inline-flex', isPremium ? 'border-yellow-200/20 bg-yellow-200/10 text-yellow-100' : 'border-amber-200 bg-amber-50 text-amber-800')} title={t('rank.level', { level })}>
                {t('rank.level', { level })}
              </span>
              <span className="hidden max-w-20 truncate text-sm font-bold sm:block">{profile.name}</span>
              <ChevronDown className="hidden size-3.5 shrink-0 opacity-60 min-[480px]:block" aria-hidden="true" />
            </button>
          )}
          <NotificationPopover isPremium={isPremium} />
        </div>
      </div>
    </header>
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

  const toggleSidebar = () => setMobileOpen((open) => !open)

  return (
    <div data-theme={isPremium ? 'premium' : dark ? 'night' : 'default'} data-winter={winterModeEnabled || undefined} className={cn('min-h-[100dvh] bg-slate-50 font-sans text-slate-900 antialiased selection:bg-teal-500/20 dark:bg-slate-950 dark:text-slate-100', isPremium ? 'theme-premium bg-gradient-to-br from-[#4a0000] via-[#E30A17] to-[#8a0000]' : dark ? 'theme-night' : 'theme-default', winterModeEnabled && 'winter-mode')}>
      <WinterEffects />
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className={`absolute -right-32 top-28 size-96 rounded-full blur-[100px] ${isPremium ? 'bg-amber-300/10' : 'bg-cyan-300/10'}`} />
        <div className={`absolute -left-36 bottom-[-4rem] size-[32rem] rounded-full blur-[100px] ${isPremium ? 'bg-red-950/45' : 'bg-teal-900/10'}`} />
        <div className="absolute inset-0 opacity-[.035]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.55) .65px, transparent .65px)', backgroundSize: '5px 5px' }} />
      </div>
      <div className="relative z-10 flex min-h-[100dvh] w-full gap-2 p-2 sm:gap-5 sm:p-5 lg:gap-5 lg:p-7">
        <Sidebar
          active={active}
          onNavigate={navigate}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          targetPct={targetPct}
          level={level}
          profile={profile}
          onOpenProfile={() => { setProfileOpen(true); setMobileOpen(false) }}
          onInstallApp={onInstallApp}
          onLogout={onLogout}
          showInstall={!isInstalled}
          isPremium={isPremium}
        />

        <div className="flex min-w-0 flex-1 flex-col md:ml-[17rem]">
          <Header
            breadcrumb={breadcrumb}
            isPremium={isPremium}
            mobileOpen={mobileOpen}
            onToggleSidebar={toggleSidebar}
            xp={xp}
            level={level}
            currentStreak={currentStreak}
            profile={profile}
            onOpenProfile={() => setProfileOpen(true)}
          />

          <main className="mx-auto w-full max-w-[1320px] min-w-0 flex-1 overflow-x-clip pb-10 pt-4 sm:pt-6">
            {children}
          </main>
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
