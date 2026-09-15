import { RESERVE, deliveredPrice } from '@/lib/sourcing'

/**
 * The reserve list as a typeset menu on glass: name, dotted leader, the
 * delivered price. Light ink for the teal room. Numbers from lib/sourcing.
 */
export default function ReserveList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
      {RESERVE.map((it, i) => (
        <div
          key={it.name}
          className={`py-3 border-b border-[#DED6C3]/15 ${i >= RESERVE.length - 2 ? 'sm:border-b-0' : ''}`}
        >
          <span className="flex items-baseline gap-2.5">
            <span className="text-[length:var(--step-body)] font-semibold leading-snug text-[#F3EEE2]">{it.name}</span>
            <span className="flex-1 -translate-y-[3px] border-b border-dotted border-[#DED6C3]/30 min-w-[1.5rem]" aria-hidden />
            <span className="text-[length:var(--step-body)] font-medium tabular-nums whitespace-nowrap text-[#F3EEE2]">${deliveredPrice(it)}</span>
          </span>
          <span className="block text-[length:var(--step-fine)] text-[#DED6C3]/65 mt-0.5">
            {it.material}{/^ordered/i.test(it.where) ? `. ${it.where}` : ''}.
          </span>
        </div>
      ))}
    </div>
  )
}
