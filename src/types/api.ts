import type { ErrorPack, LanguagePack } from './lib'
import type { Connection } from './request'

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
export type SessionData = Connection & { browser: string; platform: string }

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
    /* token after validating phone with code */
    token: string
    connection: SessionData
  }
  photo?: File
}
export interface SignUpResponse {
  session: string
}

export interface SignInInput {
  token: string
  connection: SessionData
  userId: string
}
export interface SignInResponse {
  session: string
}
