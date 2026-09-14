import { MutationCache, QueryCache, QueryClient, type QueryKey } from '@tanstack/react-query'
import { isDeadSessionError } from '../api/client'
import { queryKeys } from '../api/queryKeys'

function handlePossibleDeadSession(error: unknown): void {
  if (isDeadSessionError(error)) {
    queryClient.setQueryData([queryKeys.auth.me], null)
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handlePossibleDeadSession }),
  mutationCache: new MutationCache({ onError: handlePossibleDeadSession }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

export function invalidateQuery(client: QueryClient, queryKey: QueryKey) {
  return client.invalidateQueries({ queryKey })
}
