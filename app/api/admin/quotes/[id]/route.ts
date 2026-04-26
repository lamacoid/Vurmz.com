import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getQuoteById, listQuoteItems, setQuoteStatus, type QuoteStatus } from '@/lib/db/repos/quotes'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await ctx.params
    const quote = await getQuoteById(id)
    if (!quote) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    const items = await listQuoteItems(id)
    return NextResponse.json({ ok: true, data: { quote, items } })
  })
}

const patchSchema = z.object({
  status: z.enum(['new','drafting','sent','accepted','declined','expired','converted']).optional(),
})

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const body = patchSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    if (body.data.status) {
      await setQuoteStatus(id, body.data.status as QuoteStatus)
      await audit({
        actorType: 'admin', actorId: session.email ?? null,
        action: 'quote.status_change', targetType: 'quote', targetId: id,
        diff: body.data, ip: getClientIp(req), userAgent: getUserAgent(req),
      })
    }
    const quote = await getQuoteById(id)
    return NextResponse.json({ ok: true, data: { quote } })
  })
}
