import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Flame, CheckCircle2, Copy, LoaderCircle, Star, Trophy } from 'lucide-react'
import { cn } from './lib/utils'
import {
  STORAGE_KEY,
  loadJSON,
  saveJSON,
  loadProfile,
  saveProfile,
  AUTH_KEY,
  ONBOARDING_PENDING_KEY,
  READING_COMPLETIONS_PREFIX,
  SAVED_KEY,
  clearAllStorage,
  loadScores,
  saveScore,
} from './lib/storage'
import TurkchaDashboard from './components/TurkchaDashboard'
import ProfileSetupModal from './components/ProfileSetupModal'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'
import { awardXP, deleteLearnerCloudData, fetchLearnerGamification, fetchLearnerProgress, isSupabaseConfigured, mergeCloudVocabularyIntoLocal, supabase, syncLearnerProgress, syncProfileXpFloor, updateLearnerAvatar } from './lib/supabase'
import { disableDailyReminder, enableDailyReminder, getReminderPreference, showDailyReminderIfDue } from './lib/dailyReminders'
import { calculateCertificate } from './lib/multilevelScoring'
import { useI18n } from './lib/i18n.jsx'
import { DEFAULT_EQUIPPED_MEDAL, DEFAULT_UNLOCKED_MEDALS } from './lib/medals'
import { getRankProgress, getRatingTier } from './lib/ranks'
import { getStreakMilestonesUpTo, STREAK_MILESTONES } from './lib/streakMilestones'
import { getTrophyProgress, TROPHIES, TROPHY_REWARD_XP } from './lib/trophies'
import { getListeningCompletedCount } from './lib/listeningProgress'
import { useWinterUpdate } from './features/winter/WinterUpdateContext'
import { useAuth } from './context/AuthContext.jsx'
import { getWinterStudyDayCount, normalizeWinterStudy, recordWinterStudyDay } from './features/winter/winterSeason'
import { isPresetAvatarPath } from './lib/profileAvatar'

const Dashboard = lazy(() => import('./components/Dashboard'))
const ComingSoon = lazy(() => import('./components/ComingSoon'))
const KunlikReja = lazy(() => import('./components/KunlikReja'))
const JourneyMap = lazy(() => import('./components/JourneyMap'))
const Shop = lazy(() => import('./components/Shop'))
const AdminRoute = lazy(() => import('./components/AdminRoute'))
const ReadingLibrary = lazy(() => import('./components/modules/ReadingLibrary'))
const Dinleme = lazy(() => import('./components/modules/Dinleme'))
const YazmaModule = lazy(() => import('./components/modules/YazmaModule'))
const Yozish = lazy(() => import('./components/modules/Yozish'))
const KonusmaModule = lazy(() => import('./components/modules/KonusmaModule'))
const Kelimeler = lazy(() => import('./components/modules/Kelimeler'))
const MockExam = lazy(() => import('./components/MockExam'))
const MockExamSimulator = lazy(() => import('./components/MockExamSimulator'))
const MockExamEngine = lazy(() => import('./components/MockExamEngine'))
const ImtihonlarHub = lazy(() => import('./components/ImtihonlarHub'))
const OnboardingFlow = lazy(() => import('./components/OnboardingFlow'))
const Leaderboard = lazy(() => import('./components/Leaderboard'))
const Statistika = lazy(() => import('./components/Statistika'))

// Learner stats and skill results start empty and are persisted after real activity.
const DEFAULT_STATS = { xp: 0, streak: 0, streakMilestones: [], winterStudy: { seasonId: null, days: [] }, completedQuizzes: 0, readingCompletedCount: 0, readingPerfectExamAchieved: false, listeningLessonsCompleted: 0, moduleScores: {}, savedWordsCount: 0, flawlessQuizAchieved: false, speedBonusAchieved: false, trophyUnlocks: [], weeklyXp: 0, weekStart: null, dailyXp: {}, analyticsTrackingSince: null, dailyQuests: null, questWordsCredited: [], wordsLearned: 0, levelsCompleted: 0, skillsCompleted: [], completedLessons: [], completedMocks: 0, examDone: false, lastActivityDate: null }

function mergeModuleScores(localScores, cloudScores) {
  const merged = localScores && typeof localScores === 'object' && !Array.isArray(localScores) ? { ...localScores } : {}
  if (!cloudScores || typeof cloudScores !== 'object' || Array.isArray(cloudScores)) return merged
  for (const [testId, cloudRecord] of Object.entries(cloudScores)) {
    if (!cloudRecord || typeof cloudRecord !== 'object' || Array.isArray(cloudRecord)) continue
    const localRecord = merged[testId] && typeof merged[testId] === 'object' ? merged[testId] : {}
    merged[testId] = {
      ...localRecord,
      ...cloudRecord,
      best: Math.max(Number(localRecord.best ?? localRecord.bestScore) || 0, Number(cloudRecord.best ?? cloudRecord.bestScore) || 0),
      attempts: Math.max(Number(localRecord.attempts) || 0, Number(cloudRecord.attempts) || 0),
    }
  }
  return merged
}
const STREAK_MILESTONE_STORAGE_PREFIX = 'turkuaz-edu-streak-milestones-v1:'
const TROPHY_UNLOCK_STORAGE_PREFIX = 'turkuaz-edu-trophy-unlocks-v1:'
const DEFAULT_PROGRESS = { okuma: 0, dinleme: 0, yazma: 0, konusma: 0 }

function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function claimLocalTaskXp(identity, taskType) {
  const task = String(taskType || '')
  if (!/^(?:vocabulary:deck|listening:|speaking:|exam:|daily-words:)/u.test(task)) return true
  const key = `turkuaz-edu-xp-awards-v1:${encodeURIComponent(String(identity || 'local'))}:${localDateKey()}`
  const awards = loadJSON(key, {})
  const count = Math.max(0, Number(awards[task]) || 0)
  if (count >= 2) return false
  saveJSON(key, { ...awards, [task]: count + 1 })
  return true
}

function previousDateKey(key) {
  const date = new Date(`${key}T12:00:00`)
  date.setDate(date.getDate() - 1)
  return localDateKey(date)
}

function hasPendingOnboarding(userId) {
  try {
    const marker = window.localStorage.getItem(ONBOARDING_PENDING_KEY)
    if (marker === 'pending' && userId) window.localStorage.setItem(ONBOARDING_PENDING_KEY, userId)
    return marker === 'pending' || marker === String(userId)
  } catch {
    return false
  }
}

function mergeTrophyRecords(...recordLists) {
  const byId = new Map()
  for (const record of recordLists.flat()) {
    if (!record?.id || !TROPHIES.some((trophy) => trophy.id === record.id)) continue
    const previous = byId.get(record.id)
    if (!previous || (!previous.unlockedAt && record.unlockedAt)) byId.set(record.id, record)
  }
  return [...byId.values()]
}

function getLearnerProfileFromAuth(user, targetLevel, hasExistingProgress = true, forceOnboarding = false, cloudProfile = null) {
  const metadata = user?.user_metadata || {}
  const nameParts = String(metadata.full_name || metadata.name || cloudProfile?.full_name || '').trim().split(/\s+/u).filter(Boolean)
  const email = user?.email || ''
  const firstNameFromFullName = nameParts.shift()
  const name = metadata.given_name || firstNameFromFullName || email.split('@')[0] || 'Learner'
  const surname = metadata.surname || metadata.family_name || nameParts.join(' ')
  return {
    name,
    surname,
    email,
    avatarUrl: cloudProfile?.avatar_url || metadata.avatar_url || metadata.picture || null,
    ratingTier: cloudProfile?.rating_tier || getRatingTier(cloudProfile?.total_xp || 0),
    targetLevel: targetLevel || metadata.target_level || 'B1',
    learningGoal: metadata.learning_goal || null,
    startingPath: metadata.starting_path || null,
    startingLevel: metadata.starting_level || null,
    onboardingCompleted: typeof metadata.onboarding_completed === 'boolean' ? metadata.onboarding_completed : forceOnboarding ? false : Boolean(hasExistingProgress),
    userId: user?.id,
  }
}

function preserveCachedProfileAvatar(profile, cachedProfile, matchesSession, allowCachedPreset = false) {
  if (!matchesSession || !cachedProfile) return profile
  const avatarField = Object.prototype.hasOwnProperty.call(cachedProfile, 'avatarUrl')
    ? 'avatarUrl'
    : Object.prototype.hasOwnProperty.call(cachedProfile, 'avatar_url')
      ? 'avatar_url'
      : null
  const cachedAvatar = avatarField ? String(cachedProfile[avatarField] || '') : ''
  // Custom uploads are deliberately device-local. Preset paths follow the cloud profile.
  if (/^data:image\/(?:webp|jpeg);base64,/u.test(cachedAvatar)) return { ...profile, avatarUrl: cachedAvatar }
  if (allowCachedPreset && isPresetAvatarPath(cachedAvatar)) return { ...profile, avatarUrl: cachedAvatar }
  return profile
}

function getWeekStartKey(dateKey = localDateKey()) {
  const date = new Date(`${dateKey}T12:00:00`)
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7))
  return localDateKey(date)
}

function getWeeklyGoalProgress(saved, dateKey = localDateKey()) {
  const weekStart = getWeekStartKey(dateKey)
  if (saved?.weekStart !== weekStart) return { weekStart, tests: 0, lessons: 0, words: 0 }
  return {
    weekStart,
    tests: Math.max(0, Number(saved.tests) || 0),
    lessons: Math.max(0, Number(saved.lessons) || 0),
    words: Math.max(0, Number(saved.words) || 0),
  }
}

