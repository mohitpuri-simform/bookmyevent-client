export function formatVenue(venue: {
  venueStreet: string
  venueCity: string
  venueState: string
}): string {
  return [venue.venueStreet, venue.venueCity, venue.venueState].filter(Boolean).join(', ')
}
