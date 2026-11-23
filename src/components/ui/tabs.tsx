import { createContext, useContext, useState } from 'react'
import { cn } from '../../lib/utils'

const TabsContext = createContext(null)

export function Tabs({ defaultValue, value, onValueChange, children, className }) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const selectedValue = value ?? internalValue
  const setValue = onValueChange ?? setInternalValue

  return (
    <TabsContext.Provider value={{ selectedValue, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className, onKeyDown, ...props }) {
  function handleKeyDown(event) {
    onKeyDown?.(event)
    if (event.defaultPrevented || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    const tabs = Array.from(event.currentTarget.querySelectorAll('button[role="tab"]:not(:disabled)')) as HTMLButtonElement[]
    const current = tabs.indexOf(event.target)
    if (current === -1) return

    event.preventDefault()
    let next
    if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else next = (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
    tabs[next].focus()
    tabs[next].click()
  }

  return (
    <div role="tablist" className={cn('flex items-center gap-1', className)} onKeyDown={handleKeyDown} {...props}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className, ...props }) {
  const tabs = useContext(TabsContext)
  if (!tabs) throw new Error('TabsTrigger must be used inside Tabs')
  const selected = tabs.selectedValue === value

  return (
    <button
      type="button"
      role="tab"
      id={`tab-${value}`}
      aria-selected={selected}
      data-state={selected ? 'active' : 'inactive'}
      aria-controls={`tabpanel-${value}`}
      tabIndex={selected ? 0 : -1}
      onClick={() => tabs.setValue(value)}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className, ...props }) {
  const tabs = useContext(TabsContext)
  if (!tabs) throw new Error('TabsContent must be used inside Tabs')
  if (tabs.selectedValue !== value) return null

  return (
    <div role="tabpanel" id={`tabpanel-${value}`} aria-labelledby={`tab-${value}`} className={className} {...props}>
      {children}
    </div>
  )
}