function getDailyQuestProgress(stats, dateKey = localDateKey()) {
  const saved = stats?.dailyQuests
  const weeklyGoals = getWeeklyGoalProgress(saved?.weeklyGoals, dateKey)
  if (saved?.date === dateKey) {
    return {
      date: dateKey,
      words: Array.isArray(saved.words) ? saved.words : [],
      listening: Math.max(0, Number(saved.listening) || 0),
      xp: Math.max(0, Number(saved.xp) || 0),
      wordRewardClaimed: Boolean(saved.wordRewardClaimed),
      weeklyGoals,
    }
  }
  const recordedXp = Number(stats?.dailyXp?.[dateKey] ?? stats?.daily_xp?.[dateKey])
  return { date: dateKey, words: [], listening: 0, xp: Number.isFinite(recordedXp) ? Math.max(0, recordedXp) : 0, wordRewardClaimed: false, weeklyGoals }
}

function incrementWeeklyGoal(stats, goal, amount = 1, dateKey = localDateKey()) {
  const dailyQuests = getDailyQuestProgress(stats, dateKey)
  const weeklyGoals = getWeeklyGoalProgress(dailyQuests.weeklyGoals, dateKey)
  return {
    ...stats,
    dailyQuests: {
      ...dailyQuests,
      weeklyGoals: { ...weeklyGoals, [goal]: Math.max(0, Number(weeklyGoals[goal]) || 0) + Math.max(0, Number(amount) || 0) },
    },
  }
}

function getReadingCompletionCount(profile) {
  const identity = String(profile?.userId || profile?.email || 'local').trim().toLowerCase()
  const completionKey = `${READING_COMPLETIONS_PREFIX}${encodeURIComponent(identity)}`
  const completed = loadJSON(completionKey, [])
  return Array.isArray(completed) ? new Set(completed).size : 0
}

function getSavedWordCount() {
  const saved = loadJSON(SAVED_KEY, [])
  if (!Array.isArray(saved)) return 0
  const terms = saved.map((item) => typeof item === 'string' ? item.trim().toLocaleLowerCase('tr-TR') : String(item?.term || '').trim().toLocaleLowerCase('tr-TR')).filter(Boolean)
  return new Set(terms).size
}

function getLegacyQuizCount(profile, storedStats, localState) {
  const moduleAttempts = Object.values(loadScores() || {}).reduce((sum, item) => sum + Math.max(0, Number(item?.attempts) || 0), 0)
  const sectionAttempts = Object.values(localState?.multilevelSectionResults || {}).reduce((sum, item) => sum + Math.max(0, Number(item?.attempts) || 0), 0)
  const completedMocks = Math.max(0, Number(storedStats?.completedMocks) || 0)
  return moduleAttempts + Math.max(sectionAttempts, completedMocks) + getReadingCompletionCount(profile)
}

function loadLearnerStats(profile = null) {
  const localState = loadJSON(STORAGE_KEY, {})
  const stored = localState?.stats
  if (!stored) return { ...DEFAULT_STATS, savedWordsCount: getSavedWordCount(), readingCompletedCount: getReadingCompletionCount(profile), completedQuizzes: getLegacyQuizCount(profile, null, localState) }

  // Earlier builds shipped with invented starter totals. Remove that known
  // demo baseline while preserving earned progress above it.
  const hasOldDemoBaseline = stored.xp >= 12480 && stored.streak >= 23 &&
    stored.wordsLearned >= 148 && stored.levelsCompleted >= 9
  const normalized = hasOldDemoBaseline
    ? {
        ...DEFAULT_STATS,
        ...stored,
        xp: Math.max(0, stored.xp - 12480),
        streak: Math.max(0, stored.streak - 23),
        wordsLearned: Math.max(0, stored.wordsLearned - 148),
        levelsCompleted: Math.max(0, stored.levelsCompleted - 9),
      }
    : { ...DEFAULT_STATS, ...stored }

  // Migrate real persisted streaks into their permanent milestone inventory.
  // No streak or XP is seeded: awards are inferred only from recorded streak days.
  const recordedDays = Number.isFinite(Number(normalized.streak)) ? Math.max(0, Math.floor(Number(normalized.streak))) : 0
  normalized.streak = recordedDays
  normalized.streakMilestones = Array.isArray(stored.streakMilestones)
    ? stored.streakMilestones.map(Number).filter((days) => STREAK_MILESTONES.some((milestone) => milestone.days === days))
    : getStreakMilestonesUpTo(recordedDays)
  normalized.winterStudy = normalizeWinterStudy(stored.winterStudy)
  const savedQuizCount = Number(stored.completedQuizzes)
  normalized.completedQuizzes = Number.isFinite(savedQuizCount) && savedQuizCount >= 0
    ? Math.floor(savedQuizCount)
    : getLegacyQuizCount(profile, stored, localState)
  normalized.savedWordsCount = getSavedWordCount()
  normalized.readingCompletedCount = getReadingCompletionCount(profile)
  normalized.readingPerfectExamAchieved = Boolean(stored.readingPerfectExamAchieved)
  normalized.flawlessQuizAchieved = Boolean(stored.flawlessQuizAchieved)
  normalized.speedBonusAchieved = Boolean(stored.speedBonusAchieved)
  normalized.trophyUnlocks = Array.isArray(stored.trophyUnlocks) ? stored.trophyUnlocks.filter((record) => TROPHIES.some((trophy) => trophy.id === record?.id)) : []
  return normalized
}

function loadLearnerProgress() {
  const stored = loadJSON(STORAGE_KEY, {})?.progress
  if (!stored) return DEFAULT_PROGRESS
  const hasOldDemoBaseline = stored.okuma >= 68 && stored.dinleme >= 54 &&
    stored.yazma >= 47 && stored.konusma >= 39
  if (!hasOldDemoBaseline) return { ...DEFAULT_PROGRESS, ...stored }
  return {
    ...DEFAULT_PROGRESS,
    okuma: Math.max(0, stored.okuma - 68),
    dinleme: Math.max(0, stored.dinleme - 54),
    yazma: Math.max(0, stored.yazma - 47),
    konusma: Math.max(0, stored.konusma - 39),
  }
}

// ----------------------------------------------------------------------
// Typed toast system — top-right corner
//   default/xp   → flame (teal gradient)
//   success      → check (emerald)
//   copy         → copy (cyan)
//   save         → star (amber)
// ----------------------------------------------------------------------
const TOAST_ICONS = {
  default: Flame,
  xp: Flame,
  success: CheckCircle2,
  copy: Copy,
  save: Star,
  exam: Trophy,
}

const TOAST_TONES = {
  default: 'bg-gradient-to-r from-teal-600 to-cyan-500 ring-teal-700/30',
  xp: 'bg-gradient-to-r from-teal-600 to-cyan-500 ring-teal-700/30',
  success: 'bg-emerald-600 ring-emerald-700/30',
  copy: 'bg-cyan-600 ring-cyan-700/30',
  save: 'bg-amber-500 ring-amber-600/30',
  exam: 'bg-rose-600 ring-rose-700/30',
}

