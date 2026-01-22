export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

interface Page {
  id: string
  slug: string
  title: string
  content: string | null
  enabled: number
  show_in_nav: number
  nav_order: number
  created_at: string
  updated_at: string
}

// GET - Get a single page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = getD1()

    const page = await db.prepare(
      'SELECT * FROM pages WHERE id = ? OR slug = ?'
    ).bind(id, id).first() as Page | null

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 })
  }
}

// PUT - Update a page
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = getD1()
    const data = await request.json() as Partial<Page>

    await db.prepare(
      `UPDATE pages SET
        slug = COALESCE(?, slug),
        title = COALESCE(?, title),
        content = COALESCE(?, content),
        enabled = COALESCE(?, enabled),
        show_in_nav = COALESCE(?, show_in_nav),
        nav_order = COALESCE(?, nav_order),
        updated_at = datetime('now')
       WHERE id = ?`
    ).bind(
      data.slug,
      data.title,
      data.content,
      data.enabled,
      data.show_in_nav,
      data.nav_order,
      id
    ).run()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
  }
}

// DELETE - Delete a page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = getD1()

    await db.prepare('DELETE FROM pages WHERE id = ?').bind(id).run()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
  }
}
