import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

const signedOutState = { session: null, user: null, loading: false }
const AUTH_SESSION_RESTORE_TIMEOUT_MS = 8_000

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => ({
    ...signedOutState,
    loading: Boolean(supabase),
  }))

  useEffect(() => {
    if (!supabase) {
      setAuthState(signedOutState)
      return undefined
    }

    let active = true
    let authEventVersion = 0
    let subscription
    let restoreTimeout

    const clearRestoreTimeout = () => {
      if (restoreTimeout) globalThis.clearTimeout(restoreTimeout)
      restoreTimeout = undefined
    }
    const applySession = (session) => {
      if (!active) return
      setAuthState({ session: session || null, user: session?.user || null, loading: false })
    }

    try {
      const { data, error } = supabase.auth.onAuthStateChange((_event, session) => {
        // Supabase emits INITIAL_SESSION, SIGNED_IN, SIGNED_OUT, and token events.
        // Keep the callback synchronous and do not call another auth method in it.
        authEventVersion += 1
        clearRestoreTimeout()
        applySession(session)
      })
      if (error) throw error
      subscription = data?.subscription
    } catch (error) {
      console.warn('[Turkuaz Edu] Supabase auth listener could not start.', error)
    }

    // Restore the persisted OAuth/password session on a full page load. If an
    // auth event arrives first, its newer state wins over this initial lookup.
    const versionAtLookup = authEventVersion
    restoreTimeout = globalThis.setTimeout(() => {
      if (!active || authEventVersion !== versionAtLookup) return
      // Avoid holding the entire app behind a session restore that never settles.
      applySession(null)
    }, AUTH_SESSION_RESTORE_TIMEOUT_MS)
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active || authEventVersion !== versionAtLookup) return
        if (error) throw error
        applySession(data?.session || null)
      })
      .catch((error) => {
        if (!active || authEventVersion !== versionAtLookup) return
        console.warn('[Turkuaz Edu] Could not restore the Supabase session.', error)
        applySession(null)
      })
      .finally(clearRestoreTimeout)

    return () => {
      active = false
      clearRestoreTimeout()
      subscription?.unsubscribe?.()
    }
  }, [])

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
