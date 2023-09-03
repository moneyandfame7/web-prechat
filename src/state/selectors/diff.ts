import type {ApiSession} from 'api/types'

import type {SignalGlobalState} from 'types/state'

export const selectAllSessions = (state: SignalGlobalState) =>
  state.activeSessions.ids.map((id) => selectSession(state, id))

export const selectSession = (state: SignalGlobalState, id: string) =>
  state.activeSessions.byId[id]

export const selectCurrentSession = (state: SignalGlobalState): ApiSession | undefined =>
  state.auth.session ? state.activeSessions.byId[state.auth.session] : undefined

// or select by id
export const selectCurrentSession2 = (state: SignalGlobalState) =>
  selectAllSessions(state).find((s) => s.isCurrent)!
