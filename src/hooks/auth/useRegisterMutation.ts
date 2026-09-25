import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { routes } from '../../constants/routes'
import { invalidateQuery } from '../../lib/queryClient'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import { HTTP_STATUS } from '../../shared/constants/http/statusCode'
import type { RegisterPayload } from '../../schemas/auth/registerSchema'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { User } from '../../types/auth'

export function useRegisterMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [queryKeys.auth.register],
    mutationFn: (payload: RegisterPayload) =>
      apiClient.post<ApiSuccessBodyWithData<User>>(apiRoutes.auth.register, payload),
    onSuccess: (response) => {
      if (response.status === HTTP_STATUS.CREATED) {
        invalidateQuery(queryClient, [queryKeys.auth.me])
        showSuccessToast(response.data.message)
        navigate(routes.home, { replace: true })
      } else {
        showErrorToast()
      }
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
