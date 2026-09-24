import { AlertTriangle, ArrowLeft, Loader2, TicketCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { routes } from '../../constants/routes'
import { useMyBookingsQuery } from '../../hooks/bookings/useMyBookingsQuery'
import { formatVenue } from '../../lib/venue'

export function BookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const { data: bookings, isLoading } = useMyBookingsQuery()

  const booking = bookings?.find((b) => b.id === bookingId)

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-6 px-6 py-16">
      <Button variant="ghost" className="w-fit" asChild>
        <Link to={routes.bookings.list}>
          <ArrowLeft />
          Back to my bookings
        </Link>
      </Button>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && !booking && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <AlertTriangle className="size-10 text-muted-foreground" />
          <h1 className="text-lg font-semibold">Booking not found</h1>
          <p className="text-sm text-muted-foreground">
            This booking doesn't exist, or isn't one of yours.
          </p>
        </div>
      )}

      {booking && (
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
            <CardTitle>{booking.event?.name ?? 'Event'}</CardTitle>
            <TicketCheck className="size-5 shrink-0 text-primary" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            {booking.event && (
              <div>
                <p>{formatVenue(booking.event)}</p>
                <p className="text-muted-foreground">
                  {new Date(booking.event.date).toLocaleString()}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2 border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ticket reference</span>
                <span className="font-mono">{booking.ticketRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">${(booking.priceCents / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booked on</span>
                <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
