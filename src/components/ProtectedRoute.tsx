import { Loader2 } from 'lucide-react'
import { Navigate, Outlet } from 'react-router-dom'
import { routes } from '../constants/routes'
import { useAuth } from '../hooks/auth/useAuth'
import type { Role } from '../types/auth'

interface ProtectedRouteProps {
  allowedRoles?: Role[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={routes.auth.login} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={routes.home} replace />
  }

  return <Outlet />
}
