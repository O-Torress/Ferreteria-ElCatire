import { useMemo, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CategoryFilters from '../components/CategoryFilters'
import ProductCard from '../components/ProductCard'
import CartDrawer from '../components/CartDrawer'
import SedeSelect from '../components/SedeSelect'
import { useProducts } from '../context/ProductsContext'
import { useCart } from '../context/CartContext'
import { useSede } from '../context/SedeContext'

export default function CatalogPage() {
  const { products, stockById, sedes, loading } = useProducts()
  const { rate, rateLabel } = useCart()
  const { sede, setSede } = useSede()

  const [cat, setCat] = useState('all')
  const [query, setQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)

  const currentSede = sedes.find((s) => s.id === sede) || sedes[0] || { id: 'Sede Norte', nombre: 'Sede Norte' }

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const inCat = cat === 'all' || p.categoria === cat
      const inQ = !q || p.nombre.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      return inCat && inQ
    })
  }, [products, cat, query])

  return (
    <div className="min-h-screen flex flex-col">
      <Header query={query} onQuery={setQuery} onOpenCart={() => setCartOpen(true)} />

      <main className="pt-6 pb-16 flex-1">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display font-bold text-[clamp(26px,3vw,32px)] text-brand tracking-[-0.01em] leading-[1.15]">Catálogo de productos</h1>
              <p className="text-muted text-sm mt-0.5">
                Retiro en tienda o entrega en Maracaibo
                {rateLabel && <span> · Tasa de referencia: {rateLabel}</span>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted hidden sm:block">Sede</span>
              <SedeSelect value={currentSede.id} onChange={setSede} />
            </div>
          </div>

          <CategoryFilters active={cat} onChange={setCat} />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-line rounded-lg overflow-hidden">
                  <div className="aspect-square bg-media"></div>
                  <div className="p-4 flex flex-col gap-2">
                    <div className="h-4 bg-media rounded-md w-3/4"></div>
                    <div className="h-3 bg-media rounded-md w-1/3"></div>
                    <div className="h-5 bg-media rounded-md w-20 mt-0.5"></div>
                    <div className="h-11 bg-media rounded-lg mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="sm:col-span-3 text-center py-16 text-muted">
              {query || cat !== 'all' ? 'Sin resultados para esa búsqueda.' : 'Aún no hay productos publicados.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} stockQty={stockById[p.id]?.[currentSede.id]} rate={rate} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
