'use client'
export const runtime = 'edge'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Item { id: string; nameSnapshot: string; qty: number; unitPriceCents: number }
interface Address { name?: string; line1?: string; line2?: string | null; city?: string; state?: string; postalCode?: string }
interface OrderEvent {
  id: string; type: string; fromStatus: string | null; toStatus: string | null; note: string | null; createdAt: string
}
interface Order {
  id: string; number: string; status: string; email: string
  subtotalCents: number; fulfillmentFeeCents: number; totalCents: number
  fulfillmentMethod: string; fulfillmentAddress: Address | null; notes: string; createdAt: string
  trackingNumber: string | null; fulfillmentEta: string | null
}

function money(c: number) { return `$${(c / 100).toFixed(2)}` }

const STATUS_LABELS: Record<string, string> = {
  new: 'New', confirmed: 'Confirmed', in_progress: 'In progress', ready: 'Ready',
  delivered: 'Delivered', cancelled: 'Cancelled', refunded: 'Refunded',
}

// Map each status to a pill color. Default keeps the original teal.
const STATUS_STYLES: Record<string, string> = {
  new: 'bg-[#6BB8B2]/20 text-[#6BB8B2]',
  confirmed: 'bg-[#6BB8B2]/20 text-[#6BB8B2]',
  in_progress: 'bg-amber-400/15 text-amber-300',
  ready: 'bg-indigo-400/15 text-indigo-300',
  delivered: 'bg-emerald-400/15 text-emerald-300',
  cancelled: 'bg-gray-400/15 text-gray-400',
  refunded: 'bg-red-400/15 text-red-300',
}

function statusLabel(s: string | null | undefined) {
  if (!s) return ''
  return STATUS_LABELS[s] ?? s.replace(/_/g, ' ')
}

function fmtDate(iso: string) {
  const d = new Date(iso.includes('T') ? iso : iso.replace(' ', 'T') + 'Z')
  if (isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function eventLabel(e: OrderEvent) {
  if (e.type === 'created') return 'Order placed'
  if (e.type === 'status_change' && e.toStatus) return statusLabel(e.toStatus)
  return statusLabel(e.toStatus) || e.type.replace(/_/g, ' ')
}

export default function AccountOrderDetail() {
  const params = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [events, setEvents] = useState<OrderEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/account/orders/${params.id}`)
      .then(r => r.json())
      .then(j => {
        const parsed = j as { data?: { order: Order; items: Item[]; events?: OrderEvent[] } }
        if (parsed.data) { setOrder(parsed.data.order); setItems(parsed.data.items); setEvents(parsed.data.events ?? []) }
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
        <span className={`text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold ${STATUS_STYLES[order.status] ?? 'bg-[#6BB8B2]/20 text-[#6BB8B2]'}`}>
          {statusLabel(order.status)}
        </span>
      </div>

      <div className="bg-[#235158] border border-white/5 rounded-xl p-5 mb-5">
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

      {(order.trackingNumber || order.fulfillmentEta) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {order.trackingNumber && (
            <div className="bg-[#235158] border border-white/5 rounded-xl p-4">
              <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Tracking number</p>
              <p className="text-sm text-cream font-mono break-all">{order.trackingNumber}</p>
            </div>
          )}
          {order.fulfillmentEta && (
            <div className="bg-[#235158] border border-white/5 rounded-xl p-4">
              <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Estimated fulfillment</p>
              <p className="text-sm text-cream">{order.fulfillmentEta}</p>
            </div>
          )}
        </div>
      )}

      {events.length > 0 && (
        <div className="bg-[#235158] border border-white/5 rounded-xl p-5 mb-5">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-4 font-semibold">Status timeline</p>
          <ol className="space-y-0">
            {events.map((e, i) => (
              <li key={e.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${i === events.length - 1 ? 'bg-[#6BB8B2]' : 'bg-gray-500'}`} />
                  {i < events.length - 1 && <span className="w-px flex-1 bg-white/10 my-0.5" />}
                </div>
                <div className="pb-4 min-w-0">
                  <p className="text-sm text-cream">{eventLabel(e)}</p>
                  <p className="text-[11px] text-gray-500">{fmtDate(e.createdAt)}</p>
                  {e.note && <p className="text-xs text-gray-400 mt-0.5">{e.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="bg-[#235158] border border-white/5 rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Fulfillment</p>
          <p className="text-sm text-cream">{order.fulfillmentMethod.replace('_', ' ')}</p>
        </div>
        {order.fulfillmentAddress && (
          <div className="bg-[#235158] border border-white/5 rounded-xl p-4">
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
        <div className="bg-[#235158] border border-white/5 rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Your notes</p>
          <p className="text-sm text-cream whitespace-pre-wrap">{order.notes}</p>
        </div>
      )}
    </div>
  )
}
