import { z } from 'zod'

export const createEventSchema = z.object({
  name: z.string().min(2, 'Event name must be at least 2 characters.'),
  venue: z.string().min(2, 'Venue must be at least 2 characters.'),
  date: z.string().min(1, 'Event date is required.'),
})

export type CreateEventPayload = z.infer<typeof createEventSchema>
