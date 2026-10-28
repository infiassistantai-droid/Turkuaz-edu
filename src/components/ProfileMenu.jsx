import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Settings, Trash2, LogOut, Target, Zap, Flame, AlertTriangle } from 'lucide-react'
import { cn } from '../lib/utils'
import { getInitials } from '../lib/storage'
import { useI18n } from '../lib/i18n.jsx'

function MenuItem({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors',
        danger
          ? 'text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10'
          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </button>
  )
}

/**
 * Profile dropdown — header chip + menu with:
 *   edit profile · clear all data (with confirm step) · logout
 * Controlled: `open` / `onOpenChange` let the sidebar user card open it too.
 */
export default function ProfileMenu({ profile, stats, open, onOpenChange, onEdit, onClear, onLogout }) {
  const { t } = useI18n()
  const [confirming, setConfirming] = useState(false)
  const wrapRef = useRef(null)

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) onOpenChange?.(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') onOpenChange?.(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onOpenChange])

  if (!profile) return null

  const initials = getInitials(profile.name, profile.surname)
  const displayName = [profile.name, profile.surname].filter(Boolean).join(' ')

  return (
    <div className="relative" ref={wrapRef}>
      {/* trigger chip */}
      <button
        type="button"
        onClick={() => onOpenChange?.(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 py-1 pl-1 pr-2.5 transition-all active:scale-95 hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/80"
      >
        <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 text-xs font-bold text-white ring-1 ring-white/20">
          {initials}
        </span>
        <span className="hidden max-w-20 truncate text-sm font-bold text-slate-700 sm:block dark:text-slate-200">
          {profile.name}
        </span>
        <ChevronDown className={cn('size-3.5 text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>

      {/* dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-72 animate-pop overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95"
        >
          {/* profile header */}
          <div className="flex items-center gap-3 bg-gradient-to-br from-teal-600 to-cyan-500 p-4 text-white">
            <div className="relative shrink-0">
              <div className="grid size-11 place-items-center rounded-full bg-white/20 font-display text-sm font-extrabold ring-1 ring-white/30">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-teal-600 bg-emerald-400" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold">{displayName}</p>
              <p className="flex items-center gap-1 text-xs font-semibold text-white/80">
                <Target className="size-3" />
                {t('profile.target')}: {profile.targetLevel || '—'} CEFR
              </p>
              {profile.email && <p className="mt-0.5 truncate text-[11px] text-white/70">{profile.email}</p>}
            </div>
          </div>

          {/* stats */}
          <div className="grid grid-cols-2 gap-2 border-b border-slate-100 p-3 dark:border-slate-800">
            <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-2.5 py-2 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              <Flame className="size-3.5 fill-amber-500 text-amber-500" />
              <div className="leading-tight">
                <div className="font-display text-sm font-extrabold tabular-nums">{stats?.streak ?? 0}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest">{t('profile.days')}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-teal-50 px-2.5 py-2 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
              <Zap className="size-3.5 fill-teal-500 text-teal-500" />
              <div className="leading-tight">
                <div className="font-display text-sm font-extrabold tabular-nums">
                  {(stats?.xp ?? 0).toLocaleString('en-US')}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest">XP</div>
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="p-2">
            {confirming ? (
              <div className="space-y-2 rounded-xl bg-rose-50 p-3 dark:bg-rose-500/10">
                <p className="flex items-start gap-2 text-xs font-bold leading-relaxed text-rose-700 dark:text-rose-200">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  {t('profile.confirm.clear')}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="flex-1 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-600 transition-all active:scale-95 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-slate-800 dark:text-rose-300"
                  >
                    {t('profile.cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={onClear}
                    className="flex-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95 hover:bg-rose-700"
                  >
                    {t('profile.delete')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-0.5">
                <MenuItem icon={Settings} label={t('profile.settings')} onClick={() => { onOpenChange?.(false); onEdit?.() }} />
                <MenuItem icon={Trash2} label={t('profile.clear')} danger onClick={() => setConfirming(true)} />
                <MenuItem icon={LogOut} label={t('profile.logout')} onClick={() => { onOpenChange?.(false); onLogout?.() }} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
