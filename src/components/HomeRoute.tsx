import { Loader2 } from 'lucide-react'
import { Navigate, Outlet } from 'react-router-dom'
import { routes } from '../constants/routes'
import { useAuth } from '../hooks/auth/useAuth'
import { ROLES } from '../shared/constants/auth/role'

/**
 * The marketing home page is for signed-out visitors only. Once logged in,
 * '/' bounces straight to the part of the app that role actually uses
 * instead of showing static content again.
 */
export function HomeRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (user?.role === ROLES.ORGANISER) {
    return <Navigate to={routes.organizer.events} replace />
  }

  if (user) {
    return <Navigate to={routes.events.list} replace />
  }

  return <Outlet />
}
