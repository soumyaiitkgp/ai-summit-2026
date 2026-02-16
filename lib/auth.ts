import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const SESSION_COOKIE = 'admin_session'
const SESSION_VALUE = 'authenticated'

export function checkAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false
  // Constant-time comparison to prevent timing attacks
  if (password.length !== adminPassword.length) return false
  let match = true
  for (let i = 0; i < password.length; i++) {
    if (password[i] !== adminPassword[i]) match = false
  }
  return match
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value === SESSION_VALUE
}

export function isAdminAuthenticatedFromRequest(req: NextRequest): boolean {
  return req.cookies.get(SESSION_COOKIE)?.value === SESSION_VALUE
}
