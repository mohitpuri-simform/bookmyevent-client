import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { invalidateQuery } from '../../lib/queryClient'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { HoldResult, MyHoldsResponse } from '../../types/holds'
import type { Section } from '../../types/sections'

/**
 * Holding a seat that just lost the race comes back as a 409, not an
 * unexpected error — this is normal, expected traffic, so the seat map and
 * cart are always refreshed regardless of outcome (CLAUDE.md: never let the
 * seat map go stale after a hold attempt).
 */
export function useHoldSeatMutation(eventId: string, eventName = '') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [queryKeys.holds.hold, eventId],
    mutationFn: (seatId: string) =>
      apiClient.post<ApiSuccessBodyWithData<HoldResult>>(apiRoutes.events.hold(eventId, seatId)),
    // Optimistic: mark the seat held and add it to the cart immediately; the
    // server stays the source of truth and the refetch in onSettled
    // reconciles (or onError rolls back to the snapshot, e.g. a 409 lost race).
    onMutate: async (seatId: string) => {
      const sectionsKey = [queryKeys.sections.list, eventId]
      const holdsKey = [queryKeys.holds.mine]
      await Promise.all([
        queryClient.cancelQueries({ queryKey: sectionsKey }),
        queryClient.cancelQueries({ queryKey: holdsKey }),
      ])
      const previousSections = queryClient.getQueryData<Section[]>(sectionsKey)
      const previousHolds = queryClient.getQueryData<MyHoldsResponse>(holdsKey)

      const seat = previousSections?.flatMap((s) => s.seats).find((s) => s.id === seatId)
      if (previousSections && seat) {
        queryClient.setQueryData<Section[]>(
          sectionsKey,
          previousSections.map((section) => ({
            ...section,
            seats: section.seats.map((s) => (s.id === seatId ? { ...s, status: 'HELD' } : s)),
          })),
        )
        const sameEventHolds = (previousHolds?.holds ?? []).filter((h) => h.eventId === eventId)
        const expiresAt =
          previousHolds?.effectiveExpiresAt ?? new Date(Date.now() + 5 * 60_000).toISOString()
        queryClient.setQueryData<MyHoldsResponse>(holdsKey, {
          holds: [
            ...sameEventHolds,
            {
              holdId: `optimistic-${seatId}`,
              seatId,
              eventId,
              eventName,
              sectionId: seat.sectionId,
              row: seat.row,
              col: seat.col,
              priceCents: seat.priceCents,
              expiresAt,
              remainingTtlSeconds: 0,
            },
          ],
          effectiveExpiresAt: expiresAt,
        })
      }
      return { previousSections, previousHolds }
    },
    onSuccess: (response) => {
      if (!response.data.data.idempotent) {
        showSuccessToast(response.data.message)
      }
    },
    onError: (error, _seatId, context) => {
      if (context?.previousSections) {
        queryClient.setQueryData([queryKeys.sections.list, eventId], context.previousSections)
      }
      if (context?.previousHolds) {
        queryClient.setQueryData([queryKeys.holds.mine], context.previousHolds)
      }
      showErrorToast(error)
    },
    onSettled: () => {
      invalidateQuery(queryClient, [queryKeys.sections.list, eventId])
      invalidateQuery(queryClient, [queryKeys.holds.mine])
    },
  })
}
