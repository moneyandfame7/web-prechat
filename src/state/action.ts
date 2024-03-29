import {type ApiMessageEntity} from 'api/types'
import type {CreateChannelInput, CreateGroupInput} from 'api/types/chats'
import type {ApiLangKey} from 'api/types/langPack'

import {DEBUG} from 'common/environment'

import type {GetHistoryPayload, SignInPayload, SignUpPayload} from 'types/action'
import type {DeepPartial} from 'types/common'
import type {ApiLangCode} from 'types/lib'
import type {RightColumnScreens, SettingsScreens} from 'types/screens'
import type {SettingsState, SignalGlobalState, Theme} from 'types/state'

import type {MediaItem} from 'components/popups/SendMediaModal'

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
  openRightColumn: {screen?: RightColumnScreens}
  closeRightColumn: void
  changeSettings: DeepPartial<SettingsState>

  // Differents
  openCommonModal: {title: string; body: string}
  closeCommonModal: void

  openAddContactModal: {userId: string}
  closeAddContactModal: void

  openCreateContactModal: void

  toggleMessageSelection: {id?: string; active?: boolean}
  toggleMessageEditing: {id?: string; active?: boolean}

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

  /* Contacts */
  addContact: {firstName: string; phone: string; lastName?: string; userId?: string}
  updateContact: {userId: string; firstName?: string; lastName?: string}
  deleteContact: {userId: string}
  getContactList: void

  /* Users */
  getSelf: void
  getUser: string
  resolveUsername: {username: string}

  /* Media */
  uploadProfilePhoto: File

  /* Chats */
  createChannel: CreateChannelInput
  createGroup: CreateGroupInput
  updateChat: {chatId: string; title?: string; description?: string}
  getChats: void
  getChat: {id: string}
  openChat: {
    id?: string | undefined
    username?: string
    type?: 'self'
    shouldChangeHash?: boolean
    shouldReplaceHistory?: boolean
  }
  openChatByUsername: {username: string}
  openPreviousChat: void
  openPinnedMessages: {id: string | undefined}
  getChatFull: {id: string}

  /* ChatFolders */

  /* Messages */
  sendMessage: {
    text: string
    entities?: ApiMessageEntity[]
    // chatId: string
    sendAs?: string
    mediaItems?: MediaItem[]
  }
  // sendMedia: {text?: string; items: MediaItem[]}
  editMessage: {text: string; chatId: string; messageId: string}
  deleteMessages: {ids: string[]; chatId: string}
  getHistory: GetHistoryPayload
  readHistory: {
    chatId: string
    maxId: number
  }
  getPinnedMessages: {
    chatId: string
    offsetId?: string
    // direction?:Hist
  }

  /* Account */
  getAuthorizations: void
  terminateAuthorization: {sessionId: string}
  terminateAllAuthorizations: void
  updateUserStatus: {isOnline: boolean; isFirst?: boolean; noDebounce?: boolean}

  // Localization
  getLangPack: ApiLangCode
  getLanguageString: {code: ApiLangCode; key: ApiLangKey}
  getLanguages: void

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
