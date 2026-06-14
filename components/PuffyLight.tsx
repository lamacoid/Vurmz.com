'use client'

import { useEffect } from 'react'

/**
 * Makes the raised ".puffy" surfaces react to a light source: as the pointer
 * moves, a soft white sheen tracks it across whichever raised element is under
 * the cursor (the highlight position is fed to CSS via --lx/--ly custom props;
 * globals.css draws the actual glare on ::after). Render once near the page root.
 */
const SEL = '.puffy, .puffy-light, .puffy-btn'

export default function PuffyLight() {
  useEffect(() => {
    let frame = 0
    let pending: { el: HTMLElement; x: number; y: number } | null = null

    const apply = () => {
      frame = 0
      if (!pending) return
      const { el, x, y } = pending
      el.style.setProperty('--lx', `${x}px`)
      el.style.setProperty('--ly', `${y}px`)
    }

    const onMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(SEL)
      if (!target) return
      const r = target.getBoundingClientRect()
      pending = { el: target, x: e.clientX - r.left, y: e.clientY - r.top }
      if (!frame) frame = requestAnimationFrame(apply)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return null
}
