import {batch} from '@preact/signals'

import {selectChat} from 'state/selectors/chats'
import {selectMessage} from 'state/selectors/messages'
import {createSubscribe} from 'state/subscribe'
import {updateChat, updateChats} from 'state/updates'
import {deleteMessage, updateMessage, updateMessages} from 'state/updates/messages'

import {logger} from 'utilities/logger'

createSubscribe('onNewMessage', (state, _, data) => {
  const {chat, message} = data
  if (message.isOutgoing) {
    console.log('Message subscribe outgoing. ( check on other sessions? )')
    return
  }
  const exist = selectChat(state, chat.id)
  if (!exist) {
    updateChats(state, {[chat.id]: chat})
  } else {
    updateChat(state, chat.id, {
      unreadCount: exist.unreadCount ? exist.unreadCount + 1 : 1, // or just chat.unreadCount?
      lastMessage: message,
    })
  }

  updateMessages(state, chat.id, {
    [message.id]: message,
  })
})

createSubscribe('onDeleteMessages', (state, _, data) => {
  const {chat: affectedChat, ids} = data
  const chat = selectChat(state, affectedChat.id)
  if (!chat) {
    return
  }

  console.log('DELETED MESSAGES:', {chatId: chat.id, ids})

  batch(() => {
    ids.forEach((id) => {
      deleteMessage(state, chat.id, id)
    })
    updateChat(state, chat.id, {
      // maybe повністю оновити чат? та хз зайві ререндери
      lastMessage: affectedChat.lastMessage,
    })
  })
})

createSubscribe('onEditMessage', (state, _, data) => {
  const {message: editedMessage} = data

  const message = selectMessage(state, editedMessage.chatId, editedMessage.id)
  if (!message) {
    console.log('NO MESSAGE SELCTED AHHASHDHASDKJASD')
    return
  }
  logger.info('EDITED MESSAGE: ', editedMessage)
  // updateMessages(
  //   state,
  //   editedMessage.chatId,
  //   {[editedMessage.id]: editedMessage},
  //   false,
  //   false
  // )
  updateMessage(
    state,
    editedMessage.chatId,
    editedMessage.id,
    {
      text: editedMessage.text,
      editedAt: editedMessage.editedAt,
      content: editedMessage.content,
    },
    false
  )
})

// це коли МОЇ повідомлення прочитав хтось інший...
createSubscribe('onReadHistoryOutbox', (state, _, data) => {
  console.error('ХТОСЬ ПРОЧИТАВ ТВОЇ ПОВІДОМЛЕННЯ:', data)
  updateChat(state, data.chatId, {
    lastReadOutgoingMessageId: data.maxId,
  })
})

// це коли Я прочитав чиїсь повідомлення.... ???
createSubscribe('onReadHistoryInbox', (state, _, data) => {
  console.error('ТИ ПРОЧИТАВ ЧИЇСЬ ПОВІДОМЛЕННЯ:', data)

  const chat = selectChat(state, data.chatId)
  if (!chat) {
    return
  }
  // if (chat.lastReadIncomingMessageId! < data.maxId) {
  updateChat(state, data.chatId, {
    lastReadIncomingMessageId: data.maxId,
    unreadCount: data.newUnreadCount,
  })
  // }
})

createSubscribe('onDraftUpdate', (state, _, data) => {
  const {chatId, ownerId, text} = data
  if (ownerId !== state.auth.userId) {
    console.error('NOT MY DRAFT???')
    return
  }
  console.log('UPDATE_DRAFT_SUB:', {chatId, text, ownerId})
  updateChat(state, chatId, {
    draft: text,
  })
})
