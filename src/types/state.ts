import type {DeepSignal} from 'deepsignal'
import type {ConfirmationResult, RecaptchaVerifier} from 'firebase/auth'

import type {
  ApiChat,
  ApiCountry,
  ApiLanguage,
  ApiSession,
  ApiUser,
  ApiUserStatus,
} from 'api/types'

import type {ApiLangCode, LanguagePack} from 'types/lib'
import type {UserConnection} from 'types/request'

import type {AuthScreens, SettingsScreens} from './screens'

export type Theme = 'light' | 'dark'
export type DistanceUnit = 'kilometers' | 'miles'
export type TimeFormat = '12h' | '24h'
export interface SettingsState {
  theme: Theme
  i18n: {
    lang_code: ApiLangCode
    pack: LanguagePack
  }
  suggestedLanguage?: ApiLangCode
  showTranslate: boolean
  animationLevel: 0 | 1 | 2
  passcode: {
    hasPasscode: boolean
    isScreenLocked: boolean
    isLoading: boolean
  }
  general: {
    theme: Theme
    distanceUnit: DistanceUnit
    messageSendByKey: 'enter' | 'ctrl-enter'
    timeFormat: TimeFormat
    messageTextSize: number
  }
  transitions: {
    blur: boolean
    pageTransitions: boolean
  }
  languages?: ApiLanguage[]
}

export interface AuthState {
  rememberMe: boolean
  connection: UserConnection | undefined
  phoneNumber: string | undefined
  captcha: RecaptchaVerifier | undefined
  confirmResult: ConfirmationResult | undefined
  error: string | undefined
  isLoading: boolean
  userId: string | undefined
  screen: AuthScreens
  firebase_token: string | undefined
  passwordHint: string | undefined
  email: string | undefined
  session: string | undefined
  sessionLastActivity: number | undefined
}
export interface GlobalSearchState {
  known?: {
    users?: ApiUser[]
    chatIds?: string[]
  }
  global?: {
    users?: ApiUser[]
    chatIds?: string[]
  }
  isLoading: boolean
}
export interface GlobalState {
  settings: SettingsState
  auth: AuthState
  initialization: boolean
  globalSearch: GlobalSearchState

  users: {
    contactIds: string[]
    statusesByUserId: Record<string, ApiUserStatus>
    byId: Record<string, ApiUser>
  }

  chats: {
    byId: Record<string, ApiChat>
    isLoading: boolean
    ids: string[]
    usernames: {[username: string]: string}
  }

  activeSessions: {
    byId: Record<string, ApiSession>
    ids: string[]
  }

  newContact: {
    userId?: string
    isByPhoneNumber: boolean
  }

  notification: {
    title?: string
    isOpen: boolean
  }

  commonModal: {
    title?: string
    body?: string
    isOpen: boolean
  }

  globalSettingsScreen?: SettingsScreens
  countryList: ApiCountry[]
}

export type SignalGlobalState = DeepSignal<GlobalState>

export type TransitionsTypeKey = 'menuBlur' | 'pageTransitions'
export type TransitionsType = {
  [key in TransitionsTypeKey]: boolean
}

export type AuthStage =
  | 'waitPhone'
  | 'waitCode'
  | 'waitPassword'
  | 'waitRegister'
  | 'authReady'
export type State = {
  settings: {
    transitions: TransitionsType
    theme: Theme
    messageSendKey: 'enter' | 'ctrlEnter'
    distanceUnit: 'kilometers' | 'miles'
    language: ApiLangCode
    languages?: ApiLanguage[]
    messageTextSize: number
    timeFormat: '12h' | '24h'
  }

  auth: {
    currentUserId?: string
    phoneNumber?: string
    rememberMe: boolean
    session?: string
    screen: AuthScreens
  }
}
