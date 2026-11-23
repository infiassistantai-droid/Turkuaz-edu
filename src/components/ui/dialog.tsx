import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'

export function Dialog({ open, onOpenChange, children, isPremium = false, dark = false, labelledBy, className }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusFrame = window.requestAnimationFrame(() => panelRef.current?.focus())

    const onKeyDown = (event) => {
      if (event.defaultPrevented) return
      if (event.key === 'Escape') {
        onOpenChange?.(false)
        return
      }
      if (event.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const tabbable = Array.from(panel.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [tabindex]',
      )).filter((item) => item.tabIndex >= 0 && !item.matches(':disabled') && item.getClientRects().length > 0)
      const active = document.activeElement
      const first = tabbable[0]
      const last = tabbable[tabbable.length - 1]
      const boundary = event.shiftKey ? first : last
      if (active === boundary || !tabbable.some((item) => item === active)) {
        event.preventDefault()
        ((event.shiftKey ? last : first) ?? panel).focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus?.()
    }
  }, [open, onOpenChange])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/55 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange?.(false)
      }}
    >
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          'relative my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-[28px] border shadow-2xl outline-none sm:max-h-[calc(100dvh-3rem)]',
          isPremium
            ? 'border-white/10 bg-[#1b080a]/95 text-white shadow-black/60 backdrop-blur-2xl'
            : dark
              ? 'bosfor-dialog shadow-black/60'
              : 'bosfor-dialog shadow-slate-950/25',
          className,
        )}
      >
        {children}
      </section>
    </div>,
    document.body,
  )
}
