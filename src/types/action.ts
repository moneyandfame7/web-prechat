import type {SessionData} from './api'

export interface SignUpPayload {
  silent: boolean
  firstName: string
  photo?: File
  lastName?: string
}
export interface SignInPayload {
  userId: string
  firebase_token: string
  connection: SessionData
}
