import {changeMessageSize, changeTheme, toggleAnimations} from 'state/helpers/settings'
import {storages} from 'state/storages'

import lang from 'lib/i18n/lang'

import {updateByKey} from 'utilities/object/updateByKey'

import type {SettingsState, SignalGlobalState} from 'types/state'

const initialSettings: SettingsState = {
  theme: 'light',
  i18n: {
    lang_code: 'en',
    pack: lang,
  },
  showTranslate: false,
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
}

export function resetSettingsState(global: SignalGlobalState) {
  updateSettingsState(global, initialSettings)
}

export function updateSettingsState(
  global: SignalGlobalState,
  settings: Partial<SettingsState>,
  persist = true
) {
  const {i18n, passcode, ...justToUpdate} = settings

  // if (settings.general?.theme) {
  //   changeTheme(settings.general.theme)
  // }
  // if (settings.general?.animations !== undefined) {
  //   console.log('LALALALAL')
  //   toggleAnimations(settings.general.animations)
  // }

  updateByKey(global.settings, justToUpdate)

  if (i18n) {
    updateByKey(global.settings.i18n, i18n)
  }
  if (passcode) {
    updateByKey(global.settings.passcode, passcode)
  }

  if (persist) {
    storages.settings.put(settings)
  }
}

export function updateGeneralSettings(
  global: SignalGlobalState,
  general: Partial<SettingsState['general']>,
  persist = true
) {
  updateByKey(global.settings.general, general)

  if (persist) {
    storages.settings.put({
      general: {
        ...global.settings.general,
        ...general,
      },
    })
  }
}

export function updatePasscodeState(
  global: SignalGlobalState,
  passcode: Partial<SettingsState['passcode']>
) {
  updateByKey(global.settings.passcode, passcode)
}

/* Separate for avoid rerendering???? */
export function updateI18nState(global: SignalGlobalState, i18n: SettingsState['i18n']) {
  // ТАК МИ ПРИБИРАЄМО РЕРЕНДЕРІНГИ ПРИ ЗМІНІ ПАКУ!
  updateByKey(global.settings.i18n.pack, i18n.pack)
  global.settings.i18n.lang_code = i18n.lang_code

  storages.settings.put({i18n})
  // if (global.auth.session) {
  //   storageManager.state.set({
  //     settings: {
  //       ...global.settings,
  //       i18n
  //     }
  //   })
  // }

  // persistIfCan(global)
}
