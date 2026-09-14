import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { ArrowLeft, KeyRound, Loader2, Mail } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { routes } from '../../constants/routes'
import { useForgotPasswordMutation } from '../../hooks/auth/useForgotPasswordMutation'
import { useResetPasswordMutation } from '../../hooks/auth/useResetPasswordMutation'
import {
  forgotPasswordSchema,
  type ForgotPasswordPayload,
} from '../../schemas/auth/forgotPasswordSchema'
import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from '../../schemas/auth/resetPasswordFormSchema'

type Step = 'email' | 'reset'

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email')

  const emailForm = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordSchema),
  })
  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
  })

  const email = emailForm.watch('email')

  const sendCodeMutation = useForgotPasswordMutation(() => {
    if (step === 'email') setStep('reset')
  })
  const resetPasswordMutation = useResetPasswordMutation()

  function handleResend() {
    sendCodeMutation.mutate({ email: emailForm.getValues('email') })
  }

  function onSendCode(data: ForgotPasswordPayload) {
    sendCodeMutation.mutate(data)
  }

  function onResetPassword(data: ResetPasswordFormValues) {
    resetPasswordMutation.mutate({
      email: emailForm.getValues('email'),
      otp: data.otp,
      newPassword: data.newPassword,
    })
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <span className="mb-1 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            {step === 'email' ? <Mail className="size-5" /> : <KeyRound className="size-5" />}
          </span>
          <CardTitle className="text-xl">
            {step === 'email' ? 'Forgot your password?' : 'Enter your code'}
          </CardTitle>
          <CardDescription>
            {step === 'email'
              ? "We'll email you a 6-digit code to reset it"
              : `Enter the code sent to ${email} and choose a new password`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' ? (
            <form
              className="flex flex-col gap-5"
              onSubmit={emailForm.handleSubmit(onSendCode)}
              noValidate
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!emailForm.formState.errors.email}
                  {...emailForm.register('email')}
                />
                {emailForm.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={sendCodeMutation.isPending}>
                {sendCodeMutation.isPending && <Loader2 className="animate-spin" />}
                {sendCodeMutation.isPending ? 'Sending code…' : 'Send code'}
              </Button>

              <Link
                to={routes.auth.login}
                className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                Back to log in
              </Link>
            </form>
          ) : (
            <form
              className="flex flex-col gap-5"
              onSubmit={resetForm.handleSubmit(onResetPassword)}
              noValidate
            >
              <div className="flex flex-col items-center gap-2">
                <Label>Verification code</Label>
                <Controller
                  control={resetForm.control}
                  name="otp"
                  render={({ field }) => (
                    <InputOTP
                      maxLength={6}
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      pattern={REGEXP_ONLY_DIGITS}
                      autoFocus
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
                {resetForm.formState.errors.otp && (
                  <p className="text-xs text-destructive">
                    {resetForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!resetForm.formState.errors.newPassword}
                  {...resetForm.register('newPassword')}
                />
                {resetForm.formState.errors.newPassword && (
                  <p className="text-xs text-destructive">
                    {resetForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!resetForm.formState.errors.confirmPassword}
                  {...resetForm.register('confirmPassword')}
                />
                {resetForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {resetForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending}>
                {resetPasswordMutation.isPending && <Loader2 className="animate-spin" />}
                {resetPasswordMutation.isPending ? 'Resetting password…' : 'Reset password'}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="size-3.5" />
                  Use a different email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={sendCodeMutation.isPending}
                  className="font-medium text-foreground underline-offset-4 hover:underline disabled:opacity-50"
                >
                  {sendCodeMutation.isPending ? 'Sending…' : 'Resend code'}
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
