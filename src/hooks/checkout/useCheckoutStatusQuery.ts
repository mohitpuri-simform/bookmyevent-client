import { useQuery } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { CheckoutStatusAttempt } from '../../types/checkout'

/**
 * Polled only while the parent is in the "confirming" state (see
 * CheckoutPage), alongside the bookings query — this is what lets the
 * frontend tell "still waiting on the webhook" apart from "the webhook
 * already voided/refunded this because the hold expired first", instead of
 * polling bookings forever for a row that will never arrive.
 */
export function useCheckoutStatusQuery(paymentIntentId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: [queryKeys.checkout.status, paymentIntentId],
    queryFn: async () => {
      const { data } = await apiClient.get<
        ApiSuccessBodyWithData<{ attempts: CheckoutStatusAttempt[] }>
      >(apiRoutes.checkout.status(paymentIntentId!))
      return data.data.attempts
    },
    enabled: enabled && !!paymentIntentId,
    refetchInterval: enabled ? 2000 : false,
  })
}
