import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getTheme, saveTheme } from '@/lib/db/repos/theme'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const theme = await getTheme()
    return NextResponse.json({ ok: true, data: { theme } })
  })
}

const patchSchema = z.object({
  colors: z.record(z.string(), z.string()).optional(),
  fonts: z.record(z.string(), z.string()).optional(),
  spacing: z.record(z.string(), z.string()).optional(),
})

export async function PATCH(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    const body = patchSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    await saveTheme(body.data as never)
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'theme.update', targetType: 'theme', targetId: 'default',
      diff: body.data, ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    const theme = await getTheme()
    return NextResponse.json({ ok: true, data: { theme } })
  })
}
