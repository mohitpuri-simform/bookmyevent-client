import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { PaginationMeta } from '../types/api'

interface PaginationProps {
  pagination: PaginationMeta | undefined
  onPageChange: (page: number, replace?: boolean) => void
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  // The list can shrink while you're on its last page (an event gets
  // unpublished, say) or the URL can say ?page=99. The API answers that with an
  // empty page, so step back to the last real page instead of showing "no results".
  useEffect(() => {
    if (pagination && pagination.page > pagination.totalPages) {
      onPageChange(pagination.totalPages, true)
    }
  }, [pagination, onPageChange])

  if (!pagination || pagination.totalPages <= 1) return null

  const { page, totalPages, total } = pagination

  function goTo(next: number) {
    onPageChange(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3 pt-2">
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of {totalPages} &middot;{' '}
        {total} total
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => goTo(page - 1)}>
          <ChevronLeft />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => goTo(page + 1)}
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </nav>
  )
}
