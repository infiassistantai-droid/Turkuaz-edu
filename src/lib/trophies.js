export const TROPHY_REWARD_XP = Object.freeze({
  'xp-1000': 20,
  'xp-5000': 50,
  'tests-100': 50,
  'streak-7': 15,
  'streak-30': 35,
  reading: 35,
  listening: 35,
  'words-50': 15,
  'words-500': 50,
  flawless: 25,
  speed: 20,
  efsane: 100,
  'listening-path': 30,
  'mock-expert': 50,
  'spring-champion': 40,
  'summer-champion': 40,
  'autumn-champion': 40,
  'winter-champion': 40,
})

// The three core shelves map to the requested 4-column, 3-row cabinet order.
export const TROPHY_SHELVES = [
  { id: 'shelf-1', titleKey: 'trophy.shelf.foundation', trophyIds: ['xp-1000', 'xp-5000', 'tests-100', 'streak-7'] },
  { id: 'shelf-2', titleKey: 'trophy.shelf.mastery', trophyIds: ['streak-30', 'reading', 'listening', 'words-50'] },
  { id: 'shelf-3', titleKey: 'trophy.shelf.legend', trophyIds: ['words-500', 'flawless', 'speed', 'efsane'] },
  { id: 'shelf-practice', titleKey: 'trophy.shelf.practice', trophyIds: ['listening-path', 'mock-expert'] },
]

export const TROPHIES = [
  { id: 'xp-1000', image: '/images/trophies/core-xp-1000.png', titleKey: 'trophy.xp1000.title', descriptionKey: 'trophy.xp1000.description', metric: 'xp', target: 1000, progressKey: 'trophy.progress.xp' },
  { id: 'xp-5000', image: '/images/trophies/core-xp-5000.png', titleKey: 'trophy.xp5000.title', descriptionKey: 'trophy.xp5000.description', metric: 'xp', target: 5000, progressKey: 'trophy.progress.xp' },
  { id: 'tests-100', image: '/images/trophies/core-tests-100.png', titleKey: 'trophy.tests100.title', descriptionKey: 'trophy.tests100.description', metric: 'completedQuizzes', target: 100, progressKey: 'trophy.progress.tests' },
  { id: 'streak-7', image: '/images/trophies/core-streak-7.png', titleKey: 'trophy.streak7.title', descriptionKey: 'trophy.streak7.description', metric: 'streak', target: 7, progressKey: 'trophy.progress.days' },
  { id: 'streak-30', image: '/images/trophies/core-streak-30.png', titleKey: 'trophy.streak30.title', descriptionKey: 'trophy.streak30.description', metric: 'streak', target: 30, progressKey: 'trophy.progress.days' },
  { id: 'reading', image: '/images/trophies/core-reading.png', titleKey: 'trophy.reading.title', descriptionKey: 'trophy.reading.description', metric: 'readingCompletedCount', target: 5, progressKey: 'trophy.progress.passages' },
  { id: 'listening', image: '/images/trophies/core-listening.png', titleKey: 'trophy.listening.title', descriptionKey: 'trophy.listening.description', metric: 'listeningPercent', target: 80, progressKey: 'trophy.progress.percent' },
  { id: 'words-50', image: '/images/trophies/core-words-50.png', titleKey: 'trophy.words50.title', descriptionKey: 'trophy.words50.description', metric: 'savedWordsCount', target: 50, progressKey: 'trophy.progress.words' },
  { id: 'words-500', image: '/images/trophies/core-words-500.png', titleKey: 'trophy.words500.title', descriptionKey: 'trophy.words500.description', metric: 'savedWordsCount', target: 500, progressKey: 'trophy.progress.words' },
  { id: 'flawless', image: '/images/trophies/core-flawless.png', titleKey: 'trophy.flawless.title', descriptionKey: 'trophy.flawless.description', metric: 'flawlessQuizAchieved', target: 1, progressKey: 'trophy.progress.perfect' },
  { id: 'speed', image: '/images/trophies/core-speed.png', titleKey: 'trophy.speed.title', descriptionKey: 'trophy.speed.description', metric: 'speedBonusAchieved', target: 1, progressKey: 'trophy.progress.speed' },
  { id: 'efsane', image: '/images/trophies/core-efsane.png', titleKey: 'trophy.efsane.title', descriptionKey: 'trophy.efsane.description', metric: 'xp', target: 12500, progressKey: 'trophy.progress.xp' },
  { id: 'listening-path', image: '/images/trophies/core-listening-path.png', titleKey: 'trophy.listeningPath.title', descriptionKey: 'trophy.listeningPath.description', metric: 'listeningLessonsCompleted', target: 10, progressKey: 'trophy.progress.activities' },
  { id: 'mock-expert', image: '/images/trophies/core-mock-expert.png', titleKey: 'trophy.mockExpert.title', descriptionKey: 'trophy.mockExpert.description', metric: 'completedMocks', target: 3, progressKey: 'trophy.progress.activities' },
  ...['spring', 'summer', 'autumn', 'winter'].map((season) => ({
    id: `${season}-champion`,
    season,
    image: `/images/trophies/cup-${season}.png`,
    titleKey: `trophy.season.${season}`,
    descriptionKey: season === 'winter' ? 'trophy.season.winterDescription' : 'trophy.season.description',
    metric: 'seasonStudyDays',
    target: 14,
    progressKey: 'trophy.progress.days',
  })),
]

