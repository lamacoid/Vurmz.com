import Image from 'next/image'

interface TrustedByProps {
  /** Kept for callers; every page sits on the one paper ground now. */
  theme?: 'landing' | 'shop' | 'services'
  /**
   * What the band sits on. Logos are shown as one-tone silhouettes:
   * light on the teal room band, ink on paper. An SVG loaded through an
   * img tag cannot inherit currentColor, so the filter does the work.
   */
  ground?: 'room' | 'paper'
}

// Four names, set quietly in one tone. Order: County Line, Integrity
// Backflow, Nordstrom, the Wolverines.
export default function TrustedBy({ ground = 'room' }: TrustedByProps) {
  const mark = ground === 'room' ? 'brightness-0 invert' : 'brightness-0'
  const text = 'flex-shrink-0 text-[length:var(--step-row)] font-medium opacity-70 hover:opacity-100 transition-opacity duration-[var(--t-hover)]'
  const logo = 'flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-[var(--t-hover)]'
  return (
    <div className="text-center">
      <p className="text-[length:var(--step-eyebrow)] font-mono tracking-[0.2em] uppercase mb-5 text-[var(--eyebrow)]">
        People I&apos;ve worked for
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:gap-x-16 text-[var(--ink)]">
        <a href="http://countylineguitaramps.com" target="_blank" rel="noopener noreferrer" className={logo}>
          <Image
            src="/images/clients/county-line-guitar-amps.svg"
            alt="County Line Guitar Amps"
            width={120}
            height={36}
            className={mark}
          />
        </a>
        {/* No site to link to. */}
        <span className={logo}>
          <Image
            src="/images/clients/integrity-backflow.png"
            alt="Integrity Backflow"
            width={67}
            height={48}
            className={`h-12 w-auto ${mark}`}
          />
        </span>
        <a
          href="https://www.nordstrom.com/store-details/nordstrom-cherry-creek-shopping-center"
          target="_blank"
          rel="noopener noreferrer"
          className={text}
        >
          Nordstrom Beauty
        </a>
        <a href="https://coloradowolverinesbjj.com" target="_blank" rel="noopener noreferrer" className={logo}>
          <Image
            src="/images/clients/colorado-wolverines.png"
            alt="Colorado Wolverines"
            width={56}
            height={56}
            className={`h-12 w-auto ${mark}`}
          />
        </a>
      </div>
    </div>
  )
}
