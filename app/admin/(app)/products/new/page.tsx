'use client'
import ProductForm, { type ProductDraft } from '@/components/admin/ProductForm'

const empty: ProductDraft = {
  slug: '',
  name: '',
  shortDescription: '',
  description: '',
  categoryId: null,
  audience: 'shop',
  priceCents: 0,
  packSize: 1,
  isPublished: false,
  madeToOrder: false,
  leadTimeDays: 0,
  weightGrams: 0,
  heroMediaId: null,
  metadata: {},
}

export default function NewProductPage() {
  return <ProductForm initial={empty} />
}
