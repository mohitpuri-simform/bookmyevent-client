import { useMutation } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import type { ApiSuccessBody } from '../../types/api'

export interface CreateSupportTicketPayload {
  subject: string
  message: string
  context?: Record<string, unknown>
}

export function useCreateSupportTicketMutation() {
  return useMutation({
    mutationKey: [queryKeys.support.createTicket],
    mutationFn: (payload: CreateSupportTicketPayload) =>
      apiClient.post<ApiSuccessBody>(apiRoutes.support.tickets, payload),
    onSuccess: (response) => {
      showSuccessToast(response.data.message)
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
