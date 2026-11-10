import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, Check, LoaderCircle, RefreshCw, Trophy } from 'lucide-react'
import { useI18n } from '../../lib/i18n.jsx'
import { fetchLeagueTiers, saveLeagueTiers } from '../../lib/supabase.js'
import { AdminCard, AdminPageHeader, INPUT_CLASS, SecondaryButton } from './AdminShared'

const FALLBACK = [
  { tier_key: 'bronze', minimum_xp: 0, sort_order: 1, badge_path: '/images/league-medals/bronze.png', active: true },
  { tier_key: 'silver', minimum_xp: 1000, sort_order: 2, badge_path: '/images/league-medals/silver.png', active: true },
  { tier_key: 'gold', minimum_xp: 5000, sort_order: 3, badge_path: '/images/league-medals/gold.png', active: true },
  { tier_key: 'platinum', minimum_xp: 10000, sort_order: 4, badge_path: '/images/league-medals/platinum.png', active: true },
  { tier_key: 'diamond', minimum_xp: 20000, sort_order: 5, badge_path: '/images/league-medals/diamond.png', active: true },
  { tier_key: 'legend', minimum_xp: 50000, sort_order: 6, badge_path: '/images/league-medals/legend.png', active: true },
]

export default function AdminLeagues({ active = true, notify }) {
  const { t } = useI18n()
  const [tiers, setTiers] = useState(FALLBACK)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const rows = await fetchLeagueTiers()
      if (rows?.length) setTiers(rows)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (active) void refresh() }, [active, refresh])

  const updateTier = (key, patch) => setTiers((current) => current.map((tier) => tier.tier_key === key ? { ...tier, ...patch } : tier))
  const save = async () => {
    const activeTiers = tiers.filter((tier) => tier.active)
    const thresholds = activeTiers.map((tier) => Number(tier.minimum_xp))
    if (!activeTiers.length || activeTiers.some((tier) => tier.minimum_xp === '' || !Number.isInteger(Number(tier.minimum_xp)) || Number(tier.minimum_xp) < 0) || new Set(thresholds).size !== thresholds.length) {
      notify?.(t('admin.leagues.validation'))
      return
    }
    setSaving(true)
    try {
      const saved = await saveLeagueTiers(tiers)
      setTiers(saved)
      notify?.(t('admin.leagues.saved'))
    } catch {
      notify?.(t('admin.leagues.saveError'))
    } finally {
      setSaving(false)
    }
  }

  return <div className="mx-auto max-w-5xl">
    <AdminPageHeader eyebrow={t('admin.leagues.eyebrow')} title={t('admin.leagues.title')} description={t('admin.leagues.description')} actions={<><SecondaryButton type="button" onClick={refresh} disabled={loading}><RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true"/>{t('admin.leagues.refresh')}</SecondaryButton><button type="button" onClick={save} disabled={saving || loading} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">{saving ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true"/> : <Check className="size-4" aria-hidden="true"/>}{saving ? t('admin.leagues.saving') : t('admin.leagues.save')}</button></>}/>
    {error && <div role="alert" className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900"><AlertTriangle className="size-4 shrink-0" aria-hidden="true"/>{t('admin.leagues.loadError')}</div>}
    <AdminCard title={t('admin.leagues.configTitle')} description={t('admin.leagues.configDescription')}>
      {loading ? <div role="status" className="grid min-h-40 place-items-center text-indigo-500"><LoaderCircle className="size-6 animate-spin" aria-label={t('admin.leagues.loading')}/></div> : <div className="divide-y divide-slate-100">
        {tiers.slice().sort((a, b) => a.sort_order - b.sort_order).map((tier) => <div key={tier.tier_key} className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(150px,1fr)_minmax(130px,200px)_auto] sm:items-center sm:px-5">
          <div className="flex min-w-0 items-center gap-3"><img src={tier.badge_path} alt="" className="size-11 shrink-0 object-contain"/><div className="min-w-0"><p className="text-sm font-extrabold capitalize text-slate-900">{t(`leaderboard.league.${tier.tier_key}`)}</p><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{tier.tier_key}</p></div></div>
          <label className="text-xs font-bold text-slate-600">{t('admin.leagues.minimumXp')}<input type="number" min="0" step="100" inputMode="numeric" value={tier.minimum_xp} onChange={(event) => updateTier(tier.tier_key, { minimum_xp: event.target.value === '' ? '' : Number(event.target.value) })} className={`${INPUT_CLASS} mt-1`} aria-label={`${t('admin.leagues.minimumXp')} · ${tier.tier_key}`}/></label>
          <label className="inline-flex min-h-11 items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" checked={Boolean(tier.active)} onChange={(event) => updateTier(tier.tier_key, { active: event.target.checked })} className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"/>{t('admin.leagues.active')}</label>
        </div>)}
      </div>}
    </AdminCard>
    <p className="mt-3 flex items-start gap-2 px-1 text-[11px] leading-5 text-slate-500"><Trophy className="mt-0.5 size-4 shrink-0 text-indigo-500" aria-hidden="true"/>{t('admin.leagues.securityNote')}</p>
  </div>
}
