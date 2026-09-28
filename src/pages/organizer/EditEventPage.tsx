import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, CalendarCheck, Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMyEventQuery } from '../../hooks/events/useMyEventQuery'
import { useUpdateEventMutation } from '../../hooks/events/useUpdateEventMutation'
import { createEventSchema, type CreateEventPayload } from '../../schemas/events/createEventSchema'

function toDatetimeLocalValue(isoDate: string): string {
  const date = new Date(isoDate)
  const offsetMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

export function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const { data: event, isLoading, isError } = useMyEventQuery(eventId)
  const updateEventMutation = useUpdateEventMutation(eventId!)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEventPayload>({
    resolver: zodResolver(createEventSchema),
  })

  useEffect(() => {
    if (event) {
      reset({
        name: event.name,
        venueStreet: event.venueStreet,
        venueCity: event.venueCity,
        venueState: event.venueState,
        date: event.date.slice(0, 10),
        endDate: toDatetimeLocalValue(event.endDate),
      })
    }
  }, [event, reset])

  function onSubmit(data: CreateEventPayload) {
    updateEventMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !event) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
        <AlertTriangle className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          This event doesn't exist, or isn't one of yours.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <span className="mb-1 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CalendarCheck className="size-5" />
          </span>
          <CardTitle className="text-xl">Edit event</CardTitle>
          <CardDescription>Update the event's basic details</CardDescription>
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
              <Input id="date" type="date" aria-invalid={!!errors.date} {...register('date')} />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="endDate" required>
                Expires at
              </Label>
              <Input
                id="endDate"
                type="datetime-local"
                aria-invalid={!!errors.endDate}
                {...register('endDate')}
              />
              {errors.endDate && (
                <p className="text-xs text-destructive">{errors.endDate.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={updateEventMutation.isPending}>
              {updateEventMutation.isPending && <Loader2 className="animate-spin" />}
              {updateEventMutation.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
