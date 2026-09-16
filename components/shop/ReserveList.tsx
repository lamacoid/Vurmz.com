'use client'
import { RESERVE, deliveredPrice } from '@/lib/sourcing'
import { DoorLink } from '@/components/BackRoomDoor'

/**
 * The reserve list as a typeset menu on glass: name, dotted leader, the
 * delivered price. Each line walks through the teal door into the piece's
 * own page. Light ink for the teal room. Numbers from lib/sourcing.
 */
export default function ReserveList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
      {RESERVE.map((it, i) => (
        <DoorLink
          key={it.slug}
          href={`/shop/reserve/${it.slug}`}
          className={`group block py-3 -mx-2 px-2 rounded-md border-b border-[#DED6C3]/15 hover:bg-white/[0.04] transition-colors duration-[var(--t-hover)] ${i >= RESERVE.length - 2 ? 'sm:border-b-0' : ''}`}
        >
          <span className="flex items-baseline gap-2.5">
            <span className="text-[length:var(--step-body)] font-semibold leading-snug text-[#F3EEE2] group-hover:text-white">{it.name}</span>
            <span className="flex-1 -translate-y-[3px] border-b border-dotted border-[#DED6C3]/30 min-w-[1.5rem]" aria-hidden />
            <span className="text-[length:var(--step-body)] font-medium tabular-nums whitespace-nowrap text-[#F3EEE2]">${deliveredPrice(it)}</span>
          </span>
          <span className="flex items-baseline justify-between gap-3 mt-0.5">
            <span className="text-[length:var(--step-fine)] text-[#DED6C3]/65">
              {it.material}{/^ordered/i.test(it.where) ? `. ${it.where}` : ''}.
            </span>
            <span className="text-[length:var(--step-fine)] text-[#7FCFD4] opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--t-hover)] whitespace-nowrap" aria-hidden>
              See the piece
            </span>
          </span>
        </DoorLink>
      ))}
    </div>
  )
}
