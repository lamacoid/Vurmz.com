'use client'
/* eslint-disable @next/next/no-img-element */

import Image from 'next/image'

export type GlassDepth = 'hero' | 'card' | 'product'

interface GlassImageProps {
  src: string
  alt: string
  /**
   * How deep behind the glass the photo sits.
   *  - hero    → deepest: heavy teal film + soft blur (the rotating-background look)
   *  - card    → mid: teal-kissed, clears toward the photo on hover
   *  - product → lightest: enough tint to stay on-brand, detail still reads
   */
  depth?: GlassDepth
  priority?: boolean
  sizes?: string
  /** Use a plain <img> for remote/D1 media URLs instead of next/image. */
  plain?: boolean
  /** Extra classes on the wrapper (e.g. aspect ratio, rounding). */
  className?: string
}

// Literal class strings (no dynamic concatenation) so Tailwind JIT keeps them.
const STYLES: Record<GlassDepth, { film: string; img: string }> = {
  hero: {
    film: 'opacity-[0.50]',
    img: 'blur-[2px] scale-[1.05]',
  },
  card: {
    film: 'opacity-[0.42] group-hover:opacity-[0.14]',
    img: 'group-hover:scale-[1.04]',
  },
  product: {
    film: 'opacity-[0.24] group-hover:opacity-[0.08]',
    img: 'group-hover:scale-[1.03]',
  },
}

/**
 * A photo seen through layers of frosted teal glass — the VURMZ signature.
 * Place inside a `group` ancestor to get the hover "clear the glass" effect.
 */
export default function GlassImage({
  src,
  alt,
  depth = 'card',
  priority,
  sizes,
  plain,
  className = '',
}: GlassImageProps) {
  const s = STYLES[depth]

  return (
    <div className={`relative overflow-hidden bg-[#1c474e] ${className}`}>
      {/* The photo */}
      {plain ? (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-out ${s.img}`}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover transition-transform duration-[800ms] ease-out ${s.img}`}
        />
      )}

      {/* Frosted teal film — the tint of the glass */}
      <div
        className={`absolute inset-0 bg-[#1c474e] transition-opacity duration-500 ${s.film}`}
        aria-hidden
      />

      {/* Surface sheen — the light catching the top of the glass */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.12] via-transparent to-[#1c474e]/20"
        aria-hidden
      />

      {/* Glass edge */}
      <div
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
        aria-hidden
      />
    </div>
  )
}
