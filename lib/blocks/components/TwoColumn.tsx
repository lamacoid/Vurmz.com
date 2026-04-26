/* eslint-disable @next/next/no-img-element */
import type { BlockPropsMap } from '../types'
import RichText from './RichText'

const alignments: Record<'top' | 'center' | 'bottom', string> = {
  top: 'items-start',
  center: 'items-center',
  bottom: 'items-end',
}

function Side({ side }: { side: BlockPropsMap['TwoColumn']['left'] }) {
  if (side.kind === 'image' && side.media?.url) {
    return (
      <img
        src={side.media.url}
        alt={side.media.alt ?? ''}
        className="w-full h-auto rounded-md object-cover"
      />
    )
  }
  if (side.kind === 'text' && side.markdown) {
    return <RichText props={{ markdown: side.markdown, maxWidth: 'wide' }} />
  }
  return null
}

export default function TwoColumn({ props }: { props: BlockPropsMap['TwoColumn'] }) {
  return (
    <section className="py-12">
      <div className={`max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 ${alignments[props.verticalAlign ?? 'center']}`}>
        <div><Side side={props.left} /></div>
        <div><Side side={props.right} /></div>
      </div>
    </section>
  )
}
