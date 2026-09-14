import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCustomerSession } from '@/lib/auth/customer'
import { getRateLimit, newId } from '@/lib/db/client'
import { getClientIp } from '@/lib/auth/session'
import { CARD_MATERIALS, CARD_TEMPLATES } from '@/lib/designer/card'
import { adoptGuestDesigns, claimGuestDesigns, listDesignsForCustomer, saveDesign } from '@/lib/designer/designs-repo'

export const runtime = 'edge'

/**
 * Autosave for the designer. PUT saves (guest by token, account by session),
 * GET lists an account's designs, POST /claim attaches an email to a guest's
 * designs so they are kept. Guest tokens are minted here and never trusted
 * by shape alone for anything but their own rows.
 */
const designSchema = z.object({
  kind: z.literal('card'),
  id: z.string().regex(/^dsg_[a-z0-9]{24}$/).optional(),
  templateKey: z.string().refine(k => CARD_TEMPLATES.some(t => t.key === k)),
  materialKey: z.string().refine(k => CARD_MATERIALS.some(m => m.key === k)),
  nameFont: z.string().max(60),
  values: z.record(z.string().max(40), z.string().max(120)).refine(v => Object.keys(v).length <= 16),
  logo: z.object({
    key: z.string().regex(/^checkout\/gup_[a-z0-9]+\/[A-Za-z0-9._-]{1,180}$/),
    filename: z.string().min(1).max(200),
    mime: z.enum(['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp']),
  }).optional(),
})
const putSchema = z.object({
  token: z.string().regex(/^gdt_[a-z0-9]{24}$/).optional(),
  productId: z.string().min(1).max(60),
  design: designSchema,
  email: z.string().email().max(200).optional(),
})

async function limited(ip: string, key: string, max: number, windowSeconds: number): Promise<boolean> {
  try {
    const kv = getRateLimit()
    if (!kv) return false
    const k = `${key}:${ip}`
    const n = parseInt((await kv.get(k)) ?? '0', 10)
    if (n >= max) return true
    await kv.put(k, String(n + 1), { expirationTtl: windowSeconds })
    return false
  } catch { return false }
}

export async function PUT(req: NextRequest) {
  const ip = getClientIp(req) || 'unknown'
  if (await limited(ip, 'designs-save', 240, 600)) {
    return NextResponse.json({ ok: false, error: { code: 'RATE_LIMITED' } }, { status: 429 })
  }
  const parsed = putSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
  const body = parsed.data
  const session = await getCustomerSession(req)
  let token = body.token ?? null
  if (!session && !token) token = newId('gdt')
  if (session && body.token) await adoptGuestDesigns(body.token, session.customer.id)
  const { id } = await saveDesign({
    customerId: session?.customer.id ?? null,
    guestToken: session ? null : token,
    productId: body.productId,
    design: body.design,
    email: body.email ?? null,
  })
  return NextResponse.json({ ok: true, data: { id, token: session ? null : token } })
}

export async function GET(req: NextRequest) {
  const session = await getCustomerSession(req)
  if (!session) return NextResponse.json({ ok: false, error: { code: 'UNAUTHENTICATED' } }, { status: 401 })
  const designs = await listDesignsForCustomer(session.customer.id)
  return NextResponse.json({ ok: true, data: { designs } })
}

/** Leave an email with a guest's designs so they are kept for later. */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req) || 'unknown'
  if (await limited(ip, 'designs-claim', 20, 600)) {
    return NextResponse.json({ ok: false, error: { code: 'RATE_LIMITED' } }, { status: 429 })
  }
  const parsed = z.object({ token: z.string().regex(/^gdt_[a-z0-9]{24}$/), email: z.string().email().max(200) }).safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
  const claimed = await claimGuestDesigns(parsed.data.token, parsed.data.email)
  return NextResponse.json({ ok: true, data: { claimed } })
}
