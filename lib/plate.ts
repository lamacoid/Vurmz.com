/**
 * The plate: what a product's surface looks like on screen, and what a mark
 * looks like on it. Honest to the material (memory: material truths).
 * Anodized marks bare-alu silver, stainless anneals dark, slate frosts
 * pale, wood burns dark, powder coat lifts to bright steel.
 */
export interface Plate {
  bg: string
  ink: string
  edge: string
  /** A word for the mark, shown under the preview. */
  mark: string
  grain?: 'brushed' | 'wood' | 'stone' | 'none'
}

export function plateFor(name: string, finishHex?: string | null, description = ''): Plate {
  const t = `${name} ${description}`.toLowerCase()
  if (/slate/.test(t)) return { bg: 'linear-gradient(135deg,#4A4F54 0%,#33383C 100%)', ink: '#D7DBDD', edge: 'rgba(255,255,255,0.10)', mark: 'A pale frost in the stone.', grain: 'stone' }
  if (/gold/.test(t)) return { bg: 'linear-gradient(135deg,#D9B86A 0%,#B8943F 55%,#CDAA55 100%)', ink: '#3B2E14', edge: 'rgba(255,255,255,0.35)', mark: 'A dark mark in the gold.', grain: 'brushed' }
  if (/brushed|stainless|steel/.test(t)) return { bg: 'linear-gradient(135deg,#C3C7CB 0%,#979CA1 100%)', ink: '#22272A', edge: 'rgba(255,255,255,0.35)', mark: 'A dark mark annealed into the steel.', grain: 'brushed' }
  if (/anodized|aluminum|airtag|pet tag|keychain|card/.test(t)) {
    const bg = finishHex ?? '#2F3438'
    return { bg: `linear-gradient(135deg, ${bg} 0%, ${bg} 100%)`, ink: '#C9CACC', edge: 'rgba(255,255,255,0.18)', mark: 'Bare silver metal through the anodize.', grain: 'brushed' }
  }
  if (/powder|tumbler|bottle|flask/.test(t)) {
    const bg = finishHex ?? '#2C4C5B'
    return { bg: `linear-gradient(135deg, ${bg} 0%, ${bg} 100%)`, ink: '#E9EBEC', edge: 'rgba(255,255,255,0.14)', mark: 'Coating removed to bright stainless.', grain: 'none' }
  }
  if (/leather/.test(t)) return { bg: 'linear-gradient(135deg,#6B4A33 0%,#4E3423 100%)', ink: '#1C110A', edge: 'rgba(0,0,0,0.35)', mark: 'A dark, slightly recessed mark.', grain: 'none' }
  if (/bamboo/.test(t)) return { bg: 'linear-gradient(135deg,#E2C98F 0%,#CDB070 100%)', ink: '#3E2A10', edge: 'rgba(60,30,10,0.3)', mark: 'A clean burn in the bamboo.', grain: 'wood' }
  if (/pine|wood|maple|board|sign|panel|mailbox|marker|plaque/.test(t)) return { bg: 'linear-gradient(135deg,#D9B27C 0%,#C49A5E 55%,#B98E55 100%)', ink: '#3E2410', edge: 'rgba(60,30,10,0.35)', mark: 'A clean burn in the wood, darker with more power.', grain: 'wood' }
  if (/acrylic|glass|mirror/.test(t)) return { bg: 'linear-gradient(135deg,#DCE7EA 0%,#B9CACF 100%)', ink: '#F7FAFB', edge: 'rgba(255,255,255,0.5)', mark: 'A frosted mark in the surface.', grain: 'none' }
  return { bg: 'linear-gradient(135deg,#C3C7CB 0%,#979CA1 100%)', ink: '#22272A', edge: 'rgba(255,255,255,0.35)', mark: 'A dark, permanent mark.', grain: 'brushed' }
}

export const GRAIN: Record<NonNullable<Plate['grain']>, string> = {
  brushed: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0 1px, transparent 1px 3px)',
  wood: 'repeating-linear-gradient(0deg, rgba(90,50,20,0.18) 0 2px, transparent 2px 9px)',
  stone: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.08) 0 1px, transparent 2px), radial-gradient(circle at 70% 65%, rgba(0,0,0,0.12) 0 1px, transparent 2px)',
  none: 'none',
}
