import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarCheck, Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEventQuery } from '../../hooks/events/useEventQuery'
import { useUpdateEventMutation } from '../../hooks/events/useUpdateEventMutation'
import { createEventSchema, type CreateEventPayload } from '../../schemas/events/createEventSchema'

export function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const { data: event } = useEventQuery(eventId)
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
        venue: event.venue,
        date: event.date.slice(0, 10),
      })
    }
  }, [event, reset])

  function onSubmit(data: CreateEventPayload) {
    updateEventMutation.mutate(data)
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
              <Label htmlFor="name">Event name</Label>
              <Input id="name" type="text" aria-invalid={!!errors.name} {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="venue">Venue</Label>
              <Input id="venue" type="text" aria-invalid={!!errors.venue} {...register('venue')} />
              {errors.venue && <p className="text-xs text-destructive">{errors.venue.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" aria-invalid={!!errors.date} {...register('date')} />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
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
