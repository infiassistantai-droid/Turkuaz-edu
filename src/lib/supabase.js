import { createClient } from '@supabase/supabase-js'
import { loadJSON, READING_VOCABULARY_KEY, SAVED_KEY, saveJSON } from './storage.js'
import { getRankProgress } from './ranks.js'
import { normalizeWinterStudy } from '../features/winter/winterSeason.js'
import { translations } from './i18n.jsx'
import { isPresetAvatarPath } from './profileAvatar.js'

const configuredUrl = typeof import.meta.env.VITE_SUPABASE_URL === 'string'
  ? import.meta.env.VITE_SUPABASE_URL.trim()
  : ''
const configuredAnonKey = typeof import.meta.env.VITE_SUPABASE_ANON_KEY === 'string'
  ? import.meta.env.VITE_SUPABASE_ANON_KEY.trim()
  : ''

function normalizeSupabaseUrl(value) {
  const raw = String(value ?? '').trim().replace(/\/rest\/v1\/?$/iu, '').replace(/\/+$/u, '')
  if (!raw) return ''
  try {
    const parsed = new URL(raw)
    const localHttp = parsed.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname)
    if (!['http:', 'https:'].includes(parsed.protocol) || (!parsed.hostname || parsed.username || parsed.password) || (parsed.protocol !== 'https:' && !localHttp)) return ''
    if (parsed.pathname !== '/' || parsed.search || parsed.hash) return ''
    return parsed.origin
  } catch {
    return ''
  }
}

function isPublicSupabaseKey(value) {
  // Supabase supports legacy anon JWTs and the newer publishable-key format.
  return /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/u.test(value) || value.startsWith('sb_publishable_')
}

export const supabaseUrl = normalizeSupabaseUrl(configuredUrl)
const hasSupabaseConfiguration = Boolean(supabaseUrl && isPublicSupabaseKey(configuredAnonKey))

