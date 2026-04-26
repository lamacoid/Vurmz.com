import { NextRequest, NextResponse } from 'next/server'
import { getDb, getEnv, newId, nowIso } from '@/lib/db/client'
import { getInvoiceById, recordInvoicePayment } from '@/lib/db/repos/invoices'
import { audit } from '@/lib/audit'

export const runtime = 'edge'

/**
 * Verify Square webhook signature.
 * Square signs the payload as base64(HMAC-SHA256(notificationUrl + body, signatureKey)).
 */
async function verifySignature(body: string, signature: string, signatureKey: string, notificationUrl: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(signatureKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
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

interface SquarePaymentPayload {
  event_id: string
  type: string
  data?: {
    object?: {
      payment?: {
        id: string
        status: string
        amount_money?: { amount: number; currency: string }
        reference_id?: string
        receipt_url?: string
        card_details?: { card?: { last_4?: string; card_brand?: string } }
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

  // Always log the event so we can replay if verification fails transiently
  let parsed: SquarePaymentPayload
  try {
    parsed = JSON.parse(rawBody) as SquarePaymentPayload
  } catch {
    return new NextResponse('bad body', { status: 400 })
  }
  const db = getDb()

  let signatureValid = false
  if (signatureKey) {
    try {
      signatureValid = await verifySignature(rawBody, signature, signatureKey, notificationUrl)
    } catch {
      signatureValid = false
    }
  }

  // Idempotent event log (square_event_id unique)
  try {
    await db.prepare(
      `INSERT INTO square_events (id, event_type, square_event_id, payload, signature_valid, received_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(
      newId('sev'),
      parsed.type,
      parsed.event_id,
      rawBody,
      signatureValid ? 1 : 0,
      nowIso()
    ).run()
  } catch {
    // Likely duplicate event_id — treat as already processed
    return NextResponse.json({ ok: true, deduped: true })
  }

  if (!signatureValid) {
    return new NextResponse('invalid signature', { status: 401 })
  }

  // Handle payment events
  const payment = parsed.data?.object?.payment
  if (payment && (parsed.type === 'payment.created' || parsed.type === 'payment.updated')) {
    const invoiceId = payment.reference_id
    if (invoiceId && payment.status === 'COMPLETED' && payment.amount_money) {
      const inv = await getInvoiceById(invoiceId)
      if (inv) {
        // Check if this payment has already been recorded
        const existing = await db.prepare('SELECT id FROM payments WHERE square_payment_id = ?').bind(payment.id).first<{ id: string }>()
        if (!existing) {
          await db.prepare(
            `INSERT INTO payments (id, invoice_id, customer_id, amount_cents, status, square_payment_id, square_receipt_url, method_brand, method_last4, metadata, created_at, updated_at)
             VALUES (?, ?, ?, ?, 'succeeded', ?, ?, ?, ?, '{}', ?, ?)`
          ).bind(
            newId('pay'),
            inv.id,
            inv.customerId,
            payment.amount_money.amount,
            payment.id,
            payment.receipt_url ?? null,
            payment.card_details?.card?.card_brand ?? null,
            payment.card_details?.card?.last_4 ?? null,
            nowIso(),
            nowIso()
          ).run()
          await recordInvoicePayment(inv.id, payment.amount_money.amount)
          await audit({
            actorType: 'webhook',
            action: 'invoice.paid_via_webhook',
            targetType: 'invoice',
            targetId: inv.id,
            diff: { amount: payment.amount_money.amount, square_payment: payment.id },
          })
        }
      }
    }
  }

  // Mark processed
  try {
    await db.prepare('UPDATE square_events SET processed_at = ? WHERE square_event_id = ?')
      .bind(nowIso(), parsed.event_id).run()
  } catch {}

  return NextResponse.json({ ok: true })
}
