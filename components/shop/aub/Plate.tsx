/**
 * Plate — image framed like a botanical folio plate.
 * Ivory mat, hairline rule, small-caps label below in copperplate.
 */
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

type Props = {
  src: string
  alt: string
  label?: string
  caption?: string                    // e.g. "Specimen no. iv"
  href?: string
  aspect?: 'square' | 'portrait' | 'landscape'
  className?: string
}

export default function Plate({
  src,
  alt,
  label,
  caption,
  href,
  aspect = 'square',
  className = '',
}: Props) {
  const aspectClass =
    aspect === 'portrait'  ? 'aspect-[3/4]' :
    aspect === 'landscape' ? 'aspect-[4/3]' :
                             'aspect-square'

  const inner = (
    <figure className={`group ${className}`}>
      <div
        className="
          relative overflow-hidden
          p-3 sm:p-4
          bg-aub-cream-warm
          border border-aub-rule
          ring-1 ring-aub-rule
          shadow-[0_1px_0_rgba(42,26,20,0.05),0_8px_24px_-12px_rgba(42,26,20,0.18)]
        "
      >
        <div className={`relative ${aspectClass} overflow-hidden`}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      </div>
      {label && (
        <figcaption className="mt-3">
          <div className="aub-label">{label}</div>
        </figcaption>
      )}
    </figure>
  )

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 ring-aub-ochre">
        {inner}
      </Link>
    )
  }
  return inner
}
