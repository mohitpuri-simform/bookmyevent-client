import { useQueryClient } from '@tanstack/react-query'
import { CalendarX, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { toast } from 'sonner'
import { MAX_HOLDS_PER_USER } from '../../constants/holds'
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
import { formatEventEnd, formatEventStart, hasEventEnded } from '../../lib/eventTime'
import { formatVenue } from '../../lib/venue'

export function EventSeatMapPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const queryClient = useQueryClient()

  const { data: event, isLoading: isLoadingEvent } = useEventQuery(eventId)
  const { data: sections, isLoading: isLoadingSections } = useSectionsQuery(eventId)
  const { data: allHolds } = useMyHoldsQuery()

  // The cart is scoped to the event being viewed; holds on other events
  // are never shown here (the server drops them once a new event is held).
  const myHolds = useMemo(() => {
    if (!allHolds) return allHolds
    const holds = allHolds.holds.filter((h) => h.eventId === eventId)
    const effectiveExpiresAt = holds.length
      ? holds.reduce((min, h) => (h.expiresAt < min ? h.expiresAt : min), holds[0]!.expiresAt)
      : null
    return { holds, effectiveExpiresAt }
  }, [allHolds, eventId])

  // Leaving the event page without going to checkout releases its holds.
  const holdIdsRef = useRef<string[]>([])
  const proceedingToCheckout = useRef(false)
  holdIdsRef.current = myHolds?.holds.map((h) => h.holdId) ?? []
  useEffect(() => {
    proceedingToCheckout.current = false
    return () => {
      if (proceedingToCheckout.current) return
      const ids = holdIdsRef.current
      if (ids.length === 0) return
      void Promise.allSettled(ids.map((id) => apiClient.delete(apiRoutes.holds.release(id)))).then(
        () => {
          invalidateQuery(queryClient, [queryKeys.holds.mine])
          invalidateQuery(queryClient, [queryKeys.sections.list])
        },
      )
    }
  }, [eventId, queryClient])

  const holdSeatMutation = useHoldSeatMutation(eventId ?? '', event?.name)
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
  const eventEnded = event ? hasEventEnded(event) : false

  function handleSeatClick(seatId: string) {
    if (eventEnded) return

    const existingHoldId = holdBySeatId.get(seatId)
    if (existingHoldId) {
      releaseHoldMutation.mutate(existingHoldId)
      return
    }

    if ((myHolds?.holds.length ?? 0) >= MAX_HOLDS_PER_USER) {
      toast.error(`You can hold at most ${MAX_HOLDS_PER_USER} seats at a time`)
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

      {event && eventEnded && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <CalendarX className="size-5 shrink-0" />
          <div>
            <p className="font-medium">This event has ended</p>
            <p className="text-destructive/80">Seats can no longer be booked.</p>
          </div>
        </div>
      )}

      {event && (
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{event.name}</h1>
          <p className="text-sm text-muted-foreground">
            {formatVenue(event)} &middot; {formatEventStart(event.date)} &middot;{' '}
            {formatEventEnd(event.endDate)}
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
                  disabled={
                    eventEnded || holdSeatMutation.isPending || releaseHoldMutation.isPending
                  }
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
        onCheckout={() => {
          proceedingToCheckout.current = true
        }}
      />
    </div>
  )
}
