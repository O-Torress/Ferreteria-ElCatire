import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const ProductsContext = createContext(null)

function mapProduct(r) {
  const img = (r.img_url || '').trim().replace(/^'+|'+$/g, '')
  return {
    id: r.codigo,
    sku: r.codigo,
    nombre: r.nombre,
    categoria: r.categoria,
    precio_usd: r.precio_detal,
    imagen_url: img,
    activo: !r.deleted,
    stock: r.stock,
    marca: r.marca,
    descripcion: r.descripcion
  }
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('Productos')
        .select('*')
        .order('nombre')
      if (error) throw error
      setProducts((data ?? []).map(mapProduct))
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

  return (
    <ProductsContext.Provider value={{ products, byId, loading, error, reload: load }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  return useContext(ProductsContext)
}
