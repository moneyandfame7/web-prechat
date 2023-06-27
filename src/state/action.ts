import type { SignalGlobalState, Theme } from 'types/state'
import type { SupportedLanguages } from 'types/lib'

import { getGlobalState } from './signal'

/**
 * The idea for actions was taken from this repository because I really liked it
 * https://github.com/Ajaxy/telegram-tt
 */
interface ActionPayloads {
  signUp: {
    silent: boolean
    firstName: string
    photo?: File
    lastName?: string
  }
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
