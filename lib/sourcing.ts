/**
 * The reserve: pieces I find, mark, and bring. From the 2026-09 market
 * research (vurmz-control/RESEARCH/PRICING-MARKET-2026-09.md). Retail is
 * the maker's list price on the day it was looked up (2026-09-16 for the
 * high-end pieces); the delivered number is that plus one flat fee.
 * Glass is deliberately absent: neither laser marks it.
 *
 * Every piece has a page at /shop/reserve/<slug>. `where` is for me, not
 * the customer, except when it starts with "Ordered in".
 */
import { SOURCING } from './pricing'

export interface SourcedItem {
  slug: string
  name: string
  /** The maker, said plainly. */
  maker: string
  /** How the piece is referred to in a sentence: knife, cup, wallet. */
  noun: string
  material: string
  retail: number
  where: string
  tier: 'thank-you' | 'client'
  /** On the reserve list: the pieces worth the shop's own glass. */
  reserve?: boolean
  /** Which shelf of the room it sits on. */
  group: ReserveGroup
  /** The maker's product photo, when I have one, under /public/reserve. */
  photo?: string
  /** One or two sentences in my voice. What it is and why it takes a mark well. */
  blurb: string
  /** Where the engraving can go, first is the default. */
  placements: string[]
  /** What a mark looks like on this piece. */
  mark: string
  /** A portfolio photo that sets the mood behind the glass. */
  backdrop: string
  /** When it can be in hand. */
  leadTime: string
  /** A sample line, so the preview never starts empty. */
  sample: string
}

export type ReserveGroup = 'knives' | 'kitchen' | 'carry' | 'out'

/** The shelves, in order, each with the line that sells it. */
export const RESERVE_GROUPS: { key: ReserveGroup; label: string; line: string }[] = [
  { key: 'knives', label: 'Knives', line: 'Steel from Seki, Solingen, and Golden. A name near the heel, small, where the hand sees it every day.' },
  { key: 'kitchen', label: 'The kitchen', line: 'Iron and maple that get willed to someone. The family name on the underside, the year on the edge.' },
  { key: 'carry', label: 'Carried daily', line: 'Titanium, brass, leather. Initials and a date, the kind of thing that is found in a pocket forty years on.' },
  { key: 'out', label: 'Out of doors', line: 'Coolers and flasks that go everywhere. The name of the cabin, the boat, the crew.' },
]

const SOON = 'Bought locally, marked, and at your door within the week.'
const ORDERED = 'Ordered in, one to two weeks, then marked and delivered.'

