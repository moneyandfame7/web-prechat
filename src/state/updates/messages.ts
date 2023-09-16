import type {ApiMessage} from 'api/types/messages'

import {selectChatMessages} from 'state/selectors/messages'
import {storages} from 'state/storages'

import {updateByKey} from 'utilities/object/updateByKey'

import type {SignalGlobalState} from 'types/state'

export function updateMessages(
  global: SignalGlobalState,
  chatId: string,
  messages: Record<string, ApiMessage>
) {
  const byId = selectChatMessages(global, chatId)

  /* Avoid to recreate???? */
  if (byId && Object.keys(messages).every((newId) => Boolean(byId[String(newId)]))) {
    return
  }
  if (!byId) {
    global.messages.byChatId[chatId] = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      byId: messages as any,
    }
  } else {
    updateByKey(byId, messages)
  }

  storages.messages.put(messages)
}

export function updateMessage(
  global: SignalGlobalState,
  chatId: string,
  messageId: string,
  message: Partial<ApiMessage>
) {
  const chat = global.messages.byChatId[chatId]
  updateByKey(chat.byId[messageId], message)

  // storages.messages.put({})
}
