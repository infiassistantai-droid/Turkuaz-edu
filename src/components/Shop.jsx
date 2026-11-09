import { useEffect, useRef, useState } from 'react'
import { Check, Gift, LockKeyhole, PackageOpen, Shield, ShoppingBag, Sparkles, Star, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useI18n } from '../lib/i18n.jsx'
import { getRatingTier } from '../lib/ranks'

const CHESTS = [
  { id: 'wood', isChest: true, nameKey: 'shop.item.wood.name', descKey: 'shop.item.wood.desc', price: 300, currency: 'gold', image: '/images/shop/common-chest.png', tone: 'from-amber-800/80 via-orange-950/70 to-slate-950', edge: 'border-b-amber-950', halo: 'bg-amber-400/15' },
  { id: 'magic', isChest: true, nameKey: 'shop.item.magic.name', descKey: 'shop.item.magic.desc', price: 800, currency: 'gold', image: '/images/shop/common-chest.png', imageStyle: { filter: 'hue-rotate(225deg) saturate(1.35)' }, tone: 'from-indigo-800/90 via-violet-950/80 to-slate-950', edge: 'border-b-indigo-950', halo: 'bg-violet-400/20' },
  { id: 'legendary', isChest: true, nameKey: 'shop.item.legendary.name', descKey: 'shop.item.legendary.desc', price: 50, currency: 'gems', image: '/images/shop/legendary-chest.png', tone: 'from-amber-600/90 via-yellow-950/80 to-purple-950', edge: 'border-b-amber-950', halo: 'bg-yellow-300/25', legendary: true },
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
const CHEST_REWARDS = {
  wood: [{ currency: 'gold', min: 50, max: 100 }],
  magic: [
    { currency: 'gold', min: 150, max: 300, weight: 0.7 },
    { currency: 'gems', min: 3, max: 8, weight: 0.3 },
  ],
  legendary: [
    { currency: 'gold', min: 500, max: 1000, weight: 0.6 },
    { currency: 'gems', min: 15, max: 30, weight: 0.4 },
  ],
}

function rollChestReward(item) {
  const options = CHEST_REWARDS[item.id] || CHEST_REWARDS.wood
  const random = Math.random()
  let cursor = 0
  const outcome = options.find((option) => {
    cursor += option.weight ?? 1
    return random <= cursor
  }) || options[options.length - 1]
  return { currency: outcome.currency, amount: Math.floor(Math.random() * (outcome.max - outcome.min + 1)) + outcome.min }
}

const CATEGORIES = [
  { id: 'all', labelKey: 'shop.category.all', icon: ShoppingBag, items: CATALOG },
  { id: 'chests', labelKey: 'shop.category.chests', icon: Gift, items: CHESTS },
  { id: 'boosts', labelKey: 'shop.category.boosts', icon: Shield, items: BOOSTS },
  { id: 'cosmetics', labelKey: 'shop.category.cosmetics', icon: Sparkles, items: COSMETICS },
]

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
  const buttonLabel = isPurchased ? t('shop.owned') : !meetsTier ? t('shop.requiredTier', { tier: t('leaderboard.league.gold') }) : isBuyable ? t(item.isChest ? 'shop.chest.buy' : 'shop.buy') : t('shop.insufficient')

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
        <button type="button" onClick={() => onPurchase(item)} disabled={isPurchased} aria-disabled={!isBuyable && !isPurchased} className={`mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[10px] font-black tracking-wider transition-all duration-150 sm:text-xs ${isBuyable ? 'border-emerald-300/30 border-b-4 border-b-emerald-800 bg-gradient-to-b from-emerald-400 to-emerald-500 text-emerald-950 shadow-[0_6px_16px_rgba(16,185,129,.2)] hover:from-emerald-300 active:translate-y-[2px] active:border-b-2' : isPurchased ? 'cursor-default border-emerald-300/15 border-b-4 border-b-emerald-900 bg-emerald-950/70 text-emerald-200' : 'cursor-help border-slate-600/60 border-b-4 border-b-slate-950 bg-slate-800/85 text-slate-300/80 hover:bg-slate-700/90'}`}>
          {isPurchased ? <Check className="size-4" aria-hidden="true"/> : isBuyable ? <ShoppingBag className="size-4" aria-hidden="true"/> : <LockKeyhole className="size-4" aria-hidden="true"/>}{buttonLabel}
        </button>
        {!canAfford && <p className="mt-1.5 text-[9px] font-bold text-rose-200/80">{t('shop.shortfall', { count: gap.toLocaleString(), currency: t(item.currency === 'gold' ? 'shop.wallet.gold' : 'shop.wallet.gems') })}</p>}
      </div>
    </div>
  </article>
}

