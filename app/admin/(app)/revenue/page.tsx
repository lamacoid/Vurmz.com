'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/admin/icons'

/**
 * Money. Reads the ledger, the one place every dollar lands
 * (lib/money/ledger.ts). Four numbers, the owed list, the month table,
 * an expense form, Square sync, the books, and exceptions.
 */

interface Month { month: string; salesCents: number; refundsCents: number; feesCents: number; expensesCents: number; payoutsCents: number; taxCents: number; netCents: number }
interface Line { id: string; occurredAt: string; kind: string; amountCents: number; method: string; category: string; orderId: string | null; invoiceId: string | null; source: string; externalId: string | null; note: string }
interface Summary {
  months: Month[]
  exceptions: Line[]
  totals: { income_month: number; income_year: number; spent_year: number; income_week: number }
  owed: { invoices_cents: number; invoices_n: number; delivered_cents: number; delivered_n: number }
  books: { at: string; year: number; key: string; lines: number } | null
  square: { at: string; report: { ok: boolean; payments: { posted: number; unmatched: number }; refunds?: { posted: number }; payouts?: { posted: number }; error?: string } } | null
  categories: string[]
}

function money(c: number) { return `${c < 0 ? '-' : ''}$${(Math.abs(c) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }
function monthLabel(m: string) { const [y, mo] = m.split('-'); return new Date(Number(y), Number(mo) - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) }
function when(iso: string) { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }

export default function MoneyPage() {
  const [data, setData] = useState<Summary | null>(null)
  const [lines, setLines] = useState<Line[]>([])
  const [err, setErr] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [s, l] = await Promise.all([
      fetch('/api/admin/ledger?view=summary').then(r => r.json()) as Promise<{ data?: Summary }>,
      fetch('/api/admin/ledger?view=lines&limit=40').then(r => r.json()) as Promise<{ data?: { lines: Line[] } }>,
    ])
    setData(s.data ?? null)
    setLines(l.data?.lines ?? [])
  }, [])
  useEffect(() => { load().catch(e => setErr(String(e))) }, [load])

  if (err) return <div className="p-8 text-sm text-[var(--a-cta)]">{err}</div>
  if (!data) return <div className="p-8 text-[var(--a-ink-faint)] text-sm">Loading…</div>

  const owedTotal = data.owed.invoices_cents + data.owed.delivered_cents
  const net = data.totals.income_year + data.totals.spent_year

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--a-ink)]">Money</h1>
          <p className="text-sm text-[var(--a-ink-faint)] mt-1">Every dollar in or out, from the ledger. Cash basis.</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <Link href="/admin/invoices" className="text-xs px-3 h-8 inline-flex items-center bg-white/5 hover:bg-white/10 rounded-md text-[var(--a-ink)] border border-[var(--a-line)]">Invoices</Link>
          <a href="/api/admin/export?type=orders" className="text-xs px-3 h-8 inline-flex items-center bg-white/5 hover:bg-white/10 rounded-md text-[var(--a-ink)] border border-[var(--a-line)]">Export orders CSV</a>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat title="Owed to you" value={money(owedTotal)} icon="file-invoice" accent="coral"
          sub={`${data.owed.invoices_n} invoice${data.owed.invoices_n === 1 ? '' : 's'}, ${data.owed.delivered_n} delivered unpaid`} />
        <Stat title="This month" value={money(data.totals.income_month)} icon="dollar" sub={`${money(data.totals.income_week)} last 7 days`} />
        <Stat title="This year" value={money(data.totals.income_year)} icon="chart" sub={`${money(data.totals.spent_year)} spent`} />
        <Stat title="Net this year" value={money(net)} icon="chart" sub="income minus fees and expenses" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <ExpenseForm categories={data.categories} onPosted={load} />
        <div className="space-y-4">
          <BooksCard books={data.books} />
          <SquareCard square={data.square} onDone={load} />
        </div>
      </div>

      {data.exceptions.length > 0 && (
        <Panel title={`Needs a home (${data.exceptions.length})`} tone="coral">
          <p className="text-xs text-[var(--a-ink-faint)] mb-3">Square money that matches no order or invoice. Tie each one to a ticket or leave a note.</p>
          <Lines lines={data.exceptions} />
        </Panel>
      )}

      <Panel title="By month">
        {data.months.length === 0 ? (
          <p className="text-sm text-[var(--a-ink-faint)]">Nothing in the ledger yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-[var(--a-ink-faint)]">
                  <th className="text-left px-2 pb-2 font-semibold">Month</th>
                  <th className="text-right px-2 pb-2 font-semibold">Sales</th>
                  <th className="text-right px-2 pb-2 font-semibold">Refunds</th>
                  <th className="text-right px-2 pb-2 font-semibold">Fees</th>
                  <th className="text-right px-2 pb-2 font-semibold">Expenses</th>
                  <th className="text-right px-2 pb-2 font-semibold">Net</th>
                  <th className="text-right px-2 pb-2 font-semibold">Payouts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--a-line)]">
                {data.months.map(m => (
                  <tr key={m.month} className="text-[var(--a-ink)]">
                    <td className="px-2 py-2 font-mono text-xs text-[var(--a-ink-soft)]">{monthLabel(m.month)}</td>
                    <td className="px-2 py-2 text-right">{money(m.salesCents)}</td>
                    <td className="px-2 py-2 text-right text-[var(--a-ink-faint)]">{m.refundsCents ? money(m.refundsCents) : '·'}</td>
                    <td className="px-2 py-2 text-right text-[var(--a-ink-faint)]">{m.feesCents ? money(m.feesCents) : '·'}</td>
                    <td className="px-2 py-2 text-right text-[var(--a-ink-faint)]">{m.expensesCents ? money(m.expensesCents) : '·'}</td>
                    <td className={`px-2 py-2 text-right font-semibold ${m.netCents < 0 ? 'text-[var(--a-cta)]' : ''}`}>{money(m.netCents)}</td>
                    <td className="px-2 py-2 text-right text-[var(--a-ink-faint)]">{m.payoutsCents ? money(m.payoutsCents) : '·'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel title="Recent lines">
        {lines.length === 0 ? <p className="text-sm text-[var(--a-ink-faint)]">Nothing yet.</p> : <Lines lines={lines} />}
      </Panel>
    </div>
  )
}

function Lines({ lines }: { lines: Line[] }) {
  return (
    <div className="divide-y divide-[var(--a-line)]">
      {lines.map(l => (
        <div key={l.id} className="py-2 flex items-center gap-3 text-sm">
          <span className="font-mono text-[11px] text-[var(--a-ink-faint)] w-14 shrink-0">{when(l.occurredAt)}</span>
          <span className={`text-[10px] uppercase tracking-wider w-16 shrink-0 ${l.kind === 'sale' ? 'text-[var(--a-accent)]' : l.kind === 'payout' ? 'text-[var(--a-ink-faint)]' : 'text-[var(--a-cta)]'}`}>{l.kind}</span>
          <span className="flex-1 truncate text-[var(--a-ink)]">
            {l.orderId ? <Link className="underline decoration-dotted" href={`/admin/orders/${l.orderId}`}>{l.note || 'Order'}</Link>
              : l.invoiceId ? <Link className="underline decoration-dotted" href={`/admin/invoices/${l.invoiceId}`}>{l.note || 'Invoice'}</Link>
              : (l.note || l.category)}
            <span className="text-[var(--a-ink-faint)] text-xs"> · {l.category}{l.method !== 'other' ? ` · ${l.method}` : ''}</span>
          </span>
          <span className={`font-semibold tabular-nums ${l.amountCents < 0 ? 'text-[var(--a-ink-faint)]' : 'text-[var(--a-ink)]'}`}>{money(l.amountCents)}</span>
        </div>
      ))}
    </div>
  )
}

function ExpenseForm({ categories, onPosted }: { categories: string[]; onPosted: () => Promise<void> }) {
  const today = new Date().toISOString().slice(0, 10)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('materials')
  const [date, setDate] = useState(today)
  const [note, setNote] = useState('')
  const [clientId, setClientId] = useState(() => crypto.randomUUID().replace(/-/g, '').slice(0, 24))
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const cents = Math.round(Number(amount.replace(/[^0-9.]/g, '')) * 100)
    if (!cents || cents <= 0) { setMsg('Enter an amount.'); return }
    setBusy(true); setMsg(null)
    try {
      const res = await fetch('/api/admin/ledger', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'expense', amountCents: cents, category, occurredAt: date, note, clientId }),
      })
      const j = await res.json() as { ok: boolean; error?: { message?: string } }
      if (!j.ok) { setMsg(j.error?.message ?? 'Did not save.'); return }
      setAmount(''); setNote(''); setClientId(crypto.randomUUID().replace(/-/g, '').slice(0, 24))
      setMsg('Saved.')
      await onPosted()
    } catch { setMsg('Did not save. Try again.') } finally { setBusy(false) }
  }

  return (
    <form onSubmit={submit} className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5">
      <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-3 font-semibold">Add an expense</p>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs text-[var(--a-ink-soft)]">Amount
          <input inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="42.50"
            className="mt-1 w-full h-10 px-3 rounded-md bg-white/5 border border-[var(--a-line)] text-[var(--a-ink)] text-base" />
        </label>
        <label className="text-xs text-[var(--a-ink-soft)]">Date
          <input type="date" value={date} max={today} onChange={e => setDate(e.target.value)}
            className="mt-1 w-full h-10 px-3 rounded-md bg-white/5 border border-[var(--a-line)] text-[var(--a-ink)] text-sm" />
        </label>
        <label className="text-xs text-[var(--a-ink-soft)] col-span-2">Category
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="mt-1 w-full h-10 px-3 rounded-md bg-white/5 border border-[var(--a-line)] text-[var(--a-ink)] text-sm">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="text-xs text-[var(--a-ink-soft)] col-span-2">What for
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Stainless blanks, JDS" maxLength={200}
            className="mt-1 w-full h-10 px-3 rounded-md bg-white/5 border border-[var(--a-line)] text-[var(--a-ink)] text-sm" />
        </label>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button type="submit" disabled={busy}
          className="h-10 px-4 rounded-md bg-[var(--a-cta)] text-white text-sm font-semibold disabled:opacity-50">
          {busy ? 'Saving…' : 'Save expense'}
        </button>
        {msg && <span className="text-xs text-[var(--a-ink-faint)]">{msg}</span>}
      </div>
    </form>
  )
}

function BooksCard({ books }: { books: Summary['books'] }) {
  return (
    <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5">
      <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-2 font-semibold">The books</p>
      {books ? (
        <>
          <p className="text-sm text-[var(--a-ink)]">VURMZ Books {books.year}, {books.lines} lines, updated {new Date(books.at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.</p>
          <a href="/api/admin/books" className="mt-3 inline-flex h-9 px-3 items-center rounded-md bg-white/5 hover:bg-white/10 border border-[var(--a-line)] text-sm text-[var(--a-ink)]">Download workbook</a>
        </>
      ) : (
        <p className="text-sm text-[var(--a-ink-faint)]">Not built yet. On the Mac: <code className="text-xs">npm run books</code>. It reads this ledger and writes the workbook here.</p>
      )}
    </div>
  )
}

function SquareCard({ square, onDone }: { square: Summary['square']; onDone: () => Promise<void> }) {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  async function run() {
    setBusy(true); setMsg(null)
    try {
      const res = await fetch('/api/admin/square/sync', { method: 'POST' })
      const j = await res.json() as { ok: boolean; data?: { invoices?: { open: number }; payments: { posted: number; unmatched: number }; refunds: { posted: number }; payouts: { posted: number }; error?: string }; error?: { message?: string } }
      if (!j.ok) { setMsg(j.data?.error ?? j.error?.message ?? 'Sync failed.'); return }
      const d = j.data!
      setMsg(`${d.invoices?.open ?? 0} Square invoice${d.invoices?.open === 1 ? '' : 's'} open. Posted ${d.payments.posted} payments, ${d.refunds.posted} refunds, ${d.payouts.posted} payouts.${d.payments.unmatched ? ` ${d.payments.unmatched} need a home.` : ''}`)
      await onDone()
    } catch { setMsg('Sync failed.') } finally { setBusy(false) }
  }
  const r = square?.report
  return (
    <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5">
      <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-2 font-semibold">Square</p>
      <p className="text-sm text-[var(--a-ink-faint)]">
        {square ? `Last sync ${new Date(square.at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}${r && !r.ok ? `, failed: ${r.error}` : ''}.` : 'Never synced. Payments still arrive through the webhook.'}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <button onClick={run} disabled={busy} className="h-9 px-3 rounded-md bg-white/5 hover:bg-white/10 border border-[var(--a-line)] text-sm text-[var(--a-ink)] disabled:opacity-50">
          {busy ? 'Syncing…' : 'Sync Square now'}
        </button>
        {msg && <span className="text-xs text-[var(--a-ink-faint)]">{msg}</span>}
      </div>
    </div>
  )
}

function Panel({ title, children, tone }: { title: string; children: React.ReactNode; tone?: 'coral' }) {
  return (
    <div className={`bg-[var(--a-panel)] border rounded-xl p-5 mb-6 ${tone === 'coral' ? 'border-[var(--a-cta)]/50' : 'border-[var(--a-line)]'}`}>
      <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-4 font-semibold">{title}</p>
      {children}
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
