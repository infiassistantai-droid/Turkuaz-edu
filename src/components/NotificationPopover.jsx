import { useEffect, useRef, useState } from 'react'
import { Bell, BookOpenText, Check, CheckCheck, Clock3 } from 'lucide-react'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'

const NOTIFICATIONS = [
  { id: 'daily-reminder', titleKey: 'notifications.reminder', timeKey: 'notifications.time.today', icon: Clock3 },
  { id: 'vocabulary-update', titleKey: 'notifications.vocab', timeKey: 'notifications.time.yesterday', icon: BookOpenText },
]

export default function NotificationPopover({ isPremium = false }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [readIds, setReadIds] = useState(() => new Set())
  const wrapperRef = useRef(null)
  const unreadCount = NOTIFICATIONS.length - readIds.size

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const markAllRead = () => setReadIds(new Set(NOTIFICATIONS.map(({ id }) => id)))
  const markRead = (id) => setReadIds((current) => new Set(current).add(id))

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'relative grid size-9 place-items-center rounded-xl border transition-all hover:-translate-y-0.5 active:translate-y-0',
          isPremium
            ? 'border-white/10 bg-black/25 text-white/80 hover:bg-white/10'
            : 'border-slate-200/80 bg-white/70 text-slate-600 hover:bg-white dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800',
        )}
        aria-label={unreadCount ? `${t('header.notifications')} (${unreadCount})` : t('header.notifications')}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="notification-popover"
      >
        <Bell className="size-4" aria-hidden="true" />
        {unreadCount > 0 && <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full border-2 border-white bg-rose-500 px-0.5 text-[9px] font-extrabold leading-none text-white dark:border-slate-950" aria-hidden="true">{unreadCount}</span>}
      </button>

      {open && (
        <section
          id="notification-popover"
          role="dialog"
          aria-label={t('notifications.title')}
          className={cn(
            'absolute right-0 top-full z-50 mt-3 w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-2xl',
            isPremium
              ? 'border-white/10 bg-black/75 text-white'
              : 'border-slate-200/80 bg-white/95 text-slate-800 dark:border-white/10 dark:bg-slate-900/95 dark:text-white',
          )}
        >
          <div className={cn('flex items-center justify-between gap-3 border-b px-4 py-3.5', isPremium ? 'border-white/10' : 'border-slate-100 dark:border-white/10')}>
            <div>
              <h2 className="text-sm font-extrabold">{t('notifications.title')}</h2>
              <p className={cn('mt-0.5 text-[11px]', isPremium ? 'text-white/50' : 'text-slate-500 dark:text-slate-400')}>
                {unreadCount > 0 ? t('notifications.unread', { count: unreadCount }) : t('notifications.allRead')}
              </p>
            </div>
            <span className={cn('grid size-9 place-items-center rounded-xl', isPremium ? 'bg-yellow-300/10 text-yellow-200' : 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300')}>
              <Bell className="size-4" aria-hidden="true" />
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto p-2">
            {NOTIFICATIONS.map(({ id, titleKey, timeKey, icon: Icon }) => {
              const isRead = readIds.has(id)
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => markRead(id)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors',
                    isPremium
                      ? isRead ? 'text-white/50 hover:bg-white/5' : 'bg-white/[.055] text-white hover:bg-white/10'
                      : isRead ? 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5' : 'bg-teal-50/70 text-slate-800 hover:bg-teal-50 dark:bg-teal-500/[.08] dark:text-white dark:hover:bg-teal-500/15',
                  )}
                  aria-label={`${t(titleKey)} · ${isRead ? t('notifications.read') : t('notifications.unreadStatus')}`}
                >
                  <span className={cn('mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl', isPremium ? 'bg-yellow-300/10 text-yellow-200' : 'bg-white text-teal-700 shadow-sm dark:bg-slate-800 dark:text-teal-300')}>
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold leading-relaxed">{t(titleKey)}</span>
                    <span className={cn('mt-1 flex items-center gap-1 text-[10px]', isPremium ? 'text-white/45' : 'text-slate-400 dark:text-slate-500')}>
                      <Clock3 className="size-3" aria-hidden="true" />{t(timeKey)}
                    </span>
                  </span>
                  {!isRead && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-teal-500" aria-hidden="true" />}
                  {isRead && <Check className={cn('mt-1 size-3.5 shrink-0', isPremium ? 'text-white/35' : 'text-slate-400')} aria-hidden="true" />}
                </button>
              )
            })}
          </div>

          <div className={cn('border-t p-2', isPremium ? 'border-white/10' : 'border-slate-100 dark:border-white/10')}>
            <button
              type="button"
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors disabled:cursor-default disabled:opacity-50',
                isPremium ? 'text-yellow-100 hover:bg-white/10' : 'text-teal-700 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-white/5',
              )}
            >
              <CheckCheck className="size-4" aria-hidden="true" />
              {t('notifications.markAll')}
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
