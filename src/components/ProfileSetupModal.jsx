import { useEffect, useRef, useState } from 'react'
import { Bell, Camera, Check, ChevronLeft, ChevronRight, Eye, EyeOff, LoaderCircle, Mail, ShieldCheck, Sparkles, Target, Trash2, User, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'
import { ONBOARDING_PENDING_KEY } from '../lib/storage'
import { supabase } from '../lib/supabase'
import ProfileAvatar from './ProfileAvatar'
import { PRESET_AVATAR_PATHS, isPresetAvatarPath } from '../lib/profileAvatar'

const LEVELS = [
  { id: 'B1', subtitleKey: 'auth.level.B1.name', descriptionKey: 'auth.level.B1.desc' },
  { id: 'B2', subtitleKey: 'auth.level.B2.name', descriptionKey: 'auth.level.B2.desc' },
  { id: 'C1', subtitleKey: 'auth.level.C1.name', descriptionKey: 'auth.level.C1.desc' },
]
const PBKDF2_ITERATIONS = 180_000
const PRESET_AVATARS = PRESET_AVATAR_PATHS.map((src, index) => ({ id: index + 1, src, labelKey: `profile.avatar.name.${index + 1}` }))
const AUTH_HERO_SLIDES = [
  { image: '/images/auth-cappadocia.jpg', titleKey: 'auth.hero.title', subtitleKey: 'auth.hero.subtitle' },
  { image: '/images/auth-istanbul.jpg', titleKey: 'auth.hero.slide2.title', subtitleKey: 'auth.hero.slide2.subtitle' },
  { image: '/images/auth-study.jpg', titleKey: 'auth.hero.slide3.title', subtitleKey: 'auth.hero.slide3.subtitle' },
]

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
      <div className={cn('flex items-center gap-3 text-xs font-semibold', premium || darkSurface ? 'text-white/45' : 'text-slate-400')}>
        <span className={cn('h-px flex-1', premium || darkSurface ? 'bg-white/15' : 'bg-slate-200')} aria-hidden="true" />
        <span>{t('auth.or')}</span>
        <span className={cn('h-px flex-1', premium || darkSurface ? 'bg-white/15' : 'bg-slate-200')} aria-hidden="true" />
      </div>
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className={cn(
          'flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-extrabold transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60',
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

function LevelSelector({ value, onChange, premium, darkSurface = false }) {
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
              'group relative min-h-36 rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2',
              premium ? 'focus-visible:ring-yellow-300' : darkSurface ? 'focus-visible:ring-teal-300' : 'focus-visible:ring-teal-400',
              selected
                ? premium
                  ? 'premium-level-selected border-yellow-300/70 bg-black/45 shadow-[0_0_28px_rgba(250,204,21,.2)] ring-1 ring-yellow-200/60'
                  : darkSurface
                    ? 'border-teal-300/70 bg-gradient-to-br from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-950/30 ring-1 ring-teal-300/40'
                    : 'selected-cefr-default border-teal-600 bg-gradient-to-br from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-900/20 ring-1 ring-teal-300/60'
                : premium
                  ? 'border-white/15 bg-white/5 hover:border-white/35 hover:bg-white/10'
                  : darkSurface
                    ? 'border-white/10 bg-white/[.04] hover:border-teal-300/40 hover:bg-white/[.075]'
                    : 'border-slate-200 bg-white/70 hover:border-teal-300 hover:bg-teal-50/60 dark:border-slate-700 dark:bg-white/5 dark:hover:border-teal-400/50 dark:hover:bg-white/10',
            )}
          >
            <span className={cn('flex items-center justify-between', selected ? premium ? 'text-yellow-300' : 'text-white' : premium ? 'text-white' : darkSurface ? 'text-teal-200' : 'text-teal-700 dark:text-teal-300')}>
              <span className="text-2xl font-black tracking-tight">{level.id}</span>
              {selected && <Check className="size-5" aria-hidden="true" />}
            </span>
            <span className={cn('mt-2 block text-sm font-extrabold', selected ? premium ? 'text-yellow-50' : 'text-white' : premium || darkSurface ? 'text-white' : 'text-slate-900 dark:text-white')}>{t(level.subtitleKey)}</span>
            <span className={cn('mt-1 block text-xs leading-relaxed', selected ? 'text-white/85' : premium || darkSurface ? 'text-white/65' : 'text-slate-500 dark:text-slate-400')}>{t(level.descriptionKey)}</span>
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
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [heroSlide, setHeroSlide] = useState(0)
  const [level, setLevel] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [reminderBusy, setReminderBusy] = useState(false)
  const [photoBusy, setPhotoBusy] = useState(false)
  const [avatarBusy, setAvatarBusy] = useState(false)
  const [avatarNotice, setAvatarNotice] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || profile?.avatar_url || '')
  const photoInputRef = useRef(null)
  const isEdit = mode === 'edit'
  const premium = Boolean(isPremium)

  useEffect(() => {
    if (!open) return
    setError('')
    setBusy(false)
    setAvatarBusy(false)
    setAvatarNotice('')
    setStep(1)
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

  useEffect(() => {
    if (!open || isEdit) return undefined
    const timer = window.setInterval(() => setHeroSlide((current) => (current + 1) % AUTH_HERO_SLIDES.length), 8000)
    return () => window.clearInterval(timer)
  }, [open, isEdit, heroSlide])

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
    setAvatarNotice('')
    setPhotoBusy(true)
    try {
      setAvatarUrl(await compressProfilePhoto(file))
    } catch {
      setError(t('profile.photo.processingError'))
    } finally {
      setPhotoBusy(false)
    }
  }

  const saveSelectedAvatar = async () => {
    if (!isPresetAvatarPath(avatarUrl) || !onSaveAvatar) return
    setError('')
    setAvatarNotice('')
    setAvatarBusy(true)
    try {
      await onSaveAvatar(avatarUrl)
      setAvatarNotice(t('profile.avatar.saved'))
    } catch {
      setError(t('profile.avatar.failure'))
    } finally {
      setAvatarBusy(false)
    }
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
      if (cloudEnabled && onCloudRegister) {
        await onCloudRegister({ email: normalizeEmail(email), password, profile: { ...splitFullName(fullName), email: normalizeEmail(email), targetLevel: level } })
        return
      }
      const salt = createSalt()
      const credentialHash = await hashPassword(password, salt)
      onSave?.({ ...splitFullName(fullName), email: normalizeEmail(email), targetLevel: level, credentialSalt: salt, credentialHash })
    } catch (reason) {
      setError(cloudEnabled ? (reason?.message || t('auth.error.credentials.invalid')) : t('auth.error.crypto'))
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
      avatarUrl: avatarUrl || null,
    })
  }

  const logIn = async (event) => {
    event.preventDefault()
    setError('')
    const normalized = normalizeEmail(email)
    if (!normalized || !password) { setError(t('auth.error.credentials.required')); return }
    if (cloudEnabled && onCloudLogin) {
      setBusy(true)
      try { await onCloudLogin({ email: normalized, password }); return }
      catch (reason) { setError(reason?.message || t('auth.error.credentials.invalid')); setBusy(false); return }
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
    } catch (reason) {
      try { window.localStorage.removeItem(ONBOARDING_PENDING_KEY) } catch { /* ignore unavailable storage */ }
      setError(reason?.message || t('auth.error.credentials.invalid'))
      setBusy(false)
    }
  }

  const shellClass = premium
    ? 'border-white/20 bg-black/40 text-white shadow-2xl backdrop-blur-2xl'
    : 'border-white/50 bg-white/95 text-slate-900 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95 dark:text-white'
  const secondaryButton = !isEdit
    ? 'border-white/15 text-white/75 hover:bg-white/10'
    : premium
      ? 'border-white/20 text-white/80 hover:bg-white/10'
      : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-white/5'
  const nameParts = splitFullName(fullName)
  const updateNamePart = (part, value) => {
    const nextName = part === 'first'
      ? [value, nameParts.surname].filter(Boolean).join(' ')
      : [nameParts.name, value].filter(Boolean).join(' ')
    setFullName(nextName)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overscroll-contain p-2 sm:p-6" role="presentation">
      <button type="button" className="absolute inset-0 bg-black/40 backdrop-blur-2xl" onClick={onClose || undefined} aria-label={t('auth.close')} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        className={cn(
          'relative my-auto w-full transition-all duration-300',
          isEdit
            ? cn('max-h-[calc(100dvh-1.5rem)] max-w-2xl overflow-y-auto rounded-[24px] border p-5 sm:max-h-[calc(100dvh-3rem)] sm:p-8', shellClass)
            : 'grid max-h-[calc(100dvh-1rem)] max-w-6xl grid-cols-1 overflow-y-auto rounded-[22px] border border-white/10 bg-[#0f172a] text-white shadow-[0_30px_100px_rgba(8,5,20,.55)] sm:max-h-[calc(100dvh-3rem)] sm:rounded-[28px] lg:grid-cols-[1.04fr_.96fr] lg:overflow-hidden',
        )}
      >
        {!isEdit && <aside className="relative isolate min-h-[175px] overflow-hidden sm:min-h-[230px] lg:min-h-[660px]">
          {AUTH_HERO_SLIDES.map((slide, index) => <img key={slide.image} src={slide.image} alt="" aria-hidden="true" className={cn('auth-carousel-image absolute inset-0 -z-20 size-full object-cover object-center transition-[opacity,transform] duration-[1400ms] ease-out', index === heroSlide ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0')} />)}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-950/45 via-[#0f172a]/35 to-[#0f172a]/90" aria-hidden="true" />
          <div className="flex h-full min-h-[175px] flex-col justify-between p-4 sm:min-h-[230px] sm:p-7 lg:min-h-[660px] lg:p-9">
            <div className="flex items-center justify-between gap-4">
              <span className="text-lg font-black tracking-[.16em] text-white drop-shadow sm:text-xl">TURKUAZ<span className="text-teal-300">.</span></span>
              {onClose && <button type="button" onClick={onClose} className="rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white/90 backdrop-blur-md transition hover:bg-white/20">{t('auth.hero.back')} <span aria-hidden="true">↗</span></button>}
            </div>
            <div key={heroSlide} className="auth-caption-in max-w-md pb-1 sm:pb-3" aria-live="polite">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[.2em] text-teal-200">{t('auth.hero.eyebrow')}</p>
              <h2 className="max-w-sm text-2xl font-medium leading-tight tracking-tight text-white drop-shadow sm:text-3xl lg:text-[34px]">{t(AUTH_HERO_SLIDES[heroSlide].titleKey)}</h2>
              <p className="mt-3 max-w-sm text-xs leading-5 text-white/70 sm:text-sm sm:leading-6">{t(AUTH_HERO_SLIDES[heroSlide].subtitleKey)}</p>
              <div className="mt-6 flex items-center gap-2" role="group" aria-label={t('auth.hero.carousel')}>
                {AUTH_HERO_SLIDES.map((slide, index) => <button key={slide.image} type="button" onClick={() => setHeroSlide(index)} aria-label={t('auth.hero.slideLabel', { count: index + 1 })} aria-pressed={heroSlide === index} className={cn('auth-carousel-indicator h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80', heroSlide === index ? 'auth-carousel-indicator-active w-10' : 'w-7')} />)}
              </div>
            </div>
          </div>
        </aside>}

        <div className={cn('min-w-0', !isEdit && 'p-4 sm:p-8 lg:flex lg:max-h-[calc(100dvh-3rem)] lg:flex-col lg:overflow-y-auto lg:px-11 lg:py-10')}>
          <header className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h2 id="profile-modal-title" className={cn('font-semibold tracking-tight', isEdit ? 'text-xl font-extrabold' : 'text-[27px] leading-tight sm:text-[34px]')}>{t(isEdit ? 'auth.settings.title' : tab === 'login' ? 'auth.login.title' : 'auth.signup.title')}</h2>
              <p className={cn('mt-2 text-sm', isEdit ? premium ? 'text-white/60' : 'text-slate-500 dark:text-slate-400' : 'text-white/55')}>{t(isEdit ? 'auth.settings.subtitle' : tab === 'login' ? 'auth.login.subtitle' : 'auth.signup.subtitle')}</p>
              {!isEdit && <p className="mt-2 text-xs text-white/55">{t(tab === 'login' ? 'auth.needAccount' : 'auth.haveAccount')} <button type="button" onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setStep(1); setError(''); setPassword(''); setShowPassword(false) }} className="font-semibold text-teal-300 underline decoration-teal-300/40 underline-offset-4 transition hover:text-teal-200">{t(tab === 'login' ? 'auth.tab.signup' : 'auth.tab.login')}</button></p>}
            </div>
            {onClose && <button type="button" onClick={onClose} aria-label={t('auth.close')} className={cn('grid size-9 shrink-0 place-items-center rounded-xl border transition-all duration-300 hover:rotate-90', secondaryButton)}><X className="size-4" /></button>}
          </header>

        {isEdit ? (
          <form onSubmit={saveProfileChanges} className="mt-6 space-y-6">
            <section className={cn('rounded-2xl border p-4', premium ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-white/5')}>
              <div className="flex items-center gap-4">
                <ProfileAvatar profile={{ ...profile, avatarUrl }} sizeClass="size-16 shrink-0 rounded-2xl" className="ring-2 ring-white/40 dark:ring-white/10" />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold">{t('profile.photo.title')}</h3>
                  <p className={cn('mt-1 text-xs', premium ? 'text-white/55' : 'text-slate-500 dark:text-slate-400')}>{t('profile.avatar.subtitle')}</p>
                </div>
              </div>
              <div className="mt-5 border-t border-slate-200/70 pt-4 dark:border-slate-700">
                <div className="mb-3"><h4 className="text-sm font-extrabold">{t('profile.avatar.choose')}</h4><p className={cn('mt-1 text-xs', premium ? 'text-white/55' : 'text-slate-500 dark:text-slate-400')}>{t(cloudEnabled ? 'profile.avatar.hint.cloud' : 'profile.avatar.hint.local')}</p></div>
                <div className="grid grid-cols-3 justify-items-center gap-3 sm:grid-cols-6 sm:gap-2.5">
                  {PRESET_AVATARS.map((avatar) => {
                    const selected = avatarUrl === avatar.src
                    return <button key={avatar.id} type="button" aria-label={t(avatar.labelKey)} aria-pressed={selected} onClick={() => { setAvatarUrl(avatar.src); setError(''); setAvatarNotice('') }} className={cn('group relative aspect-square w-full max-w-24 rounded-full border-[5px] p-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-400/40', selected ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-slate-300 opacity-75 grayscale-[.2] hover:scale-105 hover:border-slate-400 hover:opacity-100 hover:grayscale-0 dark:border-slate-600 dark:hover:border-slate-400')}>
                      <img src={avatar.src} alt="" loading="lazy" className="size-full rounded-full object-cover"/>
                      {selected && <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full border-2 border-white bg-purple-600 text-white shadow-md dark:border-slate-900"><Check className="size-3.5" aria-hidden="true"/></span>}
                    </button>
                  })}
                </div>
                {avatarUrl.startsWith('data:image/') && <p className={cn('mt-3 text-[11px] leading-4', premium ? 'text-white/50' : 'text-slate-500 dark:text-slate-400')}>{t('profile.photo.savedLocally')}</p>}
                {avatarNotice && <p role="status" aria-live="polite" className="mt-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{avatarNotice}</p>}
                <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handlePhotoSelect} aria-label={t('profile.photo.title')}/>
                <div className="mt-4 flex flex-col-reverse gap-2 border-t border-slate-200/70 pt-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" disabled={photoBusy} onClick={() => photoInputRef.current?.click()} className={cn('inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold disabled:cursor-wait disabled:opacity-60', secondaryButton)}>
                      {photoBusy ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true"/> : <Camera className="size-3.5" aria-hidden="true"/>}{t('profile.avatar.custom')}
                    </button>
                    {avatarUrl && <button type="button" disabled={photoBusy || avatarBusy} onClick={() => { setAvatarUrl(''); setError(''); setAvatarNotice('') }} className={cn('inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold disabled:opacity-60', secondaryButton)}><Trash2 className="size-3.5" aria-hidden="true"/>{t('profile.photo.remove')}</button>}
                  </div>
                  <button type="button" disabled={avatarBusy || !isPresetAvatarPath(avatarUrl)} onClick={saveSelectedAvatar} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-purple-900/20 transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50">
                    {avatarBusy ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true"/> : <Check className="size-4" aria-hidden="true"/>}{t(avatarBusy ? 'profile.avatar.working' : 'profile.avatar.save')}
                  </button>
                </div>
              </div>
            </section>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field icon={User} label={t('auth.name')} value={fullName} onChange={setFullName} placeholder={t('auth.name.placeholder')} autoComplete="name" premium={premium} />
              <Field icon={Mail} label={t('auth.email')} type="email" value={email} onChange={setEmail} placeholder={t('auth.email.placeholder')} autoComplete="email" premium={premium} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2"><Target className={cn('size-4', premium ? 'text-yellow-400' : 'text-teal-600 dark:text-teal-300')}/><h3 className="text-sm font-bold">{t('auth.target.title')}</h3></div>
              <LevelSelector value={level} onChange={setLevel} premium={premium} />
            </div>
            <div className={cn('flex items-center justify-between gap-4 rounded-2xl border p-4', premium ? 'border-yellow-300/25 bg-white/5' : 'border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-white/5')}>
              <div className="flex items-center gap-3"><span className={cn('grid size-10 place-items-center rounded-xl', premium ? 'bg-white/10 text-yellow-300' : 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300')}><Bell className="size-4"/></span><div><p className="text-sm font-bold">{t('auth.reminder.title')}</p><p className={cn('text-xs', premium ? 'text-white/60' : 'text-slate-500 dark:text-slate-400')}>{t('auth.reminder.subtitle')}</p></div></div>
              <button type="button" disabled={reminderBusy} onClick={async () => { setReminderBusy(true); try { await onToggleReminders?.(!remindersEnabled) } finally { setReminderBusy(false) } }} aria-pressed={remindersEnabled} className={cn('relative h-7 w-12 rounded-full p-1 transition-all duration-300 disabled:opacity-50', remindersEnabled ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700')}><span className={cn('block size-5 rounded-full bg-white shadow transition-transform duration-300', remindersEnabled && 'translate-x-5')} /><span className="sr-only">{remindersEnabled ? t('auth.reminder.title') : t('auth.reminder.title')}</span></button>
            </div>
            {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-200">{error}</p>}
            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 py-3 text-sm font-extrabold text-white shadow-lg shadow-teal-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">{t('auth.save')}</button>
          </form>
        ) : tab === 'login' ? (
          <form onSubmit={logIn} className="mt-8 space-y-4">
            <Field label={t('auth.email')} type="email" value={email} onChange={setEmail} placeholder={t('auth.email.placeholder')} autoComplete="email" darkSurface={!isEdit} compact={!isEdit} />
            <Field label={t('auth.password')} type={showPassword ? 'text' : 'password'} value={password} onChange={setPassword} placeholder={t('auth.password.login.placeholder')} autoComplete="current-password" darkSurface={!isEdit} compact={!isEdit} trailingAction={<button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={t(showPassword ? 'auth.password.hide' : 'auth.password.show')} className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-white/45 transition hover:bg-white/10 hover:text-white/80">{showPassword ? <EyeOff className="size-4" aria-hidden="true"/> : <Eye className="size-4" aria-hidden="true"/>}</button>} />
            {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>}
            <button type="submit" disabled={busy} className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-teal-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:from-teal-500 hover:to-cyan-400 disabled:opacity-60">{busy ? t('auth.login.busy') : t('auth.login.submit')}</button>
            {!hasProfile && <p className="text-center text-xs text-white/55">{t('auth.noProfile')}</p>}
            <GoogleAuthAction premium={premium} darkSurface={!isEdit} busy={busy} onClick={signInWithGoogle} />
          </form>
        ) : step === 1 ? (
          <form onSubmit={continueRegistration} className="mt-7 space-y-4">
            <div className="mb-5 flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-teal-500/15 text-xs font-bold text-teal-200 ring-1 ring-teal-300/20">1</span><div><p className="text-sm font-bold">{t('auth.step1.title')}</p><p className="text-xs text-white/50">{t('auth.step1.subtitle')}</p></div><span className="ml-auto shrink-0 whitespace-nowrap text-right text-xs font-bold text-teal-300">{t('auth.step.progress1')}</span></div>
            <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
              <Field label={t('auth.firstName')} value={nameParts.name} onChange={(value) => updateNamePart('first', value)} placeholder={t('auth.firstName.placeholder')} autoComplete="given-name" darkSurface={!isEdit} compact={!isEdit} />
              <Field label={t('auth.lastName')} value={nameParts.surname} onChange={(value) => updateNamePart('last', value)} placeholder={t('auth.lastName.placeholder')} autoComplete="family-name" darkSurface={!isEdit} compact={!isEdit} />
            </div>
            <Field label={t('auth.email')} type="email" value={email} onChange={setEmail} placeholder={t('auth.email.placeholder')} autoComplete="email" darkSurface={!isEdit} compact={!isEdit} />
            <Field label={t('auth.password')} type={showPassword ? 'text' : 'password'} value={password} onChange={setPassword} placeholder={t('auth.password.placeholder')} autoComplete="new-password" darkSurface={!isEdit} compact={!isEdit} trailingAction={<button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={t(showPassword ? 'auth.password.hide' : 'auth.password.show')} className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-white/45 transition hover:bg-white/10 hover:text-white/80">{showPassword ? <EyeOff className="size-4" aria-hidden="true"/> : <Eye className="size-4" aria-hidden="true"/>}</button>} />
            {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>}
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-teal-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:from-teal-500 hover:to-cyan-400">{t('auth.next')}<ChevronRight className="size-4"/></button>
            <GoogleAuthAction premium={premium} darkSurface={!isEdit} busy={busy} onClick={signInWithGoogle} />
          </form>
        ) : (
          <form onSubmit={saveRegistration} className="mt-6 space-y-5">
            <div className="flex items-center gap-3"><button type="button" onClick={() => { setStep(1); setError('') }} className={cn('grid size-9 place-items-center rounded-xl border transition-all duration-300', secondaryButton)} aria-label={t('auth.back')}><ChevronLeft className="size-4"/></button><div><h3 className="text-sm font-bold">{t('auth.step2.title')}</h3><p className={cn('mt-1 text-xs', !isEdit ? 'text-white/55' : premium ? 'text-white/55' : 'text-slate-500 dark:text-slate-400')}>{t('auth.step2.subtitle')}</p></div><span className={cn('ml-auto shrink-0 whitespace-nowrap text-right text-xs font-bold', premium ? 'text-yellow-400' : !isEdit ? 'text-teal-300' : 'text-teal-700 dark:text-teal-300')}>{t('auth.step.progress2')}</span></div>
            <LevelSelector value={level} onChange={setLevel} premium={premium} darkSurface={!isEdit} />
            {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>}
            <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-teal-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:from-teal-500 hover:to-cyan-400 disabled:opacity-60"><Sparkles className="size-4"/>{busy ? t('auth.saving') : t('auth.create')}</button>
          </form>
        )}

        <p className={cn('mt-5 flex items-start gap-2 text-[11px] leading-relaxed', !isEdit ? 'text-white/40' : premium ? 'text-white/45' : 'text-slate-400 dark:text-slate-500')}><ShieldCheck className="mt-0.5 size-3.5 shrink-0"/>{cloudEnabled ? t('auth.cloud.note') : t('auth.local.note')}</p>
        </div>
      </section>
    </div>
  )
}
