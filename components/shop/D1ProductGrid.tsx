/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { listProducts } from '@/lib/db/repos/products'
import { getMediaByIds } from '@/lib/db/repos/media'
import { money } from '@/lib/format'

interface Props {
  categoryId?: string
  limit?: number
  heading?: string
  subheading?: string
  audience?: 'shop_visible' | 'services_visible'
}

export default async function D1ProductGrid({ categoryId, limit = 24, heading, subheading, audience = 'shop_visible' }: Props) {
  const products = await listProducts({ categoryId, limit, includeUnpublished: false, audience })
  if (products.length === 0) return null

  const heroIds = products.map(p => p.heroMediaId).filter(Boolean) as string[]
  const mediaById = await getMediaByIds(heroIds)

  return (
    <section className="pb-10 sm:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {(heading || subheading) && (
          <div className="mb-6">
            {heading && <h2 className="text-2xl sm:text-3xl font-bold text-[#243B39] tracking-tight">{heading}</h2>}
            {subheading && <p className="text-sm text-[#6B6259] mt-1">{subheading}</p>}
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map(p => {
            const heroUrl = p.heroMediaId ? mediaById.get(p.heroMediaId)?.url ?? null : null
            return (
              <Link
                key={p.id}
                href={`/shop/p/${p.slug}`}
                className="group bg-white/60 border border-[#243B39]/10 rounded-sm overflow-hidden hover:border-[#B16558]/40 transition-colors"
              >
                <div className="aspect-square bg-[#F0E6D3] overflow-hidden">
                  {heroUrl ? (
                    <img src={heroUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#6B6259]/40 text-xs">No photo</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-[#243B39] truncate">{p.name}</p>
                  <p className="text-[11px] text-[#6B6259] mt-0.5 line-clamp-2">{p.shortDescription || `Pack of ${p.packSize}`}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-[#B16558]">{money(p.priceCents)}</span>
                    {p.madeToOrder ? (
                      <span className="text-[9px] uppercase tracking-wider text-[#6B6259] bg-[#243B39]/6 px-1.5 py-0.5 rounded-sm">
                        {p.leadTimeDays > 0 ? `${p.leadTimeDays}d` : 'MTO'}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
