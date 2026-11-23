import { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { isOwnerEmail } from '../config/admin'
import { useI18n } from '../lib/i18n.jsx'
import AdminLayout from './AdminLayout'
import AppLoading from './AppLoading'

export default function AdminRoute({ pathname, onNavigate, onHome, onOpenShop, onUnauthorized, dark, onToggleDark }) {
  const { user, loading } = useAuth()
  const { t } = useI18n()
  const handledDenied = useRef(false)
  const allowed = isOwnerEmail(user?.email)

  useEffect(() => {
    if (loading || allowed || handledDenied.current) return
    handledDenied.current = true
    onUnauthorized?.('Ruxsat etilmagan hudud!')
  }, [allowed, loading, onUnauthorized])

  if (loading) return <AppLoading label={t('admin.auth.checking')} theme={dark ? 'night' : 'default'} screen />
  if (!allowed) return null

  return <AdminLayout pathname={pathname} user={user} onNavigate={onNavigate} onHome={onHome} onOpenShop={onOpenShop} dark={dark} onToggleDark={onToggleDark}/>
}
