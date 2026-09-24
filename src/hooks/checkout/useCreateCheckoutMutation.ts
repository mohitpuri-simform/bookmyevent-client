import { useMutation } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { showErrorToast } from '../../lib/toast'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { CheckoutResult } from '../../types/checkout'

export function useCreateCheckoutMutation() {
  return useMutation({
    mutationKey: [queryKeys.checkout.create],
    mutationFn: (holdIds: string[]) =>
      apiClient.post<ApiSuccessBodyWithData<CheckoutResult>>(apiRoutes.checkout.create, {
        holdIds,
      }),
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
