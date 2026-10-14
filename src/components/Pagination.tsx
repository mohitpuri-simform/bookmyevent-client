import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { PaginationMeta } from '../types/api'

interface PaginationProps {
  pagination: PaginationMeta | undefined
  onPageChange: (page: number, replace?: boolean) => void
}

// 1 … 4 5 6 … 20: first, last, and a window around the current page.
function getPageItems(page: number, totalPages: number): Array<number | 'gap'> {
  const pages = new Set([1, totalPages])
  for (let p = page - 1; p <= page + 1; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p)
  }
  const sorted = [...pages].sort((a, b) => a - b)
  const items: Array<number | 'gap'> = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1]! > 1) items.push('gap')
    items.push(p)
  })
  return items
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
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => goTo(page - 1)}
        >
          <ChevronLeft />
        </Button>
        {getPageItems(page, totalPages).map((item, i) =>
          item === 'gap' ? (
            <span key={`gap-${i}`} className="px-1 text-sm text-muted-foreground">
              &hellip;
            </span>
          ) : (
            <Button
              key={item}
              variant={item === page ? 'default' : 'outline'}
              size="sm"
              aria-label={`Page ${item}`}
              aria-current={item === page ? 'page' : undefined}
              onClick={() => item !== page && goTo(item)}
            >
              {item}
            </Button>
          ),
        )}
        <Button
          variant="outline"
          size="sm"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => goTo(page + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </nav>
  )
}
