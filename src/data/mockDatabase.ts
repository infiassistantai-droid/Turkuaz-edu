import { generateMockExam } from './mockExamBank'
import type { GeneratedMock, QuestionSection, SpeakingPrompt, TestPart, TestQuestion, WritingPrompt } from './mockExamBank'

/** Shared schema for adding future mock IDs and question banks of any length. */
export type MockSkillKey = 'dinleme' | 'okuma' | 'yazma' | 'konusma'
export type MockMedia = {
  kind: 'web-speech' | 'audio-file'
  audioFilePlaceholder: string | null
  transcript: string
}
export type MockQuestion = TestQuestion & {
  audioFilePlaceholder?: string | null
  transcript?: string
}
export type MockPart = Omit<TestPart, 'questions'> & {
  questions: MockQuestion[]
  media?: MockMedia
}
export type ObjectiveMockSection = Omit<QuestionSection, 'totalQuestions' | 'parts'> & {
  skill: 'dinleme' | 'okuma'
  totalQuestions: number
  parts: MockPart[]
}
export type MockWritingTask = WritingPrompt & {
  weightPercent: 33 | 67
  rubricLabel: 'Mektup' | 'Kompozisyon'
}
export type MockSpeakingPart = SpeakingPrompt & {
  preparationSeconds: number
  maxSelfScore: 12
  evaluationCriteria: string[]
}
export type MockWritingSection = {
  key: 'yazma'
  label: string
  durationMinutes: number
  tasks: MockWritingTask[]
}
export type MockSpeakingSection = {
  key: 'konusma'
  label: string
  durationMinutes: number
  parts: MockSpeakingPart[]
}
export type MockExamRecord = {
  id: string
  title: string
  levelRange: 'B1–C1'
  createdAt: string
  sections: {
    dinleme: ObjectiveMockSection
    okuma: ObjectiveMockSection
    yazma: MockWritingSection
    konusma: MockSpeakingSection
  }
}
export type MockDatabase = {
  schemaVersion: 1
  exams: MockExamRecord[]
}

function withMedia(part: TestPart, skill: 'dinleme' | 'okuma'): MockPart {
  const transcript = part.audioText ?? part.questions.map((question) => question.audioText).filter(Boolean).join('\n\n')
  const questions: MockQuestion[] = part.questions.map((question) => ({
    ...question,
    ...(skill === 'dinleme' && question.audioText
      ? { audioFilePlaceholder: `/audio/mock-01/${question.id}.mp3`, transcript: question.audioText }
      : {}),
  }))
  return {
    ...part,
    questions,
    ...(skill === 'dinleme'
      ? { media: { kind: 'web-speech' as const, audioFilePlaceholder: `/audio/mock-01/${part.id}.mp3`, transcript } }
      : {}),
  }
}

function mapObjectiveSection(section: QuestionSection, skill: 'dinleme' | 'okuma'): ObjectiveMockSection {
  const parts = section.parts.map((part) => withMedia(part, skill))
  return {
    key: skill,
    label: section.label,
    durationMinutes: section.durationMinutes,
    skill,
    totalQuestions: parts.reduce((count, part) => count + part.questions.length, 0),
    parts,
  }
}

function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (1664525 * state + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function makeMockRecord(generated: GeneratedMock): MockExamRecord {
  return {
    id: 'mock-01',
    title: 'Mock Exam 01 · Türkçe Multilevel',
    levelRange: 'B1–C1',
    createdAt: '2026-10-28T00:00:00.000Z',
    sections: {
      dinleme: mapObjectiveSection(generated.dinleme, 'dinleme'),
      okuma: mapObjectiveSection(generated.okuma, 'okuma'),
      yazma: {
        ...generated.yazma,
        tasks: generated.yazma.tasks.map((task) => ({
          ...task,
          weightPercent: task.task === 1 ? 33 : 67,
          rubricLabel: task.task === 1 ? 'Mektup' : 'Kompozisyon',
        })),
      },
      konusma: {
        ...generated.konusma,
        parts: generated.konusma.parts.map((part) => ({
          ...part,
          preparationSeconds: part.part === 2 ? 60 : 0,
          maxSelfScore: 12,
          evaluationCriteria: ['Görevi karşılama', 'Akıcılık', 'Kelime çeşitliliği', 'Dil bilgisi ve anlaşılabilirlik'],
        })),
      },
    },
  }
}

// Mock 01 is a stable, complete seed; append future records without changing
// the schema or engine. A seeded RNG keeps this exam identical across reloads.
export const mockDatabase: MockDatabase = {
  schemaVersion: 1,
  exams: [makeMockRecord(generateMockExam(seededRandom(20261028)))],
}

export const MOCK_01 = mockDatabase.exams[0]
export const getMockExam = (id: string) => mockDatabase.exams.find((exam) => exam.id === id)
export const getMockQuestionCount = (section: ObjectiveMockSection) => section.parts.reduce((sum, part) => sum + part.questions.length, 0)
