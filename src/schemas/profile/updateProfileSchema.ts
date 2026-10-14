import { z } from 'zod'
import { messages } from '../../constants/messages'

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, messages.validation.name.minLength)
    .max(100, messages.validation.name.maxLength),
})

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>
