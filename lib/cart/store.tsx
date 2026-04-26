'use client'
/**
 * Cart state — React context + localStorage persistence.
 * Server sync to /api/cart happens on mutate when the customer is logged in (Chunk 3+).
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export interface CartItem {
  productId: string
  slug: string
  name: string
  priceCents: number
  packSize: number
  qty: number
  heroUrl: string | null
  metadata?: Record<string, unknown>
}

interface CartState {
  items: CartItem[]
}

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotalCents: number
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  remove: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clear: () => void
  isOpen: boolean
  setOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'vurmz_cart_v1'

function loadFromStorage(): CartState {
  if (typeof window === 'undefined') return { items: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: [] }
    return JSON.parse(raw) as CartState
  } catch {
    return { items: [] }
  }
}

function saveToStorage(state: CartState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [] })
  const [isOpen, setOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    setState(loadFromStorage())
    setHydrated(true)
  }, [])

  // Persist on changes
  useEffect(() => {
    if (hydrated) saveToStorage(state)
  }, [state, hydrated])

  const add = useCallback<CartContextValue['add']>((item, qty = 1) => {
    setState(prev => {
      const existing = prev.items.find(i => i.productId === item.productId)
      if (existing) {
        return {
          items: prev.items.map(i =>
            i.productId === item.productId ? { ...i, qty: i.qty + qty } : i
          ),
        }
      }
      return { items: [...prev.items, { ...item, qty }] }
    })
    setOpen(true)
  }, [])

  const remove = useCallback<CartContextValue['remove']>(productId => {
    setState(prev => ({ items: prev.items.filter(i => i.productId !== productId) }))
  }, [])

  const setQty = useCallback<CartContextValue['setQty']>((productId, qty) => {
    if (qty <= 0) {
      remove(productId)
      return
    }
    setState(prev => ({
      items: prev.items.map(i => (i.productId === productId ? { ...i, qty } : i)),
    }))
  }, [remove])

  const clear = useCallback(() => setState({ items: [] }), [])

  const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0)
  const subtotalCents = state.items.reduce((sum, i) => sum + i.priceCents * i.qty, 0)

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      itemCount,
      subtotalCents,
      add,
      remove,
      setQty,
      clear,
      isOpen,
      setOpen,
    }),
    [state.items, itemCount, subtotalCents, add, remove, setQty, clear, isOpen]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
