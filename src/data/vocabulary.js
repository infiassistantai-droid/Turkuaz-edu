import { loadJSON, READING_VOCABULARY_KEY, SAVED_KEY, saveJSON, TURKUAZ_LUGAT_LEARNED_KEY, VOCABULARY_STATE_KEY, VOCABULARY_XP_CLAIMED_KEY } from '../lib/storage'

// Sample words are a starter catalogue, not saved learner activity. A learner
// adds them to their personal list explicitly before they count toward trophies.
export const STARTER_VOCABULARY = [
  { id: 'starter-1', tr: 'Merhaba', uz: 'Salom', en: 'Hello', learned: false },
  { id: 'starter-2', tr: 'Kitap', uz: 'Kitob', en: 'Book', learned: false },
  { id: 'starter-3', tr: 'Araba', uz: 'Mashina', en: 'Car', learned: false },
  { id: 'starter-4', tr: 'Ev', uz: 'Uy', en: 'House', learned: false },
  { id: 'starter-5', tr: 'Su', uz: 'Suv', en: 'Water', learned: false },
  { id: 'starter-6', tr: 'Arkadaş', uz: 'Do‘st', en: 'Friend', learned: false },
  { id: 'starter-7', tr: 'Güzel', uz: 'Chiroyli', en: 'Beautiful', learned: false },
  { id: 'starter-8', tr: 'Yemek', uz: 'Ovqat', en: 'Food', learned: false },
  { id: 'starter-9', tr: 'Okul', uz: 'Maktab', en: 'School', learned: false },
  { id: 'starter-10', tr: 'Bugün', uz: 'Bugun', en: 'Today', learned: false },
  { id: 'starter-11', tr: 'Teşekkürler', uz: 'Rahmat', en: 'Thank you', learned: false },
  { id: 'starter-12', tr: 'Lütfen', uz: 'Iltimos', en: 'Please', learned: false },
]

export function normalizeWordKey(value) {
  return String(value || '').trim().toLocaleLowerCase('tr-TR').replace(/\s+/gu, ' ')
}

function getTerm(item) {
  return typeof item === 'string' ? item.trim() : String(item?.tr || item?.term || item?.word || '').trim()
}

function makeId(term) {
  const slug = normalizeWordKey(term).replace(/[^\p{L}\p{N}]+/gu, '-')
  return `word-${slug || 'saved'}`
}

/** Persist learned catalogue entry IDs separately from the personal saved-word list. */
export function loadTurkuazLearnedIds() {
  const value = loadJSON(TURKUAZ_LUGAT_LEARNED_KEY, [])
  return Array.isArray(value) ? [...new Set(value.map(String).filter(Boolean))] : []
}

export function saveTurkuazLearnedIds(ids) {
  const normalized = [...new Set((Array.isArray(ids) ? ids : []).map(String).filter(Boolean))]
  saveJSON(TURKUAZ_LUGAT_LEARNED_KEY, normalized)
  return normalized
}

/** Load saved words from the shared legacy list and enrich with saved details. */
export function loadSavedVocabulary() {
  const savedValue = loadJSON(SAVED_KEY, [])
  const savedItems = Array.isArray(savedValue) ? savedValue : []
  const detailsValue = loadJSON(VOCABULARY_STATE_KEY, [])
  const detailItems = Array.isArray(detailsValue) ? detailsValue : []
  const glossaryValue = loadJSON(READING_VOCABULARY_KEY, [])
  const glossaryItems = Array.isArray(glossaryValue) ? glossaryValue : []

  const detailByTerm = new Map()
  for (const item of [...glossaryItems, ...detailItems]) {
    const term = getTerm(item)
    const key = normalizeWordKey(term)
    if (key) detailByTerm.set(key, { ...(detailByTerm.get(key) || {}), ...item, tr: term })
  }
  const starterByTerm = new Map(STARTER_VOCABULARY.map((item) => [normalizeWordKey(item.tr), item]))
  const unique = new Map()

  for (const savedItem of savedItems) {
    const term = getTerm(savedItem)
    const key = normalizeWordKey(term)
    if (!key || unique.has(key)) continue
    const detail = detailByTerm.get(key) || {}
    const starter = starterByTerm.get(key) || {}
    unique.set(key, {
      id: String(detail.id || savedItem?.id || starter.id || makeId(term)),
      tr: term,
      uz: String(detail.uz || detail.translation || savedItem?.uz || starter.uz || ''),
      en: String(detail.en || savedItem?.en || starter.en || ''),
      learned: Boolean(detail.learned || savedItem?.learned),
    })
  }
  return [...unique.values()]
}

/** Persist full card state and the legacy string list consumed by other modules. */
export function saveVocabularyState(words) {
  const unique = new Map()
  for (const item of Array.isArray(words) ? words : []) {
    const term = getTerm(item)
    const key = normalizeWordKey(term)
    if (!key) continue
    const previous = unique.get(key)
    unique.set(key, {
      id: String(item.id || previous?.id || makeId(term)),
      tr: term,
      uz: String(item.uz || previous?.uz || ''),
      en: String(item.en || previous?.en || ''),
      learned: Boolean(item.learned || previous?.learned),
    })
  }
  const normalized = [...unique.values()]
  saveJSON(VOCABULARY_STATE_KEY, normalized)
  // Keep the historical format stable for Reading and the older vocabulary UI.
  saveJSON(SAVED_KEY, normalized.map((item) => item.tr))
  return normalized
}

export function claimVocabularyXpForWord(term) {
  const key = normalizeWordKey(term)
  if (!key) return false
  const claimedValue = loadJSON(VOCABULARY_XP_CLAIMED_KEY, [])
  const claimed = Array.isArray(claimedValue) ? claimedValue.map(normalizeWordKey) : []
  if (claimed.includes(key)) return false
  saveJSON(VOCABULARY_XP_CLAIMED_KEY, [...claimed, key])
  return true
}

export function createVocabularyWord({ tr, uz, en = '' }, id = `word-${Date.now()}`) {
  const cleanTr = String(tr || '').trim()
  return {
    id: String(id),
    tr: cleanTr,
    uz: String(uz || '').trim(),
    en: String(en || '').trim(),
    learned: false,
  }
}
