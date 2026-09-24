import { Loader2, TicketCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { routes } from '../../constants/routes'
import { useMyBookingsQuery } from '../../hooks/bookings/useMyBookingsQuery'
import { formatVenue } from '../../lib/venue'

export function MyBookingsPage() {
  const { data: bookings, isLoading } = useMyBookingsQuery()

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">My bookings</h1>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && bookings?.length === 0 && (
        <p className="text-sm text-muted-foreground">You don't have any confirmed bookings yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {bookings?.map((booking) => (
          <Link key={booking.id} to={routes.bookings.detail(booking.id)}>
            <Card className="transition-colors hover:bg-muted/30">
              <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="text-base">{booking.event?.name ?? 'Event'}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {booking.event && formatVenue(booking.event)}
                    {booking.event?.date && (
                      <> &middot; {new Date(booking.event.date).toLocaleDateString()}</>
                    )}
                  </p>
                </div>
                <TicketCheck className="size-5 shrink-0 text-primary" />
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm">
                <span className="font-mono text-muted-foreground">{booking.ticketRef}</span>
                <span className="font-medium">${(booking.priceCents / 100).toFixed(2)}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
