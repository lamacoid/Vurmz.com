'use client'
/**
 * Cart state — React context with two persistence layers:
 *   1. localStorage (always, fast first-paint, anonymous fallback)
 *   2. /api/account/cart — server-side persistence when the customer is
 *      logged in, so the cart follows them across devices.
 *
 * On hydration the provider checks /api/account/me. If logged in it pulls
 * the server cart and merges it with whatever localStorage had (union by
 * productId, server qty wins on conflict), then pushes the merged result
 * back so both sides agree. Subsequent mutations debounce a PUT to the
 * server. Logged-out users stay on localStorage only.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

export interface CartItem {
  productId: string
  slug: string
  name: string
  priceCents: number
  packSize: number
  qty: number
  heroUrl: string | null
  oneOff?: boolean
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
  syncedWithServer: boolean
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'vurmz_cart_v1'
const SERVER_PUSH_DEBOUNCE_MS = 600

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

/**
 * Merge two cart item lists. Server takes priority on quantity for items
 * present in both — this matches user expectation that "what I left on
 * device A is what I see on device B".
 */
function mergeCarts(serverItems: CartItem[], localItems: CartItem[]): CartItem[] {
  const byId = new Map<string, CartItem>()
  for (const it of serverItems) byId.set(it.productId, it)
  for (const it of localItems) {
    if (!byId.has(it.productId)) byId.set(it.productId, it)
  }
  return Array.from(byId.values())
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [] })
  const [isOpen, setOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [syncedWithServer, setSyncedWithServer] = useState(false)

  // Auth state — set on mount and re-checked whenever a fetch suggests it
  // changed (e.g. logged out 401 from server cart).
  const isAuthedRef = useRef<boolean>(false)

  // Debounced server push — coalesces rapid mutations (qty +/-) into one PUT.
  const pushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pushToServer = useCallback((items: CartItem[]) => {
    if (!isAuthedRef.current) return
    if (pushTimerRef.current) clearTimeout(pushTimerRef.current)
    pushTimerRef.current = setTimeout(() => {
      fetch('/api/account/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      }).then(res => {
        if (res.status === 401) {
          isAuthedRef.current = false
          setSyncedWithServer(false)
        }
      }).catch(() => {})
    }, SERVER_PUSH_DEBOUNCE_MS)
  }, [])

  // Hydrate from localStorage, then attempt server sync.
  useEffect(() => {
    const local = loadFromStorage()
    setState(local)
    setHydrated(true)

    let cancelled = false
    ;(async () => {
      try {
        const meRes = await fetch('/api/account/me', { credentials: 'include' })
        if (cancelled) return
        if (!meRes.ok) {
          isAuthedRef.current = false
          return
        }
        isAuthedRef.current = true
        const cartRes = await fetch('/api/account/cart', { credentials: 'include' })
        if (cancelled) return
        if (!cartRes.ok) return
        const json = (await cartRes.json()) as { ok?: boolean; data?: { cart: { items: CartItem[] } } }
        const serverItems = json.data?.cart.items ?? []
        const merged = mergeCarts(serverItems, local.items)
        setState({ items: merged })
        setSyncedWithServer(true)
        // Persist merged result up to the server when something changed.
        const changedFromServer =
          merged.length !== serverItems.length ||
          merged.some((m, i) => m.productId !== serverItems[i]?.productId || m.qty !== serverItems[i]?.qty)
        if (changedFromServer) {
          fetch('/api/account/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: merged }),
          }).catch(() => {})
        }
      } catch {
        isAuthedRef.current = false
      }
    })()

    return () => { cancelled = true }
  }, [])

  // Persist locally + push to server on changes.
  useEffect(() => {
    if (!hydrated) return
    saveToStorage(state)
    pushToServer(state.items)
  }, [state, hydrated, pushToServer])

  const add = useCallback<CartContextValue['add']>((item, qty = 1) => {
    setState(prev => {
      const existing = prev.items.find(i => i.productId === item.productId)
      if (existing) {
        // One-off items are unique — never increment past 1, but still let a
        // fresh engraving choice replace the old one.
        if (item.oneOff || existing.oneOff) {
          if (!item.metadata) return prev
          return {
            items: prev.items.map(i =>
              i.productId === item.productId ? { ...i, metadata: item.metadata } : i
            ),
          }
        }
        return {
          items: prev.items.map(i =>
            i.productId === item.productId
              ? { ...i, qty: i.qty + qty, metadata: item.metadata ?? i.metadata }
              : i
          ),
        }
      }
      return { items: [...prev.items, { ...item, qty: item.oneOff ? 1 : qty }] }
    })
    setOpen(true)
  }, [])

  const setQty = useCallback<CartContextValue['setQty']>((productId, qty) => {
    if (qty <= 0) {
      setState(prev => ({ items: prev.items.filter(i => i.productId !== productId) }))
      return
    }
    setState(prev => ({
      items: prev.items.map(i =>
        i.productId === productId ? { ...i, qty: i.oneOff ? 1 : qty } : i
      ),
    }))
  }, [])

  const remove = useCallback<CartContextValue['remove']>(productId => {
    setState(prev => ({ items: prev.items.filter(i => i.productId !== productId) }))
  }, [])

  const clear = useCallback(() => {
    setState({ items: [] })
    if (isAuthedRef.current) {
      // Skip the debounce — clear is usually called post-checkout and we
      // want the server reset to land before the next page load.
      if (pushTimerRef.current) {
        clearTimeout(pushTimerRef.current)
        pushTimerRef.current = null
      }
      fetch('/api/account/cart', { method: 'DELETE', credentials: 'include' }).catch(() => {})
    }
  }, [])

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
      syncedWithServer,
    }),
    [state.items, itemCount, subtotalCents, add, remove, setQty, clear, isOpen, syncedWithServer]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
