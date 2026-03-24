import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export function ProtectedRoute() {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-100">Chargement...</div>
    }

    if (!user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />
    }

    return <Outlet />
}
