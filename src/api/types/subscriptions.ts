import type {ApiChat, ApiUser} from 'api/types'

export interface ApiChatSub {
  chat: ApiChat
  users: ApiUser[]
}
