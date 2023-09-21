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
