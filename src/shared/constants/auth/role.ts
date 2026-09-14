export const ROLES = {
  USER: 'USER',
  ORGANISER: 'ORGANISER',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
