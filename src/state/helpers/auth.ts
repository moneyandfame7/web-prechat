import { DeepSignal } from 'deepsignal'
import { getGlobalState } from 'state/signal'

import type { AuthState, GlobalState } from 'types/state'

export function updateAuthState(payload: Partial<AuthState>) {
  const current = getGlobalState()

  Object.assign<GlobalState, { auth: DeepSignal<AuthState> }>(current, {
    auth: {
      ...current.auth,
      ...payload
    }
  })
}
