import { Elements } from '@stripe/react-stripe-js'
import { AlertTriangle, Loader2, TicketCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HoldCountdown } from '../../components/checkout/HoldCountdown'
import { PaymentForm } from '../../components/checkout/PaymentForm'
import { routes } from '../../constants/routes'
import { MAX_PAGE_SIZE } from '../../constants/pagination'
import { useMyBookingsQuery } from '../../hooks/bookings/useMyBookingsQuery'
import { useCheckoutStatusQuery } from '../../hooks/checkout/useCheckoutStatusQuery'
import { useCreateCheckoutMutation } from '../../hooks/checkout/useCreateCheckoutMutation'
import { useMyHoldsQuery } from '../../hooks/holds/useMyHoldsQuery'
import { getStripe } from '../../lib/stripe'
import type { CheckoutResult } from '../../types/checkout'

type CheckoutState =
  'reviewing' | 'starting' | 'paying' | 'confirming' | 'confirmed' | 'voided' | 'failed' | 'expired'

const VOIDED_ATTEMPT_STATUSES = new Set(['FAILED', 'VOIDED', 'EXPIRED_BEFORE_CONFIRMATION'])

export function CheckoutPage() {
  const navigate = useNavigate()
  const { data: myHolds, isLoading: isLoadingHolds } = useMyHoldsQuery()
  const createCheckoutMutation = useCreateCheckoutMutation()

  const [state, setState] = useState<CheckoutState>('reviewing')
  const [checkout, setCheckout] = useState<CheckoutResult | null>(null)
  const [failureMessage, setFailureMessage] = useState<string | null>(null)

  const { data: bookingsPage } = useMyBookingsQuery({
    limit: MAX_PAGE_SIZE,
    refetchInterval: state === 'confirming' ? 2000 : false,
  })
  const bookings = bookingsPage?.items

  // A Stripe.js success callback only means Stripe took the charge — the
  // backend's webhook can still reject it (e.g. the hold expired before the
  // confirmation arrived, see backend's finalizeAttempt) and refund it
  // instead of creating a booking. Polling bookings alone can't tell that
  // apart from "still waiting on the webhook", so it would spin forever;
  // this is what lets that case reach an explicit, terminal screen instead.
  const { data: checkoutStatus } = useCheckoutStatusQuery(
    checkout?.paymentIntentId ?? null,
    state === 'confirming',
  )

  // Only real once the backend's own booking rows show up for every hold in
  // this checkout — a Stripe.js success callback alone is never enough
  // (CLAUDE.md: "don't assume success locally"). Derived during render
  // rather than via a setState effect, so there's no extra render pass.
  const isConfirmed = useMemo(() => {
    if (state !== 'confirming' || !checkout) return false
    const confirmedHoldIds = new Set((bookings ?? []).map((b) => b.holdId))
    return checkout.holds.every((h) => confirmedHoldIds.has(h.holdId))
  }, [bookings, state, checkout])

  const isVoided = useMemo(() => {
    if (state !== 'confirming' || isConfirmed) return false
    return (checkoutStatus ?? []).some((a) => VOIDED_ATTEMPT_STATUSES.has(a.status))
  }, [checkoutStatus, state, isConfirmed])

  const effectiveState = isConfirmed ? 'confirmed' : isVoided ? 'voided' : state

  async function handleStartPayment() {
    if (!myHolds || myHolds.holds.length === 0) return
    setState('starting')
    try {
      const response = await createCheckoutMutation.mutateAsync(myHolds.holds.map((h) => h.holdId))
      setCheckout(response.data.data)
      setState('paying')
    } catch {
      setState('reviewing')
    }
  }

  if (isLoadingHolds) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (effectiveState === 'confirmed') {
    const ticketRefs = (bookings ?? [])
      .filter((b) => checkout?.holds.some((h) => h.holdId === b.holdId))
      .map((b) => b.ticketRef)

    return (
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <TicketCheck className="size-10 text-primary" />
        <h1 className="text-xl font-semibold">Booking confirmed</h1>
        <p className="text-sm text-muted-foreground">
          Your ticket reference{ticketRefs.length > 1 ? 's' : ''}:
        </p>
        <div className="flex flex-col gap-1">
          {ticketRefs.map((ref) => (
            <span key={ref} className="font-mono text-sm">
              {ref}
            </span>
          ))}
        </div>
        <Button onClick={() => navigate(routes.bookings.list)}>View my bookings</Button>
      </div>
    )
  }

  if (effectiveState === 'voided') {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <AlertTriangle className="size-10 text-destructive" />
        <h1 className="text-xl font-semibold">Payment refunded</h1>
        <p className="text-sm text-muted-foreground">
          Your card was charged, but your hold expired just before we could confirm it — the charge
          is being refunded automatically. The seat is no longer reserved for you.
        </p>
        <Button onClick={() => navigate(routes.events.list)}>Choose a seat</Button>
      </div>
    )
  }

  if (state === 'expired') {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <AlertTriangle className="size-10 text-destructive" />
        <h1 className="text-xl font-semibold">Your hold expired</h1>
        <p className="text-sm text-muted-foreground">
          Those seats are no longer reserved for you. Please pick again — they may already be held
          by someone else.
        </p>
        <Button onClick={() => navigate(routes.events.list)}>Choose a seat</Button>
      </div>
    )
  }

  if ((state === 'reviewing' || state === 'starting') && (!myHolds || myHolds.holds.length === 0)) {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <AlertTriangle className="size-10 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground">
          Select a seat from an event to start checkout.
        </p>
        <Button onClick={() => navigate(routes.events.list)}>Browse events</Button>
      </div>
    )
  }

  const holds = myHolds?.holds ?? []
  const totalCents = holds.reduce((sum, h) => sum + h.priceCents, 0)

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-6 px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {(state === 'reviewing' || state === 'paying') && myHolds?.effectiveExpiresAt && (
            <CardDescription>
              Hold expires in{' '}
              <HoldCountdown
                expiresAt={myHolds.effectiveExpiresAt}
                onExpire={() => setState('expired')}
              />
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ul className="flex flex-col gap-1 text-sm">
            {holds.map((h) => (
              <li key={h.holdId} className="flex justify-between">
                <span>
                  Row {h.row}, Seat {h.col}
                </span>
                <span>${(h.priceCents / 100).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-border pt-3 text-sm font-medium">
            <span>Total</span>
            <span>${(totalCents / 100).toFixed(2)}</span>
          </div>

          {state === 'reviewing' && (
            <Button onClick={handleStartPayment} disabled={createCheckoutMutation.isPending}>
              {createCheckoutMutation.isPending && <Loader2 className="animate-spin" />}
              Continue to payment
            </Button>
          )}

          {state === 'starting' && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {state === 'paying' && checkout && (
            <Elements stripe={getStripe()}>
              <PaymentForm
                clientSecret={checkout.clientSecret}
                onPaid={() => setState('confirming')}
                onFailed={(message) => {
                  setFailureMessage(message)
                  setState('failed')
                }}
              />
            </Elements>
          )}

          {state === 'confirming' && (
            <div className="flex flex-col items-center gap-2 py-4 text-sm text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              Confirming your booking…
            </div>
          )}

          {state === 'failed' && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-destructive">
                {failureMessage ?? 'Payment failed or was abandoned.'}
              </p>
              <p className="text-xs text-muted-foreground">
                Your seat may still be held — you can try paying again before it expires.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setFailureMessage(null)
                  setCheckout(null)
                  setState('reviewing')
                }}
              >
                Try again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
