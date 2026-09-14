import { useQuery } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { Event } from '../../types/events'

export function useEventQuery(eventId: string | undefined) {
  return useQuery({
    queryKey: [queryKeys.events.detail, eventId],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccessBodyWithData<Event>>(
        apiRoutes.events.detail(eventId!),
      )
      return data.data
    },
    enabled: !!eventId,
  })
}
