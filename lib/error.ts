/**
 * Lightweight error reporter for the Cloudflare Pages edge runtime.
 *
 * Posts to Sentry's HTTP envelope endpoint when SENTRY_DSN is set.
 * Falls back to console.error when not configured (local / preview).
 *
 * Edge-runtime safe: no Node APIs, no SDK dependency, ~80 LoC.
 *
 * Setup:
 *   1. Create a Sentry project at sentry.io (Platform: Cloudflare Workers).
 *   2. wrangler pages secret put SENTRY_DSN --project-name=vurmz-website
 *   3. Errors automatically flow to Sentry from any reportError() call.
 */

interface ErrorContext {
  route?: string
  method?: string
  userId?: string | null
  extra?: Record<string, unknown>
}

function parseDsn(dsn: string): { url: string; key: string } | null {
  // dsn format: https://<key>@<host>/<projectId>
  const m = dsn.match(/^https:\/\/([^@]+)@([^/]+)\/(\d+)$/)
  if (!m) return null
  const [, key, host, projectId] = m
  return { url: `https://${host}/api/${projectId}/envelope/`, key }
}

export async function reportError(err: unknown, ctx: ErrorContext = {}): Promise<void> {
  const dsn = (globalThis as { SENTRY_DSN?: string }).SENTRY_DSN || process.env.SENTRY_DSN
  const message = err instanceof Error ? err.message : String(err)
  const stack = err instanceof Error ? err.stack : undefined

  // Always log locally
  console.error('[error]', message, ctx, stack)

  if (!dsn) return

  const parsed = parseDsn(dsn)
  if (!parsed) return

  const eventId = crypto.randomUUID().replace(/-/g, '')
  const timestamp = new Date().toISOString()

  const event = {
    event_id: eventId,
    timestamp,
    platform: 'javascript',
    level: 'error',
    logger: 'vurmz',
    message: { formatted: message },
    exception: stack ? { values: [{ type: err instanceof Error ? err.name : 'Error', value: message, stacktrace: { frames: parseStack(stack) } }] } : undefined,
    tags: {
      route: ctx.route ?? 'unknown',
      method: ctx.method ?? 'unknown',
    },
    user: ctx.userId ? { id: ctx.userId } : undefined,
    extra: ctx.extra,
  }

  const envelope =
    JSON.stringify({ event_id: eventId, sent_at: timestamp }) +
    '\n' +
    JSON.stringify({ type: 'event' }) +
    '\n' +
    JSON.stringify(event)

  try {
    await fetch(parsed.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-sentry-envelope',
        'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=${parsed.key}, sentry_client=vurmz/1.0`,
      },
      body: envelope,
    })
  } catch {
    // Reporting must never break the app
  }
}

function parseStack(stack: string): Array<{ filename?: string; function?: string; lineno?: number; colno?: number }> {
  return stack
    .split('\n')
    .slice(1)
    .map((line) => {
      const m = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/) || line.match(/at\s+(.+?):(\d+):(\d+)/)
      if (!m) return { function: line.trim() }
      if (m.length === 5) return { function: m[1], filename: m[2], lineno: Number(m[3]), colno: Number(m[4]) }
      return { filename: m[1], lineno: Number(m[2]), colno: Number(m[3]) }
    })
}
