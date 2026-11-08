import { useMemo, useState } from 'react'
import { Ban, Search, SlidersHorizontal, UserRound, UserRoundPen } from 'lucide-react'
import { useI18n } from '../../lib/i18n.jsx'
import { AdminCard, AdminModal, AdminPageHeader, EmptyAdminState, Field, INPUT_CLASS, PrimaryButton, SecondaryButton } from './AdminShared'

const LEAGUES = ['all', 'Bronze', 'Silver', 'Gold']

function initials(name) {
  return String(name || '?').trim().split(/\s+/u).slice(0, 2).map((part) => part[0]?.toLocaleUpperCase()).join('') || '?'
}

export default function AdminUsers({ users = [], notify }) {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [league, setLeague] = useState('all')
  const [activeUser, setActiveUser] = useState(null)
  const [action, setAction] = useState('balance')
  const visibleUsers = useMemo(() => users.filter((user) => {
    const searchable = `${user.name || ''} ${user.email || ''}`.toLocaleLowerCase()
    return searchable.includes(query.toLocaleLowerCase()) && (league === 'all' || String(user.league || '').toLowerCase() === league.toLowerCase())
  }), [users, query, league])

  const openAction = (user, nextAction) => {
    setActiveUser(user)
    setAction(nextAction)
  }
  const submitAction = (event) => {
    event.preventDefault()
    notify(t(action === 'balance' ? 'admin.users.balanceNotSaved' : 'admin.users.suspendNotSaved'))
    setActiveUser(null)
  }

  return <div className="mx-auto max-w-7xl">
    <AdminPageHeader eyebrow={t('admin.users.eyebrow')} title={t('admin.users.title')} description={t('admin.users.description')} actions={<span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-500">{t('admin.data.pending')}</span>}/>
    <AdminCard>
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:p-5">
        <label className="relative min-w-0 flex-1"><span className="sr-only">{t('admin.users.search')}</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('admin.users.search')} className={`${INPUT_CLASS} pl-9`}/></label>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500"><SlidersHorizontal className="size-4" aria-hidden="true"/><span>{t('admin.users.filter')}</span><select value={league} onChange={(event) => setLeague(event.target.value)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10">{LEAGUES.map((item) => <option key={item} value={item}>{item === 'all' ? t('admin.users.allLeagues') : t(`admin.league.${item.toLowerCase()}`)}</option>)}</select></label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead><tr className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500">{['avatar', 'name', 'email', 'league', 'xp', 'gold', 'actions'].map((key) => <th key={key} className="px-4 py-3.5">{t(`admin.users.column.${key}`)}</th>)}</tr></thead>
          <tbody>{visibleUsers.length ? visibleUsers.map((user) => <tr key={user.id} className="border-t border-slate-100 text-sm">
            <td className="px-4 py-3.5">{user.avatar_url || user.avatarUrl ? <img src={user.avatar_url || user.avatarUrl} alt="" className="size-9 rounded-full object-cover"/> : <span className="grid size-9 place-items-center rounded-full bg-indigo-50 text-[10px] font-black text-indigo-700">{initials(user.name)}</span>}</td>
            <td className="px-4 py-3.5 font-bold text-slate-900">{user.name || '—'}</td><td className="px-4 py-3.5 text-slate-600">{user.email || '—'}</td><td className="px-4 py-3.5">{user.league || '—'}</td><td className="px-4 py-3.5 font-bold tabular-nums">{Number.isFinite(Number(user.totalXp ?? user.total_xp)) ? Number(user.totalXp ?? user.total_xp).toLocaleString() : '—'}</td><td className="px-4 py-3.5 font-bold tabular-nums">{Number.isFinite(Number(user.gold)) ? Number(user.gold).toLocaleString() : '—'}</td>
            <td className="px-4 py-3.5"><div className="flex gap-1.5"><button type="button" onClick={() => openAction(user, 'balance')} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50"><UserRoundPen className="size-3.5"/>{t('admin.users.editBalance')}</button><button type="button" onClick={() => openAction(user, 'suspend')} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-rose-200 px-2.5 text-[10px] font-bold text-rose-700 hover:bg-rose-50"><Ban className="size-3.5"/>{t('admin.users.suspend')}</button></div></td>
          </tr>) : <tr><td colSpan={7}><EmptyAdminState icon={UserRound} title={query || league !== 'all' ? t('admin.users.noMatch') : t('admin.users.noRecords')} description={t('admin.users.noData')}/></td></tr>}</tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-[10px] text-slate-400 sm:px-5"><span>{t('admin.pagination.awaiting')}</span><div className="flex gap-2"><button type="button" disabled className="min-h-9 rounded-lg border border-slate-200 px-3 font-bold disabled:opacity-40">{t('admin.pagination.previous')}</button><button type="button" disabled className="min-h-9 rounded-lg border border-slate-200 px-3 font-bold disabled:opacity-40">{t('admin.pagination.next')}</button></div></div>
    </AdminCard>

    <AdminModal open={Boolean(activeUser)} title={action === 'balance' ? t('admin.users.balanceTitle') : t('admin.users.suspendTitle')} closeLabel={t('admin.common.close')} onClose={() => setActiveUser(null)} footer={<><SecondaryButton type="button" onClick={() => setActiveUser(null)}>{t('admin.common.cancel')}</SecondaryButton><PrimaryButton type="submit" form="admin-user-action">{action === 'balance' ? t('admin.users.editBalance') : t('admin.users.suspend')}</PrimaryButton></>}>
      <form id="admin-user-action" onSubmit={submitAction} className="space-y-4">
        <p className="text-sm text-slate-600">{activeUser?.name} · {activeUser?.email}</p>
        {action === 'balance' ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Field label={t('admin.users.bonusGold')}><input className={INPUT_CLASS} name="gold" type="number" min="0" max="1000000" defaultValue="0"/></Field><Field label={t('admin.users.bonusXp')}><input className={INPUT_CLASS} name="xp" type="number" min="0" max="1000000" defaultValue="0"/></Field></div> : <p className="rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-3 text-xs leading-5 text-rose-800">{t('admin.users.suspendConfirm')}</p>}
        <p className="text-[11px] leading-5 text-amber-800">{t(action === 'balance' ? 'admin.users.balanceNotSaved' : 'admin.users.suspendNotSaved')}</p>
      </form>
    </AdminModal>
  </div>
}
