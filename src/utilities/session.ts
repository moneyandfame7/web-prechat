import ls from 'localstorage-slim'
import {forcePersist} from 'state/persist'

export function removeSession() {
  const result = ls.remove('prechat-session')

  if (typeof result !== 'undefined') {
    /* ERRoR */
  }
}

export function saveSession(session: string) {
  const result = ls.set('prechat-session', session)

  if (typeof result !== 'undefined') {
    /* ERROR */
    return
  } /* else {
    startPersist()
  } */

  forcePersist()
}

export function hasActiveSession() {
  const stored = ls.get('prechat-session') as string

  return Boolean(stored)
}
