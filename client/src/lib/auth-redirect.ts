const AUTH_REDIRECT_KEY = 'auth_redirect'

export function setAuthRedirect(path: string) {
  sessionStorage.setItem(AUTH_REDIRECT_KEY, path)
}

export function getAuthRedirect(): string | null {
  return sessionStorage.getItem(AUTH_REDIRECT_KEY)
}

export function clearAuthRedirect() {
  sessionStorage.removeItem(AUTH_REDIRECT_KEY)
}

export function consumeAuthRedirect(): string {
  const redirect = getAuthRedirect()
  clearAuthRedirect()
  return redirect || '/'
}
