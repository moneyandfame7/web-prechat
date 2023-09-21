/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ApiChat,
  ApiChatFull,
  ApiLangCode,
  ApiLangPack,
  ApiMessage,
  ApiPeerId,
  ApiSession,
  ApiUser,
} from 'api/types'

import type {AnyObject} from 'types/common'
import type {AuthState, SettingsState} from 'types/state'

export interface PersistStorage {
  put: (key: any, item: any) => Promise<any>
  get: () => Promise<any>
  remove: (key: any) => Promise<any>
  clear: () => Promise<any>
}

export interface PersistIdbStorage<T extends AnyObject> extends PersistStorage {
  put: (obj: Partial<T>, force?: boolean) => Promise<void>
  get: () => Promise<T | undefined>
  getOne: <K extends keyof T>(key: K) => Promise<T[K] | undefined>
  remove: (key: keyof T) => Promise<any>
  update: <K extends keyof T>(key: K, obj: Partial<T[K]>, force?: boolean) => Promise<void>
}
// export type StoragesName =
//   | 'auth'
//   | 'users'
//   | 'chats'
//   | 'chatsFull'
//   | 'settings'
//   | 'i18n'
//   | 'sessions'
export interface Storages {
  auth: Pick<AuthState, 'rememberMe' | 'phoneNumber' | 'userId' | 'session'>
  settings: SettingsState
  users: Record<string, ApiUser>

  chats: Record<string, ApiChat>
  messages: Record<string, ApiMessage>
  usernames: Record<string, ApiPeerId>
  chatsFull: Record<string, ApiChatFull>
  i18n: Record<ApiLangCode, ApiLangPack>
  sessions: Record<string, ApiSession>
}
export type StoragesName = keyof Storages
// export type StoragesType

// export type Storages = {
//   [key in StoragesName]:
// }
export interface PersistDbConfig {
  databaseName: string
  version: number
  storages: {
    name: StoragesName
    optionalParameters?: {
      keyPath?: string | null
      autoIncrement?: boolean
      index?: {
        name: string
        keyPath: string
      }[]
    }
  }[]
}
