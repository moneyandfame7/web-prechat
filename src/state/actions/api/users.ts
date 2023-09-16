import {Api} from 'api/manager'

import {createAction} from 'state/action'
import {updateUsers} from 'state/updates'

createAction('getUser', async (state, _, payload) => {
  const result = await Api.users.getUsers({ids: [payload]})
  if (!result) {
    return
  }

  const user = result[0]

  updateUsers(state, {
    [user.id]: user,
  })
})

createAction('getSelf', async (state, actions) => {
  if (!state.auth.userId) {
    return
  }
  await actions.getUser(state.auth.userId)
})
