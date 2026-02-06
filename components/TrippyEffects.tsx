'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

interface Whisp {
  id: number
  x: number
  y: number
  size: number
  hue: number
  duration: number
  dx: number
  dy: number
  delay: number
}

export default function TrippyEffects() {
  const [isActive, setIsActive] = useState(false)
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 })
  const [whisps, setWhisps] = useState<Whisp[]>([])
  const whispId = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Watch for trippy class on html
  useEffect(() => {
    const check = () => setIsActive(document.documentElement.classList.contains('trippy'))
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Respect reduced motion
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Mouse tracking for cursor aura
  useEffect(() => {
    if (!isActive || reducedMotion) return
    const handler = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [isActive, reducedMotion])

  // Spawn whisps
  const spawnWhisp = useCallback(() => {
    const w: Whisp = {
      id: whispId.current++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 3 + Math.random() * 8,
      hue: Math.random() * 360,
      duration: 12 + Math.random() * 20,
      dx: (Math.random() - 0.5) * 30,
      dy: (Math.random() - 0.5) * 20,
      delay: Math.random() * 2,
    }
    setWhisps(prev => [...prev.slice(-30), w])
    setTimeout(() => {
      setWhisps(prev => prev.filter(x => x.id !== w.id))
    }, w.duration * 1000)
  }, [])

  useEffect(() => {
    if (!isActive || reducedMotion) return
    // Initial burst
    for (let i = 0; i < 12; i++) {
      setTimeout(spawnWhisp, i * 300)
    }
    const interval = setInterval(spawnWhisp, 800)
    return () => clearInterval(interval)
  }, [isActive, reducedMotion, spawnWhisp])

  if (!isActive || reducedMotion) return null

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Cursor aura */}
      <div
        style={{
          position: 'absolute',
          left: mousePos.x,
          top: mousePos.y,
          width: 300,
          height: 300,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle,
            rgba(168, 85, 247, 0.12) 0%,
            rgba(59, 130, 246, 0.06) 35%,
            transparent 65%
          )`,
          borderRadius: '50%',
          transition: 'left 0.12s ease-out, top 0.12s ease-out',
          mixBlendMode: 'screen',
        }}
      />

      {/* Floating whisps */}
      {whisps.map((w) => (
        <div
          key={w.id}
          style={{
            position: 'absolute',
            left: `${w.x}%`,
            top: `${w.y}%`,
            width: w.size,
            height: w.size,
            borderRadius: '50%',
            background: `radial-gradient(circle,
              hsla(${w.hue}, 80%, 70%, 0.6) 0%,
              hsla(${w.hue}, 70%, 60%, 0.2) 50%,
              transparent 100%
            )`,
            boxShadow: `0 0 ${w.size * 3}px hsla(${w.hue}, 80%, 60%, 0.3)`,
            animation: `whisp-drift ${w.duration}s ease-in-out forwards, whisp-pulse ${3 + (w.id % 3)}s ease-in-out infinite`,
            animationDelay: `${w.delay}s`,
            ['--dx' as string]: `${w.dx}vw`,
            ['--dy' as string]: `${w.dy}vh`,
          }}
        />
      ))}

      {/* Aurora band — top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-20%',
          width: '140%',
          height: '30%',
          background: `linear-gradient(180deg,
            rgba(168, 85, 247, 0.08) 0%,
            rgba(59, 130, 246, 0.05) 40%,
            transparent 100%
          )`,
          filter: 'blur(40px)',
          animation: 'aurora-wave 10s ease-in-out infinite',
          mixBlendMode: 'screen',
        }}
      />

      {/* Aurora band — bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '-10%',
          width: '120%',
          height: '25%',
          background: `linear-gradient(0deg,
            rgba(236, 72, 153, 0.06) 0%,
            rgba(52, 211, 153, 0.04) 50%,
            transparent 100%
          )`,
          filter: 'blur(50px)',
          animation: 'aurora-wave 14s ease-in-out infinite reverse',
          mixBlendMode: 'screen',
        }}
      />

      {/* Inject keyframes for whisps and aurora */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes whisp-drift {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          8% {
            opacity: 0.8;
            transform: translate(0, 0) scale(1);
          }
          92% {
            opacity: 0.6;
          }
          100% {
            transform: translate(var(--dx, 10vw), var(--dy, -10vh)) scale(0.3);
            opacity: 0;
          }
        }

        @keyframes whisp-pulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.5);
            filter: brightness(1.4);
          }
        }

        @keyframes aurora-wave {
          0%, 100% {
            opacity: 0.6;
            transform: translateX(-5%) scaleY(1);
          }
          50% {
            opacity: 1;
            transform: translateX(5%) scaleY(1.3);
          }
        }
      `}} />
    </div>
  )
}
