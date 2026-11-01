import { useEffect, useState } from 'react'
import { Check, Lock, Sparkles } from 'lucide-react'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'
import { MEDALS, MEDAL_TONES } from '../lib/medals'

export default function MedalInventory({ unlockedMedals = [], equippedMedal, onEquipMedal, isPremium = false, showTitle = true }) {
  const { t } = useI18n()
  const [selectedId, setSelectedId] = useState(equippedMedal || unlockedMedals[0] || null)

  useEffect(() => {
    if (equippedMedal) setSelectedId(equippedMedal)
  }, [equippedMedal])

  const selectedMedal = MEDALS.find((medal) => medal.id === selectedId)
  const selectedIsUnlocked = unlockedMedals.includes(selectedId)
  const selectedIsEquipped = selectedId === equippedMedal

  return (
    <section
      className={cn('border-b p-3', isPremium ? 'border-white/10' : 'border-slate-100 dark:border-slate-800')}
      aria-labelledby={showTitle ? 'profile-achievements-title' : undefined}
      aria-label={showTitle ? undefined : t('medals.title')}
    >
      {showTitle && (
        <h3 id="profile-achievements-title" className={cn('mb-2.5 flex items-center gap-2 text-xs font-extrabold', isPremium ? 'text-white/80' : 'text-slate-700 dark:text-slate-200')}>
          <Sparkles className={cn('size-3.5', isPremium ? 'text-yellow-200' : 'text-amber-500')} aria-hidden="true" />
          {t('medals.title')}
        </h3>
      )}

      <div className="grid grid-cols-2 gap-2">
        {MEDALS.map((medal) => {
          const Icon = medal.icon
          const unlocked = unlockedMedals.includes(medal.id)
          const equipped = equippedMedal === medal.id
          const tone = MEDAL_TONES[medal.tier]

          return (
            <button
              key={medal.id}
              type="button"
              onClick={() => unlocked && setSelectedId(medal.id)}
              disabled={!unlocked}
              aria-pressed={selectedId === medal.id}
              aria-label={`${t(medal.nameKey)} · ${unlocked ? equipped ? t('medals.equipped') : t('medals.select') : t('medals.locked')}`}
              className={cn(
                'relative flex min-h-[92px] flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border p-2 text-center transition-all duration-300',
                unlocked
                  ? cn('hover:-translate-y-0.5 hover:brightness-105', isPremium ? 'bg-white/[.045] text-white' : 'bg-white text-slate-800', tone[isPremium ? 'premium' : 'default'])
                  : cn('cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 grayscale opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500', isPremium && 'border-white/10 bg-black/25 text-white/35'),
                selectedId === medal.id && unlocked && (isPremium ? 'ring-1 ring-yellow-100/35' : 'ring-1 ring-slate-300'),
              )}
            >
              {equipped && <span className="absolute left-1 top-1 inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-1 py-0.5 text-[7px] font-black leading-none text-emerald-700 dark:text-emerald-300"><Check className="size-2" aria-hidden="true" />{t('medals.equipped')}</span>}
              {!unlocked && <Lock className="absolute right-1.5 top-1.5 size-3" aria-hidden="true" />}
              <span className={cn('grid size-9 place-items-center rounded-xl border', unlocked ? tone[isPremium ? 'premium' : 'default'] : 'border-slate-300 bg-slate-200 dark:border-slate-700 dark:bg-slate-700')}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-[10px] font-extrabold leading-tight">{t(medal.nameKey)}</span>
              <span className={cn('text-[9px] font-bold uppercase tracking-wider', unlocked ? isPremium ? 'text-white/50' : 'text-slate-500' : 'text-slate-400')}>
                {t(`medals.tier.${medal.tier}`)}
              </span>
            </button>
          )
        })}
      </div>

      {selectedMedal && selectedIsUnlocked && (
        <div className={cn('mt-2.5 flex items-center justify-between gap-2 rounded-xl border p-2', isPremium ? 'border-white/10 bg-black/30' : 'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60')}>
          <span className={cn('min-w-0 truncate text-[10px] font-bold', isPremium ? 'text-white/70' : 'text-slate-600 dark:text-slate-300')}>
            {t(selectedMedal.nameKey)}
          </span>
          <button
            type="button"
            onClick={() => onEquipMedal?.(selectedId)}
            disabled={selectedIsEquipped}
            className={cn(
              'shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-extrabold transition-all disabled:cursor-default',
              selectedIsEquipped
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                : isPremium
                  ? 'bg-gradient-to-r from-yellow-300 to-amber-400 text-slate-950 shadow-[0_0_16px_rgba(250,204,21,.2)] hover:shadow-[0_0_22px_rgba(250,204,21,.35)]'
                  : 'bg-teal-700 text-white shadow-sm hover:bg-teal-800',
            )}
          >
            {selectedIsEquipped ? t('medals.equipped') : t('medals.equip')}
          </button>
        </div>
      )}
    </section>
  )
}
