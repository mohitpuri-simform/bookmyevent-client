import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import type { StripeElementStyle } from '@stripe/stripe-js'
import { Loader2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'

interface PaymentFormProps {
  clientSecret: string
  onPaid: () => void
  onFailed: (message: string) => void
}

const elementStyle: StripeElementStyle = {
  base: {
    fontSize: '14px',
    color: '#fafafa',
    iconColor: '#fafafa',
    '::placeholder': { color: '#b5b5b5' },
  },
  invalid: { color: '#f87171', iconColor: '#f87171' },
}

/**
 * Confirms the card payment client-side via Stripe.js. Does NOT declare the
 * booking successful here — `onPaid` only moves the parent into a
 * "confirming" state; the actual booking is only real once the backend's
 * webhook-driven finalisation is observed (see CheckoutPage).
 */
export function PaymentForm({ clientSecret, onPaid, onFailed }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!stripe || !elements) return

    const cardNumberElement = elements.getElement(CardNumberElement)
    if (!cardNumberElement) return

    setIsSubmitting(true)
    setError(null)

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardNumberElement },
    })

    setIsSubmitting(false)

    if (stripeError) {
      const message = stripeError.message ?? 'Payment failed. Please try again.'
      setError(message)
      onFailed(message)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      onPaid()
      return
    }

    const message = 'Payment did not complete. Please try again.'
    setError(message)
    onFailed(message)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Card number</label>
        <div className="rounded-md border border-input bg-background px-3 py-2.5">
          <CardNumberElement options={{ disableLink: true, style: elementStyle }} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Expiry</label>
        <div className="rounded-md border border-input bg-background px-3 py-2.5">
          <CardExpiryElement options={{ style: elementStyle }} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">CVC</label>
        <div className="rounded-md border border-input bg-background px-3 py-2.5">
          <CardCvcElement options={{ style: elementStyle }} />
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={!stripe || isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" />}
        {isSubmitting ? 'Processing payment…' : 'Pay now'}
      </Button>
    </form>
  )
}
