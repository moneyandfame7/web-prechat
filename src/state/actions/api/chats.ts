import {getApiError} from 'api/helpers/getApiError'
import {Api} from 'api/manager'

import {createAction} from 'state/action'
import {getResolvedUsername, isValidUsername} from 'state/helpers/chats'
import {
  isPrivateChat,
  isSavedMessages,
  selectChat,
  selectResolvedUsername,
} from 'state/selectors/chats'
import {selectUser} from 'state/selectors/users'
import {updateChats, updateUsernames} from 'state/updates/chats'

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
  state.chats.isLoading = true
  const chats = await Api.chats.getChats()

  if (!chats) {
    setTimeout(() => {
      state.chats.isLoading = false
    }, 1000)
    return
  }
  const record = buildRecord(chats, 'id')
  updateChats(state, record)

  await Promise.all(
    chats.map(async (c) => {
      if (c.userId) {
        const user = selectUser(state, c.userId)

        if (!user) {
          await actions.getUser(c.userId)
        }
      }
    })
  )

  setTimeout(() => {
    state.chats.isLoading = false
  }, 1000)
})

createAction('openChat', async (state, actions, payload) => {
  const {id} = payload
  // const chat = selectChat(state, id)
  const isPrivate = isPrivateChat(state, id)
  const isSaved = isSavedMessages(state, id)
  console.log({isPrivate, isSaved})
})

createAction('resolveUsername', async (state, actions, payload) => {
  const {username} = payload

  const exist = selectResolvedUsername(state, username)
  const exist2 = state.chats.usernames[username]
  if (exist || exist2) {
    console.log({exist, exist2})
    return
  }
  // Sory this user doesn't seem to exist.
  // There is no telegram account with this username.
  try {
    const result = await Api.chats.resolveUsername(username)
    if (!result) {
      return
    }

    updateByKey(state.chats.usernames, {
      [result.id]: username,
    })
  } catch (e) {
    const error = getApiError(e)
    switch (error?.code) {
      case 'USERNAME_INVALID':
        actions.showNotification({title: "Sory, this user doesn't seem to exist."})
        changeHash()
        break
      case 'USERNAME_NOT_OCCUPIED':
        actions.showNotification({title: 'There is no Prechat account with this username.'})
        changeHash()
    }
  }
})
