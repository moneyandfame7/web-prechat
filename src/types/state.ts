import type {DeepSignal} from 'deepsignal'

import type {ConfirmationResult, RecaptchaVerifier} from 'firebase/auth'

import type {ApiUser, ApiChat, ApiCountry, ApiLanguage} from 'api/types'

import type {LanguagePack, ApiLangCode} from 'types/lib'
import type {UserConnection} from 'types/request'

import type {AuthScreens, SettingsScreens} from './screens'

export type Theme = 'light' | 'dark'

export interface SettingsState {
  theme: Theme
  i18n: {
    lang_code: ApiLangCode
    pack: LanguagePack
  }
  language: ApiLangCode
  suggestedLanguage?: ApiLangCode
  showTranslate: boolean
  isCacheSupported: boolean
  animationLevel: 0 | 1 | 2
  passcode: {
    hasPasscode: boolean
    isScreenLocked: boolean
    isLoading: boolean
  }
}

export interface AuthState {
  rememberMe: boolean
  connection?: UserConnection
  phoneNumber?: string
  captcha?: RecaptchaVerifier
  confirmResult?: ConfirmationResult
  error?: string
  isLoading: boolean
  userId?: string
  screen: AuthScreens
  firebase_token?: string
  passwordHint?: string
  email?: string
  session?: string
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
    byId: Record<string, ApiUser>
  }

  chats: {
    byId: Record<string, ApiChat>
  }

  countryList: ApiCountry[]

  newContact: {
    userId?: string
    isByPhoneNumber: boolean
  }

  notification: {
    title?: string
    isOpen: boolean
  }

  globalSettingsScreen?: SettingsScreens
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
