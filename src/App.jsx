import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Flame, CheckCircle2, Copy, Star, Trophy } from 'lucide-react'
import { cn } from './lib/utils'
import {
  STORAGE_KEY,
  loadJSON,
  saveJSON,
  loadProfile,
  saveProfile,
  AUTH_KEY,
  clearAllStorage,
} from './lib/storage'
import TurkchaDashboard from './components/TurkchaDashboard'
import Dashboard from './components/Dashboard'
import ComingSoon from './components/ComingSoon'
import KunlikReja from './components/KunlikReja'
import OkumaModule from './components/modules/OkumaModule'
import DinlemeModule from './components/modules/DinlemeModule'
import YazmaModule from './components/modules/YazmaModule'
import WritingPractice from './components/modules/WritingPractice'
import KonusmaModule from './components/modules/KonusmaModule'
import VocabularyFlashcards from './components/VocabularyFlashcards'
import MockExam from './components/MockExam'
import MockExamSimulator from './components/MockExamSimulator'
import ProfileSetupModal from './components/ProfileSetupModal'
import Leaderboard from './components/Leaderboard'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import { fetchLearnerProgress, isSupabaseConfigured, supabase, syncLearnerProgress } from './lib/supabaseClient'
import { disableDailyReminder, enableDailyReminder, getReminderPreference, showDailyReminderIfDue } from './lib/dailyReminders'
import { calculateCertificate } from './lib/multilevelScoring'
import { useI18n } from './lib/i18n.jsx'
import { DEFAULT_EQUIPPED_MEDAL, DEFAULT_UNLOCKED_MEDALS } from './lib/medals'

// Learner stats and skill results start empty and are persisted after real activity.
const DEFAULT_STATS = { xp: 0, streak: 0, weeklyXp: 0, weekStart: null, dailyXp: {}, analyticsTrackingSince: null, dailyQuests: null, questWordsCredited: [], wordsLearned: 0, levelsCompleted: 0, skillsCompleted: [], completedLessons: [], completedMocks: 0, examDone: false, lastActivityDate: null }
const DEFAULT_PROGRESS = { okuma: 0, dinleme: 0, yazma: 0, konusma: 0 }

function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function previousDateKey(key) {
  const date = new Date(`${key}T12:00:00`)
  date.setDate(date.getDate() - 1)
  return localDateKey(date)
}

function getDailyQuestProgress(stats, dateKey = localDateKey()) {
  const saved = stats?.dailyQuests
  if (saved?.date === dateKey) {
    return {
      date: dateKey,
      words: Array.isArray(saved.words) ? saved.words : [],
      listening: Math.max(0, Number(saved.listening) || 0),
      xp: Math.max(0, Number(saved.xp) || 0),
      wordRewardClaimed: Boolean(saved.wordRewardClaimed),
    }
  }
  const recordedXp = Number(stats?.dailyXp?.[dateKey] ?? stats?.daily_xp?.[dateKey])
  return { date: dateKey, words: [], listening: 0, xp: Number.isFinite(recordedXp) ? Math.max(0, recordedXp) : 0, wordRewardClaimed: false }
}

