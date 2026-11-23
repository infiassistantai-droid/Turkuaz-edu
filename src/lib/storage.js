// =====================================================================
// LocalStorage persistence layer — Türkçe Marathon
// Every user activity (profile, streak, XP, module scores, vocabulary
// mastery, mock exam results, dark mode) is saved locally. No backend.
// =====================================================================

export const STORAGE_KEY = 'turkish-marathon-v1'          // app state: stats / progress / examResult / dark
export const PROFILE_KEY = 'turkish-marathon-profile-v1'  // auth profile: name / surname / email / targetLevel
export const AUTH_KEY = 'turkish-marathon-auth-v1'          // device-local signed-in state
export const ONBOARDING_PENDING_KEY = 'turkuaz-edu-onboarding-pending-v1'
export const READING_COMPLETIONS_PREFIX = 'turkuaz-edu-reading-quiz-completions-v2:'
export const SCORES_KEY = 'turkish-marathon-scores-v1'    // best + attempts per skill module
export const KONUSMA_KEY = 'turkish-marathon-konusma-v1'  // speaking exam progress
export const MASTERY_KEY = 'turkish-marathon-mastery-v2'  // vocab mastery (used by VocabularyFlashcards)
export const SAVED_KEY = 'turkish-marathon-saved-words-v2' // saved vocab words
export const VOCABULARY_STATE_KEY = 'turkuaz-edu-vocabulary-state-v1'
export const VOCABULARY_XP_CLAIMED_KEY = 'turkuaz-edu-vocabulary-xp-claimed-v1'
export const TURKUAZ_LUGAT_LEARNED_KEY = 'turkuaz-edu-lugat-learned-v1' // learned IDs from the 1,000-word catalogue
export const READING_VOCABULARY_KEY = 'turkuaz-edu-reading-vocabulary-v1' // user-saved glossary words

export function readingSectionProgressKey(learnerId = 'local') {
  return 'turkuaz-edu-reading-section-progress-v1:' + encodeURIComponent(String(learnerId).trim().toLowerCase())
}

const storageListeners = new Set()
const vocabularyKeys = [SAVED_KEY, VOCABULARY_STATE_KEY, TURKUAZ_LUGAT_LEARNED_KEY, READING_VOCABULARY_KEY]
let vocabularyOwner = null

export function vocabularyStorageKey(userId, key) {
  return 'turkuaz-cloud-learning-vocabulary:' + userId + ':' + key
}

export function setVocabularyOwner(userId, migrateLegacy = false) {
  vocabularyOwner = userId
  if (!userId || !migrateLegacy) return
  const marker = 'turkuaz-cloud-learning-vocabulary-migration'
  if (loadJSON(marker, null)) return
  for (const key of vocabularyKeys) {
    const target = vocabularyStorageKey(userId, key)
    if (loadJSON(target, null) !== null) continue
    try {
      const raw = localStorage.getItem(key)
      if (raw) saveJSON(target, JSON.parse(raw))
    } catch {
      // Ignore unavailable or invalid legacy entries.
    }
  }
  saveJSON(marker, { migrated: true })
}

function ownedStorageKey(key) {
  return vocabularyOwner && vocabularyKeys.includes(key) ? vocabularyStorageKey(vocabularyOwner, key) : key
}

export function observeStorageWrites(listener) {
  storageListeners.add(listener)
  return () => storageListeners.delete(listener)
}

/** Safe JSON reader — falls back when storage is missing/corrupt (SSR-safe). */
export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(ownedStorageKey(key))
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : fallback
  } catch {
    return fallback
  }
}

/** Safe JSON writer — ignores quota/availability errors. */
export function saveJSON(key, value) {
  try {
    key = ownedStorageKey(key)
    const serialized = JSON.stringify(value)
    if (localStorage.getItem(key) !== serialized) {
      localStorage.setItem(key, serialized)
      for (const listener of storageListeners) listener(key, value)
    }
    return true
  } catch {
    // storage full or unavailable — app still works in-memory
    return false
  }
}

