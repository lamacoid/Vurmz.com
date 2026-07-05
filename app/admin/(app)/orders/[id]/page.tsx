'use client'
export const runtime = 'edge'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import PlacementDiagram from '@/components/admin/PlacementDiagram'
import type { BuilderSubmission } from '@/lib/builder/types'
import { reverseOf, type BumpStatus } from '@/lib/admin/transitions'
import { railBump } from '@/lib/admin/rail-client'

interface OrderItem { id: string; nameSnapshot: string; qty: number; unitPriceCents: number; metadata?: { engraving?: { text?: string; fontValue?: string; fontLabel?: string; placement?: string; element?: { id: string; label: string; thumb: string } }; builder?: BuilderSubmission } }
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
    invoiceId?: string
  }
}

interface Customer {
  id: string | null
  name: string | null
  phone: string | null
  company: string | null
  orderCount: number
  lifetimeValueCents: number
}

function money(c: number) { return `$${(c / 100).toFixed(2)}` }

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg|bmp|heic)$/i
function isImage(filename: string) { return IMAGE_EXT.test(filename) }
function fileKind(filename: string): string {
  const m = filename.match(/\.([a-z0-9]+)$/i)
  return m ? m[1].toUpperCase() : 'FILE'
}

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
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [settled, setSettled] = useState(true)
  const [collectBusy, setCollectBusy] = useState(false)
  const [collectNote, setCollectNote] = useState('')

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/admin/orders/${params.id}`)
      .then(r => r.json())
      .then(j => {
        const parsed = j as { data?: { order: Order; items: OrderItem[]; customer?: Customer; settled?: boolean } }
        if (parsed.data) {
          setOrder(parsed.data.order)
          setItems(parsed.data.items)
          setCustomer(parsed.data.customer ?? null)
          setSettled(parsed.data.settled ?? true)
        }
        setLoading(false)
      })
  }, [params?.id])

  async function markCash() {
    if (!order) return
    setCollectBusy(true)
    setCollectNote('')
    try {
      const r = await railBump(order.id, { settle: 'cash' })
      if (r === 'queued') setCollectNote('No connection. The cash mark is saved and will send itself.')
      else { setSettled(true); setCollectNote('Paid. The ticket leaves the rail.') }
    } catch (e) {
      setCollectNote(e instanceof Error ? e.message : 'That did not save. Try again.')
    } finally {
      setCollectBusy(false)
    }
  }

  async function sendInvoiceForOrder() {
    if (!order) return
    setCollectBusy(true)
    setCollectNote('')
    try {
      const created = await fetch(`/api/admin/orders/${order.id}/invoice`, { method: 'POST' })
      const cj = (await created.json()) as { ok?: boolean; data?: { invoice: { id: string; number: string } }; error?: { message?: string } }
      if (!created.ok || !cj.ok || !cj.data) throw new Error(cj.error?.message ?? 'Could not create the invoice.')
      const sent = await fetch(`/api/admin/invoices/${cj.data.invoice.id}/send`, { method: 'POST' })
      if (!sent.ok) {
        setCollectNote(`Invoice ${cj.data.invoice.number} is created but did not send. Open it in Invoices and send from there.`)
      } else {
        setCollectNote(`Invoice ${cj.data.invoice.number} sent. This settles itself when they pay.`)
      }
      setOrder({ ...order, metadata: { ...order.metadata, invoiceId: cj.data.invoice.id } })
    } catch (e) {
      setCollectNote(e instanceof Error ? e.message : 'That did not work. Nothing was sent; try again.')
    } finally {
      setCollectBusy(false)
    }
  }

  async function setStatus(status: string) {
    if (!order) return
    await fetch(`/api/admin/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setOrder({ ...order, status })
  }

  async function undoStep() {
    if (!order) return
    const back = reverseOf(order.status as BumpStatus)
    if (!back) return
    const r = await railBump(order.id, { status: back, expectedStatus: order.status, note: 'undo' }).catch(() => 'stale' as const)
    if (r === 'ok') setOrder({ ...order, status: back })
    else window.location.reload()
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
        <div className="flex flex-col items-end gap-1.5">
          <select
            value={order.status}
            onChange={e => setStatus(e.target.value)}
            className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]"
          >
            {['new','confirmed','in_progress','ready','delivered','cancelled','refunded'].map(s => <option key={s} value={s}>{STATUS_LABEL[s] ?? s}</option>)}
          </select>
          {/* One-step undo (I7): the exact reverse of the last bump, guarded
              by CAS so it can never rewind past where reality actually is. */}
          {reverseOf(order.status as BumpStatus) && (
            <button
              type="button"
              onClick={undoStep}
              className="text-[11px] text-[var(--a-ink-faint)] hover:text-[var(--a-ink)] underline decoration-dotted"
            >
              Undo last step (back to {STATUS_LABEL[reverseOf(order.status as BumpStatus)!] ?? reverseOf(order.status as BumpStatus)})
            </button>
          )}
        </div>
      </div>

      {nextStep(order) && (
        <div className="mb-6 bg-white/[0.04] border-l-2 border-[var(--a-accent)] rounded-lg px-4 py-3">
          <p className="text-sm text-[var(--a-ink)]"><span className="font-semibold">Next step:</span> {nextStep(order)}</p>
        </div>
      )}

      {/* The collect gate (Phase B): delivered but not paid. The ticket
          stays on the rail until this card is satisfied. */}
      {order.status === 'delivered' && !settled && (
        <div id="collect" className="mb-6 bg-[var(--a-panel)] border border-amber-500/40 rounded-xl p-5">
          <p className="text-[11px] uppercase tracking-wider text-amber-400/90 mb-1.5">Collect payment</p>
          <p className="text-sm text-[var(--a-ink)] mb-3">Delivered, not yet paid. <span className="font-semibold">{money(order.totalCents)}</span> outstanding.</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={markCash}
              disabled={collectBusy}
              className="px-4 h-9 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] disabled:opacity-60 text-white text-sm font-semibold rounded-md"
            >
              Mark paid, cash
            </button>
            {order.metadata?.invoiceId ? (
              <Link href={`/admin/invoices/${order.metadata.invoiceId as string}`} className="px-4 h-9 inline-flex items-center border border-[var(--a-line)] text-[var(--a-ink)] text-sm rounded-md hover:border-[var(--a-accent)]">
                Invoice sent · settles itself when paid
              </Link>
            ) : (
              <button
                type="button"
                onClick={sendInvoiceForOrder}
                disabled={collectBusy}
                className="px-4 h-9 border border-[var(--a-line)] text-[var(--a-ink)] text-sm rounded-md hover:border-[var(--a-accent)] disabled:opacity-60"
              >
                {collectBusy ? 'Working…' : 'Create and send the invoice'}
              </button>
            )}
          </div>
          {collectNote && <p className="text-xs text-[var(--a-accent)] mt-2">{collectNote}</p>}
        </div>
      )}

      {/* What to make — the at-a-glance job card so the actual ask is never buried */}
      <div className="mb-6 bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5">
        <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-3">What to make</p>
        <ul className="space-y-3">
          {items.map(it => {
            const eng = it.metadata?.engraving
            const builder = it.metadata?.builder
            const hasFiles = (order.metadata?.attachments?.length ?? 0) > 0
            if (builder) {
              return (
                <li key={it.id} className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-[var(--a-ink)]">{it.qty}× {it.nameSnapshot} · customer-designed layout</p>
                  <PlacementDiagram submission={builder} />
                  <p className="text-xs text-[var(--a-ink-soft)]">Match this as closely as the material allows, then send the proof.</p>
                </li>
              )
            }
            return (
              <li key={it.id} className="flex gap-3">
                {eng?.element?.thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={eng.element.thumb} alt="" className="h-12 w-12 flex-shrink-0 object-contain bg-[#f0ebe0] rounded p-1" />
                ) : (
                  <span className="h-12 w-12 flex-shrink-0 rounded bg-white/5 grid place-items-center text-lg" aria-hidden>🛠️</span>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--a-ink)]">{it.qty}× {it.nameSnapshot}</p>
                  {eng?.text ? (
                    <p className="text-sm text-[var(--a-ink-soft)]">Engrave <span className="text-[var(--a-ink)] font-medium">“{eng.text}”</span>{eng.fontLabel ? ` in ${eng.fontLabel}` : ''}{eng.placement ? ` · ${eng.placement}` : ''}</p>
                  ) : (
                    <p className="text-sm text-[var(--a-ink-faint)]">No engraving text given{hasFiles ? ' — check the customer file below' : ''}</p>
                  )}
                  {eng?.element && (
                    <p className="text-sm text-[var(--a-ink-soft)]">Design: <span className="text-[var(--a-ink)]">{eng.element.label}</span></p>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
        {(order.metadata?.attachments?.length ?? 0) > 0 && (
          <p className="text-xs text-[var(--a-ink-faint)] mt-3 pt-3 border-t border-[var(--a-line)]">📎 {order.metadata!.attachments!.length} customer file{order.metadata!.attachments!.length === 1 ? '' : 's'} attached — see previews below.</p>
        )}
        {order.notes && (
          <p className="text-sm text-[var(--a-ink-soft)] mt-3 pt-3 border-t border-[var(--a-line)] whitespace-pre-wrap"><span className="text-[var(--a-ink-faint)]">Note from customer:</span> {order.notes}</p>
        )}
      </div>

      {/* Proof workflow — the promise is "nothing engraves until approved" */}
      <div className="flex items-center gap-2 mb-6 bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl px-4 py-3">
        <span className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mr-1">Proof</span>
        {([['needed', 'Needed'], ['sent', 'Sent to customer'], ['approved', 'Approved ✓']] as const).map(([key, label]) => {
          const current = order.metadata?.proof?.status === key
          const accent = key === 'approved' ? 'border-[var(--a-accent)] bg-[var(--a-accent)]/15 text-[var(--a-accent)]' : key === 'sent' ? 'border-sky-400 bg-sky-400/15 text-sky-300' : 'border-amber-400 bg-amber-400/15 text-amber-300'
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
          {customer?.name
            ? <p className="text-sm font-medium text-[var(--a-ink)]">{customer.name}</p>
            : <p className="text-sm font-medium text-[var(--a-ink-faint)]">Guest (no name on file)</p>}
          <p className="text-xs text-[var(--a-ink-soft)] break-all">{order.email}</p>
          {customer?.company && <p className="text-xs text-[var(--a-ink-soft)]">{customer.company}</p>}
          {customer && customer.orderCount > 1 && (
            <p className="text-[11px] text-[var(--a-accent)] mt-1">Returning · {customer.orderCount} orders · {money(customer.lifetimeValueCents)} lifetime</p>
          )}
          {customer?.id && customer.orderCount <= 1 && (
            <p className="text-[11px] text-[var(--a-ink-faint)] mt-1">Known contact</p>
          )}
          <div className="flex gap-2 mt-2">
            <a href={`mailto:${order.email}`} className="text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[var(--a-ink-soft)] hover:text-[var(--a-ink)] transition-colors">Email</a>
            {(customer?.phone || order.fulfillmentAddress?.phone) && (
              <a href={`sms:${customer?.phone || order.fulfillmentAddress?.phone}`} className="text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[var(--a-ink-soft)] hover:text-[var(--a-ink)] transition-colors">Text</a>
            )}
            {customer?.id && (
              <Link href={`/admin/customers/${customer.id}`} className="text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[var(--a-ink-soft)] hover:text-[var(--a-ink)] transition-colors">Profile</Link>
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
                  <p className="text-xs mt-1 inline-flex items-center gap-1.5 bg-[var(--a-accent)]/10 border border-[var(--a-accent)]/30 text-[var(--a-accent)] rounded px-2 py-1">
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
        <div className="bg-[var(--a-accent)]/10 border border-[var(--a-accent)]/30 rounded-xl p-4 mb-6">
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
          <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-3">Customer files</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {order.metadata!.attachments!.map(a => {
              const href = `/api/admin/r2/${a.key}`
              return (
                <a
                  key={a.key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg border border-[var(--a-line)] overflow-hidden hover:border-[var(--a-accent)] transition-colors"
                  title={a.filename}
                >
                  {isImage(a.filename) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={href} alt={a.filename} className="h-32 w-full object-contain bg-[#f0ebe0]" loading="lazy" />
                  ) : (
                    <div className="h-32 w-full grid place-items-center bg-white/5">
                      <div className="text-center">
                        <div className="text-3xl" aria-hidden>📄</div>
                        <div className="mt-1 text-[10px] font-mono text-[var(--a-ink-faint)]">{fileKind(a.filename)}</div>
                      </div>
                    </div>
                  )}
                  <p className="px-2 py-1.5 text-[11px] text-[var(--a-ink-soft)] group-hover:text-[var(--a-ink)] truncate">{a.filename}</p>
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
