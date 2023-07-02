import { deepSignal } from 'deepsignal'

import {
  AuthScreens,
  type SignalGlobalState,
  type GlobalState,
  type SettingsState,
  type AuthState
} from 'types/state'

import lang from 'lib/i18n/lang'
import errors from 'lib/i18n/errors'

const settingsInitialState: SettingsState = {
  theme: 'light',
  i18n: {
    lang_code: 'en',
    countries: [],
    pack: lang,
    errors
  },
  suggestedLanguage: undefined
}
const authInitialState: AuthState = {
  connection: undefined,
  phoneNumber: undefined,
  rememberMe: true,
  userId: undefined,
  loading: false,
  screen: AuthScreens.PhoneNumber,
  token: undefined,
  session: undefined
}

const globalInitialState: GlobalState = {
  settings: settingsInitialState,
  auth: authInitialState,
  initialization: false
}

const globalState = deepSignal(globalInitialState)

export function getGlobalState(): SignalGlobalState
export function getGlobalState<State>(selector: (state: SignalGlobalState) => State): State
export function getGlobalState<State>(selector?: (state: SignalGlobalState) => State) {
  if (typeof selector === 'function') {
    return selector(globalState)
  }
  return globalState
}
