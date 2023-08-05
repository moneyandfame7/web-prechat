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
  input: {
    silent: boolean
    firstName: string
    lastName?: string
    phoneNumber: string
    firebase_token: string
    connection: AuthConnection
  }
  photo?: File
}
export type AuthSignUpResponse = {
  sessionHash: string
}

export type AuthSignInInput = {
  firebase_token: string
  connection: AuthConnection
  phoneNumber: string
}
export type AuthSignInResponse = {
  sessionHash: string
}
