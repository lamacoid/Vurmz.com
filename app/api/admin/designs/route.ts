import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { listDesignsAdmin } from '@/lib/designer/designs-repo'

export const runtime = 'edge'

/** The Designs room: every design anyone made, ordered or not. */
export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const ordered = (req.nextUrl.searchParams.get('ordered') ?? 'all') as 'yes' | 'no' | 'all'
    const designs = await listDesignsAdmin({ ordered, limit: 300 })
    return NextResponse.json({ ok: true, data: { designs } })
  })
}
