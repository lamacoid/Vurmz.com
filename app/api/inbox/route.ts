export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

// Simple auth — check for a secret header so only your admin can access
const ADMIN_SECRET = 'vurmz-admin-2026'

function checkAuth(request: NextRequest): boolean {
  return request.headers.get('x-admin-secret') === ADMIN_SECRET
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { env } = getRequestContext()
    const kv = (env as unknown as Record<string, KVNamespace>).RATE_LIMIT
    if (!kv) return NextResponse.json({ messages: [] })

    // Get the index of message IDs
    const indexStr = await kv.get('inbox:_index')
    if (!indexStr) return NextResponse.json({ messages: [] })

    const ids: string[] = JSON.parse(indexStr)

    // Fetch all messages
    const messages = []
    for (const id of ids.slice(0, 100)) {
      const data = await kv.get(`inbox:${id}`)
      if (data) messages.push(JSON.parse(data))
    }

    return NextResponse.json({ messages })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// Update a message (mark read, archive, add note)
export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { env } = getRequestContext()
    const kv = (env as unknown as Record<string, KVNamespace>).RATE_LIMIT
    if (!kv) return NextResponse.json({ error: 'KV not available' }, { status: 500 })

    const body = await request.json() as { id: string; read?: boolean; archived?: boolean; notes?: string }
    const existing = await kv.get(`inbox:${body.id}`)
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const msg = JSON.parse(existing)
    if (body.read !== undefined) msg.read = body.read
    if (body.archived !== undefined) msg.archived = body.archived
    if (body.notes !== undefined) msg.notes = body.notes

    await kv.put(`inbox:${msg.id}`, JSON.stringify(msg), { expirationTtl: 7776000 })
    return NextResponse.json(msg)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
