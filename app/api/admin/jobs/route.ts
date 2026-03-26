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
    const status = req.nextUrl.searchParams.get('status')

    let jobs
    if (status) {
      jobs = await db.prepare('SELECT * FROM jobs WHERE status = ? ORDER BY updated_at DESC').bind(status).all()
    } else {
      jobs = await db.prepare('SELECT * FROM jobs ORDER BY updated_at DESC').all()
    }

    return NextResponse.json({ jobs: jobs.results })
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async () => {
    const db = getDb()
    const body = await req.json() as any

    const id = crypto.randomUUID().slice(0, 8)
    const now = new Date().toISOString()

    await db.prepare(
      `INSERT INTO jobs (id, customer_id, title, type, description, price, items, notes, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'quoted', ?, ?)`
    ).bind(
      id,
      body.customerId || null,
      body.title || 'Untitled',
      body.type || 'custom',
      body.description || '',
      body.price || 0,
      body.items || '',
      body.notes || '',
      now, now
    ).run()

    // Add history entry
    await db.prepare(
      'INSERT INTO job_history (job_id, status, changed_at) VALUES (?, ?, ?)'
    ).bind(id, 'quoted', now).run()

    // Update customer stats
    if (body.customerId) await refreshCustomerStats(db, body.customerId)

    return NextResponse.json({ ok: true, id })
  })
}

export async function PUT(req: NextRequest) {
  return withAuth(req, async () => {
    const db = getDb()
    const body = await req.json() as any

    if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const now = new Date().toISOString()

    // Get current job for status change detection
    const current = await db.prepare('SELECT * FROM jobs WHERE id = ?').bind(body.id).first()
    if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const newStatus = body.status || current.status
    const deliveredAt = newStatus === 'delivered' ? now : current.delivered_at

    await db.prepare(
      `UPDATE jobs SET customer_id = ?, title = ?, type = ?, description = ?, price = ?, items = ?, notes = ?, status = ?, updated_at = ?, delivered_at = ?
       WHERE id = ?`
    ).bind(
      body.customerId !== undefined ? body.customerId : current.customer_id,
      body.title || current.title,
      body.type || current.type,
      body.description !== undefined ? body.description : current.description,
      body.price !== undefined ? body.price : current.price,
      body.items !== undefined ? body.items : current.items,
      body.notes !== undefined ? body.notes : current.notes,
      newStatus,
      now,
      deliveredAt,
      body.id
    ).run()

    // Add history entry if status changed
    if (newStatus !== current.status) {
      await db.prepare(
        'INSERT INTO job_history (job_id, status, changed_at) VALUES (?, ?, ?)'
      ).bind(body.id, newStatus, now).run()
    }

    // Refresh customer stats
    const custId = body.customerId || current.customer_id
    if (custId) await refreshCustomerStats(db, custId)

    return NextResponse.json({ ok: true })
  })
}

export async function DELETE(req: NextRequest) {
  return withAuth(req, async () => {
    const db = getDb()
    const { id } = await req.json() as { id: string }
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const job = await db.prepare('SELECT customer_id FROM jobs WHERE id = ?').bind(id).first() as any
    await db.prepare('DELETE FROM job_history WHERE job_id = ?').bind(id).run()
    await db.prepare('DELETE FROM jobs WHERE id = ?').bind(id).run()

    if (job?.customer_id) await refreshCustomerStats(db, job.customer_id)

    return NextResponse.json({ ok: true })
  })
}

async function refreshCustomerStats(db: D1Database, customerId: string) {
  const stats = await db.prepare(
    `SELECT COUNT(*) as job_count, COALESCE(SUM(CASE WHEN status = 'delivered' THEN price ELSE 0 END), 0) as total_revenue
     FROM jobs WHERE customer_id = ?`
  ).bind(customerId).first() as any

  await db.prepare(
    'UPDATE customers SET job_count = ?, total_revenue = ? WHERE id = ?'
  ).bind(stats.job_count || 0, stats.total_revenue || 0, customerId).run()
}
