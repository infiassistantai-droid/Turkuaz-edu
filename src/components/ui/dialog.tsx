import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'

export function Dialog({ open, onOpenChange, children, isPremium = false, labelledBy, className }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => panelRef.current?.focus())

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onOpenChange?.(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
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
            : 'border-slate-200 bg-white text-slate-900 shadow-slate-950/25',
          className,
        )}
      >
        {children}
      </section>
    </div>,
    document.body,
  )
}
