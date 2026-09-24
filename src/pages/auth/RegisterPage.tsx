import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarCheck, Loader2, Ticket, User as UserIcon } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { routes } from '../../constants/routes'
import { useRegisterMutation } from '../../hooks/auth/useRegisterMutation'
import { registerSchema, type RegisterFormValues } from '../../schemas/auth/registerSchema'
import { ROLES } from '../../shared/constants/auth/role'
import type { Role } from '../../types/auth'

const roleOptions: { value: Role; label: string; description: string; icon: typeof UserIcon }[] = [
  {
    value: ROLES.USER,
    label: 'Browse and book events',
    description: 'Find events, hold a seat, and check out',
    icon: UserIcon,
  },
  {
    value: ROLES.ORGANISER,
    label: 'Organise my own events',
    description: 'Create events and manage bookings',
    icon: CalendarCheck,
  },
]

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: ROLES.USER },
  })

  const registerMutation = useRegisterMutation()

  function onSubmit({ confirmPassword: _confirmPassword, ...payload }: RegisterFormValues) {
    registerMutation.mutate(payload)
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <span className="mb-1 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Ticket className="size-5" />
          </span>
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Start booking or organising events in minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>I want to</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="gap-2">
                    {roleOptions.map(({ value, label, description, icon: Icon }) => (
                      <Label
                        key={value}
                        htmlFor={`role-${value}`}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 rounded-lg border border-input p-3 transition-colors hover:bg-muted/50',
                          field.value === value && 'border-primary bg-primary/5',
                        )}
                      >
                        <RadioGroupItem value={value} id={`role-${value}`} className="mt-0.5" />
                        <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <span className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">{label}</span>
                          <span className="text-xs font-normal text-muted-foreground">
                            {description}
                          </span>
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending && <Loader2 className="animate-spin" />}
              {registerMutation.isPending ? 'Creating account…' : 'Create account'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to={routes.auth.login}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
