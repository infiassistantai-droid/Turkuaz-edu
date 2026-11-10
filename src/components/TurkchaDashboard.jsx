import { useEffect, useState } from 'react'
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
import PremiumButton from './PremiumButton'
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
          <PremiumButton
            onClick={onCloseMobile}
            icon={X}
            iconOnly
            className="relative z-10 ml-auto md:hidden"
            aria-label={t('header.menu.close')}
          />
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
                      <PremiumButton
                        disabled={isDisabled}
                        onClick={() => { if (!isDisabled) onNavigate(item.id) }}
                        icon={Icon}
                        title={isLocked ? `${t(item.labelKey)} · ${t('comingSoon.title')}` : collapsed ? t(item.labelKey) : undefined}
                        aria-label={isLocked ? `${t(item.labelKey)} · ${t('comingSoon.title')}` : undefined}
                        aria-disabled={isDisabled || undefined}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'nav-glow group relative min-h-11 w-full justify-start px-1.5 py-1.5 text-left text-sm',
                          collapsed && 'lg:justify-center lg:px-1.5',
                          isDisabled && 'opacity-60',
                          isActive && 'border-[#d4af37]/80 shadow-[0_0_16px_rgba(212,175,55,0.18)]',
                        )}
                      >
                        <span className={cn('min-w-0 flex-1 truncate', collapsed && 'lg:sr-only')}>
                          {t(item.labelKey)}
                        </span>
                        {isLocked ? (
                          <Lock className="size-3.5 shrink-0 text-[#fde047]/70" aria-hidden="true" />
                        ) : (item.badgeKey || item.badge) ? (
                          <span className="rounded-full border border-[#d4af37]/35 bg-[#11192b] px-1.5 py-0.5 text-[10px] font-semibold text-[#fde047]">
                            {item.badgeKey ? t(item.badgeKey) : item.badge}
                          </span>
                        ) : null}
                      </PremiumButton>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-slate-200/80 p-3 dark:border-slate-800/80">
          {showInstall && <PremiumButton
            onClick={onInstallApp}
            icon={Download}
            title={collapsed ? t('nav.install') : undefined}
            aria-label={t('nav.install')}
            className={cn('mb-3 w-full justify-start px-1.5 text-sm', collapsed && 'lg:justify-center')}
          >
            <span className={cn('flex-1 text-left', collapsed && 'lg:sr-only')}>{t('nav.install')}</span>
          </PremiumButton>}
          {winterFeatureEnabled && (
            <PremiumButton
              onClick={toggleWinterMode}
              aria-pressed={winterModeEnabled}
              aria-label={t(winterModeEnabled ? 'winter.mode.disable' : 'winter.mode.enable')}
              title={collapsed ? t('winter.mode.label') : undefined}
              icon={Snowflake}
              className={cn('mb-3 w-full justify-between px-1.5 text-sm', collapsed && 'lg:justify-center')}
              data-testid="toggle-winter-mode"
            >
              <span className={cn('flex-1 text-left', collapsed && 'lg:sr-only')}>{t('winter.mode.label')}</span>
              <span className={cn('h-4 w-7 rounded-full p-0.5 transition-colors', winterModeEnabled ? 'bg-sky-400' : 'bg-slate-600')} aria-hidden="true">
                <span className={cn('block size-3 rounded-full bg-white shadow transition-transform', winterModeEnabled && 'translate-x-3')} />
              </span>
            </PremiumButton>
          )}
          <PremiumButton
            onClick={onOpenProfile}
            leading={(
              <ProfileAvatar
                profile={profile}
                fallbackText={profile ? getInitials(profile.name, profile.surname) : t('nav.profile').slice(0, 2).toLocaleUpperCase()}
                sizeClass="size-7"
              />
            )}
            className="mt-3 min-h-20 w-full justify-start px-1.5 py-2.5 text-left"
            aria-label={`${profile ? [profile.name, profile.surname].filter(Boolean).join(' ') : t('nav.profile')} · ${t('profile.settings')}`}
            aria-haspopup="dialog"
          >
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-extrabold">
                  {profile ? [profile.name, profile.surname].filter(Boolean).join(' ') : t('nav.profile')}
                </span>
                <span className="shrink-0 rounded-full border border-[#d4af37]/35 bg-[#11192b] px-2 py-0.5 text-[9px] font-black" title={t('rank.level', { level })}>
                  {t('rank.level', { level })}
                </span>
              </span>
              <span className="mt-0.5 flex items-center gap-1 text-[10px] text-cyan-100/75">
                <Target className="size-3" aria-hidden="true" />
                {t('profile.target')}: {profile?.targetLevel || '—'} CEFR
              </span>
              <span className="mt-1.5 block">
                <span className="mb-1 flex items-center justify-between text-[10px] text-cyan-100/70">
                  <span>{t('sidebar.progress')}</span><span className="tabular-nums">{targetPct}%</span>
                </span>
                <span className="block h-1 overflow-hidden rounded-full bg-slate-700">
                  <span className="block h-full rounded-full bg-gradient-to-r from-teal-300 to-cyan-300" style={{ width: `${targetPct}%` }} />
                </span>
              </span>
            </span>
          </PremiumButton>
          <PremiumButton
            onClick={() => { onCloseMobile(); onLogout?.() }}
            icon={LogOut}
            className="mt-3 min-h-11 w-full justify-start px-1.5 text-sm"
          >
            {t('profile.logout')}
          </PremiumButton>
        </div>
      </aside>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Header                                  */
