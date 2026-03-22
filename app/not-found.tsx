'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width = w
    canvas.height = h

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
    }
    window.addEventListener('resize', resize)

    // Engraved "404" marks that accumulate
    const marks: Array<{ x: number; y: number; size: number; rot: number; opacity: number }> = []

    // Laser head position
    let laserX = w / 2
    let laserY = h / 2
    let targetX = Math.random() * w
    let targetY = Math.random() * h
    let engraving = false
    let engraveTick = 0
    const speed = 4

    // Sparks
    const sparks: Array<{ x: number; y: number; vx: number; vy: number; life: number }> = []

    function newTarget() {
      targetX = 60 + Math.random() * (w - 120)
      targetY = 60 + Math.random() * (h - 120)
      engraving = false
    }

    function addMark() {
      const sizes = [28, 36, 48, 64, 80, 100]
      marks.push({
        x: laserX,
        y: laserY,
        size: sizes[Math.floor(Math.random() * sizes.length)],
        rot: (Math.random() - 0.5) * 0.4,
        opacity: 0.6 + Math.random() * 0.3,
      })
      // Keep it from getting too heavy
      if (marks.length > 120) marks.shift()
    }

    function addSparks() {
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2
        const spd = 1 + Math.random() * 3
        sparks.push({
          x: laserX,
          y: laserY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 1,
          life: 15 + Math.random() * 20,
        })
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h)

      // Dark background
      ctx.fillStyle = '#1a2a1f'
      ctx.fillRect(0, 0, w, h)

      // Draw accumulated burn marks
      for (const m of marks) {
        ctx.save()
        ctx.translate(m.x, m.y)
        ctx.rotate(m.rot)
        ctx.font = `900 ${m.size}px Inter, system-ui, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        // Burn mark — dark etched look
        ctx.fillStyle = `rgba(18, 28, 20, ${m.opacity})`
        ctx.fillText('404', 0, 0)
        // Subtle edge highlight
        ctx.fillStyle = `rgba(125, 170, 140, ${m.opacity * 0.15})`
        ctx.fillText('404', 0.5, -0.5)
        ctx.restore()
      }

      // Move laser toward target
      const dx = targetX - laserX
      const dy = targetY - laserY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 5) {
        if (!engraving) {
          engraving = true
          engraveTick = 0
        }
        engraveTick++
        if (engraveTick > 8) {
          addMark()
          newTarget()
        }
        addSparks()
      } else {
        laserX += (dx / dist) * speed
        laserY += (dy / dist) * speed
      }

      // Draw sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.1
        s.life--
        if (s.life <= 0) { sparks.splice(i, 1); continue }
        const alpha = s.life / 30
        ctx.beginPath()
        ctx.arc(s.x, s.y, 1, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, ${150 + Math.random() * 100}, ${50 + Math.random() * 50}, ${alpha})`
        ctx.fill()
      }

      // Laser dot glow
      if (dist < 30 || engraving) {
        const glow = ctx.createRadialGradient(laserX, laserY, 0, laserX, laserY, 20)
        glow.addColorStop(0, 'rgba(255, 200, 100, 0.9)')
        glow.addColorStop(0.3, 'rgba(255, 140, 60, 0.4)')
        glow.addColorStop(1, 'rgba(255, 100, 30, 0)')
        ctx.fillStyle = glow
        ctx.fillRect(laserX - 20, laserY - 20, 40, 40)
      }

      // Laser dot
      ctx.beginPath()
      ctx.arc(laserX, laserY, 2, 0, Math.PI * 2)
      ctx.fillStyle = '#ff9944'
      ctx.fill()

      // Faint crosshair
      ctx.strokeStyle = 'rgba(255, 150, 80, 0.15)'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(laserX - 15, laserY)
      ctx.lineTo(laserX + 15, laserY)
      ctx.moveTo(laserX, laserY - 15)
      ctx.lineTo(laserX, laserY + 15)
      ctx.stroke()

      requestAnimationFrame(draw)
    }

    draw()

    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#1a2a1f] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-xs font-mono text-gray-500 tracking-[0.3em] uppercase mb-4">
          Page not found
        </p>
        <h1 className="text-6xl sm:text-8xl font-bold text-cream/10 tracking-tight mb-8">
          404
        </h1>
        <Link
          href="/"
          className="px-6 py-3 bg-vurmz-cta text-white font-semibold text-sm rounded-sm hover:bg-vurmz-cta-hover transition-all shadow-lg shadow-vurmz-cta/20"
        >
          Back to VURMZ
        </Link>
      </div>
    </div>
  )
}
