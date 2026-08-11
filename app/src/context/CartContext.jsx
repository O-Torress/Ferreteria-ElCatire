import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchRate } from '../lib/api'
import { DEFAULT_RATE } from '../lib/utils'
import { useProducts } from './ProductsContext'

const CartContext = createContext(null)

const STORE_KEY = 'fec_cart'

function readCart() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return {}
    const obj = JSON.parse(raw)
    const clean = {}
    Object.keys(obj).forEach((id) => {
      const n = Number(obj[id])
      if (n > 0) clean[id] = n
    })
    return clean
  } catch {
    return {}
  }
}

export function CartProvider({ children }) {
  const { byId } = useProducts()
  const [items, setItems] = useState(readCart)
  const [rate, setRate] = useState(DEFAULT_RATE)
  const [rateLabel, setRateLabel] = useState('')

  useEffect(() => {
    fetchRate()
      .then((r) => {
        setRate(r)
        setRateLabel(r.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' por US$ 1,00')
      })
      .catch(() => setRateLabel(''))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(items))
  }, [items])

  const add = (id) => setItems((p) => ({ ...p, [id]: (p[id] || 0) + 1 }))
  const dec = (id) =>
    setItems((p) => {
      const next = { ...p }
      const v = (next[id] || 0) - 1
      if (v <= 0) delete next[id]
      else next[id] = v
      return next
    })
  const remove = (id) =>
    setItems((p) => {
      const next = { ...p }
      delete next[id]
      return next
    })
  const clear = () => setItems({})

  const count = useMemo(() => Object.values(items).reduce((s, n) => s + n, 0), [items])

  const validIds = useMemo(
    () => Object.keys(items).filter((id) => byId[id]),
    [items, byId]
  )

  const totalUsd = useMemo(
    () => validIds.reduce((s, id) => s + Number(byId[id].precio_usd) * items[id], 0),
    [validIds, items, byId]
  )

  return (
    <CartContext.Provider value={{ items, rate, rateLabel, count, totalUsd, add, dec, remove, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
