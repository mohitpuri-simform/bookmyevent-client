import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Loader2, Pencil, Plus } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OrganizerSectionCard } from '../../components/seating/OrganizerSectionCard'
import { SeatMapGrid } from '../../components/seating/SeatMapGrid'
import { StageBanner } from '../../components/seating/StageBanner'
import { routes } from '../../constants/routes'
import { useMyEventQuery } from '../../hooks/events/useMyEventQuery'
import { useCreateSectionMutation } from '../../hooks/sections/useCreateSectionMutation'
import { useReorderSectionsMutation } from '../../hooks/sections/useReorderSectionsMutation'
import { useSectionsQuery } from '../../hooks/sections/useSectionsQuery'
import { formatVenue } from '../../lib/venue'
import {
  createSectionSchema,
  type CreateSectionFormInput,
  type CreateSectionPayload,
} from '../../schemas/sections/createSectionSchema'

export function EventSectionsPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const { data: event, isLoading: isLoadingEvent, isError: isEventError } = useMyEventQuery(eventId)
  const { data: sections, isLoading: isLoadingSections } = useSectionsQuery(eventId)
  const createSectionMutation = useCreateSectionMutation(eventId!)
  const reorderSectionsMutation = useReorderSectionsMutation(eventId!)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateSectionFormInput, unknown, CreateSectionPayload>({
    resolver: zodResolver(createSectionSchema),
  })

  const [previewRows, previewSeatsPerRow, previewAisle] = watch([
    'rows',
    'seatsPerRow',
    'aisleAfterSeat',
  ])

  const previewSeats = useMemo(() => {
    const rows = Number(previewRows) || 0
    const seatsPerRow = Number(previewSeatsPerRow) || 0
    if (rows < 1 || seatsPerRow < 1 || rows > 50 || seatsPerRow > 50) return []

    const seats: { id: string; row: number; col: number; status: 'AVAILABLE' }[] = []
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= seatsPerRow; col++) {
        seats.push({ id: `${row}-${col}`, row, col, status: 'AVAILABLE' })
      }
    }
    return seats
  }, [previewRows, previewSeatsPerRow])

  function onSubmit(data: CreateSectionPayload) {
    createSectionMutation.mutate(data, {
      onSuccess: () => reset(),
    })
  }

  function handleMoveSection(sectionId: string, direction: 'up' | 'down') {
    if (!sections) return
    const index = sections.findIndex((s) => s.id === sectionId)
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (index === -1 || swapIndex < 0 || swapIndex >= sections.length) return

    const reordered = sections.map((s) => s.id)
    const [moved] = reordered.splice(index, 1)
    reordered.splice(swapIndex, 0, moved!)
    reorderSectionsMutation.mutate(reordered)
  }

  if (isLoadingEvent) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isEventError || !event) {
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
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{event.name}</h1>
          <p className="text-sm text-muted-foreground">{formatVenue(event)}</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={routes.organizer.editEvent(event.id)}>
            <Pencil />
            Edit event
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add a section</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Section name</Label>
                <Input id="name" type="text" aria-invalid={!!errors.name} {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  aria-invalid={!!errors.price}
                  {...register('price')}
                />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="rows">Rows</Label>
                <Input
                  id="rows"
                  type="number"
                  min="1"
                  max="50"
                  aria-invalid={!!errors.rows}
                  {...register('rows')}
                />
                {errors.rows && <p className="text-xs text-destructive">{errors.rows.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="seatsPerRow">Seats per row</Label>
                <Input
                  id="seatsPerRow"
                  type="number"
                  min="1"
                  max="50"
                  aria-invalid={!!errors.seatsPerRow}
                  {...register('seatsPerRow')}
                />
                {errors.seatsPerRow && (
                  <p className="text-xs text-destructive">{errors.seatsPerRow.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="aisleAfterSeat">Aisle after seat # (optional)</Label>
                <Input
                  id="aisleAfterSeat"
                  type="number"
                  min="1"
                  aria-invalid={!!errors.aisleAfterSeat}
                  {...register('aisleAfterSeat')}
                />
                {errors.aisleAfterSeat && (
                  <p className="text-xs text-destructive">{errors.aisleAfterSeat.message}</p>
                )}
              </div>
            </div>

            {previewSeats.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label>Preview</Label>
                <div className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4">
                  <SeatMapGrid
                    rows={Number(previewRows)}
                    seatsPerRow={Number(previewSeatsPerRow)}
                    aisleAfterSeat={previewAisle ? Number(previewAisle) : null}
                    seats={previewSeats}
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-fit" disabled={createSectionMutation.isPending}>
              {createSectionMutation.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
              {createSectionMutation.isPending ? 'Adding section…' : 'Add section'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Sections</h2>

        {isLoadingSections && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoadingSections && sections?.length === 0 && (
          <p className="text-sm text-muted-foreground">No sections added yet.</p>
        )}

        {sections && sections.length > 0 && (
          <div className="flex flex-col gap-6 rounded-lg border border-border bg-muted/10 p-4 sm:p-6">
            <StageBanner />
            {sections.map((section, index) => (
              <OrganizerSectionCard
                key={section.id}
                eventId={eventId!}
                section={section}
                isFirst={index === 0}
                isLast={index === sections.length - 1}
                isReordering={reorderSectionsMutation.isPending}
                onMoveUp={() => handleMoveSection(section.id, 'up')}
                onMoveDown={() => handleMoveSection(section.id, 'down')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
