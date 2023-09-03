import type {ApiChat, ApiUser, ApiUserStatus} from 'api/types'

export interface ApiChatSub {
  chat: ApiChat
  users: ApiUser[]
}

export interface ApiUserStatusSub {
  status: ApiUserStatus
  userId: string
}
