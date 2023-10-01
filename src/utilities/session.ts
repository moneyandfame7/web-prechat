export function removeSession() {
  const result = localStorage.removeItem('prechat-session')

  if (typeof result !== 'undefined') {
    /* ERRoR */
  }
}

export function saveSession(session: string) {
  const result = localStorage.setItem('prechat-session', session)

  if (typeof result !== 'undefined') {
    /* ERROR */
    return
  } /* else {
    startPersist()
  } */
}

export function hasActiveSession() {
  const stored = localStorage.getItem('prechat-session') as string

  return Boolean(stored)
}
