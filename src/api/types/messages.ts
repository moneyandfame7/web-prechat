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
  createdAt: Date
  sendingStatus?: ApiMessageSendingStatus // only on Client
  deleteLocal?: true
  content: {
    formattedText?: ApiFormattedText
    photo?: ApiPhoto
    contact?: ApiContact
  }
  editedAt?: string
  action?: ApiMessageAction
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
   * Message cursor ID.
   */
  offsetId?: string
  /**
   * Whether need include to response message with offset id
   */
  includeOffset?: boolean

  maxDate?: Date
}
export interface GetPinnedMessagesInput {
  chatId: string
  limit?: number
  offsetId?: string
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
