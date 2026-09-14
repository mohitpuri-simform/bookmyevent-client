import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { invalidateQuery } from '../../lib/queryClient'
import { showErrorToast, showSuccessToast } from '../../lib/toast'
import { HTTP_STATUS } from '../../shared/constants/http/statusCode'
import type { CreateSectionPayload } from '../../schemas/sections/createSectionSchema'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { Section } from '../../types/sections'

export function useCreateSectionMutation(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [queryKeys.sections.create, eventId],
    mutationFn: (payload: CreateSectionPayload) => {
      const body = {
        name: payload.name,
        rows: payload.rows,
        seatsPerRow: payload.seatsPerRow,
        priceCents: Math.round(payload.price * 100),
        aisleAfterSeat: payload.aisleAfterSeat ?? null,
      }
      return apiClient.post<ApiSuccessBodyWithData<Section>>(
        apiRoutes.events.sections(eventId),
        body,
      )
    },
    onSuccess: (response) => {
      if (response.status === HTTP_STATUS.CREATED) {
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
