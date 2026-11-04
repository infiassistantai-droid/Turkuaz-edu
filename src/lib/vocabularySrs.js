import { loadJSON, saveJSON } from './storage'

export const VOCABULARY_SRS_KEY = 'turkuaz-edu-vocabulary-srs-v1'

export function recordVocabularyRating(word, rating, now = Date.now()) {
  const all = loadJSON(VOCABULARY_SRS_KEY, {})
  const previous = all[word] || { repetitions: 0, intervalDays: 0 }
  let repetitions = previous.repetitions || 0
  let intervalDays = previous.intervalDays || 0

  if (rating === 'again') {
    repetitions = 0
    intervalDays = 0
  } else if (rating === 'hard') {
    repetitions += 1
    intervalDays = intervalDays ? Math.max(1, Math.round(intervalDays * 1.2)) : 1
  } else {
    repetitions += 1
    intervalDays = intervalDays ? Math.max(2, Math.ceil(intervalDays * 2.5)) : 4
  }

  const nextDueAt = rating === 'again'
    ? now + 10 * 60 * 1000
    : now + intervalDays * 24 * 60 * 60 * 1000
  const record = { rating, repetitions, intervalDays, lastReviewedAt: now, nextDueAt }
  saveJSON(VOCABULARY_SRS_KEY, { ...all, [word]: record })
  return record
}
