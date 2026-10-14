import { todayInputValue } from '../../lib/eventTime'
import { z } from 'zod'

export const createEventSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Event name must be at least 2 characters.')
      .max(150, 'Event name must be at most 150 characters.'),
    venueStreet: z
      .string()
      .trim()
      .min(2, 'Street must be at least 2 characters.')
      .max(200, 'Street must be at most 200 characters.'),
    venueCity: z
      .string()
      .trim()
      .min(2, 'City must be at least 2 characters.')
      .max(100, 'City must be at most 100 characters.'),
    venueState: z
      .string()
      .trim()
      .min(2, 'State must be at least 2 characters.')
      .max(100, 'State must be at most 100 characters.'),
    date: z.string().min(1, 'Event date is required.'),
    endDate: z.string().min(1, 'Event end date is required.'),
  })
  .refine((data) => data.endDate >= data.date, {
    message: 'End date cannot be before the start date.',
    path: ['endDate'],
  })

/**
 * Create-only: a new event can't already be over. Editing uses the plain
 * schema above, so an organiser can still edit an event that has started or ended.
 */
export const newEventSchema = createEventSchema.refine(
  (data) => data.endDate >= todayInputValue(),
  {
    message: 'End date cannot be in the past.',
    path: ['endDate'],
  },
)

export type CreateEventPayload = z.infer<typeof createEventSchema>
