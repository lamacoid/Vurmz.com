'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { portfolioItems } from '@/lib/portfolio'

/**
 * The rotating backdrop behind the homepage hero. Crossfades through
 * finished work behind a film that fades into the page at top and bottom.
 * A slide can be a short muted clip instead of a photo (the laser on a
 * coaster, 2026-10-16): it plays while it is up, then the rotation moves
 * on. Photos hold five seconds, a clip holds its own length. With reduced
 * motion on, the clip shows its poster frame and nothing moves.
 */
type Slide = { kind: 'image'; src: string; alt: string } | { kind: 'video'; src: string; poster: string; alt: string; seconds: number }

const SLIDES: Slide[] = [
  { kind: 'video', src: '/video/three-willows-coaster.mp4', poster: '/video/three-willows-coaster.jpg', alt: 'The laser marking a slate coaster', seconds: 12 },
  ...portfolioItems.map((i): Slide => ({ kind: 'image', src: i.src, alt: i.label })),
]

export default function RotatingHeroBg() {
  const [i, setI] = useState(0)
  const [still, setStill] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    const cur = SLIDES[i]
    const hold = cur.kind === 'video' && !still ? cur.seconds * 1000 : 5000
    const t = setTimeout(() => setI(p => (p + 1) % SLIDES.length), hold)
    return () => clearTimeout(t)
  }, [i, still])

  // Play the clip only while it is the slide on top; rewind it when it leaves.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (SLIDES[i].kind === 'video' && !still) {
      v.currentTime = 0
      v.play().catch(() => { /* autoplay blocked: the poster stays up */ })
    } else {
      v.pause()
    }
  }, [i, still])

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
      {SLIDES.map((s, idx) => (
        <div
          key={s.src}
          className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
          style={{
            opacity: idx === i ? 0.4 : 0,
            filter: idx === i ? 'blur(0px)' : 'blur(8px)',
            transform: idx === i ? 'scale(1)' : 'scale(1.08)',
          }}
        >
          {s.kind === 'video' ? (
            <video
              ref={videoRef}
              src={s.src}
              poster={s.poster}
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image src={s.src} alt="" fill sizes="100vw" quality={55} priority={idx === 1} className="object-cover" />
          )}
        </div>
      ))}
      <div className="absolute inset-0" style={{ backgroundColor: 'var(--hero-film)' }} />
      {/* Top and bottom fades dissolve the banner into the page (the nav area
          above, the section below), so it blends at both edges in either mode. */}
      <div
        className="absolute top-0 left-0 right-0 h-20"
        style={{ background: 'linear-gradient(to top, transparent 0%, var(--hero-top) 70%)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, var(--hero-bottom) 70%)' }}
      />
    </div>
  )
}
