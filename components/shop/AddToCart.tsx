'use client'
import { useState } from 'react'
import { useCart } from '@/lib/cart/store'

export default function AddToCart(props: {
  productId: string
  slug: string
  name: string
  priceCents: number
  packSize: number
  heroUrl: string | null
  oneOff?: boolean
}) {
  const { add, items } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const alreadyInCart = props.oneOff && items.some(i => i.productId === props.productId)

  function onAdd() {
    add(
      {
        productId: props.productId,
        slug: props.slug,
        name: props.name,
        priceCents: props.priceCents,
        packSize: props.packSize,
        heroUrl: props.heroUrl,
        oneOff: props.oneOff,
      },
      props.oneOff ? 1 : qty
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  if (props.oneOff) {
    return (
      <button
        onClick={onAdd}
        disabled={alreadyInCart}
        className="w-full sm:w-auto inline-flex items-center justify-center px-6 h-11 bg-[#B16558] hover:bg-[#954E44] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-sm transition-colors"
      >
        {alreadyInCart ? 'Already in cart' : added ? 'Added ✓' : 'Add to cart'}
      </button>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="inline-flex items-center bg-white/60 border border-[#243B39]/12 rounded-sm">
        <button
          onClick={() => setQty(q => Math.max(1, q - 1))}
          className="px-3 py-2.5 text-[#6B6259] hover:text-[#243B39]"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="min-w-[2.5rem] text-center text-sm font-semibold">{qty}</span>
        <button
          onClick={() => setQty(q => q + 1)}
          className="px-3 py-2.5 text-[#6B6259] hover:text-[#243B39]"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        onClick={onAdd}
        className="flex-1 inline-flex items-center justify-center px-6 h-11 bg-[#B16558] hover:bg-[#954E44] text-white text-sm font-semibold rounded-sm transition-colors"
      >
        {added ? 'Added ✓' : 'Add to cart'}
      </button>
    </div>
  )
}
