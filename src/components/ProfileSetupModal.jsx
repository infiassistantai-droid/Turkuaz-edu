import { useEffect, useState } from 'react'
import { GraduationCap, User, Users, Target, X, Check, Sparkles, ShieldCheck } from 'lucide-react'
import { cn } from '../lib/utils'

// Target levels offered at sign-up
const LEVELS = [
  { id: 'B1', label: 'B1', title: 'Asosiy daraja', desc: 'Milliy Sertifikat B1 topshirishga tayyorlanadi' },
  { id: 'B2', label: 'B2', title: 'Oʻrta daraja', desc: 'Milliy Sertifikat B2 sertifikatiga tayyor' },
  { id: 'C1', label: 'C1', title: 'Maksimal daraja', desc: 'OTMga 100% ball uchun maksimal tayyorgarlik' },
]

/**
 * First-run auth modal: "Roʻyxatdan oʻtish / Kirish".
 *   mode="signup" → registration form (name, surname, target level)
 *   mode="edit"   → edit existing profile (prefilled, tabs hidden)
 */
export default function ProfileSetupModal({ open, mode = 'signup', profile, hasProfile, onClose, onSave }) {
  const [tab, setTab] = useState('signup')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [level, setLevel] = useState('B2')
  const [error, setError] = useState('')

  const isEdit = mode === 'edit'

  // Reset the form whenever the modal opens
  useEffect(() => {
    if (!open) return
    setError('')
    if (isEdit && profile) {
      setTab('signup')
      setName(profile.name || '')
      setSurname(profile.surname || '')
      setLevel(profile.targetLevel || 'B2')
    } else {
      setTab('signup')
      setName('')
      setSurname('')
      setLevel('B2')
    }
  }, [open, isEdit, profile])

  if (!open) return null

  const submit = (e) => {
    e.preventDefault()
    const n = name.trim()
    const s = surname.trim()
    if (!n || !s) {
      setError('Iltimos, ism va familyani toʻliq kiriting')
      return
    }
    onSave({ name: n, surname: s, targetLevel: level })
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-fadein"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* card — bottom sheet on mobile, centered modal on desktop */}
      <div className="relative w-full max-w-md animate-slideup rounded-t-3xl border border-slate-200/80 bg-white/95 p-6 shadow-2xl sm:animate-pop sm:rounded-3xl">
        {/* header */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 opacity-60 blur-md" aria-hidden="true" />
            <div className="relative grid size-10 place-items-center rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white ring-1 ring-white/20">
              <GraduationCap className="size-5" aria-hidden="true" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
              {isEdit ? 'Profilni tahrirlash' : 'Roʻyxatdan oʻtish / Kirish'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Türkçe Marathon — Milliy Sertifikat (B1 · B2 · C1)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="grid size-9 place-items-center rounded-xl border border-slate-200/80 text-slate-500 transition-all active:scale-95 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* tabs */}
        {!isEdit && (
          <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {[
              ['signup', 'Roʻyxatdan oʻtish'],
              ['login', 'Kirish'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  'rounded-lg py-2 text-sm font-bold transition-all',
                  tab === id
                    ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* signup / edit form */}
        {tab === 'signup' && (
          <form onSubmit={submit} className="mt-5 space-y-4">
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <User className="size-3.5" /> Ism
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ismingiz (masalan, Aziz)"
                  autoComplete="given-name"
                  className="h-11 w-full rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Users className="size-3.5" /> Familya
                </span>
                <input
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Familyangiz (masalan, Karimov)"
                  autoComplete="family-name"
                  className="h-11 w-full rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white"
                />
              </label>
            </div>

            {/* target level */}
            <div>
              <span className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Target className="size-3.5" /> Maqsad darajasi
              </span>
              <div className="space-y-2">
                {LEVELS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLevel(l.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all active:scale-[0.98]',
                      level === l.id
                        ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 ring-2 ring-teal-500/30 dark:from-teal-950/40 dark:to-cyan-950/40'
                        : 'border-slate-200/80 bg-white hover:border-teal-300 dark:border-slate-800 dark:bg-slate-800/60',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-10 shrink-0 place-items-center rounded-xl font-display text-sm font-extrabold tracking-wider',
                        level === l.id
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-md shadow-teal-900/20'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
                      )}
                    >
                      {l.label}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-extrabold text-slate-800 dark:text-white">{l.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{l.desc}</div>
                    </div>
                    <Check
                      className={cn(
                        'size-4 shrink-0',
                        level === l.id ? 'text-teal-600 dark:text-teal-400' : 'opacity-0',
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/20 transition-all active:scale-[0.98] hover:from-teal-700 hover:to-cyan-600"
            >
              <Sparkles className="size-4" />
              {isEdit ? 'Oʻzgarishlarni saqlash' : 'Roʻyxatdan oʻtish'}
            </button>

            <p className="flex items-start gap-1.5 text-center text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
              Maʼlumotlar faqat bu qurilmangizda saqlanadi — server yoki baza yoʻq. Hech narsa yuborilmaydi.
            </p>
          </form>
        )}

        {/* login tab */}
        {tab === 'login' && (
          <div className="mt-6 space-y-4">
            {hasProfile ? (
              <>
                <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 p-5 text-center dark:from-teal-950/40 dark:to-cyan-950/40">
                  <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 font-display text-lg font-extrabold text-white shadow-lg shadow-teal-900/20">
                    {(profile?.name || '?').charAt(0)}
                    {(profile?.surname || '').charAt(0)}
                  </div>
                  <p className="mt-3 text-sm font-extrabold text-slate-800 dark:text-white">
                    Salom, {profile?.name}!
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Hisobingiz faol — kirish uchun tugmani bosing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/20 transition-all active:scale-[0.98] hover:from-teal-700 hover:to-cyan-600"
                >
                  Kirish
                </button>
              </>
            ) : (
              <>
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 text-center dark:border-slate-800 dark:bg-slate-800/60">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Hali roʻyxatdan oʻtmagansiz
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Roʻyxatdan oʻtish uchun ism, familya va maqsad darajasini belgilashingiz kerak.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTab('signup')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white py-3 text-sm font-bold text-slate-700 transition-all active:scale-[0.98] hover:border-teal-300 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                >
                  Roʻyxatdan oʻtish
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
