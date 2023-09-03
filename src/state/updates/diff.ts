import type {ApiSession} from 'api/types'

import {selectSession} from 'state/selectors/diff'
import {storages} from 'state/storages'

import {updateByKey} from 'utilities/object/updateByKey'

import type {GlobalState, SignalGlobalState} from 'types/state'

export function updateNotificationState(
  global: SignalGlobalState,
  notification: GlobalState['notification']
) {
  updateByKey(global.notification, notification)
}

export function updateSessions(
  global: SignalGlobalState,
  sessionsById: Record<string, ApiSession>
) {
  /**
   * @todo  filter by activeAt instead of createdAt.
   */
  const ids = Object.values(sessionsById)
    .sort((a, b) => new Date(b.activeAt).getTime() - new Date(a.activeAt).getTime())
    .map((s) => s.id)

  // updateByKey(global.activeSessions.byId, sessionsById)

  global.activeSessions = {
    byId: sessionsById as any,
    ids,
  }
  storages.sessions.put(global.activeSessions.byId)
  // storages.sessions.remove()
}

export function updateSession(
  global: SignalGlobalState,
  sessionId: string,
  sessionToUpd: Partial<ApiSession>
) {
  const session = selectSession(global, sessionId)
  if (!session) {
    return
  }

  updateByKey(session, sessionToUpd)
}
