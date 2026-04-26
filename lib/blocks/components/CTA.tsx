import type { BlockPropsMap } from '../types'

const surfaces: Record<'teal' | 'coral' | 'cream', string> = {
  teal: 'bg-[color:var(--t-bg-alt,#243B39)] text-[color:var(--t-cream,#F0E6D3)]',
  coral: 'bg-[color:var(--t-coral-cta,#C46B4D)] text-white',
  cream: 'bg-[color:var(--t-cream,#F0E6D3)] text-[color:var(--t-bg,#1a2f2e)]',
}

export default function CTA({ props }: { props: BlockPropsMap['CTA'] }) {
  return (
    <section className="py-12">
      <div className={`max-w-4xl mx-auto px-6 py-10 rounded-md ${surfaces[props.style ?? 'teal']}`}>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">{props.title}</h2>
        {props.body && <p className="text-base opacity-90 mb-6 max-w-2xl">{props.body}</p>}
        <div className="flex flex-wrap gap-3">
          {props.links.map((l, i) => (
            <a
              key={i}
              href={l.href}
              target={l.newTab ? '_blank' : undefined}
              rel={l.newTab ? 'noreferrer' : undefined}
              className="inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-sm bg-white/10 hover:bg-white/20 transition"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
