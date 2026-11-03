// Backward-compatible import path. New Supabase features live in supabase.js.
export {
  deleteLearnerCloudData,
  fetchLearnerGamification,
  fetchLearnerProgress,
  fetchWeeklyLeaderboard,
  isCloudSyncAvailable,
  isSupabaseConfigured,
  mergeCloudVocabularyIntoLocal,
  supabase,
  supabaseUrl,
  syncLearnerProgress,
} from './supabase.js'
