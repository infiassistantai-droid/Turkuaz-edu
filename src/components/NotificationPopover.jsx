import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Bell, BookOpenText, Check, CheckCheck, Clock3, RotateCcw, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabase.js'
import PremiumButton from './PremiumButton'

const MAX_NOTIFICATIONS = 100

function sortByNewest(rows) {
  return [...rows].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

function formatCreatedAt(value, language) {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return ''
  const locales = { uz: 'uz-UZ', tr: 'tr-TR', en: 'en-US' }
  return new Intl.DateTimeFormat(locales[language] || 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function notificationIcon(type) {
  const normalizedType = String(type || '').toLowerCase()
  if (normalizedType === 'reminder') return Clock3
  if (['lesson', 'vocabulary'].includes(normalizedType)) return BookOpenText
  return Bell
}

export default function NotificationPopover({ isPremium = false }) {
  const { t, language } = useI18n()
  const { user } = useAuth()
  const userId = user?.id
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(Boolean(supabase && userId))
  const [loadError, setLoadError] = useState(false)
  const [reloadVersion, setReloadVersion] = useState(0)
  const wrapperRef = useRef(null)
  const panelRef = useRef(null)
  const bellButtonRef = useRef(null)
  const closeButtonRef = useRef(null)
  const wasOpenRef = useRef(false)
  const unreadCount = notifications.reduce((count, notification) => count + (notification.is_read ? 0 : 1), 0)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const query = window.matchMedia('(max-width: 639px)')
    const updateViewport = (event) => setIsMobile(event.matches)
    query.addEventListener?.('change', updateViewport)
    return () => query.removeEventListener?.('change', updateViewport)
  }, [])

  useEffect(() => {
    let active = true
    if (!supabase || !userId) {
      setNotifications([])
      setLoading(false)
      setLoadError(false)
      return undefined
    }

    setNotifications([])
    setLoading(true)
    setLoadError(false)

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        if (!active) return
        setLoadError(false)
        setLoading(false)
        const event = payload.eventType
        if (event === 'INSERT' || event === 'UPDATE') {
          const row = event === 'INSERT' ? payload.new : payload.new
          if (!row?.id) return
          setNotifications((current) => {
            const exists = current.some((item) => item.id === row.id)
            const next = exists
              ? current.map((item) => item.id === row.id ? { ...item, ...row } : item)
              : [row, ...current]
            return sortByNewest(next).slice(0, MAX_NOTIFICATIONS)
          })
        } else if (event === 'DELETE' && payload.old?.id) {
          setNotifications((current) => current.filter((item) => item.id !== payload.old.id))
        }
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('[Turkuaz Edu] Notification realtime subscription did not connect.')
        }
      })

    const loadNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('id,user_id,title,message,type,is_read,created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(MAX_NOTIFICATIONS)
      if (!active) return
      if (error) {
        console.warn('[Turkuaz Edu] Could not load notifications.', error)
        setLoadError(true)
        setNotifications([])
      } else {
        const fetchedRows = Array.isArray(data) ? data : []
        setNotifications((current) => {
          const merged = new Map(fetchedRows.map((row) => [row.id, row]))
          current.forEach((row) => merged.set(row.id, { ...merged.get(row.id), ...row }))
          return sortByNewest([...merged.values()]).slice(0, MAX_NOTIFICATIONS)
        })
      }
      setLoading(false)
    }

    void loadNotifications()
    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [reloadVersion, userId])

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) bellButtonRef.current?.focus()
      wasOpenRef.current = false
      return undefined
    }

    wasOpenRef.current = true
    closeButtonRef.current?.focus()
    const onPointerDown = (event) => {
      const clickedTrigger = wrapperRef.current?.contains(event.target)
      const clickedPanel = panelRef.current?.contains(event.target)
      if (!clickedTrigger && !clickedPanel) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const focusable = [...(panelRef.current?.querySelectorAll('button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])') || [])]
        .filter((element) => element.getClientRects().length > 0)
      if (focusable.length === 0) {
        event.preventDefault()
        closeButtonRef.current?.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const markAsRead = useCallback(async (notificationId) => {
    const current = notifications.find((item) => item.id === notificationId)
    if (!current || current.is_read || !supabase || !userId) return
    setNotifications((items) => items.map((item) => item.id === notificationId ? { ...item, is_read: true } : item))
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', userId)
    if (error) {
      console.warn('[Turkuaz Edu] Could not mark notification as read.', error)
      setNotifications((items) => items.map((item) => item.id === notificationId ? { ...item, is_read: false } : item))
    }
  }, [notifications, userId])

  const markAllAsRead = useCallback(async () => {
    if (!supabase || !userId || unreadCount === 0) return
    const unreadIds = new Set(notifications.filter((item) => !item.is_read).map((item) => item.id))
    setNotifications((items) => items.map((item) => unreadIds.has(item.id) ? { ...item, is_read: true } : item))
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
    if (error) {
      console.warn('[Turkuaz Edu] Could not mark all notifications as read.', error)
      setNotifications((items) => items.map((item) => unreadIds.has(item.id) ? { ...item, is_read: false } : item))
    }
  }, [notifications, unreadCount, userId])

  const surface = isPremium
    ? 'border-white/10 bg-black/85 text-white'
    : 'border-slate-200/80 bg-white text-slate-800 dark:border-white/10 dark:bg-slate-900 dark:text-white'

  const notificationPanel = open ? (
        <>
          <div aria-hidden="true" onClick={() => setOpen(false)} className="fixed inset-0 z-[90] cursor-default bg-slate-950/45 backdrop-blur-[1px] sm:hidden" />
          <section
            ref={panelRef}
            id="notification-popover"
            role="dialog"
            aria-label={t('notifications.title')}
            aria-modal="true"
            className={cn(
              'fixed inset-x-3 bottom-3 top-20 z-[100] flex max-h-[calc(100dvh-5.75rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-2xl sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3 sm:max-h-none sm:w-80 sm:max-w-[calc(100vw-1.5rem)]',
              surface,
            )}
          >
            <div className={cn('flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3.5', isPremium ? 'border-white/10' : 'border-slate-100 dark:border-white/10')}>
              <div>
                <h2 className="text-sm font-extrabold">{t('notifications.title')}</h2>
                <p className={cn('mt-0.5 text-[11px]', isPremium ? 'text-white/50' : 'text-slate-500 dark:text-slate-400')}>
                  {unreadCount > 0 ? t('notifications.unread', { count: unreadCount }) : t('notifications.allRead')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('grid size-9 place-items-center rounded-xl', isPremium ? 'bg-yellow-300/10 text-yellow-200' : 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300')}>
                  <Bell className="size-4" aria-hidden="true" />
                </span>
                <PremiumButton ref={closeButtonRef} icon={X} iconOnly onClick={() => setOpen(false)} aria-label={t('notifications.close')} />
              </div>
            </div>

            <div className="notifications-scrollbar min-h-0 flex-1 overflow-y-auto p-2 sm:max-h-96 sm:flex-none">
              {loading ? (
                <p role="status" className={cn('px-3 py-8 text-center text-sm', isPremium ? 'text-white/55' : 'text-slate-500 dark:text-slate-400')}>{t('notifications.loading')}</p>
              ) : loadError ? (
                <div className="px-3 py-8 text-center"><p role="alert" className={cn('text-sm', isPremium ? 'text-amber-100/75' : 'text-amber-700 dark:text-amber-300')}>{t('notifications.loadError')}</p><PremiumButton icon={RotateCcw} onClick={() => setReloadVersion((version) => version + 1)} className="mt-3 min-h-11 px-3 text-xs">{t('notifications.retry')}</PremiumButton></div>
              ) : notifications.length === 0 ? (
                <p className={cn('px-3 py-8 text-center text-sm', isPremium ? 'text-white/55' : 'text-slate-500 dark:text-slate-400')}>{t('notifications.empty')}</p>
              ) : (
                <ul className="space-y-1.5">
                  {notifications.map((notification) => {
                    const isRead = Boolean(notification.is_read)
                    const Icon = notificationIcon(notification.type)
                    return (
                      <li key={notification.id}>
                        <PremiumButton
                          icon={Icon}
                          onClick={() => { void markAsRead(notification.id) }}
                          className={cn('min-h-14 w-full items-start justify-start px-1.5 py-2.5 text-left text-xs', isRead && 'opacity-65')}
                          aria-label={`${notification.title} · ${isRead ? t('notifications.read') : t('notifications.unreadStatus')}`}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block break-words text-xs font-bold leading-relaxed">{notification.title}</span>
                            {notification.message && <span className="mt-0.5 block break-words text-xs leading-relaxed text-cyan-100/70">{notification.message}</span>}
                            <span className="mt-1 flex items-center gap-1 text-[10px] text-cyan-100/55">
                              <Clock3 className="size-3" aria-hidden="true" />{formatCreatedAt(notification.created_at, language)}
                            </span>
                          </span>
                          {!isRead && <span className="mt-1.5 size-2 shrink-0 animate-pulse rounded-full bg-teal-300 shadow-[0_0_10px_rgba(20,184,166,.9)]" aria-hidden="true" />}
                          {isRead && <Check className="mt-1 size-3.5 shrink-0 text-cyan-100/55" aria-hidden="true" />}
                        </PremiumButton>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            <div className={cn('shrink-0 border-t p-2', isPremium ? 'border-white/10' : 'border-slate-100 dark:border-white/10')}>
              <PremiumButton
                icon={CheckCheck}
                onClick={() => { void markAllAsRead() }}
                disabled={unreadCount === 0 || loading || !userId}
                className="min-h-11 w-full justify-center px-3 text-xs"
              >
                {t('notifications.markAll')}
              </PremiumButton>
            </div>
          </section>
        </>
  ) : null

  return (
    <div className="relative" ref={wrapperRef}>
      <PremiumButton
        ref={bellButtonRef}
        icon={Bell}
        iconOnly
        className="relative"
        onClick={() => setOpen((value) => !value)}
        aria-label={unreadCount ? `${t('header.notifications')} (${unreadCount})` : t('header.notifications')}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="notification-popover"
      >
        {unreadCount > 0 && <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full border-2 border-[#0a0f1c] bg-rose-500 px-0.5 text-[9px] font-extrabold leading-none text-white shadow-[0_0_10px_rgba(244,63,94,.75)]" aria-hidden="true">{unreadCount}</span>}
      </PremiumButton>

      {notificationPanel && (isMobile && typeof document !== 'undefined' ? createPortal(notificationPanel, document.body) : notificationPanel)}
    </div>
  )
}
