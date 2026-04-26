/* eslint-disable @next/next/no-img-element */
import type { BlockPropsMap } from '../types'

const layouts: Record<'inset' | 'full-bleed' | 'narrow', string> = {
  inset: 'max-w-5xl mx-auto px-6',
  narrow: 'max-w-3xl mx-auto px-6',
  'full-bleed': 'w-full',
}

export default function ImageBlock({ props }: { props: BlockPropsMap['Image'] }) {
  if (!props.media?.url) return null
  return (
    <section className="py-8">
      <figure className={layouts[props.layout ?? 'inset']}>
        <img
          src={props.media.url}
          alt={props.media.alt ?? ''}
          className="w-full h-auto rounded-md"
        />
        {props.caption && (
          <figcaption className="mt-3 text-sm text-[color:var(--t-text-muted,#6B7280)] text-center">
            {props.caption}
          </figcaption>
        )}
      </figure>
    </section>
  )
}
