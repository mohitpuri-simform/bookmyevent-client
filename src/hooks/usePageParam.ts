import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Current page, kept in the URL (`?page=2`) so refresh, back/forward and shared
 * links all land on the same page. Anything missing or invalid means page 1.
 */
export function usePageParam() {
  const [searchParams, setSearchParams] = useSearchParams()

  const raw = Number(searchParams.get('page'))
  const page = Number.isInteger(raw) && raw >= 1 ? raw : 1

  const setPage = useCallback(
    (next: number, replace = false) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev)
          if (next <= 1) params.delete('page')
          else params.set('page', String(next))
          return params
        },
        { replace },
      )
    },
    [setSearchParams],
  )

  return [page, setPage] as const
}
