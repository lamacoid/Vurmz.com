'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import GlassImage from '@/components/shop/GlassImage'

interface Product {
  id: string
  slug: string
  name: string
  shortDescription: string
  priceCents: number
  packSize: number
  madeToOrder: boolean
  leadTimeDays: number
  heroUrl: string | null
}

interface Props {
  categorySlug?: string
  heading?: string
  subheading?: string
  limit?: number
}

export default function D1ProductGridClient({ categorySlug, heading, subheading, limit = 48 }: Props) {
  const [products, setProducts] = useState<Product[] | null>(null)

  useEffect(() => {
    const qs = new URLSearchParams()
    if (categorySlug) qs.set('category', categorySlug)
    qs.set('limit', String(limit))
    fetch(`/api/public/products?${qs.toString()}`)
      .then(r => r.json())
      .then(j => {
        const parsed = j as { data?: { products: Product[] } }
        setProducts(parsed.data?.products ?? [])
      })
      .catch(() => setProducts([]))
  }, [categorySlug, limit])

  if (products == null || products.length === 0) return null

  return (
    <section className="pb-10 sm:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {(heading || subheading) && (
          <div className="mb-6">
            {heading && <h2 className="text-2xl sm:text-3xl font-bold text-[#F0E6D3] tracking-tight">{heading}</h2>}
            {subheading && <p className="text-sm text-gray-400 mt-1">{subheading}</p>}
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map(p => (
            <Link
              key={p.id}
              href={`/shop/p/${p.slug}`}
              className="group bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-sm overflow-hidden hover:border-[#B16558]/40 hover:bg-white/[0.06] transition-colors"
            >
              <div className="aspect-square relative overflow-hidden">
                {p.heroUrl ? (
                  <GlassImage src={p.heroUrl} alt={p.name} depth="product" plain className="absolute inset-0" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No photo</div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-[#F0E6D3] truncate">{p.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{p.shortDescription || `Pack of ${p.packSize}`}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-[#B16558]">${(p.priceCents / 100).toFixed(2)}</span>
                  {p.madeToOrder ? (
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 bg-white/[0.06] px-1.5 py-0.5 rounded-sm">
                      {p.leadTimeDays > 0 ? `${p.leadTimeDays}d` : 'MTO'}
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
