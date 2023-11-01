import type {ApiChat, ApiUser} from 'api/types'
import type {ApiMessage, ApiMessageAction, ApiMessageEntity} from 'api/types/messages'

import {TEST_translate} from 'lib/i18n'

import {logger} from 'utilities/logger'

import {getUserName} from './users'

/* тут ми просто створюємо повідомлення наперед, щоб не чікати відповіді з бекенду */
export function buildLocalMessage({
  orderedId,
  text,
  entities,
  senderId,
  chatId,
  isChannel,
}: {
  orderedId: number
  text: string
  entities?: ApiMessageEntity[]
  senderId: string
  chatId: string
  isChannel?: boolean
}): ApiMessage {
  // const isChannel = chat.type === 'chatTypeChannel'
  return {
    id: crypto.randomUUID(),
    orderedId,
    chatId,
    content: {
      formattedText: {
        text,
        entities,
      },
    },
    createdAt: new Date().toISOString() as any,
    text,
    sendingStatus: 'pending',
    senderId,
    isOutgoing: !isChannel,
  }
}
export function getFirstUnreadMessage({
  messagesById,
  lastRead,
}: {
  messagesById: Record<string, ApiMessage>
  lastRead: number
}) {
  return Object.values(messagesById)
    .sort((a, b) => a.orderedId - b.orderedId)
    .find((m) => {
      return !m.isOutgoing && m.orderedId > lastRead
    })
}
export function orderHistory(messages: ApiMessage[]) {
  return messages.sort((a, b) => {
    return a.orderedId - b.orderedId
    // const aDate = new Date(a.createdAt).getTime()
    // const bDate = new Date(b.createdAt).getTime()

    // return aDate - bDate
  })
}

export function countUnreadMessages(ids: number[], firstUnread: number, maxUnread: number) {
  let count = 0
  for (let i = 0, l = ids.length; i < l; i++) {
    if (ids[i] >= firstUnread && ids[i] <= maxUnread) {
      count++
    }

    if (ids[i] >= maxUnread) {
      break
    }
  }
  logger.info('IDS:', ids, {firstUnread, maxUnread, count})

  return count
}

export function getMessageActionText(action: ApiMessageAction, sender?: ApiUser) {
  switch (action.type) {
    case 'chatCreate': {
      const trans = TEST_translate('Notification.CreatedChatWithTitle', {
        name: sender ? getUserName(sender) : 'suka hz 4e eto',
        title: action.values[0],
      })
      return trans
    }
    default:
      return 'Not Supported now'
  }
}
