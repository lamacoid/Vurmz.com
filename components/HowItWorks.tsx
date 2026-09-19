import { DELIVERY, SIGNATURE } from '@/lib/pricing'

// The one "How it works". Home, shop, and about all render this, so the
// steps, the count, and the wording cannot drift between pages again.
const STEPS = [
  {
    h: 'Text me',
    p: `Send a photo of what you want engraved, or buy it ready from the shop. Your own piece is $${SIGNATURE.startingAt}.`,
  },
  {
    h: 'I make it',
    p: 'A number the same day. Most pieces are ready in 24 to 72 hours.'
  },
  {
    h: 'Hand-delivered',
    p: `Across the ${DELIVERY.area}, free over $${DELIVERY.freeThreshold}. Shipped if you are farther out.`,
  },
] as const

interface Props {
  /** `section` is the full-width paper block; `inline` sits inside a card. */
  variant?: 'section' | 'inline'
}

export default function HowItWorks({ variant = 'section' }: Props) {
  const grid = (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
      {STEPS.map((s, i) => (
        <div key={s.h}>
          <div className="w-9 h-9 rounded-full border-[1.5px] border-[var(--signal)] bg-[var(--glass)] flex items-center justify-center mb-3 mx-auto">
            <span className="text-[var(--ink)] font-mono text-[length:var(--step-row)]">{i + 1}</span>
          </div>
          <h3 className="text-[length:var(--step-lead)] text-[var(--ink)] mb-1">{s.h}</h3>
          <p className="text-[var(--ink-soft)] text-[length:var(--step-row)] leading-relaxed">{s.p}</p>
        </div>
      ))}
    </div>
  )

  if (variant === 'inline') {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
          <h2 className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.3em] uppercase text-[var(--eyebrow)]">How it works</h2>
          <span className="flex-1 border-t border-[var(--ink)]/20" aria-hidden />
        </div>
        {grid}
      </div>
    )
  }

  return (
    <section className="py-14 sm:py-[72px]">
      <div className="max-w-3xl mx-auto px-5 sm:px-11">
        <h2 className="text-[length:var(--step-section)] text-[var(--ink)] text-center mb-8">How it works</h2>
        {grid}
      </div>
    </section>
  )
}
