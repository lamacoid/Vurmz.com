import Link from 'next/link'
import { SOURCING } from '@/lib/pricing'
import { DOORS, SHELF, rangeOf, type Section } from '@/lib/shop-doors'
import { loadShop } from '@/components/shop/ShopDoors'
import { TileGrid } from '@/components/shop/ShopTiles'
import { DoorEtching } from '@/components/shop/DoorEtchings'
import EtchArt from '@/components/shop/EtchArt'

/**
 * One door, open. The etching, the name, the longer line, the count and
 * the range, then every piece behind it cheapest to dearest. The other
 * doors wait at the bottom.
 */
const display = { fontFamily: 'var(--font-display), Georgia, serif' }

export async function sectionFor(key: string, houseSlug: string): Promise<Section | null> {
  const { shelf, doors } = await loadShop(houseSlug)
  if (key === SHELF.key) return shelf
  return doors.find(s => s.door.key === key) ?? null
}

export default function DoorPage({ section: { door, tiles } }: { section: Section }) {
  const others = [SHELF, ...DOORS].filter(d => d.key !== door.key)
  const found = tiles.some(t => t.kind === 'reserve')
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-14">
      <Link href="/shop" className="text-[length:var(--step-fine)] font-mono tracking-[0.18em] uppercase text-[var(--feature)] hover:text-[var(--ink)] transition-colors">
        All categories
      </Link>

      <header className="mt-6 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_260px] gap-6 md:gap-10 items-center">
        <div>
          <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] leading-[1.05] text-[var(--ink)]" style={display}>{door.name}</h1>
          <p className="mt-3 max-w-[58ch] text-[length:var(--step-body)] leading-relaxed text-[var(--ink-soft)]">{door.about}</p>
          {door.elsewhere && (
            <p className="mt-2 max-w-[58ch] text-[length:var(--step-row)] leading-relaxed">
              <Link href={door.elsewhere.href} className="text-[var(--feature)] hover:text-[var(--ink)] transition-colors">{door.elsewhere.label}</Link>
            </p>
          )}
          <p className="mt-4 text-[length:var(--step-fine)] font-mono tracking-[0.06em] text-[var(--ink-soft)] tabular-nums">
            {tiles.length === 1 ? 'One piece' : `${tiles.length} pieces`} · {rangeOf(tiles)}
          </p>
        </div>
        <div className="hidden md:flex items-center justify-center rounded-[var(--r-panel)] border border-[var(--hairline)] bg-[var(--surface)] aspect-[4/3]">
          {door.art ? <EtchArt src={door.art} className="w-[72%] aspect-[4/3]" /> : <DoorEtching kind={door.etch} className="w-[70%] text-[var(--ink-soft)]" />}
        </div>
      </header>

      <div className="mt-8 sm:mt-10">
        <TileGrid tiles={tiles} />
      </div>

      {found && (
        <p className="mt-10 text-[length:var(--step-row)] text-[var(--ink-soft)] max-w-[70ch]">
          Anything marked <span className="text-[var(--feature)]">found for you</span> is a piece I go and buy at its price, plus ${SOURCING.reserveFee} to find it, mark it, and bring it.
          Not on the list? Tell me what you are looking for and I will source it.{' '}
          <Link href="/shop/reserve" className="text-[var(--feature)] hover:text-[var(--ink)] transition-colors">The reserve, in full.</Link>
        </p>
      )}

      <nav aria-label="Other categories" className="mt-14 pt-6 border-t border-[var(--hairline)]">
        <p className="text-[length:var(--step-fine)] font-mono tracking-[0.18em] uppercase text-[var(--ink-soft)] mb-3">Other categories</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 list-none p-0 m-0">
          {others.map(d => (
            <li key={d.key}>
              <Link href={`/shop/${d.key}`} className="text-[length:var(--step-row)] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">{d.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
