import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { invalidateQuery } from '../../lib/queryClient'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import { HTTP_STATUS } from '../../shared/constants/http/statusCode'
import type { UpdateProfilePayload } from '../../schemas/profile/updateProfileSchema'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { User } from '../../types/auth'

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [queryKeys.profile.update],
    mutationFn: (payload: UpdateProfilePayload) =>
      apiClient.patch<ApiSuccessBodyWithData<User>>(apiRoutes.profile, payload),
    onSuccess: (response) => {
      if (response.status === HTTP_STATUS.OK) {
        invalidateQuery(queryClient, [queryKeys.auth.me])
        showSuccessToast(response.data.message)
      } else {
        showErrorToast()
      }
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
