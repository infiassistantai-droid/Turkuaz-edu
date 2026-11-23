import { ModelAsset, PanelHeading } from './BosforArtwork'
import { useMemo, useState } from 'react'
import { ArrowRight, BookOpenText, CheckCircle2, Headphones, Sparkles, Trophy, Zap } from 'lucide-react'
import { CORE_TROPHIES, getTrophyProgress, TROPHY_REWARD_XP } from '../lib/trophies'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'

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

export function getDailyQuestRows(progress) {
  const values = {
    words: Array.isArray(progress?.words) ? progress.words.length : 0,
    listening: progress?.listening,
    xp: progress?.xp,
  }

  return DAILY_QUESTS.map((quest) => {
    const current = safeCount(values[quest.id], quest.target)
    return { ...quest, current, complete: current >= quest.target }
  })
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

const PANEL = 'bosfor-panel rounded-2xl border'
const MUTED = 'text-[var(--studio-muted)]'
const TRACK = 'bosfor-track'
const PROGRESS = 'bosfor-progress-fill'

export default function DailyQuestsWidget({ progress = {}, stats = {}, onClaimReward, navigate, isPremium = false }) {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('daily')
  const safeProgress = progress && typeof progress === 'object' ? progress : {}
  const dailyRows = getDailyQuestRows(safeProgress)
  const completedDaily = dailyRows.filter((quest) => quest.complete).length
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
      <PanelHeading name="quests" titleId="tasks-panel-heading" title={t('tasks.title')} description={t('tasks.subtitle')}>
        {activeTab === 'daily' && <span className="bosfor-badge px-3 py-1.5 text-xs font-bold tabular-nums">{t('quests.completedCount', { count: completedDaily, total: DAILY_QUESTS.length })}</span>}
      </PanelHeading>

      <div role="tablist" aria-label={t('tasks.tabs.label')} className="bosfor-tabs mt-5">
        {TABS.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              id={`tasks-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`tasks-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="bosfor-tab"
            >
              {t(tab.key)}
            </button>
          )
        })}
      </div>

      {activeTab === 'daily' && (
        <div id="tasks-panel-daily" role="tabpanel" aria-labelledby="tasks-tab-daily" className="mt-4 space-y-3">
          {dailyRows.map((quest) => {
            const Icon = quest.icon
            const current = quest.current
            const done = quest.complete
            const percent = Math.min(100, Math.round((current / quest.target) * 100))
            const canClaim = quest.id === 'words' && done && !safeProgress.wordRewardClaimed
            const claimed = quest.id === 'words' && Boolean(safeProgress.wordRewardClaimed)
            return (
              <article key={quest.id} className="bosfor-inset rounded-xl border p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="bosfor-badge grid size-10 shrink-0 place-items-center">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-extrabold leading-snug">{t(quest.titleKey)}</h3>
                    <p className="mt-1 text-xs leading-5 text-[var(--studio-muted)]">{t(quest.descriptionKey)}</p>
                  </div>
                  <span className={cn(
                    'shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-extrabold',
                    quest.reward ? 'bosfor-reward-badge' : 'bosfor-badge text-[var(--studio-muted)]',
                  )}>
                    {quest.reward ? <span className="inline-flex items-center gap-1"><ModelAsset name="xp" className="size-6" />+{quest.reward} XP</span> : t('tasks.goalBadge')}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div role="progressbar" aria-label={t(quest.titleKey)} aria-valuemin={0} aria-valuemax={quest.target} aria-valuenow={current} className={cn('h-2 min-w-0 flex-1 overflow-hidden rounded-full', TRACK)}>
                    <div className={cn('h-full rounded-full transition-[width] duration-500', PROGRESS)} style={{ width: `${percent}%` }} />
                  </div>
                  <span className="w-12 shrink-0 text-right text-xs font-bold tabular-nums text-[var(--studio-muted)]">{current}/{quest.target}</span>
                </div>
                <div className="mt-3 flex justify-end">
                  {claimed ? (
                    <span className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 text-xs font-bold text-emerald-800 dark:text-emerald-200"><CheckCircle2 className="size-4" aria-hidden="true" />{t('quests.claimed')}</span>
                  ) : canClaim ? (
                    <button
                      type="button"
                      onClick={claimReward}
                      className="bosfor-action inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-xs"
                    >
                      {t('quests.claim')}<ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  ) : done ? (
                    <span className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 text-xs font-bold text-emerald-800 dark:text-emerald-200"><CheckCircle2 className="size-4" aria-hidden="true" />{t('quests.complete')}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate?.(quest.navigate)}
                      className="bosfor-control inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold"
                    >
                      {t('tasks.doTask')}<ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {activeTab === 'weekly' && (
        <section id="tasks-panel-weekly" role="tabpanel" aria-labelledby="tasks-tab-weekly" className="mt-4 bosfor-inset rounded-xl border p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="size-10 shrink-0"><ModelAsset name="plan" className="size-10" /></span>
            <div><h3 className="text-sm font-extrabold">{t('tasks.weekly.title')}</h3><p className="mt-1 text-xs text-[var(--studio-muted)]">{t('tasks.weekly.subtitle')}</p></div>
          </div>
          <div className="mt-5 space-y-5">
            {WEEKLY_GOALS.map((goal) => {
              const Icon = goal.icon
              const current = safeCount(weeklyGoals[goal.id], goal.target)
              const percent = Math.min(100, Math.round((current / goal.target) * 100))
              return (
                <div key={goal.id}>
                  <div className="mb-2 flex items-center gap-2">
                    <Icon className="size-4 shrink-0 text-[var(--studio-accent)]" aria-hidden="true" />
                    <span className="min-w-0 flex-1 text-xs font-bold text-[var(--studio-ink)]">{t(goal.titleKey)}</span>
                    <span className="text-xs font-extrabold tabular-nums text-[var(--studio-muted)]">{current}/{goal.target}</span>
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
              <article key={trophy.id} className="bosfor-inset rounded-xl border p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <ModelAsset name="medal" className="size-11" />
                  <div className="min-w-0 flex-1"><h3 className="text-sm font-extrabold">{title}</h3><p className="mt-1 text-xs leading-5 text-[var(--studio-muted)]">{t(trophy.descriptionKey)}</p></div>
                  <span className="bosfor-reward-badge shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-extrabold">+{TROPHY_REWARD_XP[trophy.id] || 0} XP</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={trophyProgress.target} aria-valuenow={trophyProgress.current} className={cn('h-2 min-w-0 flex-1 overflow-hidden rounded-full', TRACK)}><div className={cn('h-full rounded-full transition-[width] duration-500', PROGRESS)} style={{ width: `${trophyProgress.percent}%` }} /></div>
                  <span className="w-16 shrink-0 text-right text-xs font-bold tabular-nums text-[var(--studio-muted)]">{t(trophy.progressKey, { count: trophyProgress.current, target: trophyProgress.target })}</span>
                </div>
                <div className="mt-3 flex justify-end"><button type="button" onClick={() => navigate?.(getTrophyPath(trophy.id))} className="bosfor-control inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold">{t('tasks.doTask')}<ArrowRight className="size-4" aria-hidden="true" /></button></div>
              </article>
            )
          }) : (
            <div className="bosfor-inset rounded-2xl border border-dashed p-6 text-center">
              <CheckCircle2 className="mx-auto size-8 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
              <p className="mt-2 text-sm font-bold">{t('tasks.achievements.completeAll')}</p>
            </div>
          )}
        </div>
      )}

    </section>
  )
}
