import {Api} from 'api/client'
import {database} from 'lib/database'
import {createAction} from 'state/action'

createAction('getUser', async (state, _, payload) => {
  const result = await Api.users.getUsers({ids: [payload]})
  const user = result.data.getUsers[0]

  if (!user) {
    return
  }
  // state.users.byId = {
  //   ...state.users.byId,
  //   [payload]: cleanTypename(user)
  // } as any

  state.users.byId[payload] = {...user}
  database.users.add(user)
})
