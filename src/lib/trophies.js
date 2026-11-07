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
  'winter-champion': 40,
})

// The three core shelves map to the requested 4-column, 3-row cabinet order.
export const TROPHY_SHELVES = [
  { id: 'shelf-1', titleKey: 'trophy.shelf.foundation', trophyIds: ['xp-1000', 'xp-5000', 'tests-100', 'streak-7'] },
  { id: 'shelf-2', titleKey: 'trophy.shelf.mastery', trophyIds: ['streak-30', 'reading', 'listening', 'words-50'] },
  { id: 'shelf-3', titleKey: 'trophy.shelf.legend', trophyIds: ['words-500', 'flawless', 'speed', 'efsane'] },
]

export const TROPHIES = [
  { id: 'xp-1000', image: '/images/achievements/optimized/badge-07-first-step.webp', titleKey: 'trophy.xp1000.title', descriptionKey: 'trophy.xp1000.description', metric: 'xp', target: 1000, progressKey: 'trophy.progress.xp' },
  { id: 'xp-5000', image: '/images/achievements/optimized/badge-05-infinity-xp.webp', titleKey: 'trophy.xp5000.title', descriptionKey: 'trophy.xp5000.description', metric: 'xp', target: 5000, progressKey: 'trophy.progress.xp' },
  { id: 'tests-100', image: '/images/achievements/optimized/badge-03-bmba-cup.webp', titleKey: 'trophy.tests100.title', descriptionKey: 'trophy.tests100.description', metric: 'completedQuizzes', target: 100, progressKey: 'trophy.progress.tests' },
  { id: 'streak-7', image: '/images/achievements/optimized/badge-10-hourglass-patience.webp', titleKey: 'trophy.streak7.title', descriptionKey: 'trophy.streak7.description', metric: 'streak', target: 7, progressKey: 'trophy.progress.days' },
  { id: 'streak-30', image: '/images/achievements/optimized/badge-06-phoenix-guardian.webp', titleKey: 'trophy.streak30.title', descriptionKey: 'trophy.streak30.description', metric: 'streak', target: 30, progressKey: 'trophy.progress.days' },
  { id: 'reading', image: '/images/achievements/optimized/badge-01-wise-owl.webp', titleKey: 'trophy.reading.title', descriptionKey: 'trophy.reading.description', metric: 'readingCompletedCount', target: 5, progressKey: 'trophy.progress.passages' },
  { id: 'listening', image: '/images/achievements/optimized/badge-08-golden-microphone.webp', titleKey: 'trophy.listening.title', descriptionKey: 'trophy.listening.description', metric: 'listeningPercent', target: 80, progressKey: 'trophy.progress.percent' },
  { id: 'words-50', image: '/images/achievements/optimized/badge-04-polyglot-globe.webp', titleKey: 'trophy.words50.title', descriptionKey: 'trophy.words50.description', metric: 'savedWordsCount', target: 50, progressKey: 'trophy.progress.words' },
  { id: 'words-500', image: '/images/achievements/optimized/badge-02-crowned-dictionary.webp', titleKey: 'trophy.words500.title', descriptionKey: 'trophy.words500.description', metric: 'savedWordsCount', target: 500, progressKey: 'trophy.progress.words' },
  { id: 'flawless', image: '/images/achievements/optimized/badge-11-perfect-ruby-star.webp', titleKey: 'trophy.flawless.title', descriptionKey: 'trophy.flawless.description', metric: 'flawlessQuizAchieved', target: 1, progressKey: 'trophy.progress.perfect' },
  { id: 'speed', image: '/images/achievements/optimized/badge-09-writer-quill.webp', titleKey: 'trophy.speed.title', descriptionKey: 'trophy.speed.description', metric: 'speedBonusAchieved', target: 1, progressKey: 'trophy.progress.speed' },
  { id: 'efsane', image: '/images/achievements/optimized/badge-12-hero-shield.webp', titleKey: 'trophy.efsane.title', descriptionKey: 'trophy.efsane.description', metric: 'xp', target: 12500, progressKey: 'trophy.progress.xp' },
  { id: 'winter-champion', image: '/images/trophies/winter-champion.svg', titleKey: 'winter.trophy.title', descriptionKey: 'winter.trophy.description', metric: 'winterStudyDays', target: 14, progressKey: 'winter.trophy.progress' },
]

export const CORE_TROPHIES = TROPHIES.filter((trophy) => trophy.id !== 'winter-champion')
export const SEASONAL_TROPHIES = TROPHIES.filter((trophy) => trophy.id === 'winter-champion')

const TROPHY_BY_ID = new Map(TROPHIES.map((trophy) => [trophy.id, trophy]))

export function getTrophy(trophyId) {
  return TROPHY_BY_ID.get(trophyId) || null
}

export function getTrophyProgress(trophy, metrics = {}) {
  if (!trophy) return { current: 0, target: 1, percent: 0, unlocked: false }
  const safeMetrics = metrics && typeof metrics === 'object' && !Array.isArray(metrics) ? metrics : {}
  let current = safeMetrics[trophy.metric]
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
