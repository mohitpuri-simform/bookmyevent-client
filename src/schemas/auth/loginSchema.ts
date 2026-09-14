import { z } from 'zod'
import { messages } from '../../constants/messages'

export const loginSchema = z.object({
  email: z.string().email(messages.validation.email.invalid),
  password: z.string().min(1, messages.validation.password.required),
})

export type LoginPayload = z.infer<typeof loginSchema>
