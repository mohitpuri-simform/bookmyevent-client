import { CalendarCheck, PartyPopper, Ticket, TicketCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { routes } from '../../constants/routes'
import { useAuth } from '../../hooks/auth/useAuth'
import { ROLES } from '../../shared/constants/auth/role'

export function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  const isOrganiser = user.role === ROLES.ORGANISER

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome, {user.name}</h1>
        <Badge variant="secondary">{isOrganiser ? 'Organiser' : 'User'}</Badge>
      </div>

      <Card>
        <CardHeader>
          <span className="mb-1 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {isOrganiser ? <CalendarCheck className="size-5" /> : <Ticket className="size-5" />}
          </span>
          <CardTitle>{isOrganiser ? 'Organiser dashboard' : 'Your bookings'}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <PartyPopper className="size-4 shrink-0" />
            {isOrganiser
              ? 'Manage your events and their seating sections.'
              : 'Browse events, or check the tickets you’ve already booked.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="w-fit">
              {isOrganiser ? (
                <Link to={routes.organizer.events}>My events</Link>
              ) : (
                <Link to={routes.events.list}>Browse events</Link>
              )}
            </Button>
            {!isOrganiser && (
              <Button asChild variant="outline" className="w-fit">
                <Link to={routes.bookings.list}>
                  <TicketCheck />
                  View my bookings
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
