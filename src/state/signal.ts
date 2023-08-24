import {deepSignal} from 'deepsignal'
import {deepClone} from 'utilities/object/deepClone'

import type {GlobalState, SignalGlobalState} from 'types/state'
import {
  updateAuthState,
  updateRootState,
  updateSettingsState,
  updateNewContactState,
  updateUsers
} from './updates'
import {INITIAL_STATE} from './persist'
import {updateChats} from './updates/chats'

const globalState = deepSignal(deepClone(INITIAL_STATE))

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

export function setGlobalState(forUpd: GlobalState) {
  const global = getGlobalState()
  const {auth, settings, users, chats, ...justForUpdate} = forUpd

  updateRootState(global, justForUpdate)
  updateAuthState(global, auth)
  updateSettingsState(global, settings)
  updateUsers(global, users.byId)
  updateChats(global, chats.byId)
}
