'use client'
import { useCart } from '@/lib/cart/store'

export default function CartButton({ className }: { className?: string }) {
  const { itemCount, setOpen } = useCart()
  return (
    <button
      onClick={() => setOpen(true)}
      className={`relative inline-flex items-center gap-2 text-[13px] text-gray-300 hover:text-[#C67A6F] transition-colors ${className ?? ''}`}
      aria-label={`Open cart, ${itemCount} items`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
      <span className="hidden sm:inline">Cart</span>
      {itemCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#C67A6F] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  )
}
