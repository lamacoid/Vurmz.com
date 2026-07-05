'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/admin/icons'
import Ticket from '@/components/admin/Ticket'
import { type RailTicket, fireOrder } from '@/lib/admin/next-action'

// Today: the kitchen rail (Admin Charter, Phase 1). Three numbers, the
// tickets in fire order, decisions below. Answers "what do I do right
// now" in five seconds, on a phone.

interface Dash {
  tickets: RailTicket[]
  counts: Record<string, number>
  proofsOwed: number
  dueToday: number
  newSinceYesterday: number
  revenue7dCents: number
  pipelineCents: number
}
interface Inbox { total?: number; unread?: number }

function money(c: number) { return `$${(c / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}` }

function Stat({ label, value, sub, href, alert }: { label: string; value: string | number; sub?: string; href: string; alert?: boolean }) {
  return (
    <Link href={href} className={`bg-[var(--a-panel)] rounded-xl px-4 py-3.5 border transition-colors ${alert ? 'border-amber-500/40 hover:border-amber-400/60' : 'border-[var(--a-line)] hover:border-[var(--a-accent)]'}`}>
      <p className="text-[10px] text-[var(--a-ink-soft)] uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-[var(--a-ink)] mt-0.5">{value}</p>
      {sub && <p className="text-[10px] text-[var(--a-ink-faint)] mt-0.5">{sub}</p>}
    </Link>
  )
}

export default function AdminToday() {
  const [dash, setDash] = useState<Dash | null>(null)
  const [inbox, setInbox] = useState<Inbox>({})

  const load = useCallback(() => {
    fetch('/api/admin/dashboard').then(r => r.json()).then(j => {
      const parsed = j as { data?: Dash }
      if (parsed.data) setDash(parsed.data)
    }).catch(() => {})
    fetch('/api/admin/inbox?limit=0').then(r => r.json()).then(j => setInbox(j as Inbox)).catch(() => {})
  }, [])

  useEffect(() => { load() }, [load])

  const rail = dash ? [...dash.tickets].sort(fireOrder) : []

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-[var(--a-ink)]">Today</h1>
        <p className="text-sm text-[var(--a-ink-faint)] mt-1">
          {rail.length === 0 ? 'Nothing on the rail.' : rail.length === 1 ? 'One ticket on the rail.' : `${rail.length} tickets on the rail.`}
        </p>
      </div>

      {!dash ? (
        <div className="text-[var(--a-ink-faint)] text-sm">Loading…</div>
      ) : (
        <>
          {/* Three numbers. That's the whole scoreboard. */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-6">
            <Stat label="Owed to you" value={money(dash.pipelineCents)} sub={`${money(dash.revenue7dCents)} collected this week`} href="/admin/revenue" />
            <Stat label="Due today" value={dash.dueToday} sub={dash.proofsOwed ? `${dash.proofsOwed} proof${dash.proofsOwed === 1 ? '' : 's'} owed` : 'no proofs owed'} href="/admin/orders" alert={dash.dueToday > 0 || dash.proofsOwed > 0} />
            <Stat label="New (24h)" value={dash.newSinceYesterday} sub={`${inbox.unread ?? 0} unread message${(inbox.unread ?? 0) === 1 ? '' : 's'}`} href="/admin/inbox" alert={(inbox.unread ?? 0) > 0} />
          </div>

          {/* Decisions first: things a human must look at. */}
          {(inbox.unread ?? 0) > 0 && (
            <Link href="/admin/inbox" className="flex items-center gap-3 bg-[var(--a-cta)]/10 border border-[var(--a-cta)]/30 rounded-xl px-4 py-3 mb-4 hover:bg-[var(--a-cta)]/15 transition-colors">
              <Icon name="inbox" className="w-4 h-4 text-[var(--a-cta)]" />
              <span className="text-sm text-[var(--a-ink)] font-medium">
                {inbox.unread} new message{(inbox.unread ?? 0) === 1 ? '' : 's'} waiting
              </span>
              <span className="ml-auto text-xs text-[var(--a-ink-faint)]">Read →</span>
            </Link>
          )}

          {/* The rail. */}
          {rail.length === 0 ? (
            <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-10 text-center">
              <p className="text-sm text-[var(--a-ink-soft)]">The rail is clear.</p>
              <p className="text-xs text-[var(--a-ink-faint)] mt-1">New orders land here as tickets, urgent first, each with its one next step.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rail.map(t => <Ticket key={t.id} ticket={t} onAdvanced={load} />)}
            </div>
          )}

          {/* Quick actions stay quick. */}
          <section className="mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <QuickAction href="/admin/orders/new" icon="briefcase" label="New order" />
              <QuickAction href="/admin/products/new" icon="image" label="New listing" />
              <QuickAction href="/admin/invoices/new" icon="dollar" label="New invoice" />
              <QuickAction href="/admin/customers" icon="users" label="Customers" />
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function QuickAction({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 bg-[var(--a-panel)] hover:bg-white/[0.04] rounded-xl px-3 py-2.5 border border-[var(--a-line)] hover:border-[var(--a-accent)] transition-all"
    >
      <Icon name={icon} className="w-4 h-4 text-[var(--a-accent)]" />
      <span className="text-sm text-[var(--a-ink)]">{label}</span>
    </Link>
  )
}
