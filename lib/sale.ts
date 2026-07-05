/**
 * Time-boxed sale pricing, the reusable mechanic. A product goes on sale
 * by carrying metadata.sale; price_cents stays the regular price, so the
 * whole site reverts itself the instant the window closes. No cron,
 * nothing to remember, display and checkout read the same clock.
 *
 * Honesty rules baked in: compareAt is only true when the regular price
 * was actually charged before (a real former price), which is what earns
 * a strikethrough. Forward-priced launch SKUs leave it false and simply
 * show the launch price with the end date. A capped sale stops selling at
 * the sale price once that many units have been ordered.
 */

export interface SaleInfo {
  priceCents: number
  /** ISO instant the sale ends (exclusive). */
  endsAt: string
  /** True only when the regular price is a real former price. Earns the strikethrough. */
  compareAt: boolean
  /** Honest scarcity: the sale price applies to the first N units only. */
  capUnits?: number
  /** Plain-language cap line, e.g. "first 20 boards". */
  capLabel?: string
}

export function saleFrom(metadata: Record<string, unknown> | null | undefined): SaleInfo | null {
  const raw = metadata?.sale
  if (!raw || typeof raw !== 'object') return null
  const s = raw as Record<string, unknown>
  const priceCents = Number(s.priceCents)
  const endsAt = typeof s.endsAt === 'string' ? s.endsAt : ''
  if (!Number.isFinite(priceCents) || priceCents <= 0 || !Number.isFinite(Date.parse(endsAt))) return null
  const capUnits = Number(s.capUnits)
  return {
    priceCents: Math.round(priceCents),
    endsAt,
    compareAt: s.compareAt === true,
    capUnits: Number.isFinite(capUnits) && capUnits > 0 ? Math.round(capUnits) : undefined,
    capLabel: typeof s.capLabel === 'string' && s.capLabel ? s.capLabel : undefined,
  }
}

/** Date window only. The cap is checked where sold counts are known. */
export function saleWindowOpen(sale: SaleInfo, now: Date = new Date()): boolean {
  return now.getTime() < Date.parse(sale.endsAt)
}

/**
 * The sale currently in effect for a product, or null. When the sale has
 * a cap, pass the product's sold-unit count or the cap is assumed unmet.
 */
export function liveSale(
  metadata: Record<string, unknown> | null | undefined,
  soldUnits?: number,
  now: Date = new Date(),
): SaleInfo | null {
  const sale = saleFrom(metadata)
  if (!sale || !saleWindowOpen(sale, now)) return null
  if (sale.capUnits !== undefined && (soldUnits ?? 0) >= sale.capUnits) return null
  return sale
}

/** The sale's last day for copy, in Denver time: "July 31". */
export function saleEndsLabel(sale: SaleInfo): string {
  return new Date(Date.parse(sale.endsAt) - 1).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Denver',
  })
}
