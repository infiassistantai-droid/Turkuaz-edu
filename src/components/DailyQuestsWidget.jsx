import { BookOpenText, CheckCircle, Headphones, Sparkles, Zap } from 'lucide-react'
import { cn } from '../lib/utils'
import { useI18n } from '../lib/i18n.jsx'
import { useMascot } from '../context/MascotContext'

const QUESTS = [
  { id: 'words', titleKey: 'quests.words', target: 3, icon: BookOpenText, tone: 'violet' },
  { id: 'listening', titleKey: 'quests.listening', target: 1, icon: Headphones, tone: 'emerald' },
  { id: 'xp', titleKey: 'quests.xp', target: 50, icon: Zap, tone: 'amber' },
]

const TONES = {
  violet: {
    icon: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
    bar: 'from-violet-600 to-fuchsia-400',
    track: 'bg-violet-100 dark:bg-violet-950/60',
    progress: 'text-violet-700 dark:text-violet-200',
  },
  emerald: {
    icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    bar: 'from-emerald-600 to-teal-400',
    track: 'bg-emerald-100 dark:bg-emerald-950/60',
    progress: 'text-emerald-700 dark:text-emerald-200',
  },
  amber: {
    icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
    bar: 'from-amber-500 to-orange-400',
    track: 'bg-amber-100 dark:bg-amber-950/60',
    progress: 'text-amber-700 dark:text-amber-200',
  },
}

export default function DailyQuestsWidget({ progress = {}, onClaimReward, isPremium = false, dark = false }) {
  const { t } = useI18n()
  const { showMascot } = useMascot()
  const premium = Boolean(isPremium)
  const darkMode = Boolean(dark && !premium)
  const safeProgress = progress && typeof progress === 'object' ? progress : {}

  const claimReward = () => {
    if (typeof onClaimReward !== 'function') return
    const claimed = onClaimReward()
    if (claimed) showMascot({ message: t('mascot.success'), emotion: 'cheer', duration: 4200 })
  }
  const values = {
    words: Math.min(3, Math.max(0, Array.isArray(safeProgress.words) ? safeProgress.words.length : 0)),
    listening: Math.min(1, Math.max(0, Number(safeProgress.listening) || 0)),
    xp: Math.min(50, Math.max(0, Number(safeProgress.xp) || 0)),
  }
  const claimed = Boolean(safeProgress.wordRewardClaimed)
  const completedCount = QUESTS.filter((quest) => values[quest.id] >= quest.target).length

  return <section className={cn('rounded-3xl border p-5 sm:p-6', premium ? 'border-white/10 bg-black/35 text-white shadow-2xl backdrop-blur-2xl' : darkMode ? 'border-slate-700 bg-slate-900 text-slate-100 shadow-2xl shadow-black/25' : 'border-slate-100 bg-white text-slate-900 shadow-sm')}>
    <div className="flex flex-wrap items-center gap-3">
      <span className={cn('grid size-11 place-items-center rounded-2xl', premium ? 'border border-yellow-300/20 bg-yellow-300/10 text-yellow-200' : darkMode ? 'border border-teal-300/15 bg-teal-300/10 text-teal-200' : 'bg-teal-50 text-teal-700')}><Sparkles className="size-5" aria-hidden="true"/></span>
      <div className="min-w-0 flex-1"><h2 className="text-lg font-extrabold tracking-tight">{t('quests.title')}</h2><p className={cn('mt-0.5 text-xs', premium ? 'text-white/55' : darkMode ? 'text-slate-400' : 'text-slate-500')}>{t('quests.subtitle')}</p></div>
      <span className={cn('rounded-full px-3 py-1.5 text-[10px] font-extrabold', premium ? 'bg-white/[.07] text-yellow-100' : darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-50 text-slate-600')}>{t('quests.completedCount', { count: completedCount, total: QUESTS.length })}</span>
    </div>

    <div className="mt-5 grid gap-3 lg:grid-cols-3">
      {QUESTS.map((quest) => {
        const Icon = quest.icon
        const tone = TONES[quest.tone]
        const current = values[quest.id]
        const done = current >= quest.target
        const percent = Math.min(100, Math.round((current / quest.target) * 100))
        return <article key={quest.id} className={cn('group rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg', premium ? 'border-white/10 bg-black/30 text-white backdrop-blur-xl hover:border-yellow-300/25 hover:shadow-yellow-900/10' : darkMode ? 'border-slate-700 bg-slate-800/80 text-slate-100 shadow-sm shadow-black/15 hover:border-teal-400/25 hover:bg-slate-800' : 'border-slate-100 bg-white text-slate-900 shadow-sm hover:border-slate-200 hover:shadow-slate-900/5')}>
          <div className="flex items-start gap-3">
            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone.icon}`}><Icon className="size-5" aria-hidden="true"/></span>
            <div className="min-w-0 flex-1"><h3 className="text-sm font-extrabold leading-snug">{t(quest.titleKey)}</h3><p className={`mt-1 text-xs font-bold tabular-nums ${tone.progress}`}>{current}/{quest.target} {t('quests.progressSuffix')}</p></div>
            {done && <CheckCircle className={`mt-0.5 size-4 shrink-0 ${premium || darkMode ? 'text-emerald-300' : 'text-emerald-600'}`} aria-label={t('quests.complete')}/>}
          </div>
          <div role="progressbar" aria-label={t(quest.titleKey)} aria-valuemin={0} aria-valuemax={quest.target} aria-valuenow={current} className={`mt-4 h-2 overflow-hidden rounded-full ${tone.track}`}>
            <div className={`h-full rounded-full bg-gradient-to-r ${tone.bar} transition-[width] duration-700 ease-out`} style={{ width: `${percent}%` }}/>
          </div>
          {quest.id === 'words' && <div className="mt-3 flex min-h-9 items-center">
            {claimed
              ? <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-300"><CheckCircle className="size-4"/>{t('quests.claimed')}</span>
              : done
                ? <button type="button" onClick={claimReward} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black transition-all duration-300 hover:-translate-y-0.5 ${premium ? 'bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 shadow-[0_0_22px_rgba(250,204,21,.38)] hover:shadow-[0_0_30px_rgba(250,204,21,.55)]' : 'bg-gradient-to-r from-teal-700 to-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,.26)] hover:shadow-[0_0_28px_rgba(16,185,129,.4)]'}`}><Sparkles className="size-3.5"/>{t('quests.claim')}<span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">+25 XP</span></button>
                : <span className={`text-[11px] font-semibold ${premium ? 'text-white/45' : 'text-slate-400'}`}>{t('quests.wordHint')}</span>}
          </div>}
          {quest.id !== 'words' && <p className={`mt-3 min-h-9 text-[11px] leading-relaxed ${done ? premium || darkMode ? 'text-emerald-200' : 'text-emerald-700' : premium ? 'text-white/45' : darkMode ? 'text-slate-400' : 'text-slate-400'}`}>{done ? t('quests.complete') : quest.id === 'listening' ? t('quests.listeningHint') : t('quests.xpHint', { count: Math.max(0, quest.target - current) })}</p>}
        </article>
      })}
    </div>
  </section>
}
