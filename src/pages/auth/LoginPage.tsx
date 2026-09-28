import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Ticket } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { routes } from '../../constants/routes'
import { useLoginMutation } from '../../hooks/auth/useLoginMutation'
import { loginSchema, type LoginPayload } from '../../schemas/auth/loginSchema'

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({ resolver: zodResolver(loginSchema) })

  const loginMutation = useLoginMutation()

  function onSubmit(data: LoginPayload) {
    loginMutation.mutate(data)
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <span className="mb-1 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Ticket className="size-5" />
          </span>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Log in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" required>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" required>
                  Password
                </Label>
                <Link
                  to={routes.auth.forgotPassword}
                  className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending && <Loader2 className="animate-spin" />}
              {loginMutation.isPending ? 'Logging in…' : 'Log in'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                to={routes.auth.register}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
