'use client'
export const runtime = 'edge'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface OrderItem { id: string; nameSnapshot: string; qty: number; unitPriceCents: number; metadata?: { engraving?: { text?: string; fontValue?: string; fontLabel?: string } } }
interface Order {
  id: string; number: string; email: string; status: string
  subtotalCents: number; fulfillmentFeeCents: number; totalCents: number
  fulfillmentMethod: string
  fulfillmentAddress: { name?: string; line1?: string; line2?: string | null; city?: string; state?: string; postalCode?: string; phone?: string | null } | null
  notes: string; createdAt: string
  metadata?: {
    handDelivery?: { window?: string; windowLabel?: string; note?: string }
    attachments?: Array<{ key: string; filename: string }>
  }
}

function money(c: number) { return `$${(c / 100).toFixed(2)}` }

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/admin/orders/${params.id}`)
      .then(r => r.json())
      .then(j => {
        const parsed = j as { data?: { order: Order; items: OrderItem[] } }
        if (parsed.data) {
          setOrder(parsed.data.order)
          setItems(parsed.data.items)
        }
        setLoading(false)
      })
  }, [params?.id])

  async function setStatus(status: string) {
    if (!order) return
    await fetch(`/api/admin/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setOrder({ ...order, status })
  }

  if (loading) return <div className="p-8 text-gray-500 text-sm">Loading…</div>
  if (!order) return <div className="p-8 text-gray-400 text-sm">Order not found.</div>

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <Link href="/admin/orders" className="text-xs text-gray-500 hover:text-cream mb-2 inline-block">← All orders</Link>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-cream font-mono">{order.number}</h1>
          <p className="text-sm text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <select
          value={order.status}
          onChange={e => setStatus(e.target.value)}
          className="bg-[#235158] border border-white/10 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#6BB8B2]"
        >
          {['new','confirmed','in_progress','ready','delivered','cancelled','refunded'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#235158] border border-white/5 rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Customer</p>
          <p className="text-sm text-cream">{order.email}</p>
        </div>
        <div className="bg-[#235158] border border-white/5 rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Fulfillment</p>
          <p className="text-sm text-cream">{order.fulfillmentMethod.replace('_', ' ')}</p>
        </div>
        <div className="bg-[#235158] border border-white/5 rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Total</p>
          <p className="text-sm text-cream font-semibold">{money(order.totalCents)}</p>
        </div>
      </div>

      {order.fulfillmentAddress && (
        <div className="bg-[#235158] border border-white/5 rounded-xl p-4 mb-6">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Ship to</p>
          <p className="text-sm text-cream">
            {order.fulfillmentAddress.name}<br />
            {order.fulfillmentAddress.line1}{order.fulfillmentAddress.line2 ? `, ${order.fulfillmentAddress.line2}` : ''}<br />
            {order.fulfillmentAddress.city}, {order.fulfillmentAddress.state} {order.fulfillmentAddress.postalCode}
            {order.fulfillmentAddress.phone && <><br />{order.fulfillmentAddress.phone}</>}
          </p>
        </div>
      )}

      <div className="bg-[#235158] border border-white/5 rounded-xl p-4 mb-6">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-3">Line items</p>
        <div className="divide-y divide-white/5">
          {items.map(it => (
            <div key={it.id} className="py-2 flex items-center justify-between">
              <div>
                <p className="text-sm text-cream">{it.nameSnapshot}</p>
                <p className="text-xs text-gray-500">{it.qty} × {money(it.unitPriceCents)}</p>
                {it.metadata?.engraving?.text && (
                  <p className="text-xs mt-1 inline-flex items-center gap-1.5 bg-[#6BB8B2]/10 border border-[#6BB8B2]/30 text-[#6BB8B2] rounded px-2 py-1">
                    ✎ Engrave:&nbsp;<span className="text-cream font-medium">“{it.metadata.engraving.text}”</span>
                    {it.metadata.engraving.fontLabel ? <span className="text-gray-400">· {it.metadata.engraving.fontLabel}</span> : null}
                  </p>
                )}
              </div>
              <p className="text-sm font-semibold text-cream">{money(it.qty * it.unitPriceCents)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 mt-3 pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span className="text-cream">{money(order.subtotalCents)}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Delivery</span><span className="text-cream">{money(order.fulfillmentFeeCents)}</span></div>
          <div className="flex justify-between font-bold text-base pt-1"><span className="text-cream">Total</span><span className="text-cream">{money(order.totalCents)}</span></div>
        </div>
      </div>

      {order.fulfillmentMethod === 'hand_deliver' && order.metadata?.handDelivery && (
        <div className="bg-[#6BB8B2]/10 border border-[#6BB8B2]/30 rounded-xl p-4 mb-6">
          <p className="text-[11px] uppercase tracking-wider text-[#6BB8B2] mb-2 font-semibold">Hand delivery</p>
          {order.metadata.handDelivery.windowLabel && (
            <p className="text-sm text-cream"><span className="text-gray-400">Window:</span> {order.metadata.handDelivery.windowLabel}</p>
          )}
          {order.metadata.handDelivery.note && (
            <p className="text-sm text-cream mt-1 whitespace-pre-wrap"><span className="text-gray-400">Note:</span> {order.metadata.handDelivery.note}</p>
          )}
        </div>
      )}

      {order.notes && (
        <div className="bg-[#235158] border border-white/5 rounded-xl p-4 mb-6">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Customer notes</p>
          <p className="text-sm text-cream whitespace-pre-wrap">{order.notes}</p>
        </div>
      )}

      {(order.metadata?.attachments?.length ?? 0) > 0 && (
        <div className="bg-[#235158] border border-white/5 rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">Customer files</p>
          <ul className="space-y-2">
            {order.metadata!.attachments!.map(a => (
              <li key={a.key}>
                <a
                  href={`/api/admin/r2/${a.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#6BB8B2] hover:text-cream transition-colors"
                >
                  📎 {a.filename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
