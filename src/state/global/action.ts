import type { GlobalState, Theme } from 'state/global/types'
import type { SupportedLanguages } from 'state/i18n/types'

import { getGlobalState } from './signal'

interface ActionPayloads {
  signUp: {
    phoneNumber: string
    language: string
  }
  changeTheme: Theme
  changeLanguage: SupportedLanguages
}

type ActionNames = keyof ActionPayloads
type Actions = {
  [key in ActionNames]: (payload: ActionPayloads[key]) => void | Promise<void>
}
/* мб зробити тут deepSignal? хоча якщо вони не оновлюються, то нахуя */
const actions = {} as Actions

export function createAction<Name extends ActionNames>(
  name: Name,
  handler: (
    state: GlobalState,
    payload: ActionPayloads[Name]
  ) => void | Promise<void>
) {
  if (actions[name]) {
    throw new Error(`Action with name ${name} already exist.`)
  }
  const globalState = getGlobalState()
  /**
   * @todo fix any, idk how
   */
  actions[name] = (payload: any) => handler(globalState, payload)
}

export function getActions(): Actions
export function getActions<Name extends ActionNames>(name: Name): Actions[Name]
export function getActions<Name extends ActionNames>(name?: Name) {
  if (name) {
    return actions[name] as Actions[Name]
  }
  return actions
}
