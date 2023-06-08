import { createPersistSignal } from 'state/persist'

import type { GlobalState, GlobalStateProperties } from './types'

const initialState: GlobalStateProperties = {
  theme: 'light',
  language: 'en'
}

const globalState = createPersistSignal(initialState, 'prechat-state', [
  'theme',
  'language'
])

export function getGlobalState(): GlobalState
export function getGlobalState<State>(
  selector: (state: GlobalState) => State
): Required<State>
export function getGlobalState<State>(
  selector?: (state: GlobalState) => State
) {
  if (typeof selector === 'function') {
    return selector(globalState)
  }
  return globalState
}

export function updateGlobalState<K extends keyof GlobalStateProperties>(
  properties: Pick<GlobalStateProperties, K>
) {
  const current = getGlobalState()

  Object.assign(current, properties)
}
