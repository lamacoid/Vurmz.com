export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1, generateId, now } from '@/lib/d1'

interface MaterialInput {
  name: string
  description?: string
  costPerUnit: number
  unit?: string
  quantityInStock?: number
  lowStockThreshold?: number
}

// POST - Create new material
export async function POST(request: NextRequest) {
  try {
    const db = getD1()
    const data = await request.json() as MaterialInput
    const id = generateId()
    const timestamp = now()

    await db.prepare(`
      INSERT INTO materials (id, name, description, cost_per_unit, unit, quantity_in_stock, low_stock_threshold, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      data.name,
      data.description || null,
      data.costPerUnit,
      data.unit || 'each',
      data.quantityInStock || 0,
      data.lowStockThreshold || 10,
      timestamp,
      timestamp
    ).run()

    const material = await db.prepare('SELECT * FROM materials WHERE id = ?').bind(id).first()
    return NextResponse.json(material, { status: 201 })
  } catch (error) {
    console.error('Error creating material:', error)
    return NextResponse.json({ error: 'Failed to create material' }, { status: 500 })
  }
}

// GET - Get all materials
export async function GET() {
  try {
    const db = getD1()
    const result = await db.prepare('SELECT * FROM materials ORDER BY name ASC').all()

    const materials = (result.results || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      costPerUnit: row.cost_per_unit,
      unit: row.unit,
      quantityInStock: row.quantity_in_stock,
      lowStockThreshold: row.low_stock_threshold,
      createdAt: row.created_at
    }))

    return NextResponse.json(materials)
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 })
  }
}
