import type {ApiInputPeer, ApiLangKey, ApiPhoto} from '.'

export interface ApiMessage {
  id: string
  senderId?: string
  chatId: string
  forwardTo?: string
  isOutgoing?: boolean
  text?: string
  createdAt: Date
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
  peer: ApiInputPeer
  silent?: boolean
  text?: string
  sendAs?: ApiInputPeer
}
