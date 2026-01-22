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

// GET - List all pages
export async function GET() {
  try {
    const db = getD1()
    const result = await db.prepare(
      'SELECT * FROM pages ORDER BY nav_order, title'
    ).all() as { results: Page[] }

    return NextResponse.json(result.results || [])
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

// POST - Create a new page
export async function POST(request: NextRequest) {
  try {
    const db = getD1()
    const data = await request.json() as Partial<Page>

    const id = `page-${Date.now()}`
    const slug = data.slug || id
    const title = data.title || 'New Page'

    await db.prepare(
      `INSERT INTO pages (id, slug, title, content, enabled, show_in_nav, nav_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      slug,
      title,
      data.content || '',
      data.enabled ?? 1,
      data.show_in_nav ?? 0,
      data.nav_order ?? 0
    ).run()

    return NextResponse.json({ id, slug, title, success: true })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
  }
}
