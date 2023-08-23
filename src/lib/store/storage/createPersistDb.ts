import {openDB} from 'idb'
import {deepSignal} from 'deepsignal'

import type {AnyObject} from 'types/common'

import type {CombinedStore} from '../types'
import type {PersistDbConfig} from './types'
import {idbMethods} from './idbMethods'

export function createPersistStore<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RooStore extends CombinedStore<any>,
  Config extends PersistDbConfig<RooStore> = PersistDbConfig<RooStore>
>(config: Config) {
  const {databaseName, storages, version} = config
  if (!storages) {
    throw new Error('Storages cannot be empty')
  }
  const store = deepSignal({
    initialized: false,
    enabled: true
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
  function injectStorage<T extends AnyObject>(config: {
    forStore: keyof Config['storages']
  }) {
    const {forStore} = config

    const storageNameFromStore = storages[forStore]?.name

    if (!storagesNames.includes(storageNameFromStore) || !storageNameFromStore) {
      throw new Error(
        `Store ${
          storageNameFromStore || String(forStore)
        } not defined in "createPeristDb"`
      )
    }

    return idbMethods<T>({
      dbPromise,
      storeName: storageNameFromStore,
      optionalParameters: storages[forStore]
        ?.optionalParameters as IDBObjectStoreParameters,
      enabled: store.$enabled!
    })
  }

  function disable() {
    store.enabled = false
  }
  function enable() {
    store.enabled = true
  }

  // function initializeToTrue() {
  //   store.initialized = true
  // }
  /* registered */

  // function isPersist() {}

  // function stopPersist() {}

  // function resetPersist() {}

  // function clearPersist() {}

  // function startPersist() {}
  // initialized
  return {
    injectStorage,
    disable,
    enable,
    isEnabled: store.$enabled!
  }
}
