/**
 * The failproof bump pipe (RAIL-SYSTEM-PLAN I8). Every rail mutation
 * goes through railBump:
 *
 *   - transient failures (network, 5xx) retry themselves with backoff;
 *   - a stale ticket (409) is not an error, it is news: the caller
 *     refreshes to reality and moves on;
 *   - exhausted retries PARK the bump in localStorage and it replays
 *     itself on the next page load or when connectivity returns.
 *
 * Replays are safe because every guarded bump is compare-and-swap on
 * the server: a bump that already landed (or was overtaken) comes back
 * 409 and is dropped from the queue, never applied twice.
 */

export interface BumpBody {
  status?: string
  proof?: string
  expectedStatus?: string
  expectedProof?: string
  settle?: 'cash'
  note?: string
}

export type BumpResult = 'ok' | 'stale' | 'queued'

const QUEUE_KEY = 'vurmz-rail-pending'
const RETRIES = [400, 1200, 2600]

interface Parked { orderId: string; body: BumpBody; at: string }

function readQueue(): Parked[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]') as Parked[]
  } catch {
    return []
  }
}

function writeQueue(q: Parked[]) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)) } catch { /* storage full; retries still cover us */ }
}

export function pendingBumps(): number {
  return readQueue().length
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function attempt(orderId: string, body: BumpBody): Promise<'ok' | 'stale' | 'retryable' | 'fatal'> {
  try {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) return 'ok'
    if (res.status === 409) return 'stale'
    if (res.status >= 500) return 'retryable'
    return 'fatal' // 401/422: retrying will not help; surface plainly
  } catch {
    return 'retryable' // network: the shop has dead spots
  }
}

/**
 * Bump with retries; parks in the queue if the connection is truly gone.
 * Throws only on fatal responses (session expired, bad request), with a
 * plain-language message.
 */
export async function railBump(orderId: string, body: BumpBody): Promise<BumpResult> {
  for (let i = 0; i <= RETRIES.length; i++) {
    const r = await attempt(orderId, body)
    if (r === 'ok') return 'ok'
    if (r === 'stale') return 'stale'
    if (r === 'fatal') throw new Error('That did not save. Refresh the page; if it keeps happening, sign in again.')
    if (i < RETRIES.length) await sleep(RETRIES[i])
  }
  // Only guarded bumps park: CAS makes their replay provably safe.
  // (settle is CAS on the settled flag itself, so it parks too.)
  if (body.expectedStatus || body.expectedProof || body.settle) {
    writeQueue([...readQueue(), { orderId, body, at: new Date().toISOString() }])
    return 'queued'
  }
  throw new Error('No connection right now. Try again in a moment.')
}

/**
 * Replay parked bumps. Success and staleness both clear an entry (stale
 * means the world moved on; CAS already refused the write). Only a still
 * unreachable server keeps entries parked. Returns how many remain.
 */
export async function drainQueue(): Promise<number> {
  const q = readQueue()
  if (q.length === 0) return 0
  const remaining: Parked[] = []
  for (const p of q) {
    const r = await attempt(p.orderId, p.body)
    if (r === 'retryable') remaining.push(p)
    // ok, stale, and fatal all drop the entry: replaying can never help twice.
  }
  writeQueue(remaining)
  return remaining.length
}
