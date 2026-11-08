import { useMemo, useState } from 'react'
import { Plus, Search, Trash2, Volume2 } from 'lucide-react'
import { useI18n } from '../../lib/i18n.jsx'
import { AdminCard, AdminModal, AdminPageHeader, EmptyAdminState, Field, INPUT_CLASS, PrimaryButton, SecondaryButton, SessionDraftTag, UploadInput } from './AdminShared'

export default function AdminVocabulary({ notify }) {
  const { t } = useI18n()
  const [words, setWords] = useState([])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const visibleWords = useMemo(() => words.filter((word) => `${word.tr} ${word.uz}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [words, query])

  const addWord = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const row = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      tr: String(data.get('tr') || '').trim(),
      uz: String(data.get('uz') || '').trim(),
      audio: data.get('audio')?.name || '',
      image: data.get('image')?.name || '',
      audioFile: data.get('audio') instanceof File ? data.get('audio') : null,
      imageFile: data.get('image') instanceof File ? data.get('image') : null,
    }
    setWords((previous) => [...previous, row])
    form.reset()
    setOpen(false)
    notify(t('admin.draft.wordAdded'))
  }

  return <div className="mx-auto max-w-7xl">
    <AdminPageHeader eyebrow={t('admin.vocabulary.eyebrow')} title={t('admin.vocabulary.title')} description={t('admin.vocabulary.description')} actions={<PrimaryButton type="button" onClick={() => setOpen(true)}><Plus className="size-4" aria-hidden="true"/>{t('admin.vocabulary.addWord')}</PrimaryButton>}/>
    <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-900"><SessionDraftTag>{t('admin.draft.localTag')}</SessionDraftTag><span>{t('admin.upload.localNote')}</span></div>
    <AdminCard>
      <div className="border-b border-slate-100 p-4 sm:p-5"><label className="relative block max-w-md"><span className="sr-only">{t('admin.vocabulary.search')}</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('admin.vocabulary.search')} className={`${INPUT_CLASS} pl-9`}/></label></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[700px] border-collapse text-left"><thead><tr className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500"><th className="px-4 py-3.5">{t('admin.vocabulary.column.tr')}</th><th className="px-4 py-3.5">{t('admin.vocabulary.column.uz')}</th><th className="px-4 py-3.5">{t('admin.vocabulary.column.audio')}</th><th className="px-4 py-3.5">{t('admin.vocabulary.column.image')}</th><th className="px-4 py-3.5">{t('admin.vocabulary.column.actions')}</th></tr></thead>
        <tbody>{visibleWords.length ? visibleWords.map((word) => <tr key={word.id} className="border-t border-slate-100 text-sm"><td className="px-4 py-3.5 font-bold text-slate-900">{word.tr}</td><td className="px-4 py-3.5 text-slate-600">{word.uz}</td><td className="px-4 py-3.5 text-xs text-slate-500">{word.audio || '—'}</td><td className="px-4 py-3.5 text-xs text-slate-500">{word.image || '—'}</td><td className="px-4 py-3.5"><button type="button" onClick={() => setWords((previous) => previous.filter((item) => item.id !== word.id))} aria-label={t('admin.common.removeDraft')} className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="size-4" aria-hidden="true"/></button></td></tr>) : <tr><td colSpan={5}><EmptyAdminState icon={Volume2} title={query ? t('admin.vocabulary.noMatch') : t('admin.vocabulary.noWords')} description={t('admin.vocabulary.noWordsDescription')}/></td></tr>}</tbody>
      </table></div>
      <div className="border-t border-slate-100 px-4 py-3 text-[10px] text-slate-400">{t('admin.pagination.awaiting')}</div>
    </AdminCard>

    <AdminModal open={open} title={t('admin.vocabulary.addWord')} closeLabel={t('admin.common.close')} onClose={() => setOpen(false)} footer={<><SecondaryButton type="button" onClick={() => setOpen(false)}>{t('admin.common.cancel')}</SecondaryButton><PrimaryButton type="submit" form="admin-word-form">{t('admin.common.saveDraft')}</PrimaryButton></>}>
      <form id="admin-word-form" onSubmit={addWord} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Field label={t('admin.vocabulary.field.tr')}><input className={INPUT_CLASS} name="tr" required maxLength={100}/></Field><Field label={t('admin.vocabulary.field.uz')}><input className={INPUT_CLASS} name="uz" required maxLength={160}/></Field></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><UploadInput label={t('admin.vocabulary.field.audio')} name="audio" accept="audio/mpeg,.mp3,audio/mp3" kind="audio" chooseLabel={t('admin.upload.choose')}/><UploadInput label={t('admin.vocabulary.field.image')} name="image" accept="image/*" kind="image" chooseLabel={t('admin.upload.choose')}/></div>
        <p className="text-[11px] leading-5 text-slate-500">{t('admin.upload.localNote')}</p>
      </form>
    </AdminModal>
  </div>
}
