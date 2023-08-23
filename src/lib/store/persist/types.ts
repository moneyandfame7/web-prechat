/* eslint-disable @typescript-eslint/no-explicit-any */
import type {AnyObject} from 'types/common'
import type {CombinedStore} from '../types'

export interface PersistStorage {
  put: (key: any, item: any) => Promise<any>
  get: () => Promise<any>
  remove: (key: any) => Promise<any>
  clear: () => Promise<any>
}

export interface PersistIdbStorage<T extends AnyObject> extends PersistStorage {
  put: (obj: Partial<T>) => Promise<void>
  get: () => Promise<T | undefined>
  remove: (key: keyof T) => Promise<any>
}

export interface PersistDbConfig<RootState extends CombinedStore<any>> {
  databaseName: string
  version: number
  storages: Partial<{
    [K in keyof ReturnType<RootState['getInitialState']>]: {
      name: /*  ReturnType<RootState["getNames"]>[K] | */ string
      // i'ms use "initialState instead of getState, because getState return signal "
      optionalParameters?: {
        keyPath?: string | null
        autoIncrement?: boolean
      }
    }
  }>
}
