import type { ReserveGroup } from '@/lib/sourcing'

/**
 * The etchings: Zach's woodcut-style drawings of the actual things,
 * cut from one sheet (2026-09-26), cream ink on a clear ground, in
 * public/shop/etch. One drawing can stand for a door, a stocked product
 * without a photo, and a reserve category. No drawing, no entry: the
 * tile falls back to the typeset name or the line mark.
 */
export const ETCH = {
  knife: '/shop/etch/knife.png',
  board: '/shop/etch/board.png',
  tumbler: '/shop/etch/tumbler.png',
  keychain: '/shop/etch/keychain.png',
  wallet: '/shop/etch/wallet.png',
  glass: '/shop/etch/glass.png',
  opener: '/shop/etch/opener.png',
  tag: '/shop/etch/tag.png',
  lighter: '/shop/etch/lighter.png',
  pen: '/shop/etch/pen.png',
  coaster: '/shop/etch/coaster.png',
  pouch: '/shop/etch/pouch.png',
} as const

/** Stocked products drawn on the sheet, by slug. Round coasters only: the pine and slate sets are square. */
const PRODUCT_ART: Record<string, string> = {
  'engraved-keychain': ETCH.keychain,
  'anodized-aluminum-wallet-card': ETCH.wallet,
  'soft-touch-stylus-pen': ETCH.pen,
  'soft-touch-stylus-pens-pack-10': ETCH.pen,
  'soft-touch-stylus-pens-pack-15': ETCH.pen,
  'bamboo-cutting-board': ETCH.board,
  'gold-stainless-coaster-set': ETCH.coaster,
  'brushed-stainless-coaster-set': ETCH.coaster,
  'survival-knife-personalized': ETCH.knife,
}

export function productArt(slug: string): string | null {
  return PRODUCT_ART[slug] ?? null
}

const RESERVE_ART: Partial<Record<ReserveGroup, string>> = {
  'pocket-knife': ETCH.knife,
  board: ETCH.board,
  wallet: ETCH.wallet,
  pen: ETCH.pen,
  cooler: ETCH.tumbler,
}

export function reserveArt(group: ReserveGroup): string | null {
  return RESERVE_ART[group] ?? null
}
