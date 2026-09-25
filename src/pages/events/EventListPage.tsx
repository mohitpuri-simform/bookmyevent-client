import { Loader2, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { routes } from '../../constants/routes'
import { useEventsQuery } from '../../hooks/events/useEventsQuery'
import { posterGradient, posterIcon } from '../../lib/eventPoster'
import { formatVenue } from '../../lib/venue'

export function EventListPage() {
  const { data: events, isLoading } = useEventsQuery()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Upcoming events</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Grab the best seats before they're gone
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && events?.length === 0 && (
        <p className="text-sm text-muted-foreground">No events yet — check back soon.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {events?.map((event) => {
          const Icon = posterIcon(event.id)
          return (
            <Link
              key={event.id}
              to={routes.events.detail(event.id)}
              className="group flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:ring-foreground/25"
            >
              <div
                className={`relative flex aspect-[2/3] items-center justify-center overflow-hidden bg-gradient-to-br p-4 ${posterGradient(event.id)}`}
              >
                <Icon className="absolute size-20 text-foreground/10 transition-transform duration-300 group-hover:scale-110" />
                <span className="relative line-clamp-4 text-center font-heading text-lg leading-tight font-bold text-foreground/90">
                  {event.name}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1.5 p-3">
                <h3 className="truncate text-sm font-semibold">{event.name}</h3>
                <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <MapPin className="size-3 shrink-0" />
                  {formatVenue(event)}
                </p>
                <Badge variant="secondary" className="mt-auto w-fit">
                  {new Date(event.date).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                  })}
                </Badge>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
