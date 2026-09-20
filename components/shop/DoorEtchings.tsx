/**
 * The doors of the shop, drawn as etchings. One ink, cream on the teal
 * glass, in the manner of a woodcut: a firm outline, hatching for shade,
 * no fill. Drawn here and owned here. Each sits on a 240 by 180 plate,
 * sized by the parent, colored by currentColor.
 */
import type { CSSProperties, ReactNode } from 'react'

export type DoorKind = 'shelf' | 'knives' | 'table' | 'drink' | 'carry' | 'walls' | 'business' | 'more'

const LINE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const FINE = { ...LINE, strokeWidth: 1 }
const HATCH = { ...LINE, strokeWidth: 0.8, opacity: 0.55 }

/** Parallel hatch lines across a box, clipped by the caller. */
function hatch(x: number, y: number, w: number, h: number, gap = 4, angle: 'diag' | 'vert' | 'horiz' = 'diag'): ReactNode {
  const d: string[] = []
  if (angle === 'diag') {
    for (let i = -h; i < w; i += gap) d.push(`M${x + i} ${y + h} L${x + i + h} ${y}`)
  } else if (angle === 'vert') {
    for (let i = 0; i <= w; i += gap) d.push(`M${x + i} ${y} L${x + i} ${y + h}`)
  } else {
    for (let i = 0; i <= h; i += gap) d.push(`M${x} ${y + i} L${x + w} ${y + i}`)
  }
  return <path d={d.join(' ')} {...HATCH} />
}

export function DoorEtching({ kind, className = '', style }: { kind: DoorKind; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 240 180" className={className} style={style} aria-hidden focusable="false">
      {ETCHINGS[kind]}
    </svg>
  )
}

