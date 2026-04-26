'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

interface PortfolioItem {
  src: string
  label: string
  context?: string
}

interface PortfolioPreviewProps {
  items: PortfolioItem[]
  theme: 'shop' | 'services' | 'landing'
  linkTo?: string
  linkLabel?: string
}

export default function PortfolioPreview({ items, theme, linkTo, linkLabel = 'See the full portfolio' }: PortfolioPreviewProps) {
  const linkColor = theme === 'shop' ? 'text-[#B16558]' : 'text-vurmz-teal'

  return (
    <div>
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {items.slice(0, 4).map((item) => (
          <div key={item.src} className="group relative aspect-square rounded-sm overflow-hidden">
            <Image
              src={item.src}
              alt={item.label}
              fill
              className="object-cover group-hover:scale-[1.05] transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end p-3">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-semibold">{item.label}</p>
                {item.context && <p className="text-white/70 text-xs mt-0.5">{item.context}</p>}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
      {linkTo && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link href={linkTo} className={`inline-flex items-center gap-2 ${linkColor} font-semibold text-sm hover:gap-3 transition-all`}>
            {linkLabel}
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}
