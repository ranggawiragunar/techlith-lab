import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../features/auth/context'

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="loading-screen">Opening your local lab…</div>
  if (!user || user.role !== 'ADMIN') return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
