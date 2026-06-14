import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { SHOP_CATEGORIES } from '@/lib/categories'

export default function ShopCategoryNotFound() {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-mono text-[#D96C5C] tracking-[0.25em] uppercase mb-4">Not Found</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#16525C] tracking-tight mb-4">
          That category doesn&apos;t exist.
        </h1>
        <p className="text-[#6B6259] text-base leading-relaxed mb-8">
          Here&apos;s what we do have:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {SHOP_CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="p-4 bg-white/60 border border-[#16525C]/8 rounded-sm hover:border-[#D96C5C]/20 transition-colors text-center"
            >
              <span className="text-sm font-semibold text-[#16525C]">{cat.shortName}</span>
            </Link>
          ))}
        </div>
        <Link href="/shop" className="inline-flex items-center gap-2 text-[#D96C5C] font-semibold text-sm hover:gap-3 transition-all">
          Back to Shop
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
