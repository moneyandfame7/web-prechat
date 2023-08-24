import {storages} from 'state/storages'
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
// auth lost reference.
// global.auth = {
//   ...global.auth,
//   ...auth
// }
export function resetAuthState(global: SignalGlobalState) {
  updateByKey(global.auth, INIT_AUTH_STATE)
}

export function updateAuthState(global: SignalGlobalState, auth: Partial<AuthState>) {
  updateByKey(global.auth, auth)

  storages.auth.put(auth)
}
