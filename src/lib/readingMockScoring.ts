import { scoreSection, type CefrLevel } from './multilevelScoring'

export type ReadingMockScore = {
  rawScore: number
  maxRawScore: 35
  scaledScore: number
  level: CefrLevel
}

/**
 * Apply the user's supplied 0–35 to 0–75 Reading rubric.
 * Raw scores are whole correct-answer counts; the shared multilevel utility
 * applies the four stated piecewise bands and CEFR thresholds.
 */
export function scoreReadingMock(rawScore: number): ReadingMockScore {
  const boundedRawScore = Math.max(0, Math.min(35, Math.round(Number.isFinite(rawScore) ? rawScore : 0)))
  const score = scoreSection('okuma', boundedRawScore)
  return {
    rawScore: boundedRawScore,
    maxRawScore: 35,
    scaledScore: score.scaledScore,
    level: score.level,
  }
}
