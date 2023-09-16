import {Api} from 'api/manager'

import {createAction} from 'state/action'
import {isPrivateChat2} from 'state/helpers/chats'
import {selectChat} from 'state/selectors/chats'

createAction('sendMessage', async (state, _, payload) => {
  const {currentChat} = state

  if (!currentChat.chatId) {
    return
  }
  const {chatId} = currentChat
  const chat = selectChat(state, chatId)
  if (!chat) {
    return
  }
  const {text} = payload

  const isPrivate = isPrivateChat2(chat)
  const sended = await Api.messages.sendMessage({
    peer: isPrivate
      ? {
          userId: chat.userId,
        }
      : {chatId: chat.id},
    text,
  })

  if (!sended) {
    return
  }
})

createAction('getMessages', async (_, _actions) => {
  // const {chatId, limit, offset} = payload
  // await Api.messages.getMessages(payload)
  // const ids=
})
