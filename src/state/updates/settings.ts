import lang from 'lib/i18n/lang'
import {storages} from 'state/storages'
import type {SettingsState, SignalGlobalState} from 'types/state'
import {updateByKey} from 'utilities/object/updateByKey'

const initialSettings: SettingsState = {
  animationLevel: 2,
  language: 'en',
  showTranslate: false,
  suggestedLanguage: 'en',
  theme: 'light',
  isCacheSupported: true,
  i18n: {
    lang_code: 'en',
    pack: lang
  },
  passcode: {
    hasPasscode: false,
    isLoading: false,
    isScreenLocked: false
  }
}

export function resetSettingsState(global: SignalGlobalState) {
  updateSettingsState(global, initialSettings)
}

export function updateSettingsState(
  global: SignalGlobalState,
  settings: Partial<SettingsState>
) {
  // if ((settings as any)?.i18n) {
  //   throw new Error('DO NOT PASS i18n IN UPDATER')
  // }

  const {i18n, passcode, ...justToUpdate} = settings

  updateByKey(global.settings, justToUpdate)

  if (i18n) {
    updateByKey(global.settings.i18n.pack, i18n.pack)
  }
  if (passcode) {
    updateByKey(global.settings.passcode, passcode)
  }

  storages.settings.put(settings)
  // if (global.auth.session) {
  // storageManager.state.set({
  // settings: {
  // ...global.settings,
  // ...settings
  // }
  // })
  // }
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
