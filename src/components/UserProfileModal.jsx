import { useCallback, useRef, useState } from 'react'
import { Check, ChevronRight, Globe, LogOut, Mail, Moon, Pencil, Settings2, Target, Trash2, Trophy, X } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'
import { getRankProgress } from '../lib/ranks'
import { Dialog } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ModelAsset } from './BosforArtwork'
import StreakMilestones from './StreakMilestones'
import TrophyCabinet from './TrophyCabinet'
import ProfileAvatar from './ProfileAvatar'
import './UserProfileModal.css'

const PROFILE_LANGUAGES = ['uz', 'en', 'tr']

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
  const [clearing, setClearing] = useState(false)
  const [clearFailed, setClearFailed] = useState(false)
  const clearButtonRef = useRef(null)
  const displayName = [profile?.name, profile?.surname].filter(Boolean).join(' ') || t('nav.profile')
  const rankProgress = getRankProgress(stats?.xp)

  const handleOpenChange = useCallback((nextOpen) => {
    if (!nextOpen) {
      setConfirmingClear(false)
      setClearFailed(false)
    }
    onOpenChange?.(nextOpen)
  }, [onOpenChange])

  function runAccountAction(action) {
    handleOpenChange(false)
    action?.()
  }

  function cancelClear() {
    setConfirmingClear(false)
    setClearFailed(false)
    clearButtonRef.current?.focus()
  }

  async function clearProgress() {
    if (clearing) return
    setClearing(true)
    setClearFailed(false)
    try {
      if (await onClearData?.()) handleOpenChange(false)
      else setClearFailed(true)
    } finally {
      setClearing(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      isPremium={isPremium}
      dark={dark}
      labelledBy="user-profile-title"
      className="bosfor-profile"
    >
      <header className="profile-summary">
        <div className="profile-identity">
          <ProfileAvatar profile={profile} sizeClass="size-14 sm:size-16" className="profile-avatar" />
          <div className="min-w-0">
            <h2 id="user-profile-title">{displayName}</h2>
            <p className="profile-rank">
              {t(rankProgress.rank.titleKey)} <span aria-hidden="true">·</span> {t('rank.level', { level: rankProgress.level })}
            </p>
            {profile?.email && <p className="profile-email"><Mail size={14} aria-hidden="true" /><span>{profile.email}</span></p>}
          </div>
          <button type="button" className="profile-close" onClick={() => handleOpenChange(false)} aria-label={t('common.close')}>
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <dl className="profile-metrics">
          <div className="profile-metric">
            <Target className="profile-target-icon" size={21} aria-hidden="true" />
            <dt>{t('profile.target')}</dt>
            <dd>{profile?.targetLevel || '—'}</dd>
          </div>
          <div className="profile-metric">
            <ModelAsset name="xp" className="profile-metric-art" />
            <dt>XP</dt>
            <dd>{(stats?.xp ?? 0).toLocaleString(language)}</dd>
          </div>
          <div className="profile-metric">
            <ModelAsset name="streak" className="profile-metric-art" />
            <dt>{t('profile.streakLabel')}</dt>
            <dd>{currentStreak.toLocaleString(language)} {t('streak.days')}</dd>
          </div>
        </dl>
      </header>

      <Tabs defaultValue="settings" className="profile-tabs">
        <TabsList className="profile-tab-list" aria-label={t('nav.profile')}>
          <TabsTrigger value="settings" className="profile-tab">
            <Settings2 size={17} aria-hidden="true" />{t('profile.tab.settings')}
          </TabsTrigger>
          <TabsTrigger value="achievements" className="profile-tab">
            <Trophy size={17} aria-hidden="true" />{t('medals.title')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="profile-content profile-settings">
          <section aria-labelledby="profile-preferences">
            <h3 id="profile-preferences">{t('profile.preferences')}</h3>
            <div className="profile-settings-card">
              <div className="profile-setting-row profile-language-row">
                <div id="profile-language-label" className="profile-setting-label">
                  <Globe size={17} aria-hidden="true" />{t('language.label')}
                </div>
                <div role="group" aria-labelledby="profile-language-label" className="profile-language-options">
                  {PROFILE_LANGUAGES.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setLanguage(id)}
                      aria-pressed={language === id}
                    >
                      {t(`language.${id}`)}
                      {language === id && <Check size={14} aria-hidden="true" />}
                    </button>
                  ))}
                </div>
              </div>
              {!isPremium && onToggleDark && (
                <button type="button" role="switch" aria-checked={dark} className="profile-setting-row profile-setting-action" onClick={onToggleDark}>
                  <span className="profile-setting-label"><Moon size={17} aria-hidden="true" />{t('profile.darkMode')}</span>
                  <span className="profile-switch" aria-hidden="true" />
                </button>
              )}
            </div>
          </section>

          <section aria-labelledby="profile-account">
            <h3 id="profile-account">{t('profile.account')}</h3>
            <div className="profile-settings-card">
              <button type="button" className="profile-setting-row profile-setting-action" onClick={() => runAccountAction(onEditProfile)}>
                <span className="profile-setting-label"><Pencil size={17} aria-hidden="true" />{t('profile.edit')}</span>
                <ChevronRight size={16} aria-hidden="true" className="profile-row-end" />
              </button>
              <button type="button" className="profile-setting-row profile-setting-action" onClick={() => runAccountAction(onLogout)}>
                <span className="profile-setting-label"><LogOut size={17} aria-hidden="true" />{t('profile.logout')}</span>
                <ChevronRight size={16} aria-hidden="true" className="profile-row-end" />
              </button>
            </div>

            <div className="profile-reset">
              <button
                ref={clearButtonRef}
                type="button"
                className="profile-setting-row profile-setting-action profile-danger"
                onClick={() => confirmingClear ? cancelClear() : setConfirmingClear(true)}
                aria-expanded={confirmingClear}
                aria-controls={confirmingClear ? 'profile-clear-confirmation' : undefined}
              >
                <span className="profile-setting-label"><Trash2 size={17} aria-hidden="true" />{t('profile.clear')}</span>
                <ChevronRight size={16} aria-hidden="true" className="profile-row-end" />
              </button>

              {confirmingClear && (
                <div id="profile-clear-confirmation" className="profile-confirmation">
                  <p role="status">{t('profile.confirm.clear')}</p>
                  {clearFailed && <p role="alert">{t('profile.resetFailed')}</p>}
                  <div className="profile-confirm-actions">
                    <button type="button" autoFocus disabled={clearing} onClick={cancelClear}>{t('profile.cancel')}</button>
                    <button type="button" disabled={clearing} onClick={clearProgress}>{t(clearing ? 'auth.saving' : 'profile.delete')}</button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="achievements" className="profile-content profile-achievements">
          <TrophyCabinet metrics={trophyMetrics} unlockRecords={trophyUnlocks}>
            <StreakMilestones
              currentStreak={currentStreak}
              unlockedMilestones={streakMilestones}
              isPremium={isPremium}
              winterStudy={winterStudy}
              winterChampionUnlocked={winterChampionUnlocked}
            />
          </TrophyCabinet>
        </TabsContent>
      </Tabs>
    </Dialog>
  )
}

