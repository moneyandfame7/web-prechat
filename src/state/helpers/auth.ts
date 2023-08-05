import {getGlobalState} from 'state/signal'

/**
 * return true if has user has active session
 */
export function hasSession() {
  const {auth} = getGlobalState()

  return Boolean(auth.session)
}
