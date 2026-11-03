import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { isWinterSeason } from './winterSeason'

const STORAGE_KEY = 'turkuaz-edu-winter-mode-v1'
const WINTER_FEATURE_FLAG = import.meta.env.VITE_WINTER_UPDATE_ENABLED === 'true'
const WINTER_AUTO_FLAG = import.meta.env.VITE_WINTER_UPDATE_AUTO === 'true'
export const WINTER_UPDATE_FEATURE_ENABLED = WINTER_FEATURE_FLAG || WINTER_AUTO_FLAG

const WinterUpdateContext = createContext(null)

function getSavedPreference() {
  if (typeof window === 'undefined') return null
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved === 'true' ? true : saved === 'false' ? false : null
  } catch {
    return null
  }
}

function getInitialEnabled() {
  if (!WINTER_UPDATE_FEATURE_ENABLED) return false
  const saved = getSavedPreference()
  return saved === null ? WINTER_AUTO_FLAG && isWinterSeason() : saved
}

export function WinterUpdateProvider({ children }) {
  const [enabled, setEnabled] = useState(getInitialEnabled)
  const featureEnabled = WINTER_UPDATE_FEATURE_ENABLED

  useEffect(() => {
    if (!featureEnabled) {
      setEnabled(false)
      return undefined
    }
    const refreshSeasonalDefault = () => {
      if (getSavedPreference() === null) setEnabled(WINTER_AUTO_FLAG && isWinterSeason())
    }
    const interval = window.setInterval(refreshSeasonalDefault, 60 * 60 * 1000)
    return () => window.clearInterval(interval)
  }, [featureEnabled])

  const toggle = useCallback(() => {
    if (!featureEnabled) return
    setEnabled((current) => {
      const next = !current
      try { window.localStorage.setItem(STORAGE_KEY, String(next)) } catch { /* keep the current session toggle */ }
      return next
    })
  }, [featureEnabled])

  const value = useMemo(() => ({ enabled: featureEnabled && enabled, featureEnabled, toggle }), [enabled, featureEnabled, toggle])
  return <WinterUpdateContext.Provider value={value}>{children}</WinterUpdateContext.Provider>
}

export function useWinterUpdate() {
  return useContext(WinterUpdateContext) || { enabled: false, featureEnabled: false, toggle: () => {} }
}
