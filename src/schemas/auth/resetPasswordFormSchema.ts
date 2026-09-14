import { z } from 'zod'
import { messages } from '../../constants/messages'

export const resetPasswordFormSchema = z
  .object({
    otp: z.string().length(6, messages.validation.otp.length),
    newPassword: z.string().min(8, messages.validation.password.minLength),
    confirmPassword: z.string().min(8, messages.validation.password.minLength),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: messages.validation.confirmPassword.mismatch,
    path: ['confirmPassword'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>
