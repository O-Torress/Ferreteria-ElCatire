import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { user, profile, loading } = useAuth()
  const navigate = useNavigate()

  async function logout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const linkCls = ({ isActive }) =>
    'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ' +
    (isActive ? 'bg-brand text-white' : 'text-muted hover:text-ink hover:bg-canvas')

  return (
    <div className="min-h-screen bg-canvas">
      <header className="bg-ink text-white px-3.5 py-2.5 sticky top-0 z-[60] shadow-[0_2px_10px_rgba(26,37,54,0.18)]">
        <div className="max-w-[1280px] mx-auto px-3.5 py-2.5 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/img/fec.JPG" alt="Logo Ferretería El Catire" className="h-16 w-auto rounded-2xl object-contain shadow-[0_1px_4px_rgba(0,0,0,0.28)] transition-transform duration-200 hover:scale-105" />
            <span className="font-display font-semibold text-[25px] tracking-[-0.01em]">Panel de administración</span>
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:block text-lg text-white">
              {profile ? profile.nombre + ' ' + (profile.apellido || '') : user?.email}
            </span>
            <Link to="/" className="text-xs font-medium text-white/80 hover:text-white underline underline-offset-2 transition-colors">Ver catálogo</Link>
            <button onClick={logout} className="text-xs font-medium text-white/80 hover:text-white underline underline-offset-2 transition-colors">Cerrar sesión</button>
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
