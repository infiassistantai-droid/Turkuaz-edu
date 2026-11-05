import { useEffect, useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'
import { useMascot } from '../context/MascotContext'
import { useWinterUpdate } from '../features/winter/WinterUpdateContext'

const MASCOT_ARTWORK = {
  idle: '/images/mascot/greeting.png',
  cheer: '/images/mascot/success.png',
  sad: '/images/mascot/encourage.png',
  focus: '/images/mascot/book-reading.png',
  hint: '/images/mascot/hint.png',
  speed: '/images/mascot/success.png',
}

const EMOTION_STYLES = {
  idle: 'mascot-breathe',
  cheer: 'mascot-cheer',
  sad: 'mascot-wiggle',
  focus: 'mascot-focus',
  hint: 'mascot-hint',
  speed: 'mascot-speed-cheer',
}

// The source art already has the Van Cat's blue/amber eyes; this matching
// heterochromia halo keeps the companion legible in both app themes.
const VAN_CAT_GLOWS = {
  idle: '0 0 14px rgba(56,189,248,.54), 0 0 26px rgba(251,191,36,.36)',
  cheer: '0 0 18px rgba(56,189,248,.58), 0 0 30px rgba(251,191,36,.48)',
  sad: '0 0 16px rgba(56,189,248,.48), 0 0 28px rgba(251,191,36,.36)',
  focus: '0 0 14px rgba(56,189,248,.48), 0 0 26px rgba(251,191,36,.34)',
  hint: '0 0 16px rgba(56,189,248,.5), 0 0 28px rgba(251,191,36,.42)',
  speed: '0 0 22px rgba(34,211,238,.76), 0 0 38px rgba(251,191,36,.66)',
}

function usePremiumTheme() {
  const [isPremium, setIsPremium] = useState(() => (
    typeof document !== 'undefined' && document.documentElement.classList.contains('theme-premium')
  ))

  useEffect(() => {
    if (typeof document === 'undefined') return undefined
    const root = document.documentElement
    const updateTheme = () => setIsPremium(root.classList.contains('theme-premium'))
    updateTheme()
    if (typeof MutationObserver === 'undefined') return undefined
    const observer = new MutationObserver(updateTheme)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isPremium
}

export default function Mascot() {
  const { message, emotion, visible, id, showMascot, hideMascot } = useMascot()
  const { t } = useI18n()
  const { enabled: winterModeEnabled } = useWinterUpdate()
  const isPremium = usePremiumTheme()
  const artwork = MASCOT_ARTWORK[emotion] || MASCOT_ARTWORK.idle
  const animation = EMOTION_STYLES[emotion] || EMOTION_STYLES.idle
  const vanCatGlow = VAN_CAT_GLOWS[emotion] || VAN_CAT_GLOWS.idle

  const greeting = winterModeEnabled ? 'winter.mascot.greeting' : 'mascot.greeting'
  const showGreeting = () => {
    if (!visible) showMascot({ message: t(greeting), emotion: 'idle' })
  }

  const toggleBubble = () => {
    if (visible) {
      hideMascot()
      return
    }
    showMascot({ message: t(greeting), emotion: 'idle' })
  }

  return (
    <aside
      className="mascot-container pointer-events-none fixed bottom-4 right-3 z-50 flex max-w-[calc(100vw-1.5rem)] items-end gap-2 sm:bottom-6 sm:right-6 sm:gap-3"
      aria-label={t('mascot.aria')}
      data-emotion={emotion}
    >
      {visible && message && (
        <div
          key={`${id}-${message}`}
          role="status"
          aria-live="polite"
          className={cn(
            'mascot-bubble pointer-events-auto relative mb-1 w-[min(65vw,280px)] rounded-2xl border px-4 py-3 pr-9 text-sm font-semibold leading-relaxed',
            isPremium
              ? 'border-white/10 bg-[#16080c]/95 text-white shadow-[0_12px_40px_rgba(0,0,0,.42)] backdrop-blur-2xl'
              : 'border-slate-200 bg-white text-slate-800 shadow-[0_12px_36px_rgba(15,23,42,.18)]',
            winterModeEnabled && 'winter-frost',
          )}
        >
          <span className={cn(
            'absolute -right-1.5 bottom-4 size-3 rotate-45 border-b border-r',
            isPremium ? 'border-white/10 bg-[#16080c]' : 'border-slate-200 bg-white',
          )} aria-hidden="true" />
          <span className="relative z-10 flex items-start gap-2">
            <Sparkles className={cn('mt-0.5 size-4 shrink-0', isPremium ? 'text-yellow-200' : 'text-teal-600')} aria-hidden="true" />
            <span className="whitespace-pre-line">{message}</span>
          </span>
          <button
            type="button"
            onClick={() => showMascot({ message: t('mascot.hint'), emotion: 'hint', duration: 4200 })}
            aria-label={t('mascot.hint.action')}
            className={cn(
              'relative z-10 ml-6 mt-2 rounded-lg px-2 py-1 text-[11px] font-extrabold transition-colors',
              isPremium ? 'text-yellow-200 hover:bg-white/10' : 'text-teal-700 hover:bg-teal-50',
            )}
          >
            {t('mascot.hint.action')}
          </button>
          <button
            type="button"
            onClick={hideMascot}
            aria-label={t('mascot.dismiss')}
            className={cn(
              'absolute right-2 top-2 grid size-6 place-items-center rounded-lg transition-colors',
              isPremium ? 'text-white/55 hover:bg-white/10 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700',
            )}
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      <span className={cn('mascot-cat-traveler pointer-events-none relative z-20 shrink-0', visible && 'mascot-cat-traveler-bubble-open')}>
        <button
          key={`${id}-${emotion}`}
          type="button"
          onClick={toggleBubble}
          onPointerEnter={(event) => {
            if (event.pointerType === 'mouse') showGreeting()
          }}
          onFocus={(event) => {
            if (event.currentTarget.matches(':focus-visible')) showGreeting()
          }}
          aria-label={visible ? t('mascot.dismiss') : t('mascot.open')}
          aria-expanded={visible}
          className={cn(
            'van-cat-button pointer-events-auto relative grid size-16 shrink-0 place-items-center rounded-full transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 motion-reduce:animate-none sm:size-20',
            animation,
            isPremium ? 'focus-visible:ring-yellow-200/45' : 'focus-visible:ring-teal-500/35',
          )}
          style={{ '--van-cat-glow': vanCatGlow, boxShadow: vanCatGlow }}
        >
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_30%,rgba(56,189,248,.18),transparent_54%),radial-gradient(circle_at_72%_76%,rgba(251,191,36,.18),transparent_56%)]" aria-hidden="true" />
          <img
            src={artwork}
            alt=""
            width="160"
            height="160"
            draggable="false"
            className="mascot-art-3d relative z-10 size-full select-none object-contain drop-shadow-[0_3px_5px_rgba(15,23,42,.2)]"
          />
          {winterModeEnabled && (
            <svg className="pointer-events-none absolute inset-0 z-20 size-full drop-shadow-[0_2px_2px_rgba(15,23,42,.2)]" viewBox="0 0 160 160" aria-hidden="true">
              <path d="M73 41c3-11 14-18 26-16 10 1 17 7 19 16H73Z" fill="#064e3b" stroke="#dbeafe" strokeWidth="2.2" strokeLinejoin="round" />
              <path d="M70 40c14 5 34 5 50 0l2 6c-16 6-38 6-54 0l2-6Z" fill="#bfdbfe" stroke="#f8fafc" strokeWidth="1.6" />
              <circle cx="113" cy="24" r="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
              <path d="M53 87c13 8 35 10 55 0l4 7c-17 11-43 10-62 0l3-7Z" fill="#0f766e" stroke="#e0f2fe" strokeWidth="2" strokeLinejoin="round" />
              <path d="M91 94l12-3 2 21-12 4-2-22Z" fill="#0f766e" stroke="#e0f2fe" strokeWidth="2" strokeLinejoin="round" />
              <path d="M54 90c16 8 36 9 53 1" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 4" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </span>
    </aside>
  )
}
