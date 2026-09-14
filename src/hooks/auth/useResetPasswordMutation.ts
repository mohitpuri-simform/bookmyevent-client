import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { routes } from '../../constants/routes'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import { HTTP_STATUS } from '../../shared/constants/http/statusCode'
import type { ResetPasswordPayload } from '../../schemas/auth/resetPasswordSchema'
import type { ApiSuccessBody } from '../../types/api'

export function useResetPasswordMutation() {
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [queryKeys.auth.resetPassword],
    mutationFn: (payload: ResetPasswordPayload) =>
      apiClient.post<ApiSuccessBody>(apiRoutes.auth.resetPassword, payload),
    onSuccess: (response) => {
      if (response.status === HTTP_STATUS.OK) {
        showSuccessToast(response.data.message)
        navigate(routes.auth.login, { replace: true })
      } else {
        showErrorToast()
      }
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
