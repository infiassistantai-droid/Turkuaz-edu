import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bell,
  BookOpenText,
  CalendarCheck,
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  Download,
  Flame,
  GraduationCap,
  Headphones,
  House,
  Library,
  Mic,
  Menu,
  Moon,
  PenLine,
  Search,
  Sun,
  Sparkles,
  Target,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { getInitials } from '../lib/storage'
import ProfileMenu from './ProfileMenu'

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

const NAV = [
  {
    section: 'ASOSIY',
    items: [
      { id: 'home', label: 'Bosh sahifa', icon: House },
      { id: 'plan', label: 'Kunlik reja', icon: CalendarCheck, badge: '3' },
    ],
  },
  {
    section: '4 KO’NIKMA (IMTIHON)',
    items: [
      { id: 'okuma', label: 'O’qib tushunish', hint: 'Okuma', icon: BookOpenText },
      { id: 'dinleme', label: 'Tinglab tushunish', hint: 'Dinleme', icon: Headphones },
      { id: 'yazma', label: 'Yozma ish', hint: 'Yazma', icon: PenLine },
      { id: 'konusma', label: 'Gapirish', hint: 'Konuşma', icon: Mic },
    ],
  },
  {
    section: 'BAZA VA SINOV',
    items: [
      { id: 'lugat', label: 'Lug’at & Ekler', icon: Library },
      { id: 'mock', label: 'Mock Imtihon', icon: ClipboardCheck, badge: 'Yangi', urgent: true },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*                                   Sidebar                                  */
/* -------------------------------------------------------------------------- */

function Sidebar({ active, onNavigate, collapsed, onToggleCollapse, mobileOpen, onCloseMobile, targetPct, profile, onOpenProfile, onInstallApp }) {
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
        aria-label="Asosiy navigatsiya"
        className={cn(
          'glass fixed inset-y-0 left-0 z-50 flex flex-col rounded-[26px] border border-yellow-200/20 bg-black/30 backdrop-blur-2xl transition-all duration-300 ease-out',
          'lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          collapsed ? 'w-72 lg:w-[84px]' : 'w-72',
        )}
      >
        <div className={cn('flex h-16 shrink-0 items-center gap-3 px-5', collapsed && 'lg:justify-center lg:px-0')}>
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 opacity-60 blur-md" aria-hidden="true" />
            <div className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white ring-1 ring-white/20">
              <GraduationCap className="size-5" aria-hidden="true" />
            </div>
          </div>
          <div className={cn('min-w-0 leading-none', collapsed && 'lg:hidden')}>
            <p className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-white">Türkçe</p>
            <span className="mt-1 inline-flex items-center rounded-md bg-gradient-to-r from-teal-600/10 to-cyan-500/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-teal-700 ring-1 ring-teal-600/20 dark:text-teal-300 dark:ring-teal-400/25">
              TURKCHA CEFR PRO
            </span>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="ml-auto grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            aria-label="Menyuni yopish"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-2">
          {NAV.map((group) => (
            <div key={group.section} className="mt-5 first:mt-2">
              <p
                className={cn(
                  'mb-2 px-3 text-[10.5px] font-semibold tracking-[0.14em] text-slate-400 dark:text-slate-500',
                  collapsed && 'lg:hidden',
                )}
              >
                {group.section}
              </p>
              {collapsed && <div className="mx-auto mb-2 hidden h-px w-8 bg-slate-200 lg:block dark:bg-slate-800" />}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = active === item.id
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => onNavigate(item.id)}
                        title={collapsed ? item.label : undefined}
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
                          {item.label}
                          {item.hint && (
                            <span className={cn('ml-1.5 text-xs font-normal', isActive ? 'text-white/70' : 'text-slate-400 dark:text-slate-500')}>
                              {item.hint}
                            </span>
                          )}
                        </span>
                        {item.badge && (
                          <span
                            className={cn(
                              'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                              collapsed && 'lg:absolute lg:right-1.5 lg:top-1 lg:size-2 lg:p-0 lg:text-[0px]',
                              isActive
                                ? 'bg-white/20 text-white'
                                : item.urgent
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-slate-200/80 p-3 dark:border-slate-800/80">
          <button
            type="button"
            onClick={onInstallApp}
            title={collapsed ? "Ilovani O'rnatish" : undefined}
            aria-label="Ilovani O'rnatish"
            className={cn(
              'mb-3 flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-700/15 transition hover:from-teal-700 hover:to-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 active:scale-[0.98] dark:focus-visible:ring-offset-slate-950',
              collapsed && 'lg:justify-center lg:px-0',
            )}
          >
            <Download className="size-4 shrink-0" aria-hidden="true" />
            <span className={cn('flex-1 text-left', collapsed && 'lg:sr-only')}>Ilovani O&apos;rnatish</span>
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
              'cursor-pointer rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-3 transition-all hover:shadow-md active:scale-[0.98] dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60',
              collapsed && 'lg:border-0 lg:bg-none lg:p-0 lg:justify-center',
            )}
          >
            <div className={cn('flex items-center gap-3', collapsed && 'lg:justify-center')}>
              <div className="relative shrink-0">
                <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 text-xs font-bold text-white">
                  {profile ? getInitials(profile.name, profile.surname) : 'AK'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" aria-hidden="true" />
              </div>
              <div className={cn('min-w-0 flex-1', collapsed && 'lg:hidden')}>
                <p className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                  {profile ? `${profile.name} ${profile.surname}` : 'Azizbek Karimov'}
                </p>
                <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Target className="size-3 text-rose-500" aria-hidden="true" />
                  Maqsad: {profile?.targetLevel || 'C1'} Sertifikat
                </p>
              </div>
            </div>
            <div className={cn('mt-3', collapsed && 'lg:hidden')}>
              <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span>B2 → C1</span>
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
            aria-label={collapsed ? 'Yon panelni kengaytirish' : 'Yon panelni yig’ish'}
          >
            {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
            {!collapsed && <span>Panelni yig’ish</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Header                                  */
/* -------------------------------------------------------------------------- */

function Header({ breadcrumb, dark, onToggleDark, premium, onTogglePremium, onOpenMobile, streak, xp, profile, profileOpen, setProfileOpen, onEditProfile, onClearData, onLogout }) {
  const searchRef = useRef(null)

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
    <header className="glass sticky top-0 z-30 mx-2 mt-2 rounded-[20px] border border-yellow-200/20 bg-black/30 backdrop-blur-2xl sm:mx-4">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMobile}
          className="grid size-9 place-items-center rounded-xl border border-slate-200/80 text-slate-600 transition-colors hover:bg-slate-100 active:scale-95 lg:hidden dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Menyuni ochish"
        >
          <Menu className="size-4" />
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
            <span className="sr-only">Qidirish</span>
            <Search className="search-icon pointer-events-none absolute left-3 size-4 text-gray-500" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              placeholder="So’z, qoida yoki test qidirish..."
              className="premium-search h-10 w-full rounded-xl border border-yellow-200/70 bg-white pl-9 pr-14 text-sm font-medium text-gray-900 outline-none shadow-[0_3px_14px_rgba(0,0,0,.16)] transition-all placeholder:text-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300/40"
            />
            <kbd className="pointer-events-none absolute right-2.5 rounded-md border border-yellow-200/50 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-gray-600 shadow-sm">
              ⌘K
            </kbd>
          </label>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <span className="hidden items-center gap-1.5 rounded-full border border-orange-200/80 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 sm:inline-flex dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
            <Flame className="size-3.5 fill-orange-500 text-orange-500" aria-hidden="true" />
            {streak} kun
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1.5 text-xs font-semibold tabular-nums text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            <Zap className="size-3.5 fill-amber-400 text-amber-500" aria-hidden="true" />
            {xp.toLocaleString('en-US')} XP
          </span>
          {profile && (
            <ProfileMenu
              profile={profile}
              stats={{ xp, streak }}
              open={profileOpen}
              onOpenChange={setProfileOpen}
              onEdit={onEditProfile}
              onClear={onClearData}
              onLogout={onLogout}
            />
          )}
          <button
            type="button"
            className="relative grid size-9 place-items-center rounded-xl border border-slate-200/80 text-slate-600 transition-all hover:bg-slate-100 active:scale-95 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Bildirishnomalar"
          >
            <Bell className="size-4" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-rose-500" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onToggleDark}
            className="grid size-9 place-items-center rounded-xl border border-slate-200/80 text-slate-600 transition-all hover:bg-slate-100 active:scale-95 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={dark ? 'Yorug’ rejimga o’tish' : 'Qorong’i rejimga o’tish'}
            aria-pressed={dark}
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <button
            type="button"
            onClick={onTogglePremium}
            title={premium ? 'Premium View yoqilgan' : 'Premium View yoqish'}
            aria-label={premium ? 'Premium View o‘chirish' : 'Premium View yoqish'}
            aria-pressed={premium}
            className={cn(
              'flex h-9 items-center justify-center gap-1.5 rounded-xl border px-2 transition-all active:scale-95',
              premium
                ? 'border-amber-300/50 bg-amber-300/15 text-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.18)] hover:shadow-[0_0_24px_rgba(239,68,68,0.35)]'
                : 'border-slate-200/80 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800',
            )}
          >
            <Sparkles className="size-4" aria-hidden="true" />
            <span className="hidden text-xs font-semibold sm:inline">Premium</span>
          </button>
        </div>
      </div>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   App shell                                */
/* -------------------------------------------------------------------------- */

export default function TurkchaDashboard({ active, onNavigate, dark, onToggleDark, premium, onTogglePremium, streak, xp, targetPct, profile, onEditProfile, onClearData, onLogout, onInstallApp, children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const breadcrumb = useMemo(() => {
    for (const group of NAV) {
      const item = group.items.find((i) => i.id === active)
      if (item) return { section: group.section.charAt(0) + group.section.slice(1).toLowerCase(), label: item.label }
    }
    return { section: 'Asosiy', label: 'Bosh sahifa' }
  }, [active])

  const navigate = (id) => {
    onNavigate(id)
    setMobileOpen(false)
  }

  return (
    <div className={cn('min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-teal-500/20 dark:bg-slate-950 dark:text-slate-100', premium && 'bg-gradient-to-br from-red-800 via-red-600 to-red-950')}>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-gradient-to-b from-amber-300/15 via-red-600/5 to-transparent"
        aria-hidden="true"
      />
      <div className="relative flex">
        <Sidebar
          active={active}
          onNavigate={navigate}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          targetPct={targetPct}
          profile={profile}
          onOpenProfile={() => setProfileOpen(true)}
          onInstallApp={onInstallApp}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            breadcrumb={breadcrumb}
            dark={dark}
            onToggleDark={onToggleDark}
            premium={premium}
            onTogglePremium={onTogglePremium}
            onOpenMobile={() => setMobileOpen(true)}
            streak={streak}
            xp={xp}
            profile={profile}
            profileOpen={profileOpen}
            setProfileOpen={setProfileOpen}
            onEditProfile={onEditProfile}
            onClearData={onClearData}
            onLogout={onLogout}
          />

          <main className="mx-auto w-full max-w-7xl flex-1 space-y-4 p-4 sm:space-y-6 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
