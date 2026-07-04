/**
 * The kitchen-rail ticket and its NEXT-action state machine (Admin
 * Charter, Phase 1). Pure and client-safe: the API builds tickets, the
 * Ticket component renders them, and this file is the single place that
 * knows what the one next step is for any piece of work.
 */

export interface RailTicket {
  kind: 'order'
  id: string
  number: string
  status: 'new' | 'confirmed' | 'in_progress' | 'ready' | 'delivered' | 'cancelled' | 'refunded'
  proofStatus: 'needed' | 'sent' | 'approved' | null
  personalized: boolean
  customerName: string
  email: string
  phone: string | null
  totalCents: number
  itemsSummary: string
  engraving: {
    text?: string
    fontValue?: string
    fontLabel?: string
    elementLabel?: string
    elementThumb?: string
    placement?: string
  } | null
  fulfillmentMethod: string
  eta: string | null
  createdAt: string
}

export interface NextAction {
  label: string
  /** 'patch' advances state inline; 'link' opens the order for steps that need more (like attaching a proof photo). */
  type: 'patch' | 'link'
  /** For 'patch': the body to PATCH to /api/admin/orders/[id]. */
  patch?: { status?: RailTicket['status']; proof?: 'needed' | 'sent' | 'approved' }
  /** For 'link': where to go. */
  href?: string
  /** One quiet line under the button explaining why this is the step. */
  why: string
}

export function nextAction(t: RailTicket): NextAction | null {
  // The proof gate comes first: nothing engraves before approval.
  if (t.proofStatus === 'needed') {
    return {
      label: 'Send the proof',
      type: 'link',
      href: `/admin/orders/${t.id}`,
      why: 'They approve a photo before anything runs.',
    }
  }
  if (t.proofStatus === 'sent') {
    return {
      label: 'Mark proof approved',
      type: 'patch',
      patch: { proof: 'approved' },
      why: 'Tap when they say yes.',
    }
  }
  switch (t.status) {
    case 'new':
      return { label: 'Confirm the order', type: 'patch', patch: { status: 'confirmed' }, why: 'Locks it in and starts the clock.' }
    case 'confirmed':
      return { label: 'Start engraving', type: 'patch', patch: { status: 'in_progress' }, why: 'Proof is settled. Fire it.' }
    case 'in_progress':
      return { label: 'Mark it ready', type: 'patch', patch: { status: 'ready' }, why: 'Off the laser, ready to go out.' }
    case 'ready':
      return t.fulfillmentMethod === 'pickup'
        ? { label: 'Picked up', type: 'patch', patch: { status: 'delivered' }, why: 'Hand it over, tap this.' }
        : { label: 'Delivered', type: 'patch', patch: { status: 'delivered' }, why: 'Tap at their door.' }
    default:
      return null
  }
}

export type Urgency = 'green' | 'amber' | 'red'

/** Traffic light: red = overdue or waiting 3+ days, amber = getting warm. */
export function urgency(t: RailTicket, now = new Date()): Urgency {
  if (t.eta) {
    const due = new Date(t.eta)
    const days = (due.getTime() - now.getTime()) / 86_400_000
    if (days < 0) return 'red'
    if (days <= 1) return 'amber'
    return 'green'
  }
  const ageDays = (now.getTime() - new Date(t.createdAt).getTime()) / 86_400_000
  if (ageDays >= 3) return 'red'
  if (ageDays >= 1.5) return 'amber'
  return 'green'
}

/** Fire order: red first, then amber, then oldest first within a band. */
export function fireOrder(a: RailTicket, b: RailTicket): number {
  const rank: Record<Urgency, number> = { red: 0, amber: 1, green: 2 }
  const d = rank[urgency(a)] - rank[urgency(b)]
  if (d !== 0) return d
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
}
