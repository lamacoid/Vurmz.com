'use client'
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useCart } from '@/lib/cart/store'

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

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
            <p className="text-sm font-bold text-[#F0E6D3]">Your cart</p>
            <p className="text-xs text-gray-400">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:text-[#F0E6D3]" aria-label="Close cart">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm mb-4">Your cart is empty.</p>
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="inline-flex items-center text-[#B16558] text-sm font-semibold hover:underline"
              >
                Browse the shop →
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item.productId} className="flex gap-3">
                <div className="w-16 h-16 flex-shrink-0 bg-white/[0.06] border border-white/10 rounded-sm overflow-hidden">
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
                    className="text-sm font-medium text-[#F0E6D3] hover:text-[#B16558] block truncate"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-gray-400">pack of {item.packSize} · {money(item.priceCents)} ea</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="inline-flex items-center bg-white/[0.06] border border-white/15 rounded-sm text-sm text-gray-200">
                      <button onClick={() => setQty(item.productId, item.qty - 1)} className="px-2 py-1 text-gray-400 hover:text-[#F0E6D3]" aria-label="Decrease">−</button>
                      <span className="min-w-[1.5rem] text-center text-xs font-semibold">{item.qty}</span>
                      <button onClick={() => setQty(item.productId, item.qty + 1)} className="px-2 py-1 text-gray-400 hover:text-[#F0E6D3]" aria-label="Increase">+</button>
                    </div>
                    <button onClick={() => remove(item.productId)} className="text-xs text-gray-400 hover:text-[#B16558]">Remove</button>
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#F0E6D3]">{money(item.priceCents * item.qty)}</div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-white/10 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="font-semibold text-[#F0E6D3]">{money(subtotalCents)}</span>
            </div>
            <p className="text-[11px] text-gray-500">Taxes and delivery calculated at checkout.</p>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center h-11 bg-[#B16558] hover:bg-[#954E44] text-white text-sm font-semibold rounded-sm transition-colors"
            >
              Checkout
            </Link>
          </footer>
        )}
      </aside>
    </>
  )
}
