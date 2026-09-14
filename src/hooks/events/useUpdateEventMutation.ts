import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { routes } from '../../constants/routes'
import { invalidateQuery } from '../../lib/queryClient'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import { HTTP_STATUS } from '../../shared/constants/http/statusCode'
import type { CreateEventPayload } from '../../schemas/events/createEventSchema'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { Event } from '../../types/events'

export function useUpdateEventMutation(eventId: string) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [queryKeys.events.update, eventId],
    mutationFn: (payload: CreateEventPayload) =>
      apiClient.patch<ApiSuccessBodyWithData<Event>>(apiRoutes.events.detail(eventId), payload),
    onSuccess: (response) => {
      if (response.status === HTTP_STATUS.OK) {
        invalidateQuery(queryClient, [queryKeys.events.detail, eventId])
        invalidateQuery(queryClient, [queryKeys.events.myEvents])
        invalidateQuery(queryClient, [queryKeys.events.list])
        showSuccessToast(response.data.message)
        navigate(routes.organizer.eventSections(eventId), { replace: true })
      } else {
        showErrorToast()
      }
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
