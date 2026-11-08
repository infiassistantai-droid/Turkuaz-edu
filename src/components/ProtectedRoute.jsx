import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { isSupabaseConfigured } from '../lib/supabase.js'

export default function ProtectedRoute({ authenticated, required = true, redirectTo = '/login', children }) {
  const { user, loading } = useAuth()
  const isAuthenticated = isSupabaseConfigured ? Boolean(user) : Boolean(authenticated)

  useEffect(() => {
    if (!required || loading || isAuthenticated || typeof window === 'undefined') return
    if (window.location.pathname === redirectTo) return

    window.history.replaceState({}, '', redirectTo)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [isAuthenticated, loading, redirectTo, required])

  // Keep the protected shell hidden until Supabase has restored the persisted
  // session. The app-level router handles its loading and login presentation.
  if (!required) return children
  if (loading || !isAuthenticated) return null
  return children
}
