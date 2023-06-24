import { getGlobalState } from './signal'

import type { GlobalState } from 'types/state'

export function selectState<Result>(selector: (state: GlobalState) => Result) {
  const globalState = getGlobalState()

  return selector(globalState)
}
