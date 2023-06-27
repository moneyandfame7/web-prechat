import { deepSignal } from 'deepsignal'

import { AuthScreens, SignalGlobalState, type GlobalState } from 'types/state'

import lang from 'lib/i18n/lang'

const initialState: GlobalState = {
  settings: {
    theme: 'light',
    i18n: {
      lang_code: 'en',
      countries: [],
      pack: lang
    },
    suggestedLanguage: undefined
  },
  auth: {
    connection: undefined,
    phoneNumber: undefined,
    rememberMe: true,
    userId: undefined,
    loading: false,
    screen: AuthScreens.PhoneNumber,
    token: undefined,
    session: undefined
  },
  initialization: false
}

const globalState = deepSignal(initialState)

export function getGlobalState(): SignalGlobalState
export function getGlobalState<State>(selector: (state: SignalGlobalState) => State): State
export function getGlobalState<State>(selector?: (state: SignalGlobalState) => State) {
  if (typeof selector === 'function') {
    return selector(globalState)
  }
  return globalState
}
