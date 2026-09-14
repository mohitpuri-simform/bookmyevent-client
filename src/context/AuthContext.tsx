import { useCallback, type ReactNode } from 'react'
import { useLogoutMutation } from '../hooks/auth/useLogoutMutation'
import { useMeQuery } from '../hooks/auth/useMeQuery'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user = null, isLoading } = useMeQuery()
  const { mutateAsync: logoutMutateAsync } = useLogoutMutation()

  const logout = useCallback(async () => {
    await logoutMutateAsync()
  }, [logoutMutateAsync])

  return <AuthContext.Provider value={{ user, isLoading, logout }}>{children}</AuthContext.Provider>
}
