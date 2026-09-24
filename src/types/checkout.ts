export interface CheckoutHold {
  holdId: string
  seatId: string
  eventId: string
  priceCents: number
}

export interface CheckoutResult {
  paymentIntentId: string
  clientSecret: string
  amountCents: number
  holds: CheckoutHold[]
}

export type PaymentAttemptStatus =
  'PENDING' | 'CONFIRMED' | 'FAILED' | 'VOIDED' | 'EXPIRED_BEFORE_CONFIRMATION'

export interface CheckoutStatusAttempt {
  holdId: string
  status: PaymentAttemptStatus
}
