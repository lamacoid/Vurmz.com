'use client'
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react'
import { portfolioItems } from '@/lib/portfolio'

const IMAGES = portfolioItems.map((i) => ({ src: i.src, alt: i.label }))

/**
 * The rotating portfolio-photo backdrop behind the homepage hero — crossfades
 * through finished work behind a frosted teal film that dissolves into the
 * page's base color at the bottom. Client-only (timer); drop it as the first,
 * absolutely-positioned child of a `relative overflow-hidden` hero section.
 */
export default function RotatingHeroBg({ baseColor = '#16525C' }: { baseColor?: string }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
      {IMAGES.map((img, idx) => (
        <div
          key={img.src}
          className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
          style={{
            opacity: idx === i ? 0.4 : 0,
            filter: idx === i ? 'blur(0px)' : 'blur(8px)',
            transform: idx === i ? 'scale(1)' : 'scale(1.08)',
          }}
        >
          <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0" style={{ backgroundColor: `${baseColor}73` }} />
      {/* Top fade — dissolves the photo up into the page's base teal so it
          blends seamlessly into the nav area (which sits on the same color)
          instead of meeting it with a hard line. */}
      <div
        className="absolute top-0 left-0 right-0 h-1/3"
        style={{ background: `linear-gradient(to top, transparent 0%, ${baseColor} 88%)` }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{ background: `linear-gradient(to bottom, transparent 0%, ${baseColor} 90%)` }}
      />
    </div>
  )
}
