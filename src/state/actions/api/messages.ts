import type {DeepSignal} from 'deepsignal'

import {Api} from 'api/manager'
import {type ApiMessage, HistoryDirection} from 'api/types'

import {createAction} from 'state/action'
import {buildLocalPrivateChat} from 'state/helpers/chats'
import {buildLocalMessage, orderHistory} from 'state/helpers/messages'
import {isUserId} from 'state/helpers/users'
import {selectChat} from 'state/selectors/chats'
import {selectMessage, selectMessages} from 'state/selectors/messages'
import {selectUser} from 'state/selectors/users'
import {updateChat, updateChats} from 'state/updates'
import {
  cancelMessageDeleting,
  deleteMessage,
  deleteMessageLocal,
  updateMessage,
  updateMessages,
} from 'state/updates/messages'

import {filterUnique} from 'utilities/array/filterUnique'
import {buildRecord} from 'utilities/object/buildRecord'
import {updateByKey} from 'utilities/object/updateByKey'
import {timeout} from 'utilities/schedulers/timeout'

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

  // console.log({chatId, chat})

  // return
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
    orderedId: chat.lastMessage ? chat.lastMessage.orderedId + 1 : 1,
    chatId,
    text,
    entities,
    senderId: sendAs || state.auth.userId!,
    isChannel: chat.type === 'chatTypeChannel',
  })
  // updateLastMessage(state, chatId, localMessage, false)
  updateMessages(state, chatId, {[localMessage.id]: localMessage}, false, false)
  updateChat(state, chatId, {
    lastMessage: localMessage,
  })
  // after 1s need to set state status on pending?
  /* Catch error there and update message state */
  try {
    const sended = await Api.messages.sendMessage({
      id: localMessage.id,
      orderedId: localMessage.orderedId,
      chatId,
      text,
      entities,
    })
    if (!sended) {
      updateMessage(state, chatId, localMessage.id, {sendingStatus: 'failed'}, false)
    } else {
      updateMessage(state, chatId, sended.message.id, {sendingStatus: undefined}, false)
    }
  } catch (e) {
    updateMessage(state, chatId, localMessage.id, {sendingStatus: 'failed'}, false)
  }

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

createAction('editMessage', async (state, actions, payload) => {
  const message = selectMessage(state, payload.chatId, payload.messageId)

  if (!message) {
    return
  }
  actions.toggleMessageEditing({active: false})

  const edited = await Api.messages.editMessage(payload)
  if (!edited) {
    actions.toggleMessageEditing({active: true, id: payload.messageId})

    return
  }
  updateMessage(state, payload.chatId, payload.messageId, edited, false)
})

createAction('deleteMessages', async (state, _actns, payload) => {
  const {ids, chatId} = payload
  /* ???? ahahahah */
  ids.forEach((id) => {
    deleteMessageLocal(state, chatId, id)
  })

  const result = await Api.messages.deleteMessages({ids})

  if (result) {
    // batch(() => {
    ids.forEach((id) => {
      deleteMessage(state, chatId, id)
    })
    // })
  } else {
    ids.forEach((id) => {
      cancelMessageDeleting(state, chatId, id)
    })
  }
})

createAction('getHistory', async (state, _actions, payload) => {
  const {
    chatId,
    direction = HistoryDirection.Backwards,
    limit = 10,
    maxDate,
    offsetId,
    includeOffset = false,
  } = payload
  const chat = selectChat(state, chatId)
  // if (!chat) {

  //   return
  // }

  // currentOpenedChat.isMessagesLoading = true

  const result = await Api.messages.getHistory({
    direction,
    chatId,
    offsetId,
    limit,
    maxDate,
    includeOffset,
  })
  console.log({HISTORY: result})
  const oldMessages = selectMessages(state, chatId)

  const merged = [...Object.values(oldMessages || []), ...Object.values(result)]

  const orderedHistory = orderHistory(merged)
  // const merged=[oldMessages?(...Object.values(oldMessages))]
  // console.log(Object.values(oldMessages))
  // const newMessages = result.map((m) => m.id)
  // console.log({
  //   merged: merged.map((m) => m.id),
  //   ids: orderedHistory.map((m) => m.id),
  // })
  const orderedIds = filterUnique(orderedHistory.map((m) => m.id))

  /* Avoid to recreate???? */
  if (
    oldMessages &&
    Object.keys(result).every((newId) => Boolean(oldMessages[String(newId)]))
  ) {
    return
  }
  const record = buildRecord(result, 'id') as DeepSignal<Record<string, ApiMessage>>
  if (!oldMessages) {
    state.messages.byChatId[chatId] = {
      byId: record,
    }
  } else {
    updateByKey(oldMessages, record)
  }
  state.messages.idsByChatId[chatId] = [...orderedIds]

  console.log({orderedIds})
})

createAction('getPinnedMessages', async (state, _actions, payload) => {
  const {chatId, offsetId} = payload

  const chat = selectChat(state, chatId)
  /**
   * @todo зробити щоб був айді в повідомленнях orderId ( increment,idx і т.д )
   */
  /* If it user - we may not have chat */
  if (!isUserId(chatId) && !chat) {
    return
  }
  // Api.messages.getPinnedMessages({chatId, offsetId})
  const result = await timeout<ApiMessage[]>(5000)([])

  const oldMessages = selectMessages(state, chatId)

  const merged = filterUnique([...Object.values(oldMessages || []), ...Object.values(result)])

  const orderedIds = orderHistory(merged).map((m) => m.id)
  if (
    oldMessages &&
    Object.keys(result).every((newId) => Boolean(oldMessages[String(newId)]))
  ) {
    /* do nothing */
  } else {
    const record = buildRecord(result, 'id') as DeepSignal<Record<string, ApiMessage>>
    if (!oldMessages) {
      state.messages.byChatId[chatId] = {
        byId: record,
      }
    } else {
      updateByKey(oldMessages, record)
    }
  }

  state.messages.pinnedIdsByChatId[chatId] = [...orderedIds]
})
