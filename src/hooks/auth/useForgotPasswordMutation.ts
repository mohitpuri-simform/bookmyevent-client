import { useMutation } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import { HTTP_STATUS } from '../../shared/constants/http/statusCode'
import type { ForgotPasswordPayload } from '../../schemas/auth/forgotPasswordSchema'
import type { ApiSuccessBody } from '../../types/api'

export function useForgotPasswordMutation(onSuccess?: () => void) {
  return useMutation({
    mutationKey: [queryKeys.auth.forgotPassword],
    mutationFn: (payload: ForgotPasswordPayload) =>
      apiClient.post<ApiSuccessBody>(apiRoutes.auth.forgotPassword, payload),
    onSuccess: (response) => {
      if (response.status === HTTP_STATUS.OK) {
        showSuccessToast(response.data.message)
        onSuccess?.()
      } else {
        showErrorToast()
      }
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
