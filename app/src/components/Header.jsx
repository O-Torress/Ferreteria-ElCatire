import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Header({ query, onQuery, onOpenCart }) {
  const { count } = useCart()
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="bg-brand text-white sticky top-0 z-[60] shadow-[0_2px_10px_rgba(26,37,54,0.18)]">
      <div className="max-w-[1280px] mx-auto px-3.5 py-2.5 hdr:px-5 flex flex-wrap items-center gap-4 min-h-16 lg:flex-nowrap">
        <Link to="/" className="flex items-center" aria-label="Ferretería El Catire, ir a Inicio">
          <img src="/img/fec.JPG" alt="Logo Ferretería El Catire" className="h-16 w-auto rounded-2xl object-contain shadow-[0_1px_4px_rgba(0,0,0,0.28)] transition-transform duration-200 hover:scale-105" />
        </Link>

        <div className="flex-1 flex bg-white rounded-lg overflow-hidden max-w-[520px] mx-auto shadow-[0_1px_3px_rgba(0,0,0,0.18)] order-3 w-full lg:order-none lg:w-auto">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="ml-3.5 self-center text-muted flex-none"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input
            type="search"
            placeholder="Busca martillos, pinturas, cables…"
            aria-label="Buscar productos"
            value={query || ''}
            onChange={(e) => onQuery(e.target.value)}
            className="flex-1 min-w-0 outline-none px-3.5 py-3 text-sm text-ink bg-transparent placeholder:text-muted"
          />
          <button
            className="bg-ink hover:bg-inkdeep text-white px-[18px] font-semibold text-sm tracking-[0.02em] flex items-center gap-1.5 transition-colors"
            onClick={() => { if (query && query.trim()) navigate('/') }}
          >
            Buscar
          </button>
        </div>

        <div className="flex items-center gap-3 order-2 ml-auto lg:ml-0 lg:order-none">
          <button
            onClick={onOpenCart}
            className="relative w-11 h-11 grid place-items-center rounded-lg bg-white/15 border border-white/40 text-white hover:bg-white/30 transition-colors"
            aria-label="Abrir carrito de compras"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2 3h2.2l2 12.2a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.3L20.5 8H5.2"/></svg>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[21px] h-[21px] px-[5px] rounded-full bg-stock text-ink border border-black/10 text-xs font-bold grid place-items-center shadow-[0_1px_3px_rgba(0,0,0,0.35)]">
                {count}
              </span>
            )}
          </button>

          {user ? (
            <button
              onClick={() => navigate(isAdmin ? '/admin/productos' : '/')}
              className="relative w-11 h-11 grid place-items-center rounded-lg bg-white/15 border border-white/40 text-white hover:bg-white/30 transition-colors"
              aria-label={isAdmin ? 'Ir al panel de administración' : 'Ir a inicio de sesión'}
              title={user.email}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
          ) : (
            <Link
              to="/login"
              className="relative w-11 h-11 grid place-items-center rounded-lg bg-white/15 border border-white/40 text-white hover:bg-white/30 transition-colors"
              aria-label="Iniciar sesión o registrarse"
            >
              <img src="/img/person.svg" alt="Persona" width="21" height="21" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
