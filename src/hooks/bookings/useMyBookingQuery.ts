import { useQuery } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { Booking } from '../../types/bookings'

/** One of the caller's own bookings by id — works for any booking, not just those on the first page of the list. */
export function useMyBookingQuery(bookingId: string | undefined) {
  return useQuery({
    queryKey: [queryKeys.bookings.mineDetail, bookingId],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccessBodyWithData<Booking>>(
        apiRoutes.me.booking(bookingId!),
      )
      return data.data
    },
    enabled: !!bookingId,
  })
}
