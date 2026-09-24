import { z } from 'zod'
import { messages } from '../../constants/messages'
import { ROLES } from '../../shared/constants/auth/role'

export const registerSchema = z
  .object({
    name: z.string().min(2, messages.validation.name.minLength),
    email: z.string().email(messages.validation.email.invalid),
    password: z.string().min(8, messages.validation.password.minLength),
    confirmPassword: z.string().min(8, messages.validation.password.minLength),
    role: z.enum([ROLES.USER, ROLES.ORGANISER]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: messages.validation.confirmPassword.mismatch,
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
export type RegisterPayload = Omit<RegisterFormValues, 'confirmPassword'>
