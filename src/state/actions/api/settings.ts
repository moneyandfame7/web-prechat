import deepOmit from 'omit-deep-lodash'

import { callApi } from 'api/provider'
import { createAction } from 'state/action'
import { updateGlobalState } from 'state/persist'

import type { FetchLanguage } from 'types/api'

createAction('getLanguageWithCountries', async ({ settings: { i18n } }, payload) => {
  if (i18n.countries.length && Object.keys(i18n.pack).length) {
    return
  }
  const { data } = await callApi('fetchLanguageWithCountries', payload)

  const newObj = deepOmit(data.language, ['__typename']) as FetchLanguage

  updateGlobalState({
    settings: {
      i18n: {
        countries: newObj.countries,
        lang_code: payload,
        pack: newObj.pack
      }
    }
  })
})

createAction('getCountries', async (state, payload) => {
  if (state.settings.i18n.lang_code !== payload) {
    const { data } = await callApi('fetchCountries', payload)

    updateGlobalState({
      settings: {
        i18n: {
          countries: data.countries
        }
      }
    })
  }
})
