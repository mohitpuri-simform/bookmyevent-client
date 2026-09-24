export interface HoldResult {
  holdId: string
  seatId: string
  expiresAt: string
  remainingTtlSeconds: number
  idempotent: boolean
}

export interface HoldView {
  holdId: string
  seatId: string
  eventId: string
  sectionId: string
  row: number
  col: number
  priceCents: number
  expiresAt: string
  remainingTtlSeconds: number
}

export interface MyHoldsResponse {
  holds: HoldView[]
  effectiveExpiresAt: string | null
}
