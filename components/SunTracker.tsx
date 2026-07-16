'use client'
/**
 * The March-noon sun. Every relief shadow and sticker gloss on the site
 * reads --sun-x / --sun-y (normalized, resting at 0,0 = noon). This
 * drifts them, damped and a beat behind the cursor and scroll, so the
 * whole scene's light moves together: one sky, one sun.
 *
 * Deliberately lazy: the loop only runs while there is distance left to
 * cover, writes at most ~30fps, and never starts at all under
 * prefers-reduced-motion or without a fine pointer (touch gets scroll
 * drift only). No JS = static noon, exactly as designed.
 */
import { useEffect } from 'react'

export default function SunTracker() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const root = document.documentElement
    const finePointer = window.matchMedia('(pointer: fine)').matches
    let tx = 0, ty = 0        // target
    let cx = 0, cy = 0        // current
    let raf = 0
    let lastWrite = 0

    const tick = (now: number) => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      const settled = Math.abs(tx - cx) < 0.002 && Math.abs(ty - cy) < 0.002
      if (now - lastWrite > 33) {
        root.style.setProperty('--sun-x', cx.toFixed(3))
        root.style.setProperty('--sun-y', cy.toFixed(3))
        lastWrite = now
      }
      raf = settled ? 0 : requestAnimationFrame(tick)
    }
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick) }

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
      wake()
    }
    const onScroll = () => {
      // scrolling = moving under the sky: a gentle vertical drift
      const drift = Math.max(-1, Math.min(1, (window.scrollY / window.innerHeight) * 0.3 - 0.15))
      ty = finePointer ? ty * 0.7 + drift * 0.3 : drift
      wake()
    }

    if (finePointer) window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
      root.style.removeProperty('--sun-x')
      root.style.removeProperty('--sun-y')
    }
  }, [])

  return null
}
