import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Settings, Trash2, LogOut, Target, Zap, AlertTriangle, Check, Globe } from 'lucide-react'
import { cn } from '../lib/utils'
import { getInitials } from '../lib/storage'
import { useI18n } from '../lib/i18n.jsx'

function MenuItem({ icon: Icon, label, onClick, danger, isPremium }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors',
        danger
          ? isPremium
            ? 'text-amber-200 hover:bg-amber-300/10'
            : 'text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10'
          : isPremium
            ? 'text-white hover:bg-white/10'
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
export default function ProfileMenu({ profile, stats, level = 1, open, onOpenChange, onEdit, onClear, onLogout, isPremium = false }) {
  const { language, setLanguage, t } = useI18n()
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
        <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 text-xs font-bold text-white ring-1 ring-white/20">
          {initials}
        </span>
        <span className={cn('rounded-md border px-1.5 py-1 text-[9px] font-black leading-none tracking-wide', isPremium ? 'border-yellow-200/20 bg-yellow-200/10 text-yellow-100' : 'border-amber-200 bg-amber-50 text-amber-800')} title={`Level ${level}`}>
          Lvl {level}
        </span>
        <span className="hidden max-w-20 truncate text-sm font-bold text-slate-700 sm:block dark:text-slate-200">
          {profile.name}
        </span>
        <ChevronDown className={cn('size-3.5 shrink-0 text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>

      {/* dropdown */}
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute right-0 top-full z-50 mt-2 max-h-[calc(100dvh-1rem)] w-72 animate-pop overflow-y-auto rounded-2xl border shadow-2xl backdrop-blur-2xl',
            isPremium ? 'border-yellow-300/35 bg-black/85 text-white' : 'border-slate-200/80 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-white',
          )}
        >
          {/* profile header */}
          <div className={cn('flex items-center gap-3 p-4 text-white', isPremium ? 'bg-gradient-to-br from-rose-950 via-red-900 to-rose-950' : 'bg-gradient-to-br from-teal-600 to-cyan-500')}>
            <div className="relative shrink-0">
              <div className="relative grid size-11 place-items-center rounded-full bg-white/20 font-display text-sm font-extrabold ring-1 ring-white/30">
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

          {/* XP summary */}
          <div className="border-b border-slate-100 p-3 dark:border-slate-800">
            <div className={cn('flex items-center gap-2.5 rounded-xl px-3 py-2.5', isPremium ? 'border border-yellow-300/20 bg-black/35 text-amber-100' : 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300')}>
              <Zap className="size-4 fill-teal-500 text-teal-500" aria-hidden="true" />
              <div className="leading-tight">
                <div className="font-display text-sm font-extrabold tabular-nums">
                  {(stats?.xp ?? 0).toLocaleString(language)}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest">XP</div>
              </div>
            </div>
          </div>

          {/* Language selection lives inside the avatar menu rather than the top bar. */}
          <div role="group" aria-label={t('language.label')} className="border-b border-slate-100 p-3 dark:border-slate-800">
            <div className={cn('mb-2 flex items-center gap-2 text-xs font-bold', isPremium ? 'text-white/75' : 'text-slate-600 dark:text-slate-300')}>
              <Globe className="size-3.5" aria-hidden="true" />
              {t('language.label')}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'uz', key: 'language.uz' },
                { id: 'tr', key: 'language.tr' },
                { id: 'en', key: 'language.en' },
              ].map((option) => {
                const selected = option.id === language
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setLanguage(option.id)}
                    aria-pressed={selected}
                    className={cn(
                      'flex min-w-0 items-center justify-center gap-1 rounded-lg border px-1.5 py-2 text-[10px] font-bold transition-colors',
                      selected
                        ? isPremium
                          ? 'border-yellow-200/25 bg-yellow-300/15 text-yellow-100'
                          : 'border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-400/20 dark:bg-teal-500/10 dark:text-teal-200'
                        : isPremium
                          ? 'border-white/10 text-white/65 hover:bg-white/10'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-white/5',
                    )}
                  >
                    <span className="truncate">{t(option.key)}</span>
                    {selected && <Check className="size-3 shrink-0" aria-hidden="true" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* actions */}
          <div className="p-2">
            {confirming ? (
              <div className={cn('space-y-2 rounded-xl p-3', isPremium ? 'border border-yellow-300/25 bg-black/40' : 'bg-rose-50 dark:bg-rose-500/10')}>
                <p className="flex items-start gap-2 text-xs font-bold leading-relaxed text-rose-700 dark:text-rose-200">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  {t('profile.confirm.clear')}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className={cn('flex-1 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all active:scale-95', isPremium ? 'border-yellow-300/30 bg-black/30 text-white hover:bg-white/10' : 'border-rose-200 bg-white text-rose-600 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-slate-800 dark:text-rose-300')}
                  >
                    {t('profile.cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={onClear}
                    className={cn('flex-1 rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm transition-all active:scale-95', isPremium ? 'border border-yellow-300/50 bg-gradient-to-r from-rose-800 to-red-900 text-white hover:brightness-110' : 'bg-rose-600 text-white hover:bg-rose-700')}
                  >
                    {t('profile.delete')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-0.5">
                <MenuItem icon={Settings} label={t('profile.settings')} onClick={() => { onOpenChange?.(false); onEdit?.() }} isPremium={isPremium} />
                <MenuItem icon={Trash2} label={t('profile.clear')} danger onClick={() => setConfirming(true)} isPremium={isPremium} />
                <MenuItem icon={LogOut} label={t('profile.logout')} onClick={() => { onOpenChange?.(false); onLogout?.() }} isPremium={isPremium} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
