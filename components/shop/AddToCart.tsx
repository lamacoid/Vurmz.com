'use client'
import { useState } from 'react'
import { useCart } from '@/lib/cart/store'
import { fontOptions } from '@/lib/fonts'
import EngravingPicker, { type EngravingValue } from './EngravingPicker'

export default function AddToCart(props: {
  productId: string
  slug: string
  name: string
  priceCents: number
  packSize: number
  heroUrl: string | null
  oneOff?: boolean
  /** Whether this product can be personalized. Defaults to true. */
  engravable?: boolean
}) {
  const { add, items } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [engraving, setEngraving] = useState<EngravingValue>({ text: '', fontValue: 'kerf' })

  const engravable = props.engravable !== false
  const alreadyInCart = props.oneOff && items.some(i => i.productId === props.productId)
  const engText = engraving.text.trim()

  function buildMetadata(): Record<string, unknown> | undefined {
    if (!engravable || !engText) return undefined
    const font = fontOptions.find(f => f.value === engraving.fontValue)
    return {
      engraving: {
        text: engText.slice(0, 120),
        fontValue: engraving.fontValue,
        fontLabel: font?.label ?? engraving.fontValue,
      },
    }
  }

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
        metadata: buildMetadata(),
      },
      props.oneOff ? 1 : qty
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div>
      {engravable && <EngravingPicker value={engraving} onChange={setEngraving} />}

      {props.oneOff ? (
        <button
          onClick={onAdd}
          disabled={alreadyInCart}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 h-11 bg-[#B16558] hover:bg-[#954E44] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-sm transition-colors"
        >
          {alreadyInCart ? 'Already in cart' : added ? 'Added ✓' : 'Add to cart'}
        </button>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="inline-flex items-center bg-white/[0.06] border border-white/15 rounded-sm text-gray-200">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="px-3 py-2.5 text-gray-400 hover:text-[#F0E6D3]"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-[2.5rem] text-center text-sm font-semibold">{qty}</span>
            <button
              onClick={() => setQty(q => q + 1)}
              className="px-3 py-2.5 text-gray-400 hover:text-[#F0E6D3]"
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
      )}

      {engravable && engText && (
        <p className="mt-2 text-[11px] text-gray-500">
          Engraving “{engText}” will be applied{props.oneOff ? '' : ' to each item in the pack'}.
        </p>
      )}
    </div>
  )
}
