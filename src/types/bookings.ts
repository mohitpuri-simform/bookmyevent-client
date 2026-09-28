export interface Booking {
  id: string
  holdId: string
  seatId: string
  userId: string
  eventId: string
  priceCents: number
  ticketRef: string
  createdAt: string
  event?: {
    id: string
    name: string
    venueStreet: string
    venueCity: string
    venueState: string
    date: string
    endDate: string
  }
  user?: {
    id: string
    name: string
    email: string
  }
  seat?: {
    row: number
    col: number
    section: {
      name: string
      rows: number
    }
  }
}
