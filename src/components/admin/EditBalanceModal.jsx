import { useState } from 'react'
import { Save } from 'lucide-react'
import { useI18n } from '../../lib/i18n.jsx'
import { AdminModal, Field, INPUT_CLASS, PrimaryButton, SecondaryButton } from './AdminShared'

const MAX_BALANCE = 2147483647

export default function EditBalanceModal({ user, onClose, onSave, saving = false }) {
  const { t } = useI18n()
  const [values, setValues] = useState({
    totalXp: String(user?.total_xp ?? user?.totalXp ?? 0),
    gold: String(user?.gold ?? 0),
    gems: String(user?.gems ?? 0),
  })

  const update = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    onSave({
      totalXp: Number(values.totalXp),
      gold: Number(values.gold),
      gems: Number(values.gems),
    })
  }

  return <AdminModal
    open={Boolean(user)}
    title={t('admin.users.balanceTitle')}
    closeLabel={t('admin.common.close')}
    onClose={onClose}
    footer={<><SecondaryButton type="button" onClick={onClose} disabled={saving}>{t('admin.common.cancel')}</SecondaryButton><PrimaryButton type="submit" form="admin-user-balance-form" disabled={saving}><Save className="size-4" aria-hidden="true"/>{saving ? t('admin.users.saving') : t('admin.common.save')}</PrimaryButton></>}
  >
    <form id="admin-user-balance-form" onSubmit={submit} className="space-y-4">
      <div className="rounded-lg bg-slate-50 px-3.5 py-3"><p className="text-sm font-semibold text-slate-900">{user?.name}</p><p className="mt-0.5 text-xs text-slate-500">{user?.email}</p></div>
      <Field label={t('admin.users.column.xp')}><input className={INPUT_CLASS} name="totalXp" type="number" min="0" max={MAX_BALANCE} step="1" value={values.totalXp} onChange={update} required/></Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t('admin.users.column.gold')}><input className={INPUT_CLASS} name="gold" type="number" min="0" max={MAX_BALANCE} step="1" value={values.gold} onChange={update} required/></Field>
        <Field label={t('admin.users.column.gems')}><input className={INPUT_CLASS} name="gems" type="number" min="0" max={MAX_BALANCE} step="1" value={values.gems} onChange={update} required/></Field>
      </div>
    </form>
  </AdminModal>
}
