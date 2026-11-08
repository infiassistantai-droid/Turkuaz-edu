import { useEffect, useRef, useState } from 'react'
import { Check, Coins, Diamond, Flame, Gift, LockKeyhole, Shield, ShoppingBag, Sparkles, Star, Zap } from 'lucide-react'
import { useI18n } from '../lib/i18n.jsx'
import { getRatingTier } from '../lib/ranks'

const CHESTS = [
  { id: 'wood', nameKey: 'shop.item.wood.name', descKey: 'shop.item.wood.desc', price: 300, currency: 'gold', image: '/images/shop/common-chest.png', tone: 'from-amber-800/80 via-orange-950/70 to-slate-950', edge: 'border-b-amber-950', halo: 'bg-amber-400/15' },
  { id: 'magic', nameKey: 'shop.item.magic.name', descKey: 'shop.item.magic.desc', price: 800, currency: 'gold', image: '/images/shop/common-chest.png', imageStyle: { filter: 'hue-rotate(225deg) saturate(1.35)' }, tone: 'from-indigo-800/90 via-violet-950/80 to-slate-950', edge: 'border-b-indigo-950', halo: 'bg-violet-400/20' },
  { id: 'legendary', nameKey: 'shop.item.legendary.name', descKey: 'shop.item.legendary.desc', price: 50, currency: 'gems', image: '/images/shop/legendary-chest.png', tone: 'from-amber-600/90 via-yellow-950/80 to-purple-950', edge: 'border-b-amber-950', halo: 'bg-yellow-300/25', legendary: true },
]

const BOOSTS = [
  { id: 'freeze', nameKey: 'shop.item.freeze.name', descKey: 'shop.item.freeze.desc', price: 500, currency: 'gold', image: '/images/shop/freeze.png', tone: 'from-sky-900/85 via-blue-950/80 to-slate-950', edge: 'border-b-slate-950', halo: 'bg-cyan-300/15' },
  { id: 'double', nameKey: 'shop.item.double.name', descKey: 'shop.item.double.desc', price: 15, currency: 'gems', image: '/images/shop/potion.png', tone: 'from-fuchsia-900/80 via-purple-950/80 to-slate-950', edge: 'border-b-purple-950', halo: 'bg-fuchsia-300/15' },
]

const COSMETICS = [
  { id: 'gold-name', nameKey: 'shop.item.goldName.name', descKey: 'shop.item.goldName.desc', price: 2000, currency: 'gold', image: '/images/shop/golden-name.png', art: 'golden-name', background: 'bg-gradient-to-b from-[#2a1a08] to-[#0f172a]', edge: 'border-b-slate-900', halo: 'bg-yellow-300/25', requiredTier: true, unique: true },
  { id: 'fire-frame', nameKey: 'shop.item.fireFrame.name', descKey: 'shop.item.fireFrame.desc', price: 40, currency: 'gems', image: '/images/shop/fire-border.png', art: 'fire-border', background: 'bg-gradient-to-b from-[#2a0808] to-[#0f172a]', edge: 'border-b-slate-900', halo: 'bg-red-500/25', unique: true },
]

const CATALOG = [...CHESTS, ...BOOSTS, ...COSMETICS]

function CurrencyIcon({ currency, className = 'size-5' }) {
  if (currency === 'gold') return <img src="/images/shop/gold.png" alt="" className={`${className} object-contain drop-shadow-[0_3px_5px_rgba(251,191,36,.45)]`} />
  return <img src="/images/shop/gem.png" alt="" className={`${className} object-contain drop-shadow-[0_3px_5px_rgba(34,211,238,.45)]`} />
}

function PriceTag({ currency, amount, t, compact = false }) {
  return <span className={`inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/25 font-black tabular-nums ${currency === 'gold' ? 'text-amber-100' : 'text-cyan-100'} ${compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'}`}>
    <CurrencyIcon currency={currency} className={compact ? 'size-7' : 'size-9'} />
    <span>{amount.toLocaleString()}</span>
  </span>
}

