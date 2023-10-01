import type {UserConnection} from 'types/request'

export type AuthConnection = UserConnection & {
  platform: string
  browser: string
}
export type AuthSendPhoneResponse = {
  userId?: string
  hasActiveSession: boolean
}
export type AuthSignUpInput = {
  silent: boolean
  firstName: string
  lastName?: string
  phoneNumber: string
  firebase_token: string
  connection: AuthConnection
}

export type AuthSignInInput = {
  firebase_token: string
  connection: AuthConnection
  phoneNumber: string
}

export interface ApiSession {
  id: string
  ip: string
  region: string
  country: string
  platform: string
  browser: string
  createdAt: Date
  activeAt: Date
  userId: string
  isCurrent?: boolean
}
