import Link from 'next/link'
import { listProducts, type Product } from '@/lib/db/repos/products'
import { getMediaByIds } from '@/lib/db/repos/media'
import { buildShop, rangeOf, type Section } from '@/lib/shop-doors'
import { DoorEtching } from '@/components/shop/DoorEtchings'

/**
 * The shop page: the doors, and only the doors. Each is an etching of the
 * thing on the glass, the one line, how many pieces wait behind it, and
 * what they come to. The shelf goes first and wide: what is here today.
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
      className={`group relative rounded-[var(--r-panel)] border border-white/12 bg-white/[0.04] hover:bg-white/[0.07] hover:border-[#7FCFD4]/50 backdrop-blur-md overflow-hidden transition-colors duration-[var(--t-hover)] ${wide ? 'sm:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]' : 'flex flex-col'}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className={`relative flex items-center justify-center overflow-hidden ${wide ? 'aspect-[16/9] md:aspect-auto md:min-h-[220px]' : 'aspect-[4/3]'}`}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(127,207,212,0.16) 0%, transparent 60%)' }} aria-hidden />
        <DoorEtching kind={door.etch} className="relative w-[64%] max-w-[260px] text-[#DED6C3]/85 group-hover:text-[#7FCFD4] transition-[color,transform] duration-500 ease-out group-hover:-translate-y-1" />
      </div>
      <div className={`border-t border-white/10 ${wide ? 'md:border-t-0 md:border-l p-5 sm:p-7 flex flex-col justify-center' : 'p-4 sm:p-5'}`}>
        <p className={`${wide ? 'text-[length:var(--step-section)]' : 'text-[length:var(--step-panel)]'} leading-tight text-white/95`} style={display}>{door.name}</p>
        <p className="mt-1.5 text-[length:var(--step-row)] leading-snug text-[#DED6C3]/75">{wide ? door.about : door.line}</p>
        <p className="mt-3 flex items-baseline justify-between gap-3 text-[length:var(--step-fine)]">
          <span className="text-[#DED6C3]/55">{n === 1 ? 'One piece' : `${n} pieces`}</span>
          <span className="tabular-nums text-[#F3EEE2]">{rangeOf(tiles)}</span>
        </p>
      </div>
    </Link>
  )
}
