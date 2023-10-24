import type {DeepSignal} from 'deepsignal'

import type {ApiMessage} from 'api/types/messages'

import {selectChatMessageIds, selectMessage, selectMessages} from 'state/selectors/messages'
import {storages} from 'state/storages'

import {isDeepEqual} from 'utilities/object/isDeepEqual'
import {updateByKey} from 'utilities/object/updateByKey'

import type {SignalGlobalState} from 'types/state'

import {updateChat} from '.'

export function sortMessagesByNewest(
  global: SignalGlobalState,
  chatId: string,
  ids: string[]
) {
  return ids.sort((a, b) => {
    const aMessage = selectMessage(global, chatId, a)
    const bMessage = selectMessage(global, chatId, b)
    if (!aMessage || !bMessage) {
      return 0
    }

    return new Date(aMessage.createdAt).getTime() - new Date(bMessage.createdAt).getTime()
  })
}

/**
 * Add new message ids and sort
 */
export function replaceMessageIds(
  global: SignalGlobalState,
  chatId: string,
  messages: ApiMessage[]
) {
  const alreadyOrdered = selectChatMessageIds(global, chatId)

  const unique = messages.filter((m) => !alreadyOrdered?.includes(m.id)).map((m) => m.id)
  const ordered2 = sortMessagesByNewest(global, chatId, [...(alreadyOrdered || []), ...unique])

  global.messages.idsByChatId[chatId] = [...ordered2]

  // if (!alreadyOrdered) {
  // } else {
  //   global.messages.idsByChatId[chatId].push(...ordered2)
  // }
}

/**
 * Додає нові повідомлення, але треба подумати, коли треба PUT, а коли ADD.
 */
export function updateMessages(
  global: SignalGlobalState,
  chatId: string,
  messages: Record<string, ApiMessage>,
  forcePersist?: boolean,
  shouldPersist = true
) {
  const byId = selectMessages(global, chatId)

  /* Avoid to recreate???? */
  if (byId && Object.keys(messages).every((newId) => Boolean(byId[String(newId)]))) {
    return
  }
  if (!byId) {
    global.messages.byChatId[chatId] = {
      byId: messages as DeepSignal<Record<string, ApiMessage>>,
    }
  } else {
    updateByKey(byId, messages)
  }
  // const list = Object.values(
  //   global.messages.byChatId[chatId].byId as Record<string, ApiMessage>
  // )

  replaceMessageIds(global, chatId, Object.values(messages))
  // if (shouldPersist) {
  //   storages.messages.put(messages, forcePersist)
  // }
}

export function updateLastMessage(
  global: SignalGlobalState,
  chatId: string,
  message: ApiMessage,
  persist = true
) {
  updateMessages(global, chatId, {[message.id]: message}, true, persist)
  updateChat(global, chatId, {
    lastMessage: message,
  })
}

export function updateMessage(
  global: SignalGlobalState,
  chatId: string,
  messageId: string,
  messageToUpd: Partial<ApiMessage>,
  shouldPersist = true
) {
  const chat = global.messages.byChatId[chatId]

  const message = chat.byId[messageId]
  if (!message) {
    return
  }
  updateByKey(message, messageToUpd)

  if (shouldPersist) {
    storages.messages.put({
      [messageId]: message,
    })
  }
}

export function deleteMessageLocal(
  global: SignalGlobalState,
  chatId: string,
  messageId: string
) {
  const chatMessages = selectMessages(global, chatId)

  const affectedMessage = chatMessages?.[messageId]
  if (!affectedMessage) {
    return
  }
  affectedMessage.deleteLocal = true
}
export function cancelMessageDeleting(
  global: SignalGlobalState,
  chatId: string,
  messageId: string
) {
  const chatMessages = selectMessages(global, chatId)

  const affectedMessage = chatMessages?.[messageId]
  if (!affectedMessage) {
    return
  }
  affectedMessage.deleteLocal = undefined
}
export function deleteMessage(global: SignalGlobalState, chatId: string, messageId: string) {
  const messages = selectMessages(global, chatId)
  const messageIds = selectChatMessageIds(global, chatId)
  if (!messages || !messageIds || !messages?.[messageId]) {
    return
  }
  // const isLastMessage=messages[messageId].
  delete messages[messageId]

  /**
   * @todo при видаленні, треба якось на бекенді змінювати останнє повідомлення.
   *
   * ( як варік, просто передавати при видаленні айді останнього попереднього повідомлення, ну тобто те, яке треба робити останнім )
   */
  const newIds = messageIds.filter((id) => id !== messageId)
  global.messages.idsByChatId[chatId] = newIds
  // const index = messageIds.indexOf(messageId)
  // if (index !== -1) {
  //   console.log('ЗАМІНИВ СПИСОК АЙДІШНІКІВ СУКА!', messageIds)
  //   /* global.messages.idsByChatId[chatId] = */ messageIds.splice(index, 1)

  //   console.log({messageIds})
  // }

  const lastMessageId = messageIds[messageIds.length - 1]

  const lastMessage = selectMessage(global, chatId, lastMessageId)
  if (lastMessage) {
    updateLastMessage(global, chatId, lastMessage)
  }
}
