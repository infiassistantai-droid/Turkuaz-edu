import { ArrowLeft, Compass } from 'lucide-react'

export default function NotFound({ onHome }) {
  return (
    <main className="grid min-h-[100dvh] place-items-center overflow-x-hidden bg-slate-950 px-4 py-10 text-center text-white sm:px-6">
      <section className="w-full max-w-lg rounded-[28px] border border-teal-300/15 bg-slate-900/90 p-6 shadow-2xl shadow-black/40 sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-teal-300/20 bg-teal-400/10 text-teal-200">
          <Compass className="size-7" aria-hidden="true" />
        </span>
        <p className="mt-5 text-xs font-extrabold uppercase tracking-[.2em] text-teal-300">404</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Kechirasiz, bu sahifa topilmadi</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Manzil o‘zgargan yoki sahifa mavjud emas. Bosh sahifaga qaytib davom etishingiz mumkin.</p>
        <button type="button" onClick={onHome} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-teal-950/30 transition hover:-translate-y-0.5 hover:brightness-110 sm:w-auto">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Bosh sahifaga qaytish
        </button>
      </section>
    </main>
  )
}
