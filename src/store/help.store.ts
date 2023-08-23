import {createStore} from 'lib/store'
import type {ApiCountry, ApiLangCode} from 'api/types'
import {settingsStore} from './settings.store'
import {Api} from 'api/manager'
export interface HelpState {
  countriesList: ApiCountry[]
}

const initialState: HelpState = {
  countriesList: []
}
export const helpStore = createStore({
  initialState,
  name: 'helpStore',
  actionHandlers: {
    getCountriesList: async (state, payload: {lang: ApiLangCode}) => {
      let lang = payload.lang
      if (!payload) {
        lang = settingsStore.getState().language
      }

      const countries = await Api.langPack.getCountriesList(lang as ApiLangCode)
      if (!countries) {
        return
      }

      state.countriesList = [...countries]
    }
  }
})
