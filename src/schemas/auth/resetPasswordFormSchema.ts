import { z } from 'zod'
import { messages } from '../../constants/messages'

export const resetPasswordFormSchema = z
  .object({
    otp: z
      .string()
      .length(6, messages.validation.otp.length)
      .regex(/^\d{6}$/, messages.validation.otp.digitsOnly),
    newPassword: z
      .string()
      .min(8, messages.validation.password.minLength)
      .max(72, messages.validation.password.maxLength),
    confirmPassword: z
      .string()
      .min(8, messages.validation.password.minLength)
      .max(72, messages.validation.password.maxLength),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: messages.validation.confirmPassword.mismatch,
    path: ['confirmPassword'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>
