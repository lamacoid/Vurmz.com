'use client'
/**
 * The Builder, canvas mode (task #42): a real-dimensioned product surface
 * the customer designs on directly. Konva does the drag/resize/rotate;
 * everything is stored in REAL INCHES so the submission replays true to
 * scale on Zach's ticket. Deliberately not photorealistic: material tint
 * + correct mark polarity give "a decent idea of how it will look."
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Rect, Circle, Text as KText, Image as KImage, Transformer } from 'react-konva'
import type Konva from 'konva'
import { fontOptions } from '@/lib/fonts'
import KonvaNS from 'konva'
import type { CanvasBuilderConfig, PlacedElement, BuilderSubmission } from '@/lib/builder/types'

const KonvaFilters = KonvaNS.Filters

function useImage(url: string | undefined): HTMLImageElement | null {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  useEffect(() => {
    if (!url) { setImg(null); return }
    const el = new window.Image()
    el.crossOrigin = 'anonymous'
    el.src = url
    el.onload = () => setImg(el)
    return () => { el.onload = null }
  }, [url])
  return img
}

function DesignNode({ el, src, ppi, isSelected, markLight, onSelect, onChange }: {
  el: PlacedElement; src?: string; ppi: number; isSelected: boolean; markLight: boolean
  onSelect: () => void; onChange: (patch: Partial<PlacedElement>) => void
}) {
  const isUpload = el.kind === 'upload'
  const img = useImage(src)
  const ref = useRef<Konva.Image>(null)
  useEffect(() => {
    // The library art is black; on dark surfaces the laser mark reads light.
    // Customer uploads also drop to grayscale: a laser marks tone, not color,
    // so the preview should never promise a color print.
    if (ref.current) {
      // Cache at the display's pixel density, or the filtered image goes
      // soft on Retina (the cache defaults to 1x).
      ref.current.cache({ pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1 })
      const filters = isUpload ? [KonvaFilters.Grayscale] : []
      if (markLight) filters.push(KonvaFilters.Invert)
      ref.current.filters(filters)
      ref.current.getLayer()?.batchDraw()
    }
  }, [img, markLight, isUpload])
  if (!img) {
    // An upload whose preview is gone (or still decoding) stays visible and
    // removable instead of silently vanishing from the layout.
    if (!isUpload) return null
    return (
      <Rect
        name={el.id}
        x={el.xIn * ppi}
        y={el.yIn * ppi}
        width={el.wIn * ppi}
        height={el.hIn * ppi}
        rotation={el.rotationDeg}
        stroke="#FF2A2A"
        strokeWidth={1}
        dash={[5, 3]}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={e => onChange({ xIn: e.target.x() / ppi, yIn: e.target.y() / ppi })}
      />
    )
  }
  return (
    <KImage
      ref={ref}
      image={img}
      x={el.xIn * ppi}
      y={el.yIn * ppi}
      width={el.wIn * ppi}
      height={el.hIn * ppi}
      rotation={el.rotationDeg}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={e => onChange({ xIn: e.target.x() / ppi, yIn: e.target.y() / ppi })}
      onTransformEnd={e => {
        const node = e.target
        onChange({
          xIn: node.x() / ppi,
          yIn: node.y() / ppi,
          wIn: Math.max(0.1, (node.width() * node.scaleX()) / ppi),
          hIn: Math.max(0.1, (node.height() * node.scaleY()) / ppi),
          rotationDeg: node.rotation(),
        })
        node.scaleX(1); node.scaleY(1)
      }}
      name={el.id}
    />
  )
}

export default function BuilderCanvas({ config, value, onChange, selectedId, onSelect, previews }: {
  config: CanvasBuilderConfig
  value: BuilderSubmission
  onChange: (v: BuilderSubmission) => void
  selectedId: string | null
  onSelect: (id: string | null) => void
  /** Object URLs for upload elements, keyed by element id. */
  previews?: Record<string, string>
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [stageW, setStageW] = useState(520)
  useEffect(() => {
    const measure = () => setStageW(Math.min(560, containerRef.current?.clientWidth ?? 520))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const ppi = stageW / config.widthIn
  const stageH = config.heightIn * ppi
  const material = config.materials.find(m => m.key === value.materialKey) ?? config.materials[0]
  const markLight = material.mark === 'light'
  const markColor = markLight ? '#EDE9DF' : '#232028'

  const trRef = useRef<Konva.Transformer>(null)
  const stageRef = useRef<Konva.Stage>(null)
  useEffect(() => {
    const tr = trRef.current
    const stage = stageRef.current
    if (!tr || !stage) return
    const node = selectedId ? stage.findOne(`.${selectedId}`) : null
    tr.nodes(node ? [node] : [])
    tr.getLayer()?.batchDraw()
  }, [selectedId, value.elements])

  function patchElement(id: string, patch: Partial<PlacedElement>) {
    onChange({ ...value, elements: value.elements.map(e => (e.id === id ? { ...e, ...patch } : e)) })
  }

  const fontFamilyFor = useMemo(() => {
    // Konva wants a BARE family name, not a CSS stack. Passing
    // "'Burger Doodle', cursive" makes Konva fail to parse it and fall
    // back to serif, so strip to the first family with quotes removed.
    const clean = (stack: string) => stack.split(',')[0].replace(/["']/g, '').trim()
    const map = new Map(fontOptions.map(f => [f.value, clean((f.style.fontFamily as string) ?? 'sans-serif')]))
    return (fv?: string) => map.get(fv ?? '') ?? 'sans-serif'
  }, [])

  // Detailed fonts lazy-load, so Konva can draw a text node before its
  // face has arrived (rendering a plain fallback that reads as "blurry"
  // or wrong). Wait for the fonts actually in use to finish loading, then
  // redraw so the real, detailed letterforms render sharp.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || typeof document === 'undefined' || !document.fonts) return
    let alive = true
    const families = Array.from(new Set(
      value.elements.filter(e => e.kind === 'text').map(e => fontFamilyFor(e.fontValue)),
    ))
    // Family names with spaces MUST be quoted or the load silently fails.
    Promise.all(families.map(fam => document.fonts.load(`48px "${fam}"`).catch(() => null)))
      .then(() => document.fonts.ready)
      .then(() => { if (alive) stage.getLayers().forEach(l => l.draw()) })
    return () => { alive = false }
  }, [value.elements, fontFamilyFor])

  const shape = config.shape
  const r = (config.cornerRadiusIn ?? 0) * ppi

  return (
    <div ref={containerRef}>
      <Stage
        ref={stageRef}
        width={stageW}
        height={stageH}
        onClick={e => { if (e.target === e.target.getStage() || e.target.name() === 'surface') onSelect(null) }}
        onTap={e => { if (e.target === e.target.getStage() || e.target.name() === 'surface') onSelect(null) }}
      >
        <Layer>
          {/* The product surface, tinted to the chosen material. */}
          {shape === 'circle' ? (
            <Circle name="surface" x={stageW / 2} y={stageH / 2} radius={stageW / 2 - 1} fill={material.surface} stroke="rgba(0,0,0,0.25)" strokeWidth={1} />
          ) : (
            <Rect name="surface" x={0.5} y={0.5} width={stageW - 1} height={stageH - 1} cornerRadius={shape === 'rounded-rect' ? r : 0} fill={material.surface} stroke="rgba(0,0,0,0.25)" strokeWidth={1} />
          )}
          {material.gloss && (
            <Rect x={0.5} y={0.5} width={stageW - 1} height={Math.max(8, stageH * 0.18)} cornerRadius={shape === 'rounded-rect' ? r : 0} fill="rgba(255,255,255,0.07)" listening={false} />
          )}

          {value.elements.map(el =>
            el.kind === 'text' ? (
              <KText
                key={el.id}
                name={el.id}
                text={el.text || 'Your text'}
                x={el.xIn * ppi}
                y={el.yIn * ppi}
                width={el.wIn * ppi}
                fontSize={el.hIn * ppi}
                fontFamily={fontFamilyFor(el.fontValue)}
                fill={markColor}
                align="center"
                rotation={el.rotationDeg}
                draggable
                onClick={() => onSelect(el.id)}
                onTap={() => onSelect(el.id)}
                onDragEnd={e => patchElement(el.id, { xIn: e.target.x() / ppi, yIn: e.target.y() / ppi })}
                onTransformEnd={e => {
                  const node = e.target as Konva.Text
                  patchElement(el.id, {
                    xIn: node.x() / ppi,
                    yIn: node.y() / ppi,
                    wIn: Math.max(0.2, (node.width() * node.scaleX()) / ppi),
                    hIn: Math.max(0.08, (node.fontSize() * node.scaleY()) / ppi),
                    rotationDeg: node.rotation(),
                  })
                  node.scaleX(1); node.scaleY(1)
                }}
              />
            ) : (
              <DesignNode
                key={el.id}
                el={el}
                src={el.kind === 'upload' ? previews?.[el.id] : el.designThumb}
                ppi={ppi}
                markLight={markLight}
                isSelected={selectedId === el.id}
                onSelect={() => onSelect(el.id)}
                onChange={patch => patchElement(el.id, patch)}
              />
            )
          )}

          <Transformer
            ref={trRef}
            rotateEnabled
            flipEnabled={false}
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
            boundBoxFunc={(oldBox, newBox) => (newBox.width < 12 || newBox.height < 8 ? oldBox : newBox)}
            anchorSize={9}
            borderStroke="#FF2A2A"
            anchorStroke="#FF2A2A"
            anchorFill="#fff"
          />
        </Layer>
      </Stage>

      {/* The scale reference: an honest inch. */}
      <div className="flex items-center justify-between mt-1.5">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-px bg-[var(--ink)]/50" style={{ width: ppi }} />
          <span className="text-[10px] text-[var(--ink-soft)]">1 inch</span>
        </div>
        <span className="text-[10px] text-[var(--ink-soft)]">
          {config.widthIn}&Prime; × {config.heightIn}&Prime; actual proportions
        </span>
      </div>
    </div>
  )
}
