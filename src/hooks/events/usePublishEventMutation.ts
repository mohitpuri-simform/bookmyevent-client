import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { invalidateQuery } from '../../lib/queryClient'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import { HTTP_STATUS } from '../../shared/constants/http/statusCode'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { Event } from '../../types/events'

export function usePublishEventMutation(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [queryKeys.events.publish, eventId],
    mutationFn: () =>
      apiClient.post<ApiSuccessBodyWithData<Event>>(apiRoutes.events.publish(eventId)),
    onSuccess: (response) => {
      if (response.status === HTTP_STATUS.OK) {
        invalidateQuery(queryClient, [queryKeys.events.myEventDetail, eventId])
        invalidateQuery(queryClient, [queryKeys.events.myEvents])
        invalidateQuery(queryClient, [queryKeys.events.list])
        invalidateQuery(queryClient, [queryKeys.events.detail, eventId])
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
