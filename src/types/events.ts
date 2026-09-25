export interface Event {
  id: string
  name: string
  venueStreet: string
  venueCity: string
  venueState: string
  date: string
  endDate: string
  organiserId: string
  createdAt: string
  updatedAt: string
  /** Only present on organiser-facing endpoints (/organiser/events*). */
  totalSeats?: number
  bookedSeats?: number
  availableSeats?: number
}
