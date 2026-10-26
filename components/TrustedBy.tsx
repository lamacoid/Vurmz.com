import Image from 'next/image'

interface TrustedByProps {
  /** Kept for callers; every page sits on the one paper ground now. */
  theme?: 'landing' | 'shop' | 'services'
}

// Four names, set quietly in ink. The SVG logo uses currentColor so it takes
// the same ink as the text link beside it.
export default function TrustedBy(_: TrustedByProps) {
  return (
    <div className="text-center">
      <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.2em] uppercase mb-5 text-[var(--eyebrow)]">
        Trusted by
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:gap-x-16 text-[var(--ink)]">
        <a
          href="https://www.nordstrom.com/store-details/nordstrom-cherry-creek-shopping-center"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-[length:var(--step-row)] font-medium opacity-70 hover:opacity-100 transition-opacity duration-[var(--t-hover)]"
        >
          Nordstrom Beauty
        </a>
        <a
          href="https://coloradowolverinesbjj.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-[var(--t-hover)]"
        >
          <Image
            src="/images/clients/colorado-wolverines.png"
            alt="Colorado Wolverines"
            width={56}
            height={56}
            className="h-12 w-auto"
          />
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
        {/* No site to link to. In dark mode the charcoal mark drops to a
            one-tone light silhouette so it still reads on the deep teal. */}
        <span className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-[var(--t-hover)]">
          <Image
            src="/images/clients/integrity-backflow.png"
            alt="Integrity Backflow"
            width={67}
            height={48}
            className="h-12 w-auto dark:brightness-0 dark:invert"
          />
        </span>
      </div>
    </div>
  )
}
