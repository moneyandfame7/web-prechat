import { getGlobalState } from 'state/signal'

/**
 * return true if has user has active session
 */
export function hasSession() {
  const session = getGlobalState((state) => state.auth.session)

  return Boolean(session)
}
