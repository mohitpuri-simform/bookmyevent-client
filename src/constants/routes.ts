export const routes = {
  home: '/',
  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
  },
  dashboard: '/dashboard',
  profile: '/profile',
  events: {
    list: '/events',
    detail: (eventId: string) => `/events/${eventId}`,
  },
  checkout: '/checkout',
  bookings: {
    list: '/bookings',
    detail: (bookingId: string) => `/bookings/${bookingId}`,
  },
  organizer: {
    events: '/organizer/events',
    createEvent: '/organizer/events/new',
    editEvent: (eventId: string) => `/organizer/events/${eventId}/edit`,
    eventSections: (eventId: string) => `/organizer/events/${eventId}/sections`,
    eventBookings: (eventId: string) => `/organizer/events/${eventId}/bookings`,
  },
} as const
