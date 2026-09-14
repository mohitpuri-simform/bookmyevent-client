import { CalendarCheck, Loader2, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { routes } from '../../constants/routes'
import { useMyEventsQuery } from '../../hooks/events/useMyEventsQuery'

export function OrganizerEventsPage() {
  const { data: events, isLoading } = useMyEventsQuery()

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
              <CardContent>
                <p className="text-sm text-muted-foreground">{event.venue}</p>
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
