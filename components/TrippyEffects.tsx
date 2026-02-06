'use client'

import { useEffect, useState, useRef } from 'react'

// Check if user prefers reduced motion
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

interface Whisp {
  id: number
  x: number
  y: number
  size: number
  hue: number
  speed: number
  angle: number
  breathOffset: number
}

export default function TrippyEffects() {
  const [isActive, setIsActive] = useState(false)
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 })
  const [whisps, setWhisps] = useState<Whisp[]>([])
  const whispId = useRef(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const checkTrippy = () => {
      setIsActive(document.documentElement.classList.contains('trippy'))
    }
    checkTrippy()
    const observer = new MutationObserver(checkTrippy)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Mouse tracking
  useEffect(() => {
    if (!isActive || prefersReducedMotion) return
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isActive, prefersReducedMotion])

  // Spawn whisps continuously
  useEffect(() => {
    if (!isActive || prefersReducedMotion) return

    const spawnWhisp = () => {
      const w: Whisp = {
        id: whispId.current++,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 5,
        hue: Math.random() * 360,
        speed: 15 + Math.random() * 25,
        angle: Math.random() * 360,
        breathOffset: Math.random() * Math.PI * 2,
      }
      setWhisps(prev => [...prev.slice(-40), w])
      setTimeout(() => {
        setWhisps(prev => prev.filter(x => x.id !== w.id))
      }, w.speed * 1000)
    }

    // Spawn initial batch
    for (let i = 0; i < 15; i++) {
      setTimeout(spawnWhisp, i * 200)
    }

    const interval = setInterval(spawnWhisp, 500)
    return () => clearInterval(interval)
  }, [isActive, prefersReducedMotion])

  // Respect user's motion preferences or inactive state
  if (prefersReducedMotion || !isActive) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Subtle cursor shadow/glow */}
      <div
        style={{
          position: 'absolute',
          left: mousePos.x,
          top: mousePos.y,
          width: '250px',
          height: '250px',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle,
            rgba(100, 80, 150, 0.15) 0%,
            rgba(80, 60, 120, 0.08) 30%,
            transparent 60%
          )`,
          borderRadius: '50%',
          transition: 'left 0.15s ease-out, top 0.15s ease-out',
        }}
      />

      {/* Floating whisps - each breathes independently */}
      {whisps.map((w) => (
        <div
          key={w.id}
          style={{
            position: 'absolute',
            left: `${w.x}%`,
            top: `${w.y}%`,
            width: `${w.size}px`,
            height: `${w.size}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle,
              hsla(${w.hue}, 80%, 70%, 0.7) 0%,
              hsla(${w.hue}, 70%, 60%, 0.3) 50%,
              transparent 100%
            )`,
            boxShadow: `0 0 ${w.size * 2}px hsla(${w.hue}, 80%, 60%, 0.4)`,
            animation: `
              whisp-float-${w.id % 4} ${w.speed}s linear forwards,
              whisp-breathe ${3 + (w.id % 3)}s ease-in-out infinite
            `,
            animationDelay: `0s, ${w.breathOffset}s`,
          }}
        />
      ))}

      {/* Aurora at top - breathes on its own */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-20%',
          width: '140%',
          height: '35%',
          background: `
            linear-gradient(180deg,
              rgba(100, 200, 180, 0.12) 0%,
              rgba(120, 150, 200, 0.08) 40%,
              transparent 100%
            )
          `,
          filter: 'blur(40px)',
          animation: 'aurora-breathe 8s ease-in-out infinite',
        }}
      />

      {/* Second aurora layer - different rhythm */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-10%',
          width: '120%',
          height: '25%',
          background: `
            linear-gradient(180deg,
              rgba(180, 100, 200, 0.1) 0%,
              rgba(100, 180, 220, 0.06) 50%,
              transparent 100%
            )
          `,
          filter: 'blur(50px)',
          animation: 'aurora-breathe-2 12s ease-in-out infinite',
        }}
      />

      <style jsx>{`
        @keyframes whisp-float-0 {
          0% { transform: translate(0, 0); opacity: 0; }
          5% { opacity: 0.8; }
          95% { opacity: 0.8; }
          100% { transform: translate(30vw, -20vh); opacity: 0; }
        }
        @keyframes whisp-float-1 {
          0% { transform: translate(0, 0); opacity: 0; }
          5% { opacity: 0.8; }
          95% { opacity: 0.8; }
          100% { transform: translate(-25vw, 15vh); opacity: 0; }
        }
        @keyframes whisp-float-2 {
          0% { transform: translate(0, 0); opacity: 0; }
          5% { opacity: 0.8; }
          95% { opacity: 0.8; }
          100% { transform: translate(15vw, 25vh); opacity: 0; }
        }
        @keyframes whisp-float-3 {
          0% { transform: translate(0, 0); opacity: 0; }
          5% { opacity: 0.8; }
          95% { opacity: 0.8; }
          100% { transform: translate(-20vw, -30vh); opacity: 0; }
        }

        @keyframes whisp-breathe {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.4); filter: brightness(1.3); }
        }

        @keyframes aurora-breathe {
          0%, 100% {
            opacity: 0.8;
            transform: translateX(-5%) scaleY(1);
          }
          50% {
            opacity: 1;
            transform: translateX(5%) scaleY(1.2);
          }
        }

        @keyframes aurora-breathe-2 {
          0%, 100% {
            opacity: 0.6;
            transform: translateX(3%) scaleY(1);
          }
          50% {
            opacity: 0.9;
            transform: translateX(-3%) scaleY(1.15);
          }
        }
      `}</style>
    </div>
  )
}
