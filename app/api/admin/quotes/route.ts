import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { createQuote, listQuotes } from '@/lib/db/repos/quotes'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

const createSchema = z.object({
  customerId: z.string().nullable().optional(),
  email: z.string().email(),
  items: z.array(z.object({
    description: z.string().min(1).max(500),
    qty: z.number().int().min(1),
    unitPriceCents: z.number().int().nonnegative(),
  })).min(1).max(50),
  notes: z.string().max(2000).optional(),
  expiresAt: z.string().nullable().optional(),
})

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const quotes = await listQuotes({ limit: 500 })
    return NextResponse.json({ ok: true, data: { quotes } })
  })
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    const body = createSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: body.error.issues } }, { status: 422 })
    const quote = await createQuote(body.data)
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'quote.create', targetType: 'quote', targetId: quote.id,
      diff: { number: quote.number, total: quote.totalCents },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true, data: { quote } })
  })
}
