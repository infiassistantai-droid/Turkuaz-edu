export const STUDY_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
export const EXAM_LEVELS = ['B1', 'B2', 'C1']
export const STUDY_SKILLS = ['okuma', 'dinleme', 'yazma', 'konusma']

const DAY_MS = 86400000
const GOAL_SKILLS = {
  education: ['okuma', 'yazma'],
  career: ['konusma', 'yazma'],
  travel: ['dinleme', 'konusma'],
  culture: ['dinleme', 'okuma'],
}

export function studyDateKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return [date.getFullYear(), month, day].join('-')
}

export function normalizeExamDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(value) || value < '1900-01-01') return null
  const utc = new Date(value + 'T00:00:00Z')
  return Number.isFinite(utc.getTime()) && utc.toISOString().slice(0, 10) === value ? value : null
}

export function getDaysUntilExam(examDate, today = new Date()) {
  const date = normalizeExamDate(examDate)
  if (!date) return null
  return (Date.parse(date) - Date.parse(studyDateKey(today))) / DAY_MS
}

export function buildStudyPlan(profile = {}, sectionResults = {}, day = new Date()) {
  const level = EXAM_LEVELS.includes(profile.targetLevel) ? profile.targetLevel : 'B1'
  const startingLevel = STUDY_LEVELS.includes(profile.startingLevel) ? profile.startingLevel : null
  const examDate = normalizeExamDate(profile.examDate)
  const daysLeft = getDaysUntilExam(examDate, day)
  const nearExam = daysLeft !== null && daysLeft >= 0 && daysLeft <= 14
  const assessed = STUDY_SKILLS.flatMap((id) => {
    const raw = sectionResults?.[id]?.scaledScore
    const score = Number(raw)
    return raw != null && raw !== '' && Number.isFinite(score) && score >= 0 ? [{ id, score: Math.min(75, score) }] : []
  }).sort((a, b) => a.score - b.score)
  const [focus, review] = assessed
  const dayIndex = Math.floor(Date.parse(studyDateKey(day)) / DAY_MS)
  const rotated = [...STUDY_SKILLS.slice(dayIndex % STUDY_SKILLS.length), ...STUDY_SKILLS.slice(0, dayIndex % STUDY_SKILLS.length)]
  const preferred = GOAL_SKILLS[profile.learningGoal] || []
  const skills = [...new Set([...assessed.map(({ id }) => id), ...preferred, ...rotated])]
  const foundations = profile.startingPath === 'beginner' || (startingLevel && STUDY_LEVELS.indexOf(level) - STUDY_LEVELS.indexOf(startingLevel) >= 2)
  const phase = profile.startingPath === 'placement' && !focus
    ? 'placement'
    : nearExam && (daysLeft <= 7 || !foundations)
      ? 'exam'
      : foundations && !focus
        ? 'foundation'
        : 'practice'

  const tasks = {
    placement: ['quick-assessment', 'lugat', skills[0]],
    exam: ['exams', ...skills],
    foundation: ['lugat', 'okuma', 'dinleme'],
    practice: focus ? [focus.id, 'lugat', review?.id || 'exams'] : ['lugat', ...skills],
  }
  return {
    level, startingLevel, examDate, daysLeft, phase, focus, review,
    targets: tasks[phase].slice(0, 3),
    recommendedBudget: nearExam ? 45 : phase === 'foundation' ? 15 : 30,
    profileKey: JSON.stringify([level, startingLevel, examDate, profile.startingPath || null, profile.learningGoal || null]),
  }
}
