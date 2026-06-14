'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Customer { id: string; email: string; name: string }

function centsToDollars(c: number) { return (c / 100).toFixed(2) }
function dollarsToCents(s: string) {
  const n = parseFloat(s.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

export default function NewQuotePage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [email, setEmail] = useState('')
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [lines, setLines] = useState<Array<{ description: string; qty: number; price: string }>>([{ description: '', qty: 1, price: '0.00' }])
  const [notes, setNotes] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/customers').then(r => r.json()).then(j => {
      const parsed = j as { data?: { customers: Customer[] } }
      setCustomers(parsed.data?.customers ?? [])
    })
  }, [])

  const subtotal = lines.reduce((s, l) => s + dollarsToCents(l.price) * l.qty, 0)

  async function save(send: boolean) {
    setSaving(true)
    const res = await fetch('/api/admin/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        email: email || customers.find(c => c.id === customerId)?.email,
        items: lines.filter(l => l.description.trim())
          .map(l => ({ description: l.description, qty: l.qty, unitPriceCents: dollarsToCents(l.price) })),
        notes: notes || undefined,
        expiresAt: expiresAt || null,
      }),
    })
    const json = (await res.json()) as { ok?: boolean; data?: { quote: { id: string } } }
    if (!res.ok || !json.ok) { alert('Failed'); setSaving(false); return }
    const id = json.data!.quote.id
    if (send) await fetch(`/api/admin/quotes/${id}/send`, { method: 'POST' })
    router.push(`/admin/quotes/${id}`)
  }

  function updateLine(i: number, patch: Partial<{ description: string; qty: number; price: string }>) {
    setLines(prev => prev.map((l, idx) => idx === i ? { ...l, ...patch } : l))
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <Link href="/admin/quotes" className="text-xs text-gray-500 hover:text-cream">← Quotes</Link>
      <h1 className="text-2xl font-bold text-cream mt-2 mb-6">New quote</h1>

      <div className="space-y-5">
        <div className="bg-[#16525C] border border-white/5 rounded-xl p-5">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-3 font-semibold">Customer</p>
          <select
            value={customerId ?? ''}
            onChange={e => {
              const v = e.target.value
              setCustomerId(v || null)
              if (v) {
                const c = customers.find(c => c.id === v)
                if (c) setEmail(c.email)
              }
            }}
            className="w-full bg-[#143E38] border border-white/5 rounded-md px-3 py-2 text-sm text-cream outline-none mb-3"
          >
            <option value="">— or enter a new email —</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name || c.email}</option>)}
          </select>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full bg-[#143E38] border border-white/5 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#7FCFD4]"
          />
        </div>

        <div className="bg-[#16525C] border border-white/5 rounded-xl p-5">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-3 font-semibold">Line items</p>
          <div className="space-y-2">
            {lines.map((line, i) => (
              <div key={i} className="grid grid-cols-[1fr_70px_100px_32px] gap-2">
                <input value={line.description} onChange={e => updateLine(i, { description: e.target.value })} placeholder="Description" className="bg-[#143E38] border border-white/5 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#7FCFD4]" />
                <input type="number" value={line.qty} min={1} onChange={e => updateLine(i, { qty: parseInt(e.target.value, 10) || 1 })} className="bg-[#143E38] border border-white/5 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#7FCFD4]" />
                <div className="flex items-center bg-[#143E38] border border-white/5 rounded-md focus-within:border-[#7FCFD4]">
                  <span className="pl-2 text-gray-500 text-sm">$</span>
                  <input value={line.price} onChange={e => updateLine(i, { price: e.target.value })} className="flex-1 bg-transparent px-2 py-2 text-sm text-cream outline-none" />
                </div>
                <button onClick={() => setLines(p => p.filter((_, idx) => idx !== i))} disabled={lines.length === 1} className="text-gray-500 hover:text-red-300">×</button>
              </div>
            ))}
          </div>
          <button onClick={() => setLines(p => [...p, { description: '', qty: 1, price: '0.00' }])} className="mt-3 text-xs text-[#7FCFD4] hover:underline">+ Add line</button>
          <div className="border-t border-white/5 mt-4 pt-3 text-right">
            <p className="text-[11px] uppercase tracking-wider text-gray-500">Total</p>
            <p className="text-xl font-bold text-cream">${centsToDollars(subtotal)}</p>
          </div>
        </div>

        <div className="bg-[#16525C] border border-white/5 rounded-xl p-5">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-gray-500 block mb-1 font-semibold">Valid until (optional)</label>
            <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="w-full bg-[#143E38] border border-white/5 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#7FCFD4]" />
          </div>
          <div className="mt-3">
            <label className="text-[11px] uppercase tracking-wider text-gray-500 block mb-1 font-semibold">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full bg-[#143E38] border border-white/5 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#7FCFD4]" />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => save(false)} disabled={saving || !email} className="px-4 h-9 bg-white/5 hover:bg-white/10 text-cream text-sm font-semibold rounded-md border border-white/10">
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button onClick={() => save(true)} disabled={saving || !email} className="px-4 h-9 bg-[#C46B4D] hover:bg-[#AD5D42] disabled:opacity-60 text-white text-sm font-semibold rounded-md">
            {saving ? 'Sending…' : 'Save & send'}
          </button>
        </div>
      </div>
    </div>
  )
}
