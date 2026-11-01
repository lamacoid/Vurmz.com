import Image from 'next/image'
import Link from 'next/link'
import { listProducts, type Product } from '@/lib/db/repos/products'
import { getMediaByIds } from '@/lib/db/repos/media'
import { buildShop, rangeOf, type Section } from '@/lib/shop-doors'

/**
 * The shop page: the doors, and only the doors. Each is a photograph of
 * the thing, the one line, how many pieces wait behind it, and what they
 * come to. The shelf goes first and wide: what is here today.
 */
const display = { fontFamily: 'var(--font-display), Georgia, serif' }

export async function loadShop(houseSlug: string) {
  const products = (await listProducts({ audience: 'shop_visible', limit: 200 }).catch(() => [])).filter(p => p.slug !== houseSlug)
  const media = await getMediaByIds(products.map(p => p.heroMediaId).filter((x): x is string => !!x)).catch(() => new Map())
  const urlFor = (p: Product) => (p.heroMediaId ? media.get(p.heroMediaId)?.url ?? null : null)
  return buildShop(products, urlFor)
}

export default async function ShopDoors({ houseSlug }: { houseSlug: string }) {
  const { shelf, doors } = await loadShop(houseSlug)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {shelf.tiles.length > 0 && <DoorCard section={shelf} wide />}
      {doors.map((s, i) => <DoorCard key={s.door.key} section={s} index={i + 1} />)}
    </div>
  )
}

function DoorCard({ section: { door, tiles }, wide = false, index = 0 }: { section: Section; wide?: boolean; index?: number }) {
  const n = tiles.length
  return (
    <Link
      href={`/shop/${door.key}`}
      className={`group relative rounded-[var(--r-panel)] border border-[var(--hairline)] bg-[var(--surface)] hover:bg-[var(--glass-soft)] hover:border-[var(--feature)]/40 overflow-hidden transition-colors duration-[var(--t-hover)] ${wide ? 'sm:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]' : 'flex flex-col'}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className={`relative overflow-hidden ${wide ? 'aspect-[16/9] md:aspect-auto md:min-h-[220px]' : 'aspect-[4/3]'}`}>
        <Image
          src={door.photo}
          alt={door.name}
          fill
          sizes={wide ? '(max-width: 768px) 100vw, 640px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className={`border-t border-[var(--hairline)] ${wide ? 'md:border-t-0 md:border-l p-5 sm:p-7 flex flex-col justify-center' : 'p-4 sm:p-5'}`}>
        <p className={`${wide ? 'text-[length:var(--step-section)]' : 'text-[length:var(--step-panel)]'} leading-tight text-[var(--ink)]`} style={display}>{door.name}</p>
        <p className="mt-1.5 text-[length:var(--step-row)] leading-snug text-[var(--ink-soft)]">{wide ? door.about : door.line}</p>
        <p className="mt-3 flex items-baseline justify-between gap-3 text-[length:var(--step-fine)]">
          <span className="text-[var(--ink-soft)]">{n === 1 ? 'One piece' : `${n} pieces`}</span>
          <span className="tabular-nums text-[var(--ink)]">{rangeOf(tiles)}</span>
        </p>
      </div>
    </Link>
  )
}
