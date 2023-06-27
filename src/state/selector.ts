import { getGlobalState } from './signal'

import type { SignalGlobalState } from 'types/state'

export function selectState<Result>(selector: (state: SignalGlobalState) => Result) {
  const globalState = getGlobalState()

  return selector(globalState)
}
