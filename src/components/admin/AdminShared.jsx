import { useId } from 'react'
import { AlertCircle, CheckCircle2, FileAudio2, ImagePlus, Plus, X } from 'lucide-react'

export const INPUT_CLASS = 'min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10'
export const LABEL_CLASS = 'mb-1.5 block text-xs font-bold text-slate-700'

export function AdminPageHeader({ eyebrow, title, description, actions }) {
  return <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[.18em] text-indigo-600">{eyebrow}</p><h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h1>{description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>}</div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </header>
}

export function AdminCard({ title, description, action, children, className = '' }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
    {(title || description || action) && <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5"><div>{title && <h2 className="font-extrabold text-slate-900">{title}</h2>}{description && <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>}</div>{action}</div>}
    {children}
  </section>
}

export function PrimaryButton({ children, className = '', ...props }) {
  return <button {...props} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>{children}</button>
}

export function SecondaryButton({ children, className = '', ...props }) {
  return <button {...props} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>{children}</button>
}

export function Field({ label, hint, children, className = '' }) {
  return <div className={className}><label className={LABEL_CLASS}>{label}</label>{children}{hint && <p className="mt-1.5 text-[11px] leading-4 text-slate-500">{hint}</p>}</div>
}

export function EmptyAdminState({ title, description, icon: Icon = AlertCircle, action }) {
  return <div className="flex min-h-48 flex-col items-center justify-center px-5 py-10 text-center">
    <span className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500"><Icon className="size-5" aria-hidden="true"/></span>
    <h3 className="mt-3 font-extrabold text-slate-800">{title}</h3><p className="mt-1 max-w-md text-xs leading-5 text-slate-500">{description}</p>{action && <div className="mt-4">{action}</div>}
  </div>
}

export function SessionDraftTag({ children = 'Local draft' }) {
  return <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-800"><CheckCircle2 className="size-3" aria-hidden="true"/>{children}</span>
}

export function AdminModal({ open, title, onClose, children, footer, closeLabel = 'Close' }) {
  const titleId = useId()
  if (!open) return null
  return <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-slate-950/45 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby={titleId} className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
      <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4"><h2 id={titleId} className="text-lg font-black text-slate-900">{title}</h2><button type="button" onClick={onClose} aria-label={closeLabel} className="grid size-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"><X className="size-4" aria-hidden="true"/></button></header>
      <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
      {footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4">{footer}</footer>}
    </section>
  </div>
}

export function UploadInput({ label, accept, onChange, kind = 'audio', name, chooseLabel = 'Choose file', required = false }) {
  const inputId = useId()
  const Icon = kind === 'image' ? ImagePlus : FileAudio2
  return <div><label htmlFor={inputId} className={LABEL_CLASS}>{label}</label><label htmlFor={inputId} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3.5 py-3 text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50/50"><Icon className="size-4 shrink-0 text-indigo-500" aria-hidden="true"/><span className="min-w-0 flex-1 truncate">{chooseLabel}</span><Plus className="size-4 shrink-0 text-slate-400" aria-hidden="true"/></label><input id={inputId} className="sr-only" name={name} type="file" accept={accept} required={required} onChange={onChange}/></div>
}
