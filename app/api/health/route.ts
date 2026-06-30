import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

// This endpoint is public (uptime monitors hit it unauthenticated), so it
// returns only ok/latency booleans — never raw error strings or which binding
// is missing, to avoid handing attackers infrastructure detail.
type HealthCheck = { ok: boolean; latencyMs?: number }

async function check<T>(fn: () => Promise<T>): Promise<HealthCheck> {
  const t0 = Date.now()
  try {
    await fn()
    return { ok: true, latencyMs: Date.now() - t0 }
  } catch {
    return { ok: false, latencyMs: Date.now() - t0 }
  }
}

export async function GET(_req: NextRequest) {
  const startedAt = Date.now()
  const env = (() => {
    try {
      return getRequestContext().env as Partial<CloudflareEnv>
    } catch {
      return {} as Partial<CloudflareEnv>
    }
  })()

  const [db, trackDb, sessions, media] = await Promise.all([
    env.DB ? check(() => env.DB!.prepare('SELECT 1').first()) : Promise.resolve({ ok: false }),
    env.TRACK_DB ? check(() => env.TRACK_DB!.prepare('SELECT 1').first()) : Promise.resolve({ ok: false }),
    env.SESSIONS ? check(() => env.SESSIONS!.get('__health_probe')) : Promise.resolve({ ok: false }),
    env.MEDIA ? check(() => env.MEDIA!.head('__health_probe')) : Promise.resolve({ ok: true }),
  ])

  const allOk = db.ok && trackDb.ok && sessions.ok
  const status = allOk ? 200 : 503

  return NextResponse.json(
    {
      ok: allOk,
      timestamp: new Date().toISOString(),
      totalLatencyMs: Date.now() - startedAt,
      checks: { db, trackDb, sessions, media },
    },
    {
      status,
      headers: { 'Cache-Control': 'no-store' },
    }
  )
}
