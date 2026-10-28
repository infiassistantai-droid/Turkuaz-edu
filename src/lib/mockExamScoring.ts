import {
  calculateCertificate,
  scoreSection,
  scoreSpeakingParts,
  scoreWritingTasks,
  type CefrLevel,
  type SkillKey,
} from './multilevelScoring'
import type { MockQuestion, MockWritingTask } from '../data/mockDatabase'

export type MockSectionScore = {
  section: SkillKey
  rawScore: number
  maxRawScore: number
  scaledScore: number
  level: CefrLevel
  earnedXp: number
  breakdown?: Array<{ id: string; title: string; rawScore: number; maxRawScore: number }>
}

export function gradeObjectiveSection(
  section: 'dinleme' | 'okuma',
  questions: MockQuestion[],
  answers: Record<string, string>,
  partTitles: Record<string, string> = {},
): MockSectionScore {
  const rawScore = questions.reduce((score, question) => score + (answers[question.id] === question.correctAnswer ? 1 : 0), 0)
  const scored = scoreSection(section, rawScore)
  const grouped = new Map<string, { rawScore: number; maxRawScore: number }>()
  for (const question of questions) {
    const key = question.id.split('-q')[0].replace(/-\d+$/u, '')
    const item = grouped.get(key) ?? { rawScore: 0, maxRawScore: 0 }
    item.maxRawScore += 1
    if (answers[question.id] === question.correctAnswer) item.rawScore += 1
    grouped.set(key, item)
  }
  return {
    ...scored,
    earnedXp: Math.round(scored.scaledScore),
    breakdown: [...grouped.entries()].map(([id, score]) => ({ id, title: partTitles[id] ?? id, ...score })),
  }
}

const TURKISH_CONNECTORS = [
  'ancak', 'ayrıca', 'bununla birlikte', 'çünkü', 'dolayısıyla', 'örneğin',
  'öncelikle', 'sonuç olarak', 'üstelik', 'bu nedenle', 'buna rağmen', 'öte yandan',
]

export type WritingTaskEvaluation = {
  rawScore: number
  maxRawScore: number
  wordCount: number
  connectorCount: number
  paragraphCount: number
  vocabularyDiversity: number
  criteria: { length: number; organization: number; cohesion: number; vocabulary: number }
}

export function evaluateWritingTask(text: string, task: MockWritingTask): WritingTaskEvaluation {
  const tokens = text.trim() ? text.trim().split(/\s+/u).filter(Boolean) : []
  const normalized = text.toLocaleLowerCase('tr-TR')
  const uniqueWords = new Set(tokens.map((word) => word.toLocaleLowerCase('tr-TR').replace(/[^\p{L}\p{N}]/gu, '')).filter((word) => word.length > 2))
  const vocabularyDiversity = tokens.length ? uniqueWords.size / tokens.length : 0
  const connectorCount = TURKISH_CONNECTORS.filter((connector) => new RegExp(`\\b${connector.replaceAll(' ', '\\s+')}\\b`, 'iu').test(normalized)).length
  const paragraphCount = text.split(/\n\s*\n/u).map((paragraph) => paragraph.trim()).filter(Boolean).length
  const sentenceCount = (text.match(/[.!?]+/gu) ?? []).length
  const length = tokens.length >= task.minWords && tokens.length <= task.maxWords
    ? 1
    : tokens.length < task.minWords
      ? Math.min(1, tokens.length / task.minWords)
      : Math.min(1, task.maxWords / tokens.length)
  const organization = Math.min(1, paragraphCount / 3) * 0.55 + Math.min(1, sentenceCount / (task.task === 1 ? 5 : 7)) * 0.45
  const cohesion = Math.min(1, connectorCount / (task.task === 1 ? 3 : 5))
  const vocabulary = Math.min(1, Math.max(0, (vocabularyDiversity - 0.2) / 0.38))
  const minimumUsefulLength = Math.ceil(task.minWords * 0.55)
  const lengthFactor = tokens.length >= minimumUsefulLength ? 1 : tokens.length / minimumUsefulLength
  const rawScore = Math.max(0, Math.min(task.maxRaw, Math.round(task.maxRaw * (0.3 * length + 0.25 * organization + 0.2 * cohesion + 0.25 * vocabulary) * lengthFactor)))
  return {
    rawScore,
    maxRawScore: task.maxRaw,
    wordCount: tokens.length,
    connectorCount,
    paragraphCount,
    vocabularyDiversity: Math.round(vocabularyDiversity * 100),
    criteria: { length, organization, cohesion, vocabulary },
  }
}

export function gradeWritingSection(tasks: MockWritingTask[], responses: Record<string, string>): MockSectionScore & { tasks: WritingTaskEvaluation[] } {
  const evaluations = tasks.map((task) => evaluateWritingTask(responses[task.id] ?? '', task))
  const first = evaluations.find((_, index) => tasks[index]?.task === 1)?.rawScore ?? 0
  const second = evaluations.find((_, index) => tasks[index]?.task === 2)?.rawScore ?? 0
  const scored = scoreWritingTasks(first, second)
  return {
    section: 'yazma',
    rawScore: scored.rawScore,
    maxRawScore: scored.maxRawScore,
    scaledScore: scored.scaledScore,
    level: scoreSection('yazma', scored.rawScore).level,
    earnedXp: Math.round(scored.scaledScore),
    breakdown: tasks.map((task, index) => ({ id: task.id, title: task.rubricLabel, rawScore: evaluations[index].rawScore, maxRawScore: task.maxRaw })),
    tasks: evaluations,
  }
}

export function gradeSpeakingSection(partIds: string[], scores: Record<string, number>): MockSectionScore {
  const partScores = partIds.map((id) => Math.max(0, Math.min(12, Number(scores[id] ?? 0))))
  const scored = scoreSpeakingParts(partScores)
  return {
    section: 'konusma',
    rawScore: scored.rawScore,
    maxRawScore: scored.maxRawScore,
    scaledScore: scored.scaledScore,
    level: scoreSection('konusma', scored.rawScore).level,
    earnedXp: Math.round(scored.scaledScore),
    breakdown: partIds.map((id, index) => ({ id, title: `Konuşma ${index + 1}`, rawScore: partScores[index], maxRawScore: 12 })),
  }
}

export function gradeFullMock(scores: Partial<Record<SkillKey, MockSectionScore>>) {
  const scaled = Object.fromEntries(
    (['dinleme', 'okuma', 'yazma', 'konusma'] as SkillKey[]).map((skill) => [skill, scores[skill]?.scaledScore ?? 0]),
  ) as Record<SkillKey, number>
  const certificate = calculateCertificate(scaled)
  return {
    scores: scaled,
    overallScore: certificate.average,
    level: certificate.level,
    completedSections: certificate.completedSections,
    earnedXp: Object.values(scores).reduce((total, score) => total + (score?.earnedXp ?? 0), 0),
  }
}
