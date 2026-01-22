export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

const pricingData = [
  {
    category: 'Industrial Labels & Tags',
    items: [
      { name: 'ABS Panel Labels', price: 'Quote per job', note: 'Breaker boxes, equipment panels' },
      { name: 'Asset Tags', price: 'Quote per job', note: 'Equipment identification' },
      { name: 'Custom Industrial Signage', price: 'Quote per job', note: 'Size and quantity dependent' },
    ],
  },
  {
    category: 'Awards & Trophies',
    items: [
      { name: 'Acrylic Awards', price: 'Quote based', note: 'Crystal-clear finish' },
      { name: 'Glass Trophies', price: 'Quote based', note: 'Premium recognition' },
      { name: 'Wood Plaques', price: 'Quote based', note: 'Classic look' },
      { name: 'Brass Name Plates', price: 'Quote based', note: 'Desk or door mount' },
    ],
  },
  {
    category: 'Branded Pens (Pack of 15)',
    items: [
      { name: 'Fully loaded stylus pen', price: '$7.50/pen = $112.50', note: '2 lines + logo + both sides' },
      { name: 'Simple (1 line only)', price: '$3/pen = $45', note: 'Text only, one side' },
    ],
  },
  {
    category: 'Coasters (Pack of 15)',
    items: [
      { name: 'Base (logo + 1 line)', price: '$4/coaster = $60', note: 'Slate or stainless' },
      { name: '+ QR Code', price: '+$2/coaster', note: 'Link to menu, reviews, etc.' },
      { name: '+ Extra text', price: '+$2/coaster', note: 'Additional lines' },
    ],
  },
  {
    category: 'Keychains (Pack of 15)',
    items: [
      { name: 'Acrylic base (1 side)', price: '$3/keychain = $45', note: 'Lightweight, colorful' },
      { name: 'Metal base (1 side)', price: '$4/keychain = $60', note: 'Premium feel' },
      { name: '+ Same on back', price: '+$2/keychain', note: 'Duplicate design' },
      { name: '+ Different on back', price: '+$3/keychain', note: 'Unique second side' },
    ],
  },
  {
    category: 'Metal Business Cards',
    items: [
      { name: 'Fully loaded (matte black)', price: '$6/card', note: 'QR + logo + back side' },
      { name: 'Fully loaded (stainless)', price: '$18/card', note: 'QR + logo + back side' },
      { name: 'Simple (text only)', price: '$3/card', note: 'One side, no extras' },
    ],
  },
  {
    category: 'Other Items',
    items: [
      { name: 'Cutting Boards (pack of 15)', price: '~$45/board = $675', note: 'Hardwood' },
      { name: 'Signs (min 5)', price: 'Quote based', note: 'Custom sizing' },
      { name: 'Tool/Equipment Marking', price: 'Quote based', note: 'Bring your items' },
    ],
  },
]

export async function POST() {
  try {
    const db = getD1()

    // Get current config
    const result = await db.prepare(
      "SELECT config FROM site_config WHERE id = 'main'"
    ).first() as { config: string } | null

    if (!result) {
      return NextResponse.json({ error: 'No config found' }, { status: 404 })
    }

    const config = JSON.parse(result.config)

    // Update pricing
    config.pricing = pricingData

    // Save back
    await db.prepare(
      "UPDATE site_config SET config = ?, updated_at = datetime('now') WHERE id = 'main'"
    ).bind(JSON.stringify(config)).run()

    return NextResponse.json({ success: true, categories: pricingData.length })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed pricing' }, { status: 500 })
  }
}
