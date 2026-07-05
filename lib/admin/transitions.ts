/**
 * The one transition table (RAIL-SYSTEM-PLAN I3, I4, I7). The read side
 * (nextAction) picks the forward move from here; the write side (the
 * orders PATCH) guards guarded bumps against illegal or stale moves
 * with the same table. Manual moves (kanban drag, no expectedStatus)
 * stay free on purpose: an admin correcting reality is a feature. Only
 * the bump path is armored, because that is the path a USB button and a
 * gloved thumb will hammer.
 */

export type BumpStatus = 'new' | 'confirmed' | 'in_progress' | 'ready' | 'delivered' | 'cancelled' | 'refunded'
export type ProofState = 'needed' | 'sent' | 'approved'

export const FORWARD: Record<BumpStatus, BumpStatus | null> = {
  new: 'confirmed',
  confirmed: 'in_progress',
  in_progress: 'ready',
  ready: 'delivered',
  delivered: null,
  cancelled: null,
  refunded: null,
}

export const PROOF_FORWARD: Record<ProofState, ProofState | null> = {
  needed: 'sent',
  sent: 'approved',
  approved: null,
}

export function isForwardBump(from: BumpStatus, to: BumpStatus): boolean {
  return FORWARD[from] === to
}

/** The legal one-step undo (I7): FORWARD read backwards. */
export function reverseOf(status: BumpStatus): BumpStatus | null {
  for (const [from, to] of Object.entries(FORWARD)) {
    if (to === status) return from as BumpStatus
  }
  return null
}

/** A guarded move is legal if it is the forward bump or its exact undo. */
export function isLegalGuardedMove(from: BumpStatus, to: BumpStatus): boolean {
  return isForwardBump(from, to) || isForwardBump(to, from)
}

export function isLegalGuardedProofMove(from: ProofState, to: ProofState): boolean {
  return PROOF_FORWARD[from] === to || PROOF_FORWARD[to] === from
}
