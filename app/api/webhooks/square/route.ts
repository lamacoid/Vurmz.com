import { NextRequest, NextResponse } from 'next/server'
import { getDb, getEnv, newId, nowIso } from '@/lib/db/client'
import { recordSquarePayout, recordSquareRefund, settleSquarePayment } from '@/lib/money/settle'
import { audit } from '@/lib/audit'
import { reportError } from '@/lib/error'

export const runtime = 'edge'

/**
 * Square webhook. Failure design (PIPELINE.md section 7, note 3):
 *  - the raw event is persisted FIRST, keyed on Square's event id; a
 *    duplicate returns 200 at once so Square stops retrying;
 *  - an invalid signature is stored with signature_valid=0 and refused;
 *  - only COMPLETED payments and refunds post money; PENDING and FAILED
 *    are logged and ignored;
 *  - every posting is idempotent on the Square object id, so events
 *    arriving twice or out of order cannot double-count;
 *  - a processing error is written to the event row and returns 500 so
 *    Square retries; the retry is safe for the same reasons.
 *
 * reference_id on a payment is our order id (shop checkout) or our
 * invoice id (invoice pay page). settleSquarePayment resolves both.
 */
async function verifySignature(body: string, signature: string, signatureKey: string, notificationUrl: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(signatureKey), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(notificationUrl + body))
  const computed = btoa(String.fromCharCode(...new Uint8Array(sig)))
  return safeEq(computed, signature)
}

function safeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return mismatch === 0
}

interface Money { amount: number; currency: string }
interface SquareEvent {
  event_id: string
  type: string
  created_at?: string
  data?: {
    type?: string
    id?: string
    object?: {
      payment?: {
        id: string
        status: string
        amount_money?: Money
        reference_id?: string
        receipt_url?: string
        created_at?: string
        updated_at?: string
        processing_fee?: Array<{ amount_money?: Money; type?: string }>
        card_details?: { card?: { last_4?: string; card_brand?: string } }
      }
      refund?: {
        id: string
        status: string
        payment_id?: string
        amount_money?: Money
        reason?: string
        created_at?: string
      }
      payout?: {
        id: string
        status: string
        amount_money?: Money
        created_at?: string
        arrival_date?: string
      }
    }
  }
}

export async function POST(req: NextRequest) {
  const env = getEnv()
  const rawBody = await req.text()
  const signature = req.headers.get('x-square-hmacsha256-signature') ?? ''
  const signatureKey = env.SQUARE_WEBHOOK_SIGNATURE_KEY
  const notificationUrl = new URL(req.url).toString()

  let parsed: SquareEvent
  try {
    parsed = JSON.parse(rawBody) as SquareEvent
  } catch {
    return new NextResponse('bad body', { status: 400 })
  }
  if (!parsed.event_id || !parsed.type) return new NextResponse('bad event', { status: 400 })
  const db = getDb()

  let signatureValid = false
  if (signatureKey) {
    try {
      signatureValid = await verifySignature(rawBody, signature, signatureKey, notificationUrl)
    } catch {
      signatureValid = false
    }
  }

  // 1. Persist first. A duplicate event id is already handled (or in
  //    flight) and gets 200 at once, unless the earlier attempt failed: then
  //    this delivery is Square's retry and we let it run again.
  const ins = await db.prepare(
    `INSERT INTO square_events (id, event_type, square_event_id, payload, signature_valid, received_at)
     VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(square_event_id) DO NOTHING`
  ).bind(newId('sev'), parsed.type, parsed.event_id, rawBody, signatureValid ? 1 : 0, nowIso()).run()
  if ((ins.meta?.changes ?? 0) === 0) {
    const prior = await db.prepare('SELECT processed_at, error FROM square_events WHERE square_event_id = ?')
      .bind(parsed.event_id).first<{ processed_at: string | null; error: string | null }>()
    const retryable = prior && !prior.processed_at && !!prior.error
    if (!retryable) return NextResponse.json({ ok: true, deduped: true })
    await db.prepare('UPDATE square_events SET error = NULL, signature_valid = ?, received_at = ? WHERE square_event_id = ?')
      .bind(signatureValid ? 1 : 0, nowIso(), parsed.event_id).run()
  }

  if (!signatureValid) {
    return new NextResponse('invalid signature', { status: 401 })
  }

  // 2. Post money. Any throw marks the event and asks Square to retry.
  try {
    const obj = parsed.data?.object ?? {}
    const payment = obj.payment
    const refund = obj.refund
    const payout = obj.payout

    if (payment && parsed.type.startsWith('payment.')) {
      if (payment.status === 'COMPLETED' && payment.amount_money) {
        const feeCents = (payment.processing_fee ?? []).reduce((s, f) => s + Math.abs(f.amount_money?.amount ?? 0), 0)
        const r = await settleSquarePayment({
          squarePaymentId: payment.id,
          amountCents: payment.amount_money.amount,
          occurredAt: payment.created_at ?? parsed.created_at,
          receiptUrl: payment.receipt_url ?? null,
          brand: payment.card_details?.card?.card_brand ?? null,
          last4: payment.card_details?.card?.last_4 ?? null,
          referenceId: payment.reference_id ?? null,
          source: 'square_webhook',
          feeCents: feeCents || null,
        })
        if (r.inserted) {
          await audit({
            actorType: 'webhook', action: 'payment.completed_via_webhook',
            targetType: r.invoiceId ? 'invoice' : 'order', targetId: r.invoiceId ?? r.orderId ?? payment.id,
            diff: { amount: payment.amount_money.amount, square_payment: payment.id, matched: !!(r.orderId || r.invoiceId) },
          })
        }
      }
    } else if (refund && parsed.type.startsWith('refund.')) {
      if (refund.status === 'COMPLETED' && refund.amount_money) {
        const r = await recordSquareRefund({
          squareRefundId: refund.id,
          squarePaymentId: refund.payment_id ?? null,
          amountCents: refund.amount_money.amount,
          occurredAt: refund.created_at ?? parsed.created_at,
          source: 'square_webhook',
          reason: refund.reason,
        })
        if (r.inserted) {
          await audit({
            actorType: 'webhook', action: 'refund.completed_via_webhook', targetType: 'payment',
            targetId: refund.payment_id ?? refund.id,
            diff: { amount: refund.amount_money.amount, square_refund: refund.id },
          })
        }
      }
    } else if (payout && parsed.type.startsWith('payout.')) {
      // PAID is the one that moved money. SENT/FAILED are noise for the books.
      if (payout.status === 'PAID' && payout.amount_money) {
        await recordSquarePayout({
          squarePayoutId: payout.id,
          amountCents: payout.amount_money.amount,
          occurredAt: payout.arrival_date ?? payout.created_at ?? parsed.created_at,
          source: 'square_webhook',
          status: payout.status,
        })
      }
    }

    await db.prepare('UPDATE square_events SET processed_at = ? WHERE square_event_id = ?')
      .bind(nowIso(), parsed.event_id).run()
    return NextResponse.json({ ok: true })
  } catch (err) {
    reportError(err, { route: 'webhooks/square', extra: { eventId: parsed.event_id, type: parsed.type } })
    try {
      await db.prepare('UPDATE square_events SET error = ? WHERE square_event_id = ?')
        .bind(String((err as Error)?.message ?? err).slice(0, 500), parsed.event_id).run()
    } catch { /* best effort */ }
    // 500 so Square retries; the row above now carries the error, which
    // is what lets the retry through the dedupe gate.
    return new NextResponse('processing failed', { status: 500 })
  }
}