let client = null
if (hasSupabaseConfiguration) {
  try {
    client = createClient(supabaseUrl, configuredAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  } catch {
    // Malformed configuration should never prevent the local-first app from rendering.
    console.warn('[Turkuaz Edu] Supabase configuration is invalid; using local-only mode.')
  }
} else if (configuredUrl || configuredAnonKey) {
  // Do not print environment values: they may contain credentials.
  console.warn('[Turkuaz Edu] Supabase URL/key is missing or malformed; using local-only mode.')
}
export const supabase = client
export const isSupabaseConfigured = Boolean(supabase)
export const isCloudSyncAvailable = Boolean(supabase)

const CLOUD_READ_TIMEOUT_MS = 10_000
function withReadTimeout(request, label) {
  let timeoutId
  const timeout = new Promise((_, reject) => {
    timeoutId = globalThis.setTimeout(() => reject(new Error(`Supabase ${label} request timed out.`)), CLOUD_READ_TIMEOUT_MS)
  })
  return Promise.race([Promise.resolve(request), timeout]).finally(() => globalThis.clearTimeout(timeoutId))
}

function throwQueryError(error) {
  if (error) throw error
}

export async function fetchLearnerProgress(userId) {
  if (!supabase || !userId) return null
  const { data, error } = await withReadTimeout(supabase.from('user_progress')
    .select('xp,streak,completed_lessons,module_scores,target_level,weekly_xp,week_start,last_activity_date,daily_xp,analytics_tracking_since,daily_quests,quest_words_credited')
    .eq('user_id', userId)
    .maybeSingle(), 'progress')
  throwQueryError(error)
  return data
}

/** Persist a user-selected, bundled avatar path without rewriting learner stats. */
export async function updateLearnerAvatar(userId, avatarPath, profile = {}) {
  if (!supabase || !userId) throw new Error('A signed-in Supabase user is required.')
  if (!isPresetAvatarPath(avatarPath)) {
    throw new Error('Unsupported avatar selection.')
  }

  const { data, error } = await supabase.from('profiles')
    .update({ avatar_url: avatarPath, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select('user_id')
    .maybeSingle()
  throwQueryError(error)
  if (data?.user_id) return

  const fullName = [profile?.name, profile?.surname].filter(Boolean).join(' ').trim() || 'Learner'
  const { error: insertError } = await supabase.from('profiles').insert({
    id: userId,
    user_id: userId,
    full_name: fullName,
    avatar_url: avatarPath,
    current_streak: Math.max(0, Math.floor(Number(profile?.streak) || 0)),
    total_xp: Math.max(0, Math.floor(Number(profile?.xp) || 0)),
  })
  throwQueryError(insertError)
}

/** Run one cloud read independently so a missing table/network outage cannot break rendering. */
async function readOrFallback(label, request, fallback) {
  try {
    const { data, error } = await withReadTimeout(request(), label)
    if (error) {
      console.warn(`[Turkuaz Edu] Could not read ${label}; keeping local data.`, error)
      return { data: fallback, ok: false }
    }
    return { data: data ?? fallback, ok: true }
  } catch (error) {
    console.warn(`[Turkuaz Edu] Could not read ${label}; keeping local data.`, error)
    return { data: fallback, ok: false }
  }
}

/** Fetch the normalized cloud profile and the durable streak/achievement/vocabulary records. */
export async function fetchLearnerGamification(userId) {
  if (!supabase || !userId) return { profile: null, streak: null, achievements: [], vocabulary: [] }
  const profileRequest = () => supabase.from('profiles').select('id,user_id,full_name,avatar_url,current_streak,total_xp,rating_tier,level,rank_title,created_at,updated_at').eq('user_id', userId).maybeSingle()
  const streakRequest = () => supabase.from('user_streaks').select('user_id,streak_count,last_active_date,unlocked_milestones,winter_study_days').eq('user_id', userId).maybeSingle()
  const achievementRequest = () => supabase.from('user_achievements').select('user_id,trophy_id,unlocked_at,progress_data').eq('user_id', userId)
  const vocabularyRequest = () => supabase.from('user_vocabulary').select('user_id,word,translation,lesson_id,created_at').eq('user_id', userId)
  const results = await Promise.all([
    readOrFallback('profile', profileRequest, null),
    readOrFallback('streaks', streakRequest, null),
    readOrFallback('achievements', achievementRequest, []),
    readOrFallback('vocabulary', vocabularyRequest, []),
  ])
  const [profileResult, streakResult, achievementResult, vocabularyResult] = results
  return {
    profile: profileResult.data && typeof profileResult.data === 'object' ? profileResult.data : null,
    streak: streakResult.data && typeof streakResult.data === 'object' ? streakResult.data : null,
    achievements: Array.isArray(achievementResult.data) ? achievementResult.data : [],
    vocabulary: Array.isArray(vocabularyResult.data) ? vocabularyResult.data : [],
    hasReadFailures: results.some((result) => !result.ok),
  }
}

function collectVocabularyRows(userId) {
  const savedWords = loadJSON(SAVED_KEY, [])
  const glossaryWords = loadJSON(READING_VOCABULARY_KEY, [])
  const rows = new Map()
  const add = (item) => {
    const word = typeof item === 'string' ? item.trim() : String(item?.term || item?.word || '').trim()
    if (!word) return
    const key = word.toLocaleLowerCase('tr-TR')
    const previous = rows.get(key)
    const translationKey = typeof item === 'object' && item ? item.translationKey : null
    const translation = typeof item === 'object' && item
      ? String(item.uz || item.translation || (translationKey ? translations.uz[translationKey] : '') || '')
      : ''
    rows.set(key, {
      user_id: userId,
      word: previous?.word || word,
      translation: translation || previous?.translation || '',
      lesson_id: (typeof item === 'object' && item ? item.lessonId || item.lesson_id : null) || previous?.lesson_id || null,
    })
  }
  if (Array.isArray(glossaryWords)) glossaryWords.forEach(add)
  if (Array.isArray(savedWords)) savedWords.forEach(add)
  return [...rows.values()]
}

/** Merge newly discovered cloud vocabulary into the local stores consumed by the study view. */
export function mergeCloudVocabularyIntoLocal(remoteRows) {
  if (!Array.isArray(remoteRows) || remoteRows.length === 0) return
  const saved = loadJSON(SAVED_KEY, [])
  const glossary = loadJSON(READING_VOCABULARY_KEY, [])
  const savedList = Array.isArray(saved) ? saved : []
  const glossaryList = Array.isArray(glossary) ? glossary : []
  const savedTerms = new Set(savedList.map((item) => String(typeof item === 'string' ? item : item?.term || '').trim().toLocaleLowerCase('tr-TR')).filter(Boolean))
  const glossaryTerms = new Set(glossaryList.map((item) => String(item?.term || '').trim().toLocaleLowerCase('tr-TR')).filter(Boolean))
  let savedChanged = false
  let glossaryChanged = false
  for (const row of remoteRows) {
    const term = String(row?.word || '').trim()
    const normalized = term.toLocaleLowerCase('tr-TR')
    if (!normalized) continue
    if (!savedTerms.has(normalized)) {
      savedList.push(term)
      savedTerms.add(normalized)
      savedChanged = true
    }
    if (!glossaryTerms.has(normalized)) {
      glossaryList.push({
        id: `cloud-${encodeURIComponent(normalized)}`,
        term,
        uz: String(row.translation || ''),
        lessonId: row.lesson_id || null,
        source: 'cloud',
      })
      glossaryTerms.add(normalized)
      glossaryChanged = true
    }
  }
  if (savedChanged) saveJSON(SAVED_KEY, savedList)
  if (glossaryChanged) saveJSON(READING_VOCABULARY_KEY, glossaryList)
}

/** Award XP through the authenticated, daily-limited Supabase RPC. */
export async function awardXP(userId, amount, taskType) {
  if (!supabase || !userId) return { totalXp: null, amountAwarded: 0, limitReached: false }
  const xpAmount = Math.floor(Number(amount) || 0)
  const normalizedTaskType = String(taskType || '').trim()
  if (xpAmount <= 0 || !normalizedTaskType) return { totalXp: null, amountAwarded: 0, limitReached: false }

  const { data, error } = await supabase.rpc('award_profile_xp', {
    p_user_id: userId,
    p_amount: xpAmount,
    p_task_type: normalizedTaskType,
  })
  throwQueryError(error)
  const result = Array.isArray(data) ? data[0] : data
  const totalXp = Number(result?.total_xp)
  const amountAwarded = Number(result?.awarded)
  if (!Number.isFinite(totalXp) || !Number.isFinite(amountAwarded)) throw new Error('Supabase returned an invalid XP award.')
  return { totalXp, amountAwarded, limitReached: Boolean(result?.limit_reached) }
}

/** Backwards-compatible alias for older call sites; new code should pass a task type. */
export async function addXP(userId, amount) {
  const taskType = `legacy:${Date.now()}:${Math.random().toString(36).slice(2)}`
  const result = await awardXP(userId, amount, taskType)
  return result.totalXp
}

/** Keep a migrated local/legacy total from being lost on the first cloud sync. */
export async function syncProfileXpFloor(userId, totalXp) {
  if (!supabase || !userId) return null
  const safeTotal = Math.max(0, Math.floor(Number(totalXp) || 0))
  const { data, error } = await withReadTimeout(supabase.rpc('sync_profile_xp_floor', {
    p_user_id: userId,
    p_total_xp: safeTotal,
  }), 'profile XP reconciliation')
  throwQueryError(error)
  const syncedTotal = Number(data)
  if (!Number.isFinite(syncedTotal)) throw new Error('Supabase returned an invalid XP total.')
  return syncedTotal
}

/** Sync legacy progress plus the normalized profile, streak, trophies, and vocabulary tables. */
export async function syncLearnerProgress(userId, profile, stats) {
  if (!supabase || !userId) return
  const safeStats = stats || {}
  const now = new Date().toISOString()
  const weekStart = new Date()
  const day = (weekStart.getDay() + 6) % 7
  weekStart.setDate(weekStart.getDate() - day)
  const weekKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`
  const xp = Math.max(0, Number(safeStats.xp) || 0)
  const streak = Math.max(0, Number(safeStats.streak) || 0)
  const rankProgress = getRankProgress(xp)
  const fullName = [profile?.name, profile?.surname].filter(Boolean).join(' ').trim() || profile?.fullName || profile?.full_name || 'Learner'
  const avatarCandidate = String(profile?.avatarUrl || profile?.avatar_url || '').trim()
  const isRemoteAvatar = /^https?:\/\/\S+$/u.test(avatarCandidate)
  const isPresetAvatar = isPresetAvatarPath(avatarCandidate)
  const avatarUrl = isRemoteAvatar || isPresetAvatar ? avatarCandidate : null
  const trophies = Array.isArray(safeStats.trophyUnlocks) ? safeStats.trophyUnlocks : []
  const milestones = [...new Set((Array.isArray(safeStats.streakMilestones) ? safeStats.streakMilestones : []).map(Number).filter(Number.isFinite))].sort((a, b) => a - b)

  const progressRow = {
    user_id: userId,
    display_name: fullName,
    target_level: profile?.targetLevel || null,
    xp,
    streak,
    completed_lessons: Array.isArray(safeStats.completedLessons) ? safeStats.completedLessons : [],
    module_scores: safeStats.moduleScores && typeof safeStats.moduleScores === 'object' && !Array.isArray(safeStats.moduleScores) ? safeStats.moduleScores : {},
    weekly_xp: safeStats.weekStart === weekKey ? Math.max(0, Number(safeStats.weeklyXp) || 0) : 0,
    week_start: weekKey,
    last_activity_date: safeStats.lastActivityDate || null,
    daily_xp: safeStats.dailyXp && typeof safeStats.dailyXp === 'object' && !Array.isArray(safeStats.dailyXp) ? safeStats.dailyXp : {},
    analytics_tracking_since: safeStats.analyticsTrackingSince || null,
    daily_quests: safeStats.dailyQuests && typeof safeStats.dailyQuests === 'object' ? safeStats.dailyQuests : {},
    quest_words_credited: Array.isArray(safeStats.questWordsCredited) ? safeStats.questWordsCredited : [],
    updated_at: now,
  }
  const profileRow = {
    id: userId,
    user_id: userId,
    full_name: fullName,
    avatar_url: avatarUrl,
    current_streak: streak,
    level: rankProgress.level,
    rank_title: rankProgress.rank.id,
    updated_at: now,
  }
  const streakRow = {
    user_id: userId,
    streak_count: streak,
    last_active_date: safeStats.lastActivityDate || null,
    unlocked_milestones: [...milestones, ...(trophies.some((record) => record.id === 'winter-champion') ? ['winter-champion'] : [])],
    winter_study_days: normalizeWinterStudy(safeStats.winterStudy),
    updated_at: now,
  }

  const writes = [
    supabase.from('user_progress').upsert(progressRow, { onConflict: 'user_id' }),
    supabase.from('profiles').upsert(profileRow, { onConflict: 'user_id' }),
    supabase.from('user_streaks').upsert(streakRow, { onConflict: 'user_id' }),
  ]
  if (trophies.length) {
    writes.push(supabase.from('user_achievements').upsert(trophies.map((record) => ({
      user_id: userId,
      trophy_id: record.id,
      unlocked_at: record.unlockedAt || null,
      progress_data: { rewardXp: Math.max(0, Number(record.rewardXp) || 0), historical: Boolean(record.historical) },
    })), { onConflict: 'user_id,trophy_id' }))
  }
  const vocabularyRows = collectVocabularyRows(userId)
  if (vocabularyRows.length) {
    writes.push(supabase.from('user_vocabulary').upsert(vocabularyRows, { onConflict: 'user_id,word' }))
  }
  const results = await Promise.all(writes)
  for (const result of results) throwQueryError(result.error)
}

export async function deleteLearnerCloudData(userId) {
  if (!supabase || !userId) return
  const tables = ['user_vocabulary', 'user_achievements', 'user_streaks', 'profiles', 'user_progress']
  const results = await Promise.all(tables.map((table) => supabase.from(table).delete().eq('user_id', userId)))
  for (const result of results) throwQueryError(result.error)
}

export async function fetchWeeklyLeaderboard() {
  if (!supabase) return []
  const monday = new Date()
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  const weekKey = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`
  const { data, error } = await withReadTimeout(supabase.rpc('get_weekly_leaderboard', { requested_week_start: weekKey }), 'leaderboard')
  throwQueryError(error)
  return Array.isArray(data) ? data.filter((row) => row && typeof row === 'object') : []
}

/** Fetch aggregate admin metrics via an RPC restricted to trusted admin app_metadata. */
export async function fetchAdminDashboardStats() {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await withReadTimeout(
    supabase.rpc('get_admin_dashboard_stats'),
    'admin dashboard stats',
  )
  throwQueryError(error)
  const row = Array.isArray(data) ? data[0] : null
  if (!row) throw new Error('Admin dashboard stats are unavailable.')
  return {
    totalUsers: Math.max(0, Math.floor(Number(row.total_users) || 0)),
    averageXp: Math.max(0, Math.round(Number(row.average_xp) || 0)),
  }
}

/** Fetch admin-only learner rows using a trusted app_metadata role claim. */
export async function fetchAdminUsers() {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await withReadTimeout(supabase.rpc('get_admin_users'), 'admin users')
  throwQueryError(error)
  if (!Array.isArray(data)) return []
  return data.filter((row) => row && typeof row === 'object').map((row) => ({
    id: String(row.id || ''),
    name: String(row.name || 'Learner'),
    email: String(row.email || ''),
    avatar_url: typeof row.avatar_url === 'string' && row.avatar_url.trim() ? row.avatar_url.trim() : null,
    league: String(row.league || ''),
    total_xp: Math.max(0, Math.floor(Number(row.total_xp) || 0)),
    gold: Math.max(0, Math.floor(Number(row.gold) || 0)),
    gems: Math.max(0, Math.floor(Number(row.gems) || 0)),
  })).filter((row) => row.id)
}

/** Update balances via the admin-claim-gated RPC; profiles RLS remains private. */
export async function updateAdminUserBalance(profileId, balances) {
  if (!supabase || !profileId) throw new Error('An admin session and profile are required.')
  const values = {
    p_profile_id: profileId,
    p_total_xp: Math.max(0, Math.floor(Number(balances?.totalXp) || 0)),
    p_gold: Math.max(0, Math.floor(Number(balances?.gold) || 0)),
    p_gems: Math.max(0, Math.floor(Number(balances?.gems) || 0)),
  }
  const { data, error } = await withReadTimeout(
    supabase.rpc('update_admin_user_balance', values),
    'admin balance update',
  )
  throwQueryError(error)
  const row = Array.isArray(data) ? data[0] : null
  if (!row?.id) throw new Error('Balance update did not return a profile.')
  return {
    id: String(row.id),
    total_xp: Math.max(0, Math.floor(Number(row.total_xp) || 0)),
    gold: Math.max(0, Math.floor(Number(row.gold) || 0)),
    gems: Math.max(0, Math.floor(Number(row.gems) || 0)),
  }
}

/** Fetch the public ranking fields from profiles through an authenticated RPC.
 * The profiles table itself stays private under RLS; the RPC clamps to 50 rows.
 */
export async function fetchTopPlayers() {
  if (!supabase) return []
  const { data, error } = await withReadTimeout(
    supabase.rpc('get_top_profiles', { p_limit: 50 }),
    'top profiles leaderboard',
  )
  throwQueryError(error)
  if (!Array.isArray(data)) return []
  return data.filter((row) => row && typeof row === 'object').map((row) => ({
    user_id: String(row.user_id || ''),
    display_name: String(row.display_name || 'Learner'),
    avatar_url: typeof row.avatar_url === 'string' && row.avatar_url.trim() ? row.avatar_url.trim() : null,
    total_xp: Math.max(0, Math.floor(Number(row.total_xp) || 0)),
  })).filter((row) => row.user_id)
}
