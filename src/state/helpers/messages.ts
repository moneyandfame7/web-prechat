import type {ApiChat, ApiPhoto, ApiUser} from 'api/types'
import type {
  ApiDocument,
  ApiMessage,
  ApiMessageAction,
  ApiMessageEntity,
} from 'api/types/messages'

import {TEST_translate} from 'lib/i18n'

import {logger} from 'utilities/logger'

import type {MediaItem} from 'components/popups/SendMediaModal'

import {getUserName} from './users'

export function buildLocalMessageContent(
  items: MediaItem[],
  sendMediaAsDocument?: boolean
): ApiMessage['content'] {
  const photos: ApiPhoto[] = sendMediaAsDocument
    ? []
    : items
        .filter((item) => item.isImage)
        .map((photo) => ({
          id: photo.id,
          date: new Date().toISOString(),
          url: photo.previewUrl!,
          withSpoiler: photo.withSpoiler,
          height: photo.dimension?.height,
          width: photo.dimension?.width,
          blurHash: photo.blurHash,
        }))

  const documents: ApiDocument[] = items
    .filter((item) => sendMediaAsDocument || !item.isImage)
    .map((document) => ({
      id: document.id,
      date: new Date().toISOString(),
      url: document.previewUrl!,
      isMedia: document.isImage,
      // extension:document.
      size: document.file.size,
      fileName: document.file.name.split(`${document.id}_`).pop() || document.file.name,
      blurHash: document.blurHash,
    }))

  return {
    ...(documents.length ? {documents} : {}),
    ...(photos.length ? {photos} : {}),
  }
}

/* тут ми просто створюємо повідомлення наперед, щоб не чікати відповіді з бекенду */
export function buildLocalMessage({
  orderedId,
  text,
  entities,
  senderId,
  chatId,
  isChannel,
  mediaItems,
  sendMediaAsDocument,
}: {
  orderedId: number
  text: string
  entities?: ApiMessageEntity[]
  senderId: string
  chatId: string
  isChannel?: boolean
  mediaItems?: MediaItem[]
  sendMediaAsDocument?: boolean
}): ApiMessage {
  // const isChannel = chat.type === 'chatTypeChannel'
  const content = mediaItems ? buildLocalMessageContent(mediaItems, sendMediaAsDocument) : {}
  return {
    id: crypto.randomUUID(),
    orderedId,
    chatId,
    content,
    createdAt: new Date().toISOString(),
    text,
    sendingStatus: 'pending',
    senderId,
    isOutgoing: !isChannel,
  } satisfies ApiMessage
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

export function getLastOutgoingMessage({
  messagesById,
}: {
  messagesById: Record<string, ApiMessage>
}) {
  return Object.values(messagesById)
    .sort((a, b) => b.orderedId - a.orderedId)
    .find((m) => m.isOutgoing /* &&date ~<48hours? */)
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

export function getDocumentPreview() {}
