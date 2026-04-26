/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import AddToCart from '@/components/shop/AddToCart'
import { getProductBySlug, getCategoryById } from '@/lib/db/repos/products'
import { getMediaById } from '@/lib/db/repos/media'

export const runtime = 'edge'

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || !product.isPublished) return notFound()

  const [category, hero] = await Promise.all([
    product.categoryId ? getCategoryById(product.categoryId) : null,
    product.heroMediaId ? getMediaById(product.heroMediaId) : null,
  ])

  const price = (product.priceCents / 100).toFixed(2)

  return (
    <div className="bg-[#F0E6D3] text-[#243B39] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <Breadcrumbs
          items={[
            { label: 'VURMZ', href: '/' },
            { label: 'Shop', href: '/shop' },
            ...(category ? [{ label: category.name, href: `/shop/${category.slug}` }] : []),
            { label: product.name },
          ]}
          theme="shop"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
          <div className="aspect-square bg-white/60 border border-[#243B39]/10 rounded-sm overflow-hidden">
            {hero?.url ? (
              <img src={hero.url} alt={hero.altText || product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#6B6259] text-sm">No image yet</div>
            )}
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-3">{product.name}</h1>
            {product.shortDescription && (
              <p className="text-[#6B6259] text-base leading-relaxed mb-5">{product.shortDescription}</p>
            )}

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold text-[#B16558]">${price}</span>
              <span className="text-sm text-[#6B6259]">pack of {product.packSize}</span>
            </div>

            {product.madeToOrder && product.leadTimeDays > 0 && (
              <div className="inline-flex items-center gap-2 text-xs bg-[#243B39]/6 text-[#243B39] px-3 py-1.5 rounded-sm mb-6">
                Made to order · ready in {product.leadTimeDays} {product.leadTimeDays === 1 ? 'day' : 'days'}
              </div>
            )}

            <AddToCart
              productId={product.id}
              slug={product.slug}
              name={product.name}
              priceCents={product.priceCents}
              packSize={product.packSize}
              heroUrl={hero?.url ?? null}
            />

            {product.description && (
              <div className="mt-10 pt-8 border-t border-[#243B39]/10">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6B6259] mb-3">Details</h2>
                <div className="prose prose-sm text-[#243B39]/90 whitespace-pre-wrap">{product.description}</div>
              </div>
            )}

            <div className="mt-10 text-xs text-[#6B6259]">
              Questions? <Link href="/shop/contact" className="text-[#B16558] hover:underline">Get in touch</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
