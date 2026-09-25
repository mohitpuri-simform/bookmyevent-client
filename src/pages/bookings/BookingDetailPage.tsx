import { AlertTriangle, ArrowLeft, Loader2, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { routes } from '../../constants/routes'
import { useMyBookingsQuery } from '../../hooks/bookings/useMyBookingsQuery'
import { posterGradient, posterIcon } from '../../lib/eventPoster'
import { formatVenue } from '../../lib/venue'

export function BookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const { data: bookings, isLoading } = useMyBookingsQuery()

  const booking = bookings?.find((b) => b.id === bookingId)
  const Icon = posterIcon(booking?.eventId ?? '')

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
        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <div
            className={`relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br p-6 ${posterGradient(booking.eventId)}`}
          >
            <Icon className="absolute size-24 text-foreground/10" />
            <span className="relative line-clamp-3 text-center font-heading text-xl font-bold text-foreground/90">
              {booking.event?.name ?? 'Event'}
            </span>
          </div>

          <div className="flex flex-col gap-4 p-5 text-sm">
            {booking.event && (
              <div className="flex flex-col gap-0.5">
                <p className="flex items-center gap-1.5 text-foreground">
                  <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                  {formatVenue(booking.event)}
                </p>
                <p className="text-muted-foreground">
                  {new Date(booking.event.date).toLocaleString(undefined, {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2 border-t border-dashed border-border pt-4">
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
          </div>
        </div>
      )}
    </div>
  )
}
