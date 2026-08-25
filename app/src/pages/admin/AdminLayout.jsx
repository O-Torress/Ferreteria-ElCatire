import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const iconBase = 'relative w-11 h-11 grid place-items-center rounded-lg border transition-colors '
const iconDefault = 'bg-white/15 border-white/40 text-white hover:bg-brand/20'
const iconActive = 'bg-brand/25 border-brand/60 text-brand'

export default function AdminLayout() {
  const { user, profile, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const onAdmin = location.pathname.startsWith('/admin')

  async function logout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const linkCls = ({ isActive }) =>
    'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ' +
    (isActive ? 'bg-brand text-white' : 'text-muted hover:text-ink hover:bg-canvas')

  return (
    <div className="min-h-screen bg-canvas">
      <header className="bg-ink text-white sticky top-0 z-[60] shadow-[0_2px_10px_rgba(26,37,54,0.18)]">
        <div className="max-w-[1280px] mx-auto px-3.5 py-2.5 hdr:px-5 flex flex-wrap items-center gap-4 min-h-16 lg:flex-nowrap">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/img/chamo.png" alt="Logo Ferretería El Catire" className="h-19 w-auto rounded-2xl transition-transform duration-200 hover:scale-105" />

          </Link>

          <div className="flex items-center gap-3 ml-auto">
            <Link
              to="/cuenta"
              className={iconBase + iconDefault}
              aria-label="Mi cuenta"
              title="Mi cuenta"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>

            <Link
              to="/admin/productos"
              className={iconBase + (onAdmin ? iconActive : iconDefault)}
              aria-label="Panel de administración"
              title="Panel de administración"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-5 py-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <nav className="flex md:flex-col gap-1.5">
          <NavLink to="/admin/productos" className={linkCls}>Productos</NavLink>
          <NavLink to="/admin/stock" className={linkCls}>Stock</NavLink>
        </nav>
        <main className="min-w-0">
          {loading ? (
            <div className="text-sm text-muted py-10 text-center">Cargando…</div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  )
}
