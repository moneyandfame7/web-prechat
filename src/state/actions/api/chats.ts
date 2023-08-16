import {Api} from 'api/manager'

import {createAction} from 'state/action'
import {updateChats} from 'state/updates/chats'

import {buildRecord} from 'utilities/object/buildRecord'

createAction('createChannel', async (state, _, payload) => {
  const createdChannel = await Api.chats.createChannel(payload)

  if (!createdChannel) {
    return
  }

  updateChats(state, {
    [createdChannel.id]: createdChannel
  })
  /**
   * update chats by id
   */
})

createAction('createGroup', async (state, _, payload) => {
  const createdGroup = await Api.chats.createGroup(payload)

  if (!createdGroup) {
    return
  }

  updateChats(state, {
    [createdGroup.id]: createdGroup
  })
  /**
   * update chats by id
   */
})

createAction('getChats', async (state) => {
  const chats = await Api.chats.getChats()

  if (!chats) {
    return
  }
  const record = buildRecord(chats, 'id')
  updateChats(state, record)
})
