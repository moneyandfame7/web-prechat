import type {ApiChat} from 'api/types'

import {selectChat} from 'state/selectors/chats'
import type {SignalGlobalState} from 'types/state'

import {updateByKey} from 'utilities/object/updateByKey'
import {storageManager} from 'lib/idb/manager'
import {DEBUG} from 'common/config'

export function updateChats(
  global: SignalGlobalState,
  chatsById: Record<string, ApiChat>
) {
  updateByKey(global.chats.byId, chatsById)

  storageManager.chats.set(chatsById)
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
  storageManager.chats.set({
    [chatId]: {
      ...chat,
      ...chatToUpd
    }
  })

  // storageManager.chats.set({
  //   [chatId]: {
  //     ...chat,
  //     ...chatToUpd
  //   }
  // })
}
