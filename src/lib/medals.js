import { Award, Crown, Shield, Star } from 'lucide-react'

export const MEDALS = [
  { id: 'bronze-laurel', tier: 'bronze', icon: Award, nameKey: 'medals.bronze.name' },
  { id: 'silver-shield', tier: 'silver', icon: Shield, nameKey: 'medals.silver.name' },
  { id: 'gold-crown', tier: 'gold', icon: Crown, nameKey: 'medals.gold.name' },
  { id: 'diamond-star', tier: 'diamond', icon: Star, nameKey: 'medals.diamond.name' },
]

// Seeded inventory state for the initial medal experience; it is kept separate
// from XP, streaks, exam scores, and other learner achievement records.
export const DEFAULT_UNLOCKED_MEDALS = ['bronze-laurel', 'silver-shield']
export const DEFAULT_EQUIPPED_MEDAL = 'bronze-laurel'

export const MEDAL_TONES = {
  bronze: {
    default: 'border-orange-300 bg-orange-50 text-orange-700 shadow-[0_6px_18px_rgba(194,65,12,.12)]',
    premium: 'border-orange-300/30 bg-orange-400/15 text-orange-200 shadow-[0_0_24px_rgba(249,115,22,.22)] drop-shadow-[0_0_8px_rgba(249,115,22,.55)]',
  },
  silver: {
    default: 'border-slate-300 bg-slate-50 text-slate-600 shadow-[0_6px_18px_rgba(100,116,139,.12)]',
    premium: 'border-slate-200/30 bg-slate-100/10 text-slate-100 shadow-[0_0_24px_rgba(203,213,225,.16)] drop-shadow-[0_0_8px_rgba(203,213,225,.45)]',
  },
  gold: {
    default: 'border-amber-300 bg-amber-50 text-amber-700 shadow-[0_6px_18px_rgba(217,119,6,.16)]',
    premium: 'border-yellow-200/30 bg-yellow-300/15 text-yellow-100 shadow-[0_0_28px_rgba(250,204,21,.25)] drop-shadow-[0_0_9px_rgba(250,204,21,.55)]',
  },
  diamond: {
    default: 'border-cyan-300 bg-cyan-50 text-cyan-700 shadow-[0_6px_18px_rgba(8,145,178,.16)]',
    premium: 'border-cyan-200/30 bg-cyan-300/15 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,.24)] drop-shadow-[0_0_10px_rgba(34,211,238,.58)]',
  },
}

export function getMedal(medalId) {
  return MEDALS.find((medal) => medal.id === medalId) || null
}
