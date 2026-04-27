export const runtime = 'edge'

import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { ok, fail } from '@/lib/api/response'
import { reportError } from '@/lib/error'

const schema = z.object({ email: z.string().email().max(254) })

/**
 * Removes an email from the Resend Audience used for the newsletter.
 * Also accepts one-click unsubscribe (RFC 8058) — POST without body but
 * with the email in a query param.
 */
export async function POST(req: NextRequest) {
  try {
    let email: string | undefined

    const ct = req.headers.get('content-type') ?? ''
    if (ct.includes('application/json')) {
      const parsed = schema.safeParse(await req.json().catch(() => null))
      if (!parsed.success) return fail('VALIDATION', 'Invalid email')
      email = parsed.data.email
    } else {
      // RFC 8058 one-click POST has no body — accept email via query param
      email = req.nextUrl.searchParams.get('email') ?? undefined
      if (!email) return fail('VALIDATION', 'Email required')
    }

    const env = getRequestContext().env as Partial<CloudflareEnv>
    const apiKey = env.RESEND_API_KEY ?? process.env.RESEND_API_KEY
    const audienceId = env.RESEND_AUDIENCE_ID ?? process.env.RESEND_AUDIENCE_ID

    if (!apiKey || !audienceId) {
      // No backend configured — still acknowledge so user feels heard.
      // Zach manually removes if Resend is not yet wired.
      return ok({ removed: false, note: 'queued' })
    }

    const lc = email.toLowerCase().trim()
    // Resend identifies contacts by email within an audience
    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(lc)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    })

    if (!res.ok && res.status !== 404) {
      const text = await res.text().catch(() => '')
      await reportError(new Error(`Resend unsubscribe failed: ${res.status} ${text}`), { route: 'unsubscribe' })
      return fail('INTERNAL', 'Could not remove. Try again or email zach@vurmz.com.')
    }

    return ok({ removed: true })
  } catch (err) {
    await reportError(err, { route: 'unsubscribe' })
    return fail('INTERNAL', 'Something went wrong')
  }
}

// Allow GET for query-param mailto-style flows
export async function GET(req: NextRequest) {
  return POST(req)
}
