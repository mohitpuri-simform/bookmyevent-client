import { z } from 'zod'

export const updateSectionSchema = z.object({
  name: z.string().trim().min(1, 'Section name is required.').max(100),
  price: z.coerce.number().min(0, 'Price cannot be negative.'),
})

export type UpdateSectionFormInput = z.input<typeof updateSectionSchema>
export type UpdateSectionPayload = z.output<typeof updateSectionSchema>
