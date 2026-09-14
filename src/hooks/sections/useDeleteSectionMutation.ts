import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { invalidateQuery } from '../../lib/queryClient'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import { HTTP_STATUS } from '../../shared/constants/http/statusCode'
import type { ApiSuccessBody } from '../../types/api'

export function useDeleteSectionMutation(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [queryKeys.sections.delete, eventId],
    mutationFn: (sectionId: string) =>
      apiClient.delete<ApiSuccessBody>(apiRoutes.events.section(eventId, sectionId)),
    onSuccess: (response) => {
      if (response.status === HTTP_STATUS.OK) {
        invalidateQuery(queryClient, [queryKeys.sections.list, eventId])
        showSuccessToast(response.data.message)
      } else {
        showErrorToast()
      }
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
