import {apiManager} from 'api/api-manager'
import {getApiError} from 'api/helpers/getApiError'
import {Api} from 'api/manager'

import {createAction} from 'state/action'
import {isUserId} from 'state/helpers/users'
import {selectChat, selectChatByUsername, selectChatFull} from 'state/selectors/chats'
import {selectUser} from 'state/selectors/users'
import {storages} from 'state/storages'
import {updateCurrentChat} from 'state/updates'
import {
  replacePeer,
  updateChatFullInfo,
  updateChats,
  updateOpenedChats,
} from 'state/updates/chats'

import {buildRecord} from 'utilities/object/buildRecord'
import {updateByKey} from 'utilities/object/updateByKey'
import {changeHash} from 'utilities/routing'

createAction('createChannel', async (state, _, payload) => {
  const createdChannel = await Api.chats.createChannel(payload)

  if (!createdChannel) {
    return
  }

  updateChats(state, {
    [createdChannel.id]: createdChannel,
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
    [createdGroup.id]: createdGroup,
  })
  /**
   * update chats by id
   */
})

createAction('getChats', async (state, actions) => {
  state.isChatsFetching = true
  const chats = await Api.chats.getChats()
  if (!chats) {
    state.isChatsFetching = false

    return
  }

  const record = buildRecord(chats, 'id')
  updateChats(state, record)

  await Promise.all(
    chats.map(async (c) => {
      if (isUserId(c.id)) {
        const user = selectUser(state, c.id)

        if (!user) {
          await actions.getUser(c.id)
        }
      }
    })
  )

  // setTimeout(() => {
  state.isChatsFetching = false
  // }, 10000)
})

createAction('getChat', async (state, _, payload) => {
  const {id} = payload

  const result = await Api.chats.getChat(id)
  if (!result) {
    return
  }

  updateChats(state, {
    [id]: result,
  })
})

createAction('getChatFull', async (state, _, payload) => {
  const {id} = payload

  const result = await apiManager.invokeApi({
    method: 'chats.getChatFull',
    variables: {
      chatId: id,
    },
  })

  if (!result) {
    return
  }
  updateChatFullInfo(state, id, result)
})

createAction('openChat', async (state, actions, payload) => {
  const {shouldChangeHash, shouldReplaceHistory = true, username, type} = payload
  let {id} = payload
  if (type === 'self') {
    id = state.auth.userId!
  }
  if (!id || (!id && !username)) {
    changeHash({hash: undefined, silent: true})
    document.title = ''
    updateCurrentChat(state, {
      chatId: undefined,
      username: undefined,
    })
    updateOpenedChats(state, undefined, undefined, shouldReplaceHistory)

    return
  }
  const chat = selectChat(state, id)
  const isPrivate = isUserId(id)
  const user = isPrivate ? selectUser(state, id) : undefined
  if (!chat) {
    if (isPrivate) {
      actions.getUser(id)
    } else {
      actions.getChat({id})
    }
  }

  document.title = chat?.title || ''

  if (shouldChangeHash) {
    // @todo переробити

    const hash = isPrivate ? user?.username || user?.id : chat?.id

    console.log({hash})
    if (hash) {
      changeHash({hash, silent: true})
    }
  }
  // const isSaved = isSavedMessages(state, id)
  const needLoadFull = !isPrivate && !selectChatFull(state, id)

  if (needLoadFull) {
    actions.getChatFull({id})
  }
  updateCurrentChat(state, {
    chatId: id,
    username,
  })
  updateOpenedChats(state, id, username, shouldReplaceHistory) // for test false
})

createAction('openPinnedMessages', async (state, actions, payload) => {
  const {id} = payload
  /* Call api for get all pinned messages? */

  if (id) {
    updateOpenedChats(state, id, undefined, false, true)
  } else {
    updateOpenedChats(state, id, undefined, true, false)
  }
})

createAction('openChatByUsername', async (state, actions, payload) => {
  const {username} = payload

  const cached = selectChatByUsername(state, username)

  if (cached) {
    actions.openChat({id: cached.id, username})
    return
  }

  try {
    const result = await Api.chats.resolveUsername(username)
    if (!result) {
      return
    }

    const record = {[username]: result.id}
    updateByKey(state.chats.usernames, record)
    replacePeer(state, result)

    storages.usernames.put(record)

    actions.openChat({id: result.id, username})
  } catch (e) {
    const error = getApiError(e)
    switch (error?.code) {
      case 'USERNAME_INVALID':
        actions.showNotification({title: "Sory, this user doesn't seem to exist."})
        changeHash({hash: undefined})
        break
      case 'USERNAME_NOT_OCCUPIED':
        actions.showNotification({title: 'There is no Prechat account with this username.'})
        changeHash({hash: undefined})
    }
  }
})

createAction('updateChat', async (state, actions, payload) => {
  const {chatId} = payload
  const chat = selectChat(state, chatId)

  if (!chat) {
    return
  }

  const result = await Api.chats.updateChat(payload)
})
