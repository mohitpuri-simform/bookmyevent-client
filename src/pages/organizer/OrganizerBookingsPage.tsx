import { AxiosError } from 'axios'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMyEventQuery } from '../../hooks/events/useMyEventQuery'
import { useOrganiserBookingsQuery } from '../../hooks/bookings/useOrganiserBookingsQuery'
import { formatVenue } from '../../lib/venue'

export function OrganizerBookingsPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const { data: event } = useMyEventQuery(eventId)
  const { data: bookings, isLoading, isError, error } = useOrganiserBookingsQuery(eventId)

  const isForbiddenOrMissing =
    isError && error instanceof AxiosError && [403, 404].includes(error.response?.status ?? 0)

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {event ? `${event.name} — bookings` : 'Event bookings'}
        </h1>
        {event && <p className="text-sm text-muted-foreground">{formatVenue(event)}</p>}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {isForbiddenOrMissing && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <AlertTriangle className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            This event doesn't exist, or isn't one of yours.
          </p>
        </div>
      )}

      {!isLoading && !isError && bookings?.length === 0 && (
        <p className="text-sm text-muted-foreground">No bookings yet for this event.</p>
      )}

      <div className="flex flex-col gap-3">
        {bookings?.map((booking) => (
          <Card key={booking.id}>
            <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
              <CardTitle className="text-base">{booking.user?.name ?? 'Guest'}</CardTitle>
              <span className="font-mono text-xs text-muted-foreground">{booking.ticketRef}</span>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{booking.user?.email}</span>
              <span className="font-medium">${(booking.priceCents / 100).toFixed(2)}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
