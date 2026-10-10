import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarCheck, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateEventMutation } from '../../hooks/events/useCreateEventMutation'
import { newEventSchema, type CreateEventPayload } from '../../schemas/events/createEventSchema'
import { nowDatetimeLocalValue, todayInputValue } from '../../lib/eventTime'

export function CreateEventPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventPayload>({
    resolver: zodResolver(newEventSchema),
  })

  const createEventMutation = useCreateEventMutation()

  function onSubmit(data: CreateEventPayload) {
    createEventMutation.mutate(data)
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <span className="mb-1 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CalendarCheck className="size-5" />
          </span>
          <CardTitle className="text-xl">Create an event</CardTitle>
          <CardDescription>Set the basics, then add seating sections next</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" required>
                Event name
              </Label>
              <Input id="name" type="text" aria-invalid={!!errors.name} {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="venueStreet" required>
                Street
              </Label>
              <Input
                id="venueStreet"
                type="text"
                aria-invalid={!!errors.venueStreet}
                {...register('venueStreet')}
              />
              {errors.venueStreet && (
                <p className="text-xs text-destructive">{errors.venueStreet.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="venueCity" required>
                City
              </Label>
              <Input
                id="venueCity"
                type="text"
                aria-invalid={!!errors.venueCity}
                {...register('venueCity')}
              />
              {errors.venueCity && (
                <p className="text-xs text-destructive">{errors.venueCity.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="venueState" required>
                State
              </Label>
              <Input
                id="venueState"
                type="text"
                aria-invalid={!!errors.venueState}
                {...register('venueState')}
              />
              {errors.venueState && (
                <p className="text-xs text-destructive">{errors.venueState.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="date" required>
                Start date
              </Label>
              <Input
                id="date"
                type="date"
                min={todayInputValue()}
                aria-invalid={!!errors.date}
                {...register('date')}
              />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="endDate" required>
                Expires at
              </Label>
              <Input
                id="endDate"
                type="datetime-local"
                min={nowDatetimeLocalValue()}
                aria-invalid={!!errors.endDate}
                {...register('endDate')}
              />
              {errors.endDate && (
                <p className="text-xs text-destructive">{errors.endDate.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={createEventMutation.isPending}>
              {createEventMutation.isPending && <Loader2 className="animate-spin" />}
              {createEventMutation.isPending ? 'Creating event…' : 'Create event'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
