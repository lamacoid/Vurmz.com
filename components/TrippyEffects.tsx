'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

// ─── Types ───────────────────────────────────────────────
interface Whisp {
  id: number; x: number; y: number; size: number;
  hue: number; duration: number; dx: number; dy: number;
}

interface Tracer {
  id: number; x: number; y: number; hue: number; size: number;
}

interface GeoShape {
  id: number; x: number; y: number; rotation: number;
  scale: number; hue: number; type: 'flower' | 'sri' | 'hex' | 'eye' | 'spiral';
  duration: number;
}

// ─── Sacred Geometry SVGs ────────────────────────────────
function FlowerOfLife({ hue }: { hue: number }) {
  const r = 20
  const centers = [
    [0, 0],
    ...Array.from({ length: 6 }, (_, i) => {
      const a = (i * 60) * Math.PI / 180
      return [Math.cos(a) * r, Math.sin(a) * r]
    })
  ]
  return (
    <svg viewBox="-50 -50 100 100" style={{ width: '100%', height: '100%' }}>
      {centers.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={r}
          fill="none" stroke={`hsla(${hue}, 80%, 65%, 0.6)`} strokeWidth="0.5" />
      ))}
    </svg>
  )
}

function SriYantra({ hue }: { hue: number }) {
  return (
    <svg viewBox="-50 -50 100 100" style={{ width: '100%', height: '100%' }}>
      {[40, 30, 20, 10].map((s, i) => (
        <polygon key={i}
          points={`0,${-s} ${s * 0.866},${s * 0.5} ${-s * 0.866},${s * 0.5}`}
          fill="none" stroke={`hsla(${hue + i * 30}, 80%, 65%, ${0.5 - i * 0.1})`}
          strokeWidth="0.4"
          transform={`rotate(${i % 2 === 0 ? 0 : 180})`}
        />
      ))}
      <circle cx="0" cy="0" r="42" fill="none"
        stroke={`hsla(${hue}, 70%, 60%, 0.3)`} strokeWidth="0.3" />
    </svg>
  )
}

function HexGrid({ hue }: { hue: number }) {
  const hexes: [number, number][] = []
  for (let q = -2; q <= 2; q++) {
    for (let r = -2; r <= 2; r++) {
      if (Math.abs(q + r) <= 2) {
        const x = 12 * (q + r * 0.5)
        const y = 12 * r * 0.866
        hexes.push([x, y])
      }
    }
  }
  return (
    <svg viewBox="-50 -50 100 100" style={{ width: '100%', height: '100%' }}>
      {hexes.map(([x, y], i) => (
        <polygon key={i}
          points={Array.from({ length: 6 }, (_, j) => {
            const a = (j * 60 + 30) * Math.PI / 180
            return `${x + 6 * Math.cos(a)},${y + 6 * Math.sin(a)}`
          }).join(' ')}
          fill="none"
          stroke={`hsla(${hue + i * 15}, 75%, 60%, 0.4)`}
          strokeWidth="0.3"
        />
      ))}
    </svg>
  )
}

function AllSeeingEye({ hue }: { hue: number }) {
  return (
    <svg viewBox="-50 -50 100 100" style={{ width: '100%', height: '100%' }}>
      <ellipse cx="0" cy="0" rx="35" ry="20"
        fill="none" stroke={`hsla(${hue}, 80%, 65%, 0.5)`} strokeWidth="0.6" />
      <circle cx="0" cy="0" r="10"
        fill={`hsla(${hue + 60}, 70%, 50%, 0.15)`}
        stroke={`hsla(${hue + 60}, 80%, 65%, 0.6)`} strokeWidth="0.5" />
      <circle cx="0" cy="0" r="4"
        fill={`hsla(${hue}, 90%, 30%, 0.4)`} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30) * Math.PI / 180
        return <line key={i} x1={Math.cos(a) * 22} y1={Math.sin(a) * 13}
          x2={Math.cos(a) * 45} y2={Math.sin(a) * 27}
          stroke={`hsla(${hue + i * 20}, 70%, 60%, 0.3)`} strokeWidth="0.3" />
      })}
    </svg>
  )
}

