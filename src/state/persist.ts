import type {DeepPartial, DeepPartialPersist} from 'types/common'
import type {
  SettingsState,
  AuthState,
  SignalGlobalState,
  GlobalState,
  GlobalSearchState
} from 'types/state'

import {database} from 'lib/database'
import {getGlobalState} from './signal'
import {deepClone} from 'utilities/deepClone'

type PersistPropertiesSatisfie = Partial<Record<keyof GlobalState, boolean | object>>
type PersistedProperties<T extends PersistPropertiesSatisfie> = {
  [K in keyof T]: K extends keyof GlobalState
    ? T[K] extends boolean
      ? GlobalState[K]
      : Pick<GlobalState[K], keyof T[K]>
    : never
}

const PERSISTED_PROPERTIES = {
  auth: {
    rememberMe: true,
    phoneNumber: true,
    userId: true,
    passwordHint: true,
    email: true,
    session: true,
    screen: true
  },
  settings: true
} satisfies PersistPropertiesSatisfie

export type PersistGlobalState = PersistedProperties<typeof PERSISTED_PROPERTIES>
export type PersistGlobalStateKeys = keyof PersistGlobalState

/* Persist state  */
/* maybe make persist: string ( auth | settings ???) */
// додати force option, якщо force - то дістаємо весь persisted state, проте якщо ні - нам не потрібен весь обʼєкт, а потрібно тільки те, що persisted. або додати типізацію для object, де може бути тільки persisted state....
/**
 *
 * @param object
 * @param persist - default `true`
 * @param force - default `false`
 * @returns
 */
export function updateGlobalState(
  object: DeepPartial<GlobalState>,
  persist = true,
  force = false
) {
  const state = getGlobalState()
  /**
   * If not deepClone object, get error
   * preact_debug.js?v=84ef3e8b:114 Uncaught TypeError: 'get' on proxy: property '0' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected '#<Object>' but got '#<Object>')
   */
  if (object.auth) {
    updateAuthState(state, deepClone(object.auth))
  }

  if (object.settings) {
    updateSettingsState(state, deepClone(object.settings))
  }

  if (object.globalSearch) {
    updateGlobalSearchState(state, deepClone(object.globalSearch))
  }
  if (persist) {
    // eslint-disable-next-line no-console
    console.time('Persist')

    if (force) {
      forceUpdateState(state)

      return
    }
    const persisted = getPersistedState(
      object,
      PERSISTED_PROPERTIES as DeepPartialPersist<GlobalState>
    )

    if (persisted.settings) {
      database.settings.change(persisted.settings)
    }
    if (persisted.auth) {
      database.auth.change(persisted.auth)
    }

    // eslint-disable-next-line no-console
    console.timeEnd('Persist')
  }

  // logDebugWarn('[UI]: Persist state', object)
}

export function forceUpdateState(state: SignalGlobalState) {
  const persisted = getPersistedState(
    state,
    PERSISTED_PROPERTIES as DeepPartialPersist<GlobalState>
  )

  database.auth.change(persisted.auth)
  database.settings.change(persisted.settings)
}

/* Reduce object  */
function getPersistedState<T>(
  state: T,
  persistedProperties: DeepPartialPersist<T>
): PersistGlobalState {
  const persistedState: Partial<T> = {}

  for (const key in persistedProperties) {
    if (persistedProperties[key] === true && typeof state[key] !== 'undefined') {
      persistedState[key] = state[key]
    } else if (
      typeof persistedProperties[key] === 'object' &&
      typeof state[key] === 'object'
    ) {
      const nestedPersistedState = getPersistedState(
        state[key],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (persistedProperties as any)[key]
      )
      if (Object.keys(nestedPersistedState).length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(persistedState as any)[key] = nestedPersistedState
      }
    }
  }

  return persistedState as unknown as PersistGlobalState
}

/* Updates  */
function updateAuthState<S extends SignalGlobalState, U extends DeepPartial<AuthState>>(
  state: S,
  auth: U
) {
  Object.assign<S, {auth: U}>(state, {
    auth: {
      ...state.auth,
      ...auth
    }
  })
}

function updateSettingsState<
  S extends SignalGlobalState,
  U extends DeepPartial<SettingsState>
>(state: S, settings: U) {
  Object.assign<S, {settings: U}>(state, {
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
        // countries: [...state.settings.i18n.countries]
      }
    }
  })

  // мб не використовувати Object.assign
  // state.settings={
  //   ...state.settings,
  //   i18n:{
  //     ...state.settings,
  //     ...settings.i18n,

  //   }
  // }
}

function updateGlobalSearchState<
  S extends SignalGlobalState,
  U extends DeepPartial<GlobalSearchState>
>(state: S, globalSearch: U) {
  Object.assign<S, {globalSearch: U}>(state, {
    globalSearch: {
      ...state.globalSearch,
      ...globalSearch,
      known: {
        ...state.globalSearch?.known,
        ...globalSearch.known
      },
      global: {
        ...state.globalSearch?.global,
        ...globalSearch.global
      }
    }
  })
}

/* Resets  */
// function resetGlobalState(name: PersistGlobalStateKeys | PersistGlobalStateKeys[]) {}

// const test = resetGlobalState(['settings', 'auth'])

// function resetAuthState() {}

// function resetSettingsState() {}
