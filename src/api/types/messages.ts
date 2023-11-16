import type {ApiInputPeer, ApiLangKey, ApiPhoto} from '.'

export type ApiMessageSendingStatus = 'pending' | 'failed' | 'success' | 'unread'
export interface ApiMessage {
  id: string
  orderedId: number
  senderId?: string
  chatId: string
  forwardTo?: string
  isOutgoing?: boolean
  text?: string
  createdAt: string
  sendingStatus?: ApiMessageSendingStatus // only on Client
  deleteLocal?: true
  content: {
    formattedText?: ApiFormattedText
    photos?: ApiPhoto[] // if length > 1 - is album
    documents?: ApiDocument[]
    contact?: ApiContact
  }
  editedAt?: string
  action?: ApiMessageAction
}
export interface ApiDocument {
  id: string
  date: string
  fileName: string
  size?: number
  url: string
  extension?: string
  blurHash?: string
  isMedia?: boolean
  mimeType?: string
}
export interface ApiContact {
  userId: string
  firstName: string
  lastName: string
  phoneNumber: string
}
export interface ApiDraft {
  text: string
  replyToMsgId?: string
  date: Date
  isLocal?: boolean
}
export type ApiInputSaveDraft = {
  text: string | undefined
  chatId: string
}

export interface ApiMessageAction {
  photo?: ApiPhoto
  text: ApiLangKey
  type: ApiMessageActionType
  users: string[]
  values: string[]
}
export type ApiMessageActionType = 'chatCreate' | 'channelCreate' | 'editTitle'

export interface SendMessageInput {
  id: string
  orderedId: number
  chatId: string
  silent?: boolean
  text: string
  entities?: ApiMessageEntity[]
  sendAs?: ApiInputPeer
  fileOptions?: {[key: string]: {withSpoiler: boolean; mimeType?: string}}
  sendMediaAsDocument?: boolean
}
export interface EditMessageInput {
  chatId: string
  messageId: string
  text: string
}
export interface DeleteMessagesInput {
  ids: string[]
  deleteForAll?: boolean
}
export enum HistoryDirection {
  Backwards = 'Backwards',
  Around = 'Around',
  Forwards = 'Forwards',
}
export interface GetHistoryInput {
  chatId: string
  limit?: number
  direction: HistoryDirection
  /**
   * Message cursor ordered ID.
   */
  offsetId?: number
  /**
   * Message unique ID.
   */
  offsetNativeId?: string
  /**
   * Whether need include to response message with offset id
   */
  includeOffset?: boolean

  maxDate?: Date
}

export interface ReadHistoryInput {
  maxId: number
  chatId: string
}

export interface GetPinnedMessagesInput {
  chatId: string
  limit?: number
  offsetId?: string
}
/**
 * @todo rewrite on contact?: ApiContact ... document?: ... image?.... ?
 */

export interface SendMediaItem {
  withSpoiler: boolean
  mimeType?: string
}
export enum ApiMessageEntityType {
  Italic = 'italic',
  Bold = 'bold',
  Underline = 'underline',
  Strike = 'strike',
  Spoiler = 'spoiler',
  Email = 'email',
  Phone = 'phone',
  Url = 'url',
  TextUrl = 'textUrl',
  Mention = 'mention',
  Code = 'code',
  Hashtag = 'hashtag',
}
export type ApiMessageEntityCommon = {
  type: Exclude<`${ApiMessageEntityType}`, `${ApiMessageEntityType.TextUrl}`>
  start: number
  end: number
}
export type ApiMessageEntityTextUrl = {
  type: ApiMessageEntityType.TextUrl
  start: number
  end: number
  url: string
}

export type ApiMessageEntity = ApiMessageEntityCommon | ApiMessageEntityTextUrl

export interface ApiFormattedText {
  text: string
  entities?: ApiMessageEntity[]
}
