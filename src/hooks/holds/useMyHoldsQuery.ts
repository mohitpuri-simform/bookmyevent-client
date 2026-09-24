import { useQuery } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { MyHoldsResponse } from '../../types/holds'

/**
 * Polled rather than fetched once: the cart's effective expiry is
 * server-derived (the min TTL across held seats), and re-fetching is how
 * the UI notices a hold expired or was taken over without the user having
 * to do anything.
 */
export function useMyHoldsQuery(enabled = true) {
  return useQuery({
    queryKey: [queryKeys.holds.mine],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccessBodyWithData<MyHoldsResponse>>(
        apiRoutes.me.holds,
      )
      return data.data
    },
    enabled,
    refetchInterval: 5000,
  })
}
