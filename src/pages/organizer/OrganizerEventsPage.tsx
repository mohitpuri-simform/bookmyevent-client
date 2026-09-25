import { CalendarCheck, Loader2, Plus, TicketCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { routes } from '../../constants/routes'
import { useMyEventsQuery } from '../../hooks/events/useMyEventsQuery'
import { formatVenue } from '../../lib/venue'

function SeatOccupancy({ bookedSeats, totalSeats }: { bookedSeats: number; totalSeats: number }) {
  const emptySeats = totalSeats - bookedSeats
  const percentBooked = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0

  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percentBooked}%` }} />
      </div>
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{bookedSeats}</span> booked &middot;{' '}
        <span className="font-medium text-foreground">{emptySeats}</span> empty &middot;{' '}
        {totalSeats} total
      </p>
    </div>
  )
}

export function OrganizerEventsPage() {
  const { data: events, isLoading } = useMyEventsQuery()
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">My events</h1>
        <Button asChild>
          <Link to={routes.organizer.createEvent}>
            <Plus />
            Create event
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && events?.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            You haven't created any events yet.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {events?.map((event) => (
          <Link key={event.id} to={routes.organizer.eventSections(event.id)}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <span className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarCheck className="size-4.5" />
                </span>
                <CardTitle>{event.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">{formatVenue(event)}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(event.date).toLocaleDateString()} &ndash;{' '}
                  {new Date(event.endDate).toLocaleString()}
                </p>

                <SeatOccupancy
                  bookedSeats={event.bookedSeats ?? 0}
                  totalSeats={event.totalSeats ?? 0}
                />

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-fit"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigate(routes.organizer.eventBookings(event.id))
                  }}
                >
                  <TicketCheck />
                  View bookings
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
