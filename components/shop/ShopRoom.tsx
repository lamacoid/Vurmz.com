import Image from 'next/image'
import Link from 'next/link'
import { listProducts, type Product } from '@/lib/db/repos/products'
import { getMediaByIds } from '@/lib/db/repos/media'
import { menuCase } from '@/lib/menu-format'
import { makersFor, deliveredPrice, type ReserveGroup, type SourcedItem } from '@/lib/sourcing'
import { DoorLink } from '@/components/BackRoomDoor'
import { ReserveMark } from '@/components/shop/ReserveMarks'

/**
 * The shop, as one room. Every door holds one list, cheapest to dearest:
 * what I stock beside what I go and find. A $55 survival knife sits three
 * tiles from a Sebenza. Stocked pieces go to their product page and the
 * cart; found pieces walk through the teal into the reserve with that
 * maker already picked. Prices are read live, never typed here.
 */
interface Door {
  key: string
  name: string
  line: string
  /** Which stocked products belong here. First match wins, in door order. */
  pick: (p: Product) => boolean
  /** Which reserve categories pour their makers into this door. */
  reserve: ReserveGroup[]
}

const DOORS: Door[] = [
  {
    key: 'knives',
    name: 'Knives and gear',
    line: 'From a blade I stock to the one I go and find. Initials at the heel, a date on the scale.',
    pick: p => /knife|blade|multitool/i.test(p.name),
    reserve: ['chef-knife', 'pocket-knife', 'multitool'],
  },
  {
    key: 'table',
    name: 'The kitchen and the table',
    line: 'Boards, coasters, iron. The things a family uses every Sunday.',
    pick: p => (p.categoryId === 'cat_coasters' && p.packSize < 10) || /board|skillet/i.test(p.name),
    reserve: ['skillet', 'board'],
  },
  {
    key: 'carry',
    name: 'Carried daily',
    line: 'Keychains, tags, wallets, pens. The small thing that is on you for years.',
    pick: p => p.categoryId === 'cat_keychains' || /pet tag|wallet|pen\b/i.test(p.name) && p.packSize === 1,
    reserve: ['wallet', 'pen', 'cooler'],
  },
  {
    key: 'walls',
    name: 'Walls, gifts, and the odd project',
    line: 'Signs, panel art, a photo burned into wood, the mailbox, the piece nobody else will take.',
    pick: p => p.categoryId === 'cat_decor' || p.categoryId === 'cat_gifts',
    reserve: [],
  },
  {
    key: 'business',
    name: 'For the business',
    line: 'Pens, cards, labels, coasters by the pack. Priced by the run; the tier holds between reorders.',
    pick: p => p.packSize > 1 || p.categoryId === 'cat_labels_tags' || p.categoryId === 'cat_metal_cards' || p.categoryId === 'cat_pens',
    reserve: [],
  },
]

type Tile =
  | { kind: 'product'; p: Product; heroUrl: string | null; cents: number }
  | { kind: 'reserve'; it: SourcedItem; group: ReserveGroup; cents: number }

const usd = (cents: number) => {
  const n = cents / 100
  return n % 1 === 0 ? `$${n.toLocaleString('en-US')}` : `$${n.toFixed(2)}`
}
const display = { fontFamily: 'var(--font-display), Georgia, serif' }

