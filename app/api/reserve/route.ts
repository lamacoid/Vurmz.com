export const runtime = 'edge'

/**
 * A reservation from the reserve room. The piece is not a catalog product
 * (I go and buy it), so the order is a QUOTE: it lands on the admin quotes
 * board with the engraving written into the notes, the customer exists or
 * is created, Zach gets an email with the admin link, the customer gets a
 * branded confirmation, and the contact inbox gets a card so nothing is
 * missed. The record is written BEFORE any email, so a reservation is
 * never lost to a mail failure. Prices are computed here from
 * lib/sourcing and lib/pricing; the client's numbers are never trusted.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { createQuote } from '@/lib/db/repos/quotes'
import { upsertCustomerByEmail } from '@/lib/db/repos/customers'
import { audit } from '@/lib/audit'
import { reportError } from '@/lib/error'
import { renderBrandedEmail, renderBrandedEmailText } from '@/lib/email/branded'
import { fontOptions } from '@/lib/fonts'
import { SOURCING } from '@/lib/pricing'
import { sourcedBySlug, deliveredPrice } from '@/lib/sourcing'
import { siteInfo } from '@/lib/site-info'

const ALLOWED_ORIGINS = ['https://vurmz.com', 'https://www.vurmz.com', 'http://localhost:3000']
const RATE_MAX = 5
const RATE_WINDOW = 600

const schema = z.object({
  slug: z.string().min(1).max(80),
  text: z.string().trim().min(1).max(40),
  font: z.string().min(1).max(60),
  placement: z.string().min(1).max(60),
  giftBox: z.boolean().optional().default(false),
  second: z.boolean().optional().default(false),
  notes: z.string().max(400).optional().default(''),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional().default(''),
  /** Honeypot. Humans never see it. */
  website: z.string().max(200).optional().default(''),
})

const clean = (s: string) => s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').replace(/[\r\n]+/g, ' ').trim()
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const usd = (n: number) => `$${n.toLocaleString('en-US')}`

