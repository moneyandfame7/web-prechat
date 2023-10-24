import type {SettingsState, SignalGlobalState} from 'types/state'

export const selectLanguage = (state: SignalGlobalState) => state.settings.i18n.lang_code

export const selectSuggestedLanguage = (state: SignalGlobalState) =>
  state.settings.suggestedLanguage

export const selectGeneralSettings = <Key extends keyof SettingsState['general']>(
  state: SignalGlobalState,
  key: Key
): SettingsState['general'][Key] => state.settings.general[key]
