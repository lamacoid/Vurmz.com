'use client'
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useCart, cartLineKey } from '@/lib/cart/store'
import { DELIVERY } from '@/lib/pricing'

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

const FREE_DELIVERY_CENTS = DELIVERY.freeThreshold * 100

export default function CartDrawer() {
  const { items, itemCount, subtotalCents, setQty, remove, isOpen, setOpen } = useCart()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[80] w-full sm:w-[28rem] bg-[#102f33] border-l border-white/10 shadow-2xl shadow-black/40 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Cart"
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <p className="text-sm font-bold text-[#DED6C3]">Your cart</p>
            <p className="text-xs text-[#DED6C3]/70">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={() => setOpen(false)} className="p-1 text-[#DED6C3]/70 hover:text-[#DED6C3]" aria-label="Close cart">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#DED6C3]/70 text-sm mb-4">Your cart is empty.</p>
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="inline-flex items-center text-[#C67A6F] text-sm font-semibold hover:underline"
              >
                Browse the shop →
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={cartLineKey(item)} className="flex gap-3">
                <div className="w-16 h-16 flex-shrink-0 bg-white/10 border border-white/10 rounded-sm overflow-hidden">
                  {item.heroUrl ? (
                    <img src={item.heroUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/shop/p/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-[#DED6C3] hover:text-[#C67A6F] block truncate"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-[#DED6C3]/70">{(item.variantName ? `${item.variantName.toLowerCase()} · ` : item.packSize > 1 ? `pack of ${item.packSize} · ` : '') + money(item.priceCents) + (item.packSize > 1 || item.variantName ? ' ea' : ' each')}</p>
                  {(() => {
                    const eng = item.metadata?.engraving as { text?: string; fontLabel?: string } | undefined
                    const opts = item.metadata?.options as { finish?: string; template?: string } | undefined
                    const file = item.metadata?.file as { filename?: string } | undefined
                    return (
                      <>
                        {eng?.text && (
                          <p className="text-[11px] text-[#C67A6F] truncate" title={`Engraving: ${eng.text}`}>
                            ✎ “{eng.text}”{eng.fontLabel ? ` · ${eng.fontLabel}` : ''}
                          </p>
                        )}
                        {(opts?.template || opts?.finish) && (
                          <p className="text-[11px] text-[#DED6C3]/60 truncate">{[opts.template, opts.finish].filter(Boolean).join(' · ')}</p>
                        )}
                        {file?.filename && <p className="text-[11px] text-[#DED6C3]/60 truncate">📎 {file.filename}</p>}
                      </>
                    )
                  })()}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="inline-flex items-center bg-white/10 border border-white/10 rounded-sm text-sm text-[#DED6C3]">
                      <button onClick={() => setQty(cartLineKey(item), item.qty - 1)} className="px-2 py-1 text-[#DED6C3]/70 hover:text-[#DED6C3]" aria-label="Decrease">−</button>
                      <span className="min-w-[1.5rem] text-center text-xs font-semibold">{item.qty}</span>
                      <button onClick={() => setQty(cartLineKey(item), item.qty + 1)} className="px-2 py-1 text-[#DED6C3]/70 hover:text-[#DED6C3]" aria-label="Increase">+</button>
                    </div>
                    <button onClick={() => remove(cartLineKey(item))} className="text-xs text-[#DED6C3]/70 hover:text-[#C67A6F]">Remove</button>
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#DED6C3]">{money(item.priceCents * item.qty)}</div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-white/10 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#DED6C3]/70">Subtotal</span>
              <span className="font-semibold text-[#DED6C3]">{money(subtotalCents)}</span>
            </div>
            {/* The free-delivery line: the honest nudge that builds baskets. */}
            {subtotalCents >= FREE_DELIVERY_CENTS ? (
              <p className="text-[11px] text-[#7FCFD4]">✓ Free hand delivery in the South Denver metro.</p>
            ) : (
              <p className="text-[11px] text-[#DED6C3]/80">
                {money(FREE_DELIVERY_CENTS - subtotalCents)} more and hand delivery is free in the South Denver metro.
              </p>
            )}
            <p className="text-[11px] text-[#DED6C3]/70">Taxes and delivery calculated at checkout.</p>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center h-11 bg-[#C67A6F] hover:bg-[#B0675D] text-white text-sm font-semibold transition-colors puffy-btn"
            >
              Checkout
            </Link>
          </footer>
        )}
      </aside>
    </>
  )
}
