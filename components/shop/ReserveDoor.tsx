'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { openDoor } from '@/components/BackRoomDoor'

/**
 * The door to the reserve. A big frosted glass box on the oatmeal shop page,
 * the old VURMZ glass with a portfolio photo behind it. It is one button:
 * click, the frost clears, and the page moves forward into the teal room.
 * A real link underneath, so keyboards, crawlers, and middle clicks still work.
 */
export default function ReserveDoor() {
  const [opening, setOpening] = useState(false)
  // The writing on the glass is driven here, not by :hover, so it runs the
  // same in every browser and clears the moment the pointer leaves.
  const [writing, setWriting] = useState(false)
  const display = { fontFamily: 'var(--font-display), Georgia, serif' }

  const open = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    if (opening) return
    setOpening(true)
    // The frost clears while the teal sweeps out from the click point.
    openDoor('/shop/reserve', { x: e.clientX, y: e.clientY })
  }

  return (
    <section className="pb-10 sm:pb-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/shop/reserve"
          onClick={open}
          onMouseEnter={() => setWriting(true)}
          onMouseLeave={() => setWriting(false)}
          onFocus={() => setWriting(true)}
          onBlur={() => setWriting(false)}
          aria-label="Step into the reserve"
          className={`group relative block overflow-hidden rounded-[var(--r-band)] border border-[#7FCFD4]/35 bg-[#123F47] text-[#DED6C3] min-h-[320px] sm:min-h-[400px] transition-transform ease-out ${opening ? 'duration-700 scale-[1.015]' : 'duration-500'}`}
        >
          {/* The photo, behind the glass */}
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
            <Image
              src="/portfolio/culinary-cleaver-engraved.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              quality={60}
              className={`object-cover transition-transform ease-out duration-[1200ms] ${opening ? 'scale-110' : 'scale-100'}`}
            />
            <div className="absolute inset-0 bg-[#123F47]/45" />
          </div>

          {/* The frost. Heavy at rest, thinner on hover, gone on click. */}
          <div
            className={`absolute inset-0 pointer-events-none backdrop-blur-xl transition-opacity ease-out ${opening ? 'opacity-0 duration-700' : 'opacity-100 duration-500'}`}
            style={{ background: 'linear-gradient(180deg, rgba(127,207,212,0.34) 0%, rgba(18,63,71,0.62) 100%)' }}
            aria-hidden
          />
          {/* Written in the frost on hover: a fingertip clears the glass in
              cursive, so the sharp photo shows through the letters. The same
              photo sits in the SVG, sized like object-cover, masked by text. */}
          <svg
            className={`pointer-events-none absolute inset-0 hidden sm:block h-full w-full transition-opacity duration-500 ${opening ? 'opacity-0' : 'opacity-100'}`}
            aria-hidden
            focusable="false"
          >
            <defs>
              <mask id="reserve-frost-writing" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
                <rect width="100%" height="100%" fill="black" />
                <text
                  x="7%"
                  y="86%"
                  fill="white"
                  fontSize="clamp(44px, 7vw, 76px)"
                  style={{ fontFamily: "'Allura', 'Brush Script MT', cursive" }}
                  transform="rotate(-5 120 300)"
                >
                  feelin fancy?
                </text>
              </mask>
            </defs>
            <g
              mask="url(#reserve-frost-writing)"
              style={{
                clipPath: writing ? 'inset(0 -4% 0 0)' : 'inset(0 100% 0 0)',
                transition: writing ? 'clip-path 1800ms ease-in-out' : 'clip-path 500ms ease-out',
              }}
            >
              <image
                href="/portfolio/culinary-cleaver-engraved.jpg"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid slice"
                style={{ filter: 'brightness(1.08) saturate(1.05)' }}
              />
              {/* A thin wet edge along the stroke, the way a finger leaves one */}
              <rect width="100%" height="100%" fill="rgba(255,255,255,0.10)" />
            </g>
          </svg>
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/15" aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden />

          {/* The words on the glass */}
          <div className={`relative flex h-full min-h-[320px] sm:min-h-[400px] flex-col items-center justify-center text-center px-6 py-10 transition-opacity duration-500 ${opening ? 'opacity-0' : 'opacity-100'}`}>
            <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.3em] uppercase text-[#7FCFD4] mb-4">
              The reserve
            </p>
            <p className="text-[length:var(--step-display)] leading-[1.05] text-white/95" style={display}>
              The back room.
            </p>
            <p className="mt-4 max-w-[44ch] text-[length:var(--step-lead)] leading-relaxed text-[#DED6C3]/85">
              Pieces found and marked to order, the laser brought to your table, the intricate work.
            </p>
            <span className="mt-7 inline-flex items-center gap-2 h-11 px-6 rounded-[var(--r-control)] border border-[#7FCFD4]/60 bg-[#7FCFD4]/10 text-[#DED6C3] text-[length:var(--step-body)] font-semibold group-hover:bg-[#7FCFD4]/20 transition-colors duration-[var(--t-hover)]">
              Step in
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}
