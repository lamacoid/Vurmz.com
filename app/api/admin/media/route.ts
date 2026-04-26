import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { listMedia } from '@/lib/db/repos/media'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const url = new URL(req.url)
    const folder = url.searchParams.get('folder') ?? undefined
    const limit = Number(url.searchParams.get('limit') ?? 100)
    const offset = Number(url.searchParams.get('offset') ?? 0)
    const items = await listMedia({ folder, limit, offset })
    return NextResponse.json({ ok: true, data: { items } })
  })
}
