import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { apiRoutes } from '../api/apiRoutes'
import { apiClient } from '../api/client'
import { messages } from '../constants/messages'
import { extractErrorMessage } from './utils'

export function showSuccessToast(message?: string): void {
  if (message) toast.success(message)
}

/**
 * A 503 from a hold/checkout attempt means Redis (the seat-lock store) is
 * down — a case the backend deliberately fails closed on rather than
 * silently degrading. Offers the same "raise a support ticket" escape
 * hatch the spec calls for, right from the error toast.
 */
function showServiceUnavailableToast(context?: Record<string, unknown>): void {
  toast.error(messages.serviceUnavailable, {
    action: {
      label: 'Report issue',
      onClick: () => {
        apiClient
          .post(apiRoutes.support.tickets, {
            subject: 'Seat hold/checkout failed — system unavailable',
            message: 'A user hit a 503 (service unavailable) in the booking flow.',
            context,
          })
          .then(() => toast.success('Support has been notified — thanks for flagging it.'))
          .catch(() => toast.error('Could not reach support. Please try again shortly.'))
      },
    },
  })
}

export function showErrorToast(error?: unknown): void {
  if (error instanceof AxiosError && error.response?.status === 503) {
    showServiceUnavailableToast({ url: error.config?.url })
    return
  }
  toast.error(extractErrorMessage(error, messages.fallbackError))
}
