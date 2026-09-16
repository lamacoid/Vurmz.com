'use client'
/**
 * The teal door. One overlay, mounted once in the root layout, that any
 * link can walk through:
 *
 *   openDoor('/shop/reserve/shun-classic-8-chef', { x, y })
 *
 * or render <DoorLink href=...>. A deep teal circle grows from the click
 * point until it fills the screen, the router moves behind it, and once
 * the destination is on screen the teal lifts and the page is there.
 * Pages can call the lift early by dispatching 'vurmz:door-ready'.
 * Reduced-motion users get a short fade.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const TEAL = '#123F47'
const GLOW = '#7FCFD4'
const SWEEP_MS = 650

type Phase = 'closed' | 'sweeping' | 'holding' | 'lifting'

export function openDoor(href: string, from?: { x: number; y: number } | null) {
  window.dispatchEvent(new CustomEvent('vurmz:door', { detail: { href, from: from ?? null } }))
}

const norm = (p: string) => p.replace(/\/+$/, '') || '/'

export default function BackRoomDoor() {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<Phase>('closed')
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 })
  const target = useRef<string | null>(null)
  const covered = useRef(false)
  const timers = useRef<number[]>([])

  const clear = () => { timers.current.forEach(t => window.clearTimeout(t)); timers.current = [] }

  const lift = useCallback(() => {
    if (!target.current) return
    target.current = null
    setPhase('lifting')
    timers.current.push(window.setTimeout(() => setPhase('closed'), 650))
  }, [])

  // Open: sweep, then move. The move waits until the screen is covered so
  // the old page never flashes away under the teal.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<{ href: string; from: { x: number; y: number } | null }>).detail
      if (!d?.href) return
      const x = d.from ? (d.from.x / window.innerWidth) * 100 : 50
      const y = d.from ? (d.from.y / window.innerHeight) * 100 : 50
      clear()
      setOrigin({ x, y })
      target.current = d.href
      covered.current = false
      setPhase('sweeping')
      router.prefetch(d.href)
      timers.current.push(window.setTimeout(() => {
        covered.current = true
        setPhase('holding')
        router.push(d.href)
      }, SWEEP_MS))
      // Never trap anyone behind the teal.
      timers.current.push(window.setTimeout(lift, 6000))
    }
    const onReady = () => { if (covered.current) lift() }
    window.addEventListener('vurmz:door', onOpen)
    window.addEventListener('vurmz:door-ready', onReady)
    return () => {
      window.removeEventListener('vurmz:door', onOpen)
      window.removeEventListener('vurmz:door-ready', onReady)
      clear()
    }
  }, [router, lift])

  // Arrived: the route changed to the target. Give the new page one frame
  // to paint under the teal, then lift.
  useEffect(() => {
    if (phase !== 'holding' || !target.current) return
    if (norm(pathname) === norm(target.current)) {
      const t = window.setTimeout(lift, 180)
      timers.current.push(t)
    }
  }, [pathname, phase, lift])

  if (phase === 'closed') return null

  const covering = phase === 'sweeping' || phase === 'holding'

  return (
    <div
      aria-hidden
      data-backroom-door
      className="fixed inset-0 z-[200]"
      style={{
        pointerEvents: phase === 'lifting' ? 'none' : 'auto',
        ['--door-x' as string]: `${origin.x}%`,
        ['--door-y' as string]: `${origin.y}%`,
      }}
    >
      {/* The teal, a circle growing from the click. On lift it fades, so
          the room is not sucked back out through the hole it came in. */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${origin.x}% ${origin.y}%, #1B5A66 0%, ${TEAL} 38%, ${TEAL} 100%)`,
          clipPath: `circle(${covering ? '150vmax' : '0px'} at ${origin.x}% ${origin.y}%)`,
          transition: phase === 'lifting'
            ? 'opacity 600ms ease'
            : `clip-path ${SWEEP_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
          opacity: phase === 'lifting' ? 0 : 1,
        }}
      />
      {/* A thin signal-teal rim on the leading edge while it sweeps. */}
      {phase === 'sweeping' && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${origin.x}% ${origin.y}%, transparent 0%, transparent 95%, ${GLOW}66 100%)`,
            animation: `vurmz-door-rim ${SWEEP_MS}ms cubic-bezier(0.65, 0, 0.35, 1) forwards`,
          }}
        />
      )}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: phase === 'holding' ? 1 : 0, transition: 'opacity 300ms ease 100ms' }}
      >
        <p className="font-mono text-[11px] tracking-[0.35em] uppercase" style={{ color: GLOW }}>The reserve</p>
      </div>
    </div>
  )
}

/** A link that walks through the door. A real href underneath. */
export function DoorLink({ href, className = '', children, ...rest }: React.ComponentProps<typeof Link> & { href: string }) {
  return (
    <Link
      {...rest}
      href={href}
      className={className}
      onClick={e => {
        rest.onClick?.(e)
        if (e.defaultPrevented) return
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        e.preventDefault()
        openDoor(href, { x: e.clientX, y: e.clientY })
      }}
    >
      {children}
    </Link>
  )
}
