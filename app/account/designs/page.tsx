'use client'
/**
 * The customer's saved designs: everything they made in the designer,
 * ordered or not, newest first. Continue picks the design back up on the
 * product page on any device.
 */
import { useEffect, useState } from 'react'
import Link from 'next/link'
import CardThumb, { designLabel } from '@/components/designer/CardThumb'
import type { CardDesign } from '@/lib/designer/card'

interface SavedDesign {
  id: string
  productName: string | null
  productSlug: string | null
  design: CardDesign
  orderId: string | null
  orderNumber: string | null
  updatedAt: string
}

export default function AccountDesignsPage() {
  const [designs, setDesigns] = useState<SavedDesign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/designs')
      .then(r => r.json() as Promise<{ data?: { designs: SavedDesign[] } }>)
      .then(j => setDesigns(j.data?.designs ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <Link href="/account" className="text-xs text-[var(--ink-soft)] hover:text-[var(--ink)] mb-4 inline-block">← Back</Link>
      <h1 className="text-[length:var(--step-section)] sm:text-[length:var(--step-display)] font-semibold text-[var(--ink)] mb-2">Designs</h1>
      <p className="text-sm text-[var(--ink-soft)] mb-8">Every card you designed, saved as you went. Pick one up where you left it.</p>

      {loading ? (
        <p className="text-sm text-[var(--ink-soft)]">Loading…</p>
      ) : designs.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-[var(--r-panel)] p-8 text-center">
          <p className="text-[var(--ink)]">Nothing designed yet.</p>
          <p className="text-sm text-[var(--ink-soft)] mt-1">Open a card in the shop, type, and it saves here on its own.</p>
          <Link href="/shop/p/anodized-aluminum-wallet-card" className="inline-flex items-center justify-center mt-5 h-10 px-5 rounded-[var(--r-control)] bg-[var(--coral)] text-white text-sm font-semibold hover:bg-[var(--coral-hover)]">Design a card</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {designs.map(d => (
            <div key={d.id} className="bg-[var(--surface)] border border-[var(--hairline)] rounded-[var(--r-panel)] p-4">
              <CardThumb design={d.design} id={`acct-${d.id}`} />
              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--ink)] truncate">{d.productName ?? 'Card'}</p>
                  <p className="text-[11px] text-[var(--ink-soft)]">{designLabel(d.design)} · {new Date(d.updatedAt).toLocaleDateString()}</p>
                  {d.orderNumber && <p className="text-[11px] text-[var(--eyebrow)] mt-0.5">Ordered, {d.orderNumber}</p>}
                </div>
                {d.productSlug && !d.orderId && (
                  <Link href={`/shop/p/${d.productSlug}/#design=${d.id}`} className="flex-shrink-0 text-xs font-semibold text-[var(--eyebrow)] hover:underline">Continue</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
