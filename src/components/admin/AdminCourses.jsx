import { useMemo, useState } from 'react'
import { BookOpen, MapPinned, Plus, Trash2 } from 'lucide-react'
import { useI18n } from '../../lib/i18n.jsx'
import { AdminCard, AdminModal, AdminPageHeader, EmptyAdminState, Field, INPUT_CLASS, PrimaryButton, SecondaryButton, SessionDraftTag } from './AdminShared'

const STARTER_CITIES = [
  { id: 'istanbul', name: 'Istanbul', sample: true },
  { id: 'bursa', name: 'Bursa', sample: true },
]

const LESSON_TYPES = ['vocabulary', 'listening', 'speaking']

export default function AdminCourses({ notify }) {
  const { t } = useI18n()
  const [cities, setCities] = useState(STARTER_CITIES)
  const [selectedCity, setSelectedCity] = useState('istanbul')
  const [lessons, setLessons] = useState([])
  const [lessonOpen, setLessonOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [newCity, setNewCity] = useState('')
  const currentCity = cities.find((city) => city.id === selectedCity) || cities[0]
  const currentLessons = useMemo(() => lessons.filter((lesson) => lesson.cityId === selectedCity), [lessons, selectedCity])

  const addLesson = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const lesson = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      cityId: selectedCity,
      title: String(data.get('title') || '').trim(),
      type: String(data.get('type') || 'vocabulary'),
      xp: Math.max(0, Number(data.get('xp')) || 0),
      minutes: Math.max(1, Number(data.get('minutes')) || 1),
    }
    setLessons((previous) => [...previous, lesson])
    setLessonOpen(false)
    event.currentTarget.reset()
    notify(t('admin.draft.lessonAdded'))
  }

  const addCity = (event) => {
    event.preventDefault()
    const name = newCity.trim()
    if (!name) return
    const id = `${name.toLocaleLowerCase().replace(/[^a-z0-9]+/gu, '-')}-${Date.now()}`
    setCities((previous) => [...previous, { id, name, sample: false }])
    setSelectedCity(id)
    setNewCity('')
    setCityOpen(false)
    notify(t('admin.draft.cityAdded'))
  }

  const removeLesson = (lessonId) => setLessons((previous) => previous.filter((lesson) => lesson.id !== lessonId))

  return <div className="mx-auto max-w-7xl">
    <AdminPageHeader eyebrow={t('admin.courses.eyebrow')} title={t('admin.courses.title')} description={t('admin.courses.description')} actions={<><SessionDraftTag>{t('admin.draft.localTag')}</SessionDraftTag><SecondaryButton type="button" onClick={() => setCityOpen(true)}><MapPinned className="size-4" aria-hidden="true"/>{t('admin.courses.addCity')}</SecondaryButton><PrimaryButton type="button" onClick={() => setLessonOpen(true)}><Plus className="size-4" aria-hidden="true"/>{t('admin.courses.addLesson')}</PrimaryButton></>}/>
    <div className="mb-5 flex gap-2 overflow-x-auto pb-1">{cities.map((city) => <button key={city.id} type="button" aria-pressed={selectedCity === city.id} onClick={() => setSelectedCity(city.id)} className={`min-h-11 shrink-0 rounded-xl border px-4 text-sm font-bold transition ${selectedCity === city.id ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>{city.name}</button>)}</div>

    <AdminCard title={currentCity?.name || t('admin.courses.title')} description={t('admin.courses.cityDescription', { count: currentLessons.length })}>
      {currentLessons.length ? <div className="divide-y divide-slate-100">{currentLessons.map((lesson) => <article key={lesson.id} className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-5"><span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><BookOpen className="size-4" aria-hidden="true"/></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-slate-900">{lesson.title}</h3><SessionDraftTag>{t('admin.draft.localTag')}</SessionDraftTag></div><p className="mt-1 text-xs text-slate-500">{t(`admin.courses.type.${lesson.type}`)} · {t('admin.courses.lessonMeta', { xp: lesson.xp, minutes: lesson.minutes })}</p></div><button type="button" onClick={() => removeLesson(lesson.id)} aria-label={t('admin.common.removeDraft')} className="grid size-10 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="size-4" aria-hidden="true"/></button></article>)}</div> : <EmptyAdminState icon={BookOpen} title={t('admin.courses.noLessons')} description={t('admin.courses.noLessonsDescription')}/>}
    </AdminCard>

    <AdminModal open={lessonOpen} title={t('admin.courses.addLesson')} closeLabel={t('admin.common.close')} onClose={() => setLessonOpen(false)} footer={<><SecondaryButton type="button" onClick={() => setLessonOpen(false)}>{t('admin.common.cancel')}</SecondaryButton><PrimaryButton type="submit" form="admin-lesson-form">{t('admin.common.saveDraft')}</PrimaryButton></>}>
      <form id="admin-lesson-form" onSubmit={addLesson} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t('admin.courses.field.title')} className="sm:col-span-2"><input className={INPUT_CLASS} name="title" required maxLength={120} placeholder={t('admin.courses.field.titlePlaceholder')}/></Field>
        <Field label={t('admin.courses.field.type')}><select name="type" className={INPUT_CLASS}>{LESSON_TYPES.map((type) => <option key={type} value={type}>{t(`admin.courses.type.${type}`)}</option>)}</select></Field>
        <Field label={t('admin.courses.field.xp')}><input className={INPUT_CLASS} name="xp" type="number" min="0" max="10000" step="1" defaultValue="0" required/></Field>
        <Field label={t('admin.courses.field.minutes')}><input className={INPUT_CLASS} name="minutes" type="number" min="1" max="600" defaultValue="10" required/></Field>
        <p className="self-center text-[11px] leading-5 text-slate-500">{t('admin.draft.sessionOnly')}</p>
      </form>
    </AdminModal>

    <AdminModal open={cityOpen} title={t('admin.courses.addCity')} closeLabel={t('admin.common.close')} onClose={() => setCityOpen(false)} footer={<><SecondaryButton type="button" onClick={() => setCityOpen(false)}>{t('admin.common.cancel')}</SecondaryButton><PrimaryButton type="submit" form="admin-city-form">{t('admin.common.saveDraft')}</PrimaryButton></>}>
      <form id="admin-city-form" onSubmit={addCity}><Field label={t('admin.courses.cityName')}><input autoFocus className={INPUT_CLASS} value={newCity} onChange={(event) => setNewCity(event.target.value)} required maxLength={60} placeholder={t('admin.courses.cityPlaceholder')}/></Field><p className="mt-3 text-[11px] text-slate-500">{t('admin.draft.sessionOnly')}</p></form>
    </AdminModal>
  </div>
}
