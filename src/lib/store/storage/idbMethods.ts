import type {Signal} from '@preact/signals'
import type {IDBPDatabase} from 'idb'

import {deepCopy} from 'utilities/object/deepCopy'

import type {AnyObject} from 'types/common'
import type {PersistIdbStorage} from './types'
import {DEBUG} from 'common/config'

interface IdbMethodsConfig {
  dbPromise: Promise<IDBPDatabase<unknown>>
  storeName: string
  optionalParameters?: IDBObjectStoreParameters
  enabled: Signal<boolean>
}
export function idbMethods<T extends AnyObject>(
  config: IdbMethodsConfig
): PersistIdbStorage<T> {
  const {dbPromise, storeName, optionalParameters, enabled} = config

  return {
    /* Put. */
    async put(obj) {
      if (!enabled.value) {
        if (DEBUG) {
          // eslint-disable-next-line no-console
          console.warn('Persist disabled. Return.')
        }
        return
      }

      const db = await dbPromise
      const tx = db.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = deepCopy(obj[key])
          // ???? FIX IT
          await store.put(value, optionalParameters?.keyPath ? undefined : key)
        }
      }
    },
    /* Get. */
    async get() {
      if (!enabled.value) {
        if (DEBUG) {
          // eslint-disable-next-line no-console
          console.warn('Persist disabled. Return.')
        }
        return
      }
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
        if (DEBUG) {
          // eslint-disable-next-line no-console
          console.warn('Persist disabled. Return.')
        }
        return
      }
      const db = await dbPromise
      await db.delete(storeName, key as IDBValidKey)
    },
    /* Clear. */
    async clear() {
      if (!enabled.value) {
        if (DEBUG) {
          // eslint-disable-next-line no-console
          console.warn('Persist disabled. Return.')
        }
        return
      }
      const db = await dbPromise

      await db.clear(storeName)
    }
  }
}
