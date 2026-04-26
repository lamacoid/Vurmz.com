export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { withAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    const { env } = getRequestContext()
    const kv = (env as unknown as Record<string, KVNamespace>).RATE_LIMIT
    if (!kv) return NextResponse.json({ messages: [] })

    const indexStr = await kv.get('inbox:_index')
    if (!indexStr) return NextResponse.json({ messages: [] })

    const ids: string[] = JSON.parse(indexStr)

    const messages = []
    for (const id of ids.slice(0, 100)) {
      const data = await kv.get(`inbox:${id}`)
      if (data) messages.push(JSON.parse(data))
    }

    return NextResponse.json({ messages })
  })
}

export async function PUT(request: NextRequest) {
  return withAuth(request, async () => {
    const { env } = getRequestContext()
    const kv = (env as unknown as Record<string, KVNamespace>).RATE_LIMIT
    if (!kv) return NextResponse.json({ error: 'KV not available' }, { status: 500 })

    const body = await request.json() as { id: string; read?: boolean; archived?: boolean; notes?: string }

    if (!body.id || typeof body.id !== 'string' || body.id.length > 50) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }
    if (body.notes !== undefined && body.notes.length > 5000) {
      return NextResponse.json({ error: 'Notes too long' }, { status: 400 })
    }

    const existing = await kv.get(`inbox:${body.id}`)
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const msg = JSON.parse(existing)
    if (body.read !== undefined) msg.read = body.read
    if (body.archived !== undefined) msg.archived = body.archived
    if (body.notes !== undefined) msg.notes = body.notes

    await kv.put(`inbox:${msg.id}`, JSON.stringify(msg), { expirationTtl: 7776000 })
    return NextResponse.json(msg)
  })
}
