'use client'
/**
 * The designed card on Zach's ticket: the laser file itself (outlines, so
 * it renders the same everywhere) shown in the true mark colour on the
 * card's colour, the fields, the writer's notes, and the file link.
 */
import { useEffect, useState } from 'react'
import { CARD_MM, materialByKey, previewSvg, slotLabel, templateByKey, type CardDesign } from '@/lib/designer/card'

export interface DesignOnTicket extends CardDesign {
  laserKey?: string
  notes?: string[]
}

export default function CardDesignTicket({ design }: { design: DesignOnTicket }) {
  const [laser, setLaser] = useState<string | null>(null)
  const template = templateByKey(design.templateKey)
  const material = materialByKey(design.materialKey)

  useEffect(() => {
    if (!design.laserKey) return
    let cancelled = false
    fetch(`/api/admin/r2/${design.laserKey}`)
      .then(r => (r.ok ? r.text() : null))
      .then(text => { if (!cancelled && text) setLaser(text) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [design.laserKey])

  // The laser file recoloured for the screen: marks in the mark colour,
  // the red reference outline hidden, on the card surface.
  const shown = laser
    ? laser
        .replace(/<\?xml[^>]*>/, '')
        .replace(/width="[\d.]+mm" height="[\d.]+mm"/, 'width="100%"')
        .replace('<g id="reference"', '<g id="reference" display="none"')
        .replace(/fill="#000"/g, `fill="${material?.markColor ?? '#C9CACC'}"`)
        .replace(/stroke="#000"/g, `stroke="${material?.markColor ?? '#C9CACC'}"`)
    : previewSvg(design, { id: 'ticket' })

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,340px)_1fr]">
      <div>
        <div
          className="overflow-hidden"
          style={{ background: laser ? material?.surface ?? '#1c1c1e' : 'transparent', borderRadius: `${(CARD_MM.r / CARD_MM.w) * 100}% / ${(CARD_MM.r / CARD_MM.h) * 100}%` }}
          dangerouslySetInnerHTML={{ __html: shown }}
        />
        <p className="text-[11px] text-[var(--a-ink-faint)] mt-1.5">
          {laser ? 'The laser file, as written.' : design.laserKey ? 'Loading the laser file' : 'No laser file was written. Lay out by hand from the fields.'}
        </p>
      </div>
      <div className="min-w-0 text-sm">
        <p className="text-[var(--a-ink)] font-medium">{template?.label ?? design.templateKey} on {material?.label ?? design.materialKey}</p>
        <ul className="mt-2 space-y-0.5 text-[var(--a-ink-soft)]">
          {template?.slots.filter(s => s.kind === 'text' && design.values[s.name]?.trim()).map(s => (
            <li key={s.name}><span className="text-[var(--a-ink-faint)]">{slotLabel(template, s)}:</span> <span className="text-[var(--a-ink)]">{design.values[s.name]}</span>{s.name === 'name' ? <span className="text-[var(--a-ink-faint)]"> in {design.nameFont}</span> : null}</li>
          ))}
          {design.logo && <li><span className="text-[var(--a-ink-faint)]">Logo:</span> <a href={`/api/admin/r2/${design.logo.key}`} target="_blank" rel="noopener noreferrer" className="text-[var(--a-accent)] hover:underline">{design.logo.filename}</a></li>}
        </ul>
        {design.laserKey && (
          <a href={`/api/admin/r2/${design.laserKey}`} className="inline-flex items-center mt-3 px-3 h-8 rounded-md border border-[var(--a-accent)] text-[var(--a-accent)] text-xs hover:bg-[var(--a-accent)]/10">
            Download the laser file (SVG, mm)
          </a>
        )}
        {design.notes && design.notes.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs text-amber-300">
            {design.notes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        )}
        <p className="mt-3 text-xs text-[var(--a-ink-faint)]">Layers: engrave (fill), line (stroke), reference (the card outline, red, no output). Send the proof before it runs.</p>
      </div>
    </div>
  )
}
