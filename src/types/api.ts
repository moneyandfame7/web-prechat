import type {API_AUTH_STATE, API_AVATAR_VARIANTS} from 'common/config'
import type {ErrorPack, LanguagePack} from './lib'
import type {Connection} from './request'

export interface ApiClientConnection {
  apiToken: string
  httpUrl: string
  wsUrl: string
}
export type Platform = 'macOS' | 'iOS' | 'Windows' | 'Android' | 'Linux' | 'Unknown'

export interface Country {
  name: string
  emoji: string
  code: string
  dial_code: string
}

export interface Session {
  id: string
  ip: string
  region: string
  country: string
  platform: string
  createdAt: string
  activeAt: string
  hash: string
}

export interface FetchLanguage {
  pack: LanguagePack
  countries: Country[]
  errors: ErrorPack
}
export type SessionData = Connection & {browser: string; platform: string}

export interface TwoFactorAuth {
  hint?: string
  email: string
}

/* Arguments and response */
export interface SendPhoneResponse {
  userId?: string
}

export interface SignUpInput {
  input: {
    silent: boolean
    firstName: string
    lastName?: string
    phoneNumber: string
    /* Firebase token after validating phone with code */
    firebase_token: string
    connection: SessionData
  }
  photo?: File
}
export interface SignUpResponse {
  session: string
}

export interface SignInInput {
  firebase_token: string
  connection: SessionData
  userId: string
}
export interface SignInResponse {
  session: string
}

// interface AuthResponse {
//   session_hash: string
// }

export interface ApiSearchGlobalInput {
  limit?: number
  query: string
}

export interface ApiInputGetUsers {
  ids: string[]
}
export interface ApiInputUser {
  id: string
}
export interface ApiSearchGlobalResponse {
  knownChats: any[]
  knownUsers: ApiUser[]
  globalChats: any[]
  globalUsers: ApiUser[]
}

export type ApiSearchUsersResponse = Pick<
  ApiSearchGlobalResponse,
  'globalUsers' | 'knownUsers'
>

export interface ApiChat {}
export interface ApiChatInfo {}

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

export interface ApiUserFull {
  avatar: ApiAvatar
  bio?: string
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

export type ApiAvatarVariant = (typeof API_AVATAR_VARIANTS)[number]
export interface ApiChatMember {}
export interface ApiAvatar {
  avatarVariant: ApiAvatarVariant
  url: string
  hash: string
}
export interface ApiSettings {}
export interface ApiPrivacySettings {}
