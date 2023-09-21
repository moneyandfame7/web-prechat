import {Api} from 'api/manager'
import {ApiChat} from 'api/types'

import {createAction} from 'state/action'
import {buildLocalPrivateChat} from 'state/helpers/chats'
import {buildLocalMessage} from 'state/helpers/messages'
import {isUserId} from 'state/helpers/users'
import {selectChat, selectCurrentOpenedChat} from 'state/selectors/chats'
import {selectUser} from 'state/selectors/users'
import {updateChat, updateChats} from 'state/updates'
import {updateMessage, updateMessages} from 'state/updates/messages'

createAction('sendMessage', async (state, _, payload) => {
  const {currentChat} = state

  if (!currentChat.chatId) {
    return
  }
  const {chatId} = currentChat
  let chat = selectChat(state, chatId)
  // if (!chat) {
  //   return
  // }
  const {text, entities, sendAs} = payload
  if (!chat && isUserId(chatId)) {
    chat = buildLocalPrivateChat({user: selectUser(state, chatId)!})
    updateChats(state, {
      [chat.id]: chat,
    })
  } else if (!chat) {
    return
  }
  const localMessage = buildLocalMessage({
    chatId,
    text,
    entities,
    senderId: sendAs || state.auth.userId!,
    isChannel: chat.type === 'chatTypeChannel',
  })
  // updateLastMessage(state, chatId, localMessage, false)
  console.log({localMessage})
  updateMessages(state, chatId, {[localMessage.id]: localMessage}, false)
  updateChat(state, chatId, {
    lastMessage: localMessage,
  })
  // after 1s need to set state status on pending?
  /* Catch error there and update message state */
  const sended = await Api.messages.sendMessage({
    id: localMessage.id,
    chatId,
    text,
    entities,
  })

  if (!sended) {
    return
  }

  updateMessage(state, chatId, sended.message.id, {
    sendingStatus: undefined,
  })

  // const {message} = sended
  // updateMessage(state, chatId, builded.id, {
  //   content: {
  //     formattedText: {
  //       text: 'TI EBLAN YA HZ YAK ЦЕ ВИПРАВЛЯТИ!',
  //     },
  //   },
  // })
  // deleteMessage(state, chatId, builded.id)
  // replaceLocalMessage(state, chatId, localMessage, sended.message)

  // console.log({builded})
  // deleteMessage(state, chatId, builded.id)

  // updateMessages(state, chatId, {
  //   [message.id]: message,
  // })
  // updateMessage(state, chatId, builded.id, {
  //   id: message.id,
  //   createdAt: message.createdAt,
  //   sendingState: undefined,
  // })
})

createAction('getMessages', async (state, _actions) => {
  const currentOpenedChat = selectCurrentOpenedChat(state)
  if (!currentOpenedChat?.chatId) {
    return
  }

  currentOpenedChat.isMessagesLoading = true

  setTimeout(() => {
    currentOpenedChat.isMessagesLoading = false
  }, 5000)

  updateMessages(state, currentOpenedChat.chatId, {})

  // const {chatId, limit, offset} = payload

  // await Api.messages.getMessages(payload)
  // const ids=
})
