'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChatBubbleLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { getSmsLink } from '@/lib/site-info'
import { trackEvent } from '@/lib/track'
import { BASIC, SIGNATURE } from '@/lib/pricing'
import type { ShopCategory } from '@/lib/categories'

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
        className="group block bg-aub-cream-warm border border-aub-rule overflow-hidden hover:border-aub-burgundy/40 transition-all duration-300"
      >
        <div className="aspect-[16/9] bg-aub-cream-deep relative overflow-hidden">
          {cat.heroImage ? (
            <Image src={cat.heroImage} alt={cat.name} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" sizes="(max-width: 640px) 100vw, 33vw" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="aub-label">Photo coming soon</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-aub-display text-aub-burgundy text-base">{cat.name}</h3>
          <span className="font-aub-smallcaps text-[10px] text-aub-ochre">{price}</span>
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
      className="
        group relative bg-aub-cream-warm
        border border-aub-rule
        ring-1 ring-aub-rule
        overflow-hidden
        shadow-[0_1px_0_rgba(42,26,20,0.05),0_8px_24px_-14px_rgba(42,26,20,0.18)]
        hover:border-aub-burgundy/40 hover:shadow-[0_1px_0_rgba(42,26,20,0.05),0_12px_30px_-12px_rgba(122,46,42,0.22)]
        transition-all duration-300
      "
    >
      <Link href={`/shop/${cat.slug}`}>
        <div className="relative aspect-[4/3] bg-aub-cream-deep overflow-hidden">
          {/* image with inset mat effect */}
          <div className="absolute inset-2 ring-1 ring-aub-rule overflow-hidden">
            {cat.heroImage ? (
              <Image src={cat.heroImage} alt={cat.name} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-aub-cream-deep">
                <span className="aub-label">Photo coming soon</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="px-5 pt-4 pb-5">
        <Link href={`/shop/${cat.slug}`}>
          <h3 className="font-aub-display text-aub-burgundy text-xl leading-tight mb-1 group-hover:text-aub-burgundy-dk transition-colors">
            {cat.name}
          </h3>
        </Link>
        <p className="font-aub-body text-aub-ink-soft text-[14px] leading-relaxed mb-4">
          {cat.tagline}
        </p>

        <div className="flex items-end justify-between gap-3 pt-3 border-t border-aub-rule">
          <div>
            <span className="font-aub-smallcaps text-[10px] text-aub-ochre">{price}</span>
            {note && (
              <span className="block font-aub-body italic text-aub-mute text-[12px] mt-0.5">{note}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href={`/shop/${cat.slug}`}
              className="inline-flex items-center gap-1 font-aub-smallcaps text-[10px] text-aub-ink-soft px-3 py-1.5 border border-aub-rule hover:border-aub-burgundy/40 hover:text-aub-burgundy transition-colors"
            >
              Details
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
            <a
              href={getSmsLink(cat.smsMessage)}
              onClick={() => trackEvent('sms_click', cat.slug)}
              className="inline-flex items-center gap-1 font-aub-smallcaps text-[10px] text-aub-cream-warm px-3 py-1.5 bg-aub-burgundy hover:bg-aub-burgundy-dk transition-colors"
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
