import { useEffect, useRef, useState } from 'react'
import { Bell, CalendarDays, Camera, Check, Eye, EyeOff, LoaderCircle, Mail, Target, Trash2, User, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'
import { ONBOARDING_PENDING_KEY } from '../lib/storage'
import { supabase } from '../lib/supabase'
import ProfileAvatar from './ProfileAvatar'
import { Dialog } from './ui/dialog'
import { PORTRAIT_AVATAR_PATHS, isPresetAvatarPath } from '../lib/profileAvatar'
import { normalizeExamDate, STUDY_LEVELS, studyDateKey } from '../lib/studyPlan'

const LEVELS = [
  { id: 'B1', subtitleKey: 'auth.level.B1.name', descriptionKey: 'auth.level.B1.desc' },
  { id: 'B2', subtitleKey: 'auth.level.B2.name', descriptionKey: 'auth.level.B2.desc' },
  { id: 'C1', subtitleKey: 'auth.level.C1.name', descriptionKey: 'auth.level.C1.desc' },
]
const PBKDF2_ITERATIONS = 180_000
const PORTRAIT_AVATARS = PORTRAIT_AVATAR_PATHS.map((src, index) => ({ src, labelKey: `profile.avatar.portrait.${index + 1}` }))

const AUTH_ERROR_KEYS = {
  invalid_credentials: 'auth.error.credentials.invalid',
  email_not_confirmed: 'setup.auth.confirmEmail',
  user_already_exists: 'auth.error.accountExists',
  email_exists: 'auth.error.accountExists',
  over_request_rate_limit: 'auth.error.tryLater',
  over_email_send_rate_limit: 'auth.error.tryLater',
  weak_password: 'auth.error.password.length',
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-5 shrink-0" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4 6v5h6.5c3.8-3.5 6.1-8.6 6.1-14.7z" />
      <path fill="#34A853" d="M24 44c5.4 0 9.9-1.8 13.2-4.8l-6.5-5c-1.8 1.2-4 2-6.7 2-5.2 0-9.6-3.5-11.2-8.2H6.1v5.2C9.4 39.6 16.2 44 24 44z" />
      <path fill="#FBBC05" d="M12.8 28c-.4-1.2-.7-2.6-.7-4s.2-2.8.7-4v-5.2H6.1C4.7 17.6 4 20.7 4 24s.7 6.4 2.1 9.2l6.7-5.2z" />
      <path fill="#EA4335" d="M24 11.8c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.9 29.4 4 24 4 16.2 4 9.4 8.4 6.1 14.8l6.7 5.2c1.6-4.7 6-8.2 11.2-8.2z" />
    </svg>
  )
}

function GoogleAuthAction({ premium, darkSurface = false, busy, onClick }) {
  const { t } = useI18n()

  return (
    <div className="space-y-3">
      <div className={cn('studio-auth-divider flex items-center gap-3 text-xs font-semibold', premium || darkSurface ? 'text-white/45' : 'text-slate-400')}>
        <span className={cn('h-px flex-1', premium || darkSurface ? 'bg-white/15' : 'bg-slate-200')} aria-hidden="true" />
        <span>{t('auth.or')}</span>
        <span className={cn('h-px flex-1', premium || darkSurface ? 'bg-white/15' : 'bg-slate-200')} aria-hidden="true" />
      </div>
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className={cn(
          'studio-google-button flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-extrabold transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60',
          premium || darkSurface
            ? 'border-white/15 bg-white/[.045] text-white hover:border-white/25 hover:bg-white/[.08]'
            : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:shadow-md',
        )}
      >
        {busy ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <GoogleMark />}
        {busy ? t('auth.google.loading') : t('auth.google')}
      </button>
    </div>
  )
}

function normalizeEmail(value) {
  return value.trim().toLocaleLowerCase('en-US')
}

function splitFullName(value) {
  const [name = '', ...surname] = value.trim().split(/\s+/u).filter(Boolean)
  return { name, surname: surname.join(' ') }
}

