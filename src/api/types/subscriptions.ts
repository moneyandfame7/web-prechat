import type {ApiChat, ApiMessage, ApiUser, ApiUserStatus} from 'api/types'

export interface ApiChatSub {
  chat: ApiChat
  users: ApiUser[]
}

export interface ApiUserStatusSub {
  status: ApiUserStatus
  userId: string
}

export interface ApiNewMessageSub {
  chat: ApiChat
  message: ApiMessage
}
export interface ApiEditMessageSub {
  message: ApiMessage
}
export interface ApiDeleteMessagesSub {
  chatId: string
  ids: string[]
}

export interface ApiDraftUpdateSub {
  chatId: string
  ownerId: string
  text: string | undefined
}
