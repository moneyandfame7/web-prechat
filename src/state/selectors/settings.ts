import type {SignalGlobalState} from 'types/state'

export const selectLanguage = (state: SignalGlobalState) => state.settings.i18n.lang_code

export const selectSuggestedLanguage = (state: SignalGlobalState) =>
  state.settings.suggestedLanguage
