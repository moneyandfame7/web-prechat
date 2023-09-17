import type {API_AVATAR_VARIANTS} from 'common/environment'

import type {UserConnection} from './request'

export type Platform = 'macOS' | 'iOS' | 'Windows' | 'Android' | 'Linux' | 'Unknown'

export type AuthConnection = UserConnection & {browser: string; platform: string}

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

// type ApiAuthState = (typeof API_AUTH_STATE)[number]
// export type ApiAuthResponse =
//   | {
//       _: 'signUpRequired'
//     }
//   | {
//       _: 'passwordRequired'
//       twoFa: TwoFactorAuth
//     }
//   | {
//       _: 'authDone'
//       session: string
//     }
// eslint-disable-next-line @typescript-eslint/no-namespace
// namespace _ApiAuthResponse {
//   export type authSignUpRequired = {
//     _: 'signUpRequired'
//   }
//   export type authPasswordRequired = {
//     _: 'passwordRequired'
//     twoFa: TwoFactorAuth
//   }
//   export type authDone = {
//     _: 'authDone'
//     session: string
//   }
// }
// export type ApiAuthResponse =
//   | _ApiAuthResponse.authSignUpRequired
//   | _ApiAuthResponse.authDone
//   | _ApiAuthResponse.authPasswordRequired

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

export type ApiAvatarVariant = (typeof API_AVATAR_VARIANTS)[number]
export interface ApiChatMember {}
export interface ApiAvatar {
  avatarVariant: ApiAvatarVariant
  url: string
  hash: string
}
export interface ApiSettings {}
export interface ApiPrivacySettings {}
