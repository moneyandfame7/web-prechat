/* eslint-disable @typescript-eslint/no-explicit-any */
import type {AnyObject} from 'types/common'

export interface PersistStorage {
  put: (key: any, item: any) => Promise<any>
  get: () => Promise<any>
  remove: (key: any) => Promise<any>
  clear: () => Promise<any>
}

export interface PersistIdbStorage<T extends AnyObject> extends PersistStorage {
  put: (obj: Partial<T>) => Promise<void>
  get: () => Promise<T | undefined>
  getOne: <K extends keyof T>(key: K) => Promise<T[K] | undefined>
  remove: (key: keyof T) => Promise<any>
}
export type StoragesName = 'auth' | 'users' | 'chats' | 'settings' | 'i18n' | 'sessions'
export interface PersistDbConfig {
  databaseName: string
  version: number
  storages: {
    name: StoragesName
    optionalParameters?: {
      keyPath?: string | null
      autoIncrement?: boolean
    }
  }[]
}
