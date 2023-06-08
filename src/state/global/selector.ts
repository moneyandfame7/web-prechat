import { getGlobalState } from './signal'
import { GlobalState } from './types'

export function selectState<Result>(selector: (state: GlobalState) => Result) {
  const globalState = getGlobalState()

  return selector(globalState)
}
