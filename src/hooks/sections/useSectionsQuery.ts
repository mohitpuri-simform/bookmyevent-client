import { useQuery } from '@tanstack/react-query'
import { apiRoutes } from '../../api/apiRoutes'
import { apiClient } from '../../api/client'
import { queryKeys } from '../../api/queryKeys'
import type { ApiSuccessBodyWithData } from '../../types/api'
import type { Section } from '../../types/sections'

export function useSectionsQuery(eventId: string | undefined) {
  return useQuery({
    queryKey: [queryKeys.sections.list, eventId],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiSuccessBodyWithData<Section[]>>(
        apiRoutes.events.sections(eventId!),
      )
      return data.data
    },
    enabled: !!eventId,
  })
}
