'use client'
import { useState } from 'react'
import { useCart } from '@/lib/cart/store'
import { fontOptions } from '@/lib/fonts'
import { menuPrice } from '@/lib/menu-format'
import { trackConversion } from '@/lib/track'
import EngravingPicker, { type EngravingValue } from './EngravingPicker'
import BuilderPanel from '@/components/builder/BuilderPanel'
import type { CanvasBuilderConfig, BuilderSubmission } from '@/lib/builder/types'

export interface PackOption {
  /** null = the product's own default pack. */
  variantId: string | null
  name: string
  packSize: number
  priceCents: number
}

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
  /** Additional pack-size options (product_variants). The default pack is added automatically. */
  variants?: Array<{ id: string; name: string; packSize: number; priceCents: number }>
  /** Canvas-mode Builder config (metadata.builder). Replaces the engraving picker when present. */
  builderConfig?: CanvasBuilderConfig | null
}) {
  const { add, items } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [engraving, setEngraving] = useState<EngravingValue>({ text: '', fontValue: 'kerf', placement: '', element: null })
  const [builderSub, setBuilderSub] = useState<BuilderSubmission | null>(null)

  // The default pack plus any admin-defined options, sorted by pack size.
  const options: PackOption[] = [
    {
      variantId: null,
      name: props.packSize === 1 ? 'Single' : `Pack of ${props.packSize}`,
      packSize: props.packSize,
      priceCents: props.priceCents,
    },
    ...(props.variants ?? []).map(v => ({ variantId: v.id, name: v.name, packSize: v.packSize, priceCents: v.priceCents })),
  ].sort((a, b) => a.packSize - b.packSize)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const selected = options.find(o => (o.variantId ?? '') === (selectedKey ?? '')) ?? options.find(o => o.variantId === null) ?? options[0]
  const hasOptions = options.length > 1

  const engravable = props.engravable !== false
  const hasBuilder = Boolean(props.builderConfig)
  const alreadyInCart = props.oneOff && items.some(i => i.productId === props.productId)
  const engText = engraving.text.trim()
  // An order is personalized if it has text OR a chosen design element OR a builder layout.
  const hasPersonalization = Boolean(engText) || Boolean(engraving.element) || Boolean(builderSub)

  function buildMetadata(): Record<string, unknown> | undefined {
    if (!engravable || !hasPersonalization) return undefined
    if (builderSub) return { builder: builderSub }
    const font = fontOptions.find(f => f.value === engraving.fontValue)
    const placement = engraving.placement.trim()
    return {
      engraving: {
        text: engText.slice(0, 120),
        fontValue: engraving.fontValue,
        fontLabel: font?.label ?? engraving.fontValue,
        ...(placement ? { placement: placement.slice(0, 200) } : {}),
        ...(engraving.element ? { element: { id: engraving.element.id, label: engraving.element.label, thumb: engraving.element.thumb } } : {}),
      },
    }
  }

  function onAdd() {
    add(
      {
        productId: props.productId,
        variantId: selected.variantId,
        variantName: selected.variantId ? selected.name : null,
        slug: props.slug,
        // Names like "Labels (Pack of 10)" drop their own pack suffix when a
        // chosen option replaces it, so it never reads "(Pack of 10) (Pack of 25)".
        name: selected.variantId
          ? `${props.name.replace(/\s*\((?:pack|set) of \d+\)\s*$/i, '')} (${selected.name})`
          : props.name,
        priceCents: selected.priceCents,
        packSize: selected.packSize,
        heroUrl: props.heroUrl,
        oneOff: props.oneOff,
        metadata: buildMetadata(),
      },
      props.oneOff ? 1 : qty
    )
    trackConversion('add_to_cart', selected.priceCents * (props.oneOff ? 1 : qty))
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <div>
      {engravable && hasBuilder && props.builderConfig && <BuilderPanel config={props.builderConfig} onChange={setBuilderSub} />}
      {engravable && !hasBuilder && <EngravingPicker value={engraving} onChange={setEngraving} />}

      {/* Pack-size options: framed chips, price on each, menu-quiet. */}
      {hasOptions && !props.oneOff && (
        <div className="mb-4">
          <span className="block text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-2">Size</span>
          <div className="flex flex-wrap gap-2">
            {options.map(o => {
              const isSel = (o.variantId ?? '') === (selected.variantId ?? '')
              return (
                <button
                  key={o.variantId ?? 'base'}
                  type="button"
                  onClick={() => setSelectedKey(o.variantId)}
                  aria-pressed={isSel}
                  className={`px-4 py-2 rounded-sm border text-sm transition-colors ${
                    isSel
                      ? 'border-[var(--eyebrow)] bg-[var(--eyebrow)]/10 text-[var(--ink)] font-semibold'
                      : 'border-[var(--hairline)] text-[var(--ink-soft)] hover:border-[var(--ink)]/40 hover:text-[var(--ink)]'
                  }`}
                >
                  {o.name} <span className={isSel ? 'text-[var(--eyebrow)]' : ''}>{menuPrice(o.priceCents)}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {props.oneOff ? (
        <button
          onClick={onAdd}
          disabled={alreadyInCart}
          className="w-full inline-flex items-center justify-center px-6 h-11 bg-[#C67A6F] hover:bg-[#B0675D] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-sm transition-colors"
        >
          {alreadyInCart ? 'Already in cart' : added ? 'Added ✓' : 'Add to cart'}
        </button>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="inline-flex items-center justify-center bg-[var(--page)] border border-[var(--hairline)] rounded-sm text-[var(--ink)]">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="px-3 py-2.5 text-[var(--ink-soft)] hover:text-[var(--ink)]"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-[2.5rem] text-center text-sm font-semibold">{qty}</span>
            <button
              onClick={() => setQty(q => q + 1)}
              className="px-3 py-2.5 text-[var(--ink-soft)] hover:text-[var(--ink)]"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            onClick={onAdd}
            className="flex-1 inline-flex items-center justify-center px-6 h-11 bg-[#C67A6F] hover:bg-[#B0675D] text-white text-sm font-semibold rounded-sm transition-colors"
          >
            {added ? 'Added ✓' : 'Add to cart'}
          </button>
        </div>
      )}

      {engravable && hasPersonalization && (
        <p className="mt-2 text-[11px] text-[var(--ink-soft)]">
          {builderSub ? <>Your layout ({builderSub.elements.length} element{builderSub.elements.length === 1 ? '' : 's'})</> : engText ? <>Engraving “{engText}”</> : 'Your design'}
          {engraving.element ? <> + {engraving.element.label} design</> : null}
          {' '}will be applied{props.oneOff ? '' : ' to each item in the pack'}.
        </p>
      )}

      {/* Risk reversal at the exact moment of doubt. Engravable products
          already carry this promise inside the engraving picker, so this
          line only renders where it isn't already said. */}
      {!engravable && (
        <p className="mt-2 text-[11px] text-[var(--ink-soft)]">
          ✓ You approve a proof photo before anything runs.
        </p>
      )}
    </div>
  )
}
