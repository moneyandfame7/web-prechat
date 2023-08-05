import {AuthScreens} from 'types/screens'
import type {AuthState, SignalGlobalState} from 'types/state'

import {updateByKey} from 'utilities/object/updateByKey'

const INIT_AUTH_STATE: AuthState = {
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
}

//  We use for loop for update properties without change ref to auth/settings and other objects
export function resetAuthState(global: SignalGlobalState) {
  updateByKey(global.auth, INIT_AUTH_STATE)
}

export function updateAuthState(global: SignalGlobalState, auth: Partial<AuthState>) {
  updateByKey(global.auth, auth)

  // auth lost reference.
  // global.auth = {
  //   ...global.auth,
  //   ...auth
  // }
}
