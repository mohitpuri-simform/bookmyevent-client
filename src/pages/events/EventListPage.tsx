import { CalendarCheck, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { routes } from '../../constants/routes'
import { useEventsQuery } from '../../hooks/events/useEventsQuery'
import { formatVenue } from '../../lib/venue'

export function EventListPage() {
  const { data: events, isLoading } = useEventsQuery()

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Upcoming events</h1>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && events?.length === 0 && (
        <p className="text-sm text-muted-foreground">No events yet — check back soon.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {events?.map((event) => (
          <Link key={event.id} to={routes.events.detail(event.id)}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <span className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarCheck className="size-4.5" />
                </span>
                <CardTitle>{event.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{formatVenue(event)}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
