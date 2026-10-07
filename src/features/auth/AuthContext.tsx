import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext } from './context'
import * as authService from '../../services/authService'
import type { User } from '../../types/models'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void authService.restoreSession().then(setUser).finally(() => setLoading(false))
  }, [])

  async function signIn(username: string, password: string): Promise<boolean> {
    const signedInUser = await authService.login(username, password)
    setUser(signedInUser)
    return signedInUser !== null
  }

  function signOut() {
    authService.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}
