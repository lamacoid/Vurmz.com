'use client'
/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'

export interface GalleryImage {
  url: string
  alt: string
}

/**
 * Product photo gallery: the framed plate from the menu-card language,
 * plus a quiet thumbnail strip when there is more than one photo.
 */
export default function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [idx, setIdx] = useState(0)
  if (images.length === 0) return null
  const current = images[Math.min(idx, images.length - 1)]

  return (
    <div>
      {/* The framed plate. */}
      <div className="border border-[var(--ink)]/25 rounded-sm p-1.5">
        <div className="relative aspect-square rounded-sm overflow-hidden bg-[var(--page)]">
          <img
            src={current.url}
            alt={current.alt || name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-2 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Photo ${i + 1} of ${images.length}`}
              className={`relative aspect-square rounded-sm overflow-hidden border transition-colors ${
                i === idx ? 'border-[var(--eyebrow)]' : 'border-[var(--hairline)] hover:border-[var(--ink)]/40'
              }`}
            >
              <img src={img.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
