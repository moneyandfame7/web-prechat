import {deepSignal} from 'deepsignal'

import {deepClone} from 'utilities/object/deepClone'

import type {GlobalState, SignalGlobalState} from 'types/state'

import {INITIAL_STATE} from './initState'
import {
  updateAuthState,
  updateChats,
  updateRootState,
  updateSettingsState,
  updateUsers,
} from './updates'

/**
 * @todo check without deepClone
 */
const globalState = deepSignal(deepClone(INITIAL_STATE))

export function getGlobalState(): SignalGlobalState
export function getGlobalState<State>(selector: (state: SignalGlobalState) => State): State
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
