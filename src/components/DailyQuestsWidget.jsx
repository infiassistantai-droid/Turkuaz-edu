import { useMemo, useState } from 'react'
import { BookOpenText, CheckCircle2, Flame, Headphones, Sparkles, Trophy, Zap } from 'lucide-react'
import { CORE_TROPHIES, getTrophyProgress, TROPHY_REWARD_XP } from '../lib/trophies'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'
import PremiumButton from './PremiumButton'

const TABS = [
  { id: 'daily', key: 'tasks.tabs.daily' },
  { id: 'weekly', key: 'tasks.tabs.weekly' },
  { id: 'achievements', key: 'tasks.tabs.achievements' },
]

const DAILY_QUESTS = [
  { id: 'words', titleKey: 'quests.words', descriptionKey: 'tasks.daily.wordsDescription', target: 3, icon: BookOpenText, navigate: 'lugat', reward: 25 },
  { id: 'listening', titleKey: 'quests.listening', descriptionKey: 'tasks.daily.listeningDescription', target: 1, icon: Headphones, navigate: 'dinleme', reward: null },
  { id: 'xp', titleKey: 'quests.xp', descriptionKey: 'tasks.daily.xpDescription', target: 50, icon: Zap, navigate: 'exams', reward: null },
]

const WEEKLY_GOALS = [
  { id: 'tests', titleKey: 'tasks.weekly.tests', target: 3, icon: Trophy },
  { id: 'lessons', titleKey: 'tasks.weekly.lessons', target: 5, icon: BookOpenText },
  { id: 'words', titleKey: 'tasks.weekly.words', target: 50, icon: Sparkles },
]

function safeCount(value, target) {
  return Math.min(target, Math.max(0, Number(value) || 0))
}

function getTrophyPath(trophyId) {
  if (trophyId === 'reading') return 'okuma'
  if (trophyId === 'listening') return 'dinleme'
  if (trophyId.startsWith('words-')) return 'lugat'
  if (trophyId === 'tests-100') return 'exams'
  return 'home'
}

function getTrophyMetrics(stats = {}) {
  const listeningPercent = Object.values(stats.moduleScores || {}).reduce((best, record) => (
    Math.max(best, Number(record?.best ?? record?.bestScore) || 0)
  ), 0)
  return {
    xp: stats.xp,
    completedQuizzes: stats.completedQuizzes,
    currentStreak: stats.streak,
    streakMilestones: stats.streakMilestones,
    readingCompletedCount: stats.readingCompletedCount,
    readingPerfectExamAchieved: stats.readingPerfectExamAchieved,
    listeningPercent,
    savedWordsCount: stats.savedWordsCount,
    flawlessQuizAchieved: stats.flawlessQuizAchieved,
    speedBonusAchieved: stats.speedBonusAchieved,
  }
}

const PANEL = 'rounded-2xl border border-slate-800 bg-[#0f172a] text-slate-100 shadow-xl shadow-slate-950/20'
const MUTED = 'text-slate-400'
const TRACK = 'bg-slate-800'
const PROGRESS = 'bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400'

