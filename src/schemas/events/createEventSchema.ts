import { z } from 'zod'

export const createEventSchema = z
  .object({
    name: z.string().min(2, 'Event name must be at least 2 characters.'),
    venueStreet: z.string().min(2, 'Street must be at least 2 characters.'),
    venueCity: z.string().min(2, 'City must be at least 2 characters.'),
    venueState: z.string().min(2, 'State must be at least 2 characters.'),
    date: z.string().min(1, 'Event date is required.'),
    endDate: z.string().min(1, 'Event end date is required.'),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.date), {
    message: 'End date must be after the start date.',
    path: ['endDate'],
  })

export type CreateEventPayload = z.infer<typeof createEventSchema>
