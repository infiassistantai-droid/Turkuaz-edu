// =====================================================================
// LocalStorage persistence layer — Türkçe Marathon
// Every user activity (profile, streak, XP, module scores, vocabulary
// mastery, mock exam results, dark mode) is saved locally. No backend.
// =====================================================================

export const STORAGE_KEY = 'turkish-marathon-v1'          // app state: stats / progress / examResult / dark
export const PROFILE_KEY = 'turkish-marathon-profile-v1'  // auth profile: name / surname / targetLevel
export const SCORES_KEY = 'turkish-marathon-scores-v1'    // best + attempts per skill module
export const KONUSMA_KEY = 'turkish-marathon-konusma-v1'  // speaking exam progress
export const MASTERY_KEY = 'turkish-marathon-mastery-v2'  // vocab mastery (used by VocabularyFlashcards)
export const SAVED_KEY = 'turkish-marathon-saved-words-v2' // saved vocab words

/** Safe JSON reader — falls back when storage is missing/corrupt (SSR-safe). */
export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
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
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable — app still works in-memory
  }
}

/* ------------------------------- Profile ------------------------------ */

export function loadProfile() {
  const p = loadJSON(PROFILE_KEY, null)
  return p && p.name && p.surname ? p : null
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

/** Remove every key the app owns — used by "Maʼlumotlarni tozalash". */
export function clearAllStorage() {
  [STORAGE_KEY, PROFILE_KEY, SCORES_KEY, KONUSMA_KEY, MASTERY_KEY, SAVED_KEY].forEach((key) => {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
  })
  // Daily checklists are date-scoped so yesterday's history remains available
  // during normal use, but a full reset should remove every checklist record.
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('turkish-marathon-daily-plan-') || key.startsWith('turkish-marathon-dashboard-plan-'))
      .forEach((key) => localStorage.removeItem(key))
  } catch {
    // ignore unavailable storage
  }
}
