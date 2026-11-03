import { loadJSON, saveJSON } from './storage.js'

export const LISTENING_PROGRESS_PREFIX = 'turkuaz-edu-listening-progress-v1:'

function storageKey(identity) {
  const safeIdentity = String(identity || 'local').trim().toLowerCase()
  return `${LISTENING_PROGRESS_PREFIX}${encodeURIComponent(safeIdentity)}`
}

export function loadListeningProgress(identity) {
  const value = loadJSON(storageKey(identity), {})
  const lessons = value?.lessons && typeof value.lessons === 'object' && !Array.isArray(value.lessons)
    ? value.lessons
    : {}
  return { lessons }
}

export function getListeningCompletedCount(identity) {
  return Object.values(loadListeningProgress(identity).lessons)
    .filter((lesson) => Boolean(lesson?.completedAt)).length
}

/** Records one completed lesson attempt and grants each lesson/flawless reward once. */
export function completeListeningLesson(identity, lessonId, scorePct) {
  const progress = loadListeningProgress(identity)
  const previous = progress.lessons[lessonId] || {}
  const flawless = scorePct === 100
  const firstCompletion = !previous.completedAt
  const newlyFlawless = flawless && !previous.flawlessAwarded
  const xpAward = (firstCompletion ? 35 : 0) + (newlyFlawless ? 15 : 0)
  const now = new Date().toISOString()
  const record = {
    ...previous,
    completedAt: previous.completedAt || now,
    lastAttemptAt: now,
    attempts: Math.max(0, Number(previous.attempts) || 0) + 1,
    bestScore: Math.max(0, Number(previous.bestScore) || 0, Number(scorePct) || 0),
    flawlessAwarded: Boolean(previous.flawlessAwarded || flawless),
    xpAwarded: Math.max(0, Number(previous.xpAwarded) || 0) + xpAward,
  }
  const lessons = { ...progress.lessons, [lessonId]: record }
  saveJSON(storageKey(identity), { lessons })
  return {
    record,
    completedCount: Object.values(lessons).filter((lesson) => Boolean(lesson?.completedAt)).length,
    firstCompletion,
    newlyFlawless,
    xpAward,
  }
}
