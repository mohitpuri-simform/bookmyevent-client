import { z } from 'zod'
import { priceField } from './createSectionSchema'

export const updateSectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Section name is required.')
    .max(100, 'Section name must be at most 100 characters.'),
  price: priceField,
})

export type UpdateSectionFormInput = z.input<typeof updateSectionSchema>
export type UpdateSectionPayload = z.output<typeof updateSectionSchema>
