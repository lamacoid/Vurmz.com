export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { withAuth } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const { env } = getRequestContext()
    const kv = (env as any).RATE_LIMIT as KVNamespace

    // Get inbox index
    const indexRaw = await kv.get('inbox:_index')
    const index: string[] = indexRaw ? JSON.parse(indexRaw) : []

    // Fetch all messages
    const messages = []
    for (const id of index.slice(0, 100)) {
      const raw = await kv.get(`inbox:${id}`)
      if (raw) {
        try {
          messages.push(JSON.parse(raw))
        } catch {}
      }
    }

    // Sort newest first
    messages.sort((a: any, b: any) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())

    const unread = messages.filter((m: any) => !m.read && !m.archived).length
    const total = messages.length

    const filter = req.nextUrl.searchParams.get('filter') || 'all'
    let filtered = messages
    if (filter === 'unread') filtered = messages.filter((m: any) => !m.read && !m.archived)
    else if (filter === 'archived') filtered = messages.filter((m: any) => m.archived)

    return NextResponse.json({ messages: filtered, total, unread })
  })
}

export async function PUT(req: NextRequest) {
  return withAuth(req, async () => {
    const { env } = getRequestContext()
    const kv = (env as any).RATE_LIMIT as KVNamespace
    const body = await req.json() as { id: string; read?: boolean; archived?: boolean; notes?: string }

    if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const raw = await kv.get(`inbox:${body.id}`)
    if (!raw) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const msg = JSON.parse(raw)
    if (body.read !== undefined) msg.read = body.read
    if (body.archived !== undefined) msg.archived = body.archived
    if (body.notes !== undefined) msg.notes = body.notes

    await kv.put(`inbox:${body.id}`, JSON.stringify(msg), { expirationTtl: 7776000 })
    return NextResponse.json({ ok: true, message: msg })
  })
}