export default function DailyQuestsWidget({ progress = {}, stats = {}, onClaimReward, navigate, isPremium = false }) {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('daily')
  const safeProgress = progress && typeof progress === 'object' ? progress : {}
  const dailyValues = {
    words: Math.min(3, Math.max(0, Array.isArray(safeProgress.words) ? safeProgress.words.length : 0)),
    listening: Math.min(1, Math.max(0, Number(safeProgress.listening) || 0)),
    xp: Math.min(50, Math.max(0, Number(safeProgress.xp) || 0)),
  }
  const completedDaily = DAILY_QUESTS.filter((quest) => dailyValues[quest.id] >= quest.target).length
  const weeklyGoals = safeProgress.weeklyGoals && typeof safeProgress.weeklyGoals === 'object' ? safeProgress.weeklyGoals : {}
  const trophies = useMemo(() => {
    const metrics = getTrophyMetrics(stats)
    const unlockedIds = new Set((Array.isArray(stats.trophyUnlocks) ? stats.trophyUnlocks : []).map((item) => item?.id).filter(Boolean))
    return CORE_TROPHIES
      .map((trophy) => ({ trophy, progress: getTrophyProgress(trophy, metrics) }))
      .filter(({ trophy, progress: trophyProgress }) => !unlockedIds.has(trophy.id) && !trophyProgress.unlocked)
      .sort((left, right) => right.progress.percent - left.progress.percent)
      .slice(0, 3)
  }, [stats])

  const claimReward = () => {
    if (typeof onClaimReward === 'function') onClaimReward()
  }

  return (
    <section className={cn(PANEL, 'overflow-hidden p-4 sm:p-6', isPremium && 'border-amber-300/25 shadow-amber-950/20')} aria-labelledby="tasks-panel-heading">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-200">
          <Sparkles className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="tasks-panel-heading" className="text-lg font-extrabold tracking-tight">{t('tasks.title')}</h2>
          <p className={cn('mt-0.5 text-xs', MUTED)}>{t('tasks.subtitle')}</p>
        </div>
        {activeTab === 'daily' && <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold tabular-nums text-slate-300">{t('quests.completedCount', { count: completedDaily, total: DAILY_QUESTS.length })}</span>}
      </div>

      <div role="tablist" aria-label={t('tasks.tabs.label')} className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const active = activeTab === tab.id
          return (
            <PremiumButton
              key={tab.id}
              id={`tasks-tab-${tab.id}`}
              role="tab"
              aria-selected={active}
              aria-controls={`tasks-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn('min-h-11 shrink-0 px-4 py-2 text-xs', active && 'border-[#d4af37]/80 shadow-[0_0_16px_rgba(212,175,55,0.18)]')}
            >
              {t(tab.key)}
            </PremiumButton>
          )
        })}
      </div>

      {activeTab === 'daily' && (
        <div id="tasks-panel-daily" role="tabpanel" aria-labelledby="tasks-tab-daily" className="mt-4 space-y-3">
          {DAILY_QUESTS.map((quest) => {
            const Icon = quest.icon
            const current = dailyValues[quest.id]
            const done = current >= quest.target
            const percent = Math.min(100, Math.round((current / quest.target) * 100))
            const canClaim = quest.id === 'words' && done && !safeProgress.wordRewardClaimed
            const claimed = quest.id === 'words' && Boolean(safeProgress.wordRewardClaimed)
            return (
              <article key={quest.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition-colors hover:border-slate-700 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-violet-400/15 bg-violet-400/10 text-violet-200">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-extrabold leading-snug text-white">{t(quest.titleKey)}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{t(quest.descriptionKey)}</p>
                  </div>
                  <span className={cn(
                    'shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-extrabold',
                    quest.reward ? 'border-amber-300/25 bg-amber-300/10 text-amber-200' : 'border-slate-700 bg-slate-800 text-slate-300',
                  )}>
                    {quest.reward ? `+${quest.reward} XP` : t('tasks.goalBadge')}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div role="progressbar" aria-label={t(quest.titleKey)} aria-valuemin={0} aria-valuemax={quest.target} aria-valuenow={current} className={cn('h-2 min-w-0 flex-1 overflow-hidden rounded-full', TRACK)}>
                    <div className={cn('h-full rounded-full transition-[width] duration-500', PROGRESS)} style={{ width: `${percent}%` }} />
                  </div>
                  <span className="w-12 shrink-0 text-right text-xs font-bold tabular-nums text-slate-300">{current}/{quest.target}</span>
                </div>
                <div className="mt-3 flex justify-end">
                  {claimed ? (
                    <span className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 text-xs font-bold text-emerald-200"><CheckCircle2 className="size-4" aria-hidden="true" />{t('quests.claimed')}</span>
                  ) : canClaim ? (
                    <PremiumButton onClick={claimReward} icon={Icon} className="min-h-11 px-3 text-xs">
                      {t('quests.claim')}
                    </PremiumButton>
                  ) : done ? (
                    <span className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 text-xs font-bold text-emerald-200"><CheckCircle2 className="size-4" aria-hidden="true" />{t('quests.complete')}</span>
                  ) : (
                    <PremiumButton onClick={() => navigate?.(quest.navigate)} icon={Icon} className="min-h-11 px-3 text-xs">
                      {t('tasks.doTask')}
                    </PremiumButton>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {activeTab === 'weekly' && (
        <section id="tasks-panel-weekly" role="tabpanel" aria-labelledby="tasks-tab-weekly" className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-400/10 text-indigo-200"><Flame className="size-5" aria-hidden="true" /></span>
            <div><h3 className="text-sm font-extrabold text-white">{t('tasks.weekly.title')}</h3><p className="mt-1 text-xs text-slate-400">{t('tasks.weekly.subtitle')}</p></div>
          </div>
          <div className="mt-5 space-y-5">
            {WEEKLY_GOALS.map((goal) => {
              const Icon = goal.icon
              const current = safeCount(weeklyGoals[goal.id], goal.target)
              const percent = Math.min(100, Math.round((current / goal.target) * 100))
              return (
                <div key={goal.id}>
                  <div className="mb-2 flex items-center gap-2">
                    <Icon className="size-4 shrink-0 text-indigo-200" aria-hidden="true" />
                    <span className="min-w-0 flex-1 text-xs font-bold text-slate-200">{t(goal.titleKey)}</span>
                    <span className="text-xs font-extrabold tabular-nums text-slate-300">{current}/{goal.target}</span>
                  </div>
                  <div role="progressbar" aria-label={t(goal.titleKey)} aria-valuemin={0} aria-valuemax={goal.target} aria-valuenow={current} className={cn('h-2 overflow-hidden rounded-full', TRACK)}>
                    <div className={cn('h-full rounded-full transition-[width] duration-500', PROGRESS)} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {activeTab === 'achievements' && (
        <div id="tasks-panel-achievements" role="tabpanel" aria-labelledby="tasks-tab-achievements" className="mt-4 space-y-3">
          {trophies.length ? trophies.map(({ trophy, progress: trophyProgress }) => {
            const title = t(trophy.titleKey)
            return (
              <article key={trophy.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-amber-300/15 bg-amber-300/10 text-amber-200"><Trophy className="size-5" aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1"><h3 className="text-sm font-extrabold text-white">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-400">{t(trophy.descriptionKey)}</p></div>
                  <span className="shrink-0 rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 text-[10px] font-extrabold text-amber-200">+{TROPHY_REWARD_XP[trophy.id] || 0} XP</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={trophyProgress.target} aria-valuenow={trophyProgress.current} className={cn('h-2 min-w-0 flex-1 overflow-hidden rounded-full', TRACK)}><div className={cn('h-full rounded-full transition-[width] duration-500', PROGRESS)} style={{ width: `${trophyProgress.percent}%` }} /></div>
                  <span className="w-16 shrink-0 text-right text-xs font-bold tabular-nums text-slate-300">{t(trophy.progressKey, { count: trophyProgress.current, target: trophyProgress.target })}</span>
                </div>
                <div className="mt-3 flex justify-end"><PremiumButton icon={Trophy} onClick={() => navigate?.(getTrophyPath(trophy.id))} className="min-h-11 px-3 text-xs">{t('tasks.doTask')}</PremiumButton></div>
              </article>
            )
          }) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-6 text-center">
              <CheckCircle2 className="mx-auto size-8 text-emerald-300" aria-hidden="true" />
              <p className="mt-2 text-sm font-bold text-white">{t('tasks.achievements.completeAll')}</p>
            </div>
          )}
        </div>
      )}

    </section>
  )
}
