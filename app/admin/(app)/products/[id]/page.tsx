'use client'
export const runtime = 'edge'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProductForm, { type ProductDraft } from '@/components/admin/ProductForm'

interface ProductApi {
  id: string
  slug: string
  name: string
  shortDescription: string
  description: string
  categoryId: string | null
  audience: 'shop' | 'services' | 'both'
  priceCents: number
  packSize: number
  isPublished: boolean
  madeToOrder: boolean
  leadTimeDays: number
  weightGrams: number
  heroMediaId: string | null
  oneOff: boolean
  soldAt: string | null
  metadata: Record<string, unknown>
}

export default function EditProductPage() {
  const params = useParams<{ id: string }>()
  const [draft, setDraft] = useState<ProductDraft | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/admin/products/${params.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(j => {
        const parsed = j as { ok?: boolean; data?: { product: ProductApi } } | null
        if (!parsed?.ok || !parsed.data?.product) {
          setNotFound(true)
          return
        }
        const p = parsed.data.product
        setDraft({
          id: p.id,
          slug: p.slug,
          name: p.name,
          shortDescription: p.shortDescription ?? '',
          description: p.description,
          categoryId: p.categoryId,
          audience: p.audience ?? 'shop',
          priceCents: p.priceCents,
          packSize: p.packSize,
          isPublished: p.isPublished,
          madeToOrder: p.madeToOrder,
          leadTimeDays: p.leadTimeDays,
          weightGrams: p.weightGrams,
          heroMediaId: p.heroMediaId,
          oneOff: p.oneOff ?? false,
          soldAt: p.soldAt ?? null,
          metadata: p.metadata ?? {},
        })
      })
  }, [params?.id])

  if (notFound) return <div className="p-8 text-gray-400 text-sm">Product not found.</div>
  if (!draft) return <div className="p-8 text-gray-500 text-sm">Loading…</div>
  return <ProductForm initial={draft} />
}
