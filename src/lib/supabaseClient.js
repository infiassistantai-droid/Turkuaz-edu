import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
export const isSupabaseConfigured = Boolean(url && anonKey)
export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null

export async function fetchLearnerProgress(userId) {
  if (!supabase) return null
  const { data, error } = await supabase.from('user_progress').select('xp,streak,completed_lessons,target_level,weekly_xp,week_start,last_activity_date,daily_xp,analytics_tracking_since,daily_quests,quest_words_credited').eq('user_id', userId).maybeSingle()
  if (error) throw error
  return data
}

export async function syncLearnerProgress(userId, profile, stats) {
  if (!supabase) return
  const weekStart = new Date()
  const day = (weekStart.getDay() + 6) % 7
  weekStart.setDate(weekStart.getDate() - day)
  const weekKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`
  const row = {
    user_id: userId,
    display_name: profile?.name || 'Learner',
    target_level: profile?.targetLevel || null,
    xp: Math.max(0, Number(stats.xp) || 0),
    streak: Math.max(0, Number(stats.streak) || 0),
    completed_lessons: Array.isArray(stats.completedLessons) ? stats.completedLessons : [],
    weekly_xp: stats.weekStart === weekKey ? Math.max(0, Number(stats.weeklyXp) || 0) : 0,
    week_start: weekKey,
    last_activity_date: stats.lastActivityDate || null,
    daily_xp: stats.dailyXp && typeof stats.dailyXp === 'object' && !Array.isArray(stats.dailyXp) ? stats.dailyXp : {},
    analytics_tracking_since: stats.analyticsTrackingSince || null,
    daily_quests: stats.dailyQuests && typeof stats.dailyQuests === 'object' ? stats.dailyQuests : {},
    quest_words_credited: Array.isArray(stats.questWordsCredited) ? stats.questWordsCredited : [],
    updated_at: new Date().toISOString(),
  }
  const { error } = await supabase.from('user_progress').upsert(row, { onConflict: 'user_id' })
  if (error) throw error
}

export async function fetchWeeklyLeaderboard() {
  if (!supabase) return []
  const monday = new Date()
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  const weekKey = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`
  const { data, error } = await supabase.rpc('get_weekly_leaderboard', { requested_week_start: weekKey })
  if (error) throw error
  return data || []
}
