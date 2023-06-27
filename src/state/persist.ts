import type { DeepPartial, DeepPartialPersist } from 'types/common'
import type { SettingsState, AuthState, SignalGlobalState, GlobalState } from 'types/state'

import { getGlobalState } from './signal'
import { database } from './database'

type PickPersistProperties = Partial<Record<keyof GlobalState, boolean | object>>

type PersistedProperties<T extends PickPersistProperties> = {
  [K in keyof T]: K extends keyof GlobalState
    ? T[K] extends boolean
      ? GlobalState[K]
      : Pick<GlobalState[K], keyof T[K]>
    : never
}
/**
 * @todo додати тут мб тип якийсь
 */
const PERSISTED_PROPERTIES = {
  auth: {
    rememberMe: true,
    phoneNumber: true,
    userId: true,
    passwordHint: true,
    email: true,
    session: true
  },
  settings: true
}
export type PersistGlobalState = PersistedProperties<typeof PERSISTED_PROPERTIES>

export function updateGlobalState(object: DeepPartial<GlobalState>, persist = true) {
  const state = getGlobalState()
  if (object.auth) {
    updateAuthState(state, object.auth)
  }

  if (object.settings) {
    updateSettingsState(state, object.settings)
  }
  const test = getPersistedState(state, PERSISTED_PROPERTIES as DeepPartialPersist<GlobalState>)

  if (persist) {
    database.settings.change(test.settings)
    database.auth.change(test.auth)
  }
}

function getPersistedState<T>(
  state: T,
  persistedProperties: DeepPartialPersist<T>
): PersistGlobalState {
  const persistedState: Partial<T> = {}

  for (const key in persistedProperties) {
    if (persistedProperties[key] === true) {
      persistedState[key] = state[key]
    } else if (typeof persistedProperties[key] === 'object' && typeof state[key] === 'object') {
      const nestedPersistedState = getPersistedState(state[key], (persistedProperties as any)[key])
      if (Object.keys(nestedPersistedState).length > 0) {
        ;(persistedState as any)[key] = nestedPersistedState
      }
    }
  }

  return persistedState as unknown as PersistGlobalState
}

function updateAuthState<S extends SignalGlobalState, U extends DeepPartial<AuthState>>(
  state: S,
  auth: U
) {
  Object.assign<S, { auth: U }>(state, {
    auth: {
      ...state.auth,
      ...auth
    }
  })
}

function updateSettingsState<S extends SignalGlobalState, U extends DeepPartial<SettingsState>>(
  state: S,
  settings: U
) {
  Object.assign<S, { settings: U }>(state, {
    settings: {
      ...state.settings,
      ...settings,
      i18n: {
        ...state.settings.i18n,
        ...settings.i18n,
        pack: {
          ...state.settings.i18n.pack,
          ...settings.i18n?.pack
        }
      }
    }
  })
}
