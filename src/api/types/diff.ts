import type {ApiChat, ApiUser} from '.'

export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'USERNAME_NOT_OCCUPIED'
  | 'USERNAME_INVALID'
  | 'FORBIDDEN'
  | 'AUTH_VERIFY_CODE'
  | 'AUTH_SESSION_TOO_FRESH'
  | 'AUTH_SESSION_EXPIRED'
  | 'AUTH_SESSION_INVALID'
  | 'AUTH_SESSION_PASSWORD_NEEDED'
  | 'USER_NOT_FOUND'
  | 'PHONE_NUMBER_NOT_FOUND'
  | 'PHONE_NUMBER_INVALID'
  | 'PHONE_NUMBER_REGISTERED'
  | 'API_TOKEN_INVALID'
  | 'API_TOKEN_NOT_PROVIDED'
  | 'API_TOKEN_ALREADY_EXIST'
  | 'QUERY_IS_EMPTY'
  | 'INVALID_ID'
  | 'NOT_FOUND_ENTITY'
  | 'CONTACT_EXIST'
  | 'CONTACT_NAME_EMPTY'
  | 'BAD_REQUEST'
export interface ApiError {
  code: ApiErrorCode
  message: string
  method?: string
  path: string[]
}

export interface ApiPhoto {
  id: string
  date: Date
  blurHash: string
  url: string
}

export type ResolvedPeer =
  | {
      type: 'chat'
      resolved: ApiChat
    }
  | {
      type: 'user'
      resolved: ApiUser
    }

export type ApiChatId = string
export type ApiUserId = string
export type ApiPeerId = ApiChatId | ApiUserId
