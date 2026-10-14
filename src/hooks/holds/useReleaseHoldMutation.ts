import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { invalidateQuery } from '../../lib/queryClient'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import type { ApiSuccessBody } from '../../types/api'
import type { MyHoldsResponse } from '../../types/holds'
import type { Section } from '../../types/sections'

export function useReleaseHoldMutation(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [queryKeys.holds.release],
    mutationFn: (holdId: string) =>
      apiClient.delete<ApiSuccessBody>(apiRoutes.holds.release(holdId)),
    // Optimistic: free the seat and drop it from the cart right away.
    onMutate: async (holdId: string) => {
      const sectionsKey = [queryKeys.sections.list, eventId]
      const holdsKey = [queryKeys.holds.mine]
      await Promise.all([
        queryClient.cancelQueries({ queryKey: sectionsKey }),
        queryClient.cancelQueries({ queryKey: holdsKey }),
      ])
      const previousSections = queryClient.getQueryData<Section[]>(sectionsKey)
      const previousHolds = queryClient.getQueryData<MyHoldsResponse>(holdsKey)
      const hold = previousHolds?.holds.find((h) => h.holdId === holdId)

      if (hold && previousHolds) {
        const holds = previousHolds.holds.filter((h) => h.holdId !== holdId)
        queryClient.setQueryData<MyHoldsResponse>(holdsKey, {
          holds,
          effectiveExpiresAt: holds.length
            ? holds.reduce((min, h) => (h.expiresAt < min ? h.expiresAt : min), holds[0]!.expiresAt)
            : null,
        })
        if (previousSections) {
          queryClient.setQueryData<Section[]>(
            sectionsKey,
            previousSections.map((section) => ({
              ...section,
              seats: section.seats.map((s) =>
                s.id === hold.seatId ? { ...s, status: 'AVAILABLE' } : s,
              ),
            })),
          )
        }
      }
      return { previousSections, previousHolds }
    },
    onSuccess: (response) => {
      showSuccessToast(response.data.message)
    },
    onError: (error, _holdId, context) => {
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
