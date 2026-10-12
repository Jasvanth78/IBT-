import type { AuthUser } from '../../types/auth'

export const AUTH_TOKEN_KEY = 'ibt_auth_token'
export const AUTH_USER_KEY = 'ibt_auth_user'

// Gets the authentication token from local storage
export function getAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

// Gets the authenticated user from local storage
export function getAuthUser(): AuthUser | null {
  const value = window.localStorage.getItem(AUTH_USER_KEY)

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as AuthUser
  } catch {
    clearAuthStorage()
    return null
  }
}

export function setAuthStorage(token: string, user: AuthUser) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function clearAuthStorage() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY)
  window.localStorage.removeItem(AUTH_USER_KEY)
}

export function isAuthenticated() {
  return Boolean(getAuthToken())
}

const ADMIN_PANEL_ROLES = new Set(['ADMIN', 'MANAGER'])

export function hasAdminPanelAccess() {
  const token = getAuthToken()
  const user = getAuthUser()

  if (!token || !user) {
    return false
  }

  return ADMIN_PANEL_ROLES.has(user.role)
}