function Spiral({ hue }: { hue: number }) {
  const points: string[] = []
  for (let t = 0; t < 720; t += 5) {
    const r = t * 0.06
    const a = t * Math.PI / 180
    points.push(`${r * Math.cos(a)},${r * Math.sin(a)}`)
  }
  return (
    <svg viewBox="-50 -50 100 100" style={{ width: '100%', height: '100%' }}>
      <polyline points={points.join(' ')}
        fill="none" stroke={`hsla(${hue}, 75%, 60%, 0.4)`} strokeWidth="0.4" />
    </svg>
  )
}

const geoComponents = { flower: FlowerOfLife, sri: SriYantra, hex: HexGrid, eye: AllSeeingEye, spiral: Spiral }

// ─── Main Component ──────────────────────────────────────
export default function TrippyEffects() {
  const [isActive, setIsActive] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 })
  const [whisps, setWhisps] = useState<Whisp[]>([])
  const [tracers, setTracers] = useState<Tracer[]>([])
  const [geoShapes, setGeoShapes] = useState<GeoShape[]>([])
  const idRef = useRef(0)
  const lastTracerTime = useRef(0)

  // ─── Activation ─────────────────────────────────────
  useEffect(() => {
    const check = () => setIsActive(document.documentElement.classList.contains('trippy'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  // ─── Mouse tracking with tracers ───────────────────
  useEffect(() => {
    if (!isActive || reducedMotion) return
    const handler = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      const now = Date.now()
      if (now - lastTracerTime.current > 40) {
        lastTracerTime.current = now
        const t: Tracer = {
          id: idRef.current++,
          x: e.clientX, y: e.clientY,
          hue: (now * 0.1) % 360,
          size: 4 + Math.random() * 8,
        }
        setTracers(prev => [...prev.slice(-25), t])
        setTimeout(() => setTracers(prev => prev.filter(x => x.id !== t.id)), 1500)
      }
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [isActive, reducedMotion])

  // ─── Floating whisps ───────────────────────────────
  const spawnWhisp = useCallback(() => {
    const w: Whisp = {
      id: idRef.current++,
      x: Math.random() * 100, y: Math.random() * 100,
      size: 4 + Math.random() * 12,
      hue: Math.random() * 360,
      duration: 10 + Math.random() * 25,
      dx: (Math.random() - 0.5) * 40,
      dy: (Math.random() - 0.5) * 30,
    }
    setWhisps(prev => [...prev.slice(-35), w])
    setTimeout(() => setWhisps(prev => prev.filter(x => x.id !== w.id)), w.duration * 1000)
  }, [])

  useEffect(() => {
    if (!isActive || reducedMotion) return
    for (let i = 0; i < 10; i++) setTimeout(spawnWhisp, i * 400)
    const iv = setInterval(spawnWhisp, 1200)
    return () => clearInterval(iv)
  }, [isActive, reducedMotion, spawnWhisp])

  // ─── Sacred geometry shapes ────────────────────────
  const spawnGeo = useCallback(() => {
    const types: GeoShape['type'][] = ['flower', 'sri', 'hex', 'eye', 'spiral']
    const g: GeoShape = {
      id: idRef.current++,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 1.5,
      hue: Math.random() * 360,
      type: types[Math.floor(Math.random() * types.length)],
      duration: 8 + Math.random() * 15,
    }
    setGeoShapes(prev => [...prev.slice(-6), g])
    setTimeout(() => setGeoShapes(prev => prev.filter(x => x.id !== g.id)), g.duration * 1000)
  }, [])

  useEffect(() => {
    if (!isActive || reducedMotion) return
    setTimeout(spawnGeo, 2000)
    const iv = setInterval(spawnGeo, 4000 + Math.random() * 6000)
    return () => clearInterval(iv)
  }, [isActive, reducedMotion, spawnGeo])

  // ─── Random DOM events — independent & cascading ────
  useEffect(() => {
    if (!isActive || reducedMotion) return

    const events = [
      'melt-button', 'flash-section', 'wobble-card',
      'echo-heading', 'breathe-intense', 'color-spike',
      'drift-text', 'ripple', 'invert-flash',
      'stretch-horizontal', 'glow-edges', 'phase-shift',
    ]

    const selectors: Record<string, string> = {
      'melt-button': 'a[href], button',
      'flash-section': 'section',
      'wobble-card': '[class*="rounded-lg"], [class*="rounded-xl"]',
      'echo-heading': 'h1, h2, h3',
      'breathe-intense': 'section',
      'color-spike': '[class*="bg-vurmz"]',
      'drift-text': 'p',
      'ripple': 'section',
      'invert-flash': 'section',
      'stretch-horizontal': '[class*="rounded-lg"], [class*="rounded-xl"]',
      'glow-edges': 'section, [class*="rounded-2xl"]',
      'phase-shift': 'h1, h2, h3, p',
    }

    const doRandomEvent = () => {
      const type = events[Math.floor(Math.random() * events.length)]
      const els = document.querySelectorAll(selectors[type] || 'section')
      if (els.length === 0) return
      const el = els[Math.floor(Math.random() * els.length)] as HTMLElement

      const className = `trippy-event-${type}`
      el.classList.add(className)

      const dur = 3000 + Math.random() * 5000
      setTimeout(() => el.classList.remove(className), dur)
    }

    // Fire ONE event at a time, with long gentle intervals
    const scheduleNext = () => {
      const delay = 4000 + Math.random() * 8000
      return setTimeout(() => {
        doRandomEvent()
        timerId = scheduleNext()
      }, delay)
    }

    let timerId = scheduleNext()
    return () => clearTimeout(timerId)
  }, [isActive, reducedMotion])

  if (!isActive || reducedMotion) return null

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }} aria-hidden="true">

      {/* ── Cursor aura with color bleeding ── */}
      <div style={{
        position: 'absolute', left: mousePos.x, top: mousePos.y,
        width: 350, height: 350,
        transform: 'translate(-50%, -50%)',
        background: `
          radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)
        `,
        borderRadius: '50%',
        transition: 'left 0.15s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.15s cubic-bezier(0.25, 0.1, 0.25, 1)',
        mixBlendMode: 'screen',
        animation: 'cursor-breathe 3s ease-in-out infinite',
      }} />

      {/* ── Mouse tracers ── */}
      {tracers.map((t) => (
        <div key={t.id} style={{
          position: 'absolute', left: t.x, top: t.y,
          width: t.size, height: t.size,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, hsla(${t.hue}, 90%, 70%, 0.8) 0%, transparent 70%)`,
          boxShadow: `0 0 ${t.size * 2}px hsla(${t.hue}, 90%, 60%, 0.5)`,
          animation: 'tracer-fade 1.5s ease-out forwards',
        }} />
      ))}

      {/* ── Floating whisps ── */}
      {whisps.map((w) => (
        <div key={w.id} style={{
          position: 'absolute', left: `${w.x}%`, top: `${w.y}%`,
          width: w.size, height: w.size,
          borderRadius: '50%',
          background: `radial-gradient(circle,
            hsla(${w.hue}, 85%, 70%, 0.7) 0%,
            hsla(${w.hue}, 75%, 60%, 0.3) 40%,
            transparent 100%
          )`,
          boxShadow: `0 0 ${w.size * 4}px hsla(${w.hue}, 85%, 60%, 0.4)`,
          animation: `whisp-drift ${w.duration}s ease-in-out forwards, whisp-pulse ${2.5 + (w.id % 4)}s ease-in-out infinite`,
          ['--dx' as string]: `${w.dx}vw`,
          ['--dy' as string]: `${w.dy}vh`,
        }} />
      ))}

      {/* ── Sacred geometry ── */}
      {geoShapes.map((g) => {
        const Comp = geoComponents[g.type]
        return (
          <div key={g.id} style={{
            position: 'absolute',
            left: `${g.x}%`, top: `${g.y}%`,
            width: `${80 * g.scale}px`, height: `${80 * g.scale}px`,
            transform: `translate(-50%, -50%) rotate(${g.rotation}deg)`,
            animation: `geo-manifest ${g.duration}s ease-in-out forwards, geo-spin ${g.duration * 2}s linear infinite`,
            opacity: 0,
          }}>
            <Comp hue={g.hue} />
          </div>
        )
      })}

      {/* ── Aurora bands ── */}
      <div style={{
        position: 'absolute', top: 0, left: '-30%', width: '160%', height: '35%',
        background: `linear-gradient(180deg,
          rgba(168, 85, 247, 0.1) 0%,
          rgba(59, 130, 246, 0.06) 30%,
          rgba(52, 211, 153, 0.04) 60%,
          transparent 100%
        )`,
        filter: 'blur(50px)',
        animation: 'aurora-wave 8s ease-in-out infinite',
        mixBlendMode: 'screen',
      }} />

      <div style={{
        position: 'absolute', bottom: 0, left: '-20%', width: '140%', height: '30%',
        background: `linear-gradient(0deg,
          rgba(236, 72, 153, 0.08) 0%,
          rgba(251, 146, 60, 0.05) 40%,
          transparent 100%
        )`,
        filter: 'blur(60px)',
        animation: 'aurora-wave 12s ease-in-out infinite reverse',
        mixBlendMode: 'screen',
      }} />

      {/* ── Side aurora ribbons ── */}
      <div style={{
        position: 'absolute', top: '20%', left: 0, width: '15%', height: '60%',
        background: `linear-gradient(90deg,
          rgba(139, 92, 246, 0.06) 0%,
          transparent 100%
        )`,
        filter: 'blur(40px)',
        animation: 'aurora-side 10s ease-in-out infinite',
      }} />

      <div style={{
        position: 'absolute', top: '30%', right: 0, width: '15%', height: '50%',
        background: `linear-gradient(270deg,
          rgba(52, 211, 153, 0.06) 0%,
          transparent 100%
        )`,
        filter: 'blur(40px)',
        animation: 'aurora-side 13s ease-in-out infinite reverse',
      }} />

      {/* ── Inject all keyframes ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cursor-breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.3); }
        }

        @keyframes tracer-fade {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
          50% { transform: translate(-50%, -50%) scale(2); opacity: 0.4; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }

        @keyframes whisp-drift {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          6% { opacity: 0.9; transform: translate(0, 0) scale(1); }
          90% { opacity: 0.5; }
          100% { transform: translate(var(--dx, 10vw), var(--dy, -10vh)) scale(0.2); opacity: 0; }
        }

        @keyframes whisp-pulse {
          0%, 100% { filter: brightness(1) blur(0px); }
          50% { filter: brightness(1.5) blur(1px); }
        }

        @keyframes geo-manifest {
          0% { opacity: 0; transform: translate(-50%, -50%) rotate(0deg) scale(0.3); }
          15% { opacity: 0.7; }
          50% { opacity: 0.5; transform: translate(-50%, -50%) rotate(90deg) scale(1.2); }
          85% { opacity: 0.3; }
          100% { opacity: 0; transform: translate(-50%, -50%) rotate(180deg) scale(0.5); }
        }

        @keyframes geo-spin {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }

        @keyframes aurora-wave {
          0%, 100% { opacity: 0.5; transform: translateX(-8%) scaleY(1); }
          33% { opacity: 0.9; transform: translateX(3%) scaleY(1.4); }
          66% { opacity: 0.7; transform: translateX(8%) scaleY(1.1); }
        }

        @keyframes aurora-side {
          0%, 100% { opacity: 0.4; transform: scaleX(1) translateY(0); }
          50% { opacity: 0.8; transform: scaleX(1.5) translateY(-5%); }
        }

        /* ─── Random event classes applied to DOM elements ─── */

        /* All random events use smooth cubic-bezier and NO !important */
        .trippy-event-melt-button {
          animation: te-melt 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes te-melt {
          0%, 100% { transform: scaleY(1) scaleX(1); filter: blur(0px); }
          40% { transform: scaleY(1.06) scaleX(0.96); filter: blur(0.3px); }
          70% { transform: scaleY(0.97) scaleX(1.03); filter: blur(0.5px); }
        }

        .trippy-event-flash-section {
          animation: te-flash 5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes te-flash {
          0%, 100% { filter: brightness(1) saturate(1); }
          30% { filter: brightness(1.15) saturate(1.3); }
          60% { filter: brightness(0.95) saturate(1.15); }
        }

        .trippy-event-wobble-card {
          animation: te-wobble 5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes te-wobble {
          0%, 100% { transform: perspective(800px) rotateX(0) rotateY(0); }
          25% { transform: perspective(800px) rotateX(1deg) rotateY(-0.8deg); }
          50% { transform: perspective(800px) rotateX(-0.6deg) rotateY(1deg); }
          75% { transform: perspective(800px) rotateX(0.4deg) rotateY(-0.4deg); }
        }

        .trippy-event-echo-heading {
          animation: te-echo 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes te-echo {
          0%, 100% { text-shadow: none; letter-spacing: 0em; }
          30% { text-shadow: 1px 1px 6px rgba(168,85,247,0.3), -1px -1px 6px rgba(59,130,246,0.3); letter-spacing: 0.01em; }
          60% { text-shadow: 2px 2px 12px rgba(236,72,153,0.25), -2px -2px 12px rgba(52,211,153,0.2); letter-spacing: 0.02em; }
        }

        .trippy-event-breathe-intense {
          animation: te-breathe-hard 5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes te-breathe-hard {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }

        .trippy-event-color-spike {
          animation: te-color-spike 6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes te-color-spike {
          0%, 100% { filter: hue-rotate(0deg) saturate(1); }
          35% { filter: hue-rotate(40deg) saturate(1.4); }
          65% { filter: hue-rotate(-30deg) saturate(1.3); }
        }

        .trippy-event-drift-text {
          animation: te-drift 5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes te-drift {
          0%, 100% { transform: translateX(0); }
          30% { transform: translateX(2px); }
          60% { transform: translateX(-1.5px); }
        }

        .trippy-event-ripple {
          animation: te-ripple 5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes te-ripple {
          0%, 100% { box-shadow: inset 0 0 0 0 rgba(168,85,247,0); }
          30% { box-shadow: inset 0 0 25px 3px rgba(168,85,247,0.1); }
          60% { box-shadow: inset 0 0 40px 5px rgba(59,130,246,0.07); }
        }

        .trippy-event-invert-flash {
          animation: te-invert 4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes te-invert {
          0%, 100% { filter: invert(0) hue-rotate(0deg); }
          50% { filter: invert(0.04) hue-rotate(12deg); }
        }

        .trippy-event-stretch-horizontal {
          animation: te-stretch 5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes te-stretch {
          0%, 100% { transform: scaleX(1) scaleY(1); }
          35% { transform: scaleX(1.02) scaleY(0.99); }
          65% { transform: scaleX(0.99) scaleY(1.01); }
        }

        .trippy-event-glow-edges {
          animation: te-glow-edges 6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes te-glow-edges {
          0%, 100% { box-shadow: none; }
          30% { box-shadow: inset 0 0 15px rgba(168,85,247,0.08), 0 0 15px rgba(168,85,247,0.06); }
          60% { box-shadow: inset 0 0 25px rgba(59,130,246,0.1), 0 0 20px rgba(236,72,153,0.06); }
        }

        .trippy-event-phase-shift {
          animation: te-phase 5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes te-phase {
          0%, 100% { opacity: 1; transform: translateX(0); }
          30% { opacity: 0.85; transform: translateX(2px); filter: hue-rotate(15deg); }
          60% { opacity: 0.92; transform: translateX(-1px); filter: hue-rotate(-10deg); }
        }
      `}} />
    </div>
  )
}
