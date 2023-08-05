import type {DeepSignal} from 'deepsignal'

import type {ConfirmationResult, RecaptchaVerifier} from 'firebase/auth'

import type {LanguagePack, ApiLangCode} from 'types/lib'
import type {ApiUser} from 'types/api'
import type {UserConnection} from 'types/request'
import type {AuthScreens} from './screens'
import type {ApiCountry} from 'api/types/langPack'

export type Theme = 'light' | 'dark'

export interface SettingsState {
  theme: Theme
  i18n: {
    lang_code: ApiLangCode
    pack: LanguagePack
  }
  language: ApiLangCode
  suggestedLanguage: ApiLangCode | undefined
  showTranslate: boolean
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
  isCacheSupported: boolean
  globalSearch: GlobalSearchState
  users: {
    contactIds: string[]
    byId: Record<string, ApiUser>
  }
  countryList: ApiCountry[]
}

export type SignalGlobalState = DeepSignal<GlobalState>
