import type {DeepPartial} from 'types/common'
import type {GlobalState} from 'types/state'
import {getGlobalState} from './signal'
import {pick} from 'utilities/object/pick'
import {AuthScreens} from 'types/screens'
import lang from 'lib/i18n/lang'

import {
  updateAuthState,
  updateI18nState,
  updateNewContactState,
  updateSettingsState,
  updatePasscodeState
} from './updates'
import {updateRootState} from './updates/init'

export const INITIAL_STATE: GlobalState = {
  auth: {
    'isLoading': false,
    'rememberMe': true,
    'screen': AuthScreens.PhoneNumber
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
    animationLevel: 2,
    passcode: {
      isLoading: false,
      isScreenLocked: false,
      hasPasscode: false
    }
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
