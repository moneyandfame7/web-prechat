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
import {pick} from 'utilities/pick'
import ls from 'localstorage-slim'
import {AuthScreens} from 'types/screens'
import lang from 'lib/i18n/lang'
import {hasSession} from './helpers/auth'

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

export function setGlobalState(forUpd: DeepPartial<GlobalState>) {
  const global = getGlobalState()
  Object.assign(global, {
    auth: {
      ...global.auth,
      ...forUpd?.auth
    },
    settings: {
      ...global.settings,
      ...forUpd?.settings,
      i18n: {
        ...global.settings.i18n,
        ...forUpd?.settings?.i18n,
        pack: {
          ...global.settings.i18n.pack,
          ...forUpd?.settings?.i18n?.pack
        }
      }
    }
  })
}

export function clearState() {
  const success = ls.remove('STATE')

  const global = getGlobalState()

  global.auth = {
    captcha: undefined,
    confirmResult: undefined,
    connection: undefined,
    email: undefined,
    phoneNumber: undefined,
    session: undefined,
    error: undefined,
    firebase_token: undefined,
    isLoading: false,
    passwordHint: undefined,
    rememberMe: true,
    screen: AuthScreens.PhoneNumber,
    userId: undefined
  }
  global.settings = {
    language: 'en',
    theme: 'light',
    i18n: {
      lang_code: 'en',
      pack: lang
    },
    showTranslate: false,
    suggestedLanguage: undefined
  }
  global.countryList = []
  global.globalSearch = {
    known: {},
    global: {},
    isLoading: false
  }
  global.initialization = false
  global.isCacheSupported = true
  global.users = {
    byId: {},
    contactIds: []
  }
}

export const STATE_PERSIST_DISABLED = false
export const INITIAL_STATE: GlobalState = {
  auth: {
    captcha: undefined,
    confirmResult: undefined,
    connection: undefined,
    email: undefined,
    phoneNumber: undefined,
    session: undefined,
    error: undefined,
    firebase_token: undefined,
    isLoading: false,
    passwordHint: undefined,
    rememberMe: true,
    screen: AuthScreens.PhoneNumber,
    userId: undefined
  },
  settings: {
    language: 'en',
    theme: 'light',
    i18n: {
      lang_code: 'en',
      pack: lang
    },
    showTranslate: false,
    suggestedLanguage: undefined
  },

  initialization: false,
  isCacheSupported: true,

  users: {
    byId: {},
    contactIds: []
  },

  globalSearch: {
    known: {},
    global: {},
    isLoading: false
  },

  countryList: []
}

const PERSIST_KEY = 'prechat-state'

function pickPersistGlobal(global: SignalGlobalState) {
  const reduced: DeepPartial<GlobalState> = {
    auth: pick(global.auth, [
      'userId',
      'screen',
      'rememberMe',
      'phoneNumber',
      'passwordHint',
      'email'
    ]),
    settings: pick(global.settings, [
      'showTranslate',
      'theme',
      'language',
      'suggestedLanguage'
    ]),
    isCacheSupported: global.isCacheSupported,
    users: global.users
  }

  return reduced
}

let isPersist = false

export function readPersist(initialState: GlobalState): GlobalState | undefined {
  if (STATE_PERSIST_DISABLED) {
    return undefined
  }
  const persisted = ls.get(PERSIST_KEY) as GlobalState

  if (hasSession()) {
    startPersist()

    return {
      ...initialState,
      ...persisted
    }
  } else {
    stopPersist()

    return undefined
  }
}

export function startPersist() {
  console.log('WAS START PERSISTING STATE!!!')
  isPersist = true
  window.addEventListener('beforeunload', persist)
  window.addEventListener('blur', persist)
}

function stopPersist() {
  console.log('WAS STOPPED PERSISTING STATE!!!')

  isPersist = false
  window.removeEventListener('beforeunload', persist)
  window.removeEventListener('blur', persist)
}

export function removePersist() {
  const result = ls.remove(PERSIST_KEY)
  if (typeof result !== 'undefined') {
    console.error('REMOVE PERSIST STATE ERORR')
  }
  if (!isPersist) {
    return
  }

  stopPersist()
}

function persist() {
  const global = getGlobalState()
  if (!isPersist || !global.auth.session) {
    return
  }

  forcePersist()
}
function forcePersist() {
  const global = getGlobalState()

  /* check if has locked screen */

  const persisted = pickPersistGlobal(global)

  const result = ls.set(PERSIST_KEY, persisted)

  if (result === false) {
    throw new Error('Persist state error.')
  }
}
