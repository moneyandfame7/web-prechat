import {
  IS_APPLE,
  NOTIFICATION_TRANSITION,
  USER_BROWSER,
  USER_PLATFORM
} from 'common/config'
import {createStore} from 'lib/store'
import type {SettingsScreens} from 'types/screens'
import {deepUpdate} from 'utilities/object/deepUpdate'
import {hydrateStore, stopPersist} from './storages/helpers'
interface UiState {
  notification: {
    isOpen: boolean
    title?: string
  }
  nextSettingsScreen?: SettingsScreens
  isInitialization: boolean
}

const initialState: UiState = {
  notification: {
    isOpen: false
  },
  isInitialization: false
}

function updateNotificationState(state: UiState, notification: UiState['notification']) {
  deepUpdate(state.notification, notification)
}
export const uiStore = createStore({
  initialState,
  name: 'uiStore',
  actionHandlers: {
    init: async (state) => {
      state.isInitialization = true

      await hydrateStore()
      if (USER_PLATFORM === 'macOS') {
        document.documentElement.classList.add('is-mac')
      }
      if (IS_APPLE) {
        document.documentElement.classList.add('is-apple')
      }
      if (USER_BROWSER.startsWith('Safari')) {
        document.documentElement.classList.add('is-safari')
      }

      state.isInitialization = false
    },
    reset: async () => {
      await stopPersist()

      await uiStore.actions.init()
    },
    showNotification: (state, payload: {title: string}) => {
      if (state.notification.title || state.notification.isOpen) {
        return
      }

      updateNotificationState(state, {
        isOpen: true,
        title: payload.title
      })

      setTimeout(() => uiStore.actions.closeNotification())
    },
    closeNotification: (state) => {
      updateNotificationState(state, {
        isOpen: false
      })

      /* to avoid flickering */
      setTimeout(() => {
        state.notification.title = undefined
      }, NOTIFICATION_TRANSITION)
    },
    changeSettingsScreen: (state, payload: SettingsScreens) => {
      state.nextSettingsScreen = payload
    },
    copyToClipboard: (_state, payload: {toCopy: string; title: string}) => {
      const {toCopy, title} = payload
      navigator.clipboard.writeText(toCopy)

      uiStore.actions.showNotification({
        title
      })
    }
  }
})
