import { z } from 'zod'
import { messages } from '../../constants/messages'

export const updateProfileSchema = z.object({
  name: z.string().min(2, messages.validation.name.minLength),
})

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>
