import { z } from 'zod'
import { messages } from '../../constants/messages'
import { ROLES } from '../../shared/constants/auth/role'

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, messages.validation.name.minLength)
      .max(100, messages.validation.name.maxLength),
    email: z.string().trim().email(messages.validation.email.invalid),
    password: z
      .string()
      .min(8, messages.validation.password.minLength)
      .max(72, messages.validation.password.maxLength),
    confirmPassword: z
      .string()
      .min(8, messages.validation.password.minLength)
      .max(72, messages.validation.password.maxLength),
    role: z.enum([ROLES.USER, ROLES.ORGANISER]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: messages.validation.confirmPassword.mismatch,
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
export type RegisterPayload = Omit<RegisterFormValues, 'confirmPassword'>