function ProductArt({ item }) {
  if (item.art === 'golden-name') return <div className="relative flex h-36 w-full items-center justify-center">
    <div className="absolute inset-x-6 top-1/2 h-20 -translate-y-1/2 rounded-full bg-yellow-400/20 blur-2xl shadow-[0_0_40px_rgba(234,179,8,.3)]" aria-hidden="true"/>
    <img src={item.image} alt="" className="relative z-10 h-full w-full max-w-[18rem] object-contain drop-shadow-[0_0_40px_rgba(234,179,8,.3)] motion-safe:animate-[shop-float_3s_ease-in-out_infinite]" loading="lazy"/>
  </div>

  if (item.art === 'fire-border') return <div className="relative grid size-32 place-items-center sm:size-36">
    <div className="absolute inset-1 rounded-full bg-red-500/25 blur-2xl shadow-[0_0_40px_rgba(239,68,68,.4)]" aria-hidden="true"/>
    <img src={item.image} alt="" className="relative z-10 size-full object-contain drop-shadow-[0_0_40px_rgba(239,68,68,.4)] motion-safe:animate-pulse" loading="lazy"/>
  </div>

  return <div className="relative grid size-32 place-items-center sm:size-36">
    <div className={`absolute inset-2 rounded-full blur-2xl ${item.halo}`} aria-hidden="true" />
    <img src={item.image} alt="" className={`relative z-10 size-full object-contain drop-shadow-[0_16px_12px_rgba(0,0,0,.42)] transition duration-200 group-hover:scale-110`} style={item.imageStyle} loading="lazy" />
    {item.legendary && <Sparkles className="absolute right-0 top-0 z-20 size-6 animate-pulse fill-yellow-100 text-yellow-100 drop-shadow-[0_0_10px_rgba(250,204,21,.9)]" aria-hidden="true"/>}
  </div>
}

function ProductCard({ item, wallet, currentTier, purchasedIds, onPurchase, t }) {
  const balance = wallet[item.currency]
  const gap = Math.max(0, item.price - balance)
  const canAfford = gap === 0
  const meetsTier = !item.requiredTier || currentTier.toLowerCase() === 'gold'
  const isPurchased = item.unique && purchasedIds.includes(item.id)
  const isBuyable = canAfford && meetsTier && !isPurchased
  const buttonLabel = isPurchased ? t('shop.owned') : !meetsTier ? t('shop.requiredTier', { tier: t('leaderboard.league.gold') }) : isBuyable ? t('shop.buy') : t('shop.insufficient')

  return <article className={`group relative isolate flex min-h-[405px] flex-col overflow-hidden rounded-[1.7rem] border border-white/10 border-b-[6px] ${item.edge} ${item.background || `bg-gradient-to-br ${item.tone}`} p-4 shadow-[0_8px_0_rgba(2,6,23,.5),0_18px_35px_rgba(0,0,0,.24)] transition-all duration-150 hover:-translate-y-1 hover:border-b-[2px] hover:shadow-2xl active:translate-y-[2px] active:border-b-[2px] ${item.legendary ? 'shadow-[0_8px_0_rgba(120,53,15,.4),0_0_30px_rgba(234,179,8,.25)]' : ''}`}>
    <div className={`pointer-events-none absolute -right-12 -top-16 -z-10 size-44 rounded-full blur-3xl ${item.halo} ${item.legendary ? 'motion-safe:animate-pulse' : ''}`} aria-hidden="true" />
    {item.legendary && <div className="pointer-events-none absolute inset-0 -z-10 rounded-[1.7rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(250,204,21,.18),transparent_54%)]" aria-hidden="true"/>}
    <div className="flex items-center justify-between gap-2">
      <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[9px] font-black uppercase tracking-[.16em] text-white/65">{item.currency === 'gold' ? t('shop.wallet.gold') : t('shop.wallet.gems')}</span>
      {item.legendary && <span className="inline-flex items-center gap-1 rounded-full border border-yellow-200/25 bg-yellow-200/10 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-yellow-100"><Star className="size-3 fill-yellow-200" aria-hidden="true"/>{t('shop.rarity.legendary')}</span>}
    </div>
    <div className="mx-auto mt-1 grid h-36 w-full place-items-center"><ProductArt item={item}/></div>
    <div className="mt-1 flex flex-1 flex-col text-center">
      <h3 className={`text-base font-black tracking-wide sm:text-lg ${item.legendary ? 'text-yellow-100' : 'text-white'}`}>{t(item.nameKey)}</h3>
      <p className="mt-1.5 text-[11px] leading-5 text-slate-300/90 sm:text-xs">{t(item.descKey)}</p>
      <div className="mt-auto pt-4"><PriceTag currency={item.currency} amount={item.price} t={t}/>
        <button type="button" onClick={() => isBuyable && onPurchase(item)} disabled={!isBuyable} className={`mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[10px] font-black tracking-wider transition-all duration-150 sm:text-xs ${isBuyable ? 'border-emerald-300/30 border-b-4 border-b-emerald-800 bg-gradient-to-b from-emerald-400 to-emerald-500 text-emerald-950 shadow-[0_6px_16px_rgba(16,185,129,.2)] hover:from-emerald-300 active:translate-y-[2px] active:border-b-2' : isPurchased ? 'cursor-default border-emerald-300/15 border-b-4 border-b-emerald-900 bg-emerald-950/70 text-emerald-200' : 'cursor-not-allowed border-slate-600/60 border-b-4 border-b-slate-950 bg-slate-800/85 text-slate-300/80'}`}>
          {isPurchased ? <Check className="size-4" aria-hidden="true"/> : isBuyable ? <ShoppingBag className="size-4" aria-hidden="true"/> : <LockKeyhole className="size-4" aria-hidden="true"/>}{buttonLabel}
        </button>
        {!canAfford && <p className="mt-1.5 text-[9px] font-bold text-rose-200/80">{t('shop.shortfall', { count: gap.toLocaleString(), currency: t(item.currency === 'gold' ? 'shop.wallet.gold' : 'shop.wallet.gems') })}</p>}
      </div>
    </div>
  </article>
}

