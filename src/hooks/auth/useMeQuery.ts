import { useQuery } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { User } from '../../types/auth'

export function useMeQuery() {
  return useQuery({
    queryKey: [queryKeys.auth.me],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccessBodyWithData<User>>(apiRoutes.auth.me)
      return data.data
    },
  })
}
