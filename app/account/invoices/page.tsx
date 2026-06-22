'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Invoice {
  id: string; number: string; status: string; totalCents: number; amountPaidCents: number; dueDate: string | null; createdAt: string
}

function money(c: number) { return `$${(c / 100).toFixed(2)}` }

const statusColors: Record<string, string> = {
  sent:           'bg-[#7FCFD4]/20 text-[#7FCFD4]',
  viewed:         'bg-[#7FCFD4]/20 text-[#7FCFD4]',
  paid:           'bg-green-900/30 text-green-300',
  partially_paid: 'bg-yellow-900/30 text-yellow-300',
  overdue:        'bg-red-900/30 text-red-300',
  void:           'bg-white/5 text-[var(--ink-soft)]',
  refunded:       'bg-white/5 text-[var(--ink-soft)]',
}

export default function AccountInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/account/invoices')
      .then(r => r.json())
      .then(j => {
        const parsed = j as { data?: { invoices: Invoice[] } }
        setInvoices(parsed.data?.invoices ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10">
      <Link href="/account" className="text-xs text-[var(--ink-soft)] hover:text-[var(--ink)] mb-4 inline-block">← Back</Link>
      <h1 className="text-2xl font-bold text-[var(--ink)] mb-6">Invoices</h1>

      {loading ? (
        <p className="text-[var(--ink-soft)] text-sm">Loading…</p>
      ) : invoices.length === 0 ? (
        <div className="bg-[var(--page)] border border-white/5 rounded-xl p-10 text-center text-[var(--ink-soft)] text-sm">
          No invoices yet.
        </div>
      ) : (
        <div className="space-y-2">
          {invoices.map(inv => {
            const owed = inv.totalCents - inv.amountPaidCents
            return (
              <Link
                key={inv.id}
                href={`/account/invoices/${inv.id}`}
                className="block bg-[var(--page)] border border-white/5 hover:border-[#7FCFD4]/30 rounded-xl p-4 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-mono text-[var(--ink)]">{inv.number}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${statusColors[inv.status] ?? 'bg-white/5 text-[var(--ink-soft)]'}`}>
                    {inv.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <p className="text-[var(--ink-soft)]">
                    {inv.dueDate ? `Due ${new Date(inv.dueDate).toLocaleDateString()}` : `Sent ${new Date(inv.createdAt).toLocaleDateString()}`}
                  </p>
                  <p className="text-[var(--ink)]">
                    {inv.status === 'paid' ? `Paid ${money(inv.totalCents)}` : `${money(owed)} due`}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
