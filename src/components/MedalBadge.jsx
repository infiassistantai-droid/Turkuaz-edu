import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'
import { getMedal, MEDAL_TONES } from '../lib/medals'

export default function MedalBadge({ medalId, isPremium = false, className }) {
  const { t } = useI18n()
  const medal = getMedal(medalId)
  if (!medal) return null
  const Icon = medal.icon

  return (
    <span
      className={cn(
        'inline-grid size-5 shrink-0 place-items-center rounded-full border',
        isPremium ? MEDAL_TONES[medal.tier].premium : MEDAL_TONES[medal.tier].default,
        className,
      )}
      title={t(medal.nameKey)}
      aria-label={t(medal.nameKey)}
    >
      <Icon className="size-3" aria-hidden="true" />
    </span>
  )
}
