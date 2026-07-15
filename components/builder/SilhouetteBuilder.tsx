'use client'
/**
 * The Builder, silhouette mode (task #42): a vector silhouette of the
 * product with the engraving zones drawn as LASER-RED outlines, exactly
 * where the laser will mark. Guided by design: the customer picks a
 * layout (name / two lines), types into each zone, and cannot get it
 * wrong. Text renders live in-zone at true relative scale.
 */
import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Path, Rect, Text as KText } from 'react-konva'
import type { SilhouetteBuilderConfig } from '@/lib/builder/types'

export default function SilhouetteBuilder({ config, materialKey, layoutKey, texts, fontFamily }: {
  config: SilhouetteBuilderConfig
  materialKey: string
  layoutKey: string
  /** One string per text zone in the active layout. */
  texts: string[]
  fontFamily: string
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
  const material = config.materials.find(m => m.key === materialKey) ?? config.materials[0]
  const markColor = material.markColor ?? (material.mark === 'light' ? '#EDE9DF' : '#232028')
  const layout = config.layouts.find(l => l.key === layoutKey) ?? config.layouts[0]
  const textZones = layout.zones.filter(z => z.kind === 'text')

  return (
    <div ref={containerRef}>
      <Stage width={stageW} height={stageH} listening={false}>
        <Layer>
          {/* The product, as a silhouette in the chosen material. */}
          <Path
            data={config.outlinePath}
            scaleX={ppi}
            scaleY={ppi}
            fill={material.surface}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth={0.015}
          />
          {/* The engraving zones: laser red, exactly where the laser marks. */}
          {layout.zones.map((z, i) => (
            <Rect
              key={i}
              x={z.xIn * ppi}
              y={z.yIn * ppi}
              width={z.wIn * ppi}
              height={z.hIn * ppi}
              stroke="#FF2A2A"
              strokeWidth={1.2}
              dash={[5, 3]}
              cornerRadius={2}
              shadowColor="#FF2A2A"
              shadowBlur={4}
              shadowOpacity={0.5}
            />
          ))}
          {/* The customer's text, fit to each zone. */}
          {textZones.map((z, i) => {
            const t = texts[i] ?? ''
            if (!t.trim()) return null
            const fit = Math.min(z.hIn * ppi * 0.86, (z.wIn * ppi) / Math.max(1, t.length * 0.58))
            return (
              <KText
                key={`t${i}`}
                x={z.xIn * ppi}
                y={z.yIn * ppi + (z.hIn * ppi - fit) / 2}
                width={z.wIn * ppi}
                text={t}
                fontSize={fit}
                fontFamily={fontFamily}
                fill={markColor}
                align="center"
              />
            )
          })}
        </Layer>
      </Stage>
      <div className="flex items-center justify-between mt-1.5">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-px bg-[var(--ink)]/50" style={{ width: ppi }} />
          <span className="text-[10px] text-[var(--ink-soft)]">1 inch</span>
        </div>
        <span className="text-[10px] text-[var(--ink-soft)]">
          {config.widthIn}&Prime; × {config.heightIn}&Prime; · red is where the laser marks
        </span>
      </div>
    </div>
  )
}
