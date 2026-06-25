'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/admin/icons'

interface DashOrder {
  id: string; number: string; email: string; status: string; totalCents: number
  fulfillmentMethod: string; createdAt: string
  hasText: boolean; hasElement: boolean; attachmentCount: number
  proofStatus: 'needed' | 'sent' | 'approved' | null
}
interface Dash {
  orders: DashOrder[]
  counts: Record<string, number>
  proofsOwed: number
  revenue7dCents: number
  pipelineCents: number
}
interface Inbox { total?: number; unread?: number }

function money(c: number) { return `$${(c / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}` }

const PROOF_CHIP: Record<string, { label: string; cls: string }> = {
  needed: { label: 'Proof needed', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  sent: { label: 'Proof sent', cls: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  approved: { label: 'Proof ✓', cls: 'bg-[var(--a-accent)]/15 text-[var(--a-accent)] border-[var(--a-accent)]/30' },
}

function StatCard({ title, value, sub, href, icon, alert }: {
  title: string; value: string | number; sub?: string; href: string; icon: string; alert?: boolean
}) {
  return (
    <Link href={href} className={`group bg-[var(--a-panel)] rounded-xl p-5 border transition-colors ${alert ? 'border-amber-500/40 hover:border-amber-400/60' : 'border-[var(--a-line)] hover:border-[var(--a-accent)]'}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] text-[var(--a-ink-soft)] uppercase tracking-wider">{title}</p>
        <Icon name={icon} className={`w-4 h-4 opacity-70 ${alert ? 'text-amber-300' : 'text-[var(--a-accent)]'}`} />
      </div>
      <p className="text-3xl font-bold text-[var(--a-ink)] mb-1">{value}</p>
      {sub && <p className="text-xs text-[var(--a-ink-faint)]">{sub}</p>}
    </Link>
  )
}

export default function AdminToday() {
  const [dash, setDash] = useState<Dash | null>(null)
  const [inbox, setInbox] = useState<Inbox>({})

  useEffect(() => {
    fetch('/api/admin/dashboard').then(r => r.json()).then(j => {
      const parsed = j as { data?: Dash }
      if (parsed.data) setDash(parsed.data)
    }).catch(() => {})
    fetch('/api/admin/inbox?limit=0').then(r => r.json()).then(j => setInbox(j as Inbox)).catch(() => {})
  }, [])

  const active = dash ? (dash.counts['new'] ?? 0) + (dash.counts['confirmed'] ?? 0) + (dash.counts['in_progress'] ?? 0) + (dash.counts['ready'] ?? 0) : 0

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--a-ink)]">Today</h1>
        <p className="text-sm text-[var(--a-ink-faint)] mt-1">What needs you, first.</p>
      </div>

      {!dash ? (
        <div className="text-[var(--a-ink-faint)] text-sm">Loading…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Proofs owed"
              value={dash.proofsOwed}
              sub={dash.proofsOwed ? 'Customers waiting on you' : 'All caught up'}
              href="/admin/orders"
              icon="image"
              alert={dash.proofsOwed > 0}
            />
            <StatCard
              title="Active orders"
              value={active}
              sub={`${dash.counts['new'] ?? 0} new · ${dash.counts['ready'] ?? 0} ready`}
              href="/admin/orders"
              icon="briefcase"
            />
            <StatCard
              title="Unread messages"
              value={inbox.unread ?? 0}
              sub={`${inbox.total ?? 0} total`}
              href="/admin/inbox"
              icon="inbox"
              alert={(inbox.unread ?? 0) > 0}
            />
            <StatCard
              title="Collected (7 days)"
              value={money(dash.revenue7dCents)}
              sub={`${money(dash.pipelineCents)} in the pipeline`}
              href="/admin/revenue"
              icon="dollar"
            />
          </div>

          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[var(--a-ink)]">Needs attention</h2>
              <Link href="/admin/orders" className="text-xs text-[var(--a-accent)] hover:text-[var(--a-ink)]">Order board →</Link>
            </div>
            {dash.orders.length === 0 ? (
              <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-8 text-center text-[var(--a-ink-soft)] text-sm">
                No open orders right now.
              </div>
            ) : (
              <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl divide-y divide-[var(--a-line)]">
                {dash.orders.map(o => (
                  <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors">
                    <span className="font-mono text-xs text-[var(--a-ink)] w-28 flex-shrink-0">{o.number}</span>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--a-ink-faint)] w-20 flex-shrink-0">{o.status.replace('_', ' ')}</span>
                    <span className="text-xs text-[var(--a-ink-soft)] truncate flex-1">{o.email}</span>
                    <span className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                      {o.hasText && <span title="Engraving text" className="text-[11px]">✎</span>}
                      {o.hasElement && <span title="Design element" className="text-[11px]">🎨</span>}
                      {o.attachmentCount > 0 && <span title="Customer files" className="text-[11px]">📎{o.attachmentCount}</span>}
                    </span>
                    {o.proofStatus && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 ${PROOF_CHIP[o.proofStatus].cls}`}>
                        {PROOF_CHIP[o.proofStatus].label}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-[var(--a-ink)] w-16 text-right flex-shrink-0">{money(o.totalCents)}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-sm font-semibold text-[var(--a-ink)] mb-3">Quick actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <QuickAction href="/admin/products" icon="image" label="Products & photos" />
              <QuickAction href="/admin/invoices/new" icon="dollar" label="New invoice" />
              <QuickAction href="/admin/customers" icon="users" label="Customers" />
              <QuickAction href="https://www.vurmz.com" external icon="chevron" label="View site" />
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function QuickAction({ href, icon, label, external }: { href: string; icon: string; label: string; external?: boolean }) {
  const Component = external ? 'a' : Link
  return (
    <Component
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="flex items-center gap-3 bg-[var(--a-panel)] hover:bg-white/[0.04] rounded-xl p-3 border border-[var(--a-line)] hover:border-[var(--a-accent)] transition-all"
    >
      <Icon name={icon} className="w-4 h-4 text-[var(--a-accent)]" />
      <span className="text-sm text-[var(--a-ink)]">{label}</span>
    </Component>
  )
}
