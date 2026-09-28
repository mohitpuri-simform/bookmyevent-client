import { Loader2, MapPin, TicketCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { routes } from '../../constants/routes'
import { useMyBookingsQuery } from '../../hooks/bookings/useMyBookingsQuery'
import { posterGradient, posterIcon } from '../../lib/eventPoster'
import { seatLabel } from '../../lib/seatLabel'
import { formatVenue } from '../../lib/venue'

export function MyBookingsPage() {
  const { data: bookings, isLoading } = useMyBookingsQuery()

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">My bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your confirmed tickets, all in one place
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && bookings?.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <TicketCheck className="size-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            You don't have any confirmed bookings yet.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {bookings?.map((booking) => {
          const eventKey = booking.eventId
          const Icon = posterIcon(eventKey)
          return (
            <Link
              key={booking.id}
              to={routes.bookings.detail(booking.id)}
              className="group flex overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:ring-foreground/25"
            >
              <div
                className={`relative flex w-24 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br sm:w-32 ${posterGradient(eventKey)}`}
              >
                <Icon className="size-9 text-foreground/15 transition-transform duration-300 group-hover:scale-110 sm:size-11" />
              </div>

              <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                <div>
                  <h3 className="truncate text-sm font-semibold sm:text-base">
                    {booking.event?.name ?? 'Event'}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <MapPin className="size-3 shrink-0" />
                    {booking.event && formatVenue(booking.event)}
                  </p>
                  {booking.event?.date && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(booking.event.date).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-dashed border-border pt-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-xs text-muted-foreground">
                      {booking.ticketRef}
                    </span>
                    {booking.seat && (
                      <span className="text-xs text-muted-foreground">
                        {booking.seat.section.name} &middot;{' '}
                        {seatLabel(booking.seat.row, booking.seat.col, booking.seat.section.rows)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold">
                    ${(booking.priceCents / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
