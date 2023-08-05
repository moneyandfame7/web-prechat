import type {SignalGlobalState, Theme} from 'types/state'
import type {ApiLangCode} from 'types/lib'
import type {SignInPayload, SignUpPayload} from 'types/action'
import {DEBUG} from 'common/config'

import {getGlobalState} from './signal'
import {ApiLanguage, ApiLanguageCode, ApiLanguageKey} from 'api/types/settings'

/**
 * The idea for actions was taken from this repository because I really liked it
 * https://github.com/Ajaxy/telegram-tt
 */
interface ActionPayloads {
  /* Auth  */
  signUp: SignUpPayload
  signIn: SignInPayload

  // Search
  searchGlobal: string
  searchUsers: string
  searchGlobalClear: void

  /* Auth ui */
  uploadAvatar: File
  /* Ui */
  reset: void
  init: void

  changeTheme: Theme
  changeLanguage: ApiLangCode

  /* Api */
  getCountries: ApiLangCode | undefined
  getContactList: void
  getUser: string

  // Localization
  getLangPack: ApiLanguageCode
  getLanguageString: {code: ApiLanguageCode; key: ApiLanguageKey}
  getLanguages: ApiLanguage[]

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
  handler: (
    state: SignalGlobalState,
    actions: Actions,
    payload: ActionPayloads[Name]
  ) => void | Promise<void>
) {
  if (actions[name]) {
    // eslint-disable-next-line no-console
    console.warn(`[UI]: Action with name ${name} already exist.`)
    return
  }

  actions[name] = (payload: unknown) => {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.warn(`Was called action with name «${name}»`)
    }
    const globalState = getGlobalState()
    handler(globalState, actions, payload as ActionPayloads[Name])
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
