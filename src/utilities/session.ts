import ls from 'localstorage-slim'

export function removeSession() {
  const result = ls.remove('prechat-session')

  if (typeof result !== 'undefined') {
    console.error('REMOVE SESION ERROR')
  }
}

export function saveSession(session: string) {
  const result = ls.set('prechat-session', session)

  if (typeof result !== 'undefined') {
    console.error('SET PERSIST ERROR')
  }
}

export function hasActiveSession() {
  const stored = ls.get('prechat-session') as string

  return Boolean(stored)
}
