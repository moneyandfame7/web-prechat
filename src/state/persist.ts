import { Signal } from '@preact/signals'

import { deepSignal } from 'deepsignal'

import { LocalStorageWrapper } from './localstorage'

export interface PersistConfig<T> {
  whitelist: Array<keyof T>
  key: string
}
type PersistedState<T> = { [K in keyof T]: unknown }
export function createPersistSignal<T extends object>(
  initialState: T,
  storageKey: string,
  whitelist: Array<keyof T>
) {
  const persistedState = LocalStorageWrapper.get<PersistedState<T>>(storageKey)
  const persistedObject = {} as Record<keyof T, unknown>
  // eslint-disable-next-line array-callback-return
  whitelist.map((key) => {
    persistedObject[key] = initialState[key]
  })
  if (!persistedState) {
    // eslint-disable-next-line array-callback-return
    whitelist.map((key) => {
      persistedObject[key] = initialState[key]
    })
    LocalStorageWrapper.set(storageKey, persistedObject)
  }
  const signal = deepSignal<T>({
    ...initialState,
    ...persistedState
  })
  // eslint-disable-next-line array-callback-return
  whitelist.map((key) => {
    // ну і піздець
    ;(signal as Record<string, Signal>)[`$${String(key)}`].subscribe((val) => {
      LocalStorageWrapper.set(storageKey, {
        ...persistedObject,
        [key]: val
      })
    })
  })
  return signal
}
