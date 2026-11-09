import { useCallback, useEffect, useMemo, useState } from 'react'
import { LoaderCircle, Pencil, RefreshCw, Search, SlidersHorizontal, UserRound } from 'lucide-react'
import { useI18n } from '../../lib/i18n.jsx'
import { fetchAdminUsers, updateAdminUserBalance } from '../../lib/supabase.js'
import { AdminCard, AdminPageHeader, EmptyAdminState, INPUT_CLASS, SecondaryButton } from './AdminShared'
import EditBalanceModal from './EditBalanceModal'

const LEAGUES = ['all', 'Bronze', 'Silver', 'Gold']

function initials(name) {
  return String(name || '?').trim().split(/\s+/u).slice(0, 2).map((part) => part[0]?.toLocaleUpperCase()).join('') || '?'
}

function formatNumber(value) {
  return Math.max(0, Number(value) || 0).toLocaleString()
}

export default function AdminUsers({ notify, active = true }) {
  const { t } = useI18n()
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [league, setLeague] = useState('all')
  const [activeUser, setActiveUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError(false)
    try {
      const rows = await fetchAdminUsers()
      setUsers(rows)
    } catch {
      setError(true)
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (active) void refresh()
  }, [active, refresh])

  const visibleUsers = useMemo(() => users.filter((user) => {
    const searchable = `${user.name || ''} ${user.email || ''}`.toLocaleLowerCase()
    return searchable.includes(query.toLocaleLowerCase()) && (league === 'all' || String(user.league || '').toLowerCase() === league.toLowerCase())
  }), [users, query, league])

  const saveBalance = async (balances) => {
    if (!activeUser) return
    setSaving(true)
    try {
      const updated = await updateAdminUserBalance(activeUser.id, balances)
      setUsers((current) => current.map((user) => user.id === updated.id ? { ...user, ...updated } : user))
      setActiveUser(null)
      notify?.(t('admin.users.balanceUpdated'))
      void refresh(true)
    } catch {
      notify?.(t('admin.users.balanceUpdateError'))
    } finally {
      setSaving(false)
    }
  }

  return <div className="mx-auto max-w-7xl">
    <AdminPageHeader
      eyebrow={t('admin.users.eyebrow')}
      title={t('admin.users.title')}
      description={t('admin.users.description')}
      actions={<SecondaryButton type="button" onClick={() => refresh()} disabled={loading}><RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true"/>{t('admin.users.refresh')}</SecondaryButton>}
    />
    <AdminCard>
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:p-5">
        <label className="relative min-w-0 flex-1"><span className="sr-only">{t('admin.users.search')}</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('admin.users.search')} className={`${INPUT_CLASS} pl-9`}/></label>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500"><SlidersHorizontal className="size-4" aria-hidden="true"/><span>{t('admin.users.filter')}</span><select value={league} onChange={(event) => setLeague(event.target.value)} className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">{LEAGUES.map((item) => <option key={item} value={item}>{item === 'all' ? t('admin.users.allLeagues') : t(`admin.league.${item.toLowerCase()}`)}</option>)}</select></label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1020px] border-collapse text-left">
          <thead><tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">{['avatar', 'name', 'email', 'league', 'xp', 'gold', 'gems', 'actions'].map((key) => <th key={key} className="px-4 py-3.5">{t(`admin.users.column.${key}`)}</th>)}</tr></thead>
          <tbody>{visibleUsers.length ? visibleUsers.map((user) => <tr key={user.id} className="border-t border-slate-100 text-sm hover:bg-slate-50/70">
            <td className="px-4 py-3.5">{user.avatar_url ? <img src={user.avatar_url} alt="" className="size-9 rounded-full object-cover"/> : <span className="grid size-9 place-items-center rounded-full bg-indigo-50 text-[10px] font-black text-indigo-700">{initials(user.name)}</span>}</td>
            <td className="px-4 py-3.5 font-bold text-slate-900">{user.name || '—'}</td>
            <td className="px-4 py-3.5 text-slate-600">{user.email || '—'}</td>
            <td className="px-4 py-3.5 text-slate-600">{user.league || '—'}</td>
            <td className="px-4 py-3.5 font-bold tabular-nums text-slate-800">{formatNumber(user.total_xp)}</td>
            <td className="px-4 py-3.5 font-bold tabular-nums text-slate-800">{formatNumber(user.gold)}</td>
            <td className="px-4 py-3.5 font-bold tabular-nums text-slate-800">{formatNumber(user.gems)}</td>
            <td className="px-4 py-3.5"><button type="button" onClick={() => setActiveUser(user)} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label={`${t('admin.users.edit')}: ${user.name}`}><Pencil className="size-3.5" aria-hidden="true"/>{t('admin.users.edit')}</button></td>
          </tr>) : loading ? <tr><td colSpan={8}><div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500"><LoaderCircle className="size-4 animate-spin text-indigo-500" aria-hidden="true"/>{t('admin.dashboard.loading')}</div></td></tr> : error ? <tr><td colSpan={8}><EmptyAdminState icon={UserRound} title={t('admin.users.fetchError')} description={t('admin.users.retryDescription')} action={<button type="button" onClick={() => refresh()} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">{t('admin.dashboard.retry')}</button>}/></td></tr> : <tr><td colSpan={8}><EmptyAdminState icon={UserRound} title={query || league !== 'all' ? t('admin.users.noMatch') : t('admin.users.noRecords')} description={t('admin.users.noData')}/></td></tr>}</tbody>
        </table>
      </div>
    </AdminCard>

    {activeUser && <EditBalanceModal key={activeUser.id} user={activeUser} onClose={() => setActiveUser(null)} onSave={saveBalance} saving={saving}/>}
  </div>
}
