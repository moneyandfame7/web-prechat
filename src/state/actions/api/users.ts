import {Api, PENDING_REQUESTS} from 'api/manager'

import {createAction} from 'state/action'
import {updateUsers} from 'state/updates'

createAction('getUser', async (state, _, payload) => {
  PENDING_REQUESTS.USERS.add(payload)
  const result = await Api.users.getUsers({ids: [payload]})
  if (!result) {
    PENDING_REQUESTS.USERS.delete(payload)
    return
  }

  const user = result[0]
  console.log({user})
  updateUsers(state, {
    [user.id]: user,
  })

  PENDING_REQUESTS.USERS.delete(payload)
})

createAction('getSelf', async (state, actions) => {
  if (!state.auth.userId) {
    return
  }
  await actions.getUser(state.auth.userId)
})
