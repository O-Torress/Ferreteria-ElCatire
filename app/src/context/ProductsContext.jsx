import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [stock, setStock] = useState([])
  const [sedes, setSedes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const [pRes, sRes, sedeRes] = await Promise.all([
        supabase.from('productos').select('*').eq('activo', true).order('nombre'),
        supabase.from('stock').select('*'),
        supabase.from('sedes').select('*').order('nombre')
      ])
      if (pRes.error) throw pRes.error
      if (sRes.error) throw sRes.error
      if (sedeRes.error) throw sedeRes.error
      setProducts(pRes.data ?? [])
      setStock(sRes.data ?? [])
      setSedes(sedeRes.data ?? [])
      setError(null)
    } catch (err) {
      setError(err.message || 'Error al cargar el catálogo')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const byId = useMemo(() => {
    const map = {}
    products.forEach((p) => { map[p.id] = p })
    return map
  }, [products])

  const stockById = useMemo(() => {
    const map = {}
    stock.forEach((s) => {
      map[s.producto_id] = map[s.producto_id] || {}
      map[s.producto_id][s.sede_id] = s.cantidad
    })
    return map
  }, [stock])

  return (
    <ProductsContext.Provider value={{ products, stock, sedes, stockById, loading, error, reload: load }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  return useContext(ProductsContext)
}