export default async function ShopRoom({ houseSlug }: { houseSlug: string }) {
  const products = (await listProducts({ audience: 'shop_visible', limit: 200 }).catch(() => [])).filter(p => p.slug !== houseSlug)
  const media = await getMediaByIds(products.map(p => p.heroMediaId).filter((x): x is string => !!x)).catch(() => new Map())
  const taken = new Set<string>()

  const sections = DOORS.map(d => {
    const tiles: Tile[] = []
    for (const p of products) {
      if (taken.has(p.id) || !d.pick(p)) continue
      taken.add(p.id)
      tiles.push({ kind: 'product', p, heroUrl: p.heroMediaId ? media.get(p.heroMediaId)?.url ?? null : null, cents: p.priceCents })
    }
    for (const g of d.reserve) for (const it of makersFor(g)) tiles.push({ kind: 'reserve', it, group: g, cents: deliveredPrice(it) * 100 })
    tiles.sort((a, b) => a.cents - b.cents)
    return { door: d, tiles }
  }).filter(s => s.tiles.length > 0)

  // Anything the doors did not claim still gets shelved, never hidden.
  const rest = products.filter(p => !taken.has(p.id))
  if (rest.length) sections.push({ door: { key: 'more', name: 'And the rest', line: 'Everything else I make.', pick: () => true, reserve: [] }, tiles: rest.map(p => ({ kind: 'product' as const, p, heroUrl: p.heroMediaId ? media.get(p.heroMediaId)?.url ?? null : null, cents: p.priceCents })).sort((a, b) => a.cents - b.cents) })

  return (
    <div className="space-y-14">
      {sections.map(({ door, tiles }) => (
        <section key={door.key} id={door.key} className="scroll-mt-28">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 mb-5">
            <div className="max-w-[60ch]">
              <h2 className="text-[length:var(--step-panel)] sm:text-[length:var(--step-section)] leading-tight text-white/95" style={display}>{door.name}</h2>
              <p className="mt-1.5 text-[length:var(--step-row)] leading-relaxed text-[#DED6C3]/72">{door.line}</p>
            </div>
            <p className="text-[length:var(--step-fine)] font-mono tracking-[0.06em] text-[#DED6C3]/55 tabular-nums">
              {usd(tiles[0].cents)} to {usd(tiles[tiles.length - 1].cents)}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {tiles.map(t => t.kind === 'product' ? <ProductTile key={t.p.id} p={t.p} heroUrl={t.heroUrl} /> : <ReserveTile key={t.it.slug} it={t.it} group={t.group} />)}
          </div>
        </section>
      ))}
    </div>
  )
}

const card = 'group relative flex flex-col rounded-[var(--r-panel)] border border-white/12 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#7FCFD4]/50 backdrop-blur-md overflow-hidden transition-colors duration-[var(--t-hover)]'

function ProductTile({ p, heroUrl }: { p: Product; heroUrl: string | null }) {
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
        {p.oneOff && (
          <span className="absolute left-2.5 top-2.5 text-[9px] font-mono uppercase tracking-[0.15em] text-[#7FCFD4] border border-[#7FCFD4]/50 bg-[#0D2F35]/70 rounded-sm px-1.5 py-px">1 of 1</span>
        )}
      </div>
      <div className="flex-1 flex flex-col p-3 sm:p-3.5 border-t border-white/10">
        <p className={`text-[length:var(--step-row)] font-semibold leading-snug text-[#F3EEE2] group-hover:text-white ${heroUrl ? '' : 'sr-only'}`}>{p.name}</p>
        {p.shortDescription && <p className={`text-[11px] leading-snug text-[#DED6C3]/60 line-clamp-2 ${heroUrl ? 'mt-1' : ''}`}>{menuCase(p.shortDescription)}</p>}
        <p className="mt-auto pt-2 flex items-baseline justify-between gap-2 text-[length:var(--step-fine)]">
          <span className="text-[#DED6C3]/50">{p.packSize > 1 ? `pack of ${p.packSize}` : 'in the shop'}</span>
          <span className="tabular-nums text-[#F3EEE2] text-[length:var(--step-row)]">{usd(p.priceCents)}</span>
        </p>
      </div>
    </Link>
  )
}

function ReserveTile({ it, group }: { it: SourcedItem; group: ReserveGroup }) {
  return (
    <DoorLink href={`/shop/reserve/${group}?maker=${it.slug}`} className={card}>
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0D2F35]/50 flex items-center justify-center">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(127,207,212,0.16) 0%, transparent 60%)' }} aria-hidden />
        <ReserveMark kind={group} className="relative w-[58%] max-w-[200px] text-[#DED6C3]/75 group-hover:text-[#7FCFD4] transition-[color,transform] duration-500 ease-out group-hover:-translate-y-1" />
        <span className="absolute left-2.5 top-2.5 text-[9px] font-mono uppercase tracking-[0.15em] text-[#7FCFD4] border border-[#7FCFD4]/50 bg-[#0D2F35]/70 rounded-sm px-1.5 py-px">Found for you</span>
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
