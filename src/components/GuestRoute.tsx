import { Loader2 } from 'lucide-react'
import { Navigate, Outlet } from 'react-router-dom'
import { routes } from '../constants/routes'
import { useAuth } from '../hooks/auth/useAuth'

export function GuestRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (user) {
    return <Navigate to={routes.dashboard} replace />
  }

  return <Outlet />
}
