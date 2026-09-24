import { Loader2, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { routes } from '../../constants/routes'
import type { HoldView } from '../../types/holds'
import { HoldCountdown } from './HoldCountdown'

interface CartBarProps {
  holds: HoldView[]
  effectiveExpiresAt: string | null
  isReleasing: boolean
  onClearAll: () => void
  onExpire: () => void
}

export function CartBar({
  holds,
  effectiveExpiresAt,
  isReleasing,
  onClearAll,
  onExpire,
}: CartBarProps) {
  const navigate = useNavigate()

  if (holds.length === 0 || !effectiveExpiresAt) {
    return null
  }

  const totalCents = holds.reduce((sum, h) => sum + h.priceCents, 0)

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-3">
          <ShoppingCart className="size-5 text-primary" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {holds.length} seat{holds.length > 1 ? 's' : ''} held &middot; $
              {(totalCents / 100).toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">
              Hold expires in <HoldCountdown expiresAt={effectiveExpiresAt} onExpire={onExpire} />
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onClearAll} disabled={isReleasing}>
            {isReleasing && <Loader2 className="animate-spin" />}
            Clear
          </Button>
          <Button size="sm" onClick={() => navigate(routes.checkout)}>
            Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}
