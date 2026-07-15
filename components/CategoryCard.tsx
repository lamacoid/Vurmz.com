'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChatBubbleLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { getSmsLink } from '@/lib/site-info'
import { trackEvent } from '@/lib/track'
import { CATALOG, SIGNATURE } from '@/lib/pricing'
import type { ShopCategory } from '@/lib/categories'
import GlassImage from '@/components/shop/GlassImage'

interface CategoryCardProps {
  category: ShopCategory
  compact?: boolean
}

// Switches explicitly on pricingKey rather than duck-typing the CATALOG
// entry's shape, so a field rename in lib/pricing.ts can't silently break
// this (a missing case here is a visible blank price, not a wrong one).
function getPrice(cat: ShopCategory): { price: string; note: string } {
  if (cat.pricingType === 'signature') {
    return { price: `Starting at $${SIGNATURE.startingAt}`, note: 'Custom engraving' }
  }
  switch (cat.pricingKey) {
    case 'knife':
      return { price: `$${CATALOG.knife.base}/knife`, note: 'Bring your own blade' }
    case 'tool':
      return { price: `$${CATALOG.tool.base}/piece`, note: `${CATALOG.tool.minimum} piece minimum` }
    case 'pens':
      return { price: `From $${CATALOG.pens.perItem[0]}/pen`, note: `Packs of ${CATALOG.pens.pack} · singles in shop` }
    case 'cards':
      return { price: `From $${CATALOG.cards.matteBlackBase}/card`, note: `Packs of ${CATALOG.cards.pack} · singles in shop` }
    case 'coasters': {
      const vals = CATALOG.coasters.materials.map(m => m.price)
      return { price: `$${Math.min(...vals)}–$${Math.max(...vals)}/ea`, note: `Packs of ${CATALOG.coasters.pack}` }
    }
    case 'keychains': {
      const vals = CATALOG.keychains.materials.map(m => m.price)
      return { price: `$${Math.min(...vals)}–$${Math.max(...vals)}/ea`, note: `Packs of ${CATALOG.keychains.pack}` }
    }
    default:
      return { price: `Starting at $${SIGNATURE.startingAt}`, note: '' }
  }
}

export default function CategoryCard({ category: cat, compact }: CategoryCardProps) {
  const { price, note } = getPrice(cat)

  if (compact) {
    return (
      <Link
        href={`/shop/${cat.slug}`}
        className="group block bg-[var(--surface)] backdrop-blur-xl border border-[var(--hairline)] rounded-sm overflow-hidden hover:border-[#C67A6F]/40 transition-all duration-300 puffy"
      >
        <div className="aspect-[16/9] relative overflow-hidden">
          {cat.heroImage ? (
            <GlassImage src={cat.heroImage} alt={cat.name} depth="card" sizes="(max-width: 640px) 100vw, 33vw" className="absolute inset-0" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)]">
              <span className="text-[var(--ink-soft)] text-xs font-mono">Photo coming soon</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm font-bold text-[var(--ink)] relief-raised">{cat.name}</h3>
          <span className="text-[#C67A6F] font-bold text-xs">{price}</span>
        </div>
      </Link>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative bg-[var(--surface)] backdrop-blur-xl border border-[var(--hairline)] rounded-sm overflow-hidden hover:border-[#C67A6F]/40 hover:bg-[var(--surface)] transition-all duration-300 puffy"
    >
      <Link href={`/shop/${cat.slug}`}>
        <div className="aspect-[4/3] relative overflow-hidden">
          {cat.heroImage ? (
            <GlassImage src={cat.heroImage} alt={cat.name} depth="card" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="absolute inset-0" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)]">
              <span className="text-[var(--ink-soft)] text-sm font-mono">Photo coming soon</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/shop/${cat.slug}`}>
          <h3 className="text-lg font-bold text-[var(--ink)] mb-1.5 group-hover:text-[#C67A6F] transition-colors relief-raised">{cat.name}</h3>
        </Link>
        <p className="text-[var(--ink-soft)] text-sm leading-relaxed mb-2 relief-etched">{cat.tagline}</p>
        {cat.cardDescription && (
          <p className="text-[var(--ink-soft)] text-sm leading-relaxed mb-4 relief-etched">{cat.cardDescription}</p>
        )}
        {cat.serviceLink && (
          <Link
            href={cat.serviceLink.href}
            className="inline-flex items-center gap-1 text-xs text-[#7FCFD4] font-mono tracking-wide hover:text-[var(--ink)] transition-colors mb-4"
          >
            {cat.serviceLink.label}
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[#C67A6F] font-bold text-sm">{price}</span>
            {note && <span className="text-[var(--ink-soft)] text-xs block mt-0.5 relief-etched">{note}</span>}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/shop/${cat.slug}`}
              className="inline-flex items-center gap-1 text-xs text-[var(--ink-soft)] font-semibold px-3 py-1.5 border border-[var(--hairline)] hover:border-[#C67A6F]/40 hover:text-[var(--ink)] transition-colors puffy-btn"
            >
              Details
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
            <a
              href={getSmsLink(cat.smsMessage)}
              onClick={() => trackEvent('sms_click', cat.slug)}
              className="inline-flex items-center gap-1 text-xs text-[#C67A6F] font-semibold px-3 py-1.5 border border-[#C67A6F]/30 hover:bg-[#C67A6F]/10 transition-colors puffy-btn"
            >
              <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
              Text
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
