import { useEffect, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, GraduationCap, Lock, Mail, ShieldCheck, Sparkles, Target, User, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'

const LEVELS = [
  { id: 'B1', subtitleKey: 'auth.level.B1.name', descriptionKey: 'auth.level.B1.desc' },
  { id: 'B2', subtitleKey: 'auth.level.B2.name', descriptionKey: 'auth.level.B2.desc' },
  { id: 'C1', subtitleKey: 'auth.level.C1.name', descriptionKey: 'auth.level.C1.desc' },
]
const PBKDF2_ITERATIONS = 180_000

function normalizeEmail(value) {
  return value.trim().toLocaleLowerCase('en-US')
}

function splitFullName(value) {
  const [name = '', ...surname] = value.trim().split(/\s+/u).filter(Boolean)
  return { name, surname: surname.join(' ') }
}

function createSalt() {
  const bytes = new Uint8Array(16)
  globalThis.crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(password, salt) {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) throw new Error('Secure local sign-in is not available in this browser.')
  const key = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' }, key, 256)
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function secureEqual(left, right) {
  if (!left || !right || left.length !== right.length) return false
  let mismatch = 0
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index)
  return mismatch === 0
}

function Field({ icon: Icon, label, type = 'text', value, onChange, placeholder, autoComplete, premium, required = true }) {
  return (
    <label className="block">
      <span className={cn('mb-1.5 block text-xs font-bold uppercase tracking-[.12em]', premium ? 'text-white/70' : 'text-slate-500 dark:text-slate-400')}>{label}</span>
      <span className="relative block">
        <Icon className={cn('pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2', premium ? 'text-white/55' : 'text-slate-400')} aria-hidden="true" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={cn(
            'h-11 w-full rounded-xl border pl-10 pr-3 text-sm font-medium outline-none transition-all duration-300 focus:bg-white/10 focus:border-yellow-300 focus:ring-4 focus:ring-yellow-300/10',
            premium
              ? 'border-white/15 bg-white/5 text-white placeholder:text-white/40'
              : 'border-slate-200 bg-slate-50/80 text-slate-900 placeholder:text-slate-400 focus:bg-white dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-white/10',
          )}
        />
      </span>
    </label>
  )
}

function LevelSelector({ value, onChange, premium }) {
  const { t } = useI18n()
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {LEVELS.map((level) => {
        const selected = value === level.id
        return (
          <button
            key={level.id}
            type="button"
            onClick={() => onChange(level.id)}
            aria-pressed={selected}
            className={cn(
              'group relative min-h-36 rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300',
              selected
                ? 'border-yellow-300 bg-gradient-to-br from-yellow-300/20 to-amber-500/10 shadow-[0_0_28px_rgba(250,204,21,.2)] ring-1 ring-yellow-200/60'
                : premium
                  ? 'border-white/15 bg-white/5 hover:border-white/35 hover:bg-white/10'
                  : 'border-slate-200 bg-white/70 hover:border-teal-300 hover:bg-teal-50/60 dark:border-slate-700 dark:bg-white/5 dark:hover:border-teal-400/50 dark:hover:bg-white/10',
            )}
          >
            <span className={cn('flex items-center justify-between', selected || premium ? 'text-yellow-300' : 'text-teal-700 dark:text-teal-300')}>
              <span className="text-2xl font-black tracking-tight">{level.id}</span>
              {selected && <Check className="size-5" aria-hidden="true" />}
            </span>
            <span className={cn('mt-2 block text-sm font-extrabold', premium ? 'text-white' : 'text-slate-900 dark:text-white')}>{t(level.subtitleKey)}</span>
            <span className={cn('mt-1 block text-xs leading-relaxed', premium ? 'text-white/60' : 'text-slate-500 dark:text-slate-400')}>{t(level.descriptionKey)}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function ProfileSetupModal({
  open,
  mode = 'signup',
  profile,
  hasProfile,
  isPremium = false,
  onTogglePremium,
  onClose,
  onSave,
  onLogin,
}) {
  const { t } = useI18n()
  const [tab, setTab] = useState('signup')
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [level, setLevel] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const isEdit = mode === 'edit'
  const premium = Boolean(isPremium)

  useEffect(() => {
    if (!open) return
    setError('')
    setBusy(false)
    setStep(1)
    setPassword('')
    if (isEdit && profile) {
      setTab('signup')
      setFullName([profile.name, profile.surname].filter(Boolean).join(' '))
      setEmail(profile.email || '')
      setLevel(profile.targetLevel || '')
    } else {
      setTab(mode === 'auth' && hasProfile ? 'login' : 'signup')
      setFullName(profile ? [profile.name, profile.surname].filter(Boolean).join(' ') : '')
      setEmail(profile?.email || '')
      setLevel(profile?.targetLevel || '')
    }
  }, [open, mode, isEdit, hasProfile, profile])

  if (!open) return null

  const validateIdentity = () => {
    const cleanName = fullName.trim()
    const normalized = normalizeEmail(email)
    if (cleanName.length < 2) return t('auth.error.name')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(normalized)) return t('auth.error.email')
    return ''
  }

  const continueRegistration = (event) => {
    event.preventDefault()
    const identityError = validateIdentity()
    if (identityError) { setError(identityError); return }
    if (password.length < 8) { setError(t('auth.error.password.length')); return }
    setError('')
    setStep(2)
  }

  const saveRegistration = async (event) => {
    event.preventDefault()
    if (!level) { setError(t('auth.error.level')); return }
    setError('')
    setBusy(true)
    try {
      const salt = createSalt()
      const credentialHash = await hashPassword(password, salt)
      onSave?.({ ...splitFullName(fullName), email: normalizeEmail(email), targetLevel: level, credentialSalt: salt, credentialHash })
    } catch {
      setError(t('auth.error.crypto'))
      setBusy(false)
    }
  }

  const saveProfileChanges = (event) => {
    event.preventDefault()
    const identityError = validateIdentity()
    if (identityError) { setError(identityError); return }
    if (!level) { setError(t('auth.error.level')); return }
    onSave?.({
      ...profile,
      ...splitFullName(fullName),
      email: normalizeEmail(email),
      targetLevel: level,
    })
  }

  const logIn = async (event) => {
    event.preventDefault()
    setError('')
    const normalized = normalizeEmail(email)
    if (!normalized || !password) { setError(t('auth.error.credentials.required')); return }
    if (!profile?.credentialHash || !profile?.credentialSalt) {
      setError(t('auth.error.profile.noPassword'))
      return
    }
    setBusy(true)
    try {
      const candidate = await hashPassword(password, profile.credentialSalt)
      if (normalized !== normalizeEmail(profile.email || '') || !secureEqual(candidate, profile.credentialHash)) {
        setError(t('auth.error.credentials.invalid'))
        setBusy(false)
        return
      }
      onLogin?.(profile)
    } catch {
      setError(t('auth.error.crypto.login'))
      setBusy(false)
    }
  }

  const shellClass = premium
    ? 'border-white/20 bg-black/40 text-white shadow-2xl backdrop-blur-2xl'
    : 'border-white/50 bg-white/95 text-slate-900 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95 dark:text-white'
  const secondaryButton = premium
    ? 'border-white/20 text-white/80 hover:bg-white/10'
    : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-white/5'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto p-3 sm:p-6" role="presentation">
      <button type="button" className="absolute inset-0 bg-black/40 backdrop-blur-2xl" onClick={onClose || undefined} aria-label={t('auth.close')} />
      <section role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" className={cn('relative my-auto w-full max-w-2xl rounded-[24px] border p-5 transition-all duration-300 sm:p-8', shellClass)}>
        <header className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-900/20"><GraduationCap className="size-5" /></span>
          <div className="min-w-0 flex-1">
            <h2 id="profile-modal-title" className="text-xl font-extrabold tracking-tight">{t(isEdit ? 'auth.settings.title' : tab === 'login' ? 'auth.login.title' : 'auth.signup.title')}</h2>
            <p className={cn('mt-1 text-sm', premium ? 'text-white/60' : 'text-slate-500 dark:text-slate-400')}>{t(isEdit ? 'auth.settings.subtitle' : tab === 'login' ? 'auth.login.subtitle' : 'auth.signup.subtitle')}</p>
          </div>
          {onClose && <button type="button" onClick={onClose} aria-label={t('auth.close')} className={cn('grid size-9 shrink-0 place-items-center rounded-xl border transition-all duration-300 hover:rotate-90', secondaryButton)}><X className="size-4" /></button>}
        </header>

        {!isEdit && <div className={cn('mt-6 grid grid-cols-2 gap-1 rounded-xl p-1', premium ? 'bg-white/5' : 'bg-slate-100 dark:bg-white/5')}>
          {[['signup', t('auth.tab.signup')], ['login', t('auth.tab.login')] ].map(([id, label]) => <button key={id} type="button" onClick={() => { setTab(id); setStep(1); setError(''); setPassword('') }} className={cn('rounded-lg py-2.5 text-sm font-bold transition-all duration-300', tab === id ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg' : premium ? 'text-white/65 hover:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white')}>{label}</button>)}
        </div>}

        {isEdit ? (
          <form onSubmit={saveProfileChanges} className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field icon={User} label={t('auth.name')} value={fullName} onChange={setFullName} placeholder={t('auth.name.placeholder')} autoComplete="name" premium={premium} />
              <Field icon={Mail} label={t('auth.email')} type="email" value={email} onChange={setEmail} placeholder={t('auth.email.placeholder')} autoComplete="email" premium={premium} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2"><Target className="size-4 text-yellow-400"/><h3 className="text-sm font-bold">{t('auth.target.title')}</h3></div>
              <LevelSelector value={level} onChange={setLevel} premium={premium} />
            </div>
            <div className={cn('flex items-center justify-between gap-4 rounded-2xl border p-4', premium ? 'border-yellow-300/25 bg-white/5' : 'border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-white/5')}>
              <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-rose-600 to-red-700 text-yellow-300"><Sparkles className="size-4"/></span><div><p className="text-sm font-bold">{t('auth.theme.title')}</p><p className={cn('text-xs', premium ? 'text-white/60' : 'text-slate-500 dark:text-slate-400')}>{t('auth.theme.subtitle')}</p></div></div>
              <button type="button" onClick={onTogglePremium} aria-pressed={premium} className={cn('relative h-7 w-12 rounded-full p-1 transition-all duration-300', premium ? 'bg-gradient-to-r from-rose-600 to-red-700 ring-1 ring-yellow-300/60' : 'bg-slate-300 dark:bg-slate-700')}><span className={cn('block size-5 rounded-full bg-white shadow transition-transform duration-300', premium && 'translate-x-5')} /> <span className="sr-only">{premium ? t('auth.theme.enabled') : t('auth.theme.disabled')}</span></button>
            </div>
            {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-200">{error}</p>}
            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 py-3 text-sm font-extrabold text-white shadow-lg shadow-teal-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">{t('auth.save')}</button>
          </form>
        ) : tab === 'login' ? (
          <form onSubmit={logIn} className="mt-6 space-y-4">
            <Field icon={Mail} label={t('auth.email')} type="email" value={email} onChange={setEmail} placeholder={t('auth.email.placeholder')} autoComplete="email" premium={premium} />
            <Field icon={Lock} label={t('auth.password')} type="password" value={password} onChange={setPassword} placeholder={t('auth.password.login.placeholder')} autoComplete="current-password" premium={premium} />
            {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-200">{error}</p>}
            <button type="submit" disabled={busy} className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 py-3 text-sm font-extrabold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60">{busy ? t('auth.login.busy') : t('auth.login.submit')}</button>
            {!hasProfile && <p className={cn('text-center text-xs', premium ? 'text-white/55' : 'text-slate-500 dark:text-slate-400')}>{t('auth.noProfile')}</p>}
          </form>
        ) : step === 1 ? (
          <form onSubmit={continueRegistration} className="mt-6 space-y-4">
            <div className="mb-5 flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-yellow-300 font-bold text-slate-950">1</span><div><p className="text-sm font-bold">{t('auth.step1.title')}</p><p className={cn('text-xs', premium ? 'text-white/55' : 'text-slate-500 dark:text-slate-400')}>{t('auth.step1.subtitle')}</p></div><span className="ml-auto text-xs font-bold text-yellow-400">{t('auth.step.progress1')}</span></div>
            <Field icon={User} label={t('auth.name')} value={fullName} onChange={setFullName} placeholder={t('auth.name.placeholder')} autoComplete="name" premium={premium} />
            <Field icon={Mail} label={t('auth.email')} type="email" value={email} onChange={setEmail} placeholder={t('auth.email.placeholder')} autoComplete="email" premium={premium} />
            <Field icon={Lock} label={t('auth.password')} type="password" value={password} onChange={setPassword} placeholder={t('auth.password.placeholder')} autoComplete="new-password" premium={premium} />
            {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-200">{error}</p>}
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 py-3 text-sm font-extrabold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5">{t('auth.next')}<ChevronRight className="size-4"/></button>
          </form>
        ) : (
          <form onSubmit={saveRegistration} className="mt-6 space-y-5">
            <div className="flex items-center gap-3"><button type="button" onClick={() => { setStep(1); setError('') }} className={cn('grid size-9 place-items-center rounded-xl border transition-all duration-300', secondaryButton)} aria-label={t('auth.back')}><ChevronLeft className="size-4"/></button><div><h3 className="text-sm font-bold">{t('auth.step2.title')}</h3><p className={cn('mt-1 text-xs', premium ? 'text-white/55' : 'text-slate-500 dark:text-slate-400')}>{t('auth.step2.subtitle')}</p></div><span className="ml-auto text-xs font-bold text-yellow-400">{t('auth.step.progress2')}</span></div>
            <LevelSelector value={level} onChange={setLevel} premium={premium} />
            {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-200">{error}</p>}
            <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 py-3 text-sm font-extrabold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"><Sparkles className="size-4"/>{busy ? t('auth.saving') : t('auth.create')}</button>
          </form>
        )}

        <p className={cn('mt-5 flex items-start gap-2 text-[11px] leading-relaxed', premium ? 'text-white/45' : 'text-slate-400 dark:text-slate-500')}><ShieldCheck className="mt-0.5 size-3.5 shrink-0"/>{t('auth.local.note')}</p>
      </section>
    </div>
  )
}
