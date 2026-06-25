'use client'
import { useEffect, useState } from 'react'
import { Icon } from '@/components/admin/icons'

interface MonthData { month: string; revenue_cents: number; order_count: number }
interface Revenue {
  monthly: MonthData[]
  outstanding: { totalCents: number; count: number }
  topProducts: Array<{ name_snapshot: string; revenue_cents: number; qty: number }>
  totals: { revenue_ever: number; revenue_month: number; orders_total: number; customers_total: number }
}

function money(c: number) { return `$${(c / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }

export default function RevenuePage() {
  const [data, setData] = useState<Revenue | null>(null)

  useEffect(() => {
    fetch('/api/admin/revenue?months=12').then(r => r.json()).then(j => {
      const parsed = j as { data?: Revenue }
      setData(parsed.data ?? null)
    })
  }, [])

  if (!data) return <div className="p-8 text-[var(--a-ink-faint)] text-sm">Loading…</div>

  const maxMonth = data.monthly.reduce((m, row) => Math.max(m, row.revenue_cents), 1)

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--a-ink)]">Revenue</h1>
          <p className="text-sm text-[var(--a-ink-faint)] mt-1">Payments, outstanding invoices, and top products.</p>
        </div>
        <div className="flex gap-2">
          {['orders','invoices','customers','payments'].map(t => (
            <a
              key={t}
              href={`/api/admin/export?type=${t}`}
              className="text-xs px-3 h-8 inline-flex items-center bg-white/5 hover:bg-white/10 rounded-md text-[var(--a-ink)] border border-[var(--a-line)]"
            >
              Export {t}
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat title="This month" value={money(data.totals.revenue_month)} icon="dollar" />
        <Stat title="All time" value={money(data.totals.revenue_ever)} icon="chart" />
        <Stat title="Outstanding" value={money(data.outstanding.totalCents)} icon="file-invoice" sub={`${data.outstanding.count} invoices`} accent="coral" />
        <Stat title="Orders total" value={String(data.totals.orders_total)} icon="cart" sub={`${data.totals.customers_total} customers`} />
      </div>

      <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5 mb-6">
        <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-4 font-semibold">Monthly revenue</p>
        {data.monthly.length === 0 ? (
          <p className="text-sm text-[var(--a-ink-faint)]">No payments yet.</p>
        ) : (
          <div className="space-y-2">
            {data.monthly.map(row => (
              <div key={row.month} className="flex items-center gap-3">
                <span className="text-xs font-mono text-[var(--a-ink-soft)] w-16">{row.month}</span>
                <div className="flex-1 h-6 bg-white/[0.03] rounded overflow-hidden relative">
                  <div
                    className="h-full bg-[var(--a-accent)]/40 border-r border-[var(--a-accent)]"
                    style={{ width: `${(row.revenue_cents / maxMonth) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-[var(--a-ink)] min-w-[90px] text-right">{money(row.revenue_cents)}</span>
                <span className="text-[10px] text-[var(--a-ink-faint)] min-w-[40px] text-right">{row.order_count}×</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5">
        <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-4 font-semibold">Top products</p>
        {data.topProducts.length === 0 ? (
          <p className="text-sm text-[var(--a-ink-faint)]">No order data yet.</p>
        ) : (
          <div className="divide-y divide-[var(--a-line)]">
            {data.topProducts.map(p => (
              <div key={p.name_snapshot} className="py-2 flex justify-between items-center">
                <span className="text-sm text-[var(--a-ink)] truncate pr-3">{p.name_snapshot}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[var(--a-ink-faint)]">{p.qty} sold</span>
                  <span className="text-[var(--a-ink)] font-semibold min-w-[80px] text-right">{money(p.revenue_cents)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ title, value, sub, icon, accent }: { title: string; value: string; sub?: string; icon: string; accent?: 'coral' }) {
  return (
    <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <p className="text-[10px] text-[var(--a-ink-soft)] uppercase tracking-wider">{title}</p>
        <Icon name={icon} className={`w-4 h-4 ${accent === 'coral' ? 'text-[var(--a-cta)]' : 'text-[var(--a-accent)]'} opacity-70`} />
      </div>
      <p className="text-2xl font-bold text-[var(--a-ink)]">{value}</p>
      {sub && <p className="text-[11px] text-[var(--a-ink-faint)] mt-1">{sub}</p>}
    </div>
  )
}
