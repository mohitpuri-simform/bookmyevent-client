import { z } from 'zod'
import { messages } from '../../constants/messages'

export const resetPasswordSchema = z.object({
  email: z.string().email(messages.validation.email.invalid),
  otp: z.string().length(6, messages.validation.otp.length),
  newPassword: z.string().min(8, messages.validation.password.minLength),
})

export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>
