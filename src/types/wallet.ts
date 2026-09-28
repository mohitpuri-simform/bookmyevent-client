export type StripeAccountStatus =
  'NOT_CONNECTED' | 'ONBOARDING_INCOMPLETE' | 'RESTRICTED' | 'ACTIVE'

export interface WalletSummary {
  stripeAccountStatus: StripeAccountStatus
  grossEarnedCents: number
  platformFeeCents: number
  stripeFeeCents: number
  withdrawnCents: number
  availableCents: number
}

export interface ConnectOnboardingLink {
  url: string
}

export type WithdrawalStatus = 'PENDING' | 'COMPLETED' | 'FAILED'

export interface Withdrawal {
  id: string
  organiserId: string
  stripeAccountId: string
  amountCents: number
  status: WithdrawalStatus
  stripeTransferId: string | null
  failureReason: string | null
  createdAt: string
  updatedAt: string
}
