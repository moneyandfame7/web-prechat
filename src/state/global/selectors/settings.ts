import { GlobalState } from '../types'

export const selectLanguage = (state: GlobalState) => state.language
export const selectLanguageSignal = (state: GlobalState) => state.$language
