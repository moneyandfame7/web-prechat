import {getApiError} from 'api/helpers/getApiError'
import {Api} from 'api/manager'

import {createAction} from 'state/action'
import {selectSelf} from 'state/selectors/users'
import {updateAuthState, updateSessions, updateUser} from 'state/updates'

import {debounce} from 'common/functions'
import {milliseconds} from 'utilities/date/ms'
import {buildRecord} from 'utilities/object/buildRecord'

const SESSION_ACTIVITY_UPD = milliseconds({minutes: 30})
createAction('getAuthorizations', async (state) => {
  const result = await Api.account.getAuthorizations()

  updateSessions(state, buildRecord(result, 'id'))
})

createAction('updateAuthorizationActivity', async (state) => {
  // maybe return from backend updated session?
  const now = Date.now()
  const sessionActivity = state.auth.sessionLastActivity
  if (sessionActivity && now - sessionActivity <= SESSION_ACTIVITY_UPD) {
    /* Less then 30 minutes, not update session state? */
    /**
     * On close tab - update last active at
     */
    return
  }

  const result = await Api.account.updateAuthorizationActivity()

  updateAuthState(state, {
    sessionLastActivity: Date.now(),
  })
  console.log('UPD_AUTH_ACTIVITY', {result})
})

createAction('terminateAuthorization', async (state, actions, payload) => {
  const {sessionId} = payload

  if (sessionId === state.auth.session) {
    // ?????
    return
  }
  try {
    const result = await Api.account.terminateAuthorization(payload.sessionId)
    if (!result) {
      return
    }
    const {[payload.sessionId]: terminated, ...newSessions} = state.activeSessions.byId
    // or maybe just delete in object??? (sheet)

    updateSessions(state, newSessions)
    // updateSessions
  } catch (e) {
    const error = getApiError(e)
    switch (error?.code) {
      case 'AUTH_SESSION_TOO_FRESH':
        actions.openCommonModal({title: 'SessionTooFresh', body: error.message})
        break
      default:
        return
    }
  }
})

createAction('terminateAllAuthorizations', async (state, actions, payload) => {
  const result = await Api.account.terminateAllAuthorizations()

  if (!result) {
    return
  }

  const selfSessionId = state.auth.session!
  const {[selfSessionId]: remaining, ...terminated} = state.activeSessions.byId

  updateSessions(state, {
    selfSessionId: remaining,
  })
})

const debounceUpdateUserStatus = debounce((cb) => cb(), 3000, true)

createAction('updateUserStatus', async (state, actions, payload) => {
  if (!state.auth.session) {
    return
  }
  if (payload.noDebounce) {
    const result = await Api.account.updateUserStatus(payload.isOnline)
    if (!result) {
      return
    }
    updateUser(state, state.auth.userId!, {
      status: result,
    })
    return
  }
  void debounceUpdateUserStatus(async () => {
    const currentStatus = selectSelf(state)?.status
    const {isOnline, isFirst = false} = payload
    if (
      (currentStatus?.type === 'userStatusOnline' && isOnline && !isFirst) ||
      !state.auth.session
    ) {
      return
    }

    try {
      const result = await Api.account.updateUserStatus(isOnline)
      if (!result) {
        return
      }
      updateUser(state, state.auth.userId!, {
        status: result,
      })
    } catch (e) {
      const apiError = getApiError(e)
      switch (apiError?.code) {
        case 'AUTH_SESSION_INVALID':
        case 'AUTH_SESSION_EXPIRED':
          // just put it on client apollo?
          // actions.signOut()
          break
        default:
          break
      }
    }
  })
})
