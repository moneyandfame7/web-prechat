import {Api} from 'api/client'
import {createAction} from 'state/action'
import type {ApiLangCode} from 'types/lib'

createAction('getCountries', async (state, _, payload) => {
  let lang = payload
  if (!payload) {
    lang = state.settings.language
  }
  const countries = await Api.langPack.getCountriesList(lang as ApiLangCode)
  if (!countries) {
    return
  }

  state.countryList = [...countries]
  // updateGlobalState({
  //   settings: {
  //     i18n: {
  //       countries
  //     }
  //   }
  // })
})
