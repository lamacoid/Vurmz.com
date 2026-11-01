import Image from 'next/image'
import Link from 'next/link'
import { RESERVE_CATEGORIES, rangeFor, makersFor, type ReserveCategory } from '@/lib/sourcing'

const usd = (n: number) => `$${n.toLocaleString('en-US')}`
const display = { fontFamily: 'var(--font-display), Georgia, serif' }

/**
 * The reserve, by kind of thing. A plain grid of cards on the paper:
 * the photograph, the label, the one line, what it comes to. Each card
 * is an ordinary link to the category page.
 */
export default function ReserveList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {RESERVE_CATEGORIES.map(c => <CategoryCard key={c.key} cat={c} />)}
    </div>
  )
}

export function CategoryCard({ cat, compact = false }: { cat: ReserveCategory; compact?: boolean }) {
  const range = rangeFor(cat.key)
  const n = makersFor(cat.key).length
  return (
    <Link
      href={`/shop/reserve/${cat.key}`}
      className="group block rounded-[var(--r-panel)] border border-[var(--hairline)] bg-[var(--surface)] hover:border-[var(--feature)]/40 overflow-hidden transition-colors duration-[var(--t-hover)]"
    >
      {cat.photo && (
        <div className={`relative ${compact ? 'aspect-[16/9]' : 'aspect-[4/3]'} overflow-hidden`}>
          <Image
            src={cat.photo.src}
            alt={cat.label}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        </div>
      )}
      <div className={`border-t border-[var(--hairline)] ${compact ? 'p-3' : 'p-4 sm:p-5'}`}>
        <p className={`${compact ? 'text-[length:var(--step-body)]' : 'text-[length:var(--step-panel)]'} leading-tight text-[var(--ink)]`} style={display}>{cat.label}</p>
        {!compact && <p className="mt-1.5 text-[length:var(--step-row)] leading-snug text-[var(--ink-soft)]">{cat.line}</p>}
        <p className="mt-2.5 flex items-baseline justify-between gap-3 text-[length:var(--step-fine)]">
          <span className="text-[var(--ink-soft)]">{n === 1 ? 'One maker' : `${n} makers`}</span>
          {range && (
            <span className="tabular-nums text-[var(--ink)]">
              {range.low === range.high ? usd(range.low) : `${usd(range.low)} to ${usd(range.high)}`}
            </span>
          )}
        </p>
      </div>
    </Link>
  )
}
