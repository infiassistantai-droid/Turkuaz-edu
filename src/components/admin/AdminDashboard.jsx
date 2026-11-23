import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, LoaderCircle, RefreshCw, Users } from 'lucide-react'
import { useI18n } from '../../lib/i18n.jsx'
import { fetchAdminDashboardStats } from '../../lib/supabase.js'
import { ModelAsset } from '../BosforArtwork'

const METRICS = [
  { id: 'totalUsers', labelKey: 'admin.metric.users' },
  { id: 'averageXp', labelKey: 'admin.metric.xp' },
]

export default function AdminDashboard({ active = true, onNavigate, routes = [] }) {
  const { language, t } = useI18n()
  const [stats, setStats] = useState(null)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState(false)
  const currentRequest = useRef(0)

  const refresh = useCallback(async () => {
    const request = ++currentRequest.current
    setBusy(true)
    setError(false)
    try {
      const result = await fetchAdminDashboardStats()
      if (request === currentRequest.current) setStats(result)
    } catch {
      if (request === currentRequest.current) {
        setStats(null)
        setError(true)
      }
    } finally {
      if (request === currentRequest.current) setBusy(false)
    }
  }, [])

  useEffect(() => {
    if (active) void refresh()
    return () => { currentRequest.current += 1 }
  }, [active, refresh])

  return (
    <div className="admin-overview">
      <section aria-labelledby="admin-overview-title" className="admin-overview-panel">
        <header className="admin-overview-head">
          <div>
            <h1 id="admin-overview-title">{t('admin.dashboard.title')}</h1>
            <p>{t('admin.dashboard.subtitle')}</p>
          </div>
          <button type="button" className="admin-top-button" onClick={refresh} disabled={busy} aria-label={t('admin.dashboard.refresh')}>
            <RefreshCw size={17} className={busy ? 'animate-spin' : undefined} aria-hidden="true" />
            <span>{t('admin.dashboard.refresh')}</span>
          </button>
        </header>
        {error && <p role="alert" className="admin-stats-error">{t('admin.dashboard.statsError')}</p>}
        <div className="admin-metrics" aria-busy={busy}>
          {METRICS.map(({ id, labelKey }) => (
            <article className="admin-metric" key={id}>
              <span className="admin-metric-icon">
                {id === 'averageXp' ? <ModelAsset name="xp" className="size-8" /> : <Users size={20} aria-hidden="true" />}
              </span>
              <div>
                <h2>{t(labelKey)}</h2>
                {busy
                  ? <span className="admin-metric-loading" role="status" aria-label={t('admin.dashboard.loading')}><LoaderCircle size={22} className="animate-spin" aria-hidden="true" /></span>
                  : <p>{stats?.[id].toLocaleString(language) ?? '—'}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="admin-shortcuts-heading">
        <h2 id="admin-shortcuts-heading" className="admin-shortcuts-heading">{t('admin.shortcut.title')}</h2>
        <div className="admin-shortcuts">
          {routes.map(({ id, path, titleKey, icon: Icon }) => (
            <button type="button" key={id} className="admin-shortcut" data-module={id} onClick={() => onNavigate(path)}>
              <span className="admin-shortcut-icon"><Icon size={21} aria-hidden="true" /></span>
              <span className="admin-shortcut-copy"><strong>{t(titleKey)}</strong><small>{t('admin.shortcut.' + id)}</small></span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

