'use client'
/**
 * A designed card, small: cart drawer, checkout summary, the customer's
 * order page. Same record, same colours, no logo image (the file key is
 * private), so the emblem slot shows empty here.
 */
import { useMemo } from 'react'
import { materialByKey, previewSvg, templateByKey, type CardDesign } from '@/lib/designer/card'

export function designLabel(design: CardDesign): string {
  const t = templateByKey(design.templateKey)?.label ?? design.templateKey
  const m = materialByKey(design.materialKey)?.label ?? design.materialKey
  return `${t} on ${m.toLowerCase()}`
}

export default function CardThumb({ design, className = '', id = 'thumb' }: { design: CardDesign; className?: string; id?: string }) {
  const svg = useMemo(() => previewSvg(design, { id }), [design, id])
  return <div className={`[&_svg]:block [&_svg]:rounded-[2px] ${className}`} dangerouslySetInnerHTML={{ __html: svg }} />
}

/** Reads a design off untyped item metadata, or null. */
export function designFrom(metadata: Record<string, unknown> | undefined | null): CardDesign | null {
  const d = metadata && (metadata as { design?: CardDesign }).design
  return d && d.kind === 'card' && templateByKey(d.templateKey) ? d : null
}
