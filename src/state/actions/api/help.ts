import {Api} from 'api/client'
import {createAction} from 'state/action'
import {updateGlobalState} from 'state/persist'

/* I18n queries */
createAction('getCountries', async ({settings: {i18n}}, _, payload) => {
  if (i18n.lang_code !== payload) {
    const {data} =
      /*  await callApi('fetchCountries', payload) */ await Api.help.getCountries(payload)

    updateGlobalState({
      settings: {
        i18n: {
          countries: data.countries
        }
      }
    })
  }
})
