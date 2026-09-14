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
  },
  organiser: {
    events: '/organiser/events',
  },
} as const
