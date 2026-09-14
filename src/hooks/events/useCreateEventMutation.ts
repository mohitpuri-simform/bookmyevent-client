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

export function useCreateEventMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [queryKeys.events.create],
    mutationFn: (payload: CreateEventPayload) =>
      apiClient.post<ApiSuccessBodyWithData<Event>>(apiRoutes.events.list, payload),
    onSuccess: (response) => {
      if (response.status === HTTP_STATUS.CREATED) {
        invalidateQuery(queryClient, [queryKeys.events.myEvents])
        invalidateQuery(queryClient, [queryKeys.events.list])
        showSuccessToast(response.data.message)
        navigate(routes.organizer.eventSections(response.data.data.id), { replace: true })
      } else {
        showErrorToast()
      }
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
