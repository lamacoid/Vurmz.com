export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

export async function GET() {
  try {
    const db = getD1()

    const result = await db.prepare(
      "SELECT config FROM site_config WHERE id = 'main'"
    ).first() as { config: string } | null

    if (!result) {
      return NextResponse.json({ products: [] })
    }

    const config = JSON.parse(result.config)
    const products = config.products || []

    // Return enabled products sorted by order
    const enabledProducts = products
      .filter((p: any) => p.enabled)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))

    return NextResponse.json({ products: enabledProducts })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ products: [] })
  }
}
