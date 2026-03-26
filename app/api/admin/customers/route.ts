export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import { withAuth } from '@/lib/admin-auth'

function getDb() {
  const { env } = getRequestContext()
  return (env as any).TRACK_DB as D1Database
}

export async function GET(req: NextRequest) {
  return withAuth(req, async () => {
    const db = getDb()
    const q = req.nextUrl.searchParams.get('q')

    let customers
    if (q) {
      const like = `%${q}%`
      customers = await db.prepare(
        'SELECT * FROM customers WHERE name LIKE ? OR email LIKE ? OR company LIKE ? ORDER BY name ASC'
      ).bind(like, like, like).all()
    } else {
      customers = await db.prepare('SELECT * FROM customers ORDER BY created_at DESC').all()
    }

    return NextResponse.json({ customers: customers.results })
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    const db = getDb()
    const body = await req.json() as any

    const id = crypto.randomUUID().slice(0, 8)
    const now = new Date().toISOString()

    await db.prepare(
      'INSERT INTO customers (id, name, email, phone, company, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      id,
      body.name || '',
      body.email || '',
      body.phone || '',
      body.company || '',
      body.notes || '',
      now
    ).run()

    return NextResponse.json({ ok: true, id })
  })
}

export async function PUT(req: NextRequest) {
  return withAuth(req, async () => {
    const db = getDb()
    const body = await req.json() as any

    if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await db.prepare(
      'UPDATE customers SET name = ?, email = ?, phone = ?, company = ?, notes = ? WHERE id = ?'
    ).bind(
      body.name || '',
      body.email || '',
      body.phone || '',
      body.company || '',
      body.notes || '',
      body.id
    ).run()

    return NextResponse.json({ ok: true })
  })
}

export async function DELETE(req: NextRequest) {
  return withAuth(req, async () => {
    const db = getDb()
    const { id } = await req.json() as { id: string }
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    // Unlink jobs
    await db.prepare('UPDATE jobs SET customer_id = NULL WHERE customer_id = ?').bind(id).run()
    await db.prepare('DELETE FROM customers WHERE id = ?').bind(id).run()

    return NextResponse.json({ ok: true })
  })
}
