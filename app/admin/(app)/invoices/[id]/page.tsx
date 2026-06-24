'use client'
export const runtime = 'edge'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Item { id: string; description: string; qty: number; unitPriceCents: number; totalCents: number }
interface Invoice {
  id: string; number: string; status: string; customerId: string; subtotalCents: number;
  taxCents: number; totalCents: number; amountPaidCents: number; dueDate: string | null;
  notes: string; sentAt: string | null; viewedAt: string | null; paidAt: string | null; createdAt: string
}

function money(c: number) { return `$${(c / 100).toFixed(2)}` }

export default function AdminInvoiceDetail() {
  const params = useParams<{ id: string }>()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const load = useCallback(async () => {
    if (!params?.id) return
    const res = await fetch(`/api/admin/invoices/${params.id}`)
    const json = (await res.json()) as { data?: { invoice: Invoice; items: Item[] } }
    if (json.data) { setInvoice(json.data.invoice); setItems(json.data.items) }
    setLoading(false)
  }, [params?.id])

  useEffect(() => { load() }, [load])

  async function send() {
    if (!invoice) return
    setSending(true)
    await fetch(`/api/admin/invoices/${invoice.id}/send`, { method: 'POST' })
    setSending(false)
    load()
  }

  async function setStatus(status: string) {
    if (!invoice) return
    await fetch(`/api/admin/invoices/${invoice.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    load()
  }

  if (loading) return <div className="p-8 text-[var(--a-ink-faint)] text-sm">Loading…</div>
  if (!invoice) return <div className="p-8 text-[var(--a-ink-soft)] text-sm">Invoice not found.</div>

  const owed = invoice.totalCents - invoice.amountPaidCents

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <Link href="/admin/invoices" className="text-xs text-[var(--a-ink-faint)] hover:text-[var(--a-ink)]">← Invoices</Link>
      <div className="flex items-start justify-between mt-2 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--a-ink)] font-mono">{invoice.number}</h1>
          <p className="text-xs text-[var(--a-ink-faint)] mt-1">Created {new Date(invoice.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
          {invoice.status === 'draft' && (
            <button onClick={send} disabled={sending} className="px-4 h-9 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] text-white text-sm font-semibold rounded-md">
              {sending ? 'Sending…' : 'Send invoice'}
            </button>
          )}
          <select
            value={invoice.status}
            onChange={e => setStatus(e.target.value)}
            className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-md px-3 py-2 text-xs text-[var(--a-ink)] outline-none focus:border-[#7FCFD4]"
          >
            {['draft','sent','viewed','paid','partially_paid','overdue','void','refunded'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-xs">
        <Pill label="Sent" value={invoice.sentAt ? new Date(invoice.sentAt).toLocaleDateString() : '—'} />
        <Pill label="Viewed" value={invoice.viewedAt ? new Date(invoice.viewedAt).toLocaleDateString() : '—'} />
        <Pill label="Paid" value={invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : '—'} />
        <Pill label="Due" value={invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'On receipt'} />
      </div>

      <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5 mb-5">
        <div className="divide-y divide-[var(--a-line)]">
          {items.map(it => (
            <div key={it.id} className="py-2 flex justify-between">
              <div>
                <p className="text-sm text-[var(--a-ink)]">{it.description}</p>
                <p className="text-[11px] text-[var(--a-ink-faint)]">{it.qty} × {money(it.unitPriceCents)}</p>
              </div>
              <p className="text-sm font-semibold text-[var(--a-ink)]">{money(it.totalCents)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--a-line)] mt-3 pt-3 space-y-1 text-sm">
          <Row label="Subtotal" value={money(invoice.subtotalCents)} />
          {invoice.taxCents > 0 && <Row label="Tax" value={money(invoice.taxCents)} />}
          <Row label="Total" value={money(invoice.totalCents)} bold />
          {invoice.amountPaidCents > 0 && <Row label="Paid" value={`−${money(invoice.amountPaidCents)}`} accent />}
          {owed > 0 && <Row label="Amount due" value={money(owed)} bold coral />}
        </div>
      </div>

      {invoice.notes && (
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-1">Notes</p>
          <p className="text-sm text-[var(--a-ink)] whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}
    </div>
  )
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-lg px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-[var(--a-ink-faint)]">{label}</p>
      <p className="text-sm text-[var(--a-ink)] truncate">{value}</p>
    </div>
  )
}

function Row({ label, value, bold, accent, coral }: { label: string; value: string; bold?: boolean; accent?: boolean; coral?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={`${bold ? 'text-[var(--a-ink)] font-bold' : 'text-[var(--a-ink-soft)]'}`}>{label}</span>
      <span className={`${bold ? 'text-[var(--a-ink)] font-bold' : accent ? 'text-[var(--a-accent)]' : coral ? 'text-[var(--a-cta)] font-bold' : 'text-[var(--a-ink)]'}`}>{value}</span>
    </div>
  )
}
