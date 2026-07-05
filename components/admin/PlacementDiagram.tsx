/**
 * Replays a Builder submission as a read-only SVG diagram on the order:
 * the same layout the customer built, true to proportion, so production
 * matches the preview. Self-contained: reads the material snapshot from
 * the submission itself, never the (possibly changed) product config.
 */
import { fontOptions } from '@/lib/fonts'
import type { BuilderSubmission } from '@/lib/builder/types'

const familyOf = new Map(fontOptions.map(f => [f.value, (f.style.fontFamily as string) ?? 'sans-serif']))

export default function PlacementDiagram({ submission, maxWidth = 360 }: { submission: BuilderSubmission; maxWidth?: number }) {
  const { widthIn, heightIn, elements } = submission
  const surface = submission.surface ?? '#d8d2c6'
  const markLight = submission.mark === 'light'
  const markColor = markLight ? '#EDE9DF' : '#232028'
  const r = submission.cornerRadiusIn ?? 0

  return (
    <div style={{ maxWidth }}>
      <svg
        viewBox={`0 0 ${widthIn} ${heightIn}`}
        width="100%"
        role="img"
        aria-label="Customer's layout"
        style={{ display: 'block', borderRadius: 4 }}
      >
        {submission.outlinePath ? (
          <path d={submission.outlinePath} fill={surface} stroke="rgba(0,0,0,0.3)" strokeWidth={0.02} />
        ) : submission.shape === 'circle' ? (
          <circle cx={widthIn / 2} cy={heightIn / 2} r={Math.min(widthIn, heightIn) / 2} fill={surface} stroke="rgba(0,0,0,0.3)" strokeWidth={0.02} />
        ) : (
          <rect x={0.01} y={0.01} width={widthIn - 0.02} height={heightIn - 0.02} rx={r} fill={surface} stroke="rgba(0,0,0,0.3)" strokeWidth={0.02} />
        )}
        {elements.map(el => {
          const cx = el.xIn + el.wIn / 2
          const cy = el.yIn + el.hIn / 2
          const transform = el.rotationDeg ? `rotate(${el.rotationDeg} ${el.xIn} ${el.yIn})` : undefined
          if (el.kind === 'text') {
            return (
              <text
                key={el.id}
                x={cx}
                y={el.yIn + el.hIn * 0.85}
                textAnchor="middle"
                fontSize={el.hIn}
                fontFamily={familyOf.get(el.fontValue ?? '') ?? 'sans-serif'}
                fill={markColor}
                transform={transform}
              >
                {el.text}
              </text>
            )
          }
          if (el.designThumb) {
            return (
              <image
                key={el.id}
                href={el.designThumb}
                x={el.xIn}
                y={el.yIn}
                width={el.wIn}
                height={el.hIn}
                preserveAspectRatio="xMidYMid meet"
                transform={transform}
                style={markLight ? { filter: 'invert(1)' } : undefined}
              />
            )
          }
          if (el.kind === 'upload' && el.uploadUrl) {
            // Customer's own file, served through the admin-gated r2 route.
            // Grayscale to match how the mark reads; the original file sits
            // in the order's attachment list.
            return (
              <image
                key={el.id}
                href={`/api/admin/r2/${el.uploadUrl}`}
                x={el.xIn}
                y={el.yIn}
                width={el.wIn}
                height={el.hIn}
                preserveAspectRatio="xMidYMid meet"
                transform={transform}
                style={{ filter: `grayscale(1)${markLight ? ' invert(1)' : ''}` }}
              />
            )
          }
          // Unknown or keyless upload: show the zone.
          return <rect key={el.id} x={el.xIn} y={el.yIn} width={el.wIn} height={el.hIn} fill="none" stroke="#FF2A2A" strokeWidth={0.02} strokeDasharray="0.06 0.04" transform={transform} />
        })}
      </svg>
      <p className="text-[10px] text-[var(--a-ink-faint)] mt-1">
        {submission.materialLabel ? `${submission.materialLabel} · ` : ''}{widthIn}&Prime; × {heightIn}&Prime; · positions in real inches
      </p>
    </div>
  )
}