function clientIp(req: NextRequest): string {
  return req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

async function rateLimited(ip: string): Promise<boolean> {
  try {
    const { env } = getRequestContext()
    const kv = env.RATE_LIMIT
    if (!kv) return false
    const key = `reserve:${ip}`
    const n = parseInt((await kv.get(key)) ?? '0', 10)
    if (n >= RATE_MAX) return true
    await kv.put(key, String(n + 1), { expirationTtl: RATE_WINDOW })
    return false
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin')
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ ok: false, error: { code: 'FORBIDDEN' } }, { status: 403 })
    }
    const ip = clientIp(req)
    if (await rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: { code: 'RATE_LIMITED', message: 'Too many tries. Wait a few minutes, or text me.' } },
        { status: 429, headers: { 'Retry-After': String(RATE_WINDOW) } }
      )
    }

    const parsed = schema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Check the words, your name, and your email.' } }, { status: 422 })
    }
    const body = parsed.data
    // A filled honeypot is a bot. Quiet success so it does not retry.
    if (body.website) return NextResponse.json({ ok: true, data: { number: 'R-0000' } })

    const item = sourcedBySlug(body.slug)
    if (!item) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    const font = fontOptions.find(f => f.value === body.font) ?? fontOptions[0]
    const placement = item.placements.includes(body.placement) ? body.placement : item.placements[0]

    const text = clean(body.text)
    const name = clean(body.name)
    const email = body.email.toLowerCase()
    const phone = clean(body.phone)
    const notes = body.notes.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim()

    // Money, from the source of truth.
    const base = deliveredPrice(item)
    const items = [
      { description: `${item.name} (${item.maker}) at its price`, qty: 1, unitPriceCents: item.retail * 100 },
      { description: 'Found, engraved, hand delivered', qty: 1, unitPriceCents: (base - item.retail) * 100 },
      ...(body.giftBox ? [{ description: 'Gift box', qty: 1, unitPriceCents: SOURCING.giftBox * 100 }] : []),
      ...(body.second ? [{ description: 'Second placement', qty: 1, unitPriceCents: SOURCING.secondLocation * 100 }] : []),
    ]
    const total = items.reduce((s, it) => s + it.unitPriceCents * it.qty, 0) / 100
    const deposit = SOURCING.deposit(item.retail)

    const engravingLines = [
      `RESERVE PIECE: ${item.name}`,
      `Engrave: "${text}"`,
      `Face: ${font.label} (${font.value})`,
      `Placement: ${placement}`,
      `Gift box: ${body.giftBox ? 'yes' : 'no'}. Second placement: ${body.second ? 'yes' : 'no'}.`,
      `Buy at: ${item.where}. Retail ${usd(item.retail)}.`,
      `Deposit to take: ${usd(deposit)} (the piece plus half the fee).`,
      phone ? `Phone: ${phone}` : '',
      notes ? `Customer notes: ${notes}` : '',
    ].filter(Boolean)

    // 1. The customer, then the quote. Written first, before any email.
    const customer = await upsertCustomerByEmail({ email, name, phone: phone || null })
    const quote = await createQuote({
      customerId: customer.id,
      email,
      items,
      notes: engravingLines.join('\n'),
    })
    await audit({
      actorType: 'customer', actorId: customer.id,
      action: 'quote.create', targetType: 'quote', targetId: quote.id,
      diff: { number: quote.number, total: quote.totalCents, source: 'reserve', slug: item.slug },
      ip, userAgent: req.headers.get('user-agent'),
    })

    // 2. A card in the contact inbox, so it shows with the messages too.
    try {
      const { env } = getRequestContext()
      const kv = env.RATE_LIMIT
      if (kv) {
        const id = crypto.randomUUID().slice(0, 8)
        const card = {
          id, name, email, phone,
          message: `Reserved ${item.name}. ${quote.number}, ${usd(total)}.\n\n${engravingLines.join('\n')}`,
          productInterest: 'Reserve',
          read: false, archived: false,
          receivedAt: new Date().toISOString(),
          notes: '',
        }
        await kv.put(`inbox:${id}`, JSON.stringify(card), { expirationTtl: 7776000 })
        const idx = await kv.get('inbox:_index')
        const ids: string[] = idx ? JSON.parse(idx) : []
        ids.unshift(id)
        await kv.put('inbox:_index', JSON.stringify(ids.slice(0, 500)))
      }
    } catch (e) {
      await reportError(e, { route: 'reserve', extra: { step: 'inbox' } })
    }

    // 3. Mail, best effort. The reservation already exists.
    let key: string | undefined
    try { key = getRequestContext().env.RESEND_API_KEY } catch {}
    if (!key) key = process.env.RESEND_API_KEY
    if (key) {
      const adminHref = `https://www.vurmz.com/admin/quotes/${quote.id}`
      const rows = items.map(it => `<tr><td style="padding:6px 0;color:#333">${esc(it.description)}</td><td style="text-align:right;padding:6px 0">${usd(it.unitPriceCents / 100)}</td></tr>`).join('')
      const toZach = fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'VURMZ Reserve <noreply@vurmz.com>',
          to: 'zach@vurmz.com',
          reply_to: email,
          subject: `Reserve: ${item.name} for ${name.slice(0, 60)} (${quote.number}, ${usd(total)})`,
          html: `
            <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:28px 20px;color:#111">
              <h2 style="margin:0 0 6px;font-size:20px">${esc(item.name)}</h2>
              <p style="margin:0 0 16px;color:#555">${esc(name)} &middot; <a href="mailto:${esc(email)}">${esc(email)}</a>${phone ? ` &middot; <a href="sms:${esc(phone)}">${esc(phone)}</a>` : ''}</p>
              <pre style="white-space:pre-wrap;font-family:ui-monospace,Menlo,monospace;font-size:13px;background:#f6f4ef;padding:12px;border-radius:6px">${esc(engravingLines.join('\n'))}</pre>
              <table style="width:100%;margin:16px 0;border-top:1px solid #eee;border-bottom:1px solid #eee">${rows}
                <tr><td style="padding:10px 0;font-weight:700">Total</td><td style="text-align:right;padding:10px 0;font-weight:700">${usd(total)}</td></tr>
              </table>
              <p><a href="${adminHref}" style="display:inline-block;background:#C67A6F;color:#fff;text-decoration:none;padding:10px 16px;border-radius:6px;font-weight:600">Open ${esc(quote.number)} in the admin</a></p>
              <p style="color:#777;font-size:12px">Next: text ${esc(name)} for the ${usd(deposit)} deposit, buy the piece, proof, engrave, deliver.</p>
            </div>`,
        }),
      })
      const bodyText = [
        `Your ${item.name} is reserved, ${quote.number}.`,
        `The words: "${text}" in ${font.label}, on the ${placement.toLowerCase()}.${body.giftBox ? ' Gift box, yes.' : ''}${body.second ? ' A second placement, yes.' : ''}`,
        `${usd(total)} delivered: the ${item.noun} at ${usd(item.retail)}, receipt in the box, plus ${usd(SOURCING.reserveFee)} to find it, mark it, and bring it. I will text or email you today for a ${usd(deposit)} deposit, which holds the piece before I buy it and comes back in full if you change your mind before then.`,
        `You approve a proof photo before anything runs. ${item.leadTime}`,
        `Zach`,
      ].join('\n\n')
      const toCustomer = fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Zach at VURMZ <noreply@vurmz.com>',
          to: email,
          reply_to: 'zach@vurmz.com',
          subject: `Reserved: ${item.name} (${quote.number})`,
          html: renderBrandedEmail({ heading: 'Reserved.', body: bodyText, ctaLabel: `Text ${siteInfo.phone}`, ctaHref: `sms:${siteInfo.phoneClean}` }),
          text: renderBrandedEmailText({ heading: 'Reserved.', body: bodyText }),
        }),
      })
      const [a, b] = await Promise.allSettled([toZach, toCustomer])
      for (const r of [a, b]) {
        if (r.status === 'rejected' || !r.value.ok) {
          await reportError(new Error('Reserve email failed'), { route: 'reserve', extra: { step: 'mail', quote: quote.number } })
        }
      }
    } else {
      console.error('RESEND_API_KEY not configured; reservation stored, mail skipped')
    }

    return NextResponse.json({ ok: true, data: { number: quote.number, total, deposit } })
  } catch (e) {
    await reportError(e, { route: 'reserve' })
    return NextResponse.json({ ok: false, error: { code: 'SERVER', message: 'That did not go through. Nothing was saved; text me instead.' } }, { status: 500 })
  }
}
