'use client'
export const runtime = 'edge'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Item { id: string; nameSnapshot: string; qty: number; unitPriceCents: number }
interface Address { name?: string; line1?: string; line2?: string | null; city?: string; state?: string; postalCode?: string }
interface Order {
  id: string; number: string; status: string; email: string
  subtotalCents: number; fulfillmentFeeCents: number; totalCents: number
  fulfillmentMethod: string; fulfillmentAddress: Address | null; notes: string; createdAt: string
}

function money(c: number) { return `$${(c / 100).toFixed(2)}` }

export default function AccountOrderDetail() {
  const params = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/account/orders/${params.id}`)
      .then(r => r.json())
      .then(j => {
        const parsed = j as { data?: { order: Order; items: Item[] } }
        if (parsed.data) { setOrder(parsed.data.order); setItems(parsed.data.items) }
      })
      .finally(() => setLoading(false))
  }, [params?.id])

  if (loading) return <div className="p-10 text-center text-gray-500 text-sm">Loading…</div>
  if (!order) return <div className="p-10 text-center text-gray-500 text-sm">Order not found.</div>

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <Link href="/account/orders" className="text-xs text-gray-500 hover:text-cream mb-4 inline-block">← All orders</Link>
      <div className="flex items-baseline justify-between mb-5">
        <h1 className="text-2xl font-bold text-cream font-mono">{order.number}</h1>
        <span className="text-xs px-2.5 py-1 rounded-full bg-[#6BB8B2]/20 text-[#6BB8B2] uppercase tracking-wider font-semibold">
          {order.status.replace('_', ' ')}
        </span>
      </div>

      <div className="bg-[#243B39] border border-white/5 rounded-xl p-5 mb-5">
        <div className="divide-y divide-white/5">
          {items.map(it => (
            <div key={it.id} className="py-2.5 flex justify-between">
              <div>
                <p className="text-sm text-cream">{it.nameSnapshot}</p>
                <p className="text-[11px] text-gray-500">{it.qty} × {money(it.unitPriceCents)}</p>
              </div>
              <p className="text-sm font-semibold text-cream">{money(it.qty * it.unitPriceCents)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 mt-4 pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span className="text-cream">{money(order.subtotalCents)}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Delivery</span><span className="text-cream">{money(order.fulfillmentFeeCents)}</span></div>
          <div className="flex justify-between font-bold text-base pt-1 text-cream"><span>Total</span><span>{money(order.totalCents)}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="bg-[#243B39] border border-white/5 rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Fulfillment</p>
          <p className="text-sm text-cream">{order.fulfillmentMethod.replace('_', ' ')}</p>
        </div>
        {order.fulfillmentAddress && (
          <div className="bg-[#243B39] border border-white/5 rounded-xl p-4">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Ship to</p>
            <p className="text-xs text-cream leading-relaxed">
              {order.fulfillmentAddress.name}<br />
              {order.fulfillmentAddress.line1}{order.fulfillmentAddress.line2 ? `, ${order.fulfillmentAddress.line2}` : ''}<br />
              {order.fulfillmentAddress.city}, {order.fulfillmentAddress.state} {order.fulfillmentAddress.postalCode}
            </p>
          </div>
        )}
      </div>

      {order.notes && (
        <div className="bg-[#243B39] border border-white/5 rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Your notes</p>
          <p className="text-sm text-cream whitespace-pre-wrap">{order.notes}</p>
        </div>
      )}
    </div>
  )
}
