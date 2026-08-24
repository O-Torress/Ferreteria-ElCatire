import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'
import { useProducts } from '../context/ProductsContext'
import { useCart } from '../context/CartContext'
import { fmtUSD, fmtBs, categoryLabel } from '../lib/utils'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { byId, loading } = useProducts()
  const { rate, add } = useCart()
  const [qty, setQty] = useState(1)
  const [cartOpen, setCartOpen] = useState(false)

  const product = byId[id]
  const stock = Number(product?.stock ?? 0)
  const out = stock <= 0

  useEffect(() => {
    setQty(1)
  }, [id])

  function changeQty(v) {
    const n = Math.round(Number(v) || 1)
    setQty(Math.max(1, Math.min(stock || 1, n)))
  }

  function addToCart() {
    if (out) return
    add(product.id, qty)
    setCartOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header query="" onQuery={() => {}} onOpenCart={() => setCartOpen(true)} />

      <main className="flex-1 py-6 pb-16">
        <div className="max-w-[1080px] mx-auto px-5">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand transition-colors min-h-[42px]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
            Volver al catálogo
          </Link>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mt-4">
              <div className="aspect-square bg-media border border-line rounded-lg animate-pulse"></div>
              <div className="flex flex-col gap-3 pt-2">
                <div className="h-5 bg-media rounded-md w-24"></div>
                <div className="h-8 bg-media rounded-md w-3/4"></div>
                <div className="h-4 bg-media rounded-md w-28"></div>
                <div className="h-7 bg-media rounded-md w-36 mt-2"></div>
                <div className="h-20 bg-media rounded-md w-full mt-3"></div>
                <div className="h-12 bg-media rounded-lg w-56 mt-3"></div>
              </div>
            </div>
          ) : !product ? (
            <div className="text-center py-20">
              <p className="font-display font-semibold text-[19px] text-ink">Producto no encontrado</p>
              <p className="text-muted text-sm mt-1 mb-5">Puede que haya sido eliminado o que el enlace sea incorrecto.</p>
              <Link to="/" className="inline-flex items-center justify-center bg-brand hover:bg-brandhover text-white font-semibold text-sm tracking-[0.02em] px-5 py-2.5 rounded-lg min-h-[42px] transition-colors">
                Ir al catálogo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mt-4 items-start">
              <div className="relative aspect-square bg-media border border-line rounded-lg overflow-hidden">
                {product.imagen_url ? (
                  <img src={product.imagen_url} alt={product.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-disabled">
                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.5-3.5L6 21"/></svg>
                  </div>
                )}
                <span className={'absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.22)] ' + (out ? 'bg-disabled/30 text-muted' : 'bg-stock text-ink')}>
                  {out ? 'Agotado' : 'En stock'}
                </span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold tracking-[0.04em] uppercase text-brand bg-brand/10 border border-brand/35 rounded-full px-2.5 py-1">{categoryLabel(product.categoria)}</span>
                  {product.marca && <span className="text-xs font-semibold text-muted bg-canvas border border-line rounded-full px-2.5 py-1">{product.marca}</span>}
                </div>

                <h1 className="font-display font-bold text-[clamp(24px,3vw,32px)] text-ink tracking-[-0.01em] leading-[1.15] mt-3">{product.nombre}</h1>

                <div className="flex items-baseline gap-3 mt-4">
                  <span className="font-display text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.01em] text-ink">{fmtUSD(product.precio_usd)}</span>
                  <span className="text-[15px] text-muted font-medium">≈ {fmtBs(product.precio_usd * rate)}</span>
                </div>

                <p className={'text-sm font-medium mt-2 ' + (out ? 'text-[#b91c1c]' : 'text-action')}>
                  {out ? 'Sin existencias disponibles' : stock + ' unidad' + (stock === 1 ? '' : 'es') + ' disponible' + (stock === 1 ? '' : 's')}
                </p>

                <div className="border-t border-line mt-5 pt-5">
                  <h2 className="font-display font-semibold text-[16px] tracking-[-0.01em] mb-1.5">Descripción</h2>
                  <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
                    {product.descripcion && String(product.descripcion).trim() ? product.descripcion : 'Este producto aún no tiene descripción.'}
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6 flex-wrap">
                  <div className="flex items-center border border-line rounded-lg overflow-hidden">
                    <button onClick={() => changeQty(qty - 1)} disabled={out} className="w-9 h-11 grid place-items-center text-ink font-semibold hover:bg-canvas transition-colors disabled:opacity-40" aria-label="Reducir cantidad">−</button>
                    <input
                      type="number"
                      min="1"
                      max={stock || 1}
                      value={qty}
                      onChange={(e) => changeQty(e.target.value)}
                      disabled={out}
                      className="w-14 text-center text-sm font-semibold outline-none disabled:text-disabled"
                      aria-label="Cantidad"
                    />
                    <button onClick={() => changeQty(qty + 1)} disabled={out} className="w-9 h-11 grid place-items-center text-ink font-semibold hover:bg-canvas transition-colors disabled:opacity-40" aria-label="Aumentar cantidad">+</button>
                  </div>
                  <button
                    onClick={addToCart}
                    disabled={out}
                    className="flex-1 min-w-[200px] bg-action hover:bg-actionhover text-white font-semibold text-[15px] tracking-[0.02em] py-3 px-4 rounded-lg min-h-[46px] flex items-center justify-center gap-2 transition-colors disabled:bg-disabled disabled:cursor-not-allowed"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2 3h2.2l2 12.2a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.3L20.5 8H5.2"/></svg>
                    {out ? 'Sin stock' : 'Añadir al carrito'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
     <Footer>
      
     </Footer>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
