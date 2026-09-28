import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '../../hooks/auth/useAuth'
import { useUpdateProfileMutation } from '../../hooks/profile/useUpdateProfileMutation'
import {
  updateProfileSchema,
  type UpdateProfilePayload,
} from '../../schemas/profile/updateProfileSchema'
import { ROLES } from '../../shared/constants/auth/role'

export function ProfilePage() {
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProfilePayload>({
    resolver: zodResolver(updateProfileSchema),
    values: { name: user?.name ?? '' },
  })

  const updateProfileMutation = useUpdateProfileMutation()

  if (!user) return null

  function onSubmit(data: UpdateProfilePayload) {
    updateProfileMutation.mutate({ name: data.name.trim() })
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <Badge variant="secondary">{user.role === ROLES.ORGANISER ? 'Organiser' : 'User'}</Badge>
      </div>

      <Card>
        <CardHeader>
          <span className="mb-1 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </span>
          <CardTitle>Account details</CardTitle>
          <CardDescription>
            Update your name below. Your email can&apos;t be changed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" required>
                Name
              </Label>
              <Input id="name" type="text" aria-invalid={!!errors.name} {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email} disabled readOnly />
            </div>

            <Button
              type="submit"
              className="w-fit"
              disabled={updateProfileMutation.isPending || !isDirty}
            >
              {updateProfileMutation.isPending && <Loader2 className="animate-spin" />}
              {updateProfileMutation.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
