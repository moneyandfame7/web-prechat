import {createStore} from 'lib/store'

import type {ApiLangCode, ApiLanguage} from 'api/types'
import type {Theme, TransitionsType} from 'types/state'

export interface SettingsState {
  transitions: TransitionsType
  theme: Theme
  messageSendKey: 'enter' | 'ctrlEnter'
  distanceUnit: 'kilometers' | 'miles'
  language: ApiLangCode
  languages?: ApiLanguage[]
  messageTextSize: number
  timeFormat: '12h' | '24h'
  passcode: {
    hasPasscode: boolean
    isScreenLocked: boolean
    isLoading: boolean
  }
}

const initialState: SettingsState = {
  transitions: {
    menuBlur: true,
    pageTransitions: true
  },
  theme: 'light',
  messageSendKey: 'enter',
  distanceUnit: 'kilometers',
  language: 'en',
  messageTextSize: 16,
  timeFormat: '24h',
  passcode: {
    hasPasscode: false,
    isLoading: false,
    isScreenLocked: false
  }
}
export const settingsStore = createStore({
  name: 'settingsStore',
  initialState,
  actionHandlers: {}
})

// const {} = settingsStore.actions
