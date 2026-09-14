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
} as const
