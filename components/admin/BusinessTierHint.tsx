'use client'
import { businessTierFor, businessUnitPrice } from '@/lib/pricing'

// Inline volume-tier helper for quote/invoice line items. Watches the
// line's qty and offers the discounted business price in one click, so
// Zach never computes "15% off $3.00 times 150" by hand. Client-side
// arithmetic only, using the same functions checkout uses, so the number
// can never drift from the posted tiers. tierBase remembers the price
// before the discount so Undo and qty changes stay correct; it is never
// sent to the API.

export interface TierableLine { qty: number; price: string; tierBase?: string }

function toCents(s: string) {
  const n = parseFloat(s.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}
function toStr(c: number) { return (c / 100).toFixed(2) }

/** Patch to apply when a line's qty changes and a tier price was applied:
 *  recompute from the remembered base, or restore it below the tiers. */
export function retierPatch(line: TierableLine, newQty: number): Partial<TierableLine> & { qty: number } {
  if (!line.tierBase) return { qty: newQty }
  const base = toCents(line.tierBase)
  const tier = businessTierFor(newQty)
  if (!tier || tier.discount === 0) {
    return { qty: newQty, price: line.tierBase, tierBase: undefined }
  }
  return { qty: newQty, price: toStr(businessUnitPrice(base, newQty)) }
}

export default function BusinessTierHint({ line, onChange }: {
  line: TierableLine
  onChange: (patch: Partial<TierableLine>) => void
}) {
  const tier = businessTierFor(line.qty)
  if (!tier) return null

  if (line.tierBase) {
    return (
      <p className="text-[11px] text-[var(--a-accent)] pl-1">
        ✓ {tier.name} tier price ({Math.round(tier.discount * 100)}% off ${line.tierBase}/unit)
        <button
          onClick={() => onChange({ price: line.tierBase, tierBase: undefined })}
          className="ml-2 text-[var(--a-ink-faint)] hover:text-[var(--a-ink)] underline"
        >
          Undo
        </button>
      </p>
    )
  }

  if (tier.discount === 0) return null // Starter tier: standard rate, nothing to apply

  const baseCents = toCents(line.price)
  if (baseCents <= 0) return null
  const discounted = businessUnitPrice(baseCents, line.qty)

  return (
    <p className="text-[11px] text-[var(--a-ink-faint)] pl-1">
      {line.qty} units hits the {tier.name} tier: {Math.round(tier.discount * 100)}% off, ${toStr(discounted)}/unit.
      <button
        onClick={() => onChange({ price: toStr(discounted), tierBase: line.price })}
        className="ml-2 text-[var(--a-accent)] hover:underline font-semibold"
      >
        Apply
      </button>
    </p>
  )
}
