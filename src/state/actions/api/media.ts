import {Api} from 'api/manager'

import {createAction} from 'state/action'
import {updateUser} from 'state/updates'

createAction('uploadProfilePhoto', async (state, _, payload) => {
  const result = await Api.media.uploadProfilePhoto(payload)

  if (!result) {
    return
  }

  updateUser(state, state.auth.userId!, {
    photo: result,
  })
})
