import type {ApiChat} from 'api/types'

import {selectChat} from 'state/selectors/chats'
import type {SignalGlobalState} from 'types/state'

import {updateByKey} from 'utilities/object/updateByKey'
import {storageManager} from 'lib/idb/manager'

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
