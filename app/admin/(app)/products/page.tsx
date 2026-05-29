'use client'
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Icon } from '@/components/admin/icons'

interface Product {
  id: string
  slug: string
  name: string
  shortDescription: string
  priceCents: number
  packSize: number
  isPublished: boolean
  madeToOrder: boolean
  leadTimeDays: number
  position: number
  categoryId: string | null
  heroMediaId: string | null
  audience: 'shop' | 'services' | 'both'
  oneOff: boolean
  soldAt: string | null
}
interface Category { id: string; slug: string; name: string }
interface MediaItem { id: string; url: string; altText: string }

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

function Row({ product, media, onToggle }: { product: Product; media: Map<string, MediaItem>; onToggle: (id: string, isPublished: boolean) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  const hero = product.heroMediaId ? media.get(product.heroMediaId) : null
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-3 bg-[#235158] border border-white/5 hover:border-[#6BB8B2]/20 rounded-lg px-3 py-2.5 transition-colors"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-gray-600 hover:text-cream"
        aria-label="Drag to reorder"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
          <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
        </svg>
      </button>
      <div className="w-11 h-11 rounded-md bg-[#1c474e] overflow-hidden flex-shrink-0 border border-white/5">
        {hero ? <img src={hero.url} alt="" className="w-full h-full object-cover" /> : (
          <div className="w-full h-full flex items-center justify-center text-gray-600"><Icon name="image" className="w-4 h-4" /></div>
        )}
      </div>
      <Link href={`/admin/products/${product.id}`} className="flex-1 min-w-0">
        <p className="text-sm font-medium text-cream truncate flex items-center gap-2">
          <span className="truncate">{product.name}</span>
          {product.oneOff && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider flex-shrink-0 ${
              product.soldAt
                ? 'bg-[#C46B4D]/20 text-[#C46B4D] border border-[#C46B4D]/30'
                : 'bg-[#F0E6D3]/15 text-[#F0E6D3] border border-[#F0E6D3]/20'
            }`}>
              {product.soldAt ? 'Sold' : 'One-off'}
            </span>
          )}
        </p>
        <p className="text-[11px] text-gray-500 truncate">
          {money(product.priceCents)}{!product.oneOff && ` · pack of ${product.packSize}`}
          {product.madeToOrder && ` · made to order (${product.leadTimeDays}d)`}
        </p>
      </Link>
      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
        product.audience === 'services'
          ? 'bg-[#6BB8B2]/15 text-[#6BB8B2]'
          : product.audience === 'both'
          ? 'bg-[#F0E6D3]/10 text-[#F0E6D3]'
          : 'bg-[#C46B4D]/15 text-[#C46B4D]'
      }`}>
        {product.audience === 'both' ? 'Both' : product.audience === 'services' ? 'Services' : 'Shop'}
      </span>
      <button
        onClick={() => onToggle(product.id, !product.isPublished)}
        className={`text-[11px] px-2 py-1 rounded-full font-medium ${
          product.isPublished
            ? 'bg-[#6BB8B2]/10 text-[#6BB8B2] border border-[#6BB8B2]/20'
            : 'bg-white/5 text-gray-500 border border-white/10'
        }`}
      >
        {product.isPublished ? 'Published' : 'Draft'}
      </button>
      <Link href={`/admin/products/${product.id}`} className="text-xs text-gray-400 hover:text-cream px-2">Edit</Link>
    </div>
  )
}

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [media, setMedia] = useState<Map<string, MediaItem>>(new Map())
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [audience, setAudience] = useState<'all' | 'shop' | 'services' | 'both'>('all')
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const [pj, cj, mj] = await Promise.all([
      fetch(`/api/admin/products?${filter !== 'all' ? `categoryId=${filter}&` : ''}${search ? `q=${encodeURIComponent(search)}` : ''}`).then(r => r.json()),
      fetch('/api/admin/categories').then(r => r.json()),
      fetch('/api/admin/media?limit=500').then(r => r.json()),
    ])
    const pjp = pj as { data?: { products: Product[] } }
    const cjp = cj as { data?: { categories: Category[] } }
    const mjp = mj as { data?: { items: MediaItem[] } }
    setProducts(pjp.data?.products ?? [])
    setCategories(cjp.data?.categories ?? [])
    const m = new Map<string, MediaItem>()
    for (const it of mjp.data?.items ?? []) m.set(it.id, it)
    setMedia(m)
    setLoading(false)
  }, [filter, search])

  useEffect(() => { load() }, [load])

  const filteredProducts = audience === 'all' ? products : products.filter(p => p.audience === audience)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIndex = products.findIndex(p => p.id === active.id)
    const newIndex = products.findIndex(p => p.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return
    const next = arrayMove(products, oldIndex, newIndex)
    setProducts(next)
    const items = next.map((p, i) => ({ id: p.id, position: (i + 1) * 100 }))
    await fetch('/api/admin/products/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
  }

  async function togglePublished(id: string, isPublished: boolean) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isPublished } : p))
    await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished }),
    })
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cream">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Your shop catalog. Drag to reorder.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 h-9 bg-[#C46B4D] hover:bg-[#AD5D42] text-white text-sm font-semibold rounded-md transition-colors"
        >
          <Icon name="plus" className="w-4 h-4" />
          New product
        </Link>
      </div>

      <div className="flex items-center gap-1 mb-3 bg-[#235158] border border-white/5 rounded-md p-1 w-fit">
        {(['all','shop','services','both'] as const).map(a => (
          <button
            key={a}
            onClick={() => setAudience(a)}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors capitalize ${
              audience === a ? 'bg-[#1c474e] text-cream' : 'text-gray-400 hover:text-cream'
            }`}
          >
            {a === 'all' ? 'All' : a === 'both' ? 'Both' : a === 'services' ? 'Services' : 'Shop'}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or slug…"
          className="flex-1 bg-[#235158] border border-white/5 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#6BB8B2]"
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="bg-[#235158] border border-white/5 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#6BB8B2]"
        >
          <option value="all">All categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading…</div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-[#235158] border border-white/5 rounded-xl p-10 text-center">
          <Icon name="tag" className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-cream text-sm font-semibold mb-1">No products yet</p>
          <p className="text-gray-500 text-xs mb-5">Add your first product — name, price, pack size, photo.</p>
          <Link href="/admin/products/new" className="inline-flex items-center gap-2 px-4 h-9 bg-[#C46B4D] hover:bg-[#AD5D42] text-white text-xs font-semibold rounded-md">
            <Icon name="plus" className="w-4 h-4" />
            New product
          </Link>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={filteredProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-1.5">
              {filteredProducts.map(p => (
                <Row key={p.id} product={p} media={media} onToggle={togglePublished} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
