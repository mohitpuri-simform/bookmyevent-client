import { toast } from 'sonner'
import { messages } from '../constants/messages'
import { extractErrorMessage } from './utils'

export function showSuccessToast(message?: string): void {
  if (message) toast.success(message)
}

export function showErrorToast(error?: unknown): void {
  toast.error(extractErrorMessage(error, messages.fallbackError))
}
