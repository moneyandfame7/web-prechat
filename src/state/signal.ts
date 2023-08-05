import {deepSignal} from 'deepsignal'

import {type SignalGlobalState} from 'types/state'

import {INITIAL_STATE} from './persist'

const globalState = deepSignal(INITIAL_STATE)

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