export const CORE_TROPHIES = TROPHIES.filter((trophy) => !trophy.season)
export const SEASONAL_TROPHIES = TROPHIES.filter((trophy) => trophy.season)

// Keep season years separate. December and the following January/February share a winter.
const SEASONS_BY_MONTH = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter']

export function getSeasonStudyDays(dailyXp = {}) {
  const runs = {}
  const best = { spring: 0, summer: 0, autumn: 0, winter: 0 }
  for (const [day, xp] of Object.entries(dailyXp || {})) {
    if (!/^\d{4}-\d{2}-\d{2}$/u.test(day) || !(Number(xp) > 0)) continue
    const [year, month] = day.split('-').map(Number)
    const season = SEASONS_BY_MONTH[month - 1]
    if (!season) continue
    const run = `${season}-${month === 12 ? year + 1 : year}`
    runs[run] = (runs[run] || 0) + 1
    best[season] = Math.max(best[season], runs[run])
  }
  return best
}

const TROPHY_BY_ID = new Map(TROPHIES.map((trophy) => [trophy.id, trophy]))

export function getTrophy(trophyId) {
  return TROPHY_BY_ID.get(trophyId) || null
}

export function getTrophyProgress(trophy, metrics = {}) {
  if (!trophy) return { current: 0, target: 1, percent: 0, unlocked: false }
  const safeMetrics = metrics && typeof metrics === 'object' && !Array.isArray(metrics) ? metrics : {}
  let current = trophy.season ? safeMetrics.seasonStudyDays?.[trophy.season] : safeMetrics[trophy.metric]
  if (trophy.season === 'winter') current = Math.max(Number(current) || 0, Number(safeMetrics.winterStudyDays) || 0)
  if (trophy.id === 'reading' && safeMetrics.readingPerfectExamAchieved) {
    current = trophy.target
  }
  if (trophy.metric === 'streak') {
    const earnedDays = Array.isArray(safeMetrics.streakMilestones) ? safeMetrics.streakMilestones.map(Number) : []
    current = earnedDays.includes(trophy.target) || Number(safeMetrics.currentStreak) >= trophy.target
      ? trophy.target
      : Number(safeMetrics.currentStreak) || 0
  } else if (trophy.metric === 'flawlessQuizAchieved' || trophy.metric === 'speedBonusAchieved') {
    current = current ? 1 : 0
  }
  const numericCurrent = Number(current)
  const safeCurrent = Number.isFinite(numericCurrent) ? Math.max(0, numericCurrent) : 0
  const target = trophy.target
  return {
    current: Math.min(safeCurrent, target),
    target,
    percent: Math.max(0, Math.min(100, Math.round((safeCurrent / target) * 100))),
    unlocked: safeCurrent >= target,
  }
}
