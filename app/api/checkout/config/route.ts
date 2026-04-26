import { NextResponse } from 'next/server'
import { getSquareConfig } from '@/lib/payments/square'

export const runtime = 'edge'

export async function GET() {
  const cfg = getSquareConfig()
  return NextResponse.json({
    ok: true,
    data: {
      square: cfg ? { applicationId: cfg.applicationId, locationId: cfg.locationId, environment: cfg.environment } : null,
    },
  })
}
