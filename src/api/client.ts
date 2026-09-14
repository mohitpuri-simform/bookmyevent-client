import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { apiRoutes } from './apiRoutes'

const baseURL = import.meta.env.VITE_API_URL

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
})

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retried?: boolean
}

let refreshPromise: Promise<void> | null = null

function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post(apiRoutes.auth.refresh)
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined
    const requestUrl = originalRequest?.url ?? ''
    const isAuthEndpoint =
      requestUrl.includes(apiRoutes.auth.login) || requestUrl.includes(apiRoutes.auth.refresh)

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retried &&
      !isAuthEndpoint
    ) {
      originalRequest._retried = true
      try {
        await refreshSession()
        return apiClient(originalRequest)
      } catch {
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

/**
 * True when this error is a 401 that already went through a refresh-and-
 * retry attempt above and still failed — i.e. the session is genuinely
 * dead, not just a one-off wrong-password rejection from /auth/login.
 * Used to proactively clear cached auth state instead of waiting for the
 * next /auth/me poll to notice.
 */
export function isDeadSessionError(error: unknown): boolean {
  return (
    error instanceof AxiosError &&
    Boolean((error.config as RetriableRequestConfig | undefined)?._retried)
  )
}
