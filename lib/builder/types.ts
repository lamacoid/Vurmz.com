/**
 * The Builder's data contract (task #42). Everything is data-driven:
 * a product opts into the Builder by carrying `builder` in its metadata,
 * and the mode + materials + dimensions decide what the customer sees.
 * No per-product code, ever.
 */

/** A material/finish the customer can pick (tints the canvas, sets mark polarity). */
export interface BuilderMaterial {
  key: string
  label: string
  /** Canvas fill for the product surface. */
  surface: string
  /** 'light' = mark reads light on the surface (colored anodized: laser strips
   *  dye to bare metal). 'dark' = mark reads dark (stainless annealing). */
  mark: 'light' | 'dark'
  /** Optional sheen hint for gloss finishes. */
  gloss?: boolean
}

/** Canvas mode: a real-dimensioned shape with free placement. */
export interface CanvasBuilderConfig {
  mode: 'canvas'
  shape: 'rect' | 'rounded-rect' | 'circle'
  widthIn: number
  heightIn: number
  cornerRadiusIn?: number
  materials: BuilderMaterial[]
}

/** Silhouette mode: a vector outline with fixed engraving zones. */
export interface SilhouetteBuilderConfig {
  mode: 'silhouette'
  /** Path data of the product outline, in a viewBox of widthIn x heightIn units. */
  outlinePath: string
  widthIn: number
  heightIn: number
  /** Named zone layouts ("name", "two lines", "name + logo"): each is a set of boxes. */
  layouts: Array<{
    key: string
    label: string
    zones: Array<{ xIn: number; yIn: number; wIn: number; hIn: number; kind: 'text' | 'image' }>
  }>
  materials: BuilderMaterial[]
}

export type BuilderConfig = CanvasBuilderConfig | SilhouetteBuilderConfig

/** One placed element in a customer's canvas design. All positions in inches. */
export interface PlacedElement {
  id: string
  kind: 'text' | 'design' | 'upload'
  xIn: number
  yIn: number
  wIn: number
  hIn: number
  rotationDeg: number
  /** kind 'text' */
  text?: string
  fontValue?: string
  /** kind 'design': the library element. */
  designId?: string
  designLabel?: string
  designThumb?: string
  /** kind 'upload': R2 media reference from the guest-upload flow. */
  uploadUrl?: string
}

/** What rides the order: the whole layout, replayable on Zach's ticket. */
export interface BuilderSubmission {
  mode: 'canvas' | 'silhouette'
  materialKey: string
  layoutKey?: string
  widthIn: number
  heightIn: number
  elements: PlacedElement[]
}

/** Read a product's builder config out of its metadata, if it has one. */
export function builderConfigFrom(metadata: Record<string, unknown> | null | undefined): BuilderConfig | null {
  if (!metadata || typeof metadata !== 'object') return null
  const b = (metadata as { builder?: unknown }).builder
  if (!b || typeof b !== 'object') return null
  const cfg = b as BuilderConfig
  if (cfg.mode !== 'canvas' && cfg.mode !== 'silhouette') return null
  if (!(cfg.widthIn > 0) || !(cfg.heightIn > 0)) return null
  return cfg
}

/** The standard card: every metal card listing shares this. */
export const CARD_CANVAS: Omit<CanvasBuilderConfig, 'materials'> = {
  mode: 'canvas',
  shape: 'rounded-rect',
  widthIn: 3.375,
  heightIn: 2.125,
  cornerRadiusIn: 0.125,
}
