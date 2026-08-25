import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const iconBase = 'relative w-11 h-11 grid place-items-center rounded-lg border transition-colors '
const iconDefault = 'bg-white/15 border-white/40 text-white hover:bg-brand/20'
const iconActive = 'bg-brand/25 border-brand/60 text-brand'

export default function Header({ query, onQuery, onOpenCart, hideSearch }) {
  const { count } = useCart()
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileSearch, setMobileSearch] = useState(false)

  const onCuenta = location.pathname === '/cuenta'
  const onAdmin = location.pathname.startsWith('/admin')

  return (
    <header className="bg-ink text-white sticky top-0 z-[60] shadow-[0_2px_10px_rgba(26,37,54,0.18)]">
      <div className="max-w-[1280px] mx-auto px-3.5 py-2.5 hdr:px-5 flex flex-wrap items-center gap-4 min-h-16 lg:flex-nowrap">
        <Link to="/" className="flex items-center" aria-label="Ferretería El Catire, ir a Inicio">
          <img src="/img/chamo.png" alt="Logo Ferretería El Catire" className="h-19 w-auto transition-transform duration-200 hover:scale-105" />
        </Link>

        {!hideSearch && (
          <div data-od-id="search-bar" className="search-pill flex-1 hidden xs:flex items-center bg-white rounded-lg overflow-hidden max-w-[520px] mx-auto shadow-[0_1px_3px_rgba(0,0,0,0.18)] order-3 w-full xs:order-none xs:w-auto">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="ml-3.5 self-center text-muted flex-none"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <input
              type="search"
              placeholder="Busca martillos, pinturas, cables…"
              aria-label="Buscar productos"
              value={query || ''}
              onChange={(e) => onQuery(e.target.value)}
              className="flex-1 min-w-0 outline-none px-3.5 py-3 text-sm text-ink bg-transparent placeholder:text-muted focus-visible:outline-none"
            />
            <button
              className="bg-brand hover:bg-branddeep text-white px-3.5 py-3 font-semibold text-sm tracking-[0.02em] flex items-center gap-1.5 transition-colors focus-visible:outline-none"
              onClick={() => { if (query && query.trim()) navigate('/catalogo') }}
            >
              Buscar
            </button>
          </div>
        )}

        <div className={'flex items-center gap-3 order-2 ml-auto' + (hideSearch ? '' : ' lg:ml-0 lg:order-none')}>
          {!hideSearch && (
            <button
              data-od-id="mobile-search-button"
              onClick={() => setMobileSearch(true)}
              className="w-11 h-11 grid place-items-center rounded-lg bg-white/15 border border-white/40 text-white hover:bg-brand/20 transition-colors xs:hidden"
              aria-label="Buscar productos"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            </button>
          )}

          <button
            onClick={onOpenCart}
            className="relative w-11 h-11 grid place-items-center rounded-lg bg-white/15 border border-white/40 text-white hover:bg-brand/20 transition-colors"
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
              onClick={() => navigate('/cuenta')}
              className={iconBase + (onCuenta ? iconActive : iconDefault)}
              aria-label="Mi cuenta: editar datos y cerrar sesión"
              title={user.email}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
          ) : (
            <Link
              to="/login"
              className={iconBase + iconDefault}
              aria-label="Iniciar sesión o registrarse"
            >
              <img src="/img/person.svg" alt="Persona" width="21" height="21" />
            </Link>
          )}

          {user && isAdmin && (
            <button
              onClick={() => navigate('/admin/productos')}
              className={iconBase + (onAdmin ? iconActive : iconDefault)}
              aria-label="Panel de administración"
              title="Panel de administración"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          )}
        </div>
      </div>

      {!hideSearch && mobileSearch && (
        <div data-od-id="mobile-search-bar" className="fixed inset-x-0 top-0 z-[70] bg-ink px-3 py-2.5 flex items-center gap-2 xs:hidden shadow-[0_2px_10px_rgba(26,37,54,0.25)]">
          <button
            onClick={() => setMobileSearch(false)}
            className="w-11 h-11 grid place-items-center rounded-lg text-white hover:bg-white/15 transition-colors flex-none"
            aria-label="Cerrar búsqueda"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (query && query.trim()) navigate('/catalogo')
              setMobileSearch(false)
            }}
            className="search-pill flex-1 min-w-0 flex items-center bg-white rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.18)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="ml-3 self-center text-muted flex-none"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <input
              type="search"
              autoFocus
              placeholder="Busca martillos, pinturas, cables…"
              aria-label="Buscar productos"
              value={query || ''}
              onChange={(e) => onQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') setMobileSearch(false) }}
              className="flex-1 min-w-0 outline-none px-3 py-3 text-sm text-ink bg-transparent placeholder:text-muted focus-visible:outline-none"
            />
          </form>
        </div>
      )}
    </header>
  )
}
