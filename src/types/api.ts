import type {ApiAuth} from 'api/services/auth'
import type {ErrorPack, LanguagePack} from './lib'
import type {Connection} from './request'
import type {ApiHelp} from 'api/services/help'
import type {ApiSettings} from 'api/services/settings'
import type {Api2Fa} from 'api/services/2fa'

export interface ApiClientOptions {
  connection: ApiClientConnection
  auth: ApiAuth
  help: ApiHelp
  settings: ApiSettings
  twoFa: Api2Fa
}
export interface ApiClientConnection {
  apiToken: string
  httpUrl: string
  wsUrl: string
}
export type Platform = 'macOS' | 'iOS' | 'Windows' | 'Android' | 'Linux' | 'Unknown'

export type Browser =
  | 'Opera'
  | 'Microsoft Edge'
  | 'Google Chrome'
  | 'Safari'
  | 'Mozilla Firefox'
  | 'Microsoft Internet Explorer'

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
