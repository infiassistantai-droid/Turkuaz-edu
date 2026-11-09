// Backward-compatible import path. New Supabase features live in supabase.js.
export {
  deleteLearnerCloudData,
  fetchLearnerGamification,
  fetchLearnerProgress,
  fetchAdminDashboardStats,
  fetchAdminUsers,
  fetchTopPlayers,
  fetchWeeklyLeaderboard,
  isCloudSyncAvailable,
  isSupabaseConfigured,
  mergeCloudVocabularyIntoLocal,
  supabase,
  supabaseUrl,
  syncLearnerProgress,
  updateAdminUserBalance,
} from './supabase.js'
