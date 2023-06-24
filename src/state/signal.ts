import { deepSignal } from 'deepsignal'

import { AuthScreens, type GlobalState, type GlobalStateProperties } from 'types/state'
import type { DeepPartial } from 'types/common'

import { LocalStorageWrapper } from './localstorage'

const initialState: GlobalStateProperties = {
  settings: {
    theme: 'light',
    language: 'en',
    suggestedLanguage: undefined
  },
  auth: {
    connection: undefined,
    phoneNumber: undefined,
    rememberMe: true,
    userId: undefined,
    isAuthorized: false,
    loading: false,
    screen: AuthScreens.PhoneNumber,
    token: undefined,
    hasActiveSessions: false
  },
  countryList: [],
  initialization: false
}

const globalState = deepSignal(
  LocalStorageWrapper.get<GlobalStateProperties>('prechat-state') || initialState
)

export function getGlobalState(): GlobalState
export function getGlobalState<State>(selector: (state: GlobalState) => State): State
export function getGlobalState<State>(selector?: (state: GlobalState) => State) {
  if (typeof selector === 'function') {
    return selector(globalState)
  }
  return globalState
}

/* можливо замість createPersistSignal використовувати ось це */
export function updateGlobalState(properties: DeepPartial<GlobalStateProperties>) {
  // eslint-disable-next-line no-console
  console.log({ properties })
  // Object.assign(current, properties)
  // console.log(current, properties)
  // LocalStorageWrapper.set('prechat-state', test)
}
