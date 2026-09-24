import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { queryKeys } from '../../api/queryKeys'
import { CartBar } from '../../components/checkout/CartBar'
import { SeatMapGrid, type SeatDisplayStatus } from '../../components/seating/SeatMapGrid'
import { SectionDivider } from '../../components/seating/SectionDivider'
import { StageBanner } from '../../components/seating/StageBanner'
import { useEventQuery } from '../../hooks/events/useEventQuery'
import { useHoldSeatMutation } from '../../hooks/holds/useHoldSeatMutation'
import { useMyHoldsQuery } from '../../hooks/holds/useMyHoldsQuery'
import { useReleaseHoldMutation } from '../../hooks/holds/useReleaseHoldMutation'
import { useSectionsQuery } from '../../hooks/sections/useSectionsQuery'
import { invalidateQuery } from '../../lib/queryClient'
import { formatVenue } from '../../lib/venue'

export function EventSeatMapPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const queryClient = useQueryClient()

  const { data: event, isLoading: isLoadingEvent } = useEventQuery(eventId)
  const { data: sections, isLoading: isLoadingSections } = useSectionsQuery(eventId)
  const { data: myHolds } = useMyHoldsQuery()

  const holdSeatMutation = useHoldSeatMutation(eventId ?? '')
  const releaseHoldMutation = useReleaseHoldMutation(eventId ?? '')

  function handleHoldExpire() {
    invalidateQuery(queryClient, [queryKeys.sections.list, eventId])
    invalidateQuery(queryClient, [queryKeys.holds.mine])
  }

  const holdBySeatId = useMemo(() => {
    const map = new Map<string, string>()
    for (const h of myHolds?.holds ?? []) map.set(h.seatId, h.holdId)
    return map
  }, [myHolds])

  const isLoading = isLoadingEvent || isLoadingSections

  function handleSeatClick(seatId: string) {
    const existingHoldId = holdBySeatId.get(seatId)
    if (existingHoldId) {
      releaseHoldMutation.mutate(existingHoldId)
      return
    }

    holdSeatMutation.mutate(seatId)
  }

  function seatDisplayStatus(
    seatId: string,
    rawStatus: 'AVAILABLE' | 'HELD' | 'BOOKED',
  ): SeatDisplayStatus {
    if (rawStatus === 'BOOKED') return 'BOOKED'
    if (rawStatus === 'HELD') return holdBySeatId.has(seatId) ? 'HELD_BY_ME' : 'HELD_BY_OTHER'
    return 'AVAILABLE'
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-16 pb-28">
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {event && (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{event.name}</h1>
          <p className="text-sm text-muted-foreground">
            {formatVenue(event)} &middot; {new Date(event.date).toLocaleDateString()}
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
                  seats={section.seats.map((seat) => ({
                    id: seat.id,
                    row: seat.row,
                    col: seat.col,
                    status: seatDisplayStatus(seat.id, seat.status),
                  }))}
                  onSeatClick={handleSeatClick}
                  disabled={holdSeatMutation.isPending || releaseHoldMutation.isPending}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <CartBar
        holds={myHolds?.holds ?? []}
        effectiveExpiresAt={myHolds?.effectiveExpiresAt ?? null}
        isReleasing={releaseHoldMutation.isPending}
        onClearAll={() => {
          for (const h of myHolds?.holds ?? []) releaseHoldMutation.mutate(h.holdId)
        }}
        onExpire={handleHoldExpire}
      />
    </div>
  )
}
