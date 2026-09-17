'use client'
import Image from 'next/image'
import { reserveByGroup, deliveredPrice, type SourcedItem } from '@/lib/sourcing'
import { DoorLink } from '@/components/BackRoomDoor'

const usd = (n: number) => `$${n.toLocaleString('en-US')}`
const display = { fontFamily: 'var(--font-display), Georgia, serif' }

/**
 * The reserve, shelved: knives, the kitchen, carried daily, out of doors.
 * Each piece is a card with the maker's photo on a pale plate, the maker,
 * the name, the delivered price, and one line. Every card walks through
 * the teal door into the piece's own page.
 */
export default function ReserveList() {
  const shelves = reserveByGroup()
  return (
    <div className="space-y-12">
      {shelves.map(({ group, items }) => (
        <section key={group.key}>
          <div className="mb-4 max-w-[60ch]">
            <h2 className="text-[length:var(--step-panel)] leading-tight text-white/95" style={display}>{group.label}</h2>
            <p className="mt-1.5 text-[length:var(--step-row)] leading-relaxed text-[#DED6C3]/70">{group.line}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {items.map(it => <PieceCard key={it.slug} item={it} />)}
          </div>
        </section>
      ))}
    </div>
  )
}

export function PieceCard({ item, compact = false }: { item: SourcedItem; compact?: boolean }) {
  return (
    <DoorLink
      href={`/shop/reserve/${item.slug}`}
      className="group block rounded-[var(--r-panel)] border border-white/12 bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md overflow-hidden transition-colors duration-[var(--t-hover)]"
    >
      <PiecePlate item={item} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px" />
      <div className={compact ? 'p-3' : 'p-3.5 sm:p-4'}>
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#7FCFD4]/80">{item.maker}</p>
        <p className="mt-0.5 text-[length:var(--step-body)] font-semibold leading-snug text-[#F3EEE2] group-hover:text-white">{item.name}</p>
        <p className="mt-1.5 flex items-baseline justify-between gap-2 text-[length:var(--step-fine)] text-[#DED6C3]/65">
          <span className="truncate">{item.material}</span>
          <span className="tabular-nums whitespace-nowrap text-[#F3EEE2]">{usd(deliveredPrice(item))}</span>
        </p>
      </div>
    </DoorLink>
  )
}

/** The pale plate the maker's photo sits on. Typeset when there is no photo yet. */
export function PiecePlate({ item, sizes, priority = false, className = '' }: { item: SourcedItem; sizes: string; priority?: boolean; className?: string }) {
  return (
    <div className={`relative aspect-[4/3] overflow-hidden bg-white ${className}`}>
      {item.photo ? (
        <Image
          src={item.photo}
          alt={item.name}
          fill
          priority={priority}
          sizes={sizes}
          className="object-contain p-4 sm:p-5 transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center px-4 text-center">
          <span className="text-[#16525C] text-[length:var(--step-body)] leading-tight" style={display}>{item.name}</span>
        </div>
      )}
      {/* A soft vignette so the white reads as a lit plate, not a hole in the teal. */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0) 55%, rgba(22,82,92,0.10) 100%)' }} aria-hidden />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[0.06]" aria-hidden />
    </div>
  )
}
