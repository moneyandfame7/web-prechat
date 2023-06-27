import { GlobalState } from 'types/state'

export const selectLanguage = (state: GlobalState) => state.settings.i18n
