import type {ApiSession} from 'api/types'

import {createSubscribe} from 'state/subscribe'
import {updateSession, updateSessions, updateUser} from 'state/updates'

createSubscribe('onAuthorizationCreated', (global, _, data) => {
  // console.log(`NEW SESSION -`, data)

  const withAdded: Record<string, ApiSession> = {
    ...global.activeSessions.byId,
    [data.id]: data,
  }

  updateSessions(global, withAdded)
})

createSubscribe('onAuthorizationTerminated', async (state, actions, data) => {
  if (data.some((s) => s.isCurrent)) {
    await actions.signOut()
    return
  }
  // const {}=state.activeSessions.byId
  const updatedById = Object.fromEntries(
    Object.entries(state.activeSessions.byId!).filter(([key]) =>
      data.every((session) => session.id !== key)
    )
  ) as Record<string, ApiSession>
  // if (updatedById[state.auth.session!]) {
  //   console.log('WAS DELETED MY SESSION!!!!!&&!&!&!&!&&!')
  // }

  // console.log({updatedById})
  updateSessions(state, updatedById)
})

createSubscribe('onAuthorizationUpdated', (global, _, data) => {
  // console.log('UPDATED SESSION -', data)
  updateSession(global, data.id, data)
})

createSubscribe('onUserStatusUpdated', (global, _, data) => {
  // console.log('NEW USER STATUS - ', data)

  const {userId, status} = data
  updateUser(global, userId, {
    status,
  })
})
// мейбі забити хуй поки що на це, зробити фічу з сесіями ( isOnline якщо час меньше 5хв???? або оновлювати в реальному часі. мб редіс? але теж потім...)
