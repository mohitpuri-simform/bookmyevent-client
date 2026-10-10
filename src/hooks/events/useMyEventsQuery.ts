import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { PAGE_SIZE } from '../../constants/pagination'
import type { ApiSuccessBodyWithData, PaginatedResult } from '../../types/api'
import type { Event } from '../../types/events'

export function useMyEventsQuery(page: number) {
  return useQuery({
    queryKey: [queryKeys.events.myEvents, page],
    queryFn: async (): Promise<PaginatedResult<Event>> => {
      const { data } = await apiClient.get<ApiSuccessBodyWithData<Event[]>>(
        apiRoutes.organiser.events,
        { params: { page, limit: PAGE_SIZE } },
      )
      return { items: data.data, pagination: data.meta!.pagination! }
    },
    placeholderData: keepPreviousData,
  })
}
