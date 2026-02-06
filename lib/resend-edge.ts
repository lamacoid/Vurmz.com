// Edge-compatible email sending via Resend API (no Node.js dependencies)

import { getRequestContext } from '@cloudflare/next-on-pages'

interface SendEmailOptions {
  from: string
  to: string | string[]
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content: string // base64 encoded
  }>
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  // Get API key from Cloudflare Pages env (secrets/vars), fallback to process.env for local dev
  let apiKey: string | undefined
  try {
    const { env } = getRequestContext()
    apiKey = (env as unknown as Record<string, string>).RESEND_API_KEY
  } catch {
    // Not in Cloudflare context (local dev)
  }
  if (!apiKey) {
    apiKey = process.env.RESEND_API_KEY
  }
  if (!apiKey) {
    console.error('RESEND_API_KEY not set in Cloudflare env or process.env')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: options.from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        attachments: options.attachments,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Resend API error:', error)
      return { success: false, error: 'Failed to send email' }
    }

    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
