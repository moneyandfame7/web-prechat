import {deepSignal} from 'deepsignal'

import {
  type SignalGlobalState,
  type GlobalState,
  type SettingsState,
  type AuthState
} from 'types/state'

import lang from 'lib/i18n/lang'
import errors from 'lib/i18n/errors'
import {isCacheApiSupported} from 'lib/cache'
import {AuthScreens} from 'types/screens'

const settingsInitialState: SettingsState = {
  theme: 'light',
  i18n: {
    lang_code: 'en',
    countries: [],
    pack: lang,
    errors
  },
  suggestedLanguage: undefined,
  leftColumnWidth: 350
}
const authInitialState: AuthState = {
  connection: undefined,
  phoneNumber: undefined,
  rememberMe: true,
  userId: undefined,
  loading: false,
  screen: AuthScreens.PhoneNumber,
  firebase_token: undefined,
  session: undefined,
  captcha: undefined,
  confirmResult: undefined,
  email: undefined,
  error: undefined,
  passwordHint: undefined
}

const globalInitialState: GlobalState = {
  settings: settingsInitialState,
  auth: authInitialState,
  initialization: false,
  isCacheSupported: isCacheApiSupported(),
  globalSearch: {
    known: {
      users: []
    },
    global: {
      users: []
    },
    isLoading: false
  },
  users: {
    contactIds: [],
    byId: {}
  }
}

const globalState = deepSignal(globalInitialState)

export function getGlobalState(): SignalGlobalState
export function getGlobalState<State>(
  selector: (state: SignalGlobalState) => State
): State
export function getGlobalState<State>(selector?: (state: SignalGlobalState) => State) {
  if (typeof selector === 'function') {
    return selector(globalState)
  }
  return globalState
}
