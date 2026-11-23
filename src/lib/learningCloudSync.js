import { loadJSON, observeStorageWrites, READING_COMPLETIONS_PREFIX, readingSectionProgressKey, READING_VOCABULARY_KEY, SAVED_KEY, saveJSON, TURKUAZ_LUGAT_LEARNED_KEY, VOCABULARY_STATE_KEY, vocabularyStorageKey } from './storage.js'
import { supabase } from './supabase.js'

export function learningKeys(userId) {
  const normalized = encodeURIComponent(userId.toLowerCase())
  return {
    plan: 'turkuaz-daily-plan-v1:' + encodeURIComponent(userId),
    reading: readingSectionProgressKey(userId),
    reading_quizzes: READING_COMPLETIONS_PREFIX + normalized,
    listening: 'turkuaz-edu-listening-progress-v1:' + normalized,
    listening_tasks: 'turkuaz-edu-listening-stage-tasks-v1:' + normalized,
    writing: 'turkuaz-yazma-stage-progress-v1:' + userId,
    speaking: 'turkuaz-edu-speaking-recording-progress-v1:' + userId,
    assessments: 'turkuaz-cloud-learning-assessments:' + userId,
    vocabulary_words: vocabularyStorageKey(userId, SAVED_KEY),
    vocabulary_details: vocabularyStorageKey(userId, VOCABULARY_STATE_KEY),
    vocabulary_learned: vocabularyStorageKey(userId, TURKUAZ_LUGAT_LEARNED_KEY),
    vocabulary_glossary: vocabularyStorageKey(userId, READING_VOCABULARY_KEY),
  }
}

const pendingKey = (userId) => 'turkuaz-cloud-learning-pending:' + userId

export async function restoreLearningState(userId, isCurrent) {
  const { data, error } = await supabase.from('user_learning_state').select('scope,payload')
    .eq('user_id', userId).abortSignal(AbortSignal.timeout(6000))
  if (error) throw error
  if (!isCurrent()) return

  const keys = learningKeys(userId)
  const pending = loadJSON(pendingKey(userId), {})
  const remote = new Map((data || []).map((row) => [row.scope, row.payload]))
  for (const [scope, key] of Object.entries(keys)) {
    if (Object.hasOwn(pending, scope)) continue
    if (remote.has(scope)) {
      saveJSON(key, remote.get(scope))
      continue
    }
    const local = loadJSON(key, null)
    if (local !== null) pending[scope] = local
  }
  saveJSON(pendingKey(userId), pending)
}

export function syncLearningState(userId, canUpload) {
  const key = pendingKey(userId)
  const scopeByKey = new Map(Object.entries(learningKeys(userId)).map(([scope, storageKey]) => [storageKey, scope]))
  const pending = new Map(Object.entries(loadJSON(key, {})))
  let timer
  let active = true
  let writing = false
  let retryDelay = 1500
  let writeController
  let inFlight

  function persistQueue() {
    saveJSON(key, Object.fromEntries(pending))
  }

  function schedule(delay = 350) {
    if (!canUpload || !active || writing || !pending.size) return
    clearTimeout(timer)
    timer = setTimeout(() => { inFlight = flush() }, delay)
  }

  async function flush() {
    if (!active || writing || !pending.size) return
    writing = true
    const batch = new Map(pending)
    writeController = new AbortController()
    const timeout = setTimeout(() => writeController.abort(), 8000)
    try {
      const data = [...batch].map(([scope, payload]) => ({ user_id: userId, scope, payload }))
      const { error } = await supabase.from('user_learning_state')
        .upsert(data, { onConflict: 'user_id,scope' }).abortSignal(writeController.signal)
      if (error) throw error
      if (!active) return
      for (const [scope, payload] of batch) {
        if (pending.get(scope) === payload) pending.delete(scope)
      }
      persistQueue()
      retryDelay = 1500
    } catch {
      retryDelay = Math.min(retryDelay * 2, 30_000)
    } finally {
      clearTimeout(timeout)
      writing = false
      schedule(retryDelay)
    }
  }

  const unsubscribe = observeStorageWrites((storageKey, data) => {
    const scope = scopeByKey.get(storageKey)
    if (!scope) return
    pending.set(scope, data)
    persistQueue()
    schedule()
  })
  const retry = () => schedule(0)
  window.addEventListener('online', retry)
  schedule(0)

  return ({ drain = false } = {}) => {
    active = false
    if (!drain) writeController?.abort()
    clearTimeout(timer)
    window.removeEventListener('online', retry)
    unsubscribe()
    if (drain) return inFlight
  }
}
