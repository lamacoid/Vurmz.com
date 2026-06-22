import Link from 'next/link'
import { listProducts } from '@/lib/db/repos/products'
import { getMediaByIds } from '@/lib/db/repos/media'
import { money } from '@/lib/format'
import GlassImage from '@/components/shop/GlassImage'

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
            {heading && <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight">{heading}</h2>}
            {subheading && <p className="text-sm text-[var(--ink-soft)] mt-1">{subheading}</p>}
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map(p => {
            const heroUrl = p.heroMediaId ? mediaById.get(p.heroMediaId)?.url ?? null : null
            return (
              <Link
                key={p.id}
                href={`/shop/p/${p.slug}`}
                className="group bg-[var(--surface)] backdrop-blur-xl border border-[var(--hairline)] rounded-sm overflow-hidden hover:border-[#C67A6F]/40 hover:bg-[var(--surface)] transition-colors"
              >
                <div className="aspect-square relative overflow-hidden">
                  {heroUrl ? (
                    <GlassImage src={heroUrl} alt={p.name} depth="product" plain className="absolute inset-0" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--ink-soft)] text-xs">No photo</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-[var(--ink)] truncate">{p.name}</p>
                  <p className="text-[11px] text-[var(--ink-soft)] mt-0.5 line-clamp-2">{p.shortDescription || `Pack of ${p.packSize}`}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-[#C67A6F]">{money(p.priceCents)}</span>
                    {p.madeToOrder ? (
                      <span className="text-[9px] uppercase tracking-wider text-[var(--ink-soft)] bg-[var(--surface)] px-1.5 py-0.5 rounded-sm">
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
