import { useMemo } from 'react'
import { CheckCircle2, Crown, Flag, Map as MapIcon, Star } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'

function isSkillComplete(stats, skill) {
  const completed = Array.isArray(stats?.completedLessons) ? stats.completedLessons : []
  const skills = Array.isArray(stats?.skillsCompleted) ? stats.skillsCompleted : []
  return completed.includes(skill) || skills.includes(skill)
}

function makeJourneyNodes(stats = {}, progress = {}) {
  const savedWords = Math.max(0, Number(stats.savedWordsCount) || 0)
  const completedMocks = Math.max(0, Number(stats.completedMocks) || 0)
  return [
    { id: 'vocabulary', titleKey: 'journey.node.vocabulary', detailKey: 'journey.node.vocabulary.detail', route: 'lugat', complete: savedWords > 0, detail: savedWords > 0 ? { key: 'journey.words', count: savedWords } : null, position: 'left' },
    { id: 'reading', titleKey: 'journey.node.reading', detailKey: 'journey.node.reading.detail', route: 'okuma', complete: isSkillComplete(stats, 'okuma'), score: Number(progress.okuma) > 0 ? Math.round(Number(progress.okuma)) : null, position: 'center' },
    { id: 'listening', titleKey: 'journey.node.listening', detailKey: 'journey.node.listening.detail', route: 'dinleme', complete: isSkillComplete(stats, 'dinleme'), score: Number(progress.dinleme) > 0 ? Math.round(Number(progress.dinleme)) : null, position: 'right' },
    { id: 'writing', titleKey: 'journey.node.writing', detailKey: 'journey.node.writing.detail', route: 'yazma', complete: isSkillComplete(stats, 'yazma'), score: Number(progress.yazma) > 0 ? Math.round(Number(progress.yazma)) : null, position: 'center' },
    { id: 'speaking', titleKey: 'journey.node.speaking', detailKey: 'journey.node.speaking.detail', route: 'konusma', complete: isSkillComplete(stats, 'konusma'), position: 'left' },
    { id: 'mock', titleKey: 'journey.node.mock', detailKey: 'journey.node.mock.detail', route: 'exams', complete: completedMocks > 0, detail: completedMocks > 0 ? { key: 'journey.mocks', count: completedMocks } : null, position: 'center', boss: true, cityKey: 'journey.city.istanbul' },
    { id: 'multilevel', titleKey: 'journey.node.multilevel', detailKey: 'journey.node.multilevel.detail', route: 'full-mock', complete: Boolean(stats.examDone), position: 'right', boss: true, cityKey: 'journey.city.bursa' },
  ]
}

