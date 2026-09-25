import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { routes } from '../../constants/routes'
import { invalidateQuery } from '../../lib/queryClient'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import { HTTP_STATUS } from '../../shared/constants/http/statusCode'
import type { LoginPayload } from '../../schemas/auth/loginSchema'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { User } from '../../types/auth'

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()

  return useMutation({
    mutationKey: [queryKeys.auth.login],
    mutationFn: (payload: LoginPayload) =>
      apiClient.post<ApiSuccessBodyWithData<User>>(apiRoutes.auth.login, payload),
    onSuccess: (response) => {
      if (response.status === HTTP_STATUS.OK) {
        invalidateQuery(queryClient, [queryKeys.auth.me])
        showSuccessToast(response.data.message)
        const redirectTo = (location.state as { from?: string } | null)?.from ?? routes.home
        navigate(redirectTo, { replace: true })
      } else {
        showErrorToast()
      }
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
