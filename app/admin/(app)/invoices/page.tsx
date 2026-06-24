'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/admin/icons'

interface Invoice {
  id: string; number: string; customerId: string; status: string; totalCents: number; amountPaidCents: number; dueDate: string | null; createdAt: string
}

function money(c: number) { return `$${(c / 100).toFixed(2)}` }

const STATUS_COLORS: Record<string, string> = {
  draft:          'bg-white/5 text-[var(--a-ink-soft)] border-[var(--a-line)]',
  sent:           'bg-[#7FCFD4]/10 text-[var(--a-accent)] border-[#7FCFD4]/20',
  viewed:         'bg-[#7FCFD4]/15 text-[var(--a-accent)] border-[#7FCFD4]/30',
  paid:           'bg-green-900/25 text-green-300 border-green-800/40',
  partially_paid: 'bg-yellow-900/25 text-yellow-300 border-yellow-800/40',
  overdue:        'bg-red-900/25 text-red-300 border-red-800/40',
  void:           'bg-white/5 text-[var(--a-ink-faint)] border-[var(--a-line)]',
  refunded:       'bg-white/5 text-[var(--a-ink-faint)] border-[var(--a-line)]',
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/invoices')
      .then(r => r.json())
      .then(j => {
        const parsed = j as { data?: { invoices: Invoice[] } }
        setInvoices(parsed.data?.invoices ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--a-ink)]">Invoices</h1>
          <p className="text-sm text-[var(--a-ink-faint)] mt-1">Create, send, and track invoices.</p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="inline-flex items-center gap-2 px-4 h-9 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] text-white text-sm font-semibold rounded-md"
        >
          <Icon name="plus" className="w-4 h-4" />
          New invoice
        </Link>
      </div>

      {loading ? (
        <div className="text-[var(--a-ink-faint)] text-sm">Loading…</div>
      ) : invoices.length === 0 ? (
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-10 text-center">
          <Icon name="file-invoice" className="w-8 h-8 text-[var(--a-ink-faint)] mx-auto mb-3" />
          <p className="text-[var(--a-ink)] text-sm font-semibold mb-1">No invoices yet</p>
          <p className="text-[var(--a-ink-faint)] text-xs mb-5">Create your first invoice to bill a customer.</p>
          <Link href="/admin/invoices/new" className="inline-flex items-center gap-2 px-4 h-9 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] text-white text-xs font-semibold rounded-md">
            <Icon name="plus" className="w-4 h-4" />
            New invoice
          </Link>
        </div>
      ) : (
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl overflow-hidden">
          <div className="divide-y divide-[var(--a-line)]">
            {invoices.map(inv => {
              const owed = inv.totalCents - inv.amountPaidCents
              return (
                <Link
                  key={inv.id}
                  href={`/admin/invoices/${inv.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-mono text-[var(--a-ink)]">{inv.number}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${STATUS_COLORS[inv.status] ?? ''}`}>
                        {inv.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--a-ink-faint)] mt-0.5">
                      {inv.dueDate ? `Due ${new Date(inv.dueDate).toLocaleDateString()}` : `Created ${new Date(inv.createdAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--a-ink)]">{money(inv.totalCents)}</p>
                    {owed > 0 && inv.status !== 'draft' && <p className="text-[11px] text-[var(--a-cta)]">{money(owed)} due</p>}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
