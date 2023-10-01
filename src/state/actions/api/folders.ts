import {Api} from 'api/manager'

import {createAction} from 'state/action'

createAction('getChatFolders', async (state, actions, payload) => {
  const result = await Api.folders.getChatFolders()

  console.log({result})
})
