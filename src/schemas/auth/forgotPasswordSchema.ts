import { z } from 'zod'
import { messages } from '../../constants/messages'

export const forgotPasswordSchema = z.object({
  email: z.string().email(messages.validation.email.invalid),
})

export type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>
