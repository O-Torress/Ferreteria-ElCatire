import { Navigate, Route, Routes } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import AccountPage from './pages/AccountPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminProducts from './pages/admin/AdminProducts'
import AdminStock from './pages/admin/AdminStock'
import { useAuth } from './context/AuthContext'

function AuthGuard({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return <div className="min-h-screen grid place-items-center text-muted text-sm">Cargando…</div>
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AdminGuard({ children }) {
  const { user, isAdmin, loading } = useAuth()
  if (loading) {
    return <div className="min-h-screen grid place-items-center text-muted text-sm">Cargando…</div>
  }
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/producto/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/restablecer" element={<ResetPasswordPage />} />
      <Route
        path="/cuenta"
        element={
          <AuthGuard>
            <AccountPage />
          </AuthGuard>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route path="productos" element={<AdminProducts />} />
        <Route path="stock" element={<AdminStock />} />
        <Route index element={<Navigate to="/admin/productos" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
