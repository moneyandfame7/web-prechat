import { GlobalState } from 'types/state'

export const selectLanguage = (state: GlobalState) => state.settings.language
export const selectLanguageSignal = (state: GlobalState) => state.settings.$language
