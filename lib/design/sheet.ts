import catalogRaw from '@/lib/design/catalog.json'
import labelsRaw from '@/lib/design/labels.json'

/**
 * The flash sheet: the design library arranged the way a tattoo shop
 * hangs its flash. Every one of the 503 drawings was looked at and named
 * for what it depicts (2026-10-06, lib/design/labels.json), then grouped
 * into sheets and sub-sheets a customer can actually browse. Blank or
 * unreadable thumbnails are hidden from the wall.
 */
export interface DesignElement {
  id: string
  /** What it is: "Columbine, bold" rather than "Floral 41". */
  label: string
  /** The sheet on the wall. */
  category: string
  /** The sub-sheet, e.g. Columbines inside Botanicals. Optional for the dormant builder's bare elements. */
  sub?: string
  thumb: string
  /** The thumbnail is already light art on a dark ground; do not invert it. */
  dark?: boolean
}

interface RawElement { id: string; label: string; category: string; thumb: string }
interface Label { name: string; category: string; sub: string; dark?: boolean }

const LABELS = labelsRaw as Record<string, Label>

/** Every design, named. Hidden ones (blank thumbnails) are left out. */
export const CATALOG: DesignElement[] = (catalogRaw as RawElement[])
  .map(e => {
    const l = LABELS[e.id]
    return l
      ? { id: e.id, label: l.name, category: l.category, sub: l.sub, thumb: e.thumb, ...(l.dark ? { dark: true } : {}) }
      : { id: e.id, label: e.label, category: 'Icons', sub: 'Objects', thumb: e.thumb }
  })
  .filter(e => e.category !== 'Hidden')

/** The sheets, in wall order, with the one line that sells each. */
export const SHEETS: Array<{ key: string; name: string; line: string }> = [
  { key: 'Botanicals', name: 'Botanicals', line: 'Columbines, wildflowers, herbs, leaves, bouquets. The most asked for.' },
  { key: 'Outdoors', name: 'Outdoors', line: 'Peaks, pines, elk, campsites. The Colorado shelf.' },
  { key: 'Animals', name: 'Animals', line: 'Eagle, wolf, bull, shark, cobra, frog, a mouse with stars.' },
  { key: 'Skulls and anatomy', name: 'Skulls and anatomy', line: 'Skulls, skeletons, teeth, the anatomy drawer.' },
  { key: 'Gothic', name: 'Gothic', line: 'All-seeing eyes, candles, thorns, and the old woodcuts.' },
  { key: 'Celestial', name: 'Celestial', line: 'Stars, sparkles, moons, suns, planets on a stem.' },
  { key: 'Emblems', name: 'Emblems', line: 'Shields, crests, castles, a Spartan helmet. A place for a name.' },
  { key: 'Frames', name: 'Frames', line: 'Wreaths, borders, dividers, and cake toppers with room for the words.' },
  { key: 'Geometric', name: 'Geometric', line: 'Patterns, mudcloth marks, shapes, blanks to cut.' },
  { key: 'Icons', name: 'Icons', line: 'Hands, arrows, tools, science, flags, the one-mark symbols.' },
  { key: 'Holidays', name: 'Holidays', line: 'Christmas, Halloween, Easter eggs, hearts, ornaments.' },
  { key: 'Food and drink', name: 'Food and drink', line: 'Beer, cocktails, fruit, the grill.' },
  { key: 'People', name: 'People', line: 'Faces and figures, traditional and plain.' },
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

/** Sub-sheets per sheet, largest first, with counts. */
export const SUBS: Record<string, Array<{ name: string; count: number }>> = (() => {
  const out: Record<string, Record<string, number>> = {}
  for (const e of CATALOG) {
    out[e.category] ??= {}
    const sub = e.sub ?? 'Other'
    out[e.category][sub] = (out[e.category][sub] ?? 0) + 1
  }
  const result: Record<string, Array<{ name: string; count: number }>> = {}
  for (const [cat, subs] of Object.entries(out)) {
    result[cat] = Object.entries(subs).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }
  return result
})()
