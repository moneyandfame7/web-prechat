import { DeepSignal } from 'deepsignal'

import type { SupportedLanguages } from 'types/lib'
import type { Country } from 'types/api'
import type { Connection } from 'types/request'
import { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth'

export type Theme = 'light' | 'dark' | 'system'

export enum AuthScreens {
  PhoneNumber = 'PhoneNumber',
  Password = 'AuthPassword',
  Code = 'Code',
  SignUp = 'SignUp'
}

export type AuthPhase = 'waitPhone' | 'waitCode' | 'waitPassword' | 'waitSignup'

export interface Settings {
  theme: Theme
  language: SupportedLanguages
  suggestedLanguage?: SupportedLanguages
}

export interface AuthState {
  rememberMe: boolean
  connection?: Connection
  phoneNumber?: string
  captcha?: RecaptchaVerifier
  confirmResult?: ConfirmationResult
  captchaId?: number
  error?: string
  loading?: boolean
  /* If false - sign up, else - password or main screen */
  userId?: string
  isAuthorized: boolean
  screen: AuthScreens
  /* Firebase auth token for verify phone number during sign up*/
  token?: string
  hasActiveSessions: boolean
  passwordHint?: string
  email?: string
}

export interface GlobalStateProperties {
  countryList: Country[]
  settings: Settings
  auth: AuthState
  initialization: boolean
}
export type GlobalState = DeepSignal<GlobalStateProperties>
