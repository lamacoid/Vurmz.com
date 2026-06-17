'use client'

import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'vurmz-cursor'
const STYLE_ID = 'laser-cursor-style'

// The normal arrow shape. The laser head races around this outline, like a
// fiber laser framing the shape before it fires. Tip is at (4,3) = the hotspot.
const ARROW_PATH = 'M4 3 L4 23 L9 18 L12.4 25 L15.4 23.6 L12 16.8 L19 16.8 Z'

const CLICKABLE =
  'a,button,[role="button"],label[for],select,summary,' +
  'input[type="submit"],input[type="button"],input[type="checkbox"],input[type="radio"],.cursor-pointer'

function ensureStyle() {
  if (document.getElementById(STYLE_ID)) return
  const el = document.createElement('style')
  el.id = STYLE_ID
  // Hide the native cursor everywhere; the SVG below stands in for it. The
  // keyframe drives the red head around the arrow outline (pathLength=100).
  el.textContent =
    'html.laser-cursor, html.laser-cursor * { cursor: none !important; }' +
    '@keyframes laser-trace { to { stroke-dashoffset: -100; } }'
  document.head.appendChild(el)
}

/**
 * Site-wide laser-framing cursor: the arrow outline with a bright-red head
 * tracing around it very fast. Toggle bottom-left (persisted, default on);
 * hidden on touch devices, and falls back to a static outline if the visitor
 * prefers reduced motion.
 */
export default function LaserCursor() {
  const [ready, setReady] = useState(false)
  const [on, setOn] = useState(true)
  const [coarse, setCoarse] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [armed, setArmed] = useState(false)

  const wrap = useRef<HTMLDivElement>(null)
  const raf = useRef(0)
  const next = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saved = localStorage.getItem(STORAGE_KEY)
    setCoarse(isCoarse)
    setReduced(isReduced)
    setOn(saved !== 'off')
    if (!isCoarse) {
      ensureStyle()
      document.documentElement.classList.toggle('laser-cursor', saved !== 'off')
    }
    setReady(true)
  }, [])

  const active = on && !coarse

  useEffect(() => {
    if (!active) return
    const move = (e: PointerEvent) => {
      next.current = { x: e.clientX, y: e.clientY }
      if (!raf.current) {
        raf.current = requestAnimationFrame(() => {
          raf.current = 0
          const w = wrap.current
          const p = next.current
          if (w && p) {
            w.style.transform = `translate3d(${p.x - 4}px, ${p.y - 3}px, 0)`
            w.style.opacity = '1'
          }
        })
      }
    }
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null
      setArmed(!!t?.closest?.(CLICKABLE))
    }
    const hide = () => { if (wrap.current) wrap.current.style.opacity = '0' }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('mouseleave', hide)
    window.addEventListener('blur', hide)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.removeEventListener('mouseleave', hide)
      window.removeEventListener('blur', hide)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [active])

  function toggle() {
    const next = !on
    setOn(next)
    localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
    ensureStyle()
    document.documentElement.classList.toggle('laser-cursor', next && !coarse)
  }

  if (!ready || coarse) return null

  // Armed (over something clickable) = locked on: head races faster + a faint
  // red fill, like the laser ready to fire.
  const dur = armed ? 0.22 : 0.36

  return (
    <>
      {active && (
        <div
          ref={wrap}
          aria-hidden
          style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999, opacity: 0, willChange: 'transform' }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" style={{ display: 'block', filter: 'drop-shadow(0 0 2px rgba(255,42,42,0.9))' }}>
            {/* Faint full outline so the arrow shape always reads */}
            <path
              d={ARROW_PATH}
              fill={armed ? 'rgba(255,42,42,0.30)' : 'none'}
              stroke="#FF2A2A"
              strokeOpacity={0.35}
              strokeWidth={1.3}
              strokeLinejoin="round"
              pathLength={100}
            />
            {/* The racing laser head */}
            <path
              d={ARROW_PATH}
              fill="none"
              stroke="#FF2A2A"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={100}
              style={
                reduced
                  ? { strokeOpacity: 1 }
                  : { strokeDasharray: '9 91', animation: `laser-trace ${dur}s linear infinite` }
              }
            />
          </svg>
        </div>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        title={on ? 'Turn off the laser cursor' : 'Turn on the laser cursor'}
        className="fixed bottom-4 left-4 z-[60] flex items-center gap-2 rounded-full border border-white/15 bg-[#16525C]/80 px-3 py-1.5 text-[11px] font-medium text-gray-200 shadow-lg shadow-black/20 backdrop-blur-md transition-colors hover:border-[#FF2A2A]/50 hover:text-white"
      >
        <span
          className={`h-2.5 w-2.5 rounded-full ${on ? 'bg-[#FF2A2A]' : 'border border-gray-400'}`}
          style={on ? { boxShadow: '0 0 6px 1px rgba(255,42,42,0.85)' } : undefined}
        />
        Laser cursor
        <span className={`ml-0.5 inline-flex h-3.5 w-6 items-center rounded-full px-0.5 transition-colors ${on ? 'bg-[#FF2A2A]/70' : 'bg-white/15'}`}>
          <span className={`h-2.5 w-2.5 rounded-full bg-white transition-transform ${on ? 'translate-x-2.5' : ''}`} />
        </span>
      </button>
    </>
  )
}
