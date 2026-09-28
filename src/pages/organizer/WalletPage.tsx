import { Loader2, Wallet as WalletIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useConnectStripeMutation } from '../../hooks/wallet/useConnectStripeMutation'
import { useWalletSummaryQuery } from '../../hooks/wallet/useWalletSummaryQuery'
import { useWithdrawMutation } from '../../hooks/wallet/useWithdrawMutation'

function money(cents: number): string {
  return (cents / 100).toFixed(2)
}

export function WalletPage() {
  const { data: wallet, isLoading } = useWalletSummaryQuery()
  const connectMutation = useConnectStripeMutation()
  const withdrawMutation = useWithdrawMutation()

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Wallet</h1>
        <p className="text-sm text-muted-foreground">
          Track your earnings and withdraw your available balance to your bank account.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && wallet?.stripeAccountStatus === 'NOT_CONNECTED' && (
        <Card>
          <CardHeader>
            <span className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <WalletIcon className="size-4.5" />
            </span>
            <CardTitle>Connect your Stripe account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              To receive payouts for your ticket sales, connect a Stripe account. You'll be
              redirected to Stripe to complete a short onboarding flow.
            </p>
            <Button
              className="w-fit"
              onClick={() => connectMutation.mutate()}
              disabled={connectMutation.isPending}
            >
              {connectMutation.isPending && <Loader2 className="animate-spin" />}
              Connect your Stripe account
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading &&
        (wallet?.stripeAccountStatus === 'ONBOARDING_INCOMPLETE' ||
          wallet?.stripeAccountStatus === 'RESTRICTED') && (
          <Card>
            <CardHeader>
              <span className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <WalletIcon className="size-4.5" />
              </span>
              <CardTitle>Finish setting up your Stripe account</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                {wallet.stripeAccountStatus === 'RESTRICTED'
                  ? 'Stripe needs some more information before payouts can resume. Finish onboarding to fix this.'
                  : "You've started connecting a Stripe account, but onboarding isn't complete yet."}
              </p>
              <Button
                className="w-fit"
                onClick={() => connectMutation.mutate()}
                disabled={connectMutation.isPending}
              >
                {connectMutation.isPending && <Loader2 className="animate-spin" />}
                Finish setup
              </Button>
            </CardContent>
          </Card>
        )}

      {!isLoading && wallet?.stripeAccountStatus === 'ACTIVE' && (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Gross earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-semibold">${money(wallet.grossEarnedCents)}</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Platform fee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-semibold">${money(wallet.platformFeeCents)}</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Stripe fee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-semibold">${money(wallet.stripeFeeCents)}</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Withdrawn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-semibold">${money(wallet.withdrawnCents)}</span>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
              <CardTitle>Available balance</CardTitle>
              <Badge variant="secondary">Connected</Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <span className="text-3xl font-semibold">${money(wallet.availableCents)}</span>
              <Button
                className="w-fit"
                onClick={() => withdrawMutation.mutate()}
                disabled={wallet.availableCents <= 0 || withdrawMutation.isPending}
              >
                {withdrawMutation.isPending && <Loader2 className="animate-spin" />}
                Withdraw ${money(wallet.availableCents)}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
