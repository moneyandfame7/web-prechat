import type {ApiSession} from 'api/types'

import type {SignalGlobalState} from 'types/state'

export const selectAllSessions = (state: SignalGlobalState) =>
  state.activeSessions.ids.map((id) => state.activeSessions.byId[id])

export const selectSession = (state: SignalGlobalState, id: string): ApiSession | undefined =>
  state.activeSessions.byId[id]

export const selectCurrentSession = (state: SignalGlobalState): ApiSession | undefined =>
  state.auth.session ? state.activeSessions.byId[state.auth.session] : undefined

export const selectCurrentSessionId = (state: SignalGlobalState): string | undefined =>
  state.auth.session ? state.activeSessions.byId[state.auth.session].id : undefined

// or select by id
export const selectCurrentSession2 = (state: SignalGlobalState) =>
  selectAllSessions(state).find((s) => s?.isCurrent)!

export const selectHasMessageSelection = (state: SignalGlobalState): boolean =>
  // state.selection.messageIds.length > 0
  state.selection.hasSelection

export const selectIsMessageSelected = (
  state: SignalGlobalState,
  messageId: string
): boolean => state.selection.messageIds.includes(messageId)

export const selectHasTextSelection = (state: SignalGlobalState): boolean =>
  state.selection.selectedText.length > 0

export const selectMessagesSelectionCount = (state: SignalGlobalState): number =>
  state.selection.messageIds.length
