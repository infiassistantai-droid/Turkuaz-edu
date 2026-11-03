export const STREAK_MILESTONES = [
  3, 7, 14, 30,
  50, 90, 100, 180,
  270, 365, 500, 1000,
].map((days) => ({
  days,
  id: `streak-${days}`,
  image: `/images/streak/${days}-day.webp`,
  titleKey: 'streak.milestone.title',
  descriptionKey: 'streak.milestone.description',
}))

function normalizeStreak(value) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : 0
}

export function getNextStreakMilestone(currentStreak = 0) {
  const safeStreak = normalizeStreak(currentStreak)
  return STREAK_MILESTONES.find((milestone) => milestone.days > safeStreak) || null
}

export function getStreakMilestonesUpTo(currentStreak = 0) {
  const safeStreak = normalizeStreak(currentStreak)
  return STREAK_MILESTONES.filter((milestone) => milestone.days <= safeStreak).map((milestone) => milestone.days)
}

export function getStreakMilestone(days) {
  return STREAK_MILESTONES.find((milestone) => milestone.days === Number(days)) || null
}
