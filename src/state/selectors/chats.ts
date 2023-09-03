import type {ApiChat} from 'api/types'

import type {SignalGlobalState} from 'types/state'

export function selectChat(global: SignalGlobalState, chatId: string): ApiChat | undefined {
  return global.chats.byId[chatId]
}

export function selectChatsIds(global: SignalGlobalState) {
  return global.chats.ids
}

export function selectIsChatsFetching(global: SignalGlobalState) {
  return global.chats.isLoading && selectChatsIds(global).length === 0
}

export function selectAllChats(global: SignalGlobalState) {
  return global.chats.ids.map((id) => selectChat(global, id))
}

export function selectIsChatWithSelf(global: SignalGlobalState, chatId: string) {
  return global.auth.userId === chatId
}
