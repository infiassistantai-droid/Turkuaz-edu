import { useCallback, useState } from 'react'
import { Check, ChevronRight, Globe, LogOut, Pencil, ShieldCheck, Trash2, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { getInitials } from '../lib/storage'
import { useI18n } from '../lib/i18n.jsx'
import { Dialog } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import MedalBadge from './MedalBadge'
import MedalInventory from './MedalInventory'

export default function UserProfileModal({
  open,
  onOpenChange,
  profile,
  stats,
  level = 1,
  unlockedMedals = [],
  equippedMedal,
  onEquipMedal,
  onEditProfile,
  onClearData,
  onLogout,
  isPremium = false,
}) {
  const { language, setLanguage, t } = useI18n()
  const [confirmingClear, setConfirmingClear] = useState(false)
  const initials = getInitials(profile?.name, profile?.surname)
  const displayName = [profile?.name, profile?.surname].filter(Boolean).join(' ') || t('nav.profile')
  const handleOpenChange = useCallback((nextOpen) => {
    if (!nextOpen) setConfirmingClear(false)
    onOpenChange?.(nextOpen)
  }, [onOpenChange])

  const close = () => handleOpenChange(false)

  const handleEdit = () => {
    close()
    onEditProfile?.()
  }

  const handleLogout = () => {
    close()
    onLogout?.()
  }

  const handleClear = () => {
    setConfirmingClear(false)
    close()
    onClearData?.()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      isPremium={isPremium}
      labelledBy="user-profile-title"
      className="max-w-xl"
    >
      <header className={cn(
        'relative flex items-center gap-4 border-b p-5 sm:p-6',
        isPremium ? 'border-white/10 bg-gradient-to-r from-rose-950/70 via-red-950/40 to-black/20' : 'border-slate-100 bg-gradient-to-r from-teal-50 to-white',
      )}>
        <div className={cn('relative grid size-14 shrink-0 place-items-center rounded-2xl text-sm font-black text-white shadow-lg', isPremium ? 'bg-gradient-to-br from-yellow-400 to-amber-700 shadow-yellow-500/20' : 'bg-gradient-to-br from-teal-600 to-cyan-500 shadow-teal-600/20')}>
          {initials}
          <MedalBadge medalId={equippedMedal} isPremium={isPremium} className="absolute -right-1.5 -top-1.5 size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="user-profile-title" className="truncate text-lg font-extrabold tracking-tight sm:text-xl">{displayName}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className={cn('rounded-md border px-1.5 py-1 text-[9px] font-black leading-none', isPremium ? 'border-yellow-200/20 bg-yellow-300/10 text-yellow-100' : 'border-amber-200 bg-amber-50 text-amber-800')}>Lvl {level}</span>
            <span className={isPremium ? 'text-white/60' : 'text-slate-500'}>{t('profile.target')}: {profile?.targetLevel || '—'} CEFR</span>
            <span className={isPremium ? 'text-white/40' : 'text-slate-400'}>{(stats?.xp ?? 0).toLocaleString(language)} XP</span>
          </div>
        </div>
        <button
          type="button"
          onClick={close}
          className={cn('grid size-9 shrink-0 place-items-center rounded-xl border transition-colors', isPremium ? 'border-white/10 text-white/65 hover:bg-white/10' : 'border-slate-200 text-slate-500 hover:bg-slate-100')}
          aria-label={t('auth.close')}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </header>

      <div className="p-4 sm:p-6">
        <Tabs defaultValue="settings">
          <TabsList className={cn('mb-5 rounded-xl border p-1', isPremium ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-slate-50')}>
            <TabsTrigger
              value="settings"
              className={cn(
                'flex min-h-10 flex-1 items-center justify-center rounded-lg px-3 text-xs font-extrabold transition-all',
                isPremium
                  ? 'text-white/55 hover:text-white data-[state=active]:bg-yellow-300/15 data-[state=active]:text-yellow-100 data-[state=active]:shadow-[0_0_18px_rgba(250,204,21,.15)]'
                  : 'text-slate-500 hover:text-slate-800 data-[state=active]:bg-white data-[state=active]:text-teal-800 data-[state=active]:shadow-sm',
              )}
            >
              {t('profile.tab.settings')}
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className={cn(
                'flex min-h-10 flex-1 items-center justify-center rounded-lg px-3 text-xs font-extrabold transition-all',
                isPremium
                  ? 'text-white/55 hover:text-white data-[state=active]:bg-yellow-300/15 data-[state=active]:text-yellow-100 data-[state=active]:shadow-[0_0_18px_rgba(250,204,21,.15)]'
                  : 'text-slate-500 hover:text-slate-800 data-[state=active]:bg-white data-[state=active]:text-teal-800 data-[state=active]:shadow-sm',
              )}
            >
              {t('medals.title')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4">
            <section className={cn('rounded-2xl border p-4', isPremium ? 'border-white/10 bg-black/25' : 'border-slate-200 bg-white')}>
              <h3 className={cn('flex items-center gap-2 text-sm font-extrabold', isPremium ? 'text-white' : 'text-slate-800')}>
                <Globe className={cn('size-4', isPremium ? 'text-yellow-200' : 'text-teal-700')} aria-hidden="true" />
                {t('language.label')}
              </h3>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { id: 'uz', key: 'language.uz' },
                  { id: 'en', key: 'language.en' },
                  { id: 'tr', key: 'language.tr' },
                ].map((option) => {
                  const selected = language === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setLanguage(option.id)}
                      aria-pressed={selected}
                      className={cn(
                        'flex min-h-10 items-center justify-center gap-1 rounded-xl border px-2 py-2 text-xs font-bold transition-all',
                        selected
                          ? isPremium ? 'border-yellow-200/30 bg-yellow-300/15 text-yellow-100' : 'border-teal-300 bg-teal-50 text-teal-800'
                          : isPremium ? 'border-white/10 text-white/65 hover:bg-white/10' : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                      )}
                    >
                      {t(option.key)}
                      {selected && <Check className="size-3.5 shrink-0" aria-hidden="true" />}
                    </button>
                  )
                })}
              </div>
            </section>

            {profile?.email && (
              <div className={cn('rounded-2xl border px-4 py-3 text-xs', isPremium ? 'border-white/10 bg-black/20 text-white/60' : 'border-slate-200 bg-slate-50 text-slate-500')}>
                {profile.email}
              </div>
            )}

            {confirmingClear ? (
              <section className={cn('rounded-2xl border p-4', isPremium ? 'border-rose-300/20 bg-rose-500/10' : 'border-rose-200 bg-rose-50')}>
                <p className={cn('text-sm font-semibold leading-relaxed', isPremium ? 'text-rose-100' : 'text-rose-800')}>{t('profile.confirm.clear')}</p>
                <div className="mt-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setConfirmingClear(false)} className={cn('rounded-xl border px-3 py-2 text-xs font-bold', isPremium ? 'border-white/15 text-white hover:bg-white/10' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50')}>{t('profile.cancel')}</button>
                  <button type="button" onClick={handleClear} className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700">{t('profile.delete')}</button>
                </div>
              </section>
            ) : (
              <div className="grid gap-2 sm:grid-cols-3">
                <button type="button" onClick={handleEdit} className={cn('flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors', isPremium ? 'border-white/10 text-white hover:bg-white/10' : 'border-slate-200 text-slate-700 hover:bg-slate-50')}>
                  <span className="flex items-center gap-2"><Pencil className="size-3.5" aria-hidden="true" />{t('profile.edit')}</span><ChevronRight className="size-3.5" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => setConfirmingClear(true)} className={cn('flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors', isPremium ? 'border-white/10 text-rose-200 hover:bg-rose-500/10' : 'border-rose-200 text-rose-700 hover:bg-rose-50')}>
                  <span className="flex items-center gap-2"><Trash2 className="size-3.5" aria-hidden="true" />{t('profile.clear')}</span><ChevronRight className="size-3.5" aria-hidden="true" />
                </button>
                <button type="button" onClick={handleLogout} className={cn('flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors', isPremium ? 'border-white/10 text-white/75 hover:bg-white/10' : 'border-slate-200 text-slate-600 hover:bg-slate-50')}>
                  <span className="flex items-center gap-2"><LogOut className="size-3.5" aria-hidden="true" />{t('profile.logout')}</span><ChevronRight className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements">
            <MedalInventory
              unlockedMedals={unlockedMedals}
              equippedMedal={equippedMedal}
              onEquipMedal={onEquipMedal}
              isPremium={isPremium}
              showTitle={false}
            />
            <div className={cn('mt-4 flex items-start gap-2 rounded-xl px-3 py-2.5 text-[11px] leading-relaxed', isPremium ? 'bg-white/[.04] text-white/45' : 'bg-slate-50 text-slate-500')}>
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              {t('medals.mockNote')}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Dialog>
  )
}