function ToastItem({ toast }) {
  const Icon = TOAST_ICONS[toast.type] || Flame
  return (
    <div
      className={cn(
        'animate-slideup pointer-events-auto flex w-72 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-xl ring-1',
        TOAST_TONES[toast.type] || TOAST_TONES.default,
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 leading-tight">{toast.message}</span>
    </div>
  )
}

function normalizeAppPath(pathname) {
  const normalized = `/${String(pathname || '/').split('/').filter(Boolean).join('/')}`
  return normalized === '/' ? normalized : normalized.replace(/\/$/u, '')
}

export default function App() {
  const { t } = useI18n()
  const { session: authSession, user: authUser, loading: authStateLoading } = useAuth()
  const { featureEnabled: winterFeatureEnabled } = useWinterUpdate()
  const pageFallback = (
    <div role="status" aria-live="polite" aria-busy="true" className="grid min-h-[40vh] place-items-center text-sm font-semibold text-slate-600 dark:text-slate-300">
      <span className="inline-flex items-center gap-2"><LoaderCircle className="size-5 animate-spin" aria-hidden="true" />{t('cloud.loading.status')}</span>
    </div>
  )
  // The app uses protected in-place tabs plus login/home and owner-gated admin routes.
  const [pathname, setPathname] = useState(() => normalizeAppPath(typeof window === 'undefined' ? '/' : window.location.pathname))
  const navigatePath = useCallback((nextPath, replace = false) => {
    const next = normalizeAppPath(nextPath)
    if (typeof window !== 'undefined' && normalizeAppPath(window.location.pathname) !== next) {
      const method = replace ? 'replaceState' : 'pushState'
      window.history[method]({}, '', next)
    }
    setPathname(next)
  }, [])

  useEffect(() => {
    const onPopState = () => setPathname(normalizeAppPath(window.location.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Lazy initial state — hydrated straight from localStorage (SSR-safe via try/catch).
  const [active, setActive] = useState('home')
  const [resetVersion, setResetVersion] = useState(0)
  const [dark, setDark] = useState(() => {
    const savedAppState = loadJSON(STORAGE_KEY, {})
    return typeof savedAppState?.dark === 'boolean' ? savedAppState.dark : true
  })
  const [isPremium, setIsPremium] = useState(() => {
    try {
      const savedTheme = window.localStorage.getItem('turkuaz-edu-premium-theme')
      if (savedTheme === 'true') return true
      // A missing preference always means the clean Turkuaz default.
      return false
    } catch {
      return false
    }
  })
  const [toasts, setToasts] = useState([])
  const toastTimersRef = useRef(new Map())
  const [profile, setProfile] = useState(() => isSupabaseConfigured ? null : loadProfile())
  const [cloudSession, setCloudSession] = useState(null)
  const [cloudReady, setCloudReady] = useState(false)
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured)
  const [remindersEnabled, setRemindersEnabled] = useState(getReminderPreference)
  const [authenticated, setAuthenticated] = useState(() => {
    if (isSupabaseConfigured || !loadProfile()) return false
    try {
      return window.localStorage.getItem(AUTH_KEY) !== 'false'
    } catch {
      return true
    }
  })
  const routeAuthenticated = isSupabaseConfigured
    ? Boolean(authUser)
    : authenticated
  const [editingProfile, setEditingProfile] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!routeAuthenticated && pathname !== '/login') {
      navigatePath('/login', true)
    } else if (routeAuthenticated && pathname === '/login') {
      navigatePath('/', true)
    }
  }, [authLoading, navigatePath, pathname, routeAuthenticated])

  const [stats, setStats] = useState(() => isSupabaseConfigured
    ? { ...DEFAULT_STATS, savedWordsCount: getSavedWordCount(), readingCompletedCount: getReadingCompletionCount(profile) }
    : loadLearnerStats(profile))
  const [rankUpEvent, setRankUpEvent] = useState(null)
  const [streakMilestoneEvent, setStreakMilestoneEvent] = useState(null)
  const [trophyCelebrationEvent, setTrophyCelebrationEvent] = useState(null)
  const [queuedTrophyEvents, setQueuedTrophyEvents] = useState([])
  const streakActivityRef = useRef({ streak: stats.streak, lastActivityDate: stats.lastActivityDate })
  const streakMilestoneSequenceRef = useRef(0)
  const trophySequenceRef = useRef(0)
  const trophyBaselineIdentityRef = useRef(null)
  const xpForRankRef = useRef(stats.xp)
  const rankUpSequenceRef = useRef(0)
  xpForRankRef.current = stats.xp
  const claimedQuestRewards = useRef(new Set())
  const [progress, setProgress] = useState(() => isSupabaseConfigured ? DEFAULT_PROGRESS : loadLearnerProgress())
  const [sectionResults, setSectionResults] = useState(() => loadJSON(STORAGE_KEY, {})?.multilevelSectionResults || {})
  const [mockLaunchTask, setMockLaunchTask] = useState(null)
  const [multilevelExamResult, setMultilevelExamResult] = useState(() => loadJSON(STORAGE_KEY, {})?.multilevelExamResult || null)
  const [unlockedMedals, setUnlockedMedals] = useState(() => {
    const saved = loadJSON(STORAGE_KEY, {})?.unlockedMedals
    return Array.isArray(saved) ? saved : DEFAULT_UNLOCKED_MEDALS
  })
  const [equippedMedal, setEquippedMedal] = useState(() => {
    const saved = loadJSON(STORAGE_KEY, {})?.equippedMedal
    return saved === undefined ? DEFAULT_EQUIPPED_MEDAL : saved
  })

  useEffect(() => {
    streakActivityRef.current = { streak: stats.streak, lastActivityDate: stats.lastActivityDate }
  }, [stats.streak, stats.lastActivityDate])

  useEffect(() => {
    if (!profile) return
    const readingCompletedCount = getReadingCompletionCount(profile)
    const savedWordsCount = getSavedWordCount()
    const completedQuizzes = Math.max(Number(stats.completedQuizzes) || 0, getLegacyQuizCount(profile, stats, loadJSON(STORAGE_KEY, {})))
    const listeningLessonsCompleted = getListeningCompletedCount(profile.userId || profile.email)
    if (stats.readingCompletedCount !== readingCompletedCount || stats.savedWordsCount !== savedWordsCount || stats.completedQuizzes !== completedQuizzes || stats.listeningLessonsCompleted !== listeningLessonsCompleted) {
      setStats((current) => ({ ...current, readingCompletedCount, savedWordsCount, completedQuizzes, listeningLessonsCompleted }))
    }
  }, [profile?.userId, profile?.email])

  // Keep a per-user local cache of streak badges as an offline fallback; the
  // normalized user_streaks row is synced whenever the learner state changes.
  useEffect(() => {
    if (!isSupabaseConfigured || !profile?.userId) return
    const key = `${STREAK_MILESTONE_STORAGE_PREFIX}${profile.userId}`
    const stored = loadJSON(key, [])
    const isValidMilestone = (days) => STREAK_MILESTONES.some((milestone) => milestone.days === Number(days))
    const savedDays = Array.isArray(stored) ? stored.map(Number).filter(isValidMilestone) : []
    const currentDays = Array.isArray(stats.streakMilestones) ? stats.streakMilestones.filter(isValidMilestone) : []
    const mergedDays = [...new Set([...savedDays, ...currentDays])].sort((a, b) => a - b)
    saveJSON(key, mergedDays)
    if (mergedDays.length !== currentDays.length || mergedDays.some((days, index) => days !== currentDays[index])) {
      setStats((current) => ({ ...current, streakMilestones: mergedDays }))
    }
  }, [profile?.userId, stats.streakMilestones])

  useEffect(() => {
    if (!isSupabaseConfigured || !profile?.userId) return
    const key = `${TROPHY_UNLOCK_STORAGE_PREFIX}${profile.userId}`
    const stored = loadJSON(key, [])
    const savedRecords = Array.isArray(stored) ? stored.filter((record) => TROPHIES.some((trophy) => trophy.id === record?.id)) : []
    const currentRecords = Array.isArray(stats.trophyUnlocks) ? stats.trophyUnlocks : []
    const mergedById = new Map(savedRecords.map((record) => [record.id, record]))
    for (const record of currentRecords) {
      const previous = mergedById.get(record.id)
      if (!previous || record.unlockedAt || !previous.unlockedAt) mergedById.set(record.id, record)
    }
    const mergedRecords = [...mergedById.values()]
    saveJSON(key, mergedRecords)
    const isSame = mergedRecords.length === currentRecords.length && mergedRecords.every((record, index) => {
      const current = currentRecords[index]
      return current && record.id === current.id && record.unlockedAt === current.unlockedAt && record.rewardXp === current.rewardXp
    })
    if (!isSame) setStats((current) => ({ ...current, trophyUnlocks: mergedRecords }))
  }, [profile?.userId, stats.trophyUnlocks])

  // Theme classes and full local persistence for learner progress/settings.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.classList.toggle('premium-theme', isPremium)
    document.documentElement.classList.toggle('theme-premium', isPremium)
    document.documentElement.classList.toggle('theme-night', !isPremium && dark)
    document.documentElement.classList.toggle('theme-default', !isPremium && !dark)
  }, [dark, isPremium])

  useEffect(() => {
    try {
      window.localStorage.setItem('turkuaz-edu-premium-theme', String(isPremium))
    } catch {
      // The existing app-state persistence still keeps the preference when available.
    }
  }, [isPremium])

  useEffect(() => {
    const localState = { multilevelSectionResults: sectionResults, multilevelExamResult, dark, isPremium, unlockedMedals, equippedMedal }
    if (profile) Object.assign(localState, { stats, progress })
    saveJSON(STORAGE_KEY, localState)
  }, [stats, progress, profile, sectionResults, multilevelExamResult, dark, isPremium, unlockedMedals, equippedMedal])

  // Profile persistence — stays logged in across refreshes
  useEffect(() => {
    // Cache non-empty profiles locally so a later cloud outage can still render the learner UI.
    if (profile) saveProfile(profile)
  }, [profile])

  useEffect(() => {
    if (isSupabaseConfigured) return
    try {
      window.localStorage.setItem(AUTH_KEY, String(authenticated))
    } catch {
      // In-memory sign-in still works for this app session.
    }
  }, [authenticated])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) { setAuthLoading(false); return undefined }
    if (authStateLoading) return undefined
    let alive = true
    const hydrateSession = async (session) => {
      if (!alive) return
      setCloudSession(session || null)
      setCloudReady(false)
      if (!session?.user) {
        setCloudReady(false)
        setAuthenticated(false)
        setProfile(null)
        setStats(DEFAULT_STATS)
        setProgress(DEFAULT_PROGRESS)
        setAuthLoading(false)
        return
      }
      setAuthenticated(true)
      const cachedProfile = loadProfile()
      const sessionEmail = String(session.user.email || '').trim().toLowerCase()
      const cachedEmail = String(cachedProfile?.email || '').trim().toLowerCase()
      const cachedProfileMatchesSession = Boolean(cachedProfile && (
        cachedProfile.userId === session.user.id || (sessionEmail && cachedEmail && sessionEmail === cachedEmail)
      ))
      if (cachedProfileMatchesSession) {
        setStats(loadLearnerStats(cachedProfile))
        setProgress(loadLearnerProgress())
      } else {
        setStats(DEFAULT_STATS)
        setProgress(DEFAULT_PROGRESS)
      }
      const metadata = session.user.user_metadata || {}
      const forceOnboarding = hasPendingOnboarding(session.user.id)
      const [progressResult, gamificationResult] = await Promise.allSettled([
        fetchLearnerProgress(session.user.id),
        fetchLearnerGamification(session.user.id),
      ])
      const row = progressResult.status === 'fulfilled' ? progressResult.value : null
      const cloudData = gamificationResult.status === 'fulfilled' ? gamificationResult.value : null
      const progressLookupSucceeded = progressResult.status === 'fulfilled'
      if (progressResult.status === 'rejected') console.error('Could not load cloud progress:', progressResult.reason)
      if (gamificationResult.status === 'rejected') console.warn('Could not load cloud profile, streak, achievements, or vocabulary. Apply the latest Supabase schema to enable full sync.', gamificationResult.reason)
      if (!alive) return
      if (cloudData?.vocabulary) mergeCloudVocabularyIntoLocal(cloudData.vocabulary)
      const cloudAchievementRecords = (Array.isArray(cloudData?.achievements) ? cloudData.achievements : [])
        .filter((record) => record && typeof record === 'object' && typeof record.trophy_id === 'string')
        .map((record) => ({
          id: record.trophy_id,
          unlockedAt: record.unlocked_at || null,
          rewardXp: Number(record.progress_data?.rewardXp ?? record.progress_data?.reward_xp) || 0,
          historical: Boolean(record.progress_data?.historical),
        }))
      const cloudStreak = cloudData?.streak
      const cloudProfile = cloudData?.profile
      const localSavedXp = cachedProfileMatchesSession ? Math.max(0, Number(loadLearnerStats(cachedProfile).xp) || 0) : 0
      const restoredXp = Math.max(0, Number(row?.xp) || 0, Number(cloudProfile?.total_xp) || 0, localSavedXp)
      const streakCount = Number(row?.streak ?? cloudStreak?.streak_count ?? cloudProfile?.current_streak ?? 0)
      const cloudMilestones = Array.isArray(cloudStreak?.unlocked_milestones)
        ? cloudStreak.unlocked_milestones.map(Number).filter((days) => STREAK_MILESTONES.some((milestone) => milestone.days === days))
        : []
      setStats((current) => ({
        ...current,
        xp: restoredXp,
        streak: Math.max(0, Number(row?.streak ?? cloudStreak?.streak_count ?? cloudProfile?.current_streak ?? current.streak) || 0),
        streakMilestones: [...new Set([...(current.streakMilestones || []), ...cloudMilestones, ...getStreakMilestonesUpTo(streakCount)])].sort((a, b) => a - b),
        trophyUnlocks: mergeTrophyRecords(current.trophyUnlocks || [], cloudAchievementRecords),
        winterStudy: normalizeWinterStudy(cloudStreak?.winter_study_days || current.winterStudy),
        savedWordsCount: getSavedWordCount(),
        completedLessons: row?.completed_lessons || current.completedLessons || [],
        moduleScores: mergeModuleScores(current.moduleScores, row?.module_scores),
        weeklyXp: row?.weekly_xp ?? current.weeklyXp ?? 0,
        weekStart: row?.week_start ?? current.weekStart ?? null,
        lastActivityDate: row?.last_activity_date || cloudStreak?.last_active_date || current.lastActivityDate || null,
        dailyXp: row?.daily_xp || current.dailyXp || {},
        analyticsTrackingSince: row?.analytics_tracking_since || current.analyticsTrackingSince || null,
        dailyQuests: row?.daily_quests || current.dailyQuests || null,
        questWordsCredited: row?.quest_words_credited || current.questWordsCredited || [],
        skillsCompleted: row?.completed_lessons || current.skillsCompleted || [],
      }))
      void syncProfileXpFloor(session.user.id, restoredXp).catch((error) => {
        console.warn('[Turkuaz Edu] Could not reconcile the saved XP total with the profile.', error)
      })
      if (!alive) return
      const hasExistingProgress = progressLookupSucceeded ? Boolean(row || cloudProfile || cloudStreak) : true
      const learnerProfile = getLearnerProfileFromAuth(session.user, row?.target_level || metadata.target_level, hasExistingProgress, forceOnboarding, cloudProfile)
      setProfile({ ...preserveCachedProfileAvatar(learnerProfile, cachedProfile, cachedProfileMatchesSession, !cloudProfile), ratingTier: getRatingTier(restoredXp) })
      setCloudReady(progressLookupSucceeded && Boolean(cloudData) && !cloudData.hasReadFailures)
      setAuthLoading(false)
    }
    const restoreLocalFallback = (session) => {
      if (!alive) return
      const cachedProfile = loadProfile()
      setCloudReady(false)

      if (session?.user) {
        const email = String(session.user.email || '').trim().toLowerCase()
        const cachedEmail = String(cachedProfile?.email || '').trim().toLowerCase()
        const cachedMatchesSession = Boolean(cachedProfile && (
          cachedProfile.userId === session.user.id || (email && cachedEmail && email === cachedEmail)
        ))
        const metadata = session.user.user_metadata || {}
        const learnerProfile = getLearnerProfileFromAuth(
          session.user,
          metadata.target_level,
          true,
          hasPendingOnboarding(session.user.id),
        )
        setCloudSession(session)
        setAuthenticated(true)
        setStats(cachedMatchesSession ? loadLearnerStats(cachedProfile) : DEFAULT_STATS)
        setProgress(cachedMatchesSession ? loadLearnerProgress() : DEFAULT_PROGRESS)
        setProfile(preserveCachedProfileAvatar(learnerProfile, cachedProfile, cachedMatchesSession, true))
      } else {
        setCloudSession(null)
        setProfile(cachedProfile)
        setAuthenticated(Boolean(cachedProfile))
        setStats(loadLearnerStats(cachedProfile))
        setProgress(loadLearnerProgress())
      }

      setAuthLoading(false)
    }

    const safelyHydrateSession = async (session) => {
      try {
        await hydrateSession(session)
      } catch (error) {
        console.warn('[Turkuaz Edu] Cloud session hydration failed; continuing with cached local data.', error)
        restoreLocalFallback(session)
      }
    }

    void safelyHydrateSession(authSession)
    return () => { alive = false }
  }, [authSession, authStateLoading])

  const showToast = useCallback((message, type = 'default') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((list) => [...list, { id, message, type }])
    const timer = window.setTimeout(() => {
      toastTimersRef.current.delete(id)
      setToasts((list) => list.filter((toast) => toast.id !== id))
    }, 3000)
    toastTimersRef.current.set(id, timer)
  }, [])

  useEffect(() => () => {
    toastTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    toastTimersRef.current.clear()
  }, [])

  useEffect(() => {
    const onUnhandledRejection = (event) => {
      event.preventDefault()
      console.error('[Turkuaz Edu] Unhandled asynchronous error:', event.reason)
      showToast(t('system.unexpectedError'), 'default')
    }
    window.addEventListener('unhandledrejection', onUnhandledRejection)
    return () => window.removeEventListener('unhandledrejection', onUnhandledRejection)
  }, [showToast, t])

  useEffect(() => {
    if (!isSupabaseConfigured || !cloudReady || !cloudSession?.user || !profile || profile.onboardingCompleted === false) return undefined
    const timeout = window.setTimeout(() => {
      syncLearnerProgress(cloudSession.user.id, profile, stats).catch((error) => console.error('Cloud progress sync failed:', error))
    }, 250)
    return () => window.clearTimeout(timeout)
  }, [cloudReady, cloudSession, profile, stats])

  useEffect(() => { void showDailyReminderIfDue({ title: t('reminder.notification.title'), body: t('reminder.notification.body') }) }, [t])

  const toggleDailyReminder = useCallback(async (enabled) => {
    if (!enabled) { disableDailyReminder(); setRemindersEnabled(false); showToast(t('auth.reminder.off'), 'default'); return }
    try {
      await enableDailyReminder()
      setRemindersEnabled(true)
      showToast(t('auth.reminder.on'), 'success')
    } catch {
      setRemindersEnabled(false)
      showToast(t('auth.reminder.denied'), 'default')
    }
  }, [showToast, t])

  const handleCloudRegister = useCallback(async ({ email, password, profile: newProfile }) => {
    if (!supabase) throw new Error('Supabase is not configured.')
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name: newProfile.name, surname: newProfile.surname, target_level: newProfile.targetLevel, onboarding_completed: false } } })
    if (error) throw error
    if (!data.session) throw new Error('Account created. Confirm your email, then sign in to continue.')
    const learner = { ...newProfile, onboardingCompleted: false, userId: data.user.id }
    setCloudSession(data.session); setProfile(learner); setAuthenticated(true); setCloudReady(true); setAuthLoading(false)
    try { await syncLearnerProgress(data.user.id, learner, DEFAULT_STATS) } catch (error) { console.error('Initial cloud progress write failed:', error) }
    showToast('Hisob Supabase’da yaratildi va bulut bilan ulandi.', 'success')
  }, [showToast])

  const handleCloudLogin = useCallback(async ({ email, password }) => {
    if (!supabase) throw new Error('Supabase is not configured.')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const cachedProfile = loadProfile()
    const cachedEmail = String(cachedProfile?.email || '').trim().toLowerCase()
    const sessionEmail = String(data.user?.email || '').trim().toLowerCase()
    const cachedProfileMatchesSession = Boolean(cachedProfile && (
      cachedProfile.userId === data.user?.id || (cachedEmail && sessionEmail && cachedEmail === sessionEmail)
    ))
    if (cachedProfileMatchesSession) {
      setStats(loadLearnerStats(cachedProfile))
      setProgress(loadLearnerProgress())
    } else {
      setStats(DEFAULT_STATS)
      setProgress(DEFAULT_PROGRESS)
    }
    const [progressResult, gamificationResult] = await Promise.allSettled([
      fetchLearnerProgress(data.user.id),
      fetchLearnerGamification(data.user.id),
    ])
    const row = progressResult.status === 'fulfilled' ? progressResult.value : null
    const cloudData = gamificationResult.status === 'fulfilled' ? gamificationResult.value : null
    const progressLookupSucceeded = progressResult.status === 'fulfilled'
    if (progressResult.status === 'rejected') console.error('Could not load cloud progress:', progressResult.reason)
    if (gamificationResult.status === 'rejected') console.warn('Could not load cloud gamification data. Apply the latest Supabase schema to enable full sync.', gamificationResult.reason)
    if (cloudData?.vocabulary) mergeCloudVocabularyIntoLocal(cloudData.vocabulary)
    const metadata = data.user.user_metadata || {}
    const forceOnboarding = hasPendingOnboarding(data.user.id)
    const localSavedXp = cachedProfileMatchesSession ? Math.max(0, Number(loadLearnerStats(cachedProfile).xp) || 0) : 0
    const restoredXp = Math.max(0, Number(row?.xp) || 0, Number(cloudData?.profile?.total_xp) || 0, localSavedXp)
    void syncProfileXpFloor(data.user.id, restoredXp).catch((syncError) => {
      console.warn('[Turkuaz Edu] Could not reconcile the saved XP total with the profile.', syncError)
    })
    const learnerProfile = getLearnerProfileFromAuth(data.user, row?.target_level || metadata.target_level, progressLookupSucceeded ? Boolean(row || cloudData?.profile || cloudData?.streak) : true, forceOnboarding, cloudData?.profile)
    const learner = { ...preserveCachedProfileAvatar(learnerProfile, cachedProfile, cachedProfileMatchesSession, !cloudData?.profile), ratingTier: getRatingTier(restoredXp) }
    setCloudSession(data.session); setProfile(learner); setAuthenticated(true); setCloudReady(progressLookupSucceeded && Boolean(cloudData) && !cloudData.hasReadFailures); setAuthLoading(false)
    const remoteAchievements = (Array.isArray(cloudData?.achievements) ? cloudData.achievements : [])
      .filter((record) => record && typeof record === 'object' && typeof record.trophy_id === 'string')
      .map((record) => ({ id: record.trophy_id, unlockedAt: record.unlocked_at || null, rewardXp: Number(record.progress_data?.rewardXp ?? record.progress_data?.reward_xp) || 0, historical: Boolean(record.progress_data?.historical) }))
    const cloudStreak = cloudData?.streak
    const streakCount = Number(row?.streak ?? cloudStreak?.streak_count ?? cloudData?.profile?.current_streak ?? 0)
    if (row || cloudData) setStats((current) => ({
      ...current,
      xp: restoredXp,
      streak: Math.max(0, Number(row?.streak ?? cloudStreak?.streak_count ?? cloudData?.profile?.current_streak ?? current.streak) || 0),
      streakMilestones: [...new Set([...(current.streakMilestones || []), ...(Array.isArray(cloudStreak?.unlocked_milestones) ? cloudStreak.unlocked_milestones.map(Number) : []), ...getStreakMilestonesUpTo(streakCount)])].filter((days) => STREAK_MILESTONES.some((milestone) => milestone.days === days)).sort((a, b) => a - b),
      trophyUnlocks: mergeTrophyRecords(current.trophyUnlocks || [], remoteAchievements),
      winterStudy: normalizeWinterStudy(cloudStreak?.winter_study_days || current.winterStudy),
      savedWordsCount: getSavedWordCount(),
      completedLessons: row?.completed_lessons || current.completedLessons || [],
      moduleScores: mergeModuleScores(current.moduleScores, row?.module_scores),
      skillsCompleted: row?.completed_lessons || current.skillsCompleted || [],
      weeklyXp: row?.weekly_xp ?? current.weeklyXp ?? 0,
      weekStart: row?.week_start ?? current.weekStart ?? null,
      lastActivityDate: row?.last_activity_date || cloudStreak?.last_active_date || current.lastActivityDate || null,
      dailyXp: row?.daily_xp || current.dailyXp || {},
      analyticsTrackingSince: row?.analytics_tracking_since || current.analyticsTrackingSince || null,
      dailyQuests: row?.daily_quests || current.dailyQuests || null,
      questWordsCredited: row?.quest_words_credited || current.questWordsCredited || [],
    }))
    showToast('Bulut hisobingizga muvaffaqiyatli kirdingiz.', 'success')
  }, [showToast])

  // Show platform-specific install steps because native install prompts are
  // not exposed consistently across browsers and embedded previews.
  const handleInstallApp = useCallback(() => {
    const userAgent = window.navigator.userAgent || ''
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)

    if (isIOS) {
      window.alert('iPhone yoki iPad’da ilovani oʻrnatish uchun Safari Share (Ulashish) tugmasini bosing, soʻng “Add to Home Screen” (“Bosh ekranga qoʻshish”)ni tanlang.')
      return
    }

    window.alert('Android yoki kompyuterda Chrome’ning uch nuqta (⋮) menyusini bosing, soʻng “Install app” yoki “Add to home screen”ni tanlang.')
  }, [])

  const updateSavedWordsCount = useCallback((count) => {
    const safeCount = Math.max(0, Math.floor(Number(count) || 0))
    setStats((current) => current.savedWordsCount === safeCount ? current : { ...current, savedWordsCount: safeCount })
  }, [])

  const updateReadingCompletedCount = useCallback((count) => {
    const safeCount = Math.max(0, Math.floor(Number(count) || 0))
    setStats((current) => current.readingCompletedCount === safeCount ? current : { ...current, readingCompletedCount: safeCount })
  }, [])

  const recordFlawlessQuiz = useCallback(() => {
    setStats((current) => current.flawlessQuizAchieved ? current : { ...current, flawlessQuizAchieved: true })
  }, [])

  const recordPerfectReadingExam = useCallback(() => {
    setStats((current) => current.readingPerfectExamAchieved ? current : { ...current, readingPerfectExamAchieved: true })
  }, [])

  const recordSpeedBonus = useCallback(() => {
    setStats((current) => current.speedBonusAchieved ? current : { ...current, speedBonusAchieved: true })
  }, [])

  const recordNewQuestWord = useCallback((word) => {
    const wordId = String(word || '').trim()
    if (!wordId) return
    const today = localDateKey()
    setStats((current) => {
      const credited = Array.isArray(current.questWordsCredited) ? current.questWordsCredited : []
      if (credited.includes(wordId)) return current
      const quests = getDailyQuestProgress(current, today)
      const nextStats = {
        ...current,
        questWordsCredited: [...credited, wordId],
        dailyQuests: { ...quests, words: quests.words.includes(wordId) ? quests.words : [...quests.words, wordId] },
      }
      return incrementWeeklyGoal(nextStats, 'words', 1, today)
    })
  }, [])

  const recordListeningQuest = useCallback(() => {
    const today = localDateKey()
    setStats((current) => {
      const quests = getDailyQuestProgress(current, today)
      return { ...current, dailyQuests: { ...quests, listening: Math.min(1, quests.listening + 1) } }
    })
  }, [])

  const addXp = useCallback(
    (amount, { countTowardDailyXpQuest = true, markLessonActivity = true, taskType } = {}) => {
      const today = localDateKey()
      const award = Math.max(0, Number(amount) || 0)
      const xpTaskType = String(taskType || `activity:${Date.now()}:${Math.random().toString(36).slice(2)}`)
      const cloudAwardEnabled = Boolean(award > 0 && isSupabaseConfigured && authUser?.id)
      if (award > 0 && !cloudAwardEnabled && !claimLocalTaskXp(profile?.userId || profile?.email || 'local', xpTaskType)) return false
      let nextXp = null
      if (award > 0) {
        const previousXp = Math.max(0, Number(xpForRankRef.current) || 0)
        nextXp = previousXp + award
        xpForRankRef.current = nextXp
        setProfile((current) => current ? { ...current, ratingTier: getRatingTier(nextXp) } : current)
        const previousRank = getRankProgress(previousXp).rank
        const nextRankState = getRankProgress(nextXp)
        if (!cloudAwardEnabled && nextRankState.rank.id !== previousRank.id) {
          rankUpSequenceRef.current += 1
          setRankUpEvent({ id: rankUpSequenceRef.current, level: nextRankState.level, xp: nextXp })
        }
      }
      if (markLessonActivity) {
        const previousActivity = streakActivityRef.current
        const previousStreak = Math.max(0, Number(previousActivity.streak) || 0)
        const startsNewDay = previousActivity.lastActivityDate !== today
        const nextStreak = !startsNewDay
          ? previousStreak
          : !previousActivity.lastActivityDate || previousActivity.lastActivityDate === previousDateKey(today)
            ? previousStreak + 1
            : 1
        if (startsNewDay) {
          streakActivityRef.current = { streak: nextStreak, lastActivityDate: today }
          const reachedMilestone = STREAK_MILESTONES.find(({ days }) => previousStreak < days && nextStreak >= days)
          if (reachedMilestone) {
            streakMilestoneSequenceRef.current += 1
            setStreakMilestoneEvent({ id: streakMilestoneSequenceRef.current, days: reachedMilestone.days })
          }
        }
      }
      const monday = new Date(); monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
      const weekStart = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`
      const historyCutoffDate = new Date(); historyCutoffDate.setDate(historyCutoffDate.getDate() - 89)
      const historyCutoffKey = localDateKey(historyCutoffDate)
      setStats((s) => {
        const streak = !markLessonActivity || s.lastActivityDate === today
          ? s.streak
          : !s.lastActivityDate || s.lastActivityDate === previousDateKey(today)
            ? s.streak + 1
            : 1
        const dailyXp = Object.fromEntries(Object.entries(s.dailyXp || {}).filter(([dateKey]) => dateKey >= historyCutoffKey))
        if (award > 0) dailyXp[today] = (Number(dailyXp[today]) || 0) + award
        const dailyQuests = getDailyQuestProgress(s, today)
        if (countTowardDailyXpQuest && award > 0) dailyQuests.xp += award
        const winterStudy = winterFeatureEnabled && markLessonActivity
          ? recordWinterStudyDay(s.winterStudy, today)
          : normalizeWinterStudy(s.winterStudy)
        const savedMilestones = Array.isArray(s.streakMilestones) ? s.streakMilestones : []
        const streakMilestones = markLessonActivity
          ? [...new Set([...savedMilestones, ...getStreakMilestonesUpTo(streak)])]
          : savedMilestones
        return {
          ...s,
          xp: s.xp + award,
          weeklyXp: (s.weekStart === weekStart ? (s.weeklyXp || 0) : 0) + award,
          weekStart,
          dailyXp,
          analyticsTrackingSince: s.analyticsTrackingSince || (award > 0 ? today : null),
          dailyQuests,
          levelsCompleted: s.levelsCompleted + (markLessonActivity ? 1 : 0),
          streak,
          streakMilestones,
          winterStudy,
          lastActivityDate: markLessonActivity ? today : s.lastActivityDate,
        }
      })
      if (cloudAwardEnabled) {
        void awardXP(authUser.id, award, xpTaskType)
          .then((result) => {
            const deniedAmount = Math.max(0, award - result.amountAwarded)
            const reconciledXp = Math.max(result.totalXp, xpForRankRef.current - deniedAmount)
            xpForRankRef.current = reconciledXp
            if (deniedAmount > 0) {
              setStats((current) => {
                const dailyXp = { ...(current.dailyXp || {}) }
                dailyXp[today] = Math.max(0, (Number(dailyXp[today]) || 0) - deniedAmount)
                const weeklyXp = Math.max(0, (Number(current.weeklyXp) || 0) - deniedAmount)
                const dailyQuests = getDailyQuestProgress(current, today)
                if (countTowardDailyXpQuest) dailyQuests.xp = Math.max(0, dailyQuests.xp - deniedAmount)
                return { ...current, xp: Math.max(reconciledXp, current.xp - deniedAmount), dailyXp, weeklyXp, dailyQuests }
              })
            } else {
              setStats((current) => current.xp >= reconciledXp ? current : { ...current, xp: reconciledXp })
            }
            setProfile((current) => current ? { ...current, ratingTier: getRatingTier(reconciledXp) } : current)
            if (result.amountAwarded > 0) {
              const previousCanonicalRank = getRankProgress(Math.max(0, result.totalXp - result.amountAwarded)).rank
              const nextCanonicalRank = getRankProgress(result.totalXp)
              if (nextCanonicalRank.rank.id !== previousCanonicalRank.id) {
                rankUpSequenceRef.current += 1
                setRankUpEvent({ id: rankUpSequenceRef.current, level: nextCanonicalRank.level, xp: result.totalXp })
              }
              showToast(`+${result.amountAwarded} XP qoʻshildi! 🎉`, 'xp')
            }
          })
          .catch((error) => console.error('[Turkuaz Edu] Could not add XP to the cloud profile.', error))
      } else if (award > 0) showToast(`+${award} XP qoʻshildi! 🎉`, 'xp')
      return true
    },
    [authUser?.id, isSupabaseConfigured, profile?.userId, profile?.email, showToast, winterFeatureEnabled],
  )

  const claimDailyWordReward = useCallback(() => {
    const today = localDateKey()
    const currentQuests = getDailyQuestProgress(stats, today)
    if (currentQuests.words.length < 3 || currentQuests.wordRewardClaimed || claimedQuestRewards.current.has(today)) return false
    claimedQuestRewards.current.add(today)
    setStats((current) => {
      const quests = getDailyQuestProgress(current, today)
      if (quests.words.length < 3 || quests.wordRewardClaimed) return current
      return { ...current, dailyQuests: { ...quests, wordRewardClaimed: true } }
    })
    addXp(25, { countTowardDailyXpQuest: false, markLessonActivity: false, taskType: `daily-words:${today}` })
    return true
  }, [addXp, stats])

  const completeLevel = useCallback(
    (skill, resultPercent, xpAward = 50, taskType = `activity:${Date.now()}:${Math.random().toString(36).slice(2)}`) => {
      setProgress((p) => {
        const next = { ...p }
        if (skill && next[skill] !== undefined) {
          next[skill] = typeof resultPercent === 'number'
            ? Math.max(0, Math.min(100, resultPercent))
            : Math.min(100, next[skill] + 1)
        }
        return next
      })
      setStats((s) => {
        const skillsCompleted = Array.isArray(s.skillsCompleted) ? s.skillsCompleted : []
        const isNewSkill = Boolean(skill && !skillsCompleted.includes(skill))
        const updated = {
          ...s,
          completedQuizzes: (Number(s.completedQuizzes) || 0) + 1,
          ...(isNewSkill ? {
            skillsCompleted: [...skillsCompleted, skill],
            completedLessons: [...new Set([...(s.completedLessons || []), skill])],
          } : {}),
        }
        return String(taskType).startsWith('exam-section:') ? updated : incrementWeeklyGoal(updated, 'lessons')
      })
      addXp(xpAward, { taskType })
    },
    [addXp]
  )

  const navigate = useCallback((id) => {
    if (id === 'admin') {
      navigatePath('/admin')
      return
    }
    if (pathname.startsWith('/admin')) navigatePath('/', true)
    setActive(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [navigatePath, pathname])

  const handleAdminHome = useCallback(() => {
    setActive('home')
    navigatePath('/', true)
  }, [navigatePath])

  const handleAdminDenied = useCallback((message) => {
    handleAdminHome()
    showToast(message || 'Ruxsat etilmagan hudud!', 'default')
  }, [handleAdminHome, showToast])

  // Requested 0–75 scaled section results; unattempted sections remain at zero.
  const scores = useMemo(() => ({
    dinleme: sectionResults.dinleme?.scaledScore ?? 0,
    okuma: sectionResults.okuma?.scaledScore ?? 0,
    yazma: sectionResults.yazma?.scaledScore ?? 0,
    konusma: sectionResults.konusma?.scaledScore ?? 0,
  }), [sectionResults])
  const certificate = useMemo(() => calculateCertificate(scores), [scores])
  const totalScore = certificate.average
  const targetScore = profile?.targetLevel === 'B1' ? 38 : profile?.targetLevel === 'B2' ? 51 : profile?.targetLevel === 'C1' ? 65 : 0
  const targetPct = targetScore ? Math.min(100, Math.round((totalScore / targetScore) * 100)) : 0
  const todaysQuests = getDailyQuestProgress(stats, localDateKey())
  const trophyMetrics = useMemo(() => ({
    xp: stats.xp,
    completedQuizzes: stats.completedQuizzes,
    currentStreak: stats.streak,
    streakMilestones: stats.streakMilestones,
    readingCompletedCount: stats.readingCompletedCount,
    readingPerfectExamAchieved: stats.readingPerfectExamAchieved,
    listeningPercent: progress.dinleme,
    savedWordsCount: stats.savedWordsCount,
    flawlessQuizAchieved: stats.flawlessQuizAchieved,
    speedBonusAchieved: stats.speedBonusAchieved,
    winterStudyDays: winterFeatureEnabled ? getWinterStudyDayCount(stats.winterStudy) : 0,
  }), [stats.xp, stats.completedQuizzes, stats.streak, stats.streakMilestones, stats.readingCompletedCount, stats.readingPerfectExamAchieved, stats.savedWordsCount, stats.flawlessQuizAchieved, stats.speedBonusAchieved, stats.winterStudy, progress.dinleme, winterFeatureEnabled])

  useEffect(() => {
    if (authLoading || !authenticated || !profile || profile.onboardingCompleted === false) return
    const identity = String(profile.userId || profile.email || 'local')
    const identityChanged = trophyBaselineIdentityRef.current !== identity
    if (identityChanged) trophyBaselineIdentityRef.current = identity

    const records = Array.isArray(stats.trophyUnlocks) ? stats.trophyUnlocks : []
    const knownIds = new Set(records.map((record) => record.id))
    const eligibilityMetrics = identityChanged ? {
      ...trophyMetrics,
      savedWordsCount: getSavedWordCount(),
      readingCompletedCount: getReadingCompletionCount(profile),
      completedQuizzes: Math.max(Number(trophyMetrics.completedQuizzes) || 0, getLegacyQuizCount(profile, stats, loadJSON(STORAGE_KEY, {}))),
    } : trophyMetrics
    const newlyEligible = TROPHIES.filter((trophy) => getTrophyProgress(trophy, eligibilityMetrics).unlocked && !knownIds.has(trophy.id))
    if (!newlyEligible.length) return

    if (identityChanged) {
      const historicalRecords = newlyEligible.map((trophy) => ({ id: trophy.id, unlockedAt: null, rewardXp: 0, historical: true }))
      setStats((current) => ({ ...current, trophyUnlocks: [...(current.trophyUnlocks || []), ...historicalRecords] }))
      return
    }

    const unlockedAt = new Date().toISOString()
    const newRecords = newlyEligible.map((trophy) => ({
      id: trophy.id,
      unlockedAt,
      rewardXp: TROPHY_REWARD_XP[trophy.id] || 0,
      historical: false,
    }))
    setStats((current) => {
      const currentRecords = Array.isArray(current.trophyUnlocks) ? current.trophyUnlocks : []
      const currentIds = new Set(currentRecords.map((record) => record.id))
      return { ...current, trophyUnlocks: [...currentRecords, ...newRecords.filter((record) => !currentIds.has(record.id))] }
    })
    setQueuedTrophyEvents((queue) => {
      const queuedIds = new Set(queue.map((event) => event.trophyId))
      return [...queue, ...newRecords.filter((record) => !queuedIds.has(record.id)).map((record) => {
        trophySequenceRef.current += 1
        return { id: trophySequenceRef.current, trophyId: record.id, unlockedAt, rewardXp: record.rewardXp }
      })]
    })
    const rewardTotal = newRecords.reduce((sum, record) => sum + record.rewardXp, 0)
    if (rewardTotal > 0) addXp(rewardTotal, { countTowardDailyXpQuest: false, markLessonActivity: false })
  }, [authLoading, authenticated, profile, stats.trophyUnlocks, trophyMetrics, addXp])

  useEffect(() => {
    if (trophyCelebrationEvent || queuedTrophyEvents.length === 0) return
    const [nextEvent, ...remaining] = queuedTrophyEvents
    setQueuedTrophyEvents(remaining)
    setTrophyCelebrationEvent(nextEvent)
  }, [trophyCelebrationEvent, queuedTrophyEvents])

  // ------------------------------ auth flow ------------------------------

  const handleSaveProfile = (p) => {
    const learnerProfile = editingProfile ? p : { ...p, onboardingCompleted: false }
    if (isSupabaseConfigured && supabase && cloudSession?.user) {
      supabase.auth.updateUser({ data: {
        name: learnerProfile.name,
        surname: learnerProfile.surname,
        target_level: learnerProfile.targetLevel,
        onboarding_completed: learnerProfile.onboardingCompleted,
        learning_goal: learnerProfile.learningGoal,
        starting_path: learnerProfile.startingPath,
        starting_level: learnerProfile.startingLevel,
      } }).catch((error) => console.error('Profile sync failed:', error))
    }
    setProfile(learnerProfile)
    setAuthenticated(true)
    setEditingProfile(false)
    showToast(editingProfile ? 'Profil yangilandi! ✅' : 'Roʻyxatdan oʻtdingiz! 🎉', 'success')
  }

  const handleSaveAvatar = async (avatarPath) => {
    if (isSupabaseConfigured) {
      const userId = cloudSession?.user?.id
      if (!userId) throw new Error(t('profile.avatar.failure'))
      await updateLearnerAvatar(userId, avatarPath, { ...profile, xp: stats.xp, streak: stats.streak })
    }
    setProfile((current) => current ? { ...current, avatarUrl: avatarPath, avatar_url: avatarPath } : current)
    showToast(t('profile.avatar.saved'), 'success')
  }

  const handleLogin = () => {
    setAuthenticated(true)
    showToast('Tekrar hoş geldiniz! ✅', 'success')
  }

  const completeOnboarding = useCallback((choices) => {
    const completedProfile = {
      ...profile,
      ...choices,
      onboardingCompleted: true,
    }
    setProfile(completedProfile)
    setActive('home')
    try {
      const pendingOwner = window.localStorage.getItem(ONBOARDING_PENDING_KEY)
      if (pendingOwner === 'pending' || pendingOwner === String(profile?.userId)) window.localStorage.removeItem(ONBOARDING_PENDING_KEY)
    } catch { /* profile state still persists onboarding completion */ }

    if (isSupabaseConfigured && supabase && cloudSession?.user) {
      void supabase.auth.updateUser({ data: {
        onboarding_completed: true,
        learning_goal: choices.learningGoal,
        starting_path: choices.startingPath,
        starting_level: choices.startingLevel,
      } }).then(({ error }) => {
        if (error) console.error('Onboarding profile sync failed:', error)
      }).catch((error) => console.error('Onboarding profile sync failed:', error))
    }
  }, [cloudSession?.user, profile])

  const handleClearData = () => {
    claimedQuestRewards.current.clear()
    clearAllStorage()
    const cloudUserId = cloudSession?.user?.id
    if (isSupabaseConfigured && cloudUserId) {
      void (async () => {
        try { await deleteLearnerCloudData(cloudUserId) }
        catch (error) { console.error('Cloud learner data deletion failed:', error) }
        finally {
          try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
          } catch (error) {
            console.error('Supabase sign out after data deletion failed:', error)
          }
        }
      })()
    } else if (isSupabaseConfigured && supabase) {
      void supabase.auth.signOut().catch((error) => console.error('[Turkuaz Edu] Supabase sign out failed:', error))
    }
    setCloudSession(null)
    setCloudReady(false)
    setProfile(null)
    setAuthenticated(false)
    setEditingProfile(false)
    setStats(DEFAULT_STATS)
    setTrophyCelebrationEvent(null)
    setQueuedTrophyEvents([])
    trophyBaselineIdentityRef.current = null
    setProgress(DEFAULT_PROGRESS)
    setSectionResults({})
    setMultilevelExamResult(null)
    setUnlockedMedals(DEFAULT_UNLOCKED_MEDALS)
    setEquippedMedal(DEFAULT_EQUIPPED_MEDAL)
    setDark(true)
    setIsPremium(false)
    setActive('home')
    setResetVersion((version) => version + 1)
    showToast('Barcha maʼlumotlar tozalandi 🧹', 'save')
  }

  const handleLogout = async () => {
    claimedQuestRewards.current.clear()
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
      } catch (error) {
        console.error('[Turkuaz Edu] Supabase sign out failed:', error)
        showToast('Hisobdan chiqib bo‘lmadi. Qayta urinib ko‘ring.', 'default')
        return
      }
    }
    setCloudSession(null)
    setCloudReady(false)
    setProfile(isSupabaseConfigured ? null : profile)
    setAuthenticated(false)
    setActive('home')
    navigatePath('/login', true)
    showToast('Chiqib qoldingiz', 'default')
  }

  // ------------------------------ views --------------------------------

  const renderView = () => {
    // Keep only modules without an implementation behind the Coming Soon screen.
    if (!['home', 'plan', 'journey', 'shop', 'analytics', 'leagues', 'clans', 'okuma', 'dinleme', 'lugat', 'writing-practice', 'yazma', 'konusma', 'exams', 'full-mock', 'mixed-practice', 'quick-assessment', 'mock'].includes(active)) return <ComingSoon isPremium={isPremium} onBack={() => navigate('home')} />

    switch (active) {
      case 'home':
        return <Dashboard scores={scores} sectionResults={sectionResults} overallScore={totalScore} navigate={navigate} name={profile?.name} targetLevel={profile?.targetLevel} stats={stats} dailyQuests={todaysQuests} onClaimDailyReward={claimDailyWordReward} isPremium={isPremium} dark={dark} />
      case 'leagues':
        return <Leaderboard userId={cloudSession?.user?.id || profile?.userId} profile={profile} stats={stats} isPremium={isPremium} />
      case 'clans':
        return <Leaderboard userId={cloudSession?.user?.id || profile?.userId} profile={profile} stats={stats} initialTab="clans" />
      case 'analytics':
        return <Statistika profile={profile} stats={stats} progress={progress} isPremium={isPremium} dark={dark} navigate={navigate} />
      case 'plan':
        return <KunlikReja stats={stats} sectionResults={sectionResults} targetLevel={profile?.targetLevel} navigate={navigate} isPremium={isPremium} />
      case 'journey':
        return <JourneyMap stats={stats} progress={progress} navigate={navigate} />
      case 'shop':
        return <Shop stats={stats} profile={profile} />
      case 'okuma':
        return <ReadingLibrary key={profile?.userId || profile?.email || 'local'} addXp={addXp} completeLevel={(percent, xpAward) => completeLevel('okuma', percent, xpAward)} isPremium={isPremium} dark={dark} profile={profile} onReadingCompletionsChange={updateReadingCompletedCount} onSavedWordsChange={updateSavedWordsCount} onFlawlessQuiz={recordFlawlessQuiz} onPerfectReadingExam={recordPerfectReadingExam} onSpeedBonus={recordSpeedBonus} />
      case 'dinleme':
        return <Dinleme
          key={profile?.userId || profile?.email || 'local'}
          profile={profile}
          moduleScores={stats.moduleScores}
          isPremium={isPremium}
          dark={dark}
          onLessonComplete={({ testId, scorePct, xpAward, firstCompletion, completedCount }) => {
            const saved = saveScore('dinleme', { best: scorePct, attempts: 1 })
            const previousCloudRecord = stats.moduleScores?.[testId]
            const alreadySyncedCompletion = Boolean(previousCloudRecord?.completedAt || Number(previousCloudRecord?.xpAwarded) > 0)
            const shouldAwardProgress = firstCompletion && !alreadySyncedCompletion
            const completedAt = previousCloudRecord?.completedAt || new Date().toISOString()
            setStats((current) => {
              const moduleScores = current.moduleScores && typeof current.moduleScores === 'object' ? current.moduleScores : {}
              const previous = moduleScores[testId] || {}
              return {
                ...current,
                listeningLessonsCompleted: completedCount,
                moduleScores: {
                  ...moduleScores,
                  [testId]: {
                    ...previous,
                    best: Math.max(Number(previous.best) || 0, scorePct),
                    attempts: (Number(previous.attempts) || 0) + 1,
                    completedAt: previous.completedAt || completedAt,
                    xpAwarded: Math.max(0, Number(previous.xpAwarded) || 0) + (shouldAwardProgress ? xpAward : 0),
                    updatedAt: new Date().toISOString(),
                  },
                },
              }
            })
            if (!shouldAwardProgress) return
            completeLevel('dinleme', saved.best, xpAward, `listening:${testId}`)
            recordListeningQuest()
          }}
        />
      case 'writing-practice':
        return <Yozish onEarnXp={addXp} onReturnToDashboard={() => navigate('home')} isPremium={isPremium} dark={dark} />
      case 'yazma':
        return <YazmaModule key={profile?.userId || profile?.email || 'local'} profileId={profile?.userId || profile?.email || 'local'} completeLevel={(percent, award) => completeLevel('yazma', percent, award)} />
      case 'konusma':
        return <KonusmaModule key={profile?.userId || profile?.email || 'local'} profileId={profile?.userId || profile?.email || 'local'} onComplete={(xp = 40, taskType = 'speaking:exam') => completeLevel('konusma', undefined, xp, taskType)} />
      case 'lugat':
        return <Kelimeler
          key={profile?.userId || profile?.email || 'local'}
          onSavedWordsChange={updateSavedWordsCount}
          onBatchComplete={(xp, taskType) => addXp(xp, { taskType })}
          onToast={showToast}
          onNewQuestWord={recordNewQuestWord}
          isPremium={isPremium}
          dark={dark}
        />
      case 'exams':
        return <ImtihonlarHub onNavigate={navigate} onStartTask={(task) => { setMockLaunchTask(task); navigate('mock') }} />
      case 'mixed-practice':
        return <MockExamSimulator profile={profile} isPremium={isPremium} onToast={showToast} onExit={() => navigate('exams')} onComplete={() => setStats((current) => incrementWeeklyGoal(current, 'tests'))} />
      case 'full-mock':
        return <MockExamEngine onExit={() => navigate('exams')} onExamComplete={(result) => {
          setStats((current) => incrementWeeklyGoal({ ...current, completedMocks: (current.completedMocks || 0) + 1 }, 'tests'))
          if (result.earnedXp > 0) addXp(result.earnedXp, { taskType: 'exam:database-mock' })
        }} />
      case 'mock':
      case 'quick-assessment':
        return (
          <MockExam
            initialMode={active === 'quick-assessment' ? 'reading' : 'mixed'}
            initialSection={active === 'mock' ? mockLaunchTask?.section : null}
            onInitialSectionConsumed={() => setMockLaunchTask(null)}
            onExit={() => navigate('exams')}
            sectionResults={sectionResults}
            onSectionComplete={(result) => {
              setSectionResults((previous) => {
                const existing = previous[result.section]
                const history = [...(existing?.history || []), result].slice(-10)
                return { ...previous, [result.section]: { ...result, attempts: (existing?.attempts || 0) + 1, history } }
              })
              if (result.testType === 'reading-only') {
                setStats((current) => incrementWeeklyGoal({ ...current, completedMocks: (current.completedMocks || 0) + 1 }, 'tests'))
              }
              if (result.section === 'dinleme') recordListeningQuest()
              completeLevel(result.section, (result.scaledScore / 75) * 100, 0, `exam-section:${result.examId}:${result.section}`)
              if (result.testType === 'reading-only') {
                const qualifiedXp = Number(result.timeUsedSeconds) >= 60 ? 50 + 10 * Math.max(0, Number(result.rawScore) || 0) : 0
                if (qualifiedXp > 0) addXp(qualifiedXp, { taskType: 'exam:reading-only' })
              }
              showToast(`${result.section.toLocaleUpperCase('tr-TR')} bo‘limi yakunlandi · ${result.scaledScore}/75 · ${result.level}`, 'success')
            }}
            onExamComplete={(result) => {
              setMultilevelExamResult(result)
              setStats((current) => incrementWeeklyGoal({ ...current, examDone: true, completedMocks: (current.completedMocks || 0) + 1 }, 'tests'))
              if (result.earnedXp > 0) addXp(result.earnedXp, { taskType: result.examTaskType || 'exam:full-mock' })
            }}
          />
        )
      default:
        return <Dashboard scores={scores} sectionResults={sectionResults} overallScore={totalScore} navigate={navigate} name={profile?.name} targetLevel={profile?.targetLevel} stats={stats} dailyQuests={todaysQuests} onClaimDailyReward={claimDailyWordReward} isPremium={isPremium} dark={dark} />
    }
  }

  const profileModal = (
    <ProfileSetupModal
      open={!authLoading && (!routeAuthenticated || editingProfile)}
      mode={editingProfile ? 'edit' : profile ? 'auth' : 'signup'}
      profile={profile}
      hasProfile={!!profile}
      isPremium={isPremium}
      onClose={editingProfile ? () => setEditingProfile(false) : undefined}
      onSave={handleSaveProfile}
      onSaveAvatar={handleSaveAvatar}
      onLogin={handleLogin}
      cloudEnabled={isSupabaseConfigured}
      onCloudRegister={handleCloudRegister}
      onCloudLogin={handleCloudLogin}
      remindersEnabled={remindersEnabled}
      onToggleReminders={toggleDailyReminder}
    />
  )

  if (authLoading) {
    const loadingSurface = isPremium
      ? 'border-white/10 bg-black/30 text-white shadow-2xl shadow-black/30 backdrop-blur-xl'
      : dark
        ? 'border-slate-800 bg-slate-900 text-slate-100 shadow-2xl shadow-black/30'
        : 'border-white bg-white text-slate-900 shadow-2xl shadow-teal-950/10'
    const skeletonTone = isPremium ? 'bg-white/10' : dark ? 'bg-slate-700' : 'bg-slate-200'
    return (
      <main className={cn('grid min-h-screen place-items-center px-4 py-10', isPremium ? 'bg-[#061617]' : dark ? 'bg-slate-950' : 'bg-gradient-to-br from-teal-50 via-white to-cyan-50')}>
        <section role="status" aria-live="polite" aria-busy="true" className={cn('w-full max-w-md rounded-3xl border p-6 sm:p-8', loadingSurface)}>
          <span className={cn('mb-5 block h-1.5 w-16 animate-pulse rounded-full bg-gradient-to-r from-teal-400 to-cyan-400')} />
          <h1 className="text-xl font-black tracking-tight">{t('cloud.loading.title')}</h1>
          <p className={cn('mt-2 text-sm leading-relaxed', isPremium ? 'text-white/60' : dark ? 'text-slate-400' : 'text-slate-500')}>{t('cloud.loading.subtitle')}</p>
          <div className="mt-6 space-y-3" aria-hidden="true">
            <div className={cn('h-12 animate-pulse rounded-2xl', skeletonTone)} />
            <div className="grid grid-cols-2 gap-3"><div className={cn('h-20 animate-pulse rounded-2xl', skeletonTone)} /><div className={cn('h-20 animate-pulse rounded-2xl', skeletonTone)} /></div>
            <div className={cn('h-10 animate-pulse rounded-2xl', skeletonTone)} />
          </div>
          <p className={cn('mt-5 text-xs font-semibold', isPremium ? 'text-teal-200/75' : dark ? 'text-teal-300' : 'text-teal-800')}>{t('cloud.loading.status')}</p>
        </section>
      </main>
    )
  }

  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/')
  if (isAdminPath && routeAuthenticated) {
    return <Suspense fallback={pageFallback}><AdminRoute pathname={pathname} onNavigate={navigatePath} onHome={handleAdminHome} onUnauthorized={handleAdminDenied}/></Suspense>
  }

  if (pathname !== '/' && pathname !== '/login') {
    if (!routeAuthenticated) return <div role="status" aria-live="polite" className="grid min-h-[100dvh] place-items-center bg-slate-950 text-sm font-semibold text-slate-200"><span className="inline-flex items-center gap-2"><LoaderCircle className="size-5 animate-spin" aria-hidden="true" />{t('cloud.loading.status')}</span></div>
    return <NotFound onHome={() => { setActive('home'); navigatePath('/', false) }} />
  }

  if (!routeAuthenticated) {
    return (
      <main className="relative isolate grid min-h-[100dvh] place-items-center overflow-hidden bg-gradient-to-br from-slate-950 via-[#071b26] to-slate-950 px-4 py-10 text-white">
        <div className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-teal-500/10 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 size-80 rounded-full bg-cyan-500/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 flex flex-col items-center gap-2 text-center">
          <img src="/icons/turkish-education.svg" alt="" className="size-14 rounded-2xl shadow-lg shadow-black/25" />
          <h1 className="text-xl font-black tracking-tight">Turkuaz-edu</h1>
          <p className="text-xs font-semibold text-slate-400">Turk tili platformasi</p>
        </div>
        {profileModal}
      </main>
    )
  }

  if (routeAuthenticated && profile?.onboardingCompleted === false) {
    return (
      <Suspense fallback={pageFallback}>
        <OnboardingFlow isPremium={isPremium} dark={dark} profile={profile} onComplete={completeOnboarding} />
      </Suspense>
    )
  }

  return (
    <>
      <ProtectedRoute authenticated={routeAuthenticated}>
        <TurkchaDashboard
        active={['full-mock', 'mixed-practice', 'quick-assessment', 'mock'].includes(active) ? 'exams' : active === 'writing-practice' ? 'plan' : active}
        onNavigate={navigate}
        dark={dark}
        onToggleDark={() => setDark((value) => !value)}
        isPremium={isPremium}
        xp={stats.xp}
        rankUpEvent={rankUpEvent}
        onDismissRankUp={() => setRankUpEvent(null)}
        currentStreak={stats.streak}
        streakMilestones={stats.streakMilestones}
        winterStudy={stats.winterStudy}
        streakMilestoneEvent={streakMilestoneEvent}
        onDismissStreakMilestone={() => setStreakMilestoneEvent(null)}
        trophyMetrics={trophyMetrics}
        trophyUnlocks={stats.trophyUnlocks}
        trophyCelebrationEvent={trophyCelebrationEvent}
        onDismissTrophyCelebration={() => setTrophyCelebrationEvent(null)}
        targetPct={targetPct}
        profile={profile}
        onEditProfile={() => setEditingProfile(true)}
        onClearData={handleClearData}
        onLogout={handleLogout}
        onInstallApp={handleInstallApp}
      >
        {/* View transition — fade + slide on every sidebar tab switch */}
        <Suspense fallback={pageFallback}>
          <div key={`${active}-${resetVersion}`} className="animate-view">
            {renderView()}
          </div>
        </Suspense>
        </TurkchaDashboard>
      </ProtectedRoute>

      {/* Auth / profile modal — first-run sign up, or edit profile */}
      {profileModal}

      {/* Toasts — top-right corner */}
      <div className="pointer-events-none fixed right-4 top-20 z-50 flex flex-col items-end gap-3 sm:right-6">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </>
  )
}
