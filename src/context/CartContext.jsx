import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { findProduct, findVariant } from '../data/products'
import { cartTotals } from '../lib/pricing'

const CartContext = createContext(null)
const STORAGE_KEY = 'hd-cart-v1'
const LAST_ORDER_KEY = 'hd-last-order-v1'

function reducer(state, action) {
  switch (action.type) {
    case 'set': {
      const { productId, variantId, qty } = action
      const rest = state.filter((l) => !(l.productId === productId && l.variantId === variantId))
      if (qty <= 0) return rest
      return [...rest, { productId, variantId, qty: Math.min(999, Math.floor(qty)) }].sort(byCatalogueOrder)
    }
    case 'add': {
      const { productId, variantId, qty } = action
      const existing = state.find((l) => l.productId === productId && l.variantId === variantId)
      const next = (existing?.qty ?? 0) + qty
      return reducer(state, { type: 'set', productId, variantId, qty: next })
    }
    case 'remove':
      return state.filter((l) => !(l.productId === action.productId && l.variantId === action.variantId))
    case 'replace':
      return action.lines.filter((l) => findVariant(l.productId, l.variantId)).sort(byCatalogueOrder)
    case 'clear':
      return []
    default:
      return state
  }
}

function byCatalogueOrder(a, b) {
  return a.productId.localeCompare(b.productId) || a.variantId.localeCompare(b.variantId)
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function CartProvider({ children }) {
  const [rawLines, dispatch] = useReducer(reducer, [], () => load(STORAGE_KEY, []))
  const [lastOrder, setLastOrderState] = useState(() => load(LAST_ORDER_KEY, null))
  const [showGst, setShowGst] = useState(() => load('hd-show-gst', false))

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rawLines)) } catch { /* ignore */ }
  }, [rawLines])
  useEffect(() => {
    try { localStorage.setItem('hd-show-gst', JSON.stringify(showGst)) } catch { /* ignore */ }
  }, [showGst])

  const lines = useMemo(
    () =>
      rawLines
        .map((l) => ({ ...l, product: findProduct(l.productId), variant: findVariant(l.productId, l.variantId) }))
        .filter((l) => l.product && l.variant),
    [rawLines],
  )
  const totals = useMemo(() => cartTotals(lines), [lines])
  const cartonCount = lines.reduce((s, l) => s + l.qty, 0)

  const value = {
    lines,
    totals,
    cartonCount,
    showGst,
    setShowGst,
    lastOrder,
    qtyOf: (productId, variantId) => rawLines.find((l) => l.productId === productId && l.variantId === variantId)?.qty ?? 0,
    setQty: (productId, variantId, qty) => dispatch({ type: 'set', productId, variantId, qty }),
    add: (productId, variantId, qty = 1) => dispatch({ type: 'add', productId, variantId, qty }),
    remove: (productId, variantId) => dispatch({ type: 'remove', productId, variantId }),
    replace: (lines) => dispatch({ type: 'replace', lines }),
    clear: () => dispatch({ type: 'clear' }),
    saveLastOrder: (order) => {
      setLastOrderState(order)
      try { localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order)) } catch { /* ignore */ }
    },
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
