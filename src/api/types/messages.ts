import type {ApiInputPeer, ApiLangKey, ApiPhoto} from '.'

export type ApiMessageSendingStatus = 'pending' | 'failed' | 'success' | 'unread'
export interface ApiMessage {
  id: string
  senderId?: string
  chatId: string
  forwardTo?: string
  isOutgoing?: boolean
  text?: string
  createdAt: Date
  sendingStatus?: ApiMessageSendingStatus // only in Client
  content: {
    formattedText?: ApiFormattedText
  }
  editedAt?: Date
  action?: ApiMessageAction
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
  chatId: string
  silent?: boolean
  text: string
  entities?: ApiMessageEntity[]
  sendAs?: ApiInputPeer
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
