import type {SignalGlobalState} from 'types/state'

export function selectChat(global: SignalGlobalState, chatId: string) {
  return global.chats.byId[chatId]
}

export function selectChatsIds(global: SignalGlobalState) {
  return Object.keys(global.chats.byId)
}
