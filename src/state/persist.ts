import type {DeepPartial} from 'types/common'
import type {SignalGlobalState, GlobalState} from 'types/state'

import {database} from 'lib/database'
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

export function clearGlobalState() {
  const global = getGlobalState()
  Object.assign<SignalGlobalState, DeepPartial<GlobalState>>(global, {
    settings: {
      ...INITIAL_STATE.settings
    },
    auth: {
      ...INITIAL_STATE.auth
    },
    countryList: [],
    globalSearch: {},
    users: {},
    initialization: false
  })
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

  return reduced
}

export type PersistedState = ReturnType<typeof pickPersistGlobal>
export type PersistedKeys = keyof PersistedState

let isPersist = false
const STATE_PERSIST_DISABLED = false
export function startPersist() {
  console.log('WAS START PERSISTING STATE!!!')
  isPersist = true
  window.addEventListener('unload', persist)
  // window.addEventListener('blur', persist)
}

function stopPersist() {
  console.log('WAS STOPPED PERSISTING STATE!!!')

  isPersist = false
  window.removeEventListener('unload', persist)
  // window.removeEventListener('blur', persist)
}

export function resetPersist() {
  database.clear()

  stopPersist()
}

async function persist() {
  const global = getGlobalState()
  console.log(global)

  alert('SMTH LIKE ME')
  if (!isPersist || !global.auth.session) {
    console.log({isPersist}, global.auth)
    return
  }

  forcePersist()
}

export function forcePersist() {
  const global = getGlobalState()

  const persist = pickPersistGlobal(deepClone(global) as GlobalState)

  database.auth.change({...persist.auth})
  database.settings.change({...persist.settings})
  const users = Object.keys(persist.users.byId).map((id) => {
    return persist.users.byId[id]
  })

  database.users.put(users)
}

export async function readPersist(): Promise<GlobalState | undefined> {
  if (STATE_PERSIST_DISABLED) {
    return undefined
  }
  const persisted = await database.getInitialState()
  if (hasActiveSession()) {
    startPersist()

    return {
      ...INITIAL_STATE,
      ...persisted
    } as GlobalState
  } else {
    stopPersist()

    return undefined
  }
}
