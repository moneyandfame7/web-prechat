import type {ApiChat} from 'api/types'

import {selectChat} from 'state/selectors/chats'
import {storages} from 'state/storages'

import {DEBUG} from 'common/config'
import {updateByKey} from 'utilities/object/updateByKey'

import type {SignalGlobalState} from 'types/state'

export function updateChats(global: SignalGlobalState, chatsById: Record<string, ApiChat>) {
  updateByKey(global.chats.byId, chatsById)

  // storageManager.chats.set(chatsById)
  storages.chats.put(chatsById)
}

export function updateChat(
  global: SignalGlobalState,
  chatId: string,
  chatToUpd: Partial<ApiChat>
) {
  const chat = selectChat(global, chatId)

  if (!chat) {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.warn(`CHAT ${chatId} to update not found`)
    }
    return
  }

  updateByKey(chat, chatToUpd)

  storages.chats.put({
    // just put chat? we already update him...
    [chatId]: {
      ...chat,
      ...chatToUpd,
    },
  })
}
