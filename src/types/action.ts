import type { SessionData } from './api'

export interface SignUpPayload {
  silent: boolean
  firstName: string
  photo?: File
  lastName?: string
}
export interface SignInPayload {
  userId: string
  token: string
  connection: SessionData
}
