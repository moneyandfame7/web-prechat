import type {ApiPeer, ApiUser} from 'api/types'
import type {ApiMessage} from 'api/types/messages'

import {isUserId} from 'state/helpers/users'

import type {SignalGlobalState} from 'types/state'

import {selectChat} from './chats'
import {selectUser} from './users'

export function selectMessage(global: SignalGlobalState, chatId: string, messageId: string) {
  const messages = selectMessages(global, chatId)

  return messages ? messages[messageId] : undefined
}

/**
 * @todo функціонал forward, reply? - можливо просто повідомлення включати це в prisma, або погуглити
 */
export function selectMessages(
  global: SignalGlobalState,
  chatId: string
): Record<string, ApiMessage> | undefined {
  return global.messages.byChatId[chatId]?.byId
}

export function selectMessageStatus(
  global: SignalGlobalState,
  chatId: string,
  messageId: string
) {
  const message = selectMessage(global, chatId, messageId)

  return message ? message.sendingStatus : undefined
}

export function selectChatMessageIds(
  global: SignalGlobalState,
  chatId: string
): string[] | undefined {
  return global.messages.idsByChatId[chatId]
}

export function selectMessageSender(
  global: SignalGlobalState,
  chatId: string,
  messageId: string
): ApiUser | undefined {
  const message = selectMessage(global, chatId, messageId)
  if (!message?.senderId) {
    return
  }

  return selectUser(global, message.senderId)
}

// export function selectIsOutgoing(global:SignalGlobalState)