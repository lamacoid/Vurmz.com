import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/db/repos/products'
import { menuCase } from '@/lib/menu-format'
import { deliveredPrice, type ReserveGroup, type SourcedItem } from '@/lib/sourcing'
import { DoorLink } from '@/components/BackRoomDoor'
import { ReserveMark } from '@/components/shop/ReserveMarks'
import { usd, type Tile } from '@/lib/shop-doors'

/**
 * The tiles behind a door. A stocked or made piece goes to its product
 * page and the cart; a found piece walks through the teal into the
 * reserve with that maker already picked. Every tile says which it is.
 */
const display = { fontFamily: 'var(--font-display), Georgia, serif' }
const card = 'group relative flex flex-col rounded-[var(--r-panel)] border border-white/12 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#7FCFD4]/50 backdrop-blur-md overflow-hidden transition-colors duration-[var(--t-hover)]'
const badge = 'absolute left-2.5 top-2.5 text-[9px] font-mono uppercase tracking-[0.15em] text-[#7FCFD4] border border-[#7FCFD4]/50 bg-[#0D2F35]/70 rounded-sm px-1.5 py-px'

/** The foot of a tile: how many, and whether it is here or made for you. */
function whenLine(p: Product): string {
  const pack = p.packSize > 1 ? `pack of ${p.packSize} · ` : ''
  if (!p.madeToOrder) return `${pack}${p.oneOff ? 'in hand' : 'a day or two'}`
  return `${pack}made to order`
}

export function TileGrid({ tiles }: { tiles: Tile[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {tiles.map(t => t.kind === 'product' ? <ProductTile key={t.p.id} p={t.p} heroUrl={t.heroUrl} /> : <ReserveTile key={t.it.slug} it={t.it} group={t.group} />)}
    </div>
  )
}

export function ProductTile({ p, heroUrl }: { p: Product; heroUrl: string | null }) {
  return (
    <Link href={`/shop/p/${p.slug}`} className={card}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {heroUrl ? (
          <>
            <Image src={heroUrl} alt={p.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-[#123F47]/30 group-hover:bg-[#123F47]/15 transition-colors duration-500" aria-hidden />
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center px-4 text-center bg-[#0D2F35]/50">
            <span className="text-[length:var(--step-body)] leading-tight text-[#F3EEE2] group-hover:text-white transition-colors" style={display}>{p.name}</span>
          </div>
        )}
        {p.oneOff ? (
          <span className={badge}>1 of 1</span>
        ) : !p.madeToOrder ? (
          <span className={badge}>On the shelf</span>
        ) : null}
      </div>
      <div className="flex-1 flex flex-col p-3 sm:p-3.5 border-t border-white/10">
        <p className={`text-[length:var(--step-row)] font-semibold leading-snug text-[#F3EEE2] group-hover:text-white ${heroUrl ? '' : 'sr-only'}`}>{p.name}</p>
        {p.shortDescription && <p className={`text-[11px] leading-snug text-[#DED6C3]/60 line-clamp-2 ${heroUrl ? 'mt-1' : ''}`}>{menuCase(p.shortDescription)}</p>}
        <p className="mt-auto pt-2 flex items-baseline justify-between gap-2 text-[length:var(--step-fine)]">
          <span className="text-[#DED6C3]/50">{whenLine(p)}</span>
          <span className="tabular-nums text-[#F3EEE2] text-[length:var(--step-row)]">{usd(p.priceCents)}</span>
        </p>
      </div>
    </Link>
  )
}

export function ReserveTile({ it, group }: { it: SourcedItem; group: ReserveGroup }) {
  return (
    <DoorLink href={`/shop/reserve/${group}?maker=${it.slug}`} className={card}>
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0D2F35]/50 flex items-center justify-center">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(127,207,212,0.16) 0%, transparent 60%)' }} aria-hidden />
        <ReserveMark kind={group} className="relative w-[58%] max-w-[200px] text-[#DED6C3]/75 group-hover:text-[#7FCFD4] transition-[color,transform] duration-500 ease-out group-hover:-translate-y-1" />
        <span className={badge}>Found for you</span>
      </div>
      <div className="flex-1 flex flex-col p-3 sm:p-3.5 border-t border-white/10">
        <p className="text-[length:var(--step-row)] font-semibold leading-snug text-[#F3EEE2] group-hover:text-white">{it.name}</p>
        <p className="mt-1 text-[11px] leading-snug text-[#DED6C3]/60 line-clamp-2">{it.material}. {/^ordered/i.test(it.where) ? 'Ordered in.' : 'In hand within the week.'}</p>
        <p className="mt-auto pt-2 flex items-baseline justify-between gap-2 text-[length:var(--step-fine)]">
          <span className="text-[#DED6C3]/50">delivered</span>
          <span className="tabular-nums text-[#F3EEE2] text-[length:var(--step-row)]">{usd(deliveredPrice(it) * 100)}</span>
        </p>
      </div>
    </DoorLink>
  )
}
