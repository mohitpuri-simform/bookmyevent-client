export type SeatStatus = 'AVAILABLE' | 'HELD' | 'BOOKED'

export interface Seat {
  id: string
  sectionId: string
  row: number
  col: number
  priceCents: number
  status: SeatStatus
}

export interface Section {
  id: string
  eventId: string
  name: string
  rows: number
  seatsPerRow: number
  priceCents: number
  aisleAfterSeat: number | null
  displayOrder: number
  seats: Seat[]
}
