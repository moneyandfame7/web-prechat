import type {API_AVATAR_VARIANTS} from 'common/config'

import type {ApiPhoto} from './diff'

export interface ApiInputUser {
  userId: string
}
export interface ApiInputGetUsers {
  ids: string[]
}
export interface ApiUser {
  id: string
  firstName: string
  lastName?: string
  username?: string
  phoneNumber: string
  status?: ApiUserStatus
  color: ApiColorVariant
  isSelf?: boolean
  isContact?: boolean
  isMutualContact?: boolean
  photo?: ApiPhoto
}
export interface ApiUsername {
  username: string
  isActive: boolean
}

export type ApiColorVariant = (typeof API_AVATAR_VARIANTS)[number]

export interface ApiAvatar {
  avatarVariant: ApiColorVariant
  url: string
  hash: string
}

export type UserStatusType =
  | 'userStatusOnline'
  | 'userStatusRecently'
  | 'userStatusLastMonth'
  | 'userStatusLastWeek'
  | 'userStatusLongTimeAgo'
export type ApiUserStatus =
  | {
      type: UserStatusType
    }
  | {
      type: 'userStatusOffline'
      wasOnline: number
    }
