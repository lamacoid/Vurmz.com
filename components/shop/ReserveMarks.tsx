/**
 * One-line drawings of the things in the reserve. Drawn here, owned here,
 * so the room never needs a maker's photo. Each is a single stroke
 * family on a 200 by 150 box, signal teal by default, sized by the parent.
 * They double as the plate silhouettes on the category page: the mark
 * is previewed on the shape of the actual object.
 */
import type { ReserveGroup } from '@/lib/sourcing'

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export function ReserveMark({ kind, className = '', style }: { kind: ReserveGroup; className?: string; style?: React.CSSProperties }) {
  const D = DRAWINGS[kind]
  return (
    <svg viewBox="0 0 200 150" className={className} style={style} aria-hidden focusable="false">
      {D}
    </svg>
  )
}

const DRAWINGS: Record<ReserveGroup, React.ReactNode> = {
  'chef-knife': (
    <g {...S}>
      {/* gyuto profile: flat spine, belly curving up to the tip on the left */}
      <path d="M124 52 L184 52 C189 52 192 55 192 60 L192 64 C192 69 189 72 184 72 L124 72" />
      <path d="M124 52 C88 52 46 58 18 78 C36 76 78 80 124 72" />
      {/* the spine, straight */}
      <path d="M124 52 L124 72" strokeWidth="1.2" opacity="0.4" />
      {/* rivets */}
      <circle cx="146" cy="62" r="2.2" />
      <circle cx="170" cy="62" r="2.2" />
      {/* the heel, where the name goes */}
      <path d="M104 66 L116 65" strokeWidth="1.4" opacity="0.6" />
    </g>
  ),
  'pocket-knife': (
    <g {...S}>
      {/* handle, gently tapered */}
      <path d="M96 84 L176 92 C182 93 186 89 186 83 L186 79 C186 73 182 69 176 69 L100 66 Z" />
      {/* blade, open, drop point */}
      <path d="M100 66 C80 60 48 52 24 58 C18 60 16 66 20 70 C44 78 76 82 96 84" />
      {/* the grind line */}
      <path d="M96 72 C70 66 44 62 24 62" strokeWidth="1.2" opacity="0.45" />
      {/* pivot, thumb hole */}
      <circle cx="100" cy="75" r="3.5" />
      <circle cx="72" cy="66" r="4" strokeWidth="1.4" opacity="0.6" />
      {/* clip */}
      <path d="M176 92 C168 96 156 96 150 92" strokeWidth="1.4" opacity="0.6" />
    </g>
  ),
  skillet: (
    <g {...S}>
      {/* pan seen from above, slightly tilted */}
      <ellipse cx="90" cy="82" rx="58" ry="46" />
      <ellipse cx="90" cy="82" rx="46" ry="36" strokeWidth="1.4" opacity="0.6" />
      {/* handle */}
      <path d="M144 70 L186 58 C191 57 194 60 193 64 L190 72 C189 75 186 76 183 75 L146 88" />
      {/* helper handle */}
      <path d="M36 74 C28 72 26 80 33 84" />
      {/* underside mark hint */}
      <path d="M78 84 L102 84" strokeWidth="1.4" opacity="0.6" />
    </g>
  ),
  board: (
    <g {...S}>
      {/* board, slight perspective */}
      <path d="M30 44 L170 44 C176 44 180 48 180 54 L180 114 C180 120 176 124 170 124 L30 124 C24 124 20 120 20 114 L20 54 C20 48 24 44 30 44 Z" />
      {/* end grain lines */}
      <path d="M44 44 L44 124 M68 44 L68 124 M92 44 L92 124 M116 44 L116 124 M140 44 L140 124 M164 44 L164 124" strokeWidth="1.2" opacity="0.4" />
      {/* juice groove */}
      <path d="M34 58 L166 58 L166 110 L34 110 Z" strokeWidth="1.4" opacity="0.6" />
      {/* handle hole */}
      <circle cx="160" cy="52" r="3" />
    </g>
  ),
  wallet: (
    <g {...S}>
      {/* two plates, offset */}
      <rect x="52" y="40" width="96" height="62" rx="8" />
      <rect x="60" y="52" width="96" height="62" rx="8" />
      {/* thumb notch */}
      <path d="M100 114 C104 106 112 106 116 114" />
      {/* elastic */}
      <path d="M60 68 L156 68 M60 98 L156 98" strokeWidth="1.2" opacity="0.4" />
      {/* corner mark hint */}
      <path d="M72 62 L86 62" strokeWidth="1.4" opacity="0.6" />
    </g>
  ),
  cooler: (
    <g {...S}>
      {/* body */}
      <path d="M32 66 L168 66 L162 124 L38 124 Z" />
      {/* lid */}
      <path d="M28 52 C28 48 31 46 35 46 L165 46 C169 46 172 48 172 52 L172 66 L28 66 Z" />
      {/* latches */}
      <path d="M62 66 L62 80 M138 66 L138 80" />
      {/* handles */}
      <path d="M32 88 L18 88 C14 88 12 91 12 95 L12 100 M168 88 L182 88 C186 88 188 91 188 95 L188 100" />
      {/* lid mark hint */}
      <path d="M80 56 L120 56" strokeWidth="1.4" opacity="0.6" />
    </g>
  ),
  pen: (
    <g {...S}>
      {/* barrel on a slant */}
      <path d="M40 118 L134 38 C138 34 144 34 148 38 L152 42 C156 46 156 52 152 56 L58 136 C54 140 48 140 44 136 L40 132 C36 128 36 122 40 118 Z" />
      {/* tip */}
      <path d="M40 118 L28 132 L44 136" />
      {/* clip */}
      <path d="M134 38 L156 60" strokeWidth="1.4" opacity="0.6" />
      <path d="M100 74 L124 50" strokeWidth="1.4" opacity="0.6" />
    </g>
  ),
  multitool: (
    <g {...S}>
      {/* two handles, closed */}
      <path d="M60 40 L60 116 C60 122 64 126 70 126 L86 126 C92 126 96 122 96 116 L96 40 C96 34 92 30 86 30 L70 30 C64 30 60 34 60 40 Z" />
      <path d="M104 40 L104 116 C104 122 108 126 114 126 L130 126 C136 126 140 122 140 116 L140 40 C140 34 136 30 130 30 L114 30 C108 30 104 34 104 40 Z" />
      {/* plier tips */}
      <path d="M78 30 L84 12 L96 22 M122 30 L116 12 L104 22" />
      {/* tool lines */}
      <path d="M70 52 L86 52 M70 70 L86 70 M114 52 L130 52 M114 70 L130 70" strokeWidth="1.2" opacity="0.4" />
    </g>
  ),
}
