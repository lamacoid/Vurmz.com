import Image from 'next/image'

interface TrustedByProps {
  /** Kept for callers; every page sits on the one paper ground now. */
  theme?: 'landing' | 'shop' | 'services'
}

// Two names, set quietly in ink. The SVG logo uses currentColor so it takes
// the same ink as the text link beside it.
export default function TrustedBy(_: TrustedByProps) {
  return (
    <div className="text-center">
      <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.2em] uppercase mb-5 text-[var(--eyebrow)]">
        Trusted by
      </p>
      <div className="flex items-center justify-center gap-12 sm:gap-16 text-[var(--ink)]">
        <a
          href="https://www.nordstrom.com/store-details/nordstrom-cherry-creek-shopping-center"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-[length:var(--step-row)] font-medium opacity-70 hover:opacity-100 transition-opacity duration-[var(--t-hover)]"
        >
          Nordstrom Beauty
        </a>
        <a
          href="http://countylineguitaramps.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-[var(--t-hover)]"
        >
          <Image
            src="/images/clients/county-line-guitar-amps.svg"
            alt="County Line Guitar Amps"
            width={120}
            height={36}
          />
        </a>
      </div>
    </div>
  )
}
