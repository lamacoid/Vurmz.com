import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getAllSettings, setSetting } from '@/lib/db/repos/settings'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const settings = await getAllSettings()
    return NextResponse.json({ ok: true, data: { settings } })
  })
}

const putSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.unknown(),
})

export async function PUT(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    const body = putSchema.safeParse(await req.json())
    if (!body.success) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: body.error.issues } }, { status: 422 })
    }
    await setSetting(body.data.key, body.data.value)
    await audit({
      actorType: 'admin',
      actorId: session.email ?? null,
      action: 'settings.update',
      targetType: 'setting',
      targetId: body.data.key,
      diff: { value: body.data.value },
      ip: getClientIp(req),
      userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true })
  })
}
