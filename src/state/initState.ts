import lang from 'lib/i18n/lang'

import {AuthScreens} from 'types/screens'
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
    showTranslate: false,
    suggestedLanguage: undefined,
    animationLevel: 2,
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
    },
    transitions: {
      blur: true,
      pageTransitions: true,
    },
  },

  initialization: false,

  users: {
    byId: {},
    contactIds: [],
    statusesByUserId: {},
    usernames: {},
  },

  // chatCreation: {
  //   error: undefined,
  //   isLoading: false
  // },

  chats: {
    byId: {},
    isLoading: true,
    ids: [],
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
