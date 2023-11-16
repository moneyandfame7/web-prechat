import type {DeepSignal} from 'deepsignal'
import type {ConfirmationResult, RecaptchaVerifier} from 'firebase/auth'

import type {
  ApiChat,
  ApiChatFull,
  ApiCountry,
  ApiLanguage,
  ApiSession,
  ApiUser,
  ApiUserStatus,
} from 'api/types'
import type {ApiChatId} from 'api/types/diff'
import type {ApiMessage} from 'api/types/messages'

import type {ApiLangCode, LanguagePack} from 'types/lib'
import type {UserConnection} from 'types/request'

import type {TransitionName} from 'components/transitions'

import type {Include} from './common'
import type {AuthScreens, RightColumnScreens, SettingsScreens} from './screens'

export type Theme = 'light' | 'dark' | 'system'
export type DistanceUnit = 'kilometers' | 'miles'
export type TimeFormat = '12h' | '24h'
export type SendShortcut = 'enter' | 'ctrl-enter'
export type PageAnimations = Include<TransitionName, 'slideDark' | 'zoomSlide'>
export type ChatFoldersAnimations = 'fade' | 'slide'
export interface SettingsState {
  theme: Theme
  /**
   * @deprecated
   */
  i18n: {
    lang_code: ApiLangCode
    pack: LanguagePack
  }
  languages: ApiLanguage[]
  language: ApiLangCode
  suggestedLanguage?: ApiLangCode
  showTranslate: boolean
  passcode: {
    hasPasscode: boolean
    isScreenLocked: boolean
    isLoading: boolean
  }
  general: {
    theme: Theme
    distanceUnit: DistanceUnit
    messageSendByKey: SendShortcut
    timeFormat: TimeFormat
    messageTextSize: number
    animationsEnabled: boolean
    animations: {
      page: PageAnimations
      chatFolders: ChatFoldersAnimations
    }
    blur: boolean
  }
}

export interface TwoFaState {
  hasPassword: boolean
  hint?: string
  hasRecovery?: boolean
  unconfirmedEmail?: string

  error?: string
  isLoading?: boolean
  newPassword?: string
  newHint?: string
  newEmail?: string
}

export interface AuthState {
  rememberMe: boolean
  connection: UserConnection | undefined
  phoneNumber: string | undefined
  captcha: RecaptchaVerifier | undefined
  confirmResult: ConfirmationResult | undefined
  error: string | undefined
  isLoading: boolean
  isLogout: boolean
  userId: string | undefined
  screen: AuthScreens
  firebase_token: string | undefined
  passwordHint: string | undefined
  email: string | undefined
  session: string | undefined
  sessionLastActivity: number | undefined
}
export interface GlobalSearchState {
  known?: {
    users?: ApiUser[]
    chatIds?: string[]
  }
  global?: {
    users?: ApiUser[]
    chatIds?: string[]
  }
  isLoading: boolean
}
export interface OpenChats {
  chatId?: string
  username?: string
  isMessagesLoading: boolean
  // isMessageEditing: boolean
  isPinnedList: boolean
  /* isDiscussion */
}
export interface MessageEditing {
  messageId: string
  text?: string
}
export interface GlobalState {
  // recentEmojis: string[]

  /* SYNCED STATE */
  settings: SettingsState
  auth: AuthState
  globalSearch: GlobalSearchState
  twoFa: TwoFaState
  users: {
    contactIds: string[]
    statusesByUserId: Record<string, ApiUserStatus>
    byId: Record<string, ApiUser>
    // fullById: {[userId: string]: ApiUserFull}
  }
  chats: {
    byId: Record<string, ApiChat>
    ids: string[]
    usernames: {[username: string]: ApiChatId}
    fullById: {[chatId: string]: ApiChatFull}
  }
  blocked: {
    ids: string[]
    count: number
  }
  messages: {
    byChatId: Record<string, {byId: Record<string, ApiMessage>}>
    idsByChatId: Record<string, string[]>
    pinnedIdsByChatId: Record<string, string[]>
  }
  selection: {
    hasSelection: boolean
    selectedText: string
    messageIds: string[]
    chat: {
      //  will rewrite in the future, because selection also can be in right column
      active: boolean
      messageIds: string[]
    }
    sharedMedia: {
      // active: boolean
      messageIds: string[]
    }
  }
  messageEditing: {
    messageId?: string
    isActive: boolean
  }
  activeSessions: {
    byId: Record<string, ApiSession>
    ids: string[]
  }
  emojis: {
    recent: string[]
    skin: 0 | 1 | 2 | 3 | 4 | 5
  }

  countryList: ApiCountry[]

  /* For TAB STATE: */
  initialization: boolean
  isChatsFetching: boolean
  isContactsFetching: boolean
  rightColumn: {
    screen: RightColumnScreens
    isOpen: boolean
  }
  newContact: {
    isOpen: boolean
    userId?: string
    isByPhoneNumber: boolean
  }
  stories: {
    isOpen: boolean
  }
  notification: {
    title?: string
    isOpen: boolean
  }
  commonModal: {
    title?: string
    body?: string
    isOpen: boolean
  }
  currentChat: {
    // messages: ApiMessage[]
    chatId?: string
    username?: string
    isMessagesLoading: boolean
  }
  openChats: OpenChats[]
  globalSettingsScreen?: SettingsScreens

  uploadProgress: {
    byMessageId: Record<string, number>
  }
}
/**
 * SyncedState is a  shared state between tabs.
 */
// export type SyncedState = Pick<
//   GlobalState,
//   'activeSessions' | 'auth' | 'chats' | 'emojis' | 'messages' | 'settings' | 'users'
// >
export type SyncedState = {
  settings: Partial<SettingsState>
  auth: Partial<AuthState>
  chats: Partial<GlobalState['chats']>
  messages: Partial<GlobalState['messages']>
} & Pick<GlobalState, 'activeSessions' | 'emojis' | 'users'>

export type SignalGlobalState = DeepSignal<GlobalState>
