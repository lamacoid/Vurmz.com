export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

// GET - List all portfolio items
export async function GET() {
  try {
    const db = getD1()

    const result = await db.prepare(`
      SELECT * FROM portfolio_items
      ORDER BY featured DESC, created_at DESC
    `).all()

    return NextResponse.json({ items: result.results || [] })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json({ items: [] })
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

// POST - Create new portfolio item
export async function POST(request: NextRequest) {
  try {
    const db = getD1()
    const body = await request.json() as PortfolioBody

    const id = crypto.randomUUID()
    const { title, description, image_url, category, industry, location, featured } = body

    await db.prepare(`
      INSERT INTO portfolio_items (id, title, description, image_url, category, industry, location, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      title,
      description || '',
      image_url,
      category,
      industry || null,
      location || null,
      featured ? 1 : 0
    ).run()

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error creating portfolio item:', error)
    return NextResponse.json({ error: 'Failed to create portfolio item' }, { status: 500 })
  }
}
