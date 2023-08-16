import {storageManager} from './../lib/idb/manager'
import type {DeepPartial} from 'types/common'
import type {GlobalState, SignalGlobalState} from 'types/state'
import {getGlobalState} from './signal'
import {deepClone} from 'utilities/object/deepClone'
import {pick} from 'utilities/object/pick'
import {AuthScreens} from 'types/screens'
import lang from 'lib/i18n/lang'
import {hasActiveSession} from 'utilities/session'

import {
  updateAuthState,
  updateI18nState,
  updateNewContactState,
  updateSettingsState
} from './updates'
import {updateRootState} from './updates/init'

export function setGlobalState(forUpd: GlobalState) {
  const global = getGlobalState()

  updateRootState(global, {
    countryList: forUpd.countryList,
    initialization: forUpd.initialization,
    notification: forUpd.notification
  })
  updateSettingsState(global, {
    animationLevel: forUpd.settings.animationLevel,
    language: forUpd.settings.language,
    showTranslate: forUpd.settings.showTranslate,
    suggestedLanguage: forUpd.settings.suggestedLanguage,
    isCacheSupported: forUpd.settings.isCacheSupported,
    theme: forUpd.settings.theme
  })
  updateI18nState(global, forUpd.settings.i18n)
  updateAuthState(global, forUpd.auth)
  updateNewContactState(global, forUpd.newContact)
}

export const INITIAL_STATE: GlobalState = {
  auth: {
    'captcha': undefined,
    'confirmResult': undefined,
    'connection': undefined,
    'email': undefined,
    'error': undefined,
    'firebase_token': undefined,
    'session': undefined,
    'isLoading': false,
    'passwordHint': undefined,
    'phoneNumber': undefined,
    'rememberMe': true,
    'screen': AuthScreens.PhoneNumber,
    'userId': undefined
  },
  settings: {
    language: 'en',
    theme: 'light',
    i18n: {
      lang_code: 'en',
      pack: lang
    },
    isCacheSupported: true,
    showTranslate: false,
    suggestedLanguage: undefined,
    animationLevel: 2
  },

  initialization: false,

  users: {
    byId: {},
    contactIds: []
  },

  // chatCreation: {
  //   error: undefined,
  //   isLoading: false
  // },

  chats: {
    byId: {}
  },

  globalSearch: {
    known: {},
    global: {},
    isLoading: false
  },

  countryList: [],

  newContact: {
    userId: undefined,
    isByPhoneNumber: false
  },

  notification: {
    title: undefined,
    isOpen: false
  }
}

function pickPersistGlobal(global: GlobalState) {
  const reduced = {
    ...pick(global, ['users']),
    ...pick(global, ['chats']),
    auth: pick(global.auth, [
      'userId',
      'rememberMe',
      'phoneNumber',
      'passwordHint',
      'email',
      'session'
    ]),
    settings: pick(global.settings, [
      'showTranslate',
      'theme',
      'language',
      'suggestedLanguage',
      'i18n',
      'animationLevel',
      'isCacheSupported'
    ])
  } satisfies DeepPartial<GlobalState>

  const {chats, users, ...state} = reduced
  return {chats, users, state}
}

export type PersistedState = ReturnType<typeof pickPersistGlobal>
export type PersistedKeys = keyof PersistedState

let isPersist = false
const STATE_PERSIST_DISABLED = false
export function startPersist() {
  console.log('WAS START PERSISTING STATE!!!')
  isPersist = true
  window.addEventListener('unload', persist)
}

function stopPersist() {
  console.log('WAS STOPPED PERSISTING STATE!!!')
  storageManager.clearAll()
  isPersist = false
  window.removeEventListener('unload', persist)
}

export function resetPersist() {
  storageManager.clearAll()

  stopPersist()
}

export async function persist() {
  const global = getGlobalState()

  if (!isPersist || !global.auth.session) {
    return
  }

  await forcePersist()
}

export async function forcePersist() {
  const global = getGlobalState()

  const persisted = pickPersistGlobal(deepClone(global) as GlobalState)

  storageManager.state.set(persisted.state)
  storageManager.chats.set(persisted.chats.byId)
  storageManager.users.set(persisted.users.byId)
  // localStorage.setItem('chats', JSON.stringify(persist.chats.byId))
  // storageManager.chats.set(persist.chats.byId)
  // await storageManager.users.set(persist.users.byId)
  // await storageManager.state.set(persist.state)
  // const users = Object.keys(persist.users.byId).map((id) => persist.users.byId[id])
  // database.users.put(users)
}

export async function readPersist(): Promise<GlobalState | undefined> {
  if (STATE_PERSIST_DISABLED) {
    return undefined
  }
  // const persisted = await database.getInitialState()
  const loaded = await storageManager.loadAll()

  if (/* hasActiveSession() && */ loaded.state?.auth?.session) {
    startPersist()

    return {
      ...INITIAL_STATE,
      ...loaded.state
    } as GlobalState
  } else {
    stopPersist()

    return undefined
  }
}
