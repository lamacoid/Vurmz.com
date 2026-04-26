import { NextResponse } from 'next/server'
import { listNav } from '@/lib/db/repos/navigation'

export const runtime = 'edge'

export async function GET() {
  try {
    const [header, footer, footerLegal, mobile] = await Promise.all([
      listNav('header'),
      listNav('footer'),
      listNav('footer-legal'),
      listNav('mobile'),
    ])
    return NextResponse.json({
      ok: true,
      data: { header, footer, 'footer-legal': footerLegal, mobile },
    })
  } catch {
    return NextResponse.json({ ok: false, data: { header: [], footer: [], 'footer-legal': [], mobile: [] } })
  }
}
