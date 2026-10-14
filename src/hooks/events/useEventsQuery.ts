import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { PAGE_SIZE } from '../../constants/pagination'
import type { ApiSuccessBodyWithData, PaginatedResult } from '../../types/api'
import type { Event } from '../../types/events'

export interface EventsFilter {
  startFrom?: string
}

export function useEventsQuery(page: number, filter: EventsFilter = {}) {
  return useQuery({
    queryKey: [queryKeys.events.list, page, filter.startFrom],
    queryFn: async (): Promise<PaginatedResult<Event>> => {
      const { data } = await apiClient.get<ApiSuccessBodyWithData<Event[]>>(apiRoutes.events.list, {
        params: {
          page,
          limit: PAGE_SIZE,
          startFrom: filter.startFrom || undefined,
        },
      })
      return { items: data.data, pagination: data.meta!.pagination! }
    },
    placeholderData: keepPreviousData,
  })
}
