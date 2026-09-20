import type { Product } from '@/lib/db/repos/products'
import { makersFor, deliveredPrice, type ReserveGroup, type SourcedItem } from '@/lib/sourcing'
import type { DoorKind } from '@/components/shop/DoorEtchings'

/**
 * The doors of the shop. The shop page shows the doors; each door has its
 * own page with one list, cheapest to dearest: what is on the shelf, what
 * is made to order, and what I go and find, side by side. Which stocked
 * products belong behind which door is decided here, first match wins in
 * door order. Prices and stock flags are read live, never typed here.
 */
export interface DoorInfo {
  key: string
  etch: DoorKind
  name: string
  line: string
  /** A longer line for the top of the door's own page. */
  about: string
  /** Where the rest of this door lives, when part of it is sold elsewhere. */
  elsewhere?: { label: string; href: string }
}

export interface Door extends DoorInfo {
  /** Which stocked products belong here. */
  pick: (p: Product) => boolean
  /** Which reserve categories pour their makers into this door. */
  reserve: ReserveGroup[]
}

export const SHELF_KEY = 'shelf'

export const SHELF: DoorInfo = {
  key: SHELF_KEY,
  etch: 'shelf',
  name: 'On the shelf',
  line: 'Stocked here. Your words or a design on it, at your door in a day or two.',
  about: 'Everything on this page is on a shelf in Centennial right now. Pick it, tell me the words or the design, and it is marked and at your door in a day or two. Plain is fine too.',
}

export const DOORS: Door[] = [
  {
    key: 'knives',
    etch: 'knives',
    name: 'Knives and gear',
    line: 'From a blade I stock to the one I go and find.',
    about: 'A survival knife I keep in hand, then the chef’s knives, pocket knives, and multitools I go and find at their price. Initials at the heel, a date on the scale, a name along the spine.',
    pick: p => /knife|blade|multitool/i.test(p.name),
    reserve: ['chef-knife', 'pocket-knife', 'multitool'],
  },
  {
    key: 'table',
    etch: 'table',
    name: 'The kitchen and the table',
    line: 'Boards, coasters, iron. The things a family uses every Sunday.',
    about: 'Coasters in pine, slate, and stainless, a bamboo board, and the boards and skillets I go and find. A family name, a date, a recipe title, a design from the library.',
    pick: p => (p.categoryId === 'cat_coasters' && p.packSize < 10) || /board|skillet/i.test(p.name),
    reserve: ['skillet', 'board'],
  },
  {
    key: 'drink',
    etch: 'drink',
    name: 'Tumblers, bottles, and coolers',
    line: 'Powder coat lifts to bright steel. A name on the front, a date on the back.',
    about: 'The tumblers, bottles, cups, and coolers I go and find, marked through the coat to bright steel. A name on the front, a date on the back, the crew on the lid. Have one already? Bring it.',
    pick: p => p.categoryId === 'cat_tumblers' || /tumbler|bottle|flask|cup\b/i.test(p.name),
    reserve: ['cooler'],
  },
  {
    key: 'carry',
    etch: 'carry',
    name: 'Carried daily',
    line: 'Keychains, tags, wallets, pens. The small thing that is on you for years.',
    about: 'The keychain, the pet tag, the AirTag tag, the wallet card, the pen. Small, stocked, and out the door fast. Then the wallets and pens I go and find.',
    pick: p => p.categoryId === 'cat_keychains' || (/pet tag|wallet|pen\b|airtag/i.test(p.name) && p.packSize === 1),
    reserve: ['wallet', 'pen'],
  },
  {
    key: 'walls',
    etch: 'walls',
    name: 'Walls, gifts, and the odd project',
    line: 'Signs, panel art, a photo burned into wood, the piece nobody else will take.',
    about: 'Signs cut from stocked wood, panel art from the library or your own drawing, a photograph burned into the grain, a mini mailbox, a decal. The odd project is welcome here.',
    pick: p => p.categoryId === 'cat_decor' || p.categoryId === 'cat_gifts',
    reserve: [],
  },
  {
    key: 'business',
    etch: 'business',
    name: 'For the business',
    line: 'Pens by the pack here. Cards, labels, and coasters by the run on the services page.',
    about: 'Pens by the pack, one logo across the run. Priced by the run, and the tier holds between reorders. A standing account if it is regular.',
    elsewhere: { label: 'Cards, labels, and coasters by the pack are priced on the services page.', href: '/services' },
    pick: p => p.packSize > 1 || p.categoryId === 'cat_labels_tags' || p.categoryId === 'cat_metal_cards' || p.categoryId === 'cat_pens',
    reserve: [],
  },
]

const REST: DoorInfo = { key: 'more', etch: 'more', name: 'And the rest', line: 'Everything else I make.', about: 'Everything else I make, in one place.' }

export type Tile =
  | { kind: 'product'; p: Product; heroUrl: string | null; cents: number }
  | { kind: 'reserve'; it: SourcedItem; group: ReserveGroup; cents: number }

export interface Section {
  door: DoorInfo
  tiles: Tile[]
}

export function doorFor(key: string): DoorInfo | null {
  if (key === SHELF_KEY) return SHELF
  if (key === REST.key) return REST
  return DOORS.find(d => d.key === key) ?? null
}

/**
 * Sort every stocked product and reserve maker behind its door. Anything
 * no door claims is shelved under "And the rest", never hidden. The shelf
 * is every product with the made-to-order flag off, whichever door it
 * lives behind.
 */
export function buildShop(products: Product[], urlFor: (p: Product) => string | null): { shelf: Section; doors: Section[] } {
  const taken = new Set<string>()
  const product = (p: Product): Tile => ({ kind: 'product', p, heroUrl: urlFor(p), cents: p.priceCents })
  const byPrice = (a: Tile, b: Tile) => a.cents - b.cents

  const doors: Section[] = DOORS.map(d => {
    const tiles: Tile[] = []
    for (const p of products) {
      if (taken.has(p.id) || !d.pick(p)) continue
      taken.add(p.id)
      tiles.push(product(p))
    }
    for (const g of d.reserve) for (const it of makersFor(g)) tiles.push({ kind: 'reserve', it, group: g, cents: deliveredPrice(it) * 100 })
    tiles.sort(byPrice)
    return { door: d, tiles }
  }).filter(s => s.tiles.length > 0)

  const rest = products.filter(p => !taken.has(p.id))
  if (rest.length) doors.push({ door: REST, tiles: rest.map(product).sort(byPrice) })

  const shelf: Section = { door: SHELF, tiles: products.filter(p => !p.madeToOrder).map(product).sort(byPrice) }
  return { shelf, doors }
}

export const usd = (cents: number) => {
  const n = cents / 100
  return n % 1 === 0 ? `$${n.toLocaleString('en-US')}` : `$${n.toFixed(2)}`
}

export function rangeOf(tiles: Tile[]): string {
  if (tiles.length === 0) return ''
  const lo = usd(tiles[0].cents)
  const hi = usd(tiles[tiles.length - 1].cents)
  return lo === hi ? lo : `${lo} to ${hi}`
}
