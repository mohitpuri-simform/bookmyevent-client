import type { Role } from '../shared/constants/auth/role'

export type { Role }

export interface User {
  id: string
  name: string
  email: string
  role: Role
}
