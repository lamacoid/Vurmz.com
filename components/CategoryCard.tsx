'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChatBubbleLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { getSmsLink } from '@/lib/site-info'
import { trackEvent } from '@/lib/track'
import { BASIC, SIGNATURE } from '@/lib/pricing'
import type { ShopCategory } from '@/lib/categories'
import GlassImage from '@/components/shop/GlassImage'

interface CategoryCardProps {
  category: ShopCategory
  compact?: boolean
}

function getPrice(cat: ShopCategory): { price: string; note: string } {
  if (cat.pricingType === 'signature') {
    return { price: `Starting at $${SIGNATURE.startingPrice}`, note: 'Custom engraving on your item' }
  }
  if (cat.pricingKey && cat.pricingKey in BASIC) {
    const data = BASIC[cat.pricingKey]
    if ('perKnife' in data) return { price: `$${data.perKnife}/knife`, note: 'Bring your own blade' }
    if ('materials' in data) {
      const vals = Object.values(data.materials) as number[]
      const low = Math.min(...vals)
      const high = Math.max(...vals)
      return { price: `$${low}–$${high}/ea`, note: `Packs of ${data.packSize}` }
    }
    if ('perPiece' in data) return { price: `$${data.perPiece}/piece`, note: `${data.minimum} piece minimum` }
  }
  return { price: `Starting at $${SIGNATURE.startingPrice}`, note: '' }
}

export default function CategoryCard({ category: cat, compact }: CategoryCardProps) {
  const { price, note } = getPrice(cat)

  if (compact) {
    return (
      <Link
        href={`/shop/${cat.slug}`}
        className="group block bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-sm overflow-hidden hover:border-[#B16558]/40 transition-all duration-300"
      >
        <div className="aspect-[16/9] relative overflow-hidden">
          {cat.heroImage ? (
            <GlassImage src={cat.heroImage} alt={cat.name} depth="card" sizes="(max-width: 640px) 100vw, 33vw" className="absolute inset-0" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
              <span className="text-gray-500 text-xs font-mono">Photo coming soon</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm font-bold text-[#F0E6D3]">{cat.name}</h3>
          <span className="text-[#B16558] font-bold text-xs">{price}</span>
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
      className="group relative bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-sm overflow-hidden hover:border-[#B16558]/40 hover:bg-white/[0.06] transition-all duration-300"
    >
      <Link href={`/shop/${cat.slug}`}>
        <div className="aspect-[4/3] relative overflow-hidden">
          {cat.heroImage ? (
            <GlassImage src={cat.heroImage} alt={cat.name} depth="card" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="absolute inset-0" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
              <span className="text-gray-500 text-sm font-mono">Photo coming soon</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/shop/${cat.slug}`}>
          <h3 className="text-lg font-bold text-[#F0E6D3] mb-1.5 group-hover:text-[#B16558] transition-colors">{cat.name}</h3>
        </Link>
        <p className="text-gray-400 text-sm leading-relaxed mb-2">{cat.tagline}</p>
        {cat.cardDescription && (
          <p className="text-gray-500 text-sm leading-relaxed mb-4">{cat.cardDescription}</p>
        )}
        {cat.serviceLink && (
          <Link
            href={cat.serviceLink.href}
            className="inline-flex items-center gap-1 text-xs text-[#6BB8B2] font-mono tracking-wide hover:text-[#F0E6D3] transition-colors mb-4"
          >
            {cat.serviceLink.label}
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[#B16558] font-bold text-sm">{price}</span>
            {note && <span className="text-gray-500 text-xs block mt-0.5">{note}</span>}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/shop/${cat.slug}`}
              className="inline-flex items-center gap-1 text-xs text-gray-300 font-semibold px-3 py-1.5 border border-white/15 rounded-sm hover:border-[#B16558]/40 hover:text-[#F0E6D3] transition-colors"
            >
              Details
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
            <a
              href={getSmsLink(cat.smsMessage)}
              onClick={() => trackEvent('sms_click', cat.slug)}
              className="inline-flex items-center gap-1 text-xs text-[#B16558] font-semibold px-3 py-1.5 border border-[#B16558]/30 rounded-sm hover:bg-[#B16558]/10 transition-colors"
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
