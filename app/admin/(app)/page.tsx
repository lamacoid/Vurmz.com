'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/admin/icons'
import Ticket from '@/components/admin/Ticket'
import { type RailTicket, fireOrder, nextAction } from '@/lib/admin/next-action'
import { drainQueue, pendingBumps, railBump } from '@/lib/admin/rail-client'

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

  // Self-healing (RAIL-SYSTEM-PLAN I8): bumps parked while offline replay
  // themselves on load, on reconnect, and once a minute. CAS on the server
  // makes replays provably safe.
  const [pending, setPending] = useState(0)
  useEffect(() => {
    let alive = true
    const drain = async () => {
      const left = await drainQueue()
      if (!alive) return
      setPending(left)
      if (left < pendingBumps() || left === 0) load()
    }
    drain()
    window.addEventListener('online', drain)
    const iv = setInterval(drain, 60_000)
    return () => { alive = false; window.removeEventListener('online', drain); clearInterval(iv) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rail = dash ? [...dash.tickets].sort(fireOrder) : []

  // Rail Phase F, software half: the bump bar. USB bump bars are HID
  // keyboards; F9 (or any key saved to localStorage vurmz-bump-key)
  // advances the TOP ticket through its one next step, exactly like
  // tapping its button. Works with a plain keyboard today, the physical
  // bar the day it arrives. Ignored while typing in a field.
  const [bumped, setBumped] = useState<string | null>(null)
  const topTicket = rail[0] ?? null
  useEffect(() => {
    const key = (localStorage.getItem('vurmz-bump-key') || 'F9')
    const onKey = async (e: KeyboardEvent) => {
      if (e.key !== key) return
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      e.preventDefault()
      if (!topTicket) return
      const act = nextAction(topTicket)
      if (!act || act.type !== 'patch' || !act.patch) return
      const body = act.patch.status
        ? { status: act.patch.status, expectedStatus: topTicket.status }
        : act.patch.proof
          ? { proof: act.patch.proof, expectedProof: topTicket.proofStatus ?? undefined }
          : act.patch.settle
            ? { settle: act.patch.settle as 'cash' }
            : null
      if (!body) return
      try {
        await railBump(topTicket.id, body)
        setBumped(`${topTicket.number}: ${act.label}`)
        setTimeout(() => setBumped(null), 2500)
        load()
      } catch { /* railBump surfaces its own failure modes */ }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [topTicket, load])
  // Phase D: tickets riding a delivery run group at the top; ready
  // hand-deliveries with an address are pickable into the next run.
  const onRun = rail.filter(t => t.deliveryRun && t.status === 'ready')
  const offRun = rail.filter(t => !(t.deliveryRun && t.status === 'ready'))
  const runnable = rail.filter(t => t.status === 'ready' && t.fulfillmentMethod === 'hand_deliver' && !t.deliveryRun && t.addressLine)

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-[var(--a-ink)]">Today</h1>
        <p className="text-sm text-[var(--a-ink-faint)] mt-1">
          {rail.length === 0 ? 'Nothing on the rail.' : rail.length === 1 ? 'One ticket on the rail.' : `${rail.length} tickets on the rail.`}
        </p>
      </div>

      {bumped && (
        <div className="bg-[var(--a-accent)]/10 border border-[var(--a-accent)]/40 rounded-xl px-4 py-2.5 mb-4">
          <p className="text-sm text-[var(--a-ink)]">Bumped · {bumped}</p>
        </div>
      )}

      {/* Calm, not alarming: parked work is safe and sends itself. */}
      {pending > 0 && (
        <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-[var(--a-ink)]">
            {pending} update{pending === 1 ? '' : 's'} saved on this device, waiting for connection. They send themselves; nothing is lost.
          </p>
        </div>
      )}

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

          {/* Out for delivery: the current run, route one tap away. */}
          {onRun.length > 0 && (
            <section className="mb-4">
              <div className="flex items-center justify-between px-1 mb-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--a-accent)]">Out for delivery</p>
                <a
                  href={`https://www.google.com/maps/dir/${onRun.map(t => encodeURIComponent(t.addressLine ?? '')).join('/')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs text-[var(--a-accent)] hover:underline"
                >
                  Open the route →
                </a>
              </div>
              <div className="space-y-3">
                {onRun.map(t => (
                  <div key={t.id}>
                    <div className="flex items-center gap-2 px-1 pb-1">
                      <span className="text-[11px] text-[var(--a-ink-faint)] truncate">{t.addressLine}</span>
                      <a
                        href={`http://maps.apple.com/?daddr=${encodeURIComponent(t.addressLine ?? '')}&dirflg=d`}
                        target="_blank" rel="noopener noreferrer"
                        className="ml-auto shrink-0 text-[11px] text-[var(--a-accent)] hover:underline"
                      >
                        This stop →
                      </a>
                    </div>
                    <Ticket ticket={t} onAdvanced={load} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Start a run: pick the ready hand-deliveries, hand off to maps. */}
          {runnable.length > 0 && <RunPanel tickets={runnable} onStarted={load} />}

          {/* The rail. */}
          {offRun.length === 0 && onRun.length === 0 ? (
            <div className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl p-10 text-center">
              <p className="text-sm text-[var(--a-ink-soft)]">The rail is clear.</p>
              <p className="text-xs text-[var(--a-ink-faint)] mt-1">New orders land here as tickets, urgent first, each with its one next step.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {offRun.map(t => <Ticket key={t.id} ticket={t} onAdvanced={load} />)}
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

function RunPanel({ tickets, onStarted }: { tickets: RailTicket[]; onStarted: () => void }) {
  const [picked, setPicked] = useState<Record<string, boolean>>(() => Object.fromEntries(tickets.map(t => [t.id, true])))
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const chosen = tickets.filter(t => picked[t.id])

  async function start() {
    if (chosen.length === 0 || busy) return
    setBusy(true); setErr(null)
    try {
      const res = await fetch('/api/admin/orders/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: chosen.map(t => t.id) }),
      })
      const j = await res.json() as { ok?: boolean; data?: { googleUrl?: string } }
      if (!j.ok) throw new Error('run failed')
      if (j.data?.googleUrl) window.open(j.data.googleUrl, '_blank', 'noopener')
      onStarted()
    } catch {
      setErr('That did not go through. Nothing changed; try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl px-4 py-3.5 mb-4">
      <p className="text-sm font-medium text-[var(--a-ink)]">
        {tickets.length === 1 ? 'One delivery is ready to go out.' : `${tickets.length} deliveries are ready to go out.`}
      </p>
      <div className="mt-2.5 space-y-1.5">
        {tickets.map(t => (
          <label key={t.id} className="flex items-start gap-2.5 text-sm text-[var(--a-ink-soft)] cursor-pointer">
            <input
              type="checkbox"
              checked={!!picked[t.id]}
              onChange={e => setPicked(prev => ({ ...prev, [t.id]: e.target.checked }))}
              className="mt-0.5 accent-[var(--a-accent)]"
            />
            <span>
              <span className="text-[var(--a-ink)]">{t.customerName}</span>
              <span className="text-[var(--a-ink-faint)]"> · {t.addressLine}</span>
            </span>
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={start}
        disabled={chosen.length === 0 || busy}
        className="mt-3 inline-flex items-center gap-2 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] disabled:opacity-50 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
      >
        {busy ? 'Starting…' : chosen.length <= 1 ? 'Start the run' : `Start the run (${chosen.length} stops)`}
      </button>
      <p className="text-[11px] text-[var(--a-ink-faint)] mt-1.5">Opens the route in maps. Tap Delivered on each ticket at the door.</p>
      {err && <p className="text-[11px] text-amber-400 mt-1">{err}</p>}
    </section>
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
