import type { BlockPropsMap } from '../types'

export default function Hero({ props }: { props: BlockPropsMap['Hero'] }) {
  const alignment = props.alignment ?? 'left'
  const textAlign = alignment === 'center' ? 'text-center items-center' : 'text-left items-start'
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {props.background?.url && (
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{ backgroundImage: `url(${props.background.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          aria-hidden
        />
      )}
      <div className={`max-w-5xl mx-auto px-6 flex flex-col gap-5 ${textAlign}`}>
        {props.eyebrow && (
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-[color:var(--t-teal-primary,#6BB8B2)]">
            {props.eyebrow}
          </p>
        )}
        <h1 className="text-3xl sm:text-5xl font-bold leading-tight text-[color:var(--t-text-heading,#F0E6D3)]">
          {props.title}
        </h1>
        {props.subtitle && (
          <p className="text-lg text-[color:var(--t-text-body,#9CA3AF)] max-w-2xl">
            {props.subtitle}
          </p>
        )}
        {props.ctas && props.ctas.length > 0 && (
          <div className={`flex flex-wrap gap-3 mt-4 ${alignment === 'center' ? 'justify-center' : ''}`}>
            {props.ctas.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target={c.newTab ? '_blank' : undefined}
                rel={c.newTab ? 'noreferrer' : undefined}
                className={
                  c.variant === 'secondary'
                    ? 'inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-sm bg-[color:var(--t-cream,#F0E6D3)] text-[color:var(--t-bg,#1a2f2e)] hover:opacity-90 transition'
                    : c.variant === 'ghost'
                    ? 'inline-flex items-center px-5 py-2.5 text-sm font-semibold text-[color:var(--t-teal-primary,#6BB8B2)] hover:underline'
                    : 'inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-sm bg-[color:var(--t-coral-cta,#C46B4D)] text-white hover:opacity-90 transition'
                }
              >
                {c.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
