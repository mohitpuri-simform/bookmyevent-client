import { useQuery } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { WalletSummary } from '../../types/wallet'

export function useWalletSummaryQuery() {
  return useQuery({
    queryKey: [queryKeys.wallet.summary],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccessBodyWithData<WalletSummary>>(
        apiRoutes.organiser.wallet,
      )
      return data.data
    },
  })
}
