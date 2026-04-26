/**
 * Square Web Payments SDK integration.
 *
 * This module is feature-flagged: if SQUARE_ACCESS_TOKEN is absent the
 * whole payment layer is a no-op and checkout falls back to "send invoice later".
 * When creds are added to Cloudflare Pages, payments light up automatically —
 * no code change.
 */
import { getEnv } from '@/lib/db/client'

export interface SquareConfig {
  applicationId: string
  locationId: string
  environment: 'sandbox' | 'production'
}

export function getSquareConfig(): SquareConfig | null {
  const env = getEnv()
  if (!env.SQUARE_ACCESS_TOKEN || !env.SQUARE_APPLICATION_ID || !env.SQUARE_LOCATION_ID) {
    return null
  }
  return {
    applicationId: env.SQUARE_APPLICATION_ID,
    locationId: env.SQUARE_LOCATION_ID,
    environment: (env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'),
  }
}

export function isSquareEnabled(): boolean {
  return getSquareConfig() !== null
}

function squareApiBase(env: 'sandbox' | 'production') {
  return env === 'production' ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com'
}

/**
 * Charge a tokenized card. `sourceId` comes from the Web Payments SDK iframe on the client —
 * we never see raw card data.
 */
export async function createPayment(args: {
  sourceId: string
  amountCents: number
  currency?: string
  idempotencyKey: string
  note?: string
  referenceId?: string   // our order id
  buyerEmail?: string
}): Promise<
  | { ok: true; paymentId: string; status: string; receiptUrl: string | null; last4: string | null; brand: string | null }
  | { ok: false; error: string; details?: unknown }
> {
  const cfg = getSquareConfig()
  if (!cfg) return { ok: false, error: 'square_not_configured' }
  const env = getEnv()
  const res = await fetch(`${squareApiBase(cfg.environment)}/v2/payments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Square-Version': '2024-11-20',
    },
    body: JSON.stringify({
      source_id: args.sourceId,
      amount_money: { amount: args.amountCents, currency: args.currency ?? 'USD' },
      idempotency_key: args.idempotencyKey,
      location_id: cfg.locationId,
      note: args.note,
      reference_id: args.referenceId,
      buyer_email_address: args.buyerEmail,
      autocomplete: true,
    }),
  })
  const json = (await res.json()) as {
    payment?: {
      id: string
      status: string
      receipt_url?: string
      card_details?: { card?: { last_4?: string; card_brand?: string } }
    }
    errors?: Array<{ code: string; detail: string }>
  }
  if (!res.ok || !json.payment) {
    return { ok: false, error: 'square_api_error', details: json.errors }
  }
  return {
    ok: true,
    paymentId: json.payment.id,
    status: json.payment.status,
    receiptUrl: json.payment.receipt_url ?? null,
    last4: json.payment.card_details?.card?.last_4 ?? null,
    brand: json.payment.card_details?.card?.card_brand ?? null,
  }
}
