import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { invalidateQuery } from '../../lib/queryClient'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { HoldResult } from '../../types/holds'

/**
 * Holding a seat that just lost the race comes back as a 409, not an
 * unexpected error — this is normal, expected traffic, so the seat map and
 * cart are always refreshed regardless of outcome (CLAUDE.md: never let the
 * seat map go stale after a hold attempt).
 */
export function useHoldSeatMutation(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [queryKeys.holds.hold, eventId],
    mutationFn: (seatId: string) =>
      apiClient.post<ApiSuccessBodyWithData<HoldResult>>(apiRoutes.events.hold(eventId, seatId)),
    onSuccess: (response) => {
      invalidateQuery(queryClient, [queryKeys.sections.list, eventId])
      invalidateQuery(queryClient, [queryKeys.holds.mine])
      if (!response.data.data.idempotent) {
        showSuccessToast(response.data.message)
      }
    },
    onError: (error) => {
      invalidateQuery(queryClient, [queryKeys.sections.list, eventId])
      showErrorToast(error)
    },
  })
}
