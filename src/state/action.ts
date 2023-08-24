import type {SignalGlobalState, Theme} from 'types/state'
import type {ApiLangCode} from 'types/lib'
import type {SignInPayload, SignUpPayload} from 'types/action'
import {DEBUG} from 'common/config'

import type {ApiLangKey, ApiLanguage} from 'api/types/langPack'
import type {CreateChannelInput, CreateGroupInput} from 'api/types/chats'
import type {SettingsScreens} from 'types/screens'

import {getGlobalState} from './signal'

/**
 * The idea of state management was taken from this repo
 * https://github.com/Ajaxy/telegram-tt
 */
interface ActionPayloads {
  /* Auth  */
  signUp: SignUpPayload
  signIn: SignInPayload
  signOut: void

  // Search
  searchGlobal: string
  searchUsers: string
  searchGlobalClear: void

  uploadAvatar: File
  /** UI */
  reset: void
  init: void
  authInit: void

  // Differents
  openAddContactModal: {userId: string}
  closeAddContactModal: void

  openCreateContactModal: void

  showNotification: {title: string}
  closeNotification: void

  changeSettingsScreen: SettingsScreens

  copyToClipboard: {
    toCopy: string
    title: string
  }

  changeTheme: Theme
  changeLanguage: ApiLangCode

  /* Api */
  getCountries: ApiLangCode | undefined
  getContactList: void
  getUser: string

  /* Contacts */
  addContact: {firstName: string; phone: string; lastName?: string; userId?: string}

  /* Chats */
  createChannel: CreateChannelInput
  createGroup: CreateGroupInput
  getChats: void

  // Localization
  getLangPack: ApiLangCode
  getLanguageString: {code: ApiLangCode; key: ApiLangKey}
  getLanguages: ApiLanguage[]

  getConnection: void
  sendPhone: string
  verifyCode: string
}

type ActionNames = keyof ActionPayloads
export type Actions = {
  [key in ActionNames]: (payload: ActionPayloads[key]) => Promise<void> | void
}
const actions = {} as Actions

export function createAction<Name extends ActionNames>(
  name: Name,
  handler: (
    state: SignalGlobalState,
    actions: Actions,
    payload: ActionPayloads[Name]
  ) => Promise<void> | void
) {
  if (actions[name]) {
    // eslint-disable-next-line no-console
    console.warn(`[UI]: Action with name ${name} already exist.`)
    return
  }

  actions[name] = (payload: unknown): ReturnType<typeof handler> => {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.warn(`Was called action with name «${name}»`)
    }
    const globalState = getGlobalState()
    const result = handler(globalState, actions, payload as ActionPayloads[Name])
    if (result instanceof Promise) {
      return result
    }
  }
}

export function getActions() {
  return actions
}

// : Object.keys(reducers).reduce((actns, reducerName) => {
//   actns[reducerName] = (payload) => {
//     console.log(`Will be called reducer ${reducerName}`)
//     const updated = reducers[reducerName](state as any, payload)

//     console.log(`This is updated state: ${updated}`)
//     /* updateByKey???? check if object, nested update, else just update */
//   }

//   return actns
// }, {} as Record<string, (payload:any) => void>)
