import {Api} from 'api/manager'
import type {ApiLangCode} from 'api/types'

import {createAction} from 'state/action'
import {selectLanguage} from 'state/selectors/settings'
import {updateSettingsState} from 'state/updates'

/**
 * Working with localization packs
 */
createAction('getLangPack', async (/* state, actions, payload */) => {
  // const pack = await Api.langPack
})

createAction('getLanguages', async (state) => {
  const result = await Api.langPack.getLanguages()
  if (!result) {
    return
  }
  updateSettingsState(state, {
    languages: result, // CHECK IT
  })

  // state
})

createAction('getCountries', async (state, _, payload) => {
  let lang = payload
  if (!payload) {
    lang = selectLanguage(state)
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
