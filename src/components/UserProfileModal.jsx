import { useCallback, useState } from 'react'
import { Check, ChevronRight, Flame, Globe, LogOut, Moon, Pencil, Sun, Trash2, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { getInitials } from '../lib/storage'
import { useI18n } from '../lib/i18n.jsx'
import { Dialog } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { getRankProgress } from '../lib/ranks'
import StreakMilestones from './StreakMilestones'
import TrophyCabinet from './TrophyCabinet'
import ProfileAvatar from './ProfileAvatar'

export default function UserProfileModal({
  open,
  onOpenChange,
  profile,
  stats,
  currentStreak = 0,
  streakMilestones = [],
  winterStudy = null,
  winterChampionUnlocked = false,
  trophyMetrics,
  trophyUnlocks = [],
  onEditProfile,
  onClearData,
  onLogout,
  isPremium = false,
  dark = false,
  onToggleDark,
}) {
  const { language, setLanguage, t } = useI18n()
  const [confirmingClear, setConfirmingClear] = useState(false)
  const initials = getInitials(profile?.name, profile?.surname)
  const displayName = [profile?.name, profile?.surname].filter(Boolean).join(' ') || t('nav.profile')
  const rankProgress = getRankProgress(stats?.xp)
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
      dark={dark}
      labelledBy="user-profile-title"
      className="max-w-xl"
    >
      <header className={cn(
        'relative flex items-center gap-4 border-b p-5 sm:p-6',
        isPremium ? 'border-white/10 bg-gradient-to-r from-rose-950/70 via-red-950/40 to-black/20' : dark ? 'border-slate-700 bg-gradient-to-r from-slate-900 to-slate-950' : 'border-slate-100 bg-gradient-to-r from-teal-50 to-white',
      )}>
        <ProfileAvatar
          profile={profile}
          fallbackText={initials}
          sizeClass="size-14 rounded-2xl"
          className={cn('text-sm font-black shadow-lg', isPremium ? 'shadow-yellow-500/20' : 'shadow-teal-600/20')}
        />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <div className="min-w-0 flex-1">
              <h2 id="user-profile-title" className="truncate text-lg font-extrabold tracking-tight sm:text-xl">{displayName}</h2>
              <p className={cn('mt-0.5 truncate text-xs font-extrabold', isPremium ? 'text-cyan-100' : dark ? 'text-teal-300' : 'text-teal-700')}>
                {t(rankProgress.rank.titleKey)} <span className="px-0.5 opacity-50">•</span> {t('rank.level', { level: rankProgress.level })}
              </p>
            </div>
            <div
              className={cn('inline-flex min-h-14 shrink-0 items-center gap-2 rounded-2xl border px-3', isPremium ? 'border-white/10 bg-black/30 text-orange-200' : dark ? 'border-orange-300/20 bg-orange-300/10 text-orange-200' : 'border-orange-200 bg-orange-50 text-orange-700')}
              title={t('streak.current', { count: currentStreak })}
              aria-label={t('streak.current', { count: currentStreak })}
            >
              <Flame className="size-5" aria-hidden="true" />
              <span className="text-sm font-black tabular-nums">{currentStreak}</span>
              <span className="text-[10px] font-bold">{t('streak.days')}</span>
            </div>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] font-semibold sm:text-xs">
            <span className={isPremium ? 'text-white/60' : dark ? 'text-slate-400' : 'text-slate-500'}>{t('profile.target')}: {profile?.targetLevel || '—'} CEFR</span>
            <span className={isPremium ? 'text-white/40' : dark ? 'text-slate-500' : 'text-slate-400'}>{(stats?.xp ?? 0).toLocaleString(language)} XP</span>
          </div>
        </div>
        <button
          type="button"
          onClick={close}
          className={cn('grid size-9 shrink-0 place-items-center rounded-xl border transition-colors', isPremium ? 'border-white/10 text-white/65 hover:bg-white/10' : dark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-100')}
          aria-label={t('auth.close')}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </header>

      <div className="p-4 sm:p-6">
        <Tabs defaultValue="settings">
          <TabsList className={cn('mb-5 rounded-xl border p-1', isPremium ? 'border-white/10 bg-black/30' : dark ? 'border-slate-700 bg-slate-800/80' : 'border-slate-200 bg-slate-50')}>
            <TabsTrigger
              value="settings"
              className={cn(
                'flex min-h-10 flex-1 items-center justify-center rounded-lg px-3 text-xs font-extrabold transition-all',
                isPremium
                  ? 'text-white/55 hover:text-white data-[state=active]:bg-yellow-300/15 data-[state=active]:text-yellow-100 data-[state=active]:shadow-[0_0_18px_rgba(250,204,21,.15)]'
                  : dark ? 'text-slate-400 hover:text-slate-100 data-[state=active]:bg-slate-700 data-[state=active]:text-teal-200 data-[state=active]:shadow-sm' : 'text-slate-500 hover:text-slate-800 data-[state=active]:bg-white data-[state=active]:text-teal-800 data-[state=active]:shadow-sm',
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
                  : dark ? 'text-slate-400 hover:text-slate-100 data-[state=active]:bg-slate-700 data-[state=active]:text-teal-200 data-[state=active]:shadow-sm' : 'text-slate-500 hover:text-slate-800 data-[state=active]:bg-white data-[state=active]:text-teal-800 data-[state=active]:shadow-sm',
              )}
            >
              {t('medals.title')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4">
            <section className={cn('rounded-2xl border p-4', isPremium ? 'border-white/10 bg-black/25' : dark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white')}>
              <h3 className={cn('flex items-center gap-2 text-sm font-extrabold', isPremium ? 'text-white' : dark ? 'text-slate-100' : 'text-slate-800')}>
                <Globe className={cn('size-4', isPremium ? 'text-yellow-200' : dark ? 'text-teal-300' : 'text-teal-700')} aria-hidden="true" />
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
                          ? isPremium ? 'border-yellow-200/30 bg-yellow-300/15 text-yellow-100' : dark ? 'border-teal-300/35 bg-teal-300/10 text-teal-200' : 'border-teal-300 bg-teal-50 text-teal-800'
                          : isPremium ? 'border-white/10 text-white/65 hover:bg-white/10' : dark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                      )}
                    >
                      {t(option.key)}
                      {selected && <Check className="size-3.5 shrink-0" aria-hidden="true" />}
                    </button>
                  )
                })}
              </div>
            </section>

            <section className={cn('rounded-2xl border p-4', isPremium ? 'border-white/10 bg-black/25' : dark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white')}>
              <h3 className={cn('mb-3 text-sm font-extrabold', isPremium ? 'text-white' : dark ? 'text-slate-100' : 'text-slate-800')}>{t('profile.appearance')}</h3>
              <button
                type="button"
                onClick={onToggleDark}
                aria-pressed={dark}
                className={cn('flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors', isPremium ? 'border-white/10 text-white hover:bg-white/10' : dark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50')}
              >
                {dark ? <Sun className="size-4 shrink-0 text-amber-400" aria-hidden="true" /> : <Moon className="size-4 shrink-0 text-slate-500" aria-hidden="true" />}
                <span className="min-w-0 flex-1">{t(dark ? 'header.theme.light' : 'header.theme.dark')}</span>
                <span className={cn('h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors', dark ? 'bg-teal-500' : 'bg-slate-300')} aria-hidden="true">
                  <span className={cn('block size-4 rounded-full bg-white shadow transition-transform', dark && 'translate-x-4')} />
                </span>
              </button>
            </section>

            {profile?.email && (
              <div className={cn('rounded-2xl border px-4 py-3 text-xs', isPremium ? 'border-white/10 bg-black/20 text-white/60' : dark ? 'border-slate-700 bg-slate-800/70 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-500')}>
                {profile.email}
              </div>
            )}

            {confirmingClear ? (
              <section className={cn('rounded-2xl border p-4', isPremium ? 'border-rose-300/20 bg-rose-500/10' : dark ? 'border-rose-400/20 bg-rose-500/10' : 'border-rose-200 bg-rose-50')}>
                <p className={cn('text-sm font-semibold leading-relaxed', isPremium ? 'text-rose-100' : dark ? 'text-rose-200' : 'text-rose-800')}>{t('profile.confirm.clear')}</p>
                <div className="mt-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setConfirmingClear(false)} className={cn('rounded-xl border px-3 py-2 text-xs font-bold', isPremium ? 'border-white/15 text-white hover:bg-white/10' : dark ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50')}>{t('profile.cancel')}</button>
                  <button type="button" onClick={handleClear} className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700">{t('profile.delete')}</button>
                </div>
              </section>
            ) : (
              <div className="grid gap-2 sm:grid-cols-3">
                <button type="button" onClick={handleEdit} className={cn('flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors', isPremium ? 'border-white/10 text-white hover:bg-white/10' : dark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50')}>
                  <span className="flex items-center gap-2"><Pencil className="size-3.5" aria-hidden="true" />{t('profile.edit')}</span><ChevronRight className="size-3.5" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => setConfirmingClear(true)} className={cn('flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors', isPremium ? 'border-white/10 text-rose-200 hover:bg-rose-500/10' : dark ? 'border-rose-400/20 text-rose-300 hover:bg-rose-500/10' : 'border-rose-200 text-rose-700 hover:bg-rose-50')}>
                  <span className="flex items-center gap-2"><Trash2 className="size-3.5" aria-hidden="true" />{t('profile.clear')}</span><ChevronRight className="size-3.5" aria-hidden="true" />
                </button>
                <button type="button" onClick={handleLogout} className={cn('flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors', isPremium ? 'border-white/10 text-white/75 hover:bg-white/10' : dark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50')}>
                  <span className="flex items-center gap-2"><LogOut className="size-3.5" aria-hidden="true" />{t('profile.logout')}</span><ChevronRight className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <TrophyCabinet metrics={trophyMetrics} unlockRecords={trophyUnlocks} isPremium={isPremium} />
            <StreakMilestones
              currentStreak={currentStreak}
              unlockedMilestones={streakMilestones}
              isPremium={isPremium}
              winterStudy={winterStudy}
              winterChampionUnlocked={winterChampionUnlocked}
              showcaseUnlocked
              showHeader
            />
          </TabsContent>
        </Tabs>
      </div>
    </Dialog>
  )
}
