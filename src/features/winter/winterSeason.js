export const WINTER_CHAMPION_TROPHY_ID = 'winter-champion'
export const WINTER_CHAMPION_DAYS = 14

/** Winter campaign window for the app's Northern Hemisphere learner base: Dec 1–Feb 28/29. */
export function getWinterSeasonId(value = new Date()) {
  const date = value instanceof Date ? value : parseLocalDate(value)
  if (!date || Number.isNaN(date.getTime())) return null
  const month = date.getMonth()
  if (month === 11) return `${date.getFullYear()}-${date.getFullYear() + 1}`
  if (month === 0 || month === 1) return `${date.getFullYear() - 1}-${date.getFullYear()}`
  return null
}

function parseLocalDate(value) {
  if (typeof value !== 'string') return new Date(value)
  const parts = value.split('-').map(Number)
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) return new Date(value)
  return new Date(parts[0], parts[1] - 1, parts[2], 12)
}

export function normalizeWinterStudy(progress) {
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) return { seasonId: null, days: [] }
  const days = Array.isArray(progress.days)
    ? [...new Set(progress.days.filter((day) => typeof day === 'string' && /^\d{4}-\d{2}-\d{2}$/u.test(day)))].sort()
    : []
  return { seasonId: typeof progress.seasonId === 'string' ? progress.seasonId : null, days }
}

export function recordWinterStudyDay(progress, value = new Date()) {
  const date = value instanceof Date ? value : parseLocalDate(value)
  if (!date || Number.isNaN(date.getTime())) return normalizeWinterStudy(progress)
  const seasonId = getWinterSeasonId(date)
  if (!seasonId) return normalizeWinterStudy(progress)
  const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const previous = normalizeWinterStudy(progress)
  const days = previous.seasonId === seasonId ? previous.days : []
  return { seasonId, days: [...new Set([...days, day])].sort() }
}

export function getWinterStudyDayCount(progress, value = new Date()) {
  const seasonId = getWinterSeasonId(value)
  const normalized = normalizeWinterStudy(progress)
  return seasonId && normalized.seasonId === seasonId ? normalized.days.length : 0
}

export function isWinterSeason(value = new Date()) {
  return getWinterSeasonId(value) !== null
}
