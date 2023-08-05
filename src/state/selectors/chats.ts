import type {SignalGlobalState} from 'types/state'

export function selectChat(global: SignalGlobalState, chatId: string) {
  return global.chats.byId[chatId]
}
