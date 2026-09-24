import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { invalidateQuery } from '../../lib/queryClient'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import type { ApiSuccessBody } from '../../types/api'

export function useReleaseHoldMutation(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [queryKeys.holds.release],
    mutationFn: (holdId: string) =>
      apiClient.delete<ApiSuccessBody>(apiRoutes.holds.release(holdId)),
    onSuccess: (response) => {
      invalidateQuery(queryClient, [queryKeys.sections.list, eventId])
      invalidateQuery(queryClient, [queryKeys.holds.mine])
      showSuccessToast(response.data.message)
    },
    onError: (error) => {
      invalidateQuery(queryClient, [queryKeys.sections.list, eventId])
      showErrorToast(error)
    },
  })
}
