'use client'
export const runtime = 'edge'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Customer { id: string; name: string; email: string; phone: string | null; company: string | null; notes: string; tags: string[]; lifetimeValueCents: number; orderCount: number; createdAt: string; lastSeenAt: string | null }
interface Order { id: string; number: string; status: string; totalCents: number; createdAt: string }
interface Invoice { id: string; number: string; status: string; totalCents: number; amountPaidCents: number; createdAt: string }
interface Message { id: string; direction: 'inbound' | 'outbound'; body: string; createdAt: string }
interface FileItem { id: string; filename: string; sizeBytes: number; uploadedAt: string }

function money(c: number) { return `$${(c / 100).toFixed(2)}` }

export default function AdminCustomerDetail() {
  const params = useParams<{ id: string }>()
  const [data, setData] = useState<{
    customer: Customer; orders: Order[]; invoices: Invoice[]; messages: Message[]; files: FileItem[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!params?.id) return
    const res = await fetch(`/api/admin/customers/${params.id}`)
    const json = (await res.json()) as { data?: typeof data }
    setData(json.data ?? null)
    setLoading(false)
  }, [params?.id])

  useEffect(() => { load() }, [load])

  async function patch(patch: Partial<Customer>) {
    if (!data) return
    await fetch(`/api/admin/customers/${data.customer.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    // Optimistic merge
    setData({ ...data, customer: { ...data.customer, ...patch } })
  }

  if (loading) return <div className="p-8 text-[var(--a-ink-faint)] text-sm">Loading…</div>
  if (!data) return <div className="p-8 text-[var(--a-ink-soft)] text-sm">Customer not found.</div>

  const { customer, orders, invoices, messages, files } = data

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <Link href="/admin/customers" className="text-xs text-[var(--a-ink-faint)] hover:text-[var(--a-ink)]">← Customers</Link>
      <div className="flex items-start justify-between mt-2 mb-6">
        <div className="flex-1 min-w-0">
          <InlineInput value={customer.name || ''} placeholder="Name" onSave={v => patch({ name: v })} className="text-2xl font-bold" />
          <p className="text-sm text-[var(--a-ink-soft)] mt-1">{customer.email}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)]">Lifetime value</p>
          <p className="text-lg font-bold text-[var(--a-ink)]">{money(customer.lifetimeValueCents)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Section title="Contact">
          <Row label="Phone">
            <InlineInput value={customer.phone ?? ''} placeholder="—" onSave={v => patch({ phone: v || null })} />
          </Row>
          <Row label="Company">
            <InlineInput value={customer.company ?? ''} placeholder="—" onSave={v => patch({ company: v || null })} />
          </Row>
          <Row label="Tags">
            <TagEditor value={customer.tags || []} onSave={v => patch({ tags: v })} />
          </Row>
        </Section>

        <Section title="Admin notes">
          <InlineTextarea value={customer.notes} placeholder="Notes about this customer (only you see these)…" onSave={v => patch({ notes: v })} />
        </Section>

        <Section title={`Orders (${orders.length})`}>
          {orders.length === 0 ? <Empty text="No orders." /> : (
            <div className="divide-y divide-[var(--a-line)]">
              {orders.map(o => (
                <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex justify-between py-2 hover:bg-white/[0.02] rounded px-2 -mx-2">
                  <div>
                    <p className="text-sm font-mono text-[var(--a-ink)]">{o.number}</p>
                    <p className="text-[10px] text-[var(--a-ink-faint)]">{o.status.replace('_', ' ')} · {new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm text-[var(--a-ink)] font-semibold">{money(o.totalCents)}</p>
                </Link>
              ))}
            </div>
          )}
        </Section>

        <Section title={`Invoices (${invoices.length})`}>
          {invoices.length === 0 ? <Empty text="No invoices." /> : (
            <div className="divide-y divide-[var(--a-line)]">
              {invoices.map(inv => (
                <Link key={inv.id} href={`/admin/invoices/${inv.id}`} className="flex justify-between py-2 hover:bg-white/[0.02] rounded px-2 -mx-2">
                  <div>
                    <p className="text-sm font-mono text-[var(--a-ink)]">{inv.number}</p>
                    <p className="text-[10px] text-[var(--a-ink-faint)]">{inv.status.replace('_', ' ')} · {new Date(inv.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm text-[var(--a-ink)] font-semibold">{money(inv.totalCents)}</p>
                </Link>
              ))}
            </div>
          )}
        </Section>

        <Section title={`Messages (${messages.length})`}>
          {messages.length === 0 ? <Empty text="No messages." /> : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {messages.slice(-20).map(m => (
                <div key={m.id} className={`p-2 rounded text-xs ${m.direction === 'inbound' ? 'bg-[var(--a-cta)]/10 text-[var(--a-ink)]' : 'bg-white/[0.03] text-[var(--a-ink-soft)]'}`}>
                  <p className="whitespace-pre-wrap">{m.body}</p>
                  <p className="text-[10px] text-[var(--a-ink-faint)] mt-1">{m.direction === 'inbound' ? 'Customer' : 'You'} · {new Date(m.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title={`Files (${files.length})`}>
          {files.length === 0 ? <Empty text="No files uploaded." /> : (
            <div className="space-y-1">
              {files.map(f => (
                <div key={f.id} className="flex justify-between text-sm">
                  <span className="text-[var(--a-ink)] truncate pr-3">{f.filename}</span>
                  <span className="text-[10px] text-[var(--a-ink-faint)] whitespace-nowrap">{(f.sizeBytes / 1024).toFixed(0)} KB</span>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children, fullWidth }: { title: string; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div className={`bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-5 ${fullWidth ? 'lg:col-span-2' : ''}`}>
      <p className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)] mb-3 font-semibold">{title}</p>
      {children}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[80px_1fr] items-center gap-3 mb-2">
      <span className="text-[11px] uppercase tracking-wider text-[var(--a-ink-faint)]">{label}</span>
      {children}
    </div>
  )
}

function Empty({ text }: { text: string }) { return <p className="text-xs text-[var(--a-ink-faint)]">{text}</p> }

function InlineInput({ value, onSave, placeholder, className }: { value: string; onSave: (v: string) => void; placeholder?: string; className?: string }) {
  const [local, setLocal] = useState(value)
  useEffect(() => setLocal(value), [value])
  return (
    <input
      value={local}
      onChange={e => setLocal(e.target.value)}
      onBlur={() => local !== value && onSave(local)}
      placeholder={placeholder}
      className={`w-full bg-transparent text-[var(--a-ink)] outline-none border-b border-transparent focus:border-[var(--a-accent)]/40 ${className ?? 'text-sm'}`}
    />
  )
}

function InlineTextarea({ value, onSave, placeholder }: { value: string; onSave: (v: string) => void; placeholder?: string }) {
  const [local, setLocal] = useState(value)
  useEffect(() => setLocal(value), [value])
  return (
    <textarea
      value={local}
      onChange={e => setLocal(e.target.value)}
      onBlur={() => local !== value && onSave(local)}
      placeholder={placeholder}
      rows={6}
      className="w-full bg-[var(--a-bg)] border border-[var(--a-line)] rounded-md px-3 py-2 text-sm text-[var(--a-ink)] outline-none focus:border-[var(--a-accent)] resize-none"
    />
  )
}

function TagEditor({ value, onSave }: { value: string[]; onSave: (v: string[]) => void }) {
  const [input, setInput] = useState('')
  function add() {
    const v = input.trim()
    if (!v || value.includes(v)) { setInput(''); return }
    onSave([...value, v]); setInput('')
  }
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {value.map(t => (
        <span key={t} className="bg-[var(--a-accent)]/10 border border-[var(--a-accent)]/20 text-[var(--a-accent)] text-[11px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
          {t}
          <button onClick={() => onSave(value.filter(v => v !== t))} className="hover:text-red-300" aria-label={`Remove ${t}`}>×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } }}
        onBlur={add}
        placeholder="+ tag"
        className="bg-transparent text-xs text-[var(--a-ink)] outline-none w-20"
      />
    </div>
  )
}
