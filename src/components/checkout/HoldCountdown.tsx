import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface HoldCountdownProps {
  /** Server-issued expiry — the only source of truth for the deadline (never computed locally). */
  expiresAt: string
  onExpire?: () => void
  className?: string
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

/**
 * Ticks once a second purely for display; the deadline itself always comes
 * from `expiresAt` as issued by the server, never derived client-side.
 */
export function HoldCountdown({ expiresAt, onExpire, className }: HoldCountdownProps) {
  const target = new Date(expiresAt).getTime()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const remainingMs = target - now
  const isExpired = remainingMs <= 0
  const isUrgent = remainingMs > 0 && remainingMs <= 30_000

  const onExpireRef = useRef(onExpire)
  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    if (isExpired) onExpireRef.current?.()
  }, [isExpired])

  return (
    <span
      className={cn(
        'font-mono tabular-nums',
        isExpired && 'text-destructive',
        isUrgent && 'text-destructive animate-pulse',
        className,
      )}
    >
      {isExpired ? 'Expired' : formatRemaining(remainingMs)}
    </span>
  )
}
