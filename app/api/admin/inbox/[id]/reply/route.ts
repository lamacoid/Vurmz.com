export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { withAdminAuth } from '@/lib/auth/admin'
import { reportError } from '@/lib/error'
import { putObject } from '@/lib/media/r2'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

interface ReplyAttachment { key: string; filename: string; size: number }
interface Reply { body: string; sentAt: string; by: string; attachments?: ReplyAttachment[] }

interface InboxMsg {
  email?: string
  name?: string
  message?: string
  read?: boolean
  replies?: Reply[]
}

// What can ride along on a reply. Artwork, proofs, photos, the odd PDF.
const MAX_FILES = 5
const MAX_TOTAL_BYTES = 10 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml',
  'application/pdf', 'application/postscript', 'application/illustrator',
])
const ALLOWED_EXT = /\.(png|jpe?g|gif|webp|svg|pdf|ai|eps|dxf|lbrn2?)$/i

function bad(code: string, message: string, status = 400) {
  return NextResponse.json({ ok: false, error: { code, message } }, { status })
}

function base64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let bin = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(bin)
}

function safeName(name: string): string {
  const base = name.split(/[\\/]/).pop() || 'file'
  return base.replace(/[^A-Za-z0-9._ -]/g, '_').slice(0, 120) || 'file'
}

// Reply to a contact message by email, straight from the admin, with files if
// you want. Records the reply on the message (and keeps a copy of each file
// under the private customer/ prefix) so the thread shows it. The contact
// inbox lives in the RATE_LIMIT KV namespace (inbox:<id>).
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await ctx.params
    const { env } = getRequestContext()
    const kv = env.RATE_LIMIT

    // JSON (text only) or multipart (text + files). Both land here.
    let text = ''
    const files: File[] = []
    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData().catch(() => null)
      if (!form) return bad('BAD_FORM', 'Could not read the reply.')
      text = String(form.get('body') || '').trim()
      for (const f of form.getAll('files')) {
        if (f instanceof File && f.size > 0) files.push(f)
      }
    } else {
      const parsed = await req.json().catch(() => ({})) as { body?: string }
      text = (parsed.body || '').trim()
    }

    if (!text) return bad('EMPTY', 'Write a reply first.')
    if (text.length > 5000) return bad('TOO_LONG', 'Reply is too long.')
    if (files.length > MAX_FILES) return bad('TOO_MANY_FILES', `Up to ${MAX_FILES} files per reply.`)
    const totalBytes = files.reduce((n, f) => n + f.size, 0)
    if (totalBytes > MAX_TOTAL_BYTES) return bad('TOO_BIG', 'Files add up to more than 10 MB. Send a smaller version or a link.')
    for (const f of files) {
      const typeOk = ALLOWED_TYPES.has(f.type) || (!f.type && ALLOWED_EXT.test(f.name))
      if (!typeOk && !ALLOWED_EXT.test(f.name)) return bad('BAD_TYPE', `${f.name}: images, PDFs, and vector files only.`)
    }

    const raw = await kv.get(`inbox:${id}`)
    if (!raw) return bad('NOT_FOUND', 'Message not found.', 404)
    const msg = JSON.parse(raw) as InboxMsg
    if (!msg.email) return bad('NO_EMAIL', 'This message has no email to reply to.')

    const resendApiKey = env.RESEND_API_KEY
    if (!resendApiKey) return bad('EMAIL_OFF', 'Email is not set up yet.', 503)

    // Read the files once: one copy goes to Resend, one to R2 for the thread.
    const attachments: { filename: string; content: string; content_type?: string }[] = []
    const kept: ReplyAttachment[] = []
    const bufs: ArrayBuffer[] = []
    const stamp = Date.now()
    for (const f of files) {
      const buf = await f.arrayBuffer()
      const filename = safeName(f.name)
      bufs.push(buf)
      attachments.push({ filename, content: base64(buf), content_type: f.type || undefined })
      kept.push({ key: `customer/inbox-${id}/${stamp}-${filename}`, filename, size: f.size })
    }

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px 0;color:#111">
        <p style="font-size:15px;line-height:1.6;color:#333;white-space:pre-wrap">${esc(text)}</p>
        ${kept.length ? `<p style="font-size:13px;color:#666">Attached: ${kept.map(a => esc(a.filename)).join(', ')}</p>` : ''}
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
        <p style="font-size:13px;color:#666">Zach DeMillo &middot; VURMZ &middot; Centennial, CO &middot; (720) 468-0138</p>
        ${msg.message ? `<p style="font-size:12px;color:#999;margin-top:16px">Re: &ldquo;${esc((msg.message || '').slice(0, 300))}&rdquo;</p>` : ''}
      </div>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Zach at VURMZ <noreply@vurmz.com>',
        to: msg.email,
        reply_to: 'zach@vurmz.com',
        subject: 'Re: your message to VURMZ',
        html,
        ...(attachments.length ? { attachments } : {}),
      }),
    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      await reportError(new Error('Inbox reply email failed'), { route: 'admin/inbox/reply', extra: { errorData, files: kept.length } })
      return bad('SEND_FAILED', 'Could not send the email. Please try again.', 502)
    }

    // The email is out. Keep the copies; if R2 hiccups the reply still records.
    for (let i = 0; i < files.length; i++) {
      try {
        await putObject(kept[i].key, bufs[i], files[i].type || 'application/octet-stream')
      } catch (e) {
        await reportError(e, { route: 'admin/inbox/reply', extra: { step: 'r2 copy', key: kept[i].key } })
      }
    }

    msg.replies = Array.isArray(msg.replies) ? msg.replies : []
    msg.replies.push({ body: text, sentAt: new Date().toISOString(), by: 'admin', ...(kept.length ? { attachments: kept } : {}) })
    msg.read = true
    await kv.put(`inbox:${id}`, JSON.stringify(msg), { expirationTtl: 7776000 })

    return NextResponse.json({ ok: true, message: msg })
  }) as Promise<NextResponse>
}
