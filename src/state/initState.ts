import lang from 'lib/i18n/lang'

import {IS_MOBILE} from 'common/environment'

import {AuthScreens, RightColumnScreens} from 'types/screens'
import type {GlobalState} from 'types/state'

export const INITIAL_STATE: GlobalState = {
  auth: {
    isLoading: false,
    rememberMe: true,
    screen: AuthScreens.PhoneNumber,
    captcha: undefined,
    confirmResult: undefined,
    connection: undefined,
    email: undefined,
    error: undefined,
    firebase_token: undefined,
    passwordHint: undefined,
    phoneNumber: undefined,
    session: undefined,
    userId: undefined,
    sessionLastActivity: undefined,
  },
  settings: {
    theme: 'light',
    i18n: {
      lang_code: 'en',
      pack: lang,
    },
    languages: [],
    language: 'en',
    showTranslate: false,
    suggestedLanguage: undefined,
    passcode: {
      isLoading: false,
      isScreenLocked: false,
      hasPasscode: false,
    },
    general: {
      distanceUnit: 'kilometers',
      theme: 'light',
      messageSendByKey: 'enter',
      messageTextSize: 16,
      timeFormat: '24h',
      animationsEnabled: true,
      animations: {
        page: IS_MOBILE ? 'slideDark' : 'zoomSlide',
        chatFolders: 'slide',
      },
      blur: true,
    },
  },
  twoFa: {
    hasPassword: false,
  },
  // recentEmojis: ['🇺🇦', '😂', '❤️', '😍', '🙌', '🎉', '🙏', '😊', '🤔', '😎', '👍'],
  // recentEmojis: [
  //   'flag-ua',
  //   'grinning', // Сміх
  //   'heart', // Серце
  //   'heart_eyes', // Закоханий
  //   'raised_hands', // Піднята рука
  //   'tada', // Подяка, святкування
  //   'pray', // Молитва, дякую
  //   'blush', // Усміхнене обличчя
  //   'thinking_face', // Задуманий, здивований
  //   'sunglasses', // Круто, класно
  //   '+1', // Підтримка, згода
  // ],
  emojis: {
    recent: [
      'flag-ua',
      'grinning', // Сміх
      'heart', // Серце
      'heart_eyes', // Закоханий
      'raised_hands', // Піднята рука
      'tada', // Подяка, святкування
      'pray', // Молитва, дякую
      'blush', // Усміхнене обличчя
      'thinking_face', // Задуманий, здивований
      'sunglasses', // Круто, класно
      '+1', // Підтримка, згода
    ],
    skin: 0,
  },

  initialization: false,
  isChatsFetching: false,
  users: {
    byId: {},
    contactIds: [],
    statusesByUserId: {},
  },
  drafts: {
    byChatId: {},
  },
  messages: {
    byChatId: {},
    idsByChatId: {},
  },

  currentChat: {
    chatId: undefined,
    username: undefined,
    isMessagesLoading: false,
  },
  openedChats: [],
  rightColumn: {
    screen: RightColumnScreens.ChatProfile,
    isOpen: false,
  },
  // chatCreation: {
  //   error: undefined,
  //   isLoading: false
  // },

  chats: {
    byId: {},
    ids: [],
    usernames: {},
    fullById: {},
  },

  blocked: {
    ids: [],
    count: 0,
  },
  globalSearch: {
    known: {},
    global: {},
    isLoading: false,
  },
  activeSessions: {
    byId: {},
    ids: [],
  },

  countryList: [],

  newContact: {
    userId: undefined,
    isByPhoneNumber: false,
  },

  commonModal: {
    title: undefined,
    body: undefined,
    isOpen: false,
  },

  notification: {
    title: undefined,
    isOpen: false,
  },
}
