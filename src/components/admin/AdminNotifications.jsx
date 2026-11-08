import { useState } from 'react'
import { BellRing, Send } from 'lucide-react'
import { useI18n } from '../../lib/i18n.jsx'
import { AdminCard, AdminPageHeader, Field, INPUT_CLASS, PrimaryButton } from './AdminShared'

export default function AdminNotifications({ notify }) {
  const { t } = useI18n()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [attempted, setAttempted] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    setAttempted(true)
    notify(t('admin.notifications.notSent'))
  }

  return <div className="mx-auto max-w-4xl">
    <AdminPageHeader eyebrow={t('admin.notifications.eyebrow')} title={t('admin.notifications.title')} description={t('admin.notifications.description')}/>
    <AdminCard title={t('admin.notifications.compose.title')} description={t('admin.notifications.compose.description')}>
      <form onSubmit={submit} className="space-y-5 p-4 sm:p-6">
        <Field label={t('admin.notifications.field.title')}><input value={title} onChange={(event) => setTitle(event.target.value)} className={INPUT_CLASS} required maxLength={120} placeholder={t('admin.notifications.field.titlePlaceholder')}/></Field>
        <Field label={t('admin.notifications.field.message')} hint={t('admin.notifications.field.hint')}><textarea value={body} onChange={(event) => setBody(event.target.value)} className={`${INPUT_CLASS} min-h-40 resize-y`} required maxLength={2000} placeholder={t('admin.notifications.field.messagePlaceholder')}/></Field>
        <div className="flex flex-col justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center"><p className="max-w-lg text-[11px] leading-5 text-slate-500">{t('admin.notifications.noBackend')}</p><PrimaryButton type="submit"><Send className="size-4" aria-hidden="true"/>{t('admin.notifications.sendAll')}</PrimaryButton></div>
        {attempted && <p role="status" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-900"><BellRing className="mt-0.5 size-4 shrink-0" aria-hidden="true"/>{t('admin.notifications.notSent')}</p>}
      </form>
    </AdminCard>
  </div>
}