export default function JourneyMap({ stats = {}, progress = {}, navigate }) {
  const { t } = useI18n()
  const nodes = useMemo(() => makeJourneyNodes(stats, progress), [stats, progress])
  const completedCount = nodes.filter((node) => node.complete).length
  const nextIndex = nodes.findIndex((node) => !node.complete)

  return <section className="relative isolate mx-auto w-full max-w-4xl overflow-hidden rounded-[2rem] border border-indigo-300/20 bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,.28),transparent_44%),radial-gradient(ellipse_at_100%_65%,rgba(217,70,239,.13),transparent_38%),linear-gradient(160deg,#151b3d,#11152d_48%,#101827)] px-4 pb-8 pt-5 text-white shadow-[0_28px_90px_rgba(30,27,75,.42)] sm:px-8 sm:pt-8">
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:24px_24px] opacity-[.12]" aria-hidden="true" />
    <div className="pointer-events-none absolute -right-24 top-12 -z-10 size-72 rounded-full bg-fuchsia-500/15 blur-3xl" aria-hidden="true" /><div className="pointer-events-none absolute -bottom-28 -left-24 -z-10 size-80 rounded-full bg-cyan-500/10 blur-3xl" aria-hidden="true" />

    <header className="sticky top-2 z-30 mb-8 flex items-center justify-between gap-3 rounded-[1.5rem] border border-white/15 bg-gradient-to-r from-indigo-800/95 via-violet-800/95 to-fuchsia-800/90 p-3.5 shadow-[0_14px_35px_rgba(49,46,129,.35)] backdrop-blur-xl sm:top-4 sm:p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/15 text-cyan-100 shadow-inner"><MapIcon className="size-5" aria-hidden="true"/></span>
        <div className="min-w-0"><h1 className="truncate text-base font-black sm:text-lg">{t('journey.title')}</h1><p className="mt-0.5 truncate text-[10px] font-semibold text-indigo-100/85 sm:text-xs">{t('journey.phase')}</p></div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-200/50 bg-gradient-to-b from-yellow-300 to-amber-400 px-3 py-1.5 text-xs font-black tabular-nums text-amber-950 shadow-[0_4px_0_#b45309,0_8px_18px_rgba(245,158,11,.24)]"><Star className="size-3.5 fill-yellow-400 text-yellow-400" aria-hidden="true"/>{t('journey.xp', { count: Math.max(0, Number(stats.xp) || 0).toLocaleString() })}</span>
        <span className="text-[9px] font-bold text-indigo-100/75 sm:text-[10px]">{t('journey.count', { done: completedCount, total: nodes.length })}</span>
      </div>
    </header>

    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-start gap-2 rounded-2xl border border-violet-200/15 bg-gradient-to-r from-indigo-400/10 via-violet-400/10 to-fuchsia-400/10 px-3.5 py-3 text-[11px] leading-5 text-indigo-100/85 shadow-inner sm:text-xs">
        <Star className="mt-0.5 size-3.5 shrink-0 fill-violet-300 text-violet-200" aria-hidden="true"/><p>{t('journey.noLocks')}</p>
      </div>

      <div className="relative py-8">
        <div className="absolute bottom-0 left-1/2 top-0 z-0 w-3 -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500 via-purple-500 to-slate-700 shadow-[0_0_18px_rgba(139,92,246,.4)]" aria-hidden="true" />
        <div className="relative z-10 flex flex-col gap-12 sm:gap-14">
          {nodes.map((node, index) => {
            const isCurrent = !node.complete && index === nextIndex
            const isCompleted = node.complete
            const alignment = node.position === 'left' ? 'self-start translate-x-5 sm:translate-x-10' : node.position === 'right' ? 'self-end -translate-x-5 sm:-translate-x-10' : 'self-center'
            const buttonTone = isCompleted
              ? 'border-yellow-200 border-b-[7px] border-b-yellow-700 bg-gradient-to-b from-yellow-300 via-yellow-400 to-amber-400 text-amber-950 shadow-[0_9px_0_rgba(133,77,14,.32),0_0_26px_rgba(250,204,21,.32)] hover:from-yellow-200 active:translate-y-1 active:border-b-[3px]'
              : isCurrent && node.boss
                ? 'border-fuchsia-200 border-b-[7px] border-b-purple-950 bg-gradient-to-b from-orange-400 via-fuchsia-500 to-violet-700 text-white shadow-[0_9px_0_rgba(46,16,101,.42),0_0_36px_rgba(168,85,247,.62)] motion-safe:animate-bounce hover:brightness-110 active:translate-y-1 active:border-b-[3px]'
                : isCurrent
                  ? 'border-blue-300 border-b-[7px] border-b-blue-800 bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-[0_9px_0_rgba(30,64,175,.48),0_0_30px_rgba(59,130,246,.55)] motion-safe:animate-bounce hover:from-blue-300 active:translate-y-1 active:border-b-[3px]'
                  : node.boss
                    ? 'border-purple-300 border-b-[7px] border-b-purple-950 bg-gradient-to-b from-violet-500 to-purple-800 text-white shadow-[0_8px_0_rgba(46,16,101,.42),0_0_26px_rgba(168,85,247,.48)] hover:brightness-110 active:translate-y-1 active:border-b-[3px]'
                    : 'border-slate-500 border-b-[7px] border-b-slate-950 bg-gradient-to-b from-slate-500 to-slate-700 text-slate-200 shadow-[0_8px_0_rgba(2,6,23,.55)] hover:border-slate-300 hover:from-slate-400 active:translate-y-1 active:border-b-[3px]'
            const Icon = isCompleted ? CheckCircle2 : node.boss ? Crown : isCurrent ? Star : MapIcon
            const statusLabel = isCompleted ? t('journey.completed') : isCurrent ? t('journey.current') : t('journey.available')
            return <article key={node.id} className={`group relative flex w-40 flex-col items-center sm:w-48 ${alignment}`}>
              {node.cityKey && <div className="absolute -top-10 z-20 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-amber-200/35 bg-gradient-to-r from-orange-500 via-fuchsia-600 to-violet-700 px-4 py-2 shadow-[0_6px_18px_rgba(168,85,247,.38)] sm:-top-11 sm:px-5">
                <Flag className="size-3.5 text-yellow-100" aria-hidden="true"/><span className="text-[9px] font-black tracking-[.18em] text-white sm:text-[10px]">{t(node.cityKey)}</span>
              </div>}
              <button type="button" onClick={() => navigate?.(node.route)} aria-label={`${t('journey.open')}: ${t(node.titleKey)} · ${statusLabel}`} className={`relative z-10 grid ${node.boss ? 'size-24 sm:size-28 rounded-[2rem]' : 'size-20 rounded-[1.7rem]'} place-items-center border-[3px] transition duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200/60 ${buttonTone}`}>
                <Icon className={`drop-shadow-md ${node.boss ? 'size-10 sm:size-12' : 'size-8'} ${isCurrent && !node.boss ? 'fill-white' : isCompleted ? 'fill-yellow-50' : ''}`} aria-hidden="true"/>
                {isCurrent && <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/40 motion-safe:animate-ping" aria-hidden="true"/>}
              </button>
              <div className="mt-3 w-full text-center">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-[8px] font-black uppercase tracking-wider shadow-sm sm:text-[9px] ${isCompleted ? 'border-yellow-200/30 bg-yellow-300/15 text-yellow-100' : isCurrent ? 'border-blue-200/35 bg-blue-300/15 text-blue-100' : 'border-slate-500/40 bg-slate-700/80 text-slate-200'}`}>{statusLabel}</span>
                <h2 className={`mt-1 text-balance font-extrabold ${isCompleted ? 'text-sm text-yellow-50 sm:text-base' : isCurrent ? 'text-sm text-white sm:text-base' : 'text-xs text-slate-100 sm:text-sm'}`}>{t(node.titleKey)}</h2>
                <p className="mt-0.5 text-[10px] leading-4 text-indigo-100/70 sm:text-xs">{t(node.detailKey)}</p>
                {node.detail && <p className="mt-1 text-[10px] font-bold tabular-nums text-yellow-100">{t(node.detail.key, { count: node.detail.count })}</p>}
                {isCompleted && node.score != null && <p className="mt-1 text-[10px] font-bold tabular-nums text-yellow-100">{t('journey.latestScore', { score: node.score })}</p>}
              </div>
            </article>
          })}
        </div>
      </div>
    </div>
  </section>
}