function WalletPill({ currency, amount, t }) {
  const gold = currency === 'gold'
  return <div className={`flex min-w-[135px] items-center gap-2.5 rounded-2xl border border-white/10 border-b-4 px-3 py-2 shadow-[0_8px_18px_rgba(0,0,0,.22)] sm:min-w-[160px] sm:gap-3 sm:px-4 sm:py-2.5 ${gold ? 'border-b-amber-600 bg-gradient-to-br from-amber-950/80 to-orange-950/80 text-amber-100 shadow-amber-500/10' : 'border-b-cyan-600 bg-gradient-to-br from-cyan-950/80 to-blue-950/80 text-cyan-100 shadow-cyan-500/10'}`}>
    <CurrencyIcon currency={currency} className="size-11 shrink-0 sm:size-14"/>
    <div className="min-w-0"><p className={`text-[9px] font-black uppercase tracking-[.17em] ${gold ? 'text-amber-200/65' : 'text-cyan-200/65'}`}>{t(gold ? 'shop.wallet.gold' : 'shop.wallet.gems')}</p><p className="text-xl font-black tabular-nums drop-shadow-sm sm:text-2xl">{amount.toLocaleString()}</p></div>
  </div>
}

export default function Shop({ stats = {}, profile = {} }) {
  const { t } = useI18n()
  // Session-only wallet seeded with the example balances from the supplied design.
  // It deliberately is not synced to learner progress or persisted.
  const [wallet, setWallet] = useState(() => ({ gold: 1450, gems: 25 }))
  const [purchasedIds, setPurchasedIds] = useState([])
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const currentTier = String(profile.ratingTier || getRatingTier(stats.xp)).toLowerCase()

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const purchase = (item) => {
    const currentBalance = Number(wallet[item.currency]) || 0
    if (currentBalance < item.price || (item.requiredTier && currentTier !== 'gold') || (item.unique && purchasedIds.includes(item.id))) return
    setWallet((previous) => ({ ...previous, [item.currency]: previous[item.currency] - item.price }))
    if (item.unique) setPurchasedIds((previous) => [...previous, item.id])
    setToast({ id: `${item.id}-${Date.now()}`, message: t('shop.toast.success', { item: t(item.nameKey) }) })
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3600)
  }

  return <section className="relative isolate mx-auto min-h-[70vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-amber-200/15 bg-[radial-gradient(ellipse_at_95%_0%,rgba(245,158,11,.17),transparent_34%),radial-gradient(ellipse_at_0%_100%,rgba(34,211,238,.12),transparent_32%),linear-gradient(145deg,#151b2b,#0e1523_65%,#111827)] p-4 text-slate-100 shadow-[0_28px_90px_rgba(0,0,0,.32)] sm:p-7 lg:p-8">
    <div className="pointer-events-none absolute -right-24 top-40 -z-10 size-80 rounded-full bg-amber-500/10 blur-3xl" aria-hidden="true"/>
    <div className="pointer-events-none absolute -left-24 top-1/3 -z-10 size-72 rounded-full bg-violet-500/10 blur-3xl" aria-hidden="true"/>
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="rounded-[1.7rem] border border-white/10 bg-gradient-to-r from-slate-800/95 via-slate-800/90 to-amber-950/50 p-4 shadow-2xl sm:p-6">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-amber-200/20 bg-amber-300/10 text-amber-200 shadow-[0_0_28px_rgba(245,158,11,.14)]"><Gift className="size-6" aria-hidden="true"/></span>
            <div><p className="text-[9px] font-black uppercase tracking-[.2em] text-amber-200/75">{t('shop.wallet.title')}</p><h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">{t('shop.title')}</h1><p className="mt-1.5 text-xs leading-5 text-slate-300 sm:text-sm">{t('shop.subtitle')}</p></div>
          </div>
          <div className="flex w-full flex-wrap gap-3 sm:w-auto sm:justify-end"><WalletPill currency="gold" amount={wallet.gold} t={t}/><WalletPill currency="gems" amount={wallet.gems} t={t}/></div>
        </div>
        <p className="mt-4 border-t border-white/[.07] pt-3 text-[9px] leading-4 text-slate-400 sm:text-[10px]">{t('shop.sessionNote')}</p>
      </header>

      <section aria-labelledby="shop-chests" className="space-y-4">
        <h2 id="shop-chests" className="flex items-center gap-2 text-lg font-black tracking-wide text-white sm:text-xl"><span className="grid size-9 place-items-center rounded-xl border border-amber-200/15 bg-amber-300/10"><Gift className="size-5 text-amber-200" aria-hidden="true"/></span>{t('shop.chests.title')}</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">{CHESTS.map((item) => <ProductCard key={item.id} item={item} wallet={wallet} currentTier={currentTier} purchasedIds={purchasedIds} onPurchase={purchase} t={t}/>)}</div>
      </section>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <section aria-labelledby="shop-boosts" className="space-y-4">
          <h2 id="shop-boosts" className="flex items-center gap-2 text-lg font-black tracking-wide text-white sm:text-xl"><Shield className="size-5 text-sky-300" aria-hidden="true"/>{t('shop.buffs.title')}</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1">{BOOSTS.map((item) => <ProductCard key={item.id} item={item} wallet={wallet} currentTier={currentTier} purchasedIds={purchasedIds} onPurchase={purchase} t={t}/>)}</div>
        </section>
        <section aria-labelledby="shop-cosmetics" className="space-y-4">
          <h2 id="shop-cosmetics" className="flex items-center gap-2 text-lg font-black tracking-wide text-white sm:text-xl"><Sparkles className="size-5 text-violet-300" aria-hidden="true"/>{t('shop.cosmetics.title')}</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1">{COSMETICS.map((item) => <ProductCard key={item.id} item={item} wallet={wallet} currentTier={currentTier} purchasedIds={purchasedIds} onPurchase={purchase} t={t}/>)}</div>
        </section>
      </div>
    </div>

    {toast && <div key={toast.id} role="status" aria-live="polite" className="shop-toast-pop fixed bottom-5 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border border-emerald-200/30 border-b-4 border-b-emerald-800 bg-gradient-to-r from-emerald-500 to-teal-400 p-4 text-emerald-950 shadow-[0_14px_40px_rgba(16,185,129,.35)]">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/20"><Check className="size-5" aria-hidden="true"/></span><span className="min-w-0 flex-1"><span className="block text-sm font-black">{toast.message}</span><span className="mt-0.5 block text-[10px] font-semibold text-emerald-950/75">{t('shop.toast.note')}</span></span><Sparkles className="size-5 shrink-0 animate-pulse text-yellow-100" aria-hidden="true"/>
    </div>}
  </section>
}
