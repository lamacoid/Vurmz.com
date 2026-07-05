'use client'
/* eslint-disable @next/next/no-img-element */
/**
 * The kitchen-rail ticket (Admin Charter, Phase 1). One piece of work,
 * whole anatomy on one card: WHO, WHAT (engraving rendered in its actual
 * font), WHEN as a traffic light, WORTH, and exactly ONE next-action
 * button computed by lib/admin/next-action.
 */
import { useState } from 'react'
import Link from 'next/link'
import { fontOptions } from '@/lib/fonts'
import { type RailTicket, nextAction, urgency } from '@/lib/admin/next-action'
import { railBump, type BumpBody } from '@/lib/admin/rail-client'

function money(c: number) { return `$${(c / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}` }

const BAR: Record<string, string> = {
  green: 'bg-[var(--a-accent)]/60',
  amber: 'bg-amber-400',
  red: 'bg-red-400',
}

const STATUS_WORDS: Record<string, string> = {
  new: 'New order',
  confirmed: 'Ready to engrave',
  in_progress: 'On the laser',
  ready: 'Ready to go out',
}

function when(t: RailTicket): string {
  if (t.eta) {
    const d = new Date(t.eta)
    const days = Math.round((d.getTime() - Date.now()) / 86_400_000)
    if (days < 0) return `${Math.abs(days)}d overdue`
    if (days === 0) return 'due today'
    if (days === 1) return 'due tomorrow'
    return `due in ${days}d`
  }
  const age = Math.floor((Date.now() - new Date(t.createdAt).getTime()) / 86_400_000)
  return age === 0 ? 'came in today' : age === 1 ? 'came in yesterday' : `waiting ${age}d`
}

export default function Ticket({ ticket, onAdvanced }: { ticket: RailTicket; onAdvanced: () => void }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [parked, setParked] = useState('')
  const action = nextAction(ticket)
  const u = urgency(ticket)
  const fontStyle = ticket.engraving?.fontValue
    ? fontOptions.find(f => f.value === ticket.engraving!.fontValue)?.style
    : undefined

  // The failproof pipe: guarded CAS bump, self-retrying, self-queueing.
  // A stale ticket is not an error; reality just moved first, so refresh.
  async function advance() {
    if (!action?.patch) return
    setBusy(true)
    setErr('')
    setParked('')
    try {
      const body: BumpBody = { ...action.patch }
      if (action.patch.status) body.expectedStatus = ticket.status
      if (action.patch.proof && ticket.proofStatus) body.expectedProof = ticket.proofStatus
      const r = await railBump(ticket.id, body)
      if (r === 'queued') {
        setParked('No connection right now. This step is saved on this device and will send itself.')
        return
      }
      onAdvanced()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not update. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative bg-[var(--a-panel)] border border-[var(--a-line)] rounded-xl overflow-hidden">
      {/* Urgency bar: the rail's traffic light. */}
      <span aria-hidden className={`absolute left-0 top-0 bottom-0 w-1 ${BAR[u]}`} />
      <div className="pl-4 pr-4 py-3.5 sm:pl-5">

        {/* WHO + WHEN + WORTH */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <Link href={`/admin/orders/${ticket.id}`} className="text-[15px] font-semibold text-[var(--a-ink)] hover:text-[var(--a-accent)]">
            {ticket.customerName}
          </Link>
          <span className="font-mono text-[10px] text-[var(--a-ink-faint)]">{ticket.number}</span>
          <span className={`text-[10px] uppercase tracking-wide ${u === 'red' ? 'text-red-300' : u === 'amber' ? 'text-amber-300' : 'text-[var(--a-ink-faint)]'}`}>
            {when(ticket)}
          </span>
          <span className="ml-auto text-sm font-bold text-[var(--a-ink)]">{money(ticket.totalCents)}</span>
        </div>

        {/* WHAT: the work itself. */}
        <p className="text-xs text-[var(--a-ink-soft)] mt-1.5">{ticket.itemsSummary || STATUS_WORDS[ticket.status] || ticket.status}</p>
        {ticket.engraving && (ticket.engraving.text || ticket.engraving.elementLabel) && (
          <div className="mt-2 flex items-center gap-2.5 bg-black/20 rounded-lg px-3 py-2">
            {ticket.engraving.elementThumb && (
              <img src={ticket.engraving.elementThumb} alt={ticket.engraving.elementLabel || ''} className="w-8 h-8 object-contain bg-[#f0ebe0] rounded p-0.5 flex-shrink-0" />
            )}
            <div className="min-w-0">
              {ticket.engraving.text && (
                <p className="text-lg leading-tight text-[var(--a-ink)] truncate" style={fontStyle}>
                  {ticket.engraving.text}
                </p>
              )}
              <p className="text-[10px] text-[var(--a-ink-faint)]">
                {[ticket.engraving.fontLabel, ticket.engraving.elementLabel, ticket.engraving.placement].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
        )}

        {/* Contact + THE ONE BUTTON */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {ticket.phone && (
            <a href={`sms:${ticket.phone.replace(/[^0-9+]/g, '')}`} className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-[var(--a-ink-soft)] hover:text-[var(--a-ink)]">
              Text {ticket.customerName.split(' ')[0]}
            </a>
          )}
          <span className="text-[10px] uppercase tracking-wide text-[var(--a-ink-faint)]">
            {STATUS_WORDS[ticket.status] ?? ticket.status}{ticket.proofStatus ? ` · proof ${ticket.proofStatus}` : ''}
          </span>
          {action && (
            <div className="ml-auto text-right">
              {action.type === 'link' ? (
                <Link
                  href={action.href!}
                  className="inline-flex items-center px-4 h-9 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] text-white text-sm font-semibold rounded-md"
                >
                  {action.label}
                </Link>
              ) : (
                <button
                  onClick={advance}
                  disabled={busy}
                  className="inline-flex items-center px-4 h-9 bg-[var(--a-cta)] hover:bg-[var(--a-cta-hover)] disabled:opacity-60 text-white text-sm font-semibold rounded-md"
                >
                  {busy ? 'Saving…' : action.label}
                </button>
              )}
              {action.secondaryHref && (
                <Link href={action.secondaryHref} className="block text-[11px] text-[var(--a-accent)] hover:underline mt-1">
                  {action.secondaryLabel}
                </Link>
              )}
              <p className="text-[10px] text-[var(--a-ink-faint)] mt-1">{action.why}</p>
            </div>
          )}
        </div>
        {err && <p className="text-xs text-red-300 mt-1.5">{err}</p>}
        {parked && <p className="text-xs text-[var(--a-accent)] mt-1.5">{parked}</p>}
      </div>
    </div>
  )
}
