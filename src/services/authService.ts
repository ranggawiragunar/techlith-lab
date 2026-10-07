import { db } from '../db/database'
import type { User } from '../types/models'

const SESSION_KEY = 'techlith-lab-session'

export async function login(username: string, password: string): Promise<User | null> {
  const user = await db.users.where('username').equals(username.trim()).first()
  if (!user || user.password !== password) return null
  localStorage.setItem(SESSION_KEY, user.id)
  return user
}

export async function restoreSession(): Promise<User | null> {
  const userId = localStorage.getItem(SESSION_KEY)
  if (!userId) return null
  const user = await db.users.get(userId)
  if (!user) localStorage.removeItem(SESSION_KEY)
  return user ?? null
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}
