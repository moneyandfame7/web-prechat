import {storages} from 'state/storages'

import {updateByKey} from 'utilities/object/updateByKey'

import {AuthScreens} from 'types/screens'
import type {AuthState, SignalGlobalState} from 'types/state'

const INIT_AUTH_STATE: AuthState = {
  captcha: undefined,
  confirmResult: undefined,
  connection: undefined,
  email: undefined,
  error: undefined,
  firebase_token: undefined,
  session: undefined,
  isLoading: false,
  passwordHint: undefined,
  phoneNumber: undefined,
  rememberMe: true,
  screen: AuthScreens.PhoneNumber,
  userId: undefined,
  sessionLastActivity: undefined,
}

//  We use for loop for update properties without change ref to auth/settings and other objects
// auth lost reference.
// global.auth = {
//   ...global.auth,
//   ...auth
// }
export function resetAuthState(global: SignalGlobalState) {
  updateByKey(global.auth, INIT_AUTH_STATE)
}
export function cleanupUnusedAuthState(global: SignalGlobalState) {
  updateByKey(global.auth, {
    captcha: undefined,
    confirmResult: undefined,
    connection: undefined,
    firebase_token: undefined,
    isLoading: false,
    screen: undefined,
  })
}

export function updateAuthState(global: SignalGlobalState, auth: Partial<AuthState>) {
  updateByKey(global.auth, auth)
  storages.auth.put(auth)
}

export function toggleAuthLoading(global: SignalGlobalState) {
  global.auth.isLoading = !global.auth.isLoading
}
