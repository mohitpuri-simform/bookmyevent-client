import { useQuery } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { Booking } from '../../types/bookings'

export function useMyBookingsQuery(options?: { refetchInterval?: number | false }) {
  return useQuery({
    queryKey: [queryKeys.bookings.mine],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccessBodyWithData<Booking[]>>(apiRoutes.me.bookings)
      return data.data
    },
    refetchInterval: options?.refetchInterval ?? false,
  })
}
