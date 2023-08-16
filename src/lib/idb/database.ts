import {type IDBPDatabase, openDB} from 'idb'

import type {ApiUser, ApiChat} from 'api/types'
import type {AnyObject} from 'types/common'
import type {Theme} from 'types/state'

export type StorageName = 'users' | 'chats' | 'state'
export interface Storages {
  users: ApiUser
  chats: ApiChat
  state: {
    counter: number
    theme: Theme
  }
}
export interface StorageOptions<N extends StorageName> {
  name: N
  optionalParameters?: {
    keyPath?: keyof Storages[N] | (keyof Storages[N])[] | null
    autoIncrement?: boolean
  }
}

export interface DatabaseOptions<Name extends string> {
  name: string
  version: number
  storages: Array<{
    name: Name
    optionalParameters?: IDBObjectStoreParameters
  }>
}
export const DATABASE_OPTIONS: DatabaseOptions<StorageName> = {
  name: 'prechat-ZAEBAL',
  version: 1,
  storages: [
    {
      name: 'chats',
      optionalParameters: {
        keyPath: 'id'
      }
    } satisfies StorageOptions<'chats'>,
    {
      name: 'users',
      optionalParameters: {
        keyPath: 'id'
      }
    } satisfies StorageOptions<'users'>,
    {name: 'state'} satisfies StorageOptions<'state'>
  ]
}

export class Database {
  public idb!: IDBPDatabase

  private options!: DatabaseOptions<StorageName>

  public async init(options: DatabaseOptions<StorageName>) {
    this.idb = await openDB(options.name, options.version, {
      upgrade(db) {
        options.storages.forEach((storage) => {
          if (!db.objectStoreNames.contains(storage.name)) {
            db.createObjectStore(storage.name, storage.optionalParameters)
          }
        })
      }
    })

    this.options = options
  }

  public async get(storeName: StorageName, key: string) {
    return this.idb.get(storeName, key)
  }

  public async set(storeName: StorageName, value: any, key: string) {
    // console.log(`SET TO ${storeName}, ${key}`, value)
    const storeOptions = this.getStoreOptions(storeName)

    /* ? undefined : key - ми вказали в DATABASE_OPTIONS для деяких таблиць keyPath, або не варто вказувати його??? */
    return this.idb.put(
      storeName,
      value,
      storeOptions.optionalParameters?.keyPath ? undefined : key
    )
  }

  public async getAll(storeName: StorageName) {
    const keys = (await this.idb.getAllKeys(storeName)) as string[]

    const data: AnyObject = {}
    await Promise.all(
      keys.map(async (key) => {
        data[key] = await this.idb.get(storeName, key)
      })
    )

    return Object.keys(data).length ? data : undefined
  }

  public async delete(storeName: StorageName, key: string) {
    try {
      await this.idb.delete(storeName, key)

      return true
    } catch (e) {
      console.dir(e)
      return false
    }
  }

  public async clear(storeName: StorageName) {
    try {
      await this.idb.clear(storeName)

      return true
    } catch (e) {
      console.dir(e)
      return false
    }
  }

  private getStoreOptions(storeName: StorageName) {
    const options = this.options.storages.find((s) => s.name === storeName)

    if (!options) {
      throw new Error(`Options for ${storeName} not provided`)
    }

    return options
  }
}
export const database = new Database()