function loadLearnerStats() {
  const stored = loadJSON(STORAGE_KEY, {})?.stats
  if (!stored) return DEFAULT_STATS

  // Earlier builds shipped with invented starter totals. Remove that known
  // demo baseline while preserving earned progress above it.
  const hasOldDemoBaseline = stored.xp >= 12480 && stored.streak >= 23 &&
    stored.wordsLearned >= 148 && stored.levelsCompleted >= 9
  if (!hasOldDemoBaseline) return { ...DEFAULT_STATS, ...stored }

  // Retain activity earned on top of the old sample baseline, not its invented totals.
  return {
    ...DEFAULT_STATS,
    ...stored,
    xp: Math.max(0, stored.xp - 12480),
    streak: Math.max(0, stored.streak - 23),
    wordsLearned: Math.max(0, stored.wordsLearned - 148),
    levelsCompleted: Math.max(0, stored.levelsCompleted - 9),
  }
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

export default function App() {
  const { t } = useI18n()
  // Lazy initial state — hydrated straight from localStorage (SSR-safe via try/catch).
  const [active, setActive] = useState('home')
  const [resetVersion, setResetVersion] = useState(0)
  const [dark, setDark] = useState(() => !!loadJSON(STORAGE_KEY, {})?.dark)
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
  const [editingProfile, setEditingProfile] = useState(false)
  const [stats, setStats] = useState(() => isSupabaseConfigured ? DEFAULT_STATS : loadLearnerStats())
  const claimedQuestRewards = useRef(new Set())
  const [progress, setProgress] = useState(() => isSupabaseConfigured ? DEFAULT_PROGRESS : loadLearnerProgress())
  const [sectionResults, setSectionResults] = useState(() => loadJSON(STORAGE_KEY, {})?.multilevelSectionResults || {})
  const [multilevelExamResult, setMultilevelExamResult] = useState(() => loadJSON(STORAGE_KEY, {})?.multilevelExamResult || null)
  const [unlockedMedals, setUnlockedMedals] = useState(() => {
    const saved = loadJSON(STORAGE_KEY, {})?.unlockedMedals
    return Array.isArray(saved) ? saved : DEFAULT_UNLOCKED_MEDALS
  })
  const [equippedMedal, setEquippedMedal] = useState(() => {
    const saved = loadJSON(STORAGE_KEY, {})?.equippedMedal
    return saved === undefined ? DEFAULT_EQUIPPED_MEDAL : saved
  })

  // Theme classes and full local persistence for learner progress/settings.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.classList.toggle('premium-theme', isPremium)
    document.documentElement.classList.toggle('theme-premium', isPremium)
    document.documentElement.classList.toggle('theme-default', !isPremium)
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
    if (!isSupabaseConfigured) Object.assign(localState, { stats, progress })
    saveJSON(STORAGE_KEY, localState)
  }, [stats, progress, sectionResults, multilevelExamResult, dark, isPremium, unlockedMedals, equippedMedal])

  // Profile persistence — stays logged in across refreshes
  useEffect(() => {
    if (profile && !isSupabaseConfigured) saveProfile(profile)
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
    let alive = true
    const hydrateSession = async (session) => {
      if (!alive) return
      setCloudSession(session || null)
      setCloudReady(false)
      if (!session?.user) {
        setCloudReady(false)
        setAuthenticated(false); setProfile(null); setStats(DEFAULT_STATS); setProgress(DEFAULT_PROGRESS); setAuthLoading(false)
        return
      }
      setAuthenticated(true)
      const metadata = session.user.user_metadata || {}
      setProfile({ name: metadata.name || session.user.email?.split('@')[0] || 'Learner', surname: metadata.surname || '', email: session.user.email || '', targetLevel: metadata.target_level || 'B1', userId: session.user.id })
      try {
        const row = await fetchLearnerProgress(session.user.id)
        if (!alive) return
        if (row) {
          setProfile((current) => ({ ...current, targetLevel: row.target_level || current.targetLevel }))
          setStats((current) => ({ ...current, xp: row.xp || 0, streak: row.streak || 0, completedLessons: row.completed_lessons || [], weeklyXp: row.weekly_xp || 0, weekStart: row.week_start || null, lastActivityDate: row.last_activity_date || null, dailyXp: row.daily_xp || current.dailyXp || {}, analyticsTrackingSince: row.analytics_tracking_since || current.analyticsTrackingSince || null, dailyQuests: row.daily_quests || current.dailyQuests || null, questWordsCredited: row.quest_words_credited || current.questWordsCredited || [], skillsCompleted: row.completed_lessons || [] }))
        }
      } catch (error) { console.error('Could not load cloud progress:', error) }
      finally { if (alive) { setCloudReady(true); setAuthLoading(false) } }
    }
    supabase.auth.getSession().then(({ data }) => hydrateSession(data.session)).catch(() => setAuthLoading(false))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { void hydrateSession(session) })
    return () => { alive = false; subscription.unsubscribe() }
  }, [])

  const showToast = useCallback((message, type = 'default') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((list) => [...list, { id, message, type }])
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !cloudReady || !cloudSession?.user || !profile) return undefined
    const timeout = window.setTimeout(() => {
      syncLearnerProgress(cloudSession.user.id, profile, stats).catch((error) => console.error('Cloud progress sync failed:', error))
    }, 600)
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
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name: newProfile.name, surname: newProfile.surname, target_level: newProfile.targetLevel } } })
    if (error) throw error
    if (!data.session) throw new Error('Account created. Confirm your email, then sign in to continue.')
    const learner = { ...newProfile, userId: data.user.id }
    setCloudSession(data.session); setProfile(learner); setAuthenticated(true); setCloudReady(true); setAuthLoading(false)
    try { await syncLearnerProgress(data.user.id, learner, DEFAULT_STATS) } catch (error) { console.error('Initial cloud progress write failed:', error) }
    showToast('Hisob Supabase’da yaratildi va bulut bilan ulandi.', 'success')
  }, [showToast])

  const handleCloudLogin = useCallback(async ({ email, password }) => {
    if (!supabase) throw new Error('Supabase is not configured.')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    let row = null
    try { row = await fetchLearnerProgress(data.user.id) } catch (error) { console.error('Could not load cloud progress:', error) }
    const metadata = data.user.user_metadata || {}
    const learner = { name: metadata.name || data.user.email?.split('@')[0] || 'Learner', surname: metadata.surname || '', email: data.user.email || email, targetLevel: row?.target_level || metadata.target_level || 'B1', userId: data.user.id }
    setCloudSession(data.session); setProfile(learner); setAuthenticated(true); setCloudReady(true); setAuthLoading(false)
    if (row) setStats((current) => ({ ...current, xp: row.xp || 0, streak: row.streak || 0, completedLessons: row.completed_lessons || [], skillsCompleted: row.completed_lessons || [], weeklyXp: row.weekly_xp || 0, weekStart: row.week_start || null, lastActivityDate: row.last_activity_date || null, dailyXp: row.daily_xp || current.dailyXp || {}, analyticsTrackingSince: row.analytics_tracking_since || current.analyticsTrackingSince || null, dailyQuests: row.daily_quests || current.dailyQuests || null, questWordsCredited: row.quest_words_credited || current.questWordsCredited || [] }))
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

  const updateWordsLearned = useCallback((count) => {
    setStats((s) => s.wordsLearned === count ? s : { ...s, wordsLearned: count })
  }, [])

  const recordNewQuestWord = useCallback((word) => {
    const wordId = String(word || '').trim()
    if (!wordId) return
    const today = localDateKey()
    setStats((current) => {
      const credited = Array.isArray(current.questWordsCredited) ? current.questWordsCredited : []
      if (credited.includes(wordId)) return current
      const quests = getDailyQuestProgress(current, today)
      if (quests.words.includes(wordId)) return { ...current, questWordsCredited: [...credited, wordId] }
      return {
        ...current,
        questWordsCredited: [...credited, wordId],
        dailyQuests: { ...quests, words: [...quests.words, wordId] },
      }
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
    (amount, { countTowardDailyXpQuest = true, markLessonActivity = true } = {}) => {
      const today = localDateKey()
      const award = Math.max(0, Number(amount) || 0)
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
          lastActivityDate: markLessonActivity ? today : s.lastActivityDate,
        }
      })
      if (award > 0) showToast(`+${award} XP qoʻshildi! 🎉`, 'xp')
    },
    [showToast],
  )

  const claimDailyWordReward = useCallback(() => {
    const today = localDateKey()
    const currentQuests = getDailyQuestProgress(stats, today)
    if (currentQuests.words.length < 3 || currentQuests.wordRewardClaimed || claimedQuestRewards.current.has(today)) return
    claimedQuestRewards.current.add(today)
    setStats((current) => {
      const quests = getDailyQuestProgress(current, today)
      if (quests.words.length < 3 || quests.wordRewardClaimed) return current
      return { ...current, dailyQuests: { ...quests, wordRewardClaimed: true } }
    })
    addXp(25, { countTowardDailyXpQuest: false, markLessonActivity: false })
  }, [addXp, stats])

  const completeLevel = useCallback(
    (skill, resultPercent, xpAward = 50) => {
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
        if (!skill || (s.skillsCompleted || []).includes(skill)) return s
        return { ...s, skillsCompleted: [...(s.skillsCompleted || []), skill], completedLessons: [...new Set([...(s.completedLessons || []), skill])] }
      })
      addXp(xpAward)
    },
    [addXp],
  )

  const navigate = useCallback((id) => {
    setActive(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

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

  // ------------------------------ auth flow ------------------------------

  const handleSaveProfile = (p) => {
    if (isSupabaseConfigured && supabase && cloudSession?.user) supabase.auth.updateUser({ data: { name: p.name, surname: p.surname, target_level: p.targetLevel } }).catch((error) => console.error('Profile sync failed:', error))
    setProfile(p)
    setAuthenticated(true)
    setEditingProfile(false)
    showToast(editingProfile ? 'Profil yangilandi! ✅' : 'Roʻyxatdan oʻtdingiz! 🎉', 'success')
  }

  const handleLogin = () => {
    setAuthenticated(true)
    showToast('Tekrar hoş geldiniz! ✅', 'success')
  }

  const handleClearData = () => {
    claimedQuestRewards.current.clear()
    clearAllStorage()
    if (isSupabaseConfigured && cloudSession?.user) void supabase.from('user_progress').delete().eq('user_id', cloudSession.user.id).catch((error) => console.error('Cloud progress deletion failed:', error))
    if (isSupabaseConfigured) void supabase?.auth.signOut()
    setCloudSession(null)
    setCloudReady(false)
    setProfile(null)
    setAuthenticated(false)
    setEditingProfile(false)
    setStats(DEFAULT_STATS)
    setProgress(DEFAULT_PROGRESS)
    setSectionResults({})
    setMultilevelExamResult(null)
    setUnlockedMedals(DEFAULT_UNLOCKED_MEDALS)
    setEquippedMedal(DEFAULT_EQUIPPED_MEDAL)
    setDark(false)
    setIsPremium(false)
    setActive('home')
    setResetVersion((version) => version + 1)
    showToast('Barcha maʼlumotlar tozalandi 🧹', 'save')
  }

  const handleLogout = () => {
    claimedQuestRewards.current.clear()
    if (isSupabaseConfigured) void supabase?.auth.signOut()
    setCloudSession(null)
    setCloudReady(false)
    setAuthenticated(false)
    showToast('Chiqib qoldingiz', 'default')
  }

  // ------------------------------ views --------------------------------

  const renderView = () => {
    // Keep the dashboard and daily plan open; all other sections remain in phased release.
    if (active !== 'home' && active !== 'plan') return <ComingSoon isPremium={isPremium} onBack={() => navigate('home')} />

    switch (active) {
      case 'home':
        return <Dashboard scores={scores} sectionResults={sectionResults} overallScore={totalScore} navigate={navigate} name={profile?.name} targetLevel={profile?.targetLevel} stats={stats} addXp={addXp} dailyQuests={todaysQuests} onClaimDailyReward={claimDailyWordReward} isPremium={isPremium} />
      case 'leagues':
        return <Leaderboard userId={cloudSession?.user?.id || profile?.userId} profile={profile} stats={stats} isPremium={isPremium} equippedMedal={equippedMedal} />
      case 'analytics':
        return <AnalyticsDashboard sectionResults={sectionResults} progress={progress} stats={stats} isPremium={isPremium} />
      case 'plan':
        return <KunlikReja stats={stats} progress={progress} navigate={navigate} addXp={addXp} isPremium={isPremium} />
      case 'okuma':
        return <OkumaModule completeLevel={(percent) => completeLevel('okuma', percent)} />
      case 'dinleme':
        return <DinlemeModule completeLevel={(percent) => { completeLevel('dinleme', percent); recordListeningQuest() }} />
      case 'writing-practice':
        return <WritingPractice isPremium={isPremium} onBack={() => navigate('plan')} />
      case 'yazma':
        return <YazmaModule completeLevel={(percent, award) => completeLevel('yazma', percent, award)} />
      case 'konusma':
        return <KonusmaModule onComplete={(xp = 35) => completeLevel('konusma', undefined, xp)} />
      case 'lugat':
        return <VocabularyFlashcards onToast={showToast} onMasteryCountChange={updateWordsLearned} onNewWordLearned={recordNewQuestWord} isPremium={isPremium} onStudyComplete={addXp} onReturnToDashboard={() => navigate('home')} />
      case 'exams':
        return <MockExamSimulator profile={profile} isPremium={isPremium} onToast={showToast} />
      case 'mock':
        return (
          <MockExam
            sectionResults={sectionResults}
            onSectionComplete={(result) => {
              setSectionResults((previous) => {
                const existing = previous[result.section]
                const history = [...(existing?.history || []), result].slice(-10)
                return { ...previous, [result.section]: { ...result, attempts: (existing?.attempts || 0) + 1, history } }
              })
              if (result.testType === 'reading-only') {
                setStats((current) => ({ ...current, completedMocks: (current.completedMocks || 0) + 1 }))
              }
              if (result.section === 'dinleme') recordListeningQuest()
              completeLevel(result.section, (result.scaledScore / 75) * 100, result.earnedXp)
              showToast(`${result.section.toLocaleUpperCase('tr-TR')} bo‘limi yakunlandi · ${result.scaledScore}/75 · ${result.level}`, 'success')
            }}
            onExamComplete={(result) => {
              setMultilevelExamResult(result)
              setStats((current) => ({ ...current, examDone: true, completedMocks: (current.completedMocks || 0) + 1 }))
            }}
          />
        )
      default:
        return <Dashboard scores={scores} sectionResults={sectionResults} overallScore={totalScore} navigate={navigate} name={profile?.name} targetLevel={profile?.targetLevel} stats={stats} addXp={addXp} dailyQuests={todaysQuests} onClaimDailyReward={claimDailyWordReward} isPremium={isPremium} />
    }
  }

  return (
    <>
      <TurkchaDashboard
        active={active === 'writing-practice' ? 'plan' : active}
        onNavigate={navigate}
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
        isPremium={isPremium}
        onTogglePremium={() => setIsPremium((value) => !value)}
        xp={stats.xp}
        unlockedMedals={unlockedMedals}
        equippedMedal={equippedMedal}
        onEquipMedal={setEquippedMedal}
        targetPct={targetPct}
        profile={profile}
        onEditProfile={() => setEditingProfile(true)}
        onClearData={handleClearData}
        onLogout={handleLogout}
        onInstallApp={handleInstallApp}
      >
        {/* View transition — fade + slide on every sidebar tab switch */}
        <div key={`${active}-${resetVersion}`} className="animate-view">
          {renderView()}
        </div>
      </TurkchaDashboard>

      {/* Auth / profile modal — first-run sign up, or edit profile */}
      <ProfileSetupModal
        open={!authLoading && (!authenticated || editingProfile)}
        mode={editingProfile ? 'edit' : profile ? 'auth' : 'signup'}
        profile={profile}
        hasProfile={!!profile}
        isPremium={isPremium}
        onTogglePremium={() => setIsPremium((value) => !value)}
        onClose={editingProfile ? () => setEditingProfile(false) : undefined}
        onSave={handleSaveProfile}
        onLogin={handleLogin}
        cloudEnabled={isSupabaseConfigured}
        onCloudRegister={handleCloudRegister}
        onCloudLogin={handleCloudLogin}
        remindersEnabled={remindersEnabled}
        onToggleReminders={toggleDailyReminder}
      />

      {/* Toasts — top-right corner */}
      <div className="pointer-events-none fixed right-4 top-20 z-50 flex flex-col items-end gap-3 sm:right-6">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </>
  )
}
