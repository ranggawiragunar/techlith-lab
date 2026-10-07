import { createContext, useContext } from 'react'
import type { User } from '../../types/models'

export interface AuthContextValue {
  user: User | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<boolean>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
