export type CefrLevel = 'Below B1' | 'B1' | 'B2' | 'C1'
export type SkillKey = 'dinleme' | 'okuma' | 'yazma' | 'konusma'

export const MULTILEVEL_SKILLS: SkillKey[] = ['dinleme', 'okuma', 'yazma', 'konusma']

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))
const round2 = (value: number) => Math.round(value * 100) / 100

/** Map one raw listening/reading point count to the supplied 75-point rubric. */
export function scoreListeningReading(rawScore: number) {
  const raw = clamp(rawScore, 0, 35)
  let scaled: number

  if (raw <= 9) scaled = (raw / 9) * 37
  else if (raw <= 17) scaled = 38 + ((raw - 10) / 7) * 12
  else if (raw <= 27) scaled = 51 + ((raw - 18) / 9) * 13
  else scaled = 65 + ((raw - 28) / 7) * 10

  return round2(clamp(scaled, 0, 75))
}

// User-provided writing/speaking raw-score lookup, represented as inclusive upper bounds.
const PERFORMANCE_BANDS: Array<{ max: number; scaled: number }> = [
  { max: 14.5, scaled: 38 }, { max: 15.0, scaled: 39 }, { max: 15.5, scaled: 40 },
  { max: 16.0, scaled: 41 }, { max: 16.5, scaled: 42 }, { max: 17.0, scaled: 43 },
  { max: 17.5, scaled: 44 }, { max: 18.0, scaled: 45 }, { max: 18.5, scaled: 46 },
  { max: 19.0, scaled: 47 }, { max: 19.5, scaled: 48 }, { max: 20.0, scaled: 49 },
  { max: 20.5, scaled: 50 }, { max: 21.0, scaled: 51 }, { max: 21.5, scaled: 52 },
  { max: 22.0, scaled: 53 }, { max: 22.5, scaled: 54 }, { max: 23.0, scaled: 55 },
  { max: 23.5, scaled: 56 }, { max: 24.0, scaled: 57 }, { max: 24.5, scaled: 58 },
  { max: 25.0, scaled: 59 }, { max: 25.5, scaled: 60 }, { max: 26.0, scaled: 61 },
  { max: 26.5, scaled: 62 }, { max: 27.0, scaled: 63 }, { max: 28.0, scaled: 64 },
  { max: 29.0, scaled: 65 }, { max: 30.0, scaled: 66 }, { max: 30.5, scaled: 67 },
  { max: 31.0, scaled: 68 }, { max: 31.5, scaled: 69 }, { max: 32.0, scaled: 70 },
  { max: 32.5, scaled: 71 }, { max: 33.0, scaled: 72 }, { max: 34.0, scaled: 73 },
  { max: 35.0, scaled: 74 }, { max: 36.0, scaled: 75 },
]

/** Convert a 0–36 writing/speaking raw score using the supplied lookup table. */
export function scoreWritingSpeaking(rawScore: number) {
  const raw = clamp(rawScore, 0, 36)
  if (raw < 14.1) return round2((raw / 14.1) * 37)
  return PERFORMANCE_BANDS.find((band) => raw <= band.max)?.scaled ?? 75
}

export function getCefrLevel(score: number): CefrLevel {
  const value = clamp(score, 0, 75)
  if (value >= 65) return 'C1'
  if (value >= 51) return 'B2'
  if (value >= 38) return 'B1'
  return 'Below B1'
}

export type SectionScores = Partial<Record<SkillKey, number>>

/** Average the four 0–75 section scores; missing sections are zero until attempted. */
export function calculateOverallScore(scores: SectionScores) {
  const sum = MULTILEVEL_SKILLS.reduce((total, key) => total + clamp(scores[key] ?? 0, 0, 75), 0)
  return round2(sum / MULTILEVEL_SKILLS.length)
}

export function calculateCertificate(scores: SectionScores) {
  const average = calculateOverallScore(scores)
  return { average, level: getCefrLevel(average), completedSections: MULTILEVEL_SKILLS.filter((key) => typeof scores[key] === 'number').length }
}

export function scoreSection(section: SkillKey, rawScore: number) {
  const boundedRaw = clamp(rawScore, 0, section === 'dinleme' || section === 'okuma' ? 35 : 36)
  const scaledScore = section === 'dinleme' || section === 'okuma'
    ? scoreListeningReading(boundedRaw)
    : scoreWritingSpeaking(boundedRaw)
  return { section, rawScore: round2(boundedRaw), maxRawScore: section === 'dinleme' || section === 'okuma' ? 35 : 36, scaledScore, level: getCefrLevel(scaledScore) }
}

export function scoreWritingTasks(task1Raw: number, task2Raw: number) {
  const task1 = clamp(task1Raw, 0, 12)
  const task2 = clamp(task2Raw, 0, 24)
  return { task1Raw: round2(task1), task2Raw: round2(task2), rawScore: round2(task1 + task2), maxRawScore: 36, scaledScore: scoreWritingSpeaking(task1 + task2) }
}

export function scoreSpeakingParts(parts: number[]) {
  const bounded = [0, 1, 2].map((index) => clamp(parts[index] ?? 0, 0, 12))
  const rawScore = bounded.reduce((sum, value) => sum + value, 0)
  return { parts: bounded.map(round2), rawScore: round2(rawScore), maxRawScore: 36, scaledScore: scoreWritingSpeaking(rawScore) }
}
