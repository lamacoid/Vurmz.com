'use client'
/**
 * The order wizard (RAIL-SYSTEM-PLAN Phase A): any order from anywhere
 * enters the rail here. Phone call, walk-in, Bark lead, text. Catalog
 * lines are priced by the server through the same path as web checkout
 * (the preview below IS a dry run of the create call, so preview and
 * order can never disagree). Drafts autosave locally: a dropped phone
 * call loses nothing.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Customer { id: string; email: string; name: string; phone?: string | null }
interface Product { id: string; name: string; priceCents: number; packSize: number }

type Line =
  | { kind: 'catalog'; productId: string; qty: number; override: string; engraving: string }
  | { kind: 'custom'; name: string; qty: number; price: string; engraving: string }

interface Draft {
  customerId: string | null
  newName: string
  newEmail: string
  newPhone: string
  lines: Line[]
  fulfillment: 'pickup' | 'hand_deliver' | 'ship'
  payment: 'collect_later' | 'invoice_later' | 'cash_now'
  business: boolean
  notes: string
}

const EMPTY: Draft = {
  customerId: null, newName: '', newEmail: '', newPhone: '',
  lines: [], fulfillment: 'pickup', payment: 'collect_later', business: false, notes: '',
}
const DRAFT_KEY = 'vurmz-admin-neworder-draft'

function dollars(c: number) { return `$${(c / 100).toFixed(2)}` }
function toCents(s: string): number | undefined {
  const t = s.trim()
  if (!t) return undefined
  const n = parseFloat(t.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? Math.round(n * 100) : undefined
}

export default function NewOrderPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [d, setD] = useState<Draft>(EMPTY)
  const [restored, setRestored] = useState(false)
  const [preview, setPreview] = useState<{ items: Array<{ name: string; qty: number; unitPriceCents: number; overridden: boolean }>; subtotalCents: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restore the draft before anything else: nothing gets lost (I1).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const saved = { ...EMPTY, ...(JSON.parse(raw) as Draft) }
        // Only worth announcing when there is actually something in it.
        const hasContent = saved.lines.length > 0 || !!saved.newName.trim() || !!saved.customerId || !!saved.notes.trim()
        if (hasContent) { setD(saved); setRestored(true) }
      }
    } catch { /* corrupt draft loses to a clean slate */ }
    fetch('/api/admin/customers').then(r => r.json()).then(j => setCustomers((j as { data?: { customers: Customer[] } }).data?.customers ?? []))
    fetch('/api/admin/products').then(r => r.json()).then(j => setProducts((j as { data?: { products: Product[] } }).data?.products ?? []))
  }, [])

  // Autosave on every change.
  useEffect(() => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)) } catch { /* storage full: the form itself still holds state */ }
  }, [d])

  const payloadLines = useCallback(() => d.lines
    .filter(l => (l.kind === 'catalog' ? !!l.productId : !!l.name.trim()))
    .map(l => l.kind === 'catalog'
      ? { kind: 'catalog' as const, productId: l.productId, qty: l.qty, overrideCents: toCents(l.override), ...(l.engraving.trim() ? { engraving: { text: l.engraving.trim() } } : {}) }
      : { kind: 'custom' as const, name: l.name.trim(), qty: l.qty, unitPriceCents: toCents(l.price) ?? 0, ...(l.engraving.trim() ? { engraving: { text: l.engraving.trim() } } : {}) }),
    [d.lines])

  // The live total is a dry run of the real create call, debounced.
  useEffect(() => {
    if (previewTimer.current) clearTimeout(previewTimer.current)
    const lines = payloadLines()
    if (lines.length === 0) { setPreview(null); return }
    previewTimer.current = setTimeout(async () => {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun: true, customer: { name: 'preview' }, lines, fulfillmentMethod: d.fulfillment, isBusinessOrder: d.business, payment: d.payment }),
      }).catch(() => null)
      const json = (await res?.json().catch(() => null)) as { ok?: boolean; data?: { items: Array<{ name: string; qty: number; unitPriceCents: number; overridden: boolean }>; subtotalCents: number } } | null
      setPreview(json?.ok && json.data ? json.data : null)
    }, 350)
  }, [payloadLines, d.fulfillment, d.business, d.payment])

  function patchLine(i: number, patch: Partial<Line>) {
    setD(prev => ({ ...prev, lines: prev.lines.map((l, idx) => (idx === i ? { ...l, ...patch } as Line : l)) }))
  }

  async function create() {
    setError(null)
    const lines = payloadLines()
    if (lines.length === 0) { setError('Add at least one item.'); return }
    const customer = d.customerId
      ? { id: d.customerId }
      : d.newName.trim()
        ? { name: d.newName.trim(), ...(d.newEmail.trim() ? { email: d.newEmail.trim() } : {}), ...(d.newPhone.trim() ? { phone: d.newPhone.trim() } : {}) }
        : null
    if (!customer) { setError('Pick a customer or enter a name.'); return }
    setSaving(true)
    const res = await fetch('/api/admin/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer, lines, fulfillmentMethod: d.fulfillment, isBusinessOrder: d.business, payment: d.payment, notes: d.notes || undefined }),
    })
    const json = (await res.json().catch(() => null)) as { ok?: boolean; data?: { order: { id: string } }; error?: { message?: string } } | null
    if (!res.ok || !json?.ok || !json.data) {
      setError(json?.error?.message ?? 'That did not save. Nothing was created; your draft is still here.')
      setSaving(false)
      return
    }
    localStorage.removeItem(DRAFT_KEY)
    router.push(`/admin/orders/${json.data.order.id}`)
  }

  const input = 'bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)]'
  const chip = (on: boolean) => `px-3 py-1.5 rounded-md border text-sm transition-colors ${on ? 'border-[var(--a-accent)] text-[var(--a-ink)] font-semibold bg-[var(--a-accent)]/10' : 'border-[var(--a-line)] text-[var(--a-ink-faint)]'}`

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <Link href="/admin/orders" className="text-xs text-[var(--a-ink-faint)] hover:text-[var(--a-ink)]">← Orders</Link>
      <h1 className="text-2xl font-bold text-[var(--a-ink)] mt-2 mb-1">New order</h1>
      <p className="text-sm text-[var(--a-ink-faint)] mb-6">Phone, walk-in, text, wherever it came from. It lands on the rail like any other order.</p>
      {restored && <p className="text-xs text-[var(--a-accent)] mb-4">Picked up where you left off. <button className="underline" onClick={() => { localStorage.removeItem(DRAFT_KEY); setD(EMPTY); setRestored(false) }}>Start fresh instead</button></p>}

      <div className="space-y-5">
        {/* WHO */}
        <section className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5">
          <h2 className="text-xs uppercase tracking-wider text-[var(--a-ink-faint)] mb-3">Who is it for</h2>
          <select
            className={`${input} w-full`}
            value={d.customerId ?? ''}
            onChange={e => setD({ ...d, customerId: e.target.value || null })}
          >
            <option value="">New customer…</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name || c.email}</option>)}
          </select>
          {!d.customerId && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
              <input className={input} placeholder="Name" value={d.newName} onChange={e => setD({ ...d, newName: e.target.value })} />
              <input className={input} placeholder="Email (optional)" value={d.newEmail} onChange={e => setD({ ...d, newEmail: e.target.value })} />
              <input className={input} placeholder="Phone (optional)" value={d.newPhone} onChange={e => setD({ ...d, newPhone: e.target.value })} />
            </div>
          )}
        </section>

        {/* WHAT */}
        <section className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5">
          <h2 className="text-xs uppercase tracking-wider text-[var(--a-ink-faint)] mb-3">What they&rsquo;re getting</h2>
          <div className="space-y-3">
            {d.lines.map((l, i) => (
              <div key={i} className="border border-[var(--a-line)] rounded-md p-3 space-y-2">
                {l.kind === 'catalog' ? (
                  <div className="grid grid-cols-[1fr_64px] gap-2">
                    <select className={input} value={l.productId} onChange={e => patchLine(i, { productId: e.target.value })}>
                      <option value="">Pick a product…</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} · {dollars(p.priceCents)}</option>)}
                    </select>
                    <input className={input} type="number" min={1} max={999} value={l.qty} onChange={e => patchLine(i, { qty: Math.max(1, Number(e.target.value) || 1) })} />
                  </div>
                ) : (
                  <div className="grid grid-cols-[1fr_64px_90px] gap-2">
                    <input className={input} placeholder="What is it" value={l.name} onChange={e => patchLine(i, { name: e.target.value })} />
                    <input className={input} type="number" min={1} max={999} value={l.qty} onChange={e => patchLine(i, { qty: Math.max(1, Number(e.target.value) || 1) })} />
                    <input className={input} placeholder="$ each" value={l.price} onChange={e => patchLine(i, { price: e.target.value })} />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-2">
                  <input className={input} placeholder="Engraving text (optional)" value={l.engraving} onChange={e => patchLine(i, { engraving: e.target.value })} />
                  {l.kind === 'catalog' && (
                    <input className={input} placeholder="$ override" value={l.override} onChange={e => patchLine(i, { override: e.target.value })} />
                  )}
                </div>
                <button type="button" className="text-xs text-[var(--a-ink-faint)] hover:text-[var(--a-danger,#e66)]" onClick={() => setD(prev => ({ ...prev, lines: prev.lines.filter((_, idx) => idx !== i) }))}>Remove line</button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-3">
            <button type="button" className="text-xs text-[var(--a-accent)] hover:underline" onClick={() => setD(prev => ({ ...prev, lines: [...prev.lines, { kind: 'catalog', productId: '', qty: 1, override: '', engraving: '' }] }))}>+ From the catalog</button>
            <button type="button" className="text-xs text-[var(--a-accent)] hover:underline" onClick={() => setD(prev => ({ ...prev, lines: [...prev.lines, { kind: 'custom', name: '', qty: 1, price: '', engraving: '' }] }))}>+ Custom item</button>
          </div>
          <label className="flex items-center gap-2 mt-4 text-sm text-[var(--a-ink-faint)]">
            <input type="checkbox" checked={d.business} onChange={e => setD({ ...d, business: e.target.checked })} />
            Business order (volume tiers apply automatically)
          </label>
        </section>

        {/* HOW & MONEY */}
        <section className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-xs uppercase tracking-wider text-[var(--a-ink-faint)] mb-2">Getting it to them</h2>
            <div className="flex flex-wrap gap-2">
              {([['pickup', 'Pickup'], ['hand_deliver', 'I deliver'], ['ship', 'Ship']] as const).map(([v, label]) => (
                <button key={v} type="button" className={chip(d.fulfillment === v)} onClick={() => setD({ ...d, fulfillment: v })}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-wider text-[var(--a-ink-faint)] mb-2">Money</h2>
            <div className="flex flex-wrap gap-2">
              {([['collect_later', 'Collect at delivery'], ['invoice_later', 'Invoice them'], ['cash_now', 'Paid cash just now']] as const).map(([v, label]) => (
                <button key={v} type="button" className={chip(d.payment === v)} onClick={() => setD({ ...d, payment: v })}>{label}</button>
              ))}
            </div>
            <p className="text-xs text-[var(--a-ink-faint)] mt-1.5">Unpaid orders stay on the rail after delivery until the money is settled.</p>
          </div>
          <textarea className={`${input} w-full min-h-[64px]`} placeholder="Notes (what they said on the phone, due date, anything)" value={d.notes} onChange={e => setD({ ...d, notes: e.target.value })} />
        </section>

        {/* TOTAL: a dry run of the real create call. */}
        <section className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5">
          {preview ? (
            <div className="space-y-1">
              {preview.items.map((it, i) => (
                <div key={i} className="flex justify-between text-sm text-[var(--a-ink)]">
                  <span>{it.qty} × {it.name}{it.overridden && <span className="text-[var(--a-accent)]"> (override)</span>}</span>
                  <span>{dollars(it.unitPriceCents * it.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between text-base font-bold text-[var(--a-ink)] pt-2 border-t border-[var(--a-line)] mt-2">
                <span>Total</span><span>{dollars(preview.subtotalCents)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--a-ink-faint)]">The total shows here as you add items, priced exactly how checkout would price them.</p>
          )}
        </section>

        {error && <p className="text-sm text-[#e88]">{error}</p>}
        <button
          type="button"
          disabled={saving}
          onClick={create}
          className="w-full py-3 rounded-md bg-[var(--a-accent)] text-[#10282c] font-bold text-sm disabled:opacity-50"
        >
          {saving ? 'Creating…' : 'Create the order'}
        </button>
      </div>
    </div>
  )
}
