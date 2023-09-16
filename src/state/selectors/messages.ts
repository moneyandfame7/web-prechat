import type {ApiMessage} from 'api/types/messages'

import type {SignalGlobalState} from 'types/state'

/**
 * @todo функціонал forward, reply? - можливо просто повідомлення включати це в prisma, або погуглити
 */
export function selectChatMessages(
  global: SignalGlobalState,
  chatId: string
): Record<string, ApiMessage> | undefined {
  return global.messages.byChatId[chatId]?.byId
}

export function selectMessage(global: SignalGlobalState, chatId: string, messageId: string) {
  const messages = selectChatMessages(global, chatId)

  return messages ? messages[messageId] : undefined
}
