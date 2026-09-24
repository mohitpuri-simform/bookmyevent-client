export const apiRoutes = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  profile: '/profile',
  events: {
    list: '/events',
    detail: (eventId: string) => `/events/${eventId}`,
    sections: (eventId: string) => `/events/${eventId}/sections`,
    section: (eventId: string, sectionId: string) => `/events/${eventId}/sections/${sectionId}`,
    reorderSections: (eventId: string) => `/events/${eventId}/sections/reorder`,
    hold: (eventId: string, seatId: string) => `/events/${eventId}/seats/${seatId}/hold`,
  },
  holds: {
    release: (holdId: string) => `/holds/${holdId}`,
  },
  checkout: {
    create: '/checkout',
    status: (paymentIntentId: string) => `/checkout/${paymentIntentId}/status`,
  },
  me: {
    holds: '/me/holds',
    bookings: '/me/bookings',
  },
  support: {
    tickets: '/support/tickets',
  },
  organiser: {
    events: '/organiser/events',
    eventDetail: (eventId: string) => `/organiser/events/${eventId}`,
    eventBookings: (eventId: string) => `/organiser/events/${eventId}/bookings`,
  },
} as const
