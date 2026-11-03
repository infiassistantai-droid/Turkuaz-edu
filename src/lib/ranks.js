export const XP_PER_LEVEL = 500

export const RANKS = [
  { id: 'cirak', minLevel: 1, maxLevel: 5, image: '/images/ranks/cirak.png', titleKey: 'rank.cirak' },
  { id: 'yolcu', minLevel: 6, maxLevel: 10, image: '/images/ranks/yolcu.png', titleKey: 'rank.yolcu' },
  { id: 'gezgin', minLevel: 11, maxLevel: 15, image: '/images/ranks/gezgin.png', titleKey: 'rank.gezgin' },
  { id: 'bilgin', minLevel: 16, maxLevel: 20, image: '/images/ranks/bilgin.png', titleKey: 'rank.bilgin' },
  { id: 'uzman', minLevel: 21, maxLevel: 25, image: '/images/ranks/uzman.png', titleKey: 'rank.uzman' },
  { id: 'efsane', minLevel: 26, maxLevel: Number.POSITIVE_INFINITY, image: '/images/ranks/efsane.png', titleKey: 'rank.efsane' },
]

export function levelFromXp(value) {
  const xp = Math.max(0, Number(value) || 0)
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function getRankForLevel(level) {
  const safeLevel = Math.max(1, Number(level) || 1)
  return RANKS.find((rank) => safeLevel >= rank.minLevel && safeLevel <= rank.maxLevel) || RANKS[0]
}

export function getRankProgress(value) {
  const xp = Math.max(0, Number(value) || 0)
  const level = levelFromXp(xp)
  const rank = getRankForLevel(level)
  const rankIndex = RANKS.findIndex((item) => item.id === rank.id)
  const nextRank = RANKS[rankIndex + 1] || null
  const currentRankStartXp = (rank.minLevel - 1) * XP_PER_LEVEL
  const nextRankXp = nextRank ? (nextRank.minLevel - 1) * XP_PER_LEVEL : null
  const xpToNextRank = nextRank ? Math.max(0, nextRankXp - xp) : 0
  const progress = nextRank
    ? Math.max(0, Math.min(100, ((xp - currentRankStartXp) / (nextRankXp - currentRankStartXp)) * 100))
    : 100

  return { xp, level, rank, nextRank, nextRankXp, xpToNextRank, progress }
}
