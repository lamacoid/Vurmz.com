import Image from 'next/image'

interface TrustedByProps {
  theme: 'landing' | 'shop' | 'services'
}

const themeStyles = {
  landing: { label: 'text-gray-500', linkText: 'text-cream/40 hover:text-cream/60', logoClass: 'opacity-40 brightness-0 invert', bg: '' },
  services: { label: 'text-gray-500', linkText: 'text-cream/40 hover:text-cream/60', logoClass: 'opacity-40 brightness-0 invert', bg: '' },
  shop: { label: 'text-[#7A7068]', linkText: 'text-[#16525C]/40 hover:text-[#16525C]/60', logoClass: 'opacity-30', bg: '' },
}

export default function TrustedBy({ theme }: TrustedByProps) {
  const styles = themeStyles[theme]

  return (
    <div className="text-center">
      <p className={`text-xs font-mono tracking-[0.2em] uppercase mb-5 ${styles.label}`}>
        Trusted by
      </p>
      <div className="flex items-center justify-center gap-12 sm:gap-16">
        <a
          href="https://www.nordstrom.com/store-details/nordstrom-cherry-creek-shopping-center"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-shrink-0 text-sm font-medium transition-colors ${styles.linkText}`}
        >
          Nordstrom Beauty
        </a>
        <a
          href="http://countylineguitaramps.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <Image
            src="/images/clients/county-line-guitar-amps.svg"
            alt="County Line Guitar Amps"
            width={120}
            height={36}
            className={styles.logoClass}
          />
        </a>
      </div>
    </div>
  )
}
