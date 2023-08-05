import type {ApiChat} from 'api/types'

import {selectChat} from 'state/selectors/chats'
import type {SignalGlobalState} from 'types/state'

import {updateByKey} from 'utilities/object/updateByKey'

/**
 *
 * @param shouldOverwrite @default false
 */
export function updateChats(
  global: SignalGlobalState,
  chatsById: Record<string, ApiChat>,
  shouldOverwrite = false
) {
  Object.keys(chatsById).forEach((id) => {
    if (!shouldOverwrite && global.chats.byId[id]) {
      return
    }
    updateByKey(global.chats.byId, {
      [id]: chatsById[id]
    })
  })
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
}
