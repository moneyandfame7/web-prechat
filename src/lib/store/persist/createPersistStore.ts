import {type IDBPDatabase, openDB} from 'idb'
import {deepSignal} from 'deepsignal'

import type {AnyObject} from 'types/common'

import type {CombinedStore} from '../types'
import type {PersistDbConfig, PersistIdbStorage} from './types'
import type {Signal} from '@preact/signals'
import {logDebugWarn} from 'lib/logger'
import {deepCopy} from 'utilities/object/deepCopy'

export function createPersistStore<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RootStore extends CombinedStore<any>,
  Config extends PersistDbConfig<RootStore> = PersistDbConfig<RootStore>
>(config: Config) {
  const {databaseName, storages, version} = config
  if (!storages) {
    throw new Error('Storages cannot be empty')
  }
  const store = deepSignal({
    initialized: false,
    enabled: false
  })
  const storagesNames = Object.keys(storages).map((stores) => storages[stores]?.name)

  const dbPromise = openDB(databaseName, version, {
    upgrade: (upgradeDb) => {
      if (!storages) {
        return
      }
      Object.keys(storages).forEach((key) => {
        if (!storages[key]) {
          return
        }
        const storageName = storages[key]!.name

        const storagesParameters = storages[key]?.optionalParameters
        if (!upgradeDb.objectStoreNames.contains(storages[key]!.name)) {
          upgradeDb.createObjectStore(
            storageName,
            storagesParameters as IDBObjectStoreParameters
          )
        }
      })
    }
  })

  /**
   *
   * @param config
   * @returns
   */
  function injectStorage<
    T extends AnyObject /*  = ReturnType<RootStore["getInitialState"]>[StoreName], */
    /* StoreName extends keyof Config["storages"] = string, */
  >(config: {forStore: keyof Config['storages']}) {
    const {forStore} = config

    const storageNameFromStore = storages[forStore]?.name

    if (!storagesNames.includes(storageNameFromStore) || !storageNameFromStore) {
      throw new Error(
        `Store ${
          storageNameFromStore || String(forStore)
        } not defined in "createPeristDb"`
      )
    }

    const idbStorage = idbMethods<T>({
      dbPromise,
      storeName: storageNameFromStore,
      optionalParameters: storages[forStore]
        ?.optionalParameters as IDBObjectStoreParameters,
      enabled: store.$enabled!
    })

    // store.$enabled?.subscribe((IS_ENABLED) => {
    //   console.log({ IS_ENABLED })
    //   // idbStorage.put()
    //   /* forcePersist if i enable persist??? */
    //   // @ts-ignore
    //   // const mySukaState = rootStore2.getState()[forStore]

    //   // console.log({ mySukaState })
    // })

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
    isEnabled: store.$enabled!
  }
}

interface IdbMethodsConfig {
  dbPromise: Promise<IDBPDatabase<unknown>>
  storeName: string
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
      logDebugWarn(enabled.value, 'enabled')

      if (!enabled.value) {
        return
      }

      const db = await dbPromise
      const tx = db.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)

      for (const key in obj) {
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
    }
  }
}
