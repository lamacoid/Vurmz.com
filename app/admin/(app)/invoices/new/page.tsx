'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@/components/admin/icons'

interface Customer { id: string; email: string; name: string; company: string | null }

function centsToDollars(c: number) { return (c / 100).toFixed(2) }
function dollarsToCents(s: string) {
  const n = parseFloat(s.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerId, setCustomerId] = useState('')
  const [lines, setLines] = useState<Array<{ description: string; qty: number; price: string }>>([{ description: '', qty: 1, price: '0.00' }])
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/customers').then(r => r.json()).then(j => {
      const parsed = j as { data?: { customers: Customer[] } }
      setCustomers(parsed.data?.customers ?? [])
    })
  }, [])

  const subtotal = lines.reduce((s, l) => s + dollarsToCents(l.price) * l.qty, 0)

  async function save(send: boolean) {
    if (!customerId) { alert('Choose a customer'); return }
    setSaving(true)
    const res = await fetch('/api/admin/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        items: lines
          .filter(l => l.description.trim().length > 0)
          .map(l => ({ description: l.description, qty: l.qty, unitPriceCents: dollarsToCents(l.price) })),
        dueDate: dueDate || null,
        notes: notes || undefined,
      }),
    })
    const json = (await res.json()) as { ok?: boolean; data?: { invoice: { id: string } }; error?: unknown }
    if (!res.ok || !json.ok) {
      alert('Failed: ' + JSON.stringify(json.error))
      setSaving(false)
      return
    }
    const id = json.data!.invoice.id
    if (send) {
      await fetch(`/api/admin/invoices/${id}/send`, { method: 'POST' })
    }
    router.push(`/admin/invoices/${id}`)
  }

  function updateLine(i: number, patch: Partial<{ description: string; qty: number; price: string }>) {
    setLines(prev => prev.map((l, idx) => idx === i ? { ...l, ...patch } : l))
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <Link href="/admin/invoices" className="text-xs text-[var(--a-ink-faint)] hover:text-[var(--a-ink)]">← Invoices</Link>
      <h1 className="text-2xl font-bold text-[var(--a-ink)] mt-2 mb-6">New invoice</h1>

      <div className="space-y-5">
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5">
          <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-3 font-semibold">Customer</p>
          <select
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[#7FCFD4]"
          >
            <option value="">Choose a customer…</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name || c.email}{c.company ? ` · ${c.company}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5">
          <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-3 font-semibold">Line items</p>
          <div className="space-y-2">
            {lines.map((line, i) => (
              <div key={i} className="grid grid-cols-[1fr_70px_100px_32px] gap-2 items-center">
                <input
                  value={line.description}
                  onChange={e => updateLine(i, { description: e.target.value })}
                  placeholder="Description"
                  className="bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[#7FCFD4]"
                />
                <input
                  type="number"
                  value={line.qty}
                  min={1}
                  onChange={e => updateLine(i, { qty: parseInt(e.target.value, 10) || 1 })}
                  className="bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[#7FCFD4]"
                />
                <div className="flex items-center bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md focus-within:border-[#7FCFD4]">
                  <span className="pl-2 text-[var(--a-ink-faint)] text-sm">$</span>
                  <input
                    value={line.price}
                    onChange={e => updateLine(i, { price: e.target.value })}
                    className="flex-1 bg-transparent px-2 py-2 text-sm text-[var(--a-ink)] outline-none"
                  />
                </div>
                <button
                  onClick={() => setLines(prev => prev.filter((_, idx) => idx !== i))}
                  className="text-[var(--a-ink-faint)] hover:text-red-300"
                  disabled={lines.length === 1}
                  aria-label="Remove line"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setLines(prev => [...prev, { description: '', qty: 1, price: '0.00' }])}
            className="mt-3 text-xs text-[var(--a-accent)] hover:underline"
          >
            + Add line
          </button>
          <div className="border-t border-[var(--a-line)] mt-4 pt-3 text-right">
            <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)]">Subtotal</p>
            <p className="text-xl font-bold text-[var(--a-ink)]">${centsToDollars(subtotal)}</p>
          </div>
        </div>

        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-1 font-semibold">Due date (optional)</p>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[#7FCFD4]"
              />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-1 font-semibold">Notes (optional)</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[#7FCFD4]"
              placeholder="Anything the customer should know about this invoice."
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="px-4 h-9 bg-white/5 hover:bg-white/10 text-[var(--a-ink)] text-sm font-semibold rounded-md border border-[var(--a-line)]"
          >
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving || !customerId}
            className="px-4 h-9 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] disabled:opacity-60 text-white text-sm font-semibold rounded-md"
          >
            {saving ? 'Sending…' : 'Save & send'}
          </button>
        </div>
      </div>
    </div>
  )
}
