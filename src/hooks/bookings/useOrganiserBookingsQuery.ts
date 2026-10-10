import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { PAGE_SIZE } from '../../constants/pagination'
import type { ApiSuccessBodyWithData, PaginatedResult } from '../../types/api'
import type { Booking } from '../../types/bookings'

/**
 * Scoped entirely by the backend from the auth token — this only ever
 * passes the eventId, never an organiser id, so it's impossible for the
 * frontend to accidentally ask for another organiser's bookings.
 */
export function useOrganiserBookingsQuery(eventId: string | undefined, page: number) {
  return useQuery({
    queryKey: [queryKeys.bookings.organiser, eventId, page],
    queryFn: async (): Promise<PaginatedResult<Booking>> => {
      const { data } = await apiClient.get<ApiSuccessBodyWithData<Booking[]>>(
        apiRoutes.organiser.eventBookings(eventId!),
        { params: { page, limit: PAGE_SIZE } },
      )
      return { items: data.data, pagination: data.meta!.pagination! }
    },
    enabled: !!eventId,
    placeholderData: keepPreviousData,
  })
}
