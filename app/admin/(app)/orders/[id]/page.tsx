'use client'
export const runtime = 'edge'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface OrderItem { id: string; nameSnapshot: string; qty: number; unitPriceCents: number; metadata?: { engraving?: { text?: string; fontValue?: string; fontLabel?: string; placement?: string; element?: { id: string; label: string; thumb: string } } } }
interface Order {
  id: string; number: string; email: string; status: string
  subtotalCents: number; fulfillmentFeeCents: number; totalCents: number
  fulfillmentMethod: string
  fulfillmentAddress: { name?: string; line1?: string; line2?: string | null; city?: string; state?: string; postalCode?: string; phone?: string | null } | null
  notes: string; createdAt: string
  metadata?: {
    handDelivery?: { window?: string; windowLabel?: string; note?: string }
    attachments?: Array<{ key: string; filename: string }>
    proof?: { status?: 'needed' | 'sent' | 'approved'; at?: string }
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

  async function setProof(proof: 'needed' | 'sent' | 'approved') {
    if (!order) return
    await fetch(`/api/admin/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proof }),
    })
    setOrder({ ...order, metadata: { ...order.metadata, proof: { status: proof, at: new Date().toISOString() } } })
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
          className="bg-[#16525C] border border-white/10 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#7FCFD4]"
        >
          {['new','confirmed','in_progress','ready','delivered','cancelled','refunded'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Proof workflow — the promise is "nothing engraves until approved" */}
      <div className="flex items-center gap-2 mb-6 bg-[#16525C] border border-white/5 rounded-xl px-4 py-3">
        <span className="text-[11px] uppercase tracking-wider text-gray-500 mr-1">Proof</span>
        {([['needed', 'Needed'], ['sent', 'Sent to customer'], ['approved', 'Approved ✓']] as const).map(([key, label]) => {
          const current = order.metadata?.proof?.status === key
          const accent = key === 'approved' ? 'border-[#7FCFD4] bg-[#7FCFD4]/15 text-[#7FCFD4]' : key === 'sent' ? 'border-sky-400 bg-sky-400/15 text-sky-300' : 'border-amber-400 bg-amber-400/15 text-amber-300'
          return (
            <button
              key={key}
              onClick={() => setProof(key)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${current ? accent : 'border-white/10 text-gray-400 hover:text-cream hover:border-white/30'}`}
            >
              {label}
            </button>
          )
        })}
        {order.metadata?.proof?.at && (
          <span className="text-[10px] text-gray-500 ml-auto">{new Date(order.metadata.proof.at).toLocaleString()}</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#16525C] border border-white/5 rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Customer</p>
          <p className="text-sm text-cream">{order.email}</p>
        </div>
        <div className="bg-[#16525C] border border-white/5 rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Fulfillment</p>
          <p className="text-sm text-cream">{order.fulfillmentMethod.replace('_', ' ')}</p>
        </div>
        <div className="bg-[#16525C] border border-white/5 rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Total</p>
          <p className="text-sm text-cream font-semibold">{money(order.totalCents)}</p>
        </div>
      </div>

      {order.fulfillmentAddress && (
        <div className="bg-[#16525C] border border-white/5 rounded-xl p-4 mb-6">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Ship to</p>
          <p className="text-sm text-cream">
            {order.fulfillmentAddress.name}<br />
            {order.fulfillmentAddress.line1}{order.fulfillmentAddress.line2 ? `, ${order.fulfillmentAddress.line2}` : ''}<br />
            {order.fulfillmentAddress.city}, {order.fulfillmentAddress.state} {order.fulfillmentAddress.postalCode}
            {order.fulfillmentAddress.phone && <><br />{order.fulfillmentAddress.phone}</>}
          </p>
        </div>
      )}

      <div className="bg-[#16525C] border border-white/5 rounded-xl p-4 mb-6">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-3">Line items</p>
        <div className="divide-y divide-white/5">
          {items.map(it => (
            <div key={it.id} className="py-2 flex items-center justify-between">
              <div>
                <p className="text-sm text-cream">{it.nameSnapshot}</p>
                <p className="text-xs text-gray-500">{it.qty} × {money(it.unitPriceCents)}</p>
                {it.metadata?.engraving?.text && (
                  <p className="text-xs mt-1 inline-flex items-center gap-1.5 bg-[#7FCFD4]/10 border border-[#7FCFD4]/30 text-[#7FCFD4] rounded px-2 py-1">
                    ✎ Engrave:&nbsp;<span className="text-cream font-medium">“{it.metadata.engraving.text}”</span>
                    {it.metadata.engraving.fontLabel ? <span className="text-gray-400">· {it.metadata.engraving.fontLabel}</span> : null}
                  </p>
                )}
                {it.metadata?.engraving?.placement && (
                  <p className="text-xs mt-1 text-gray-400">↳ Placement: <span className="text-cream/80">{it.metadata.engraving.placement}</span></p>
                )}
                {it.metadata?.engraving?.element && (
                  <div className="mt-1.5 flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.metadata.engraving.element.thumb} alt="" className="h-9 w-9 object-contain bg-[#f0ebe0] rounded p-0.5" />
                    <span className="text-xs text-gray-400">Design: <span className="text-cream/80">{it.metadata.engraving.element.label}</span> <span className="font-mono text-gray-500">({it.metadata.engraving.element.id})</span></span>
                  </div>
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
        <div className="bg-[#7FCFD4]/10 border border-[#7FCFD4]/30 rounded-xl p-4 mb-6">
          <p className="text-[11px] uppercase tracking-wider text-[#7FCFD4] mb-2 font-semibold">Hand delivery</p>
          {order.metadata.handDelivery.windowLabel && (
            <p className="text-sm text-cream"><span className="text-gray-400">Window:</span> {order.metadata.handDelivery.windowLabel}</p>
          )}
          {order.metadata.handDelivery.note && (
            <p className="text-sm text-cream mt-1 whitespace-pre-wrap"><span className="text-gray-400">Note:</span> {order.metadata.handDelivery.note}</p>
          )}
        </div>
      )}

      {order.notes && (
        <div className="bg-[#16525C] border border-white/5 rounded-xl p-4 mb-6">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Customer notes</p>
          <p className="text-sm text-cream whitespace-pre-wrap">{order.notes}</p>
        </div>
      )}

      {(order.metadata?.attachments?.length ?? 0) > 0 && (
        <div className="bg-[#16525C] border border-white/5 rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">Customer files</p>
          <ul className="space-y-2">
            {order.metadata!.attachments!.map(a => (
              <li key={a.key}>
                <a
                  href={`/api/admin/r2/${a.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#7FCFD4] hover:text-cream transition-colors"
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
