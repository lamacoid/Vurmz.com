/**
 * "Happy to source, for a fee." The pieces worth naming, from the 2026-09
 * market research (vurmz-control/RESEARCH/PRICING-MARKET-2026-09.md).
 * Retail is what the store charged on the day it was looked up; the
 * delivered number is item at cost plus engraving plus the fee, rounded.
 * Glass is deliberately absent: neither laser marks it.
 */
import { SOURCING } from './pricing'

export interface SourcedItem {
  name: string
  material: string
  retail: number
  where: string
  tier: 'thank-you' | 'client'
}

export const SOURCED: SourcedItem[] = [
  { name: 'Ridge wallet, aluminum', material: 'Anodized aluminum', retail: 95, where: 'Best Buy Lone Tree, Nordstrom', tier: 'thank-you' },
  { name: 'Ridge wallet, titanium', material: 'Titanium', retail: 195, where: 'Best Buy Lone Tree, Nordstrom', tier: 'client' },
  { name: 'Yeti Rambler, 20 oz', material: 'Powder-coated stainless', retail: 35, where: 'Yeti, Cherry Creek North', tier: 'thank-you' },
  { name: 'Stanley Quencher, 40 oz', material: 'Powder-coated stainless', retail: 45, where: "Dick's, Park Meadows", tier: 'thank-you' },
  { name: 'Snow Peak titanium cup', material: 'Titanium', retail: 30, where: 'REI Greenwood Village', tier: 'thank-you' },
  { name: 'Leatherman Wave Plus', material: 'Stainless', retail: 130, where: "Cabela's Lone Tree", tier: 'client' },
  { name: 'Victorinox Huntsman', material: 'Stainless, Cellidor scales', retail: 52, where: "Cabela's, REI", tier: 'thank-you' },
  { name: 'Zippo, brushed chrome', material: 'Chrome over brass', retail: 21, where: "Cabela's Lone Tree", tier: 'thank-you' },
  { name: 'Fisher bullet space pen', material: 'Chrome over brass', retail: 39, where: 'REI Greenwood Village', tier: 'thank-you' },
  { name: 'Tactile Turn bolt action pen', material: 'Titanium', retail: 99, where: 'Ordered in, one to two weeks', tier: 'client' },
  { name: 'Buck 110 folding hunter', material: 'Steel blade, brass bolsters', retail: 90, where: "Cabela's Lone Tree", tier: 'client' },
  { name: 'Opinel No. 08', material: 'Steel blade, beech handle', retail: 23, where: 'REI, Williams Sonoma', tier: 'thank-you' },
  { name: 'Spyderco Delica 4', material: 'VG-10 blade', retail: 126, where: 'Spyderco factory outlet, Golden', tier: 'client' },
  { name: 'Benchmade Bugout', material: 'S30V blade', retail: 200, where: "Cabela's Lone Tree", tier: 'client' },
  { name: 'Shun Classic 8 inch chef knife', material: 'VG-MAX blade', retail: 190, where: 'Williams Sonoma, Cherry Creek and Park Meadows', tier: 'client' },
  { name: 'Smithey No. 10 skillet', material: 'Cast iron', retail: 180, where: 'Williams Sonoma', tier: 'client' },
  { name: 'John Boos maple board, 18 by 12', material: 'Hard maple', retail: 95, where: 'Williams Sonoma', tier: 'client' },
  { name: 'Bellroy slim sleeve wallet', material: 'Leather', retail: 85, where: 'Nordstrom, Apple', tier: 'thank-you' },
  { name: 'Moleskine classic notebook', material: 'Hard cover', retail: 26, where: 'Barnes and Noble, Tattered Cover', tier: 'thank-you' },
]

export function deliveredPrice(item: SourcedItem): number {
  return SOURCING.delivered(item.retail)
}
