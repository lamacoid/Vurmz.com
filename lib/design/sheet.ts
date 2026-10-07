import catalogRaw from '@/lib/design/catalog.json'

/**
 * The flash sheet: the design library arranged the way a tattoo shop
 * hangs its flash. Same 503 drawings the product form offers, grouped
 * under plain names, in a fixed order that reads well on a wall.
 */
export interface DesignElement {
  id: string
  label: string
  category: string
  thumb: string
}

export const CATALOG = catalogRaw as DesignElement[]

/** Library category -> the name on the wall, in wall order. */
export const SHEETS: Array<{ key: string; name: string; line: string }> = [
  { key: 'Florals & Botanical', name: 'Botanicals', line: 'Roses, wildflowers, leaves, vines. The most asked for.' },
  { key: 'Animals', name: 'Animals', line: 'Dogs, birds, bears, fish, the whole yard.' },
  { key: 'Bones & Anatomy', name: 'Skulls and bones', line: 'Skulls, hands, hearts, the anatomy drawer.' },
  { key: 'Gothic', name: 'Gothic', line: 'Daggers, moons, candles, ornament with an edge.' },
  { key: 'Mountains & Outdoors', name: 'Outdoors', line: 'Peaks, pines, compasses, the Colorado shelf.' },
  { key: 'Symbols & Clipart', name: 'Symbols', line: 'Anchors, arrows, stars, marks that say one thing.' },
  { key: 'Patterns & Shapes', name: 'Geometric', line: 'Lines, knots, mandalas, repeats that fill a surface.' },
  { key: 'Emblems & Crests', name: 'Emblems and crests', line: 'Shields, wreaths, badges for a name in the middle.' },
  { key: 'Frames & Borders', name: 'Frames', line: 'Borders and cartouches, a place to put the words.' },
  { key: 'Home & Decor', name: 'Home', line: 'Kitchen, garden, the things on the wall.' },
  { key: 'Food & Drink', name: 'Food and drink', line: 'Hops, grapes, coffee, knives and forks.' },
  { key: 'Holiday & Seasonal', name: 'Holidays', line: 'Trees, hearts, pumpkins, the year in order.' },
]

export function sheetFor(category: string) {
  return SHEETS.find(s => s.key === category) ?? { key: category, name: category, line: '' }
}

export function designById(id: string): DesignElement | null {
  return CATALOG.find(e => e.id === id) ?? null
}

export const countBySheet: Record<string, number> = CATALOG.reduce((acc, e) => {
  acc[e.category] = (acc[e.category] ?? 0) + 1
  return acc
}, {} as Record<string, number>)
