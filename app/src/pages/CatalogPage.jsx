import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CategoriesDrawer from '../components/CategoriesDrawer'
import ProductCard from '../components/ProductCard'
import CartDrawer from '../components/CartDrawer'
import Pagination from '../components/Pagination'
import { useProducts } from '../context/ProductsContext'
import { useCart } from '../context/CartContext'
import { normalizeText, categoryLabel } from '../lib/utils'

export default function CatalogPage() {
  const { products, loading, error } = useProducts()

  useEffect(() => {
    document.title = 'Catálogo – Ferretería El Catire'
  }, [])

  const { rate, rateLabel } = useCart()

  const [cat, setCat] = useState('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [cartOpen, setCartOpen] = useState(false)
  const [catsOpen, setCatsOpen] = useState(false)

  const PER_PAGE = 9

  const onQuery = (v) => {
    setQuery(v)
    setPage(1)
    if (v.trim() && cat !== 'all') setCat('all')
  }

  const onSelectCat = (c) => {
    setCat(c)
    setPage(1)
  }

  const list = useMemo(() => {
    const q = normalizeText(query.trim())
    return products.filter((p) => {
      if (!p.activo) return false
      if (cat !== 'all' && p.categoria !== cat) return false
      if (!q) return true
      const hay = normalizeText(
        [p.nombre, p.sku, p.marca, p.descripcion, categoryLabel(p.categoria)].filter(Boolean).join(' ')
      )
      return hay.includes(q)
    })
  }, [products, cat, query])

  const totalPages = Math.ceil(list.length / PER_PAGE)
  const safePage = Math.min(page, totalPages || 1)
  const paged = list.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  const onPageChange = (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header query={query} onQuery={onQuery} onOpenCart={() => setCartOpen(true)} />

      <main className="pt-6 pb-16 flex-1">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display font-bold text-[clamp(26px,3vw,32px)] text-brand tracking-[-0.01em] leading-[1.15]">Catálogo de productos</h1>
              <p className="text-muted text-sm mt-0.5">
                Retiro en tienda fisica
                {rateLabel && <span> · Tasa de referencia: {rateLabel}</span>}
              </p>
            </div>
          </div>

          <div className="mt-5 mb-5">
            <button
              onClick={() => setCatsOpen(true)}
              className="group inline-flex items-center gap-2 text-sm font-semibold tracking-[0.02em] text-ink hover:text-brand transition-colors min-h-[42px]"
              aria-haspopup="dialog"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              Ver categorías
              {cat !== 'all' && <span className="text-brand">· {categoryLabel(cat)}</span>}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

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
              {error ? (
                <span className="text-[#b91c1c]">Error al cargar: {error}</span>
              ) : query || cat !== 'all' ? (
                'Sin resultados para esa búsqueda.'
              ) : (
                'Aún no hay productos publicados.'
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {paged.map((p) => (
                <ProductCard key={p.id} product={p} stockQty={p.stock} rate={rate} />
              ))}
            </div>
          )}

          <Pagination page={safePage} total={totalPages} onChange={onPageChange} />
        </div>
      </main>

      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <CategoriesDrawer open={catsOpen} onClose={() => setCatsOpen(false)} active={cat} onSelect={onSelectCat} />
    </div>
  )
}
