import { useState } from 'react'
import { AudioLines, FilePlus2, Headphones, Mic, PenLine, Plus, Trash2 } from 'lucide-react'
import { useI18n } from '../../lib/i18n.jsx'
import { AdminCard, AdminPageHeader, Field, INPUT_CLASS, PrimaryButton, SessionDraftTag, UploadInput } from './AdminShared'

const EXAM_TABS = [
  { id: 'quiz', icon: FilePlus2 },
  { id: 'listening', icon: Headphones },
  { id: 'writing', icon: PenLine },
  { id: 'speaking', icon: Mic },
]

export default function AdminExams({ notify }) {
  const { t } = useI18n()
  const [tab, setTab] = useState('quiz')
  const [correct, setCorrect] = useState('0')
  const [drafts, setDrafts] = useState([])

  const saveDraft = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const question = String(data.get('question') || '').trim()
    const listeningQuestions = String(data.get('audioQuestions') || '').trim()
    const prompt = String(data.get('prompt') || '').trim()
    const title = tab === 'quiz' ? question : tab === 'listening' ? listeningQuestions.slice(0, 120) : String(data.get('promptTitle') || '').trim() || prompt.slice(0, 120)
    if (!title) return
    const draft = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: tab,
      title,
      question,
      options: tab === 'quiz' ? [0, 1, 2, 3].map((index) => String(data.get(`option-${index}`) || '').trim()) : [],
      correct: tab === 'quiz' ? Number(correct) : null,
      listeningQuestions,
      prompt,
      minimum: Number(data.get('minimum')) || null,
      xp: Number(data.get('xp')) || 0,
      audio: data.get('audio')?.name || '',
      audioFile: data.get('audio') instanceof File ? data.get('audio') : null,
    }
    setDrafts((previous) => [...previous, draft])
    form.reset()
    setCorrect('0')
    notify(t('admin.draft.examAdded'))
  }

  return <div className="mx-auto max-w-7xl">
    <AdminPageHeader eyebrow={t('admin.exams.eyebrow')} title={t('admin.exams.title')} description={t('admin.exams.description')} actions={<SessionDraftTag>{t('admin.draft.localTag')}</SessionDraftTag>}/>
    <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-900">{t('admin.draft.sessionOnly')}</div>
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,.9fr)]">
      <AdminCard>
        <div role="tablist" aria-label={t('admin.exams.tabs.label')} className="flex gap-1 overflow-x-auto border-b border-slate-100 p-2">
          {EXAM_TABS.map(({ id, icon: Icon }) => <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-bold transition ${tab === id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}><Icon className="size-4" aria-hidden="true"/>{t(`admin.exams.tab.${id}`)}</button>)}
        </div>
        <form onSubmit={saveDraft} className="space-y-4 p-4 sm:p-5">
          {tab === 'quiz' && <>
            <Field label={t('admin.exams.quiz.question')}><textarea className={`${INPUT_CLASS} min-h-24 resize-y`} name="question" required maxLength={1000}/></Field>
            <div className="space-y-3">{[0, 1, 2, 3].map((index) => <div key={index} className="flex items-center gap-3"><input type="radio" name="correct-option" value={index} checked={correct === String(index)} onChange={(event) => setCorrect(event.target.value)} aria-label={t('admin.exams.quiz.markCorrect', { count: index + 1 })} className="size-4 accent-indigo-600"/><input name={`option-${index}`} required maxLength={240} className={INPUT_CLASS} placeholder={t('admin.exams.quiz.option', { count: index + 1 })}/></div>)}</div>
            <p className="text-[11px] text-slate-500">{t('admin.exams.quiz.correctHint')}</p>
          </>}
          {tab === 'listening' && <>
            <UploadInput label={t('admin.exams.listening.audio')} name="audio" accept="audio/mpeg,.mp3,audio/mp3,audio/wav" kind="audio" required chooseLabel={t('admin.upload.choose')}/>
            <Field label={t('admin.exams.listening.questions')} hint={t('admin.exams.listening.hint')}><textarea className={`${INPUT_CLASS} min-h-40 resize-y`} name="audioQuestions" required maxLength={3000} placeholder={t('admin.exams.listening.placeholder')}/></Field>
          </>}
          {(tab === 'writing' || tab === 'speaking') && <>
            <Field label={t('admin.exams.prompt.title')}><input className={INPUT_CLASS} name="promptTitle" maxLength={160} placeholder={t('admin.exams.prompt.titlePlaceholder')}/></Field>
            <Field label={t('admin.exams.prompt.body')}><textarea className={`${INPUT_CLASS} min-h-36 resize-y`} name="prompt" required maxLength={3000} placeholder={t('admin.exams.prompt.placeholder')}/></Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{tab === 'writing' ? <Field label={t('admin.exams.prompt.minWords')}><input className={INPUT_CLASS} name="minimum" type="number" min="1" max="10000" defaultValue="150"/></Field> : <Field label={t('admin.exams.prompt.minSeconds')}><input className={INPUT_CLASS} name="minimum" type="number" min="1" max="3600" defaultValue="30"/></Field>}<Field label={t('admin.exams.prompt.xp')}><input className={INPUT_CLASS} name="xp" type="number" min="0" max="10000" defaultValue="0"/></Field></div>
          </>}
          <div className="flex justify-end border-t border-slate-100 pt-4"><PrimaryButton type="submit"><Plus className="size-4" aria-hidden="true"/>{t('admin.common.saveDraft')}</PrimaryButton></div>
        </form>
      </AdminCard>

      <AdminCard title={t('admin.exams.drafts.title')} description={t('admin.exams.drafts.description')}>
        {drafts.length ? <div className="divide-y divide-slate-100">{drafts.map((draft) => { const Icon = EXAM_TABS.find((item) => item.id === draft.type)?.icon || AudioLines; return <div key={draft.id} className="flex items-start gap-3 px-4 py-4"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><Icon className="size-4" aria-hidden="true"/></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="line-clamp-2 text-xs font-bold text-slate-800">{draft.title}</p><SessionDraftTag>{t('admin.draft.localTag')}</SessionDraftTag></div>{draft.audio && <p className="mt-1 truncate text-[10px] text-slate-500">{draft.audio}</p>}</div><button type="button" onClick={() => setDrafts((previous) => previous.filter((item) => item.id !== draft.id))} aria-label={t('admin.common.removeDraft')} className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="size-4" aria-hidden="true"/></button></div>})}</div> : <div className="p-3"><p className="sr-only">{t('admin.exams.drafts.title')}</p><p className="px-4 py-8 text-center text-xs leading-5 text-slate-500">{t('admin.exams.drafts.empty')}</p></div>}
      </AdminCard>
    </div>
  </div>
}
