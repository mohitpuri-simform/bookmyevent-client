export const messages = {
  validation: {
    email: {
      invalid: 'Enter a valid email address.',
    },
    password: {
      required: 'Password is required.',
      minLength: 'Password must be at least 8 characters.',
    },
    name: {
      minLength: 'Name must be at least 2 characters.',
    },
    otp: {
      length: 'Enter the 6-digit code sent to your email.',
    },
    confirmPassword: {
      mismatch: 'Passwords do not match.',
    },
  },
  fallbackError: 'Something went wrong. Please try again.',
  serviceUnavailable: 'System temporarily unavailable, please try again.',
} as const