export const SOURCED: SourcedItem[] = [
  {
    slug: 'ridge-wallet-aluminum', photo: '/reserve/ridge-wallet-aluminum.jpg', group: 'carry', noun: 'wallet', name: 'Ridge wallet, aluminum', maker: 'Ridge', material: 'Anodized aluminum', retail: 95,
    where: 'Best Buy Lone Tree, Nordstrom', tier: 'thank-you',
    blurb: 'Two anodized plates and an elastic band. The plates take a clean silver mark where the dye is removed, so initials or a coordinate read like they were machined in.',
    placements: ['Outer plate', 'Inner plate'], mark: 'Bare silver metal through the anodize.', backdrop: '/portfolio/laser-engraved-artwork.jpg', leadTime: SOON, sample: 'J.R.M.',
  },
  {
    slug: 'ridge-wallet-titanium', photo: '/reserve/ridge-wallet-titanium.jpg', group: 'carry', noun: 'wallet', name: 'Ridge wallet, titanium', maker: 'Ridge', material: 'Titanium', retail: 195,
    where: 'Best Buy Lone Tree, Nordstrom', tier: 'client', reserve: true,
    blurb: 'The titanium one. Heavier in the hand, warmer in color, and it marks dark instead of silver, a matte line in the metal that will outlast the cards inside it.',
    placements: ['Outer plate', 'Inner plate'], mark: 'A dark, matte mark annealed into the titanium.', backdrop: '/portfolio/laser-engraved-artwork.jpg', leadTime: SOON, sample: 'J.R.M.',
  },
  {
    slug: 'yeti-rambler-20', photo: '/reserve/yeti-rambler-20.jpg', group: 'out', noun: 'tumbler', name: 'Yeti Rambler, 20 oz', maker: 'Yeti', material: 'Powder-coated stainless', retail: 35,
    where: 'Yeti, Cherry Creek North', tier: 'thank-you',
    blurb: 'The tumbler everyone already trusts. The powder coat lifts clean and the stainless underneath shines through, so a logo or a name reads bright against any color.',
    placements: ['Front', 'Back', 'Full wrap'], mark: 'Coating removed to bright stainless.', backdrop: '/portfolio/tumbler-cherry-creek-37.jpg', leadTime: SOON, sample: 'Margaret',
  },
  {
    slug: 'stanley-quencher-40', photo: '/reserve/stanley-quencher-40.jpg', group: 'out', noun: 'tumbler', name: 'Stanley Quencher, 40 oz', maker: 'Stanley', material: 'Powder-coated stainless', retail: 45,
    where: "Dick's, Park Meadows", tier: 'thank-you',
    blurb: 'The big one with the handle. Same powder coat, same bright mark. Names go on the front, a date or a line on the back.',
    placements: ['Front', 'Back'], mark: 'Coating removed to bright stainless.', backdrop: '/portfolio/tumbler-cherry-creek-37.jpg', leadTime: SOON, sample: 'Margaret',
  },
  {
    slug: 'snow-peak-titanium-cup', photo: '/reserve/snow-peak-titanium-cup.jpg', group: 'out', noun: 'cup', name: 'Snow Peak titanium cup', maker: 'Snow Peak', material: 'Titanium', retail: 30,
    where: 'REI Greenwood Village', tier: 'thank-you', 
    blurb: 'A single-wall titanium cup that weighs nothing and lasts forever. It takes a dark mark that looks like it was born there. The best small gift on this list.',
    placements: ['Side', 'Base'], mark: 'A dark, matte mark annealed into the titanium.', backdrop: '/portfolio/water-bottle-custom-engraved.jpg', leadTime: SOON, sample: 'Ridgeline, 2026',
  },
  {
    slug: 'leatherman-wave-plus', photo: '/reserve/leatherman-wave-plus.jpg', group: 'carry', noun: 'multitool', name: 'Leatherman Wave Plus', maker: 'Leatherman', material: 'Stainless', retail: 130,
    where: "Cabela's Lone Tree", tier: 'client', reserve: true,
    blurb: 'The multitool people carry for twenty years. The handle scales take a small, dark, permanent mark. A name, a company, a date it was earned.',
    placements: ['Handle, outside', 'Handle, inside'], mark: 'A dark mark annealed into the stainless.', backdrop: '/portfolio/engraved-hand-saw.jpg', leadTime: SOON, sample: 'D. Alvarez',
  },
  {
    slug: 'victorinox-huntsman', photo: '/reserve/victorinox-huntsman.jpg', group: 'knives', noun: 'knife', name: 'Victorinox Huntsman', maker: 'Victorinox', material: 'Stainless, Cellidor scales', retail: 52,
    where: "Cabela's, REI", tier: 'thank-you',
    blurb: 'The Swiss Army knife. The red scales take a light mark; the blade takes a dark one. I mark the blade unless you say otherwise.',
    placements: ['Main blade', 'Scale'], mark: 'Dark on the blade, light on the scale.', backdrop: '/portfolio/pocket-knife-engraved.jpg', leadTime: SOON, sample: 'Grandpa Joe',
  },
  {
    slug: 'zippo-brushed-chrome', photo: '/reserve/zippo-brushed-chrome.jpg', group: 'carry', noun: 'lighter', name: 'Zippo, brushed chrome', maker: 'Zippo', material: 'Chrome over brass', retail: 21,
    where: "Cabela's Lone Tree", tier: 'thank-you',
    blurb: 'Brushed chrome takes a fine, dark mark. Initials on the lid, a line on the body. Fits in a pocket, gets handed down.',
    placements: ['Lid', 'Body, front', 'Body, back'], mark: 'A dark mark through the chrome.', backdrop: '/portfolio/laser-engraved-artwork.jpg', leadTime: SOON, sample: 'T.W.',
  },
  {
    slug: 'fisher-bullet-space-pen', photo: '/reserve/fisher-bullet-space-pen.jpg', group: 'carry', noun: 'pen', name: 'Fisher bullet space pen', maker: 'Fisher', material: 'Chrome over brass', retail: 39,
    where: 'REI Greenwood Village', tier: 'thank-you',
    blurb: 'The pen that writes upside down. The chrome barrel takes a crisp dark mark along its length: a name, a phone number, one short line.',
    placements: ['Barrel'], mark: 'A dark mark through the chrome.', backdrop: '/portfolio/plastic-marking-charger.jpg', leadTime: SOON, sample: 'E. Okafor',
  },
  {
    slug: 'tactile-turn-bolt-action', photo: '/reserve/tactile-turn-bolt-action.jpg', group: 'carry', noun: 'pen', name: 'Tactile Turn bolt action pen', maker: 'Tactile Turn', material: 'Titanium', retail: 99,
    where: 'Ordered in, one to two weeks', tier: 'client', reserve: true,
    blurb: 'Machined in Texas, one piece of titanium. A serious pen for someone who signs things. The barrel takes a dark mark; a name and a date is the classic.',
    placements: ['Barrel', 'Clip'], mark: 'A dark, matte mark annealed into the titanium.', backdrop: '/portfolio/plastic-marking-charger.jpg', leadTime: ORDERED, sample: 'E. Okafor',
  },
  {
    slug: 'buck-110-folding-hunter', photo: '/reserve/buck-110-folding-hunter.jpg', group: 'knives', noun: 'knife', name: 'Buck 110 folding hunter', maker: 'Buck', material: 'Steel blade, brass bolsters', retail: 90,
    where: "Cabela's Lone Tree", tier: 'client', 
    blurb: 'The lockback with the brass bolsters, made in Idaho since 1964. The blade takes a dark mark; the bolsters take a bright one. This is the knife for a name.',
    placements: ['Blade', 'Bolster'], mark: 'Dark on the blade, bright on the brass.', backdrop: '/portfolio/pocket-knife-engraved.jpg', leadTime: SOON, sample: 'W. Hale',
  },
  {
    slug: 'opinel-no-08', photo: '/reserve/opinel-no-08.jpg', group: 'knives', noun: 'knife', name: 'Opinel No. 08', maker: 'Opinel', material: 'Steel blade, beech handle', retail: 23,
    where: 'REI, Williams Sonoma', tier: 'thank-you',
    blurb: 'The French picnic knife. The beech handle takes a warm burned mark, the blade a dark one. The best inexpensive gift that does not look inexpensive.',
    placements: ['Handle', 'Blade'], mark: 'Burned into the beech, dark on the blade.', backdrop: '/portfolio/pocket-knife-engraved.jpg', leadTime: SOON, sample: 'Camp Chef',
  },
  {
    slug: 'spyderco-delica-4', photo: '/reserve/spyderco-delica-4.jpg', group: 'knives', noun: 'knife', name: 'Spyderco Delica 4', maker: 'Spyderco', material: 'VG-10 blade', retail: 126,
    where: 'Spyderco factory outlet, Golden', tier: 'client', 
    blurb: 'Made up the road in Golden. Light, sharp, and carried everywhere. The blade takes a dark mark beside the maker\'s own; the handle scale takes a light one.',
    placements: ['Blade', 'Scale'], mark: 'Dark on the blade, light on the scale.', backdrop: '/portfolio/pocket-knife-engraved.jpg', leadTime: SOON, sample: 'S.K.',
  },
  {
    slug: 'benchmade-bugout', photo: '/reserve/benchmade-bugout.jpg', group: 'knives', noun: 'knife', name: 'Benchmade Bugout', maker: 'Benchmade', material: 'S30V blade', retail: 200,
    where: "Cabela's Lone Tree", tier: 'client', reserve: true,
    blurb: 'The pocket knife people ask for by name. A blade this good deserves a clean mark: initials at the base, a date on the spine side. I keep it small.',
    placements: ['Blade', 'Scale'], mark: 'A dark mark annealed into the steel.', backdrop: '/portfolio/pocket-knife-engraved.jpg', leadTime: SOON, sample: 'A.J.B.',
  },
  {
    slug: 'shun-classic-8-chef', photo: '/reserve/shun-classic-8-chef.jpg', group: 'knives', noun: 'knife', name: 'Shun Classic 8 inch chef knife', maker: 'Shun', material: 'VG-MAX blade', retail: 190,
    where: 'Williams Sonoma, Cherry Creek and Park Meadows', tier: 'client', reserve: true,
    blurb: 'I cooked for fifteen years. This is the knife I would hand a cook who just made sous chef. A name on the blade, small and near the heel, where their hand will see it every day.',
    placements: ['Blade, near the heel', 'Blade, spine side'], mark: 'A dark mark annealed into the steel, not cut.', backdrop: '/portfolio/culinary-cleaver-engraved.jpg', leadTime: SOON, sample: 'Chef Reyes',
  },
  {
    slug: 'smithey-no-10-skillet', photo: '/reserve/smithey-no-10-skillet.jpg', group: 'kitchen', noun: 'skillet', name: 'Smithey No. 10 skillet', maker: 'Smithey', material: 'Cast iron', retail: 180,
    where: 'Williams Sonoma', tier: 'client', 
    blurb: 'Polished cast iron from Charleston, the kind that gets willed to someone. The underside takes a bright mark: a family name, a wedding date, the year the house was bought.',
    placements: ['Underside', 'Handle'], mark: 'A bright mark in the polished iron.', backdrop: '/portfolio/denver-map-mirror-closeup.jpg', leadTime: SOON, sample: 'The Delgados, est. 2026',
  },
  {
    slug: 'john-boos-maple-board', photo: '/reserve/john-boos-maple-board.jpg', group: 'kitchen', noun: 'board', name: 'John Boos maple board, 18 by 12', maker: 'John Boos', material: 'Hard maple', retail: 95,
    where: 'Williams Sonoma', tier: 'client', 
    blurb: 'The board every restaurant kitchen has. Hard maple takes a deep, even burn. A name across a corner, or a whole recipe in your grandmother\'s hand if you send me the card.',
    placements: ['Corner', 'Center', 'Edge'], mark: 'A clean burn in the maple, darker with more power.', backdrop: '/portfolio/denver-map-glass-coaster.jpg', leadTime: SOON, sample: 'Nonna\'s Table',
  },
  {
    slug: 'bellroy-slim-sleeve', photo: '/reserve/bellroy-slim-sleeve.jpg', group: 'carry', noun: 'wallet', name: 'Bellroy slim sleeve wallet', maker: 'Bellroy', material: 'Leather', retail: 85,
    where: 'Nordstrom, Apple', tier: 'thank-you',
    blurb: 'Soft leather, thin as a card. Leather takes a dark, slightly recessed mark. Initials, small, in the corner.',
    placements: ['Front corner', 'Inside'], mark: 'A dark, slightly recessed mark in the leather.', backdrop: '/portfolio/laser-engraved-artwork.jpg', leadTime: SOON, sample: 'M.L.',
  },
  {
    slug: 'moleskine-classic', photo: '/reserve/moleskine-classic.jpg', group: 'carry', noun: 'notebook', name: 'Moleskine classic notebook', maker: 'Moleskine', material: 'Hard cover', retail: 26,
    where: 'Barnes and Noble, Tattered Cover', tier: 'thank-you',
    blurb: 'The notebook. The cover takes a subtle, matte mark. A name, a year, the title of the project it is for.',
    placements: ['Front cover', 'Back cover'], mark: 'A subtle matte mark in the cover.', backdrop: '/portfolio/laser-engraved-artwork.jpg', leadTime: SOON, sample: 'Field Notes, Vol. 3',
  },
  {
    slug: 'shun-premier-8-chef', photo: '/reserve/shun-premier-8-chef.jpg', group: 'knives', noun: 'knife', name: 'Shun Premier 8 inch chef knife', maker: 'Shun', material: 'VG-MAX blade, hammered tsuchime finish', retail: 275,
    where: 'Williams Sonoma Cherry Creek or Park Meadows, Sur La Table Centennial', tier: 'client', reserve: true,
    blurb: 'The hammered one. The tsuchime finish keeps food off the blade and catches the light in a way the Classic does not. A name at the heel, small, and it is theirs for the rest of a career.',
    placements: ['Blade, near the heel', 'Blade, spine side'], mark: 'A dark mark annealed into the steel, beside the hammered finish.', backdrop: '/portfolio/culinary-cleaver-engraved.jpg', leadTime: SOON, sample: 'Chef Reyes',
  },
  {
    slug: 'miyabi-birchwood-8-chef', photo: '/reserve/miyabi-birchwood-8-chef.jpg', group: 'knives', noun: 'knife', name: 'Miyabi Birchwood SG2 8 inch chef knife', maker: 'Miyabi', material: 'SG2 powder steel, birch handle', retail: 365,
    where: 'Williams Sonoma, Sur La Table Centennial', tier: 'client', reserve: true,
    blurb: 'Made in Seki with a Masur birch handle no two of which match. This is the knife for the cook who has everything. The blade takes a small dark mark that sits beside the Damascus like it was always there.',
    placements: ['Blade, near the heel', 'Blade, spine side'], mark: 'A dark mark annealed into the steel.', backdrop: '/portfolio/culinary-cleaver-engraved.jpg', leadTime: SOON, sample: 'For M., who taught me',
  },
  {
    slug: 'wusthof-classic-ikon-8-chef', photo: '/reserve/wusthof-classic-ikon-8-chef.jpg', group: 'knives', noun: 'knife', name: 'Wusthof Classic Ikon 8 inch cook\'s knife', maker: 'Wusthof', material: 'Forged German steel', retail: 200,
    where: 'Williams Sonoma, Sur La Table Centennial', tier: 'client', reserve: true,
    blurb: 'Solingen steel, the double bolster, the handle that fits a big hand. The knife most professional kitchens actually run on. A name near the heel, where the hand sees it every day.',
    placements: ['Blade, near the heel', 'Blade, spine side'], mark: 'A dark mark annealed into the steel, not cut.', backdrop: '/portfolio/culinary-cleaver-engraved.jpg', leadTime: SOON, sample: 'Chef Reyes',
  },
  {
    slug: 'benchmade-940-osborne', photo: '/reserve/benchmade-940-osborne.jpg', group: 'knives', noun: 'knife', name: 'Benchmade 940 Osborne', maker: 'Benchmade', material: 'S30V blade, anodized aluminum handle', retail: 300,
    where: 'Cabela\'s Lone Tree, Rocky Mountain Specialty Gear in Wheat Ridge', tier: 'client', reserve: true,
    blurb: 'The 940 has been the answer to "which one" for twenty-five years. The green anodized handle takes a bright silver mark, initials along the spine, that reads like it came from Oregon that way.',
    placements: ['Handle', 'Blade'], mark: 'Bright silver through the green anodize; dark on the blade.', backdrop: '/portfolio/pocket-knife-engraved.jpg', leadTime: SOON, sample: 'A.J.B.',
  },
  {
    slug: 'chris-reeve-small-sebenza-31', photo: '/reserve/chris-reeve-small-sebenza-31.jpg', group: 'knives', noun: 'knife', name: 'Chris Reeve Small Sebenza 31', maker: 'Chris Reeve', material: 'MagnaCut blade, titanium handle', retail: 425,
    where: 'Ordered in, one to two weeks (Castle Gate in Sedalia sometimes has one)', tier: 'client', reserve: true,
    blurb: 'Made in Boise, one at a time, the knife other knife makers carry. Bead-blasted titanium takes a dark mark that looks machined in. This is the one you give someone once.',
    placements: ['Handle, presentation side', 'Handle, lock side'], mark: 'A dark, matte mark annealed into the titanium.', backdrop: '/portfolio/pocket-knife-engraved.jpg', leadTime: ORDERED, sample: 'W. Hale',
  },
  {
    slug: 'spyderco-paramilitary-2', photo: '/reserve/spyderco-paramilitary-2.jpg', group: 'knives', noun: 'knife', name: 'Spyderco Para Military 2', maker: 'Spyderco', material: 'S45VN blade, G-10 handle', retail: 279,
    where: 'Spyderco factory outlet, Golden; Cabela\'s Lone Tree', tier: 'client', reserve: true,
    blurb: 'Made up the road in Golden, and the one Spyderco fans ask for by name. The blade takes a dark mark beside the maker\'s own; a name on the flat, small.',
    placements: ['Blade', 'Handle'], mark: 'Dark on the blade, light on the G-10.', backdrop: '/portfolio/pocket-knife-engraved.jpg', leadTime: SOON, sample: 'S.K.',
  },
  {
    slug: 'smithey-no-12-skillet', photo: '/reserve/smithey-no-12-skillet.jpg', group: 'kitchen', noun: 'skillet', name: 'Smithey No. 12 skillet', maker: 'Smithey', material: 'Polished cast iron', retail: 220,
    where: 'Williams Sonoma, or Ace pickup', tier: 'client', reserve: true,
    blurb: 'The big one, twelve inches, the pan a family cooks Sunday in. Polished cast iron from Charleston, and the underside takes a bright mark: the family name, a wedding date, the year the house was bought.',
    placements: ['Underside', 'Handle'], mark: 'A bright mark in the polished iron.', backdrop: '/portfolio/denver-map-mirror-closeup.jpg', leadTime: SOON, sample: 'The Delgados, est. 2026',
  },
  {
    slug: 'john-boos-reversible-maple-24x18', photo: '/reserve/john-boos-reversible-maple-24x18.jpg', group: 'kitchen', noun: 'board', name: 'John Boos reversible maple board, 24 by 18', maker: 'John Boos', material: 'Hard maple, edge grain, 2.25 inch', retail: 201,
    where: 'Ordered in, one to two weeks', tier: 'client', reserve: true,
    blurb: 'The full-size board, the one that lives on the counter. Hard maple takes a deep, even burn. A name across a corner, or a whole recipe in your grandmother\'s hand if you send me the card.',
    placements: ['Corner', 'Center', 'Edge'], mark: 'A clean burn in the maple, darker with more power.', backdrop: '/portfolio/denver-map-glass-coaster.jpg', leadTime: ORDERED, sample: 'Nonna\'s Table',
  },
  {
    slug: 'yeti-tundra-45', photo: '/reserve/yeti-tundra-45.jpg', group: 'out', noun: 'cooler', name: 'Yeti Tundra 45', maker: 'Yeti', material: 'Rotomolded polyethylene', retail: 325,
    where: 'Yeti, Cherry Creek North; REI; Cabela\'s Lone Tree', tier: 'client', reserve: true,
    blurb: 'The cooler that outlives the truck it rides in. The lid takes a large, clean mark: the name of the cabin, the boat, the crew. The one thing on this list that gets seen by everyone at the tailgate.',
    placements: ['Lid', 'Front', 'Side'], mark: 'A clean matte mark in the lid, the color of the shell underneath.', backdrop: '/portfolio/water-bottle-full-wrap.jpg', leadTime: SOON, sample: 'Camp Bluebird',
  },
  {
    slug: 'ridge-wallet-carbon-fiber', photo: '/reserve/ridge-wallet-carbon-fiber.jpg', group: 'carry', noun: 'wallet', name: 'Ridge wallet, carbon fiber', maker: 'Ridge', material: 'Carbon fiber plates', retail: 150,
    where: 'Best Buy pickup, Nordstrom Cherry Creek or Park Meadows', tier: 'client', reserve: true,
    blurb: 'The lightest Ridge, the plates woven from carbon fiber. It takes a fine, light mark in the weave: initials, small, in a corner.',
    placements: ['Outer plate', 'Inner plate'], mark: 'A fine light mark in the weave.', backdrop: '/portfolio/laser-engraved-artwork.jpg', leadTime: SOON, sample: 'J.R.M.',
  },
]

export const RESERVE: SourcedItem[] = SOURCED.filter(i => i.reserve)

/** The reserve, shelved. */
export function reserveByGroup(): { group: (typeof RESERVE_GROUPS)[number]; items: SourcedItem[] }[] {
  return RESERVE_GROUPS.map(group => ({ group, items: RESERVE.filter(i => i.group === group.key).sort((a, b) => a.retail - b.retail) })).filter(g => g.items.length > 0)
}

export function sourcedBySlug(slug: string): SourcedItem | undefined {
  return SOURCED.find(i => i.slug === slug)
}

export function deliveredPrice(item: SourcedItem): number {
  return SOURCING.delivered(item.retail)
}

/** Three other reserve pieces to show beside this one. */
export function alsoInReserve(item: SourcedItem, n = 3): SourcedItem[] {
  const pool = (item.reserve ? RESERVE : SOURCED).filter(i => i.slug !== item.slug)
  const start = Math.max(0, pool.findIndex(i => i.retail >= item.retail) - 1)
  return [...pool.slice(start), ...pool.slice(0, start)].slice(0, n)
}
