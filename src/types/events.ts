import type { EventStatus } from '../shared/constants/event/status'

export type { EventStatus }

export interface Event {
  id: string
  name: string
  venueStreet: string
  venueCity: string
  venueState: string
  date: string
  endDate: string
  status: EventStatus
  organiserId: string
  createdAt: string
  updatedAt: string
  /** Only present on organiser-facing endpoints (/organiser/events*). */
  totalSeats?: number
  bookedSeats?: number
  availableSeats?: number
}
