import { forwardRef } from 'react'
import { cn } from '../lib/utils'

const ORB_BACKGROUND = 'radial-gradient(circle at 50% 10%, #5eead4 0%, #0f766e 40%, #042f2e 100%)'

const PremiumButton = forwardRef(function PremiumButton({
  as: Component = 'button',
  icon: Icon,
  leading,
  iconOnly = false,
  interactive = Component === 'button',
  className,
  children,
  type,
  ...props
}, ref) {
  const showOrb = Boolean(Icon || leading)
  const buttonProps = Component === 'button' ? { type: type || 'button' } : {}

  return (
    <Component
      ref={ref}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-[#d4af37]/40 bg-[#0a0f1c] px-4 py-1.5 font-extrabold tracking-wide text-[#fde047] shadow-[inset_0_1px_4px_rgba(212,175,55,0.15)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-colors',
        interactive && 'hover:bg-[#11192b] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1c] disabled:cursor-not-allowed disabled:opacity-50',
        showOrb && 'gap-2.5 pl-1.5 pr-3.5',
        iconOnly && 'size-11 min-h-11 shrink-0 !gap-0 !p-1.5',
        className,
      )}
      {...buttonProps}
      {...props}
    >
      {showOrb && (
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border-[1.5px] border-[#d4af37] shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_2px_5px_rgba(0,0,0,0.8)]"
          style={{ background: ORB_BACKGROUND }}
        >
          {leading ?? (Icon ? <Icon className="size-3.5 text-[#fde047]" strokeWidth={2.5} aria-hidden="true" /> : null)}
        </span>
      )}
      {children}
    </Component>
  )
})

export default PremiumButton
