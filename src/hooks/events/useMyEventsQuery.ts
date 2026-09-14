import { useQuery } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { Event } from '../../types/events'

export function useMyEventsQuery() {
  return useQuery({
    queryKey: [queryKeys.events.myEvents],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccessBodyWithData<Event[]>>(
        apiRoutes.organiser.events,
      )
      return data.data
    },
  })
}
