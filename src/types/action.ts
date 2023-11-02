import type {HistoryDirection} from 'api/types'

export interface SignUpPayload {
  silent: boolean
  firstName: string
  lastName?: string
}
export interface SignInPayload {
  firebase_token: string
}

export interface GetHistoryPayload {
  chatId: string
  limit?: number
  offsetId?: number
  offsetNativeId?: string
  direction?: HistoryDirection
  maxDate?: Date
  includeOffset?: boolean
}
