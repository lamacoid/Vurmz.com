import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/auth/admin'
import { getMedia } from '@/lib/db/client'
import { getSetting } from '@/lib/db/repos/settings'

export const runtime = 'edge'

/**
 * Serve the latest books workbook. The worker never builds it (CPU and
 * memory limits); `npm run books` on the Mac builds it from the ledger
 * and uploads it to R2 under books/, then records where in site_settings.
 */
export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const last = await getSetting<{ key: string; year: number; at: string }>('books_last')
    if (!last?.key || !last.key.startsWith('books/')) {
      return NextResponse.json({ ok: false, error: { code: 'NOT_BUILT', message: 'Run npm run books on the Mac first.' } }, { status: 404 })
    }
    const obj = await getMedia().get(last.key)
    if (!obj) return NextResponse.json({ ok: false, error: { code: 'MISSING', message: 'The workbook is not in storage. Run npm run books again.' } }, { status: 404 })
    const name = `VURMZ Books ${last.year}.xlsx`
    return new NextResponse(obj.body, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${name}"`,
        'Cache-Control': 'private, no-store',
      },
    })
  })
}
