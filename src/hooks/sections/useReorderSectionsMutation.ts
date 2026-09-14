import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import { showErrorToast } from '../../lib/toast'
import { HTTP_STATUS } from '../../shared/constants/http/statusCode'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { Section } from '../../types/sections'

export function useReorderSectionsMutation(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [queryKeys.sections.reorder, eventId],
    mutationFn: (sectionIds: string[]) =>
      apiClient.patch<ApiSuccessBodyWithData<Section[]>>(
        apiRoutes.events.reorderSections(eventId),
        {
          sectionIds,
        },
      ),
    onSuccess: (response) => {
      if (response.status === HTTP_STATUS.OK) {
        queryClient.setQueryData([queryKeys.sections.list, eventId], response.data.data)
      } else {
        showErrorToast()
      }
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })
}
