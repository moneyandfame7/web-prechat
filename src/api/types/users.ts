import type {API_AVATAR_VARIANTS} from 'common/config'

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
  isSelf?: boolean
  isContact?: boolean
  isMutualContact?: boolean
  fullInfo?: {
    bio?: string
    avatar: ApiAvatar
  }
}

export interface ApiUserFull {
  avatar: ApiAvatar
  bio?: string
}
export type ApiAvatarVariant = (typeof API_AVATAR_VARIANTS)[number]

export interface ApiAvatar {
  avatarVariant: ApiAvatarVariant
  url: string
  hash: string
}

export type ApiUserStatus =
  | {
      _: 'online'
    }
  | {
      _: 'offline'
      wasOffline: number
    }
  | {
      _: 'recently'
    }
