import { useState } from 'react'
import { Bell, Plus, Trash2 } from 'lucide-react'
import { useI18n } from '../../lib/i18n.jsx'
import { AdminCard, AdminModal, AdminPageHeader, EmptyAdminState, Field, INPUT_CLASS, PrimaryButton, SecondaryButton, SessionDraftTag } from './AdminShared'

export default function AdminNotifications({ notify }) {
  const { t } = useI18n()
  const [drafts, setDrafts] = useState([])
  const [composerOpen, setComposerOpen] = useState(false)

  const addDraft = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const draft = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: String(data.get('title') || '').trim(),
      message: String(data.get('message') || '').trim(),
    }
    setDrafts((current) => [draft, ...current])
    setComposerOpen(false)
    event.currentTarget.reset()
    notify?.(t('admin.notifications.added'))
  }

  const removeDraft = (id) => setDrafts((current) => current.filter((draft) => draft.id !== id))

  return <div className="mx-auto max-w-4xl">
    <AdminPageHeader
      eyebrow={t('admin.notifications.eyebrow')}
      title={t('admin.notifications.title')}
      description={t('admin.notifications.description')}
      actions={<><SessionDraftTag>{t('admin.draft.localTag')}</SessionDraftTag><PrimaryButton type="button" onClick={() => setComposerOpen(true)}><Plus className="size-4" aria-hidden="true"/>{t('admin.notifications.add')}</PrimaryButton></>}
    />
    <AdminCard title={t('admin.notifications.title')} description={t('admin.notifications.localOnly')}>
      {drafts.length === 0 ? (
        <EmptyAdminState
          icon={Bell}
          title={t('admin.notifications.emptyTitle')}
          description={t('admin.notifications.emptyDescription')}
          action={<PrimaryButton type="button" onClick={() => setComposerOpen(true)}><Plus className="size-4" aria-hidden="true"/>{t('admin.notifications.add')}</PrimaryButton>}
        />
      ) : (
        <div className="divide-y divide-slate-100">
          {drafts.map((draft) => (
            <article key={draft.id} className="flex items-start gap-3 px-4 py-4 sm:px-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><Bell className="size-4" aria-hidden="true"/></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><h3 className="break-words font-bold text-slate-900">{draft.title}</h3><SessionDraftTag>{t('admin.draft.localTag')}</SessionDraftTag></div>
                {draft.message && <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">{draft.message}</p>}
              </div>
              <button type="button" onClick={() => removeDraft(draft.id)} aria-label={t('admin.common.removeDraft')} className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><Trash2 className="size-4" aria-hidden="true"/></button>
            </article>
          ))}
        </div>
      )}
    </AdminCard>

    <AdminModal
      open={composerOpen}
      title={t('admin.notifications.add')}
      closeLabel={t('admin.common.close')}
      onClose={() => setComposerOpen(false)}
      footer={<><SecondaryButton type="button" onClick={() => setComposerOpen(false)}>{t('admin.common.cancel')}</SecondaryButton><PrimaryButton type="submit" form="admin-notification-form">{t('admin.common.saveDraft')}</PrimaryButton></>}
    >
      <form id="admin-notification-form" onSubmit={addDraft} className="space-y-4">
        <Field label={t('admin.notifications.field.title')}>
          <input autoFocus className={INPUT_CLASS} name="title" required maxLength={120} placeholder={t('admin.notifications.field.titlePlaceholder')}/>
        </Field>
        <Field label={t('admin.notifications.field.message')}>
          <textarea className={`${INPUT_CLASS} min-h-28 resize-y`} name="message" maxLength={1000} placeholder={t('admin.notifications.field.messagePlaceholder')}/>
        </Field>
        <p className="text-xs leading-5 text-amber-800">{t('admin.notifications.localOnly')}</p>
      </form>
    </AdminModal>
  </div>
}