async function compressProfilePhoto(file) {
  const objectUrl = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = objectUrl
    await image.decode()
    if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 40_000_000) {
      throw new Error('Unsupported image dimensions')
    }
    const scale = Math.min(1, 320 / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Image processing is unavailable')
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    const webp = canvas.toDataURL('image/webp', 0.82)
    const compressed = webp.startsWith('data:image/webp,') ? webp : canvas.toDataURL('image/jpeg', 0.82)
    if (compressed.length > 550_000) throw new Error('Compressed photo is too large')
    return compressed
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
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

function Field({ icon: Icon, label, type = 'text', value, onChange, placeholder, autoComplete, premium, darkSurface = false, compact = false, trailingAction = null, required = true }) {
  const darkInput = premium || darkSurface
  return (
    <label className="block min-w-0">
      <span className={cn('mb-1.5 block text-xs font-bold uppercase tracking-[.12em]', compact && 'sr-only', darkInput ? 'text-white/70' : 'text-slate-500 dark:text-slate-400')}>{label}</span>
      <span className="relative block">
        {Icon && <Icon className={cn('pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2', darkInput ? 'text-white/45' : 'text-slate-400')} aria-hidden="true" />}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={cn(
            'h-12 w-full rounded-xl border text-sm font-medium outline-none transition-all duration-300',
            Icon ? 'pl-10 pr-3' : 'px-4',
            trailingAction && 'pr-12',
            darkInput
              ? premium && !darkSurface
                ? 'border-white/15 bg-white/5 text-white placeholder:text-white/40 focus:border-yellow-300 focus:bg-white/10 focus:ring-4 focus:ring-yellow-300/10'
                : 'border-white/10 bg-white/[.055] text-white placeholder:text-white/35 focus:border-teal-400 focus:bg-white/[.085] focus:ring-4 focus:ring-teal-400/10'
              : 'border-slate-200 bg-slate-50/80 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 dark:border-slate-700 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-white/10',
          )}
        />
        {trailingAction}
      </span>
    </label>
  )
}

export default function ProfileSetupModal({
  open,
  mode = 'signup',
  profile,
  hasProfile,
  isPremium = false,
  dark = false,
  onClose,
  onSave,
  onSaveAvatar,
  onLogin,
  onCloudRegister,
  onCloudLogin,
  cloudEnabled = false,
  remindersEnabled = false,
  onToggleReminders,
}) {
  const { t } = useI18n()
  const [tab, setTab] = useState('signup')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [level, setLevel] = useState('')
  const [startingLevel, setStartingLevel] = useState('')
  const [examDate, setExamDate] = useState('')
  const [confirmationNotice, setConfirmationNotice] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [reminderBusy, setReminderBusy] = useState(false)
  const [photoBusy, setPhotoBusy] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || profile?.avatar_url || '')
  const photoInputRef = useRef(null)
  const isEdit = mode === 'edit'
  const premium = Boolean(isPremium)

  useEffect(() => {
    if (!open) return
    setError('')
    setBusy(false)
    setConfirmationNotice(false)
    setExamDate(normalizeExamDate(profile?.examDate) || '')
    setStartingLevel(STUDY_LEVELS.includes(profile?.startingLevel) ? profile.startingLevel : '')
    setPassword('')
    setShowPassword(false)
    if (isEdit && profile) {
      setTab('signup')
      setFullName([profile.name, profile.surname].filter(Boolean).join(' '))
      setEmail(profile.email || '')
      setLevel(profile.targetLevel || '')
      setAvatarUrl(profile.avatarUrl || profile.avatar_url || '')
    } else {
      setTab(mode === 'auth' && hasProfile ? 'login' : 'signup')
      setFullName(profile ? [profile.name, profile.surname].filter(Boolean).join(' ') : '')
      setEmail(profile?.email || '')
      setLevel(profile?.targetLevel || '')
      setAvatarUrl(profile?.avatarUrl || profile?.avatar_url || '')
    }
  }, [open, mode, isEdit, hasProfile])

  if (!open) return null

  const validateIdentity = () => {
    const cleanName = fullName.trim()
    const normalized = normalizeEmail(email)
    if (cleanName.length < 2) return t('auth.error.name')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(normalized)) return t('auth.error.email')
    return ''
  }

  const handlePhotoSelect = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError(t('profile.photo.invalidType'))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t('profile.photo.tooLarge'))
      return
    }
    setError('')
    setPhotoBusy(true)
    try {
      setAvatarUrl(await compressProfilePhoto(file))
    } catch {
      setError(t('profile.photo.processingError'))
    } finally {
      setPhotoBusy(false)
    }
  }

  const saveRegistration = async (event) => {
    event.preventDefault()
    if (busy) return
    const identityError = validateIdentity()
    if (identityError) { setError(identityError); return }
    if (password.length < 8) { setError(t('auth.error.password.length')); return }
    setError('')
    setBusy(true)
    const identity = { ...splitFullName(fullName), email: normalizeEmail(email) }
    try {
      if (cloudEnabled && onCloudRegister) {
        const result = await onCloudRegister({ email: identity.email, password, profile: identity })
        if (result?.needsConfirmation) {
          setConfirmationNotice(true)
          setPassword('')
          setTab('login')
        }
        return
      }
      const salt = createSalt()
      const credentialHash = await hashPassword(password, salt)
      await onSave?.({ ...identity, credentialSalt: salt, credentialHash })
    } catch (reason) {
      setError(t(cloudEnabled ? AUTH_ERROR_KEYS[reason?.code] || 'auth.error.register' : 'auth.error.crypto'))
    } finally {
      setBusy(false)
    }
  }

  const saveProfileChanges = async (event) => {
    event.preventDefault()
    if (busy || photoBusy) return
    const identityError = validateIdentity()
    if (identityError) { setError(identityError); return }
    if (!level) { setError(t('auth.error.level')); return }
    const normalizedDate = normalizeExamDate(examDate)
    if (examDate && (!normalizedDate || (normalizedDate !== profile?.examDate && normalizedDate < studyDateKey()))) {
      setError(t('setup.exam.invalid'))
      return
    }
    setError('')
    setBusy(true)
    let failure = 'profile.avatar.failure'
    const startingLevelChanged = startingLevel !== (profile?.startingLevel || '')
    try {
      const previousAvatar = profile?.avatarUrl || profile?.avatar_url || ''
      if (avatarUrl !== previousAvatar && isPresetAvatarPath(avatarUrl)) await onSaveAvatar?.(avatarUrl)
      failure = 'setup.saveError'
      await onSave?.({
        ...profile,
        ...splitFullName(fullName),
        email: normalizeEmail(email),
        targetLevel: level,
        examDate: normalizedDate,
        startingLevel: startingLevel || null,
        startingPath: startingLevelChanged ? startingLevel ? 'known' : 'placement' : profile?.startingPath,
        avatarUrl: avatarUrl || null,
        avatar_url: avatarUrl || null,
      })
    } catch {
      setError(t(failure))
    } finally {
      setBusy(false)
    }
  }

  const logIn = async (event) => {
    event.preventDefault()
    setError('')
    const normalized = normalizeEmail(email)
    if (!normalized || !password) { setError(t('auth.error.credentials.required')); return }
    if (cloudEnabled && onCloudLogin) {
      setBusy(true)
      try { await onCloudLogin({ email: normalized, password }); return }
      catch (reason) { setError(t(AUTH_ERROR_KEYS[reason?.code] || 'auth.error.signIn')); setBusy(false); return }
    }
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

  const signInWithGoogle = async () => {
    setError('')
    if (!supabase) {
      setError(t('auth.google.unavailable'))
      return
    }

    try { window.localStorage.setItem(ONBOARDING_PENDING_KEY, 'pending') } catch { /* onboarding still works for this session */ }
    setBusy(true)
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      })
      if (oauthError) throw oauthError
    } catch {
      try { window.localStorage.removeItem(ONBOARDING_PENDING_KEY) } catch { /* ignore unavailable storage */ }
      setError(t('auth.google.unavailable'))
      setBusy(false)
    }
  }

  if (isEdit) {
    const unavailable = busy || photoBusy

    return (
      <Dialog open={open} onOpenChange={onClose} isPremium={premium} dark={dark} labelledBy="profile-modal-title" className="bosfor-profile profile-editor">
        <form onSubmit={saveProfileChanges} className="profile-editor-form">
          <header className="profile-editor-head">
            <h2 id="profile-modal-title">{t('profile.edit')}</h2>
            <button type="button" className="profile-close" onClick={onClose} aria-label={t('auth.close')} disabled={busy}><X size={19} aria-hidden="true" /></button>
          </header>

          <div className="profile-editor-content">
            <section className="profile-editor-card" aria-labelledby="profile-editor-photo">
              <div className="profile-editor-preview">
                <ProfileAvatar profile={{ ...profile, avatarUrl, avatar_url: avatarUrl }} sizeClass="size-16" className="profile-avatar" />
                <div className="min-w-0">
                  <h3 id="profile-editor-photo">{t('profile.photo.title')}</h3>
                  <p>{t('profile.avatar.subtitle')}</p>
                </div>
              </div>
              <div role="group" aria-label={t('profile.avatar.choose')} className="profile-editor-gallery">
                {PORTRAIT_AVATARS.map(({ src, labelKey }) => (
                  <button
                    key={src}
                    type="button"
                    aria-label={t(labelKey)}
                    aria-pressed={avatarUrl === src}
                    disabled={unavailable}
                    onClick={() => { setAvatarUrl(src); setError('') }}
                  >
                    <img src={src} alt="" loading="lazy" width="224" height="224" />
                    {avatarUrl === src && <span className="profile-avatar-selected"><Check size={13} aria-hidden="true" /></span>}
                  </button>
                ))}
              </div>
              <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handlePhotoSelect} />
              <div className="profile-editor-photo-actions">
                <button type="button" disabled={unavailable} onClick={() => photoInputRef.current?.click()}>
                  {photoBusy ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Camera size={16} aria-hidden="true" />}
                  {t('profile.photo.upload')}
                </button>
                {avatarUrl && <button type="button" disabled={unavailable} onClick={() => { setAvatarUrl(''); setError('') }}><Trash2 size={16} aria-hidden="true" />{t('profile.photo.remove')}</button>}
              </div>
              {avatarUrl.startsWith('data:image/') && <p className="mt-2">{t('profile.photo.savedLocally')}</p>}
            </section>

            <section className="profile-editor-card" aria-labelledby="profile-editor-details">
              <h3 id="profile-editor-details">{t('profile.account')}</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field icon={User} label={t('auth.name')} value={fullName} onChange={setFullName} placeholder={t('auth.name.placeholder')} autoComplete="name" premium={premium} />
                <Field icon={Mail} label={t('auth.email')} type="email" value={email} onChange={setEmail} placeholder={t('auth.email.placeholder')} autoComplete="email" premium={premium} />
              </div>
              <h4 id="profile-editor-goal" className="mt-4 flex items-center gap-2 text-sm font-bold"><Target size={16} aria-hidden="true" />{t('auth.target.title')}</h4>
              <div role="group" aria-labelledby="profile-editor-goal" className="profile-editor-levels">
                {LEVELS.map(({ id, subtitleKey }) => (
                  <button key={id} type="button" aria-pressed={level === id} aria-label={id + ' · ' + t(subtitleKey)} onClick={() => setLevel(id)}>{id}</button>
                ))}
              </div>
              <label htmlFor="profile-current-level" className="mb-2 mt-4 block text-sm font-bold">{t('setup.level.current')}</label>
              <select id="profile-current-level" className="profile-plan-field" value={startingLevel} onChange={(event) => setStartingLevel(event.target.value)}>
                <option value="">{t('plan.personal.unknownLevel')}</option>
                {STUDY_LEVELS.map((id) => <option key={id} value={id}>{id}</option>)}
              </select>
              <label htmlFor="profile-exam-date" className="mb-2 mt-4 flex items-center gap-2 text-sm font-bold"><CalendarDays size={16} aria-hidden="true" />{t('setup.exam.label')}</label>
              <input id="profile-exam-date" className="profile-plan-field" type="date" min={examDate && examDate === profile?.examDate && examDate < studyDateKey() ? examDate : studyDateKey()} value={examDate} onChange={(event) => setExamDate(event.target.value)} />
            </section>

            <div className="profile-editor-card profile-editor-reminders">
              <Bell size={18} aria-hidden="true" />
              <div className="min-w-0">
                <h3 id="profile-editor-reminder">{t('auth.reminder.title')}</h3>
                <p>{t('auth.reminder.subtitle')}</p>
              </div>
              <button
                type="button" role="switch" aria-checked={remindersEnabled} aria-labelledby="profile-editor-reminder" disabled={reminderBusy || busy}
                onClick={async () => { setReminderBusy(true); try { await onToggleReminders?.(!remindersEnabled) } finally { setReminderBusy(false) } }}
              ><span className="profile-switch" aria-hidden="true" /></button>
            </div>
          </div>

          <footer className="profile-editor-footer">
            {error && <p role="alert">{error}</p>}
            <button type="button" onClick={onClose} disabled={busy}>{t('common.cancel')}</button>
            <button type="submit" className="profile-editor-save" disabled={unavailable}>
              {busy ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
              {t(busy ? 'auth.saving' : 'auth.save')}
            </button>
          </footer>
        </form>
      </Dialog>
    )
  }


  const nameParts = splitFullName(fullName)
  const updateNamePart = (part, value) => {
    const nextName = part === 'first'
      ? [value, nameParts.surname].filter(Boolean).join(' ')
      : [nameParts.name, value].filter(Boolean).join(' ')
    setFullName(nextName)
  }

  return (
    <div className="studio-auth" role="presentation">
      <section aria-labelledby="profile-modal-title" className="relative my-auto w-full studio-auth-layout">
          <aside className="studio-auth-cover">
            <img src="/images/bosfor-hero.jpg" alt="" fetchPriority="high" />
            <div className="studio-auth-brand">
              <img src="/icons/turkish-education.svg" alt="" />
              <span>Turkuaz Edu</span>
            </div>
            <div className="studio-auth-caption">
              <h2>{t('bosfor.hero.title')}</h2>
              <p>{t('auth.hero.subtitle')}</p>
            </div>
          </aside>

        <div className="min-w-0 studio-auth-form">
          <header className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h1 id="profile-modal-title">{t(tab === 'login' ? 'auth.login.title' : 'auth.signup.title')}</h1>
              <p className="mt-2 text-sm text-white/55">{t(tab === 'login' ? 'auth.login.subtitle' : 'auth.signup.subtitle')}</p>
              <p className="mt-2 text-xs text-white/55">{t(tab === 'login' ? 'auth.needAccount' : 'auth.haveAccount')} <button type="button" onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setConfirmationNotice(false); setError(''); setPassword(''); setShowPassword(false) }} className="font-semibold text-teal-300 underline decoration-teal-300/40 underline-offset-4 transition hover:text-teal-200">{t(tab === 'login' ? 'auth.tab.signup' : 'auth.tab.login')}</button></p>
            </div>
          </header>

        {tab === 'login' ? (
          <form onSubmit={logIn} className="mt-8 space-y-4">
            {confirmationNotice && <p role="status" className="rounded-xl border border-sky-400/30 bg-sky-400/10 px-3 py-2 text-sm text-sky-100">{t('setup.auth.confirmEmail')}</p>}
            <Field label={t('auth.email')} type="email" value={email} onChange={setEmail} placeholder={t('auth.email.placeholder')} autoComplete="email" darkSurface compact />
            <Field label={t('auth.password')} type={showPassword ? 'text' : 'password'} value={password} onChange={setPassword} placeholder={t('auth.password.login.placeholder')} autoComplete="current-password" darkSurface compact trailingAction={<button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={t(showPassword ? 'auth.password.hide' : 'auth.password.show')} className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-white/45 transition hover:bg-white/10 hover:text-white/80">{showPassword ? <EyeOff className="size-4" aria-hidden="true"/> : <Eye className="size-4" aria-hidden="true"/>}</button>} />
            {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>}
            <button type="submit" disabled={busy} className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-teal-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:from-teal-500 hover:to-cyan-400 disabled:opacity-60">{busy ? t('auth.login.busy') : t('auth.login.submit')}</button>
            {!hasProfile && <p className="text-center text-xs text-white/55">{t('auth.noProfile')}</p>}
            <GoogleAuthAction premium={premium} darkSurface busy={busy} onClick={signInWithGoogle} />
          </form>
        ) : (
          <form onSubmit={saveRegistration} className="mt-7 space-y-4">
            <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
              <Field label={t('auth.firstName')} value={nameParts.name} onChange={(value) => updateNamePart('first', value)} placeholder={t('auth.firstName.placeholder')} autoComplete="given-name" darkSurface compact />
              <Field label={t('auth.lastName')} value={nameParts.surname} onChange={(value) => updateNamePart('last', value)} placeholder={t('auth.lastName.placeholder')} autoComplete="family-name" darkSurface compact />
            </div>
            <Field label={t('auth.email')} type="email" value={email} onChange={setEmail} placeholder={t('auth.email.placeholder')} autoComplete="email" darkSurface compact />
            <Field label={t('auth.password')} type={showPassword ? 'text' : 'password'} value={password} onChange={setPassword} placeholder={t('auth.password.placeholder')} autoComplete="new-password" darkSurface compact trailingAction={<button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={t(showPassword ? 'auth.password.hide' : 'auth.password.show')} className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-white/45 transition hover:bg-white/10 hover:text-white/80">{showPassword ? <EyeOff className="size-4" aria-hidden="true"/> : <Eye className="size-4" aria-hidden="true"/>}</button>} />
            {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>}
            <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-teal-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:from-teal-500 hover:to-cyan-400">{busy ? t('auth.saving') : t('auth.create')}</button>
            <GoogleAuthAction premium={premium} darkSurface busy={busy} onClick={signInWithGoogle} />
          </form>
        )}

        </div>
      </section>
    </div>
  )
}
