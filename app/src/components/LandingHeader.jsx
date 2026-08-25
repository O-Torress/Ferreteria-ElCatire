import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const iconBase = 'relative w-11 h-11 grid place-items-center rounded-lg border transition-colors '
const iconDefault = 'bg-white/15 border-white/40 text-white hover:bg-brand/20'
const iconActive = 'bg-brand/25 border-brand/60 text-brand'

const navLink = ({ isActive }) =>
  'text-sm font-medium transition-colors ' + (isActive ? 'text-brand' : 'text-white/80 hover:text-white')

export default function LandingHeader({ onOpenCart }) {
  const { count } = useCart()
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileNav, setMobileNav] = useState(false)

  return (
    <header className="bg-ink text-white sticky top-0 z-[60] shadow-[0_2px_10px_rgba(26,37,54,0.18)]">
      <div className="max-w-[1280px] mx-auto px-3.5 py-2.5 hdr:px-5 flex flex-wrap items-center gap-4 min-h-16 lg:flex-nowrap">
        <Link to="/" className="flex items-center" aria-label="Ferretería El Catire, ir a Inicio">
          <img src="/img/chamo.png" alt="Logo Ferretería El Catire" className="h-19 w-auto transition-transform duration-200 hover:scale-105" />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 ml-auto mr-auto">
          <a href="#hero" className={navLink({ isActive: false })}>Inicio</a>
          <Link to="/catalogo" className={navLink({ isActive: location.pathname === '/catalogo' })}>Catálogo</Link>
          <a href="#sede" className={navLink({ isActive: false })}>Sedes</a>
          <a href="#contacto" className={navLink({ isActive: false })}>Contacto</a>
        </nav>

        <div className="flex items-center gap-3 ml-auto lg:ml-0">
          <button
            onClick={() => setMobileNav(!mobileNav)}
            className="lg:hidden w-11 h-11 grid place-items-center rounded-lg bg-white/15 border border-white/40 text-white hover:bg-brand/20 transition-colors"
            aria-label="Menú de navegación"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
              {mobileNav ? <><path d="m18 6-12 12"/><path d="m6 6 12 12"/></> : <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>}
            </svg>
          </button>

          <div className="hidden lg:flex items-center gap-3">
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
              className={iconBase + (location.pathname === '/cuenta' ? iconActive : iconDefault)}
              aria-label="Mi cuenta"
              title={user.email}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
          ) : (
            <Link to="/login" className={iconBase + iconDefault} aria-label="Iniciar sesión">
              <img src="/img/person.svg" alt="Persona" width="21" height="21" />
            </Link>
          )}

          {user && isAdmin && (
            <button
              onClick={() => navigate('/admin/productos')}
              className={iconBase + (location.pathname.startsWith('/admin') ? iconActive : iconDefault)}
              aria-label="Panel de administración"
              title="Panel de administración"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          )}
        </div>
        </div>
      </div>

      {mobileNav && (
        <div className="lg:hidden border-t border-white/10 bg-ink">
          <nav className="max-w-[1280px] mx-auto px-5 py-4 flex flex-col gap-3">
            <a href="#hero" onClick={() => setMobileNav(false)} className="text-sm font-medium text-white/80 hover:text-white py-2 transition-colors">Inicio</a>
            <Link to="/catalogo" onClick={() => setMobileNav(false)} className="text-sm font-medium text-white/80 hover:text-white py-2 transition-colors">Catálogo</Link>
            <a href="#sede" onClick={() => setMobileNav(false)} className="text-sm font-medium text-white/80 hover:text-white py-2 transition-colors">Sedes</a>
            <a href="#contacto" onClick={() => setMobileNav(false)} className="text-sm font-medium text-white/80 hover:text-white py-2 transition-colors">Contacto</a>
            <div className="flex items-center gap-3 pt-2 border-t border-white/10">
              <button onClick={() => { onOpenCart(); setMobileNav(false) }} className="relative w-11 h-11 grid place-items-center rounded-lg bg-white/15 border border-white/40 text-white hover:bg-brand/20 transition-colors" aria-label="Carrito">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2 3h2.2l2 12.2a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.3L20.5 8H5.2"/></svg>
                {count > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-[21px] h-[21px] px-[5px] rounded-full bg-stock text-ink border border-black/10 text-xs font-bold grid place-items-center">{count}</span>}
              </button>
              {user ? (
                <button onClick={() => { navigate('/cuenta'); setMobileNav(false) }} className="w-11 h-11 grid place-items-center rounded-lg bg-white/15 border border-white/40 text-white hover:bg-brand/20 transition-colors" aria-label="Mi cuenta">
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </button>
              ) : (
                <Link to="/login" className="w-11 h-11 grid place-items-center rounded-lg bg-white/15 border border-white/40 text-white hover:bg-brand/20 transition-colors" aria-label="Iniciar sesión">
                  <img src="/img/person.svg" alt="Persona" width="21" height="21" />
                </Link>
              )}
              {user && isAdmin && (
                <button onClick={() => { navigate('/admin/productos'); setMobileNav(false) }} className="w-11 h-11 grid place-items-center rounded-lg bg-white/15 border border-white/40 text-white hover:bg-brand/20 transition-colors" aria-label="Admin">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
