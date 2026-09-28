import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { invalidateQuery } from '../../lib/queryClient'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { Withdrawal } from '../../types/wallet'

export function useWithdrawMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [queryKeys.wallet.withdraw],
    mutationFn: () =>
      apiClient.post<ApiSuccessBodyWithData<Withdrawal>>(apiRoutes.organiser.walletWithdraw),
    onSuccess: (response) => {
      invalidateQuery(queryClient, [queryKeys.wallet.summary])
      showSuccessToast(response.data.message)
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
