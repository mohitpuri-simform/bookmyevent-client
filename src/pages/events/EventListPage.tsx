import { ListFilter, Loader2, MapPin, X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '../../components/Pagination'
import { routes } from '../../constants/routes'
import { useAuth } from '../../hooks/auth/useAuth'
import { useEventsQuery } from '../../hooks/events/useEventsQuery'
import { usePageParam } from '../../hooks/usePageParam'
import { hasEventEnded } from '../../lib/eventTime'
import { posterGradient, posterIcon } from '../../lib/eventPoster'
import { formatEventEnd, formatEventStart, todayInputValue } from '../../lib/eventTime'
import { formatVenue } from '../../lib/venue'
import { ROLES } from '../../shared/constants/auth/role'

export function EventListPage() {
  const [page, setPage] = usePageParam()
  const [searchParams, setSearchParams] = useSearchParams()
  const startFrom = searchParams.get('startFrom') ?? ''
  const { data, isLoading } = useEventsQuery(page, { startFrom })

  // The filter lives in the URL; changing or clearing it sends you back to page 1.
  function setStartFrom(value: string) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      if (value) params.set('startFrom', value)
      else params.delete('startFrom')
      params.delete('page')
      return params
    })
  }
  const hasFilter = !!startFrom
  const events = data?.items
  const { user } = useAuth()
  const isOrganiser = user?.role === ROLES.ORGANISER

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {isOrganiser ? 'My events' : 'Upcoming events'}
          </h1>
          {!isOrganiser && (
            <p className="mt-1 text-sm text-muted-foreground">
              Grab the best seats before they're gone
            </p>
          )}
        </div>

        <div
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${hasFilter ? 'border-primary bg-primary/10' : 'border-border bg-muted/20'}`}
        >
          <ListFilter
            className={`size-4 shrink-0 ${hasFilter ? 'text-primary' : 'text-muted-foreground'}`}
          />
          <Label htmlFor="startFrom" className="text-xs whitespace-nowrap text-muted-foreground">
            Filter · Starts from
          </Label>
          <Input
            id="startFrom"
            type="date"
            className="h-8 w-40 cursor-pointer"
            value={startFrom}
            min={todayInputValue()}
            onClick={(e) => e.currentTarget.showPicker?.()}
            onChange={(e) => setStartFrom(e.target.value)}
          />
          {hasFilter && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Clear filter"
              onClick={() => setStartFrom('')}
            >
              <X />
            </Button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && events?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {hasFilter ? 'No events start in this date range.' : 'No events yet — check back soon.'}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {events?.map((event) => {
          const Icon = posterIcon(event.id)
          const ended = hasEventEnded(event)
          return (
            <Link
              key={event.id}
              to={routes.events.detail(event.id)}
              className="group flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:ring-foreground/25"
            >
              <div
                className={`relative flex aspect-[2/3] items-center justify-center overflow-hidden bg-gradient-to-br p-4 ${posterGradient(event.id)}`}
              >
                {ended && (
                  <Badge className="absolute top-2 left-2 z-10 bg-destructive text-white">
                    Ended
                  </Badge>
                )}
                <Icon className="absolute size-20 text-foreground/10 transition-transform duration-300 group-hover:scale-110" />
                <span
                  className={`relative line-clamp-4 text-center font-heading text-lg leading-tight font-bold text-foreground/90 ${ended ? 'opacity-50' : ''}`}
                >
                  {event.name}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1.5 p-3">
                <h3 className="truncate text-sm font-semibold">{event.name}</h3>
                <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <MapPin className="size-3 shrink-0" />
                  {formatVenue(event)}
                </p>
                <p className="mt-auto text-xs text-muted-foreground">
                  {formatEventStart(event.date)}
                </p>
                <p className="text-xs text-muted-foreground">{formatEventEnd(event.endDate)}</p>
              </div>
            </Link>
          )
        })}
      </div>

      <Pagination pagination={data?.pagination} onPageChange={setPage} />
    </div>
  )
}