function ChestInventoryCard({ item, onOpen, t }) {
  return <article className={`group relative isolate flex min-h-[340px] flex-col overflow-hidden rounded-[1.7rem] border border-teal-200/20 border-b-4 ${item.edge} bg-gradient-to-br ${item.tone} p-4 shadow-[0_14px_32px_rgba(0,0,0,.25)]`}>
    <div className="flex items-center justify-between gap-2"><span className="rounded-full border border-teal-100/15 bg-black/25 px-2.5 py-1 text-[9px] font-black uppercase tracking-[.16em] text-teal-100/80">{t('shop.category.inventory')}</span>{item.legendary && <span className="rounded-full border border-yellow-200/25 bg-yellow-200/10 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-yellow-100">{t('shop.rarity.legendary')}</span>}</div>
    <div className="mx-auto mt-3 grid h-36 w-full place-items-center"><ProductArt item={item}/></div>
    <div className="mt-auto text-center"><h3 className="text-base font-black text-white sm:text-lg">{t(item.nameKey)}</h3><p className="mt-1.5 text-xs leading-5 text-slate-300">{t('shop.chest.readyToOpen')}</p>
      <button type="button" onClick={onOpen} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-teal-200/30 border-b-4 border-b-teal-900 bg-gradient-to-b from-teal-300 to-cyan-400 px-4 py-3 text-xs font-black text-slate-950 shadow-lg shadow-teal-950/20 transition hover:brightness-110"><PackageOpen className="size-4" aria-hidden="true"/>{t('shop.chest.open')}</button>
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
  const [chestInventory, setChestInventory] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [chestReveal, setChestReveal] = useState(null)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const currentTier = String(profile.ratingTier || getRatingTier(stats.xp)).toLowerCase()
  const visibleCategories = [...CATEGORIES, { id: 'inventory', labelKey: 'shop.category.inventory', icon: PackageOpen, items: chestInventory }]
  const selectedCategory = visibleCategories.find((category) => category.id === activeCategory) || CATEGORIES[0]

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  useEffect(() => {
    if (!chestReveal) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setChestReveal(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [chestReveal])

  const purchase = (item) => {
    const currentBalance = Number(wallet[item.currency]) || 0
    if (item.unique && purchasedIds.includes(item.id)) return

    if (item.requiredTier && currentTier !== 'gold') {
      setToast({
        id: `${item.id}-${Date.now()}`,
        message: t('shop.requiredTier', { tier: t('leaderboard.league.gold') }),
        note: t('shop.toast.tierNote'),
        kind: 'warning',
      })
    } else if (currentBalance < item.price) {
      setToast({
        id: `${item.id}-${Date.now()}`,
        message: t('shop.insufficient'),
        note: t('shop.shortfall', { count: (item.price - currentBalance).toLocaleString(), currency: t(item.currency === 'gold' ? 'shop.wallet.gold' : 'shop.wallet.gems') }),
        kind: 'warning',
      })
    } else if (item.isChest) {
      const uid = `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      setWallet((previous) => ({ ...previous, [item.currency]: previous[item.currency] - item.price }))
      setChestInventory((previous) => [...previous, { uid, chestId: item.id }])
      setActiveCategory('inventory')
      setToast({
        id: uid,
        message: t('shop.toast.chestAdded', { item: t(item.nameKey) }),
        note: t('shop.toast.inventoryNote'),
      })
    } else {
      setWallet((previous) => ({ ...previous, [item.currency]: previous[item.currency] - item.price }))
      if (item.unique) setPurchasedIds((previous) => [...previous, item.id])
      setToast({
        id: `${item.id}-${Date.now()}`,
        message: t('shop.toast.success', { item: t(item.nameKey) }),
        note: t('shop.toast.note'),
      })
    }

    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3600)
  }

  const openChest = (chest) => {
    const item = CHESTS.find((candidate) => candidate.id === chest.chestId)
    if (!item || !chestInventory.some((candidate) => candidate.uid === chest.uid)) return

    const reward = rollChestReward(item)
    setChestInventory((previous) => previous.filter((candidate) => candidate.uid !== chest.uid))
    setWallet((previous) => ({ ...previous, [reward.currency]: (Number(previous[reward.currency]) || 0) + reward.amount }))
    setChestReveal({ item, reward })
    setToast(null)
    window.clearTimeout(toastTimer.current)
  }

  return <section className="relative isolate mx-auto min-h-[70vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-teal-200/15 bg-[radial-gradient(ellipse_at_95%_0%,rgba(20,184,166,.16),transparent_34%),radial-gradient(ellipse_at_0%_100%,rgba(6,182,212,.12),transparent_32%),linear-gradient(145deg,#0f172a,#111d30_65%,#0f172a)] p-4 text-slate-100 shadow-[0_28px_90px_rgba(0,0,0,.32)] sm:p-7 lg:p-8">
    <div className="pointer-events-none absolute -right-24 top-40 -z-10 size-80 rounded-full bg-teal-500/10 blur-3xl" aria-hidden="true"/>
    <div className="pointer-events-none absolute -left-24 top-1/3 -z-10 size-72 rounded-full bg-cyan-500/10 blur-3xl" aria-hidden="true"/>
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="rounded-[1.7rem] border border-white/10 bg-gradient-to-br from-slate-800/95 via-slate-800/85 to-teal-950/55 p-4 shadow-2xl shadow-slate-950/30 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-teal-200/20 bg-teal-300/10 text-teal-200 shadow-[0_0_28px_rgba(45,212,191,.14)]"><Gift className="size-6" aria-hidden="true"/></span>
            <div><p className="text-[9px] font-black uppercase tracking-[.2em] text-teal-200/75">{t('shop.wallet.title')}</p><h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">{t('shop.title')}</h1><p className="mt-1.5 text-xs leading-5 text-slate-300 sm:text-sm">{t('shop.subtitle')}</p></div>
          </div>
          <div className="flex w-full flex-wrap gap-3 sm:w-auto sm:justify-end"><WalletPill currency="gold" amount={wallet.gold} t={t}/><WalletPill currency="gems" amount={wallet.gems} t={t}/></div>
        </div>
        <p className="mt-4 border-t border-white/[.07] pt-3 text-[9px] leading-4 text-slate-400 sm:text-[10px]">{t('shop.sessionNote')}</p>
      </header>

      <section className="space-y-5" aria-labelledby="shop-catalog-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-[9px] font-black uppercase tracking-[.18em] text-teal-200/60">{t('shop.catalog.eyebrow')}</p><h2 id="shop-catalog-heading" className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">{t(selectedCategory.labelKey)}</h2><p className="mt-1 text-xs text-slate-400">{t('shop.catalog.itemCount', { count: selectedCategory.items.length })}</p></div>
          <button type="button" onClick={() => setActiveCategory('inventory')} aria-pressed={activeCategory === 'inventory'} aria-controls="shop-product-grid" className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-xs font-black transition-all ${activeCategory === 'inventory' ? 'border-teal-300/35 bg-teal-400/15 text-teal-100 shadow-[0_8px_24px_rgba(20,184,166,.14)]' : 'border-teal-200/20 bg-teal-300/[.06] text-teal-100/90 hover:border-teal-200/35 hover:bg-teal-300/10'}`}><PackageOpen className="size-4" aria-hidden="true"/>{t('shop.category.inventory')}<span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] tabular-nums">{chestInventory.length}</span></button>
        </div>

        <div role="group" aria-label={t('shop.category.label')} className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(({ id, labelKey, icon: Icon, items }) => <button key={id} type="button" onClick={() => setActiveCategory(id)} aria-pressed={activeCategory === id} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-xs font-bold transition-all ${activeCategory === id ? 'border-teal-300/30 bg-teal-400/10 text-teal-100 shadow-[0_8px_24px_rgba(20,184,166,.1)]' : 'border-white/10 bg-slate-900/35 text-slate-300 hover:border-white/20 hover:bg-white/[.06]'}`}><Icon className="size-4" aria-hidden="true"/>{t(labelKey)}<span className={`rounded-full px-1.5 py-0.5 text-[9px] tabular-nums ${activeCategory === id ? 'bg-teal-200/10 text-teal-100' : 'bg-white/5 text-slate-400'}`}>{items.length}</span></button>)}
        </div>

        <div id="shop-product-grid" aria-live="polite" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {activeCategory === 'inventory' ? (chestInventory.length > 0 ? chestInventory.map((chest) => {
            const item = CHESTS.find((candidate) => candidate.id === chest.chestId)
            return item ? <ChestInventoryCard key={chest.uid} item={item} onOpen={() => openChest(chest)} t={t}/> : null
          }) : <div className="col-span-full rounded-2xl border border-dashed border-white/15 bg-slate-900/30 px-5 py-12 text-center text-sm text-slate-400">{t('shop.inventory.empty')}</div>) : selectedCategory.items.map((item) => <ProductCard key={item.id} item={item} wallet={wallet} currentTier={currentTier} purchasedIds={purchasedIds} onPurchase={purchase} t={t}/>)}
        </div>
      </section>
    </div>

    {chestReveal && typeof document !== 'undefined' && createPortal(
      <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm" onClick={() => setChestReveal(null)}>
        <section role="dialog" aria-modal="true" aria-labelledby="shop-chest-reveal-title" onClick={(event) => event.stopPropagation()} className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-teal-200/25 bg-[radial-gradient(ellipse_at_50%_0%,rgba(45,212,191,.2),transparent_55%),linear-gradient(145deg,#172337,#0f172a)] p-6 text-center text-white shadow-[0_30px_100px_rgba(0,0,0,.6)] sm:p-8">
          <button type="button" aria-label={t('shop.chest.close')} onClick={() => setChestReveal(null)} className="absolute right-3 top-3 grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"><X className="size-5" aria-hidden="true"/></button>
          <p className="text-[10px] font-black uppercase tracking-[.2em] text-teal-200">{t('shop.chest.openedTitle')}</p>
          <div className="mx-auto mt-5 grid size-40 place-items-center rounded-full border border-teal-200/15 bg-teal-300/[.06] shadow-[0_0_55px_rgba(45,212,191,.12)]">
            <img src={chestReveal.item.image} alt="" style={chestReveal.item.imageStyle} className="size-32 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,.5)] motion-safe:animate-bounce"/>
          </div>
          <h2 id="shop-chest-reveal-title" className="mt-4 text-xl font-black sm:text-2xl">{t(chestReveal.item.nameKey)}</h2>
          <p className="mt-5 text-xs font-bold uppercase tracking-[.16em] text-slate-300">{t('shop.chest.rewardLabel')}</p>
          <div className="mx-auto mt-2 inline-flex items-center gap-2 rounded-2xl border border-teal-200/20 bg-teal-300/10 px-5 py-3 text-2xl font-black text-teal-100 shadow-[0_12px_32px_rgba(20,184,166,.12)]">
            <span>+</span><span>{chestReveal.reward.amount.toLocaleString()}</span><CurrencyIcon currency={chestReveal.reward.currency} className="size-10"/><span className="sr-only">{t(chestReveal.reward.currency === 'gold' ? 'shop.wallet.gold' : 'shop.wallet.gems')}</span>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-400">{t('shop.chest.sessionNote')}</p>
          <button type="button" onClick={() => setChestReveal(null)} className="mt-6 min-h-12 w-full rounded-xl border border-teal-200/25 border-b-4 border-b-teal-800 bg-gradient-to-b from-teal-300 to-cyan-400 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-teal-950/25 transition hover:brightness-110">{t('shop.chest.close')}</button>
        </section>
      </div>,
      document.body,
    )}

    {toast && <div key={toast.id} role="status" aria-live="polite" className={`shop-toast-pop fixed bottom-5 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border border-b-4 p-4 shadow-xl ${toast.kind === 'warning' ? 'border-amber-200/40 border-b-amber-700 bg-gradient-to-r from-amber-300 to-yellow-300 text-amber-950 shadow-amber-950/20' : 'border-emerald-200/30 border-b-emerald-800 bg-gradient-to-r from-emerald-500 to-teal-400 text-emerald-950 shadow-[0_14px_40px_rgba(16,185,129,.35)]'}`}>
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/20">{toast.kind === 'warning' ? <LockKeyhole className="size-5" aria-hidden="true"/> : <Check className="size-5" aria-hidden="true"/>}</span><span className="min-w-0 flex-1"><span className="block text-sm font-black">{toast.message}</span><span className={`mt-0.5 block text-[10px] font-semibold ${toast.kind === 'warning' ? 'text-amber-950/75' : 'text-emerald-950/75'}`}>{toast.note}</span></span><Sparkles className={`size-5 shrink-0 ${toast.kind === 'warning' ? 'text-amber-800/70' : 'animate-pulse text-yellow-100'}`} aria-hidden="true"/>
    </div>}
  </section>
}
