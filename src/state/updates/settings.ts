import lang from 'lib/i18n/lang'
import type {SettingsState, SignalGlobalState} from 'types/state'
import {updateByKey} from 'utilities/object/updateByKey'
import {storageManager} from 'lib/idb/manager'

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
  }
}

export function resetSettingsState(global: SignalGlobalState) {
  updateSettingsState(global, initialSettings)
}

export function updateSettingsState(
  global: SignalGlobalState,
  settings: Partial<Omit<SettingsState, 'i18n'>>
) {
  updateByKey(global.settings, settings)

  if (global.auth.session) {
    storageManager.state.set({
      settings: {
        ...global.settings,
        ...settings
      }
    })
  }
}

/* Separate for avoid rerendering???? */
export function updateI18nState(global: SignalGlobalState, i18n: SettingsState['i18n']) {
  updateByKey(global.settings.i18n.pack, i18n.pack)
  global.settings.i18n.lang_code = i18n.lang_code

  if (global.auth.session) {
    storageManager.state.set({
      settings: {
        ...global.settings,
        i18n
      }
    })
  }

  // persistIfCan(global)
}
