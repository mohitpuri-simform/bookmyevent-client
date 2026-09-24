import { useQuery } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { Booking } from '../../types/bookings'

/**
 * Scoped entirely by the backend from the auth token — this only ever
 * passes the eventId, never an organiser id, so it's impossible for the
 * frontend to accidentally ask for another organiser's bookings.
 */
export function useOrganiserBookingsQuery(eventId: string | undefined) {
  return useQuery({
    queryKey: [queryKeys.bookings.organiser, eventId],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccessBodyWithData<Booking[]>>(
        apiRoutes.organiser.eventBookings(eventId!),
      )
      return data.data
    },
    enabled: !!eventId,
  })
}
