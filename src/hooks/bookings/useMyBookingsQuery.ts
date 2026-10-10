import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { PAGE_SIZE } from '../../constants/pagination'
import type { ApiSuccessBodyWithData, PaginatedResult } from '../../types/api'
import type { Booking } from '../../types/bookings'

interface MyBookingsOptions {
  page?: number
  limit?: number
  refetchInterval?: number | false
}

export function useMyBookingsQuery({
  page = 1,
  limit = PAGE_SIZE,
  refetchInterval = false,
}: MyBookingsOptions = {}) {
  return useQuery({
    queryKey: [queryKeys.bookings.mine, page, limit],
    queryFn: async (): Promise<PaginatedResult<Booking>> => {
      const { data } = await apiClient.get<ApiSuccessBodyWithData<Booking[]>>(
        apiRoutes.me.bookings,
        { params: { page, limit } },
      )
      return { items: data.data, pagination: data.meta!.pagination! }
    },
    placeholderData: keepPreviousData,
    refetchInterval,
  })
}
