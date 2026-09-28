import { useMutation } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { showErrorToast } from '../../lib/toast'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { ConnectOnboardingLink } from '../../types/wallet'

/**
 * On success this navigates the browser away to Stripe's hosted onboarding
 * — the app's first real external redirect, since Express onboarding needs
 * an actual page navigation rather than an in-app route.
 */
export function useConnectStripeMutation() {
  return useMutation({
    mutationKey: [queryKeys.wallet.connect],
    mutationFn: () =>
      apiClient.post<ApiSuccessBodyWithData<ConnectOnboardingLink>>(
        apiRoutes.organiser.stripeConnect,
      ),
    onSuccess: (response) => {
      window.location.href = response.data.data.url
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