/* ------------------------------- Profile ------------------------------ */

export function loadProfile() {
  const p = loadJSON(PROFILE_KEY, null)
  return p && typeof p.name === 'string' && p.name.trim() ? p : null
}

export function saveProfile(profile) {
  saveJSON(PROFILE_KEY, profile)
}

export function clearProfile() {
  try {
    localStorage.removeItem(PROFILE_KEY)
  } catch {
    // ignore
  }
}

/** Avatar initials from name + surname (Uzbek order: ism + familya). */
export function getInitials(name = '', surname = '') {
  const n = String(name).trim().charAt(0)
  const s = String(surname).trim().charAt(0)
  return ((n || '') + (s || '')).toUpperCase() || 'UK'
}

/* --------------------------- Module scores --------------------------- */

export function loadScores() {
  return loadJSON(SCORES_KEY, {})
}

/**
 * Merge a module attempt into stored scores — keeps the best score and
 * counts attempts. Returns the updated record.
 */
export function saveScore(skill, data) {
  const all = loadScores()
  const prev = all[skill] || { best: 0, attempts: 0 }
  const next = {
    best: Math.max(prev.best || 0, data.best || 0),
    attempts: (prev.attempts || 0) + (data.attempts || 0),
  }
  all[skill] = next
  saveJSON(SCORES_KEY, all)
  return next
}

/* ----------------------- Konuşma (speaking) progress ------------------- */

export function loadKonusma() {
  const k = loadJSON(KONUSMA_KEY, null)
  if (!k || typeof k !== 'object') return {}
  return {
    reached: typeof k.reached === 'number' ? k.reached : 1,
    answered1: k.answered1 && typeof k.answered1 === 'object' ? k.answered1 : {},
    answered3: k.answered3 && typeof k.answered3 === 'object' ? k.answered3 : {},
  }
}

export function saveKonusma(state) {
  saveJSON(KONUSMA_KEY, state)
}

/* ----------------------------- Clear all ------------------------------ */

/** Clear the current learner's data while keeping other cached learners' records. */
export function clearAllStorage(identity) {
  [STORAGE_KEY, PROFILE_KEY, AUTH_KEY, SCORES_KEY, KONUSMA_KEY, MASTERY_KEY, SAVED_KEY, VOCABULARY_STATE_KEY, VOCABULARY_XP_CLAIMED_KEY, TURKUAZ_LUGAT_LEARNED_KEY, READING_VOCABULARY_KEY].forEach((key) => {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
  })
  const owner = String(identity || 'local').trim()
  const variants = new Set([owner, owner.toLowerCase(), encodeURIComponent(owner), encodeURIComponent(owner.toLowerCase())])
  const accountPrefixes = [
    'turkuaz-daily-plan-v1:',
    'turkuaz-yazma-stage-progress-v1:',
    'turkuaz-cloud-learning-assessments:',
    'turkuaz-cloud-learning-pending:',
    READING_COMPLETIONS_PREFIX,
    'turkuaz-edu-reading-section-progress-v1:',
    'turkuaz-edu-streak-milestones-v1:',
    'turkuaz-edu-trophy-unlocks-v1:',
    'turkuaz-edu-listening-progress-v1:',
    'turkuaz-edu-listening-stage-tasks-v1:',
    'turkuaz-edu-speaking-recording-progress-v1:',
  ]
  const accountKeys = new Set(accountPrefixes.flatMap((prefix) => [...variants].map((value) => prefix + value)))
  try {
    Object.keys(localStorage)
      .filter((key) => accountKeys.has(key) || key.startsWith('turkuaz-cloud-learning-vocabulary:' + owner + ':')
        || [...variants].some((value) => key.startsWith('turkuaz-edu-xp-awards-v1:' + value + ':'))
        || /^(?:turkish-marathon-(?:daily-plan|dashboard-plan)-)/u.test(key))
      .forEach((key) => localStorage.removeItem(key))
  } catch {
    // ignore unavailable storage
  }
}
