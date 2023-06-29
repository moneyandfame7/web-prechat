import type { SignalGlobalState, Theme } from 'types/state'
import type { SupportedLanguages } from 'types/lib'
import type { SignUpPayload } from 'types/action'

import { getGlobalState } from './signal'
import { DEBUG } from 'common/config'

/**
 * The idea for actions was taken from this repository because I really liked it
 * https://github.com/Ajaxy/telegram-tt
 */
interface ActionPayloads {
  signUp: SignUpPayload
  uploadAvatar: File
  /* Ui */
  changeTheme: Theme
  changeLanguage: SupportedLanguages
  setAuthRememberMe: boolean

  /* Api */
  getLanguageWithCountries: SupportedLanguages
  getLanguage: SupportedLanguages
  getCountries: SupportedLanguages

  getConnection: void
  sendPhone: string
  verifyCode: string
}

type ActionNames = keyof ActionPayloads
type Actions = {
  [key in ActionNames]: (payload: ActionPayloads[key]) => void | Promise<void>
}
const actions = {} as Actions

export function createAction<Name extends ActionNames>(
  name: Name,
  handler: (state: SignalGlobalState, payload: ActionPayloads[Name]) => void | Promise<void>
) {
  if (actions[name]) {
    // eslint-disable-next-line no-console
    console.warn(`[CLIENT]: Action with name ${name} already exist.`)
    return
  }
  const globalState = getGlobalState()

  actions[name] = (payload: unknown) => {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.warn(`Was called action with name ${name}`)
    }
    handler(globalState, payload as ActionPayloads[Name])
  }
}

export function getActions(): Actions
export function getActions<Name extends ActionNames>(name: Name): Actions[Name]
export function getActions<Name extends ActionNames>(name?: Name) {
  if (name) {
    return actions[name] as Actions[Name]
  }
  return actions
}