const ETCHINGS: Record<DoorKind, ReactNode> = {
  /* A dagger, medieval: leaf blade with a fuller, curled crossguard, wrapped grip, wheel pommel. */
  knives: (
    <g>
      <defs>
        <clipPath id="etch-blade"><path d="M18 90 C50 72 100 66 148 74 L148 106 C100 114 50 108 18 90 Z" /></clipPath>
      </defs>
      <path d="M18 90 C50 72 100 66 148 74 L148 106 C100 114 50 108 18 90 Z" {...LINE} />
      <path d="M36 90 L138 90" {...FINE} />
      <path d="M44 86 C80 80 110 78 140 80" {...FINE} opacity="0.5" />
      <g clipPath="url(#etch-blade)">{hatch(30, 90, 120, 20, 3.5)}</g>
      {/* crossguard, curled at both ends */}
      <path d="M148 74 L148 106" {...LINE} />
      <path d="M152 62 C146 62 146 74 152 74 L160 74 L160 106 L152 106 C146 106 146 118 152 118" {...LINE} />
      <path d="M152 62 C158 62 158 68 154 68" {...FINE} />
      <path d="M152 118 C158 118 158 112 154 112" {...FINE} />
      {/* grip, wrapped */}
      <path d="M160 80 L206 82 L206 98 L160 100 Z" {...LINE} />
      <path d="M168 80 L166 100 M176 80 L174 100 M184 81 L182 99 M192 81 L190 99 M200 82 L198 98" {...FINE} />
      {hatch(160, 91, 46, 9, 3, 'diag')}
      {/* wheel pommel */}
      <circle cx="217" cy="90" r="11" {...LINE} />
      <circle cx="217" cy="90" r="4" {...FINE} />
      <path d="M209 96 C214 102 222 102 226 95" {...HATCH} />
      {/* ground shadow */}
      <path d="M40 126 C90 122 160 122 214 126" {...HATCH} />
      <path d="M60 132 C100 129 150 129 196 132" {...HATCH} />
    </g>
  ),

  /* A lidded tankard with a thumb lever, banded, and a tall handle. */
  drink: (
    <g>
      <defs>
        <clipPath id="etch-tankard"><path d="M84 52 L152 52 L146 152 L90 152 Z" /></clipPath>
      </defs>
      <path d="M84 52 L152 52 L146 152 L90 152 Z" {...LINE} />
      <ellipse cx="118" cy="52" rx="34" ry="7" {...LINE} />
      {/* the lid, a low dome, and its lever */}
      <path d="M82 46 C82 34 154 34 154 46 L154 52 L82 52 Z" {...LINE} />
      <path d="M86 44 C100 38 136 38 150 44" {...FINE} />
      <path d="M154 46 L172 38 C176 36 178 40 175 43 L158 52" {...LINE} />
      {/* bands */}
      <path d="M86 78 L150 78 M87 72 L149 72" {...FINE} />
      <path d="M90 130 L146 130 M91 124 L145 124" {...FINE} />
      {/* handle */}
      <path d="M152 66 C184 66 190 108 160 118 L156 118 C182 108 178 74 150 74" {...LINE} />
      <path d="M170 76 C178 84 178 100 168 108" {...FINE} />
      {/* shade on the right */}
      <g clipPath="url(#etch-tankard)">
        {hatch(126, 80, 26, 44, 3.5, 'vert')}
        {hatch(122, 132, 26, 20, 3.5, 'vert')}
        {hatch(120, 56, 32, 14, 3.5, 'vert')}
      </g>
      <ellipse cx="118" cy="152" rx="28" ry="4" {...FINE} />
      <path d="M62 164 C90 160 150 160 176 164" {...HATCH} />
    </g>
  ),

  /* A trencher board with a cleaver laid across it. */
  table: (
    <g>
      <defs>
        <clipPath id="etch-board"><path d="M52 66 L196 66 C206 66 212 72 212 82 L212 132 C212 142 206 148 196 148 L52 148 C42 148 36 142 36 132 L36 82 C36 72 42 66 52 66 Z" /></clipPath>
      </defs>
      <path d="M52 66 L196 66 C206 66 212 72 212 82 L212 132 C212 142 206 148 196 148 L52 148 C42 148 36 142 36 132 L36 82 C36 72 42 66 52 66 Z" {...LINE} />
      <path d="M36 132 L36 140 C36 150 42 156 52 156 L196 156 C206 156 212 150 212 140 L212 132" {...LINE} />
      <path d="M36 148 L212 148" {...FINE} />
      {hatch(36, 148, 176, 8, 4, 'diag')}
      {/* end grain */}
      <path d="M62 66 L62 148 M84 66 L84 148 M106 66 L106 148 M128 66 L128 148 M150 66 L150 148 M172 66 L172 148 M194 66 L194 148" {...FINE} opacity="0.35" />
      <circle cx="198" cy="80" r="4" {...FINE} />
      {/* cleaver, square blade, riveted handle */}
      <path d="M70 84 L150 84 L156 92 L156 124 L70 124 Z" {...LINE} />
      <circle cx="146" cy="94" r="3" {...FINE} />
      <path d="M74 122 L152 122" {...FINE} />
      <g clipPath="url(#etch-board)">{hatch(72, 108, 82, 14, 3.5, 'diag')}</g>
      <path d="M156 100 L204 96 C209 96 212 99 212 103 L212 107 C212 111 209 114 204 114 L156 116" {...LINE} />
      <circle cx="170" cy="106" r="2.2" {...FINE} />
      <circle cx="190" cy="105" r="2.2" {...FINE} />
      <path d="M50 30 C90 22 150 22 190 30" {...HATCH} />
    </g>
  ),

  /* A drawstring purse, a key on a cord, and a coin. */
  carry: (
    <g>
      <defs>
        <clipPath id="etch-purse"><path d="M60 82 C40 100 40 150 78 156 L118 156 C156 150 156 100 136 82 Z" /></clipPath>
      </defs>
      {/* purse body, gathered neck */}
      <path d="M60 82 C40 100 40 150 78 156 L118 156 C156 150 156 100 136 82 Z" {...LINE} />
      <path d="M62 82 C66 74 72 66 76 58 M136 82 C132 74 126 66 122 58 M76 58 C88 64 110 64 122 58" {...LINE} />
      <path d="M86 60 L84 82 M98 62 L98 82 M110 62 L112 82" {...FINE} />
      <path d="M70 84 C80 90 118 90 128 84" {...FINE} />
      <path d="M72 80 C84 86 114 86 126 80 C132 78 134 70 128 68" {...FINE} />
      <g clipPath="url(#etch-purse)">{hatch(100, 100, 50, 56, 3.5, 'diag')}</g>
      {/* the cord and a key */}
      <path d="M128 68 C150 60 168 66 172 82 L172 96" {...FINE} />
      <circle cx="172" cy="104" r="8" {...LINE} />
      <circle cx="172" cy="104" r="3" {...FINE} />
      <path d="M172 112 L172 150 L182 150 L182 144 L176 144 L176 138 L184 138 L184 132 L176 132" {...LINE} />
      {/* a coin, struck */}
      <circle cx="46" cy="140" r="14" {...LINE} />
      <circle cx="46" cy="140" r="10" {...FINE} />
      <path d="M46 133 L46 147 M40 140 L52 140" {...FINE} />
      <path d="M40 172 C80 168 140 168 200 172" {...HATCH} />
    </g>
  ),

  /* A hanging sign on a wrought bracket. */
  walls: (
    <g>
      <defs>
        <clipPath id="etch-sign"><path d="M94 60 L200 60 L200 128 L94 128 Z" /></clipPath>
      </defs>
      {/* post and arm */}
      <path d="M44 22 L44 166" {...LINE} />
      <path d="M38 22 L50 22 M38 166 L50 166" {...LINE} />
      <path d="M44 40 L188 40" {...LINE} />
      <path d="M188 40 C196 40 198 48 190 50" {...FINE} />
      {/* scroll brace */}
      <path d="M44 100 C44 70 70 46 108 40" {...LINE} />
      <path d="M62 84 C64 68 78 56 96 50" {...FINE} />
      <path d="M44 100 C50 108 58 104 54 96" {...FINE} />
      {/* chains */}
      <path d="M110 40 L110 60 M184 40 L184 60" {...FINE} />
      <path d="M108 44 L112 44 M108 50 L112 50 M108 56 L112 56 M182 44 L186 44 M182 50 L186 50 M182 56 L186 56" {...FINE} />
      {/* the sign, a plank with a moulded edge */}
      <path d="M94 60 L200 60 L200 128 L94 128 Z" {...LINE} />
      <path d="M100 66 L194 66 L194 122 L100 122 Z" {...FINE} />
      <path d="M112 84 L182 84 M112 96 L168 96 M112 108 L176 108" {...FINE} opacity="0.5" />
      <g clipPath="url(#etch-sign)">{hatch(150, 100, 50, 28, 3.5, 'diag')}</g>
      <path d="M94 128 L200 128 L200 134 L94 134 Z" {...FINE} />
      {hatch(94, 128, 106, 6, 3, 'diag')}
      <path d="M60 172 C110 168 170 168 214 172" {...HATCH} />
    </g>
  ),

  /* A quill in its well, and a sealed letter. */
  business: (
    <g>
      <defs>
        <clipPath id="etch-well"><path d="M56 112 L104 112 L100 154 L60 154 Z" /></clipPath>
        <clipPath id="etch-letter"><path d="M118 106 L212 106 L212 156 L118 156 Z" /></clipPath>
      </defs>
      {/* inkwell */}
      <path d="M56 112 L104 112 L100 154 L60 154 Z" {...LINE} />
      <path d="M52 106 L108 106 L108 112 L52 112 Z" {...LINE} />
      <ellipse cx="80" cy="154" rx="20" ry="3" {...FINE} />
      <g clipPath="url(#etch-well)">{hatch(84, 116, 20, 38, 3.5, 'vert')}</g>
      {/* quill */}
      <path d="M84 106 C110 74 150 40 196 24" {...LINE} />
      <path d="M196 24 C176 24 150 42 130 66 C122 76 112 88 100 100" {...LINE} />
      <path d="M196 24 C196 44 182 62 160 74 C150 80 134 84 122 84" {...LINE} />
      <path d="M150 48 L160 60 M138 60 L148 72 M128 70 L136 80 M172 34 L184 42 M162 40 L172 52" {...FINE} />
      <path d="M100 100 C96 96 92 96 88 100" {...FINE} />
      {/* the letter, folded, sealed */}
      <path d="M118 106 L212 106 L212 156 L118 156 Z" {...LINE} />
      <path d="M118 106 L165 134 L212 106" {...LINE} />
      <path d="M118 156 L152 128 M212 156 L178 128" {...FINE} />
      <g clipPath="url(#etch-letter)">{hatch(120, 140, 92, 16, 3.5, 'diag')}</g>
      <circle cx="165" cy="134" r="8" {...LINE} />
      <circle cx="165" cy="134" r="4" {...FINE} />
      <path d="M44 170 C100 166 160 166 214 170" {...HATCH} />
    </g>
  ),

  /* A plank on two brackets: a goblet, a stack of coasters, a small chest. */
  shelf: (
    <g>
      <defs>
        <clipPath id="etch-plank"><path d="M28 104 L212 104 L212 114 L28 114 Z" /></clipPath>
      </defs>
      <path d="M28 104 L212 104 L212 114 L28 114 Z" {...LINE} />
      <g clipPath="url(#etch-plank)">{hatch(28, 104, 184, 10, 3.5, 'diag')}</g>
      <path d="M40 104 L40 96 M200 104 L200 96" {...FINE} opacity="0.4" />
      {/* brackets */}
      <path d="M52 114 L52 148 C52 136 62 124 84 114" {...LINE} />
      <path d="M188 114 L188 148 C188 136 178 124 156 114" {...LINE} />
      <path d="M56 130 C60 124 66 120 74 118" {...FINE} />
      <path d="M184 130 C180 124 174 120 166 118" {...FINE} />
      {/* goblet */}
      <path d="M58 52 L82 52 C82 68 76 76 70 78 L70 96 M58 52 C58 68 64 76 70 78" {...LINE} />
      <path d="M60 104 L80 104 C80 100 74 97 70 96 C66 97 60 100 60 104" {...LINE} />
      <path d="M62 60 C64 68 68 74 70 76" {...HATCH} />
      <path d="M66 58 C67 66 69 72 70 75" {...HATCH} />
      {/* a stack of coasters */}
      <path d="M104 104 L144 104 L144 98 L104 98 Z M106 98 L142 98 L142 92 L106 92 Z M104 92 L144 92 L144 86 L104 86 Z" {...LINE} />
      <path d="M110 89 L138 89" {...FINE} opacity="0.5" />
      {hatch(126, 86, 18, 18, 3, 'diag')}
      {/* a small chest with a domed lid */}
      <path d="M160 104 L204 104 L204 82 L160 82 Z" {...LINE} />
      <path d="M160 82 C160 70 204 70 204 82" {...LINE} />
      <path d="M168 82 L168 104 M196 82 L196 104" {...FINE} />
      <path d="M178 90 L186 90 L186 96 L178 96 Z" {...FINE} />
      <path d="M172 76 L192 76" {...FINE} />
      {hatch(196, 82, 8, 22, 3, 'diag')}
      <path d="M44 168 C100 164 160 164 208 168" {...HATCH} />
    </g>
  ),

  /* And the rest: a crate of odds and ends. */
  more: (
    <g>
      <path d="M52 84 L188 84 L180 150 L60 150 Z" {...LINE} />
      <path d="M52 84 L120 96 L188 84 M120 96 L120 150" {...FINE} />
      <path d="M60 104 L118 112 M60 124 L118 132 M180 104 L122 112 M180 124 L122 132" {...FINE} opacity="0.5" />
      <path d="M84 84 L84 60 L100 56 L100 84 M140 84 L140 58 L156 62 L156 84" {...LINE} />
      <path d="M116 84 L112 62 L128 62 L124 84" {...LINE} />
      {hatch(122, 100, 58, 50, 4, 'diag')}
      <path d="M44 166 C100 162 160 162 200 166" {...HATCH} />
    </g>
  ),
}
