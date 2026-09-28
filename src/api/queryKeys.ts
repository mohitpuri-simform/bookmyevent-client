export const queryKeys = {
  auth: {
    me: 'me',
    login: 'login',
    register: 'register',
    logout: 'logout',
    forgotPassword: 'forgot-password',
    resetPassword: 'reset-password',
  },
  profile: {
    update: 'update',
  },
  events: {
    list: 'events-list',
    myEvents: 'events-my',
    myEventDetail: 'events-my-detail',
    detail: 'events-detail',
    create: 'events-create',
    update: 'events-update',
  },
  sections: {
    list: 'sections-list',
    create: 'sections-create',
    update: 'sections-update',
    delete: 'sections-delete',
    reorder: 'sections-reorder',
  },
  holds: {
    hold: 'holds-hold',
    release: 'holds-release',
    mine: 'holds-mine',
  },
  checkout: {
    create: 'checkout-create',
    status: 'checkout-status',
  },
  bookings: {
    mine: 'bookings-mine',
    organiser: 'bookings-organiser',
  },
  support: {
    createTicket: 'support-create-ticket',
  },
  wallet: {
    summary: 'wallet-summary',
    connect: 'wallet-connect',
    withdraw: 'wallet-withdraw',
  },
} as const
