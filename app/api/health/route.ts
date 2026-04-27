import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

type HealthCheck = { ok: boolean; latencyMs?: number; error?: string }

async function check<T>(fn: () => Promise<T>): Promise<HealthCheck> {
  const t0 = Date.now()
  try {
    await fn()
    return { ok: true, latencyMs: Date.now() - t0 }
  } catch (err) {
    return { ok: false, latencyMs: Date.now() - t0, error: err instanceof Error ? err.message : 'unknown' }
  }
}

export async function GET(_req: NextRequest) {
  const startedAt = Date.now()
  const env = (() => {
    try {
      return getRequestContext().env as unknown as {
        DB?: D1Database
        TRACK_DB?: D1Database
        SESSIONS?: KVNamespace
        MEDIA?: R2Bucket
      }
    } catch {
      return {} as Record<string, never>
    }
  })()

  const [db, trackDb, sessions, media] = await Promise.all([
    env.DB ? check(() => env.DB!.prepare('SELECT 1').first()) : Promise.resolve({ ok: false, error: 'binding missing' }),
    env.TRACK_DB ? check(() => env.TRACK_DB!.prepare('SELECT 1').first()) : Promise.resolve({ ok: false, error: 'binding missing' }),
    env.SESSIONS ? check(() => env.SESSIONS!.get('__health_probe')) : Promise.resolve({ ok: false, error: 'binding missing' }),
    env.MEDIA ? check(() => env.MEDIA!.head('__health_probe')) : Promise.resolve({ ok: true, error: 'skipped' }),
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
