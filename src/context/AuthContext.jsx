import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    session: null,
    user: null,
    loading: Boolean(supabase),
  })

  useEffect(() => {
    if (!supabase) {
      setAuthState({ session: null, user: null, loading: false })
      return undefined
    }

    let active = true
    let subscription
    try {
      const result = supabase.auth.onAuthStateChange((_event, session) => {
        if (!active) return
        setAuthState({ session, user: session?.user ?? null, loading: false })
      })
      subscription = result?.data?.subscription
    } catch (error) {
      console.warn('[Turkuaz Edu] Supabase auth listener could not start.', error)
      supabase.auth.getSession()
        .then(({ data }) => {
          if (!active) return
          const session = data?.session ?? null
          setAuthState({ session, user: session?.user ?? null, loading: false })
        })
        .catch(() => {
          if (active) setAuthState({ session: null, user: null, loading: false })
        })
    }

    return () => {
      active = false
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
