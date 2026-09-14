import { z } from 'zod'
import { messages } from '../../constants/messages'
import { ROLES } from '../../shared/constants/auth/role'

export const registerSchema = z.object({
  name: z.string().min(2, messages.validation.name.minLength),
  email: z.string().email(messages.validation.email.invalid),
  password: z.string().min(8, messages.validation.password.minLength),
  role: z.enum([ROLES.USER, ROLES.ORGANISER]),
})

export type RegisterPayload = z.infer<typeof registerSchema>
