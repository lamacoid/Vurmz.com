'use client'
import { useState } from 'react'
import { useCart } from '@/lib/cart/store'
import { menuPrice } from '@/lib/menu-format'
import { trackConversion } from '@/lib/track'
import FileAttach, { type AttachedFile } from './FileAttach'

export interface PackOption {
  /** null = the product's own default pack. */
  variantId: string | null
  name: string
  packSize: number
  priceCents: number
}

/**
 * The order form, streamlined 2026-11-11. No designer, no pickers, no
 * previews: the customer says what goes on it, attaches a file if they have
 * one, and I lay it out. The cart item keeps the same metadata shape the
 * checkout, the order emails, and the admin already read (engraving.text,
 * engraving.placement, options.finish, file), so nothing downstream changes.
 */
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
  /** Colors/finishes actually in stock (from the inventory, resolved by the
   *  product page). hex is the swatch color when known. The form only ever
   *  offers what this list carries. */
  finishes?: Array<{ label: string; hex: string | null }>
}) {
  const { add, items } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [words, setWords] = useState('')
  const [notes, setNotes] = useState('')
  const [file, setFile] = useState<AttachedFile | null>(null)

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
  // A single stocked finish is not a choice, so chips only render at two or more.
  const finishes = engravable ? (props.finishes ?? []) : []
  const hasFinishes = finishes.length > 1
  const [finishKey, setFinishKey] = useState<string | null>(null)
  const finish = finishes.find(f => f.label === finishKey) ?? finishes[0] ?? null

  const alreadyInCart = props.oneOff && items.some(i => i.productId === props.productId)
  const text = words.trim()
  const placement = notes.trim()

  function buildMetadata(): Record<string, unknown> | undefined {
    if (!engravable) return undefined
    const meta: Record<string, unknown> = {}
    // Notes without words still ride the order: "logo only, centered" is a
    // complete instruction when a file is attached.
    if (text || placement) {
      meta.engraving = {
        text: text.slice(0, 120),
        ...(placement ? { placement: placement.slice(0, 200) } : {}),
      }
    }
    if (hasFinishes && finish) meta.options = { finish: finish.label }
    if (file) meta.file = { key: file.key, filename: file.filename }
    return Object.keys(meta).length ? meta : undefined
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

  const label = 'block text-[11px] uppercase tracking-wider text-[var(--ink-soft)] mb-2'
  const field = 'w-full rounded-sm border border-[var(--hairline)] bg-[var(--page)] px-3 py-2.5 text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-soft)]/60 focus:outline-none focus:border-[var(--eyebrow)]'
  const chip = (on: boolean) =>
    `inline-flex items-center gap-2 px-4 py-2 rounded-sm border text-sm transition-colors ${
      on
        ? 'border-[var(--eyebrow)] bg-[var(--eyebrow)]/10 text-[var(--ink)] font-semibold'
        : 'border-[var(--hairline)] text-[var(--ink-soft)] hover:border-[var(--ink)]/40 hover:text-[var(--ink)]'
    }`

  return (
    <div>
      {/* Finish options: only what is counted in stock. */}
      {hasFinishes && (
        <div className="mb-4">
          <span className={label}>Finish</span>
          <div className="flex flex-wrap gap-2">
            {finishes.map(f => {
              const isSel = f.label === (finish?.label ?? '')
              return (
                <button key={f.label} type="button" onClick={() => setFinishKey(f.label)} aria-pressed={isSel} className={chip(isSel)}>
                  {f.hex && <span aria-hidden className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ background: f.hex }} />}
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {engravable && (
        <div className="mb-4 space-y-4">
          <div>
            <label htmlFor="atc-words" className={label}>What should it say?</label>
            <input
              id="atc-words"
              type="text"
              value={words}
              onChange={e => setWords(e.target.value)}
              maxLength={120}
              placeholder="A name, a date, a line. Leave blank for a logo only."
              className={field}
            />
          </div>
          <div>
            <span className={label}>Logo or artwork</span>
            <FileAttach value={file} onChange={setFile} />
          </div>
          <div>
            <label htmlFor="atc-notes" className={label}>Anything else?</label>
            <textarea
              id="atc-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              maxLength={200}
              rows={2}
              placeholder="Where it goes, a style you like, a deadline."
              className={field}
            />
          </div>
          <p className="text-[12px] leading-relaxed text-[var(--ink-soft)]">
            I lay it out and text you if anything is unclear before it runs.
          </p>
        </div>
      )}

      {/* Pack-size options: framed chips, price on each. */}
      {hasOptions && !props.oneOff && (
        <div className="mb-4">
          <span className={label}>Size</span>
          <div className="flex flex-wrap gap-2">
            {options.map(o => {
              const isSel = (o.variantId ?? '') === (selected.variantId ?? '')
              return (
                <button key={o.variantId ?? 'base'} type="button" onClick={() => setSelectedKey(o.variantId)} aria-pressed={isSel} className={chip(isSel)}>
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
          className="w-full inline-flex items-center justify-center px-6 h-11 bg-[var(--coral)] hover:bg-[var(--coral-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
        >
          {alreadyInCart ? 'Already in cart' : added ? 'Added' : 'Add to cart'}
        </button>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="inline-flex items-center justify-center bg-[var(--page)] border border-[var(--hairline)] rounded-sm text-[var(--ink)]">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2.5 text-[var(--ink-soft)] hover:text-[var(--ink)]" aria-label="Decrease quantity">
              −
            </button>
            <span className="min-w-[2.5rem] text-center text-sm font-semibold">{qty}</span>
            <button onClick={() => setQty(q => q + 1)} className="px-3 py-2.5 text-[var(--ink-soft)] hover:text-[var(--ink)]" aria-label="Increase quantity">
              +
            </button>
          </div>
          <button
            onClick={onAdd}
            className="flex-1 inline-flex items-center justify-center px-6 h-11 bg-[var(--coral)] hover:bg-[var(--coral-hover)] text-white text-sm font-semibold transition-colors"
          >
            {added ? 'Added' : 'Add to cart'}
          </button>
        </div>
      )}

      {engravable && (text || file) && (
        <p className="mt-2 text-[11px] text-[var(--ink-soft)]">
          {text ? <>Engraving “{text}”</> : 'Your file'}
          {text && file ? <> with {file.filename}</> : null}
          {' '}goes on {props.oneOff || selected.packSize === 1 ? 'the piece' : 'each item in the pack'}.
        </p>
      )}
    </div>
  )
}
