import type {DeepSignal} from 'deepsignal'

import type {ConfirmationResult, RecaptchaVerifier} from 'firebase/auth'

import type {ErrorPack, LanguagePack, SupportedLanguages} from 'types/lib'
import type {ApiUser, Country} from 'types/api'
import type {Connection} from 'types/request'
import type {AuthScreens} from './screens'

export type Theme = 'light' | 'dark' | 'system'

export interface SettingsState {
  theme: Theme
  i18n: {
    lang_code: SupportedLanguages
    countries: Country[]
    pack: LanguagePack
    errors: ErrorPack
  }
  suggestedLanguage: SupportedLanguages | undefined
  leftColumnWidth: number
}
export interface AuthState {
  rememberMe: boolean
  connection: Connection | undefined
  phoneNumber: string | undefined
  captcha: RecaptchaVerifier | undefined
  confirmResult: ConfirmationResult | undefined
  error: string | undefined
  loading: boolean
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
}

export type SignalGlobalState = DeepSignal<GlobalState>
