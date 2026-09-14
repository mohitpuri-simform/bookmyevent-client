import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ChevronUp, Loader2, Pencil, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDeleteSectionMutation } from '../../hooks/sections/useDeleteSectionMutation'
import { useUpdateSectionMutation } from '../../hooks/sections/useUpdateSectionMutation'
import {
  updateSectionSchema,
  type UpdateSectionFormInput,
  type UpdateSectionPayload,
} from '../../schemas/sections/updateSectionSchema'
import type { Section } from '../../types/sections'
import { SeatMapGrid } from './SeatMapGrid'
import { SectionDivider } from './SectionDivider'

interface OrganizerSectionCardProps {
  eventId: string
  section: Section
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  isReordering: boolean
}

export function OrganizerSectionCard({
  eventId,
  section,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  isReordering,
}: OrganizerSectionCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const updateSectionMutation = useUpdateSectionMutation(eventId, section.id)
  const deleteSectionMutation = useDeleteSectionMutation(eventId)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateSectionFormInput, unknown, UpdateSectionPayload>({
    resolver: zodResolver(updateSectionSchema),
    defaultValues: {
      name: section.name,
      price: section.priceCents / 100,
    },
  })

  function onSubmit(data: UpdateSectionPayload) {
    updateSectionMutation.mutate(data, {
      onSuccess: () => setIsEditing(false),
    })
  }

  function handleDeleteClick() {
    if (!confirmingDelete) {
      setConfirmingDelete(true)
      return
    }
    deleteSectionMutation.mutate(section.id)
  }

  return (
    <div className="flex flex-col gap-3">
      {isEditing ? (
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor={`name-${section.id}`}>Section name</Label>
            <Input
              id={`name-${section.id}`}
              type="text"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`price-${section.id}`}>Price ($)</Label>
            <Input
              id={`price-${section.id}`}
              type="number"
              step="0.01"
              min="0"
              aria-invalid={!!errors.price}
              {...register('price')}
            />
            {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
          </div>
          <Button type="submit" size="sm" disabled={updateSectionMutation.isPending}>
            {updateSectionMutation.isPending && <Loader2 className="animate-spin" />}
            Save
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
            <X />
            Cancel
          </Button>
        </form>
      ) : (
        <SectionDivider
          label={section.name}
          sublabel={`${section.rows} rows × ${section.seatsPerRow} seats · $${(
            section.priceCents / 100
          ).toFixed(2)} per seat · ${section.seats.length} seats`}
          actions={
            <>
              <div className="flex flex-col">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Move section up"
                  disabled={isFirst || isReordering}
                  onClick={onMoveUp}
                >
                  <ChevronUp />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Move section down"
                  disabled={isLast || isReordering}
                  onClick={onMoveDown}
                >
                  <ChevronDown />
                </Button>
              </div>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil />
                Edit
              </Button>
              <Button
                size="sm"
                variant={confirmingDelete ? 'destructive' : 'outline'}
                onClick={handleDeleteClick}
                disabled={deleteSectionMutation.isPending}
              >
                {deleteSectionMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Trash2 />
                )}
                {confirmingDelete ? 'Confirm delete?' : 'Delete'}
              </Button>
              {confirmingDelete && (
                <Button size="sm" variant="ghost" onClick={() => setConfirmingDelete(false)}>
                  Cancel
                </Button>
              )}
            </>
          }
        />
      )}
      <div className="overflow-x-auto rounded-md bg-muted/20 p-3">
        <SeatMapGrid
          rows={section.rows}
          seatsPerRow={section.seatsPerRow}
          aisleAfterSeat={section.aisleAfterSeat}
          seats={section.seats}
        />
      </div>
    </div>
  )
}
