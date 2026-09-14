import { Loader2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { SeatMapGrid } from '../../components/seating/SeatMapGrid'
import { SectionDivider } from '../../components/seating/SectionDivider'
import { StageBanner } from '../../components/seating/StageBanner'
import { useEventQuery } from '../../hooks/events/useEventQuery'
import { useSectionsQuery } from '../../hooks/sections/useSectionsQuery'

export function EventSeatMapPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const { data: event, isLoading: isLoadingEvent } = useEventQuery(eventId)
  const { data: sections, isLoading: isLoadingSections } = useSectionsQuery(eventId)

  const isLoading = isLoadingEvent || isLoadingSections

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-16">
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {event && (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{event.name}</h1>
          <p className="text-sm text-muted-foreground">
            {event.venue} &middot; {new Date(event.date).toLocaleDateString()}
          </p>
        </div>
      )}

      {!isLoading && sections?.length === 0 && (
        <p className="text-sm text-muted-foreground">Seating for this event isn't set up yet.</p>
      )}

      {sections && sections.length > 0 && (
        <div className="flex flex-col gap-6 rounded-lg border border-border bg-muted/10 p-4 sm:p-6">
          <StageBanner />
          {sections.map((section) => (
            <div key={section.id} className="flex flex-col gap-3">
              <SectionDivider
                label={section.name}
                sublabel={`$${(section.priceCents / 100).toFixed(2)} per seat`}
              />
              <div className="overflow-x-auto rounded-md bg-muted/20 p-3">
                <SeatMapGrid
                  rows={section.rows}
                  seatsPerRow={section.seatsPerRow}
                  aisleAfterSeat={section.aisleAfterSeat}
                  seats={section.seats}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
