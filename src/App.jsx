import { useCallback, useEffect, useMemo, useState } from 'react'
import { Flame, CheckCircle2, Copy, Star, Trophy } from 'lucide-react'
import { cn } from './lib/utils'
import {
  STORAGE_KEY,
  loadJSON,
  saveJSON,
  loadProfile,
  saveProfile,
  clearProfile,
  clearAllStorage,
} from './lib/storage'
import TurkchaDashboard from './components/TurkchaDashboard'
import Dashboard from './components/Dashboard'
import KunlikReja from './components/KunlikReja'
import OkumaModule from './components/modules/OkumaModule'
import DinlemeModule from './components/modules/DinlemeModule'
import YazmaModule from './components/modules/YazmaModule'
import KonusmaModule from './components/modules/KonusmaModule'
import VocabularyFlashcards from './components/VocabularyFlashcards'
import MockExam from './components/MockExam'
import ProfileSetupModal from './components/ProfileSetupModal'

const DEFAULT_STATS = { xp: 12480, streak: 23, wordsLearned: 148, levelsCompleted: 9 }
const DEFAULT_PROGRESS = { okuma: 68, dinleme: 54, yazma: 47, konusma: 39 }

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
  // Lazy initial state — hydrated straight from localStorage (SSR-safe via try/catch).
  const [active, setActive] = useState('home')
  const [dark, setDark] = useState(() => !!loadJSON(STORAGE_KEY, {})?.dark)
  const [toasts, setToasts] = useState([])
  const [profile, setProfile] = useState(() => loadProfile())
  const [editingProfile, setEditingProfile] = useState(false)
  const [stats, setStats] = useState(() => loadJSON(STORAGE_KEY, {})?.stats || DEFAULT_STATS)
  const [progress, setProgress] = useState(() => loadJSON(STORAGE_KEY, {})?.progress || DEFAULT_PROGRESS)
  const [examResult, setExamResult] = useState(() => loadJSON(STORAGE_KEY, {})?.examResult || null)

  // Theme class + full state persistence (streak, XP, progress, exam results)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    saveJSON(STORAGE_KEY, { stats, progress, examResult, dark })
  }, [stats, progress, examResult, dark])

  // Profile persistence — stays logged in across refreshes
  useEffect(() => {
    if (profile) saveProfile(profile)
  }, [profile])

  const showToast = useCallback((message, type = 'default') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((list) => [...list, { id, message, type }])
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const addXp = useCallback(
    (amount) => {
      setStats((s) => ({ ...s, xp: s.xp + amount }))
      showToast(`+${amount} XP qoʻshildi! 🎉`, 'xp')
    },
    [showToast],
  )

  const completeLevel = useCallback(
    (skill) => {
      setProgress((p) => {
        const next = { ...p }
        if (skill && next[skill] !== undefined) {
          next[skill] = Math.min(100, next[skill] + 1)
        }
        return next
      })
      setStats((s) => ({ ...s, levelsCompleted: s.levelsCompleted + 1 }))
      addXp(50)
    },
    [addXp],
  )

  const navigate = useCallback((id) => {
    setActive(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Skill mastery scores (0-30 each) derived from real progress —
  // feeds the Dashboard readiness card + certificate calculator.
  const scores = useMemo(
    () => ({
      okuma: Math.round((progress.okuma / 100) * 30),
      dinleme: Math.round((progress.dinleme / 100) * 30),
      yazma: Math.round((progress.yazma / 100) * 30),
      konusma: Math.round((progress.konusma / 100) * 30),
    }),
    [progress],
  )
  const totalScore = scores.okuma + scores.dinleme + scores.yazma + scores.konusma
  const targetPct = Math.round((totalScore / 80) * 100) // progress toward C1

  // ------------------------------ auth flow ------------------------------

  const handleSaveProfile = (p) => {
    setProfile(p)
    setEditingProfile(false)
    showToast(editingProfile ? 'Profil yangilandi! ✅' : 'Roʻyxatdan oʻtdingiz! 🎉', 'success')
  }

  const handleClearData = () => {
    clearAllStorage()
    setProfile(null)
    setEditingProfile(false)
    setStats(DEFAULT_STATS)
    setProgress(DEFAULT_PROGRESS)
    setExamResult(null)
    setDark(false)
    showToast('Barcha maʼlumotlar tozalandi 🧹', 'save')
  }

  const handleLogout = () => {
    clearProfile()
    setProfile(null)
    showToast('Chiqib qoldingiz', 'default')
  }

  // ------------------------------ views --------------------------------

  const renderView = () => {
    switch (active) {
      case 'home':
        return <Dashboard scores={scores} navigate={navigate} name={profile?.name} />
      case 'plan':
        return <KunlikReja stats={stats} progress={progress} navigate={navigate} />
      case 'okuma':
        return <OkumaModule completeLevel={() => completeLevel('okuma')} />
      case 'dinleme':
        return <DinlemeModule completeLevel={() => completeLevel('dinleme')} />
      case 'yazma':
        return <YazmaModule addXp={addXp} />
      case 'konusma':
        return <KonusmaModule />
      case 'lugat':
        return <VocabularyFlashcards onToast={showToast} />
      case 'mock':
        return (
          <MockExam
            result={examResult}
            onResult={(r) => {
              setExamResult(r)
              showToast(`Imtihoni yakunlandi — ${r.score} ball, ${r.level} darajasi! 🎓`, 'success')
              if (r.score >= 60) {
                setStats((s) => ({ ...s, streak: s.streak + 1 }))
              }
            }}
            onRestart={() => setExamResult(null)}
            onFinish={() => navigate('home')}
          />
        )
      default:
        return <Dashboard scores={scores} navigate={navigate} name={profile?.name} />
    }
  }

  return (
    <>
      <TurkchaDashboard
        active={active}
        onNavigate={navigate}
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
        streak={stats.streak}
        xp={stats.xp}
        targetPct={targetPct}
        profile={profile}
        onEditProfile={() => setEditingProfile(true)}
        onClearData={handleClearData}
        onLogout={handleLogout}
      >
        {/* View transition — fade + slide on every sidebar tab switch */}
        <div key={active} className="animate-view">
          {renderView()}
        </div>
      </TurkchaDashboard>

      {/* Auth / profile modal — first-run sign up, or edit profile */}
      <ProfileSetupModal
        open={!profile || editingProfile}
        mode={editingProfile ? 'edit' : 'signup'}
        profile={profile}
        hasProfile={!!profile}
        onClose={() => setEditingProfile(false)}
        onSave={handleSaveProfile}
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
