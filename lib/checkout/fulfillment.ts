/**
 * Fulfillment option rules — computed server-side so the checkout
 * quote is authoritative. Clients can preview but the server re-computes
 * at order creation.
 */
import type { FulfillmentMethod, ShippingAddress } from '@/lib/db/repos/orders'

export interface FulfillmentOption {
  method: FulfillmentMethod
  label: string
  priceCents: number
  eta: string
  description: string
  availableReason?: string
  disabled?: boolean
}

// South Denver / Centennial-area ZIP codes eligible for hand delivery.
// This list is editable; the heuristic here covers Centennial, Littleton,
// Lone Tree, Parker, Highlands Ranch, Englewood, Aurora, Greenwood Village, Cherry Hills.
const HAND_DELIVER_ZIPS = new Set([
  // Centennial
  '80111','80112','80015','80016','80121','80122',
  // Littleton / Highlands Ranch / Lone Tree
  '80120','80123','80124','80125','80126','80127','80128','80129','80130','80134',
  // Parker / Castle Pines
  '80108','80109','80134','80138',
  // Englewood / Cherry Hills / Greenwood Village
  '80110','80113',
  // Aurora (south)
  '80013','80014','80017','80018','80019',
  // Denver (south)
  '80210','80222','80231','80237','80246','80247','80224',
])

export function isHandDeliverableZip(postal: string | null | undefined): boolean {
  if (!postal) return false
  const digits = postal.replace(/[^0-9]/g, '').slice(0, 5)
  return HAND_DELIVER_ZIPS.has(digits)
}

/**
 * Compute fulfillment options for a given cart + optional address.
 * Ship cost is a weight-based zone calculator for now (swap Shippo later).
 */
export function computeFulfillmentOptions(args: {
  subtotalCents: number
  totalWeightGrams: number
  address?: Partial<ShippingAddress> | null
}): FulfillmentOption[] {
  const { subtotalCents, totalWeightGrams, address } = args
  const postal = address?.postalCode
  const opts: FulfillmentOption[] = []

  // Hand deliver — South Denver metro, flat $5 free over $75
  if (postal == null || isHandDeliverableZip(postal)) {
    const fee = subtotalCents >= 7500 ? 0 : 500
    opts.push({
      method: 'hand_deliver',
      label: 'Hand delivery (South Denver)',
      priceCents: fee,
      eta: '1–2 days',
      description: fee === 0
        ? 'Free when you spend $75+. Hand-delivered by Zach.'
        : 'Hand-delivered by Zach. Free over $75.',
    })
  }

  // Pickup — always free
  opts.push({
    method: 'pickup',
    label: 'Pickup in Centennial',
    priceCents: 0,
    eta: 'Same/next day',
    description: 'Arrange a pickup time. Free.',
  })

  // Shipping — simple weight tiers
  const shipCost = computeShippingCost(totalWeightGrams)
  opts.push({
    method: 'ship',
    label: 'USPS shipping',
    priceCents: shipCost,
    eta: '3–5 days',
    description: 'First-class or priority mail, tracked.',
  })

  // Uber Direct — same-day local, quote deferred to checkout step 2
  if (postal == null || isHandDeliverableZip(postal)) {
    opts.push({
      method: 'uber_direct',
      label: 'Uber same-day',
      priceCents: 1500, // placeholder — real quote at checkout
      eta: 'Same day',
      description: 'Courier delivery via Uber Direct. Real rate shown at checkout.',
    })
  }

  // Fallback — invoice later
  opts.push({
    method: 'invoice_later',
    label: 'Send me an invoice',
    priceCents: 0,
    eta: 'We\'ll be in touch',
    description: 'Skip payment now — we\'ll email you an invoice with shipping options.',
  })

  return opts
}

function computeShippingCost(weightGrams: number): number {
  if (weightGrams <= 0) return 500        // flat small-parcel baseline
  if (weightGrams < 500) return 600       // under 1 lb
  if (weightGrams < 1500) return 900      // 1–3 lb
  if (weightGrams < 5000) return 1400     // 3–11 lb
  return 2200                             // 11+ lb
}
