import { Link } from 'react-router-dom'
import { fmtUSD, fmtBs } from '../lib/utils'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product, stockQty, rate }) {
  const { add } = useCart()
  const out = Number(stockQty ?? 0) <= 0
  const href = '/producto/' + product.id

  return (
    <article className="bg-white border border-line rounded-lg overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(26,37,54,0.12)]">
      <Link to={href} className="relative aspect-square bg-media overflow-hidden group" aria-label={'Ver detalles de ' + product.nombre}>
        {product.imagen_url ? (
          <img
            src={product.imagen_url}
            alt={product.nombre}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-disabled">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.5-3.5L6 21"/></svg>
          </div>
        )}
        <span className="absolute top-2.5 left-2.5 bg-stock text-ink text-xs font-semibold px-2.5 py-1 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.22)]">
          {out ? 'Agotado' : 'En stock'}
        </span>
      </Link>
      <div className="p-4 pt-3.5 flex flex-col gap-1.5 flex-1">
        <h2 className="font-display text-base font-semibold leading-snug tracking-[-0.01em]">
          <Link to={href} className="hover:text-brand transition-colors">{product.nombre}</Link>
        </h2>
        <div className="flex items-baseline gap-2.5 mt-0.5">
          <span className="font-display text-[19px] font-bold tracking-[-0.01em]">{fmtUSD(product.precio_usd)}</span>
          <span className="text-[13px] text-muted font-medium">≈ {fmtBs(product.precio_usd * rate)}</span>
        </div>
        <button
          disabled={out}
          onClick={() => add(product.id, 1, product.stock)}
          className="add mt-auto bg-action hover:bg-actionhover text-white font-semibold text-sm tracking-[0.02em] py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 min-h-11 transition-colors disabled:bg-disabled disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          {out ? 'Sin stock' : 'Añadir al carrito'}
        </button>
      </div>
    </article>
  )
}
