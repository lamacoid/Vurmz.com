'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { openDoor } from '@/components/BackRoomDoor'
import VurmzLogo from '@/components/VurmzLogo'

/**
 * The door to the reserve. A big frosted glass box on the oatmeal shop page,
 * the old VURMZ glass with a portfolio photo behind it. It is one button:
 * click, the frost clears, and the page moves forward into the teal room.
 * A real link underneath, so keyboards, crawlers, and middle clicks still work.
 */
export default function ReserveDoor() {
  const [opening, setOpening] = useState(false)

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
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/15" aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden />

          {/* The wordmark alone on the glass. */}
          <div className={`relative flex h-full min-h-[320px] sm:min-h-[400px] flex-col items-center justify-center text-center px-6 py-10 transition-opacity duration-500 ${opening ? 'opacity-0' : 'opacity-100'}`}>
            <VurmzLogo className="h-12 sm:h-16" color="#F3EEE2" />
            <p className="mt-5 text-[length:var(--step-eyebrow)] font-mono tracking-[0.3em] uppercase text-[#7FCFD4]">
              The reserve
            </p>
          </div>
        </Link>
      </div>
    </section>
  )
}
