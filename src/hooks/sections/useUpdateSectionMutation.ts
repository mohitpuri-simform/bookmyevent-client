import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { invalidateQuery } from '../../lib/queryClient'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import { HTTP_STATUS } from '../../shared/constants/http/statusCode'
import type { UpdateSectionPayload } from '../../schemas/sections/updateSectionSchema'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { Section } from '../../types/sections'

export function useUpdateSectionMutation(eventId: string, sectionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [queryKeys.sections.update, sectionId],
    mutationFn: (payload: UpdateSectionPayload) => {
      const body = {
        name: payload.name,
        priceCents: Math.round(payload.price * 100),
      }
      return apiClient.patch<ApiSuccessBodyWithData<Section>>(
        apiRoutes.events.section(eventId, sectionId),
        body,
      )
    },
    onSuccess: (response) => {
      if (response.status === HTTP_STATUS.OK) {
        invalidateQuery(queryClient, [queryKeys.sections.list, eventId])
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
