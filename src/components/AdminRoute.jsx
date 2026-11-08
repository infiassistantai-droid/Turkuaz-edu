import { useEffect, useRef } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { isOwnerEmail } from '../config/admin'
import { useI18n } from '../lib/i18n.jsx'
import AdminLayout from './AdminLayout'

export default function AdminRoute({ pathname, onNavigate, onHome, onUnauthorized }) {
  const { user, loading } = useAuth()
  const { t } = useI18n()
  const handledDenied = useRef(false)
  const allowed = isOwnerEmail(user?.email)

  useEffect(() => {
    if (loading || allowed || handledDenied.current) return
    handledDenied.current = true
    onUnauthorized?.('Ruxsat etilmagan hudud!')
  }, [allowed, loading, onUnauthorized])

  if (loading) return <main role="status" aria-busy="true" className="grid min-h-[100dvh] place-items-center bg-[#080d1b] text-sm font-semibold text-slate-200"><span className="inline-flex items-center gap-2"><LoaderCircle className="size-5 animate-spin text-indigo-300" aria-hidden="true"/>{t('admin.auth.checking')}</span></main>
  if (!allowed) return null

  return <AdminLayout pathname={pathname} user={user} onNavigate={onNavigate} onHome={onHome}/>
}
