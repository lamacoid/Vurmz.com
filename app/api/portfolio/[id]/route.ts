export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get single portfolio item
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const db = getD1()

    const item = await db.prepare(
      'SELECT * FROM portfolio_items WHERE id = ?'
    ).bind(id).first()

    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ item })
  } catch (error) {
    console.error('Error fetching portfolio item:', error)
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 })
  }
}

interface PortfolioBody {
  title: string
  description?: string
  image_url: string
  category: string
  industry?: string
  location?: string
  featured?: boolean | number
}

// PUT - Update portfolio item
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const db = getD1()
    const body = await request.json() as PortfolioBody

    const { title, description, image_url, category, industry, location, featured } = body

    await db.prepare(`
      UPDATE portfolio_items
      SET title = ?, description = ?, image_url = ?, category = ?, industry = ?, location = ?, featured = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      title,
      description || '',
      image_url,
      category,
      industry || null,
      location || null,
      featured ? 1 : 0,
      id
    ).run()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating portfolio item:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

// DELETE - Delete portfolio item
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const db = getD1()

    await db.prepare('DELETE FROM portfolio_items WHERE id = ?').bind(id).run()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting portfolio item:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}
