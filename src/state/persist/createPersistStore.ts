import type {Signal} from '@preact/signals'

import {deepSignal} from 'deepsignal'
import {type IDBPDatabase, openDB} from 'idb'

import {deepCopy} from 'utilities/object/deepCopy'

import type {AnyObject} from 'types/common'

import type {PersistDbConfig, PersistIdbStorage, Storages, StoragesName} from './types'

export function createPersistStore<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Config extends PersistDbConfig = PersistDbConfig
>(config: Config) {
  const {databaseName, storages, version} = config
  if (!storages) {
    throw new Error('Storages cannot be empty')
  }
  const store = deepSignal({
    initialized: false,
    enabled: false,
  })

  const dbPromise = openDB(databaseName, version, {
    upgrade: (upgradeDb) => {
      if (!storages) {
        return
      }
      // eslint-disable-next-line array-callback-return
      storages.map((storage) => {
        if (!upgradeDb.objectStoreNames.contains(storage.name)) {
          /* const store = */ upgradeDb.createObjectStore(
            storage.name,
            storage.optionalParameters
          )

          // store.createIndex(storage.)
        }
      })
    },
  })

  /**
   *
   * @param config
   * @returns
   */
  function injectStorage<N extends StoragesName>(
    storageName: N
  ): PersistIdbStorage<Storages[N]> {
    // console.log({storageName}, storages)
    const storageWithName = storages.find((storage) => storage.name === storageName)

    if (!storageWithName) {
      throw new Error('alsdlasld')
    }

    const idbStorage = idbMethods<Storages[N]>({
      dbPromise,
      storeName: storageWithName.name,
      optionalParameters: storageWithName?.optionalParameters,
      enabled: store.$enabled!,
    })

    return idbStorage
  }

  function disable() {
    store.enabled = false
  }
  function enable(forceFn?: VoidFunction) {
    store.enabled = true

    forceFn?.()
  }

  return {
    injectStorage,
    disable,
    enable,
    /**
     * @todo спробувати без сигналу
     */
    isEnabled: store.$enabled!,
  }
}

interface IdbMethodsConfig {
  dbPromise: Promise<IDBPDatabase<unknown>>
  storeName: StoragesName
  optionalParameters?: IDBObjectStoreParameters
  enabled: Signal<boolean>
}
export function idbMethods<T extends AnyObject>(
  // dbPromise: Promise<IDBPDatabase<unknown>>,
  // storeName: string,
  // optionalParameters?: IDBObjectStoreParameters
  config: IdbMethodsConfig
): PersistIdbStorage<T> {
  const {dbPromise, storeName, optionalParameters, enabled} = config

  return {
    /* Put. */
    async put(obj) {
      if (!enabled.value) {
        return
      }

      const db = await dbPromise
      const tx = db.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)

      for (const key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key)) {
          const value = deepCopy(obj[key])

          await store.put(value, optionalParameters?.keyPath ? undefined : key)
        }
      }
      await tx.done
    },
    /* Get. */
    async get() {
      // if (!enabled.value) {
      //   return
      // }
      const db = await dbPromise
      const tx = db.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)

      const data = {} as T

      const keys = (await store.getAllKeys()) as string[]
      await Promise.all(
        keys.map(async (key: keyof T) => {
          data[key] = await store.get(key as string)
        })
      )
      await tx.done
      return Object.keys(data).length ? data : undefined
    },
    /* Remove. */
    async remove(key) {
      if (!enabled.value) {
        return
      }
      const db = await dbPromise
      await db.delete(storeName, key as IDBValidKey)
    },
    /* Clear. */
    async clear() {
      const db = await dbPromise

      await db.clear(storeName)
    },
    async getOne(key) {
      const db = await dbPromise
      return db.get(storeName, key as IDBValidKey)
    },
  }
}
