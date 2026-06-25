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

const STATUS_LABEL: Record<string, string> = {
  new: 'New', confirmed: 'Confirmed (paid)', in_progress: 'In progress',
  ready: 'Ready', delivered: 'Delivered', cancelled: 'Cancelled', refunded: 'Refunded',
}

// Plain-language "what to do next" based on where the order is.
function nextStep(order: Order): string {
  if (order.status === 'cancelled' || order.status === 'refunded') return ''
  if (order.status === 'delivered') return 'Delivered. Nothing left to do.'
  const proof = order.metadata?.proof?.status
  if (!proof || proof === 'needed') return 'Design the proof and send it to the customer to approve.'
  if (proof === 'sent') return 'Waiting on the customer to approve the proof.'
  if (order.status !== 'ready') return 'Proof approved. Engrave it, then move the order to Ready.'
  return 'Engraved and ready. Deliver it, then mark it Delivered.'
}

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

  if (loading) return <div className="p-8 text-[var(--a-ink-faint)] text-sm">Loading…</div>
  if (!order) return <div className="p-8 text-[var(--a-ink-soft)] text-sm">Order not found.</div>

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <Link href="/admin/orders" className="text-xs text-[var(--a-ink-faint)] hover:text-[var(--a-ink)] mb-2 inline-block">← All orders</Link>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--a-ink)] font-mono">{order.number}</h1>
          <p className="text-sm text-[var(--a-ink-soft)] mt-1">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <select
          value={order.status}
          onChange={e => setStatus(e.target.value)}
          className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[#7FCFD4]"
        >
          {['new','confirmed','in_progress','ready','delivered','cancelled','refunded'].map(s => <option key={s} value={s}>{STATUS_LABEL[s] ?? s}</option>)}
        </select>
      </div>

      {nextStep(order) && (
        <div className="mb-6 bg-white/[0.04] border-l-2 border-[var(--a-accent)] rounded-lg px-4 py-3">
          <p className="text-sm text-[var(--a-ink)]"><span className="font-semibold">Next step:</span> {nextStep(order)}</p>
        </div>
      )}

      {/* Proof workflow — the promise is "nothing engraves until approved" */}
      <div className="flex items-center gap-2 mb-6 bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl px-4 py-3">
        <span className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mr-1">Proof</span>
        {([['needed', 'Needed'], ['sent', 'Sent to customer'], ['approved', 'Approved ✓']] as const).map(([key, label]) => {
          const current = order.metadata?.proof?.status === key
          const accent = key === 'approved' ? 'border-[#7FCFD4] bg-[#7FCFD4]/15 text-[var(--a-accent)]' : key === 'sent' ? 'border-sky-400 bg-sky-400/15 text-sky-300' : 'border-amber-400 bg-amber-400/15 text-amber-300'
          return (
            <button
              key={key}
              onClick={() => setProof(key)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${current ? accent : 'border-[var(--a-line)] text-[var(--a-ink-soft)] hover:text-[var(--a-ink)] hover:border-white/30'}`}
            >
              {label}
            </button>
          )
        })}
        {order.metadata?.proof?.at && (
          <span className="text-[10px] text-[var(--a-ink-faint)] ml-auto">{new Date(order.metadata.proof.at).toLocaleString()}</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-1">Customer</p>
          <p className="text-sm text-[var(--a-ink)] break-all">{order.email}</p>
          <div className="flex gap-2 mt-2">
            <a href={`mailto:${order.email}`} className="text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[var(--a-ink-soft)] hover:text-[var(--a-ink)] transition-colors">Email</a>
            {order.fulfillmentAddress?.phone && (
              <a href={`sms:${order.fulfillmentAddress.phone}`} className="text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[var(--a-ink-soft)] hover:text-[var(--a-ink)] transition-colors">Text</a>
            )}
          </div>
        </div>
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-1">Fulfillment</p>
          <p className="text-sm text-[var(--a-ink)]">{order.fulfillmentMethod.replace('_', ' ')}</p>
        </div>
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-1">Total</p>
          <p className="text-sm text-[var(--a-ink)] font-semibold">{money(order.totalCents)}</p>
        </div>
      </div>

      {order.fulfillmentAddress && (
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-4 mb-6">
          <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-1">Ship to</p>
          <p className="text-sm text-[var(--a-ink)]">
            {order.fulfillmentAddress.name}<br />
            {order.fulfillmentAddress.line1}{order.fulfillmentAddress.line2 ? `, ${order.fulfillmentAddress.line2}` : ''}<br />
            {order.fulfillmentAddress.city}, {order.fulfillmentAddress.state} {order.fulfillmentAddress.postalCode}
            {order.fulfillmentAddress.phone && <><br />{order.fulfillmentAddress.phone}</>}
          </p>
        </div>
      )}

      <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-4 mb-6">
        <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-3">Line items</p>
        <div className="divide-y divide-[var(--a-line)]">
          {items.map(it => (
            <div key={it.id} className="py-2 flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--a-ink)]">{it.nameSnapshot}</p>
                <p className="text-xs text-[var(--a-ink-faint)]">{it.qty} × {money(it.unitPriceCents)}</p>
                {it.metadata?.engraving?.text && (
                  <p className="text-xs mt-1 inline-flex items-center gap-1.5 bg-[#7FCFD4]/10 border border-[#7FCFD4]/30 text-[var(--a-accent)] rounded px-2 py-1">
                    ✎ Engrave:&nbsp;<span className="text-[var(--a-ink)] font-medium">“{it.metadata.engraving.text}”</span>
                    {it.metadata.engraving.fontLabel ? <span className="text-[var(--a-ink-soft)]">· {it.metadata.engraving.fontLabel}</span> : null}
                  </p>
                )}
                {it.metadata?.engraving?.placement && (
                  <p className="text-xs mt-1 text-[var(--a-ink-soft)]">↳ Placement: <span className="text-cream/80">{it.metadata.engraving.placement}</span></p>
                )}
                {it.metadata?.engraving?.element && (
                  <div className="mt-1.5 flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.metadata.engraving.element.thumb} alt="" className="h-9 w-9 object-contain bg-[#f0ebe0] rounded p-0.5" />
                    <span className="text-xs text-[var(--a-ink-soft)]">Design: <span className="text-cream/80">{it.metadata.engraving.element.label}</span> <span className="font-mono text-[var(--a-ink-faint)]">({it.metadata.engraving.element.id})</span></span>
                  </div>
                )}
              </div>
              <p className="text-sm font-semibold text-[var(--a-ink)]">{money(it.qty * it.unitPriceCents)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--a-line)] mt-3 pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-[var(--a-ink-soft)]">Subtotal</span><span className="text-[var(--a-ink)]">{money(order.subtotalCents)}</span></div>
          <div className="flex justify-between"><span className="text-[var(--a-ink-soft)]">Delivery</span><span className="text-[var(--a-ink)]">{money(order.fulfillmentFeeCents)}</span></div>
          <div className="flex justify-between font-bold text-base pt-1"><span className="text-[var(--a-ink)]">Total</span><span className="text-[var(--a-ink)]">{money(order.totalCents)}</span></div>
        </div>
      </div>

      {order.fulfillmentMethod === 'hand_deliver' && order.metadata?.handDelivery && (
        <div className="bg-[#7FCFD4]/10 border border-[#7FCFD4]/30 rounded-xl p-4 mb-6">
          <p className="text-[11px] uppercase tracking-wider text-[var(--a-accent)] mb-2 font-semibold">Hand delivery</p>
          {order.metadata.handDelivery.windowLabel && (
            <p className="text-sm text-[var(--a-ink)]"><span className="text-[var(--a-ink-soft)]">Window:</span> {order.metadata.handDelivery.windowLabel}</p>
          )}
          {order.metadata.handDelivery.note && (
            <p className="text-sm text-[var(--a-ink)] mt-1 whitespace-pre-wrap"><span className="text-[var(--a-ink-soft)]">Note:</span> {order.metadata.handDelivery.note}</p>
          )}
        </div>
      )}

      {order.notes && (
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-4 mb-6">
          <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-1">Customer notes</p>
          <p className="text-sm text-[var(--a-ink)] whitespace-pre-wrap">{order.notes}</p>
        </div>
      )}

      {(order.metadata?.attachments?.length ?? 0) > 0 && (
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-2">Customer files</p>
          <ul className="space-y-2">
            {order.metadata!.attachments!.map(a => (
              <li key={a.key}>
                <a
                  href={`/api/admin/r2/${a.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[var(--a-accent)] hover:text-[var(--a-ink)] transition-colors"
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
