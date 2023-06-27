import type { DeepSignal } from 'deepsignal'

import { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth'

import lang from 'lib/i18n/lang'
import type { SupportedLanguages } from 'types/lib'
import type { Country } from 'types/api'
import type { Connection } from 'types/request'

export type Theme = 'light' | 'dark' | 'system'

export enum AuthScreens {
  PhoneNumber = 'PhoneNumber',
  Password = 'AuthPassword',
  Code = 'Code',
  SignUp = 'SignUp'
}

export interface SettingsState {
  theme: Theme
  i18n: {
    lang_code: SupportedLanguages
    countries: Country[]
    pack: typeof lang
  }
  suggestedLanguage?: SupportedLanguages
}
export interface AuthState {
  rememberMe: boolean
  connection?: Connection
  phoneNumber?: string
  captcha?: RecaptchaVerifier
  confirmResult?: ConfirmationResult
  error?: string
  loading?: boolean
  userId?: string
  screen: AuthScreens
  token?: string
  passwordHint?: string
  email?: string
  session?: string
}
export interface GlobalState {
  settings: SettingsState
  auth: AuthState
  initialization: boolean
}

export type SignalGlobalState = DeepSignal<GlobalState>