/* -------------------------------------------------------------------------- */

function Header({ isPremium, mobileOpen, onToggleSidebar, xp, currentStreak, profile, onOpenProfile }) {
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

  return (
    <header className="glass rise-in sticky top-2 z-30 flex min-h-[60px] items-center rounded-[20px] bg-white/80 px-2.5 py-2.5 backdrop-blur-xl dark:bg-slate-950/80 sm:top-3 sm:min-h-[70px] sm:px-5 sm:py-3">
      <div className="flex w-full min-w-0 items-center gap-2 sm:gap-3">
        <PremiumButton
          onClick={onToggleSidebar}
          icon={mobileOpen ? X : Menu}
          iconOnly
          className="md:hidden"
          aria-label={sidebarExpanded ? t('header.menu.close') : t('header.menu.open')}
          aria-expanded={sidebarExpanded}
          aria-controls="app-sidebar"
        />

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <PremiumButton as="span" icon={Zap} interactive={false} role="img" aria-label={`${displayedXp.toLocaleString(language)} XP`} className="min-h-11 px-2.5 sm:px-3">
            {displayedXp.toLocaleString(language)} XP
          </PremiumButton>
          <PremiumButton
            as="span"
            icon={Trophy}
            interactive={false}
            role="status"
            aria-label={t(`leaderboard.league.${displayedLeague}`)}
            title={t(`leaderboard.league.${displayedLeague}`)}
            className="hidden min-h-11 px-2.5 sm:inline-flex sm:px-3"
          >
            {t(`leaderboard.league.${displayedLeague}`)}
          </PremiumButton>
          <PremiumButton
            as="span"
            icon={Flame}
            interactive={false}
            role="status"
            aria-label={t('header.streak', { count: displayedStreak })}
            title={t('dashboard.stat.streak')}
            className="min-h-11 px-2.5 sm:px-3"
          >
            {displayedStreak}
          </PremiumButton>
          {profile && (
            <PremiumButton
              onClick={onOpenProfile}
              leading={<ProfileAvatar profile={profile} sizeClass="size-7" />}
              aria-label={`${profile.name || t('nav.profile')} · ${t('profile.settings')}`}
              aria-haspopup="dialog"
              className="min-h-11 min-w-[60px] justify-center px-1.5 min-[380px]:min-w-[88px] min-[380px]:justify-start min-[380px]:px-2 sm:px-2.5"
            >
              <span className="hidden max-w-14 truncate text-xs font-extrabold min-[380px]:inline sm:max-w-20 sm:text-sm">{profile.name || t('nav.profile')}</span>
              <ChevronDown className="hidden size-3.5 shrink-0 text-[#fde047] min-[380px]:block" aria-hidden="true" />
            </PremiumButton>
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
            isPremium={isPremium}
            mobileOpen={mobileOpen}
            onToggleSidebar={toggleSidebar}
            xp={xp}
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
